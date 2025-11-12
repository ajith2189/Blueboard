import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../model/userModel.js";
import {
  generateOtp,
  putPendingSignup,
  verifyOtpAgainstPending,
  deletePendingSignup,
  getPendingSignup,
  updatePendingSignup,
  verifyResetOtp,
  deletePendingReset,
  getPendingReset,
  putPendingReset,
} from "../services/otp.service.js";
import { sendPasswordResetOtp, sendSignupOtp } from "../utils/email.js";
import { OAuth2Client } from "google-auth-library";
import {
  generateToken,
  verifyToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { string } from "joi";

//----------------------------------REGISTER--------------------------------------------
const maskEmail = (email: string) => {
  const [u, d] = email.split("@");
  return `${u[0]}***@${d[0]}***${d.slice(-2)}`;
};

export const userRegister = async (req: Request, res: Response) => {
  console.log("user register called");

  try {
    const { name, email, password, role } = req.body;
    // .lean will help to search without updating or saving data which is much faster
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }
    //hashing the password
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    console.log("the otp is", otp);

    // saving the data temporary in redis for otp verification
    await putPendingSignup({ name, email, passwordHash, otp, role });
    await sendSignupOtp(email, otp);

    return res.status(202).json({
      message:
        "OTP sent to your email. Complete verification to finish signup.",
      emailMasked: maskEmail(email),
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------------------Google register -----------------------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignUp = async (req: Request, res: Response) => {
  const { credential, role } = req.body;

  try {
    // ✅ Verify ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, sub: googleId, name, picture } = payload;

    // ✅ Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        picture,
        role,
        createdAt: new Date(),
      });
      await user.save();
    } else if (!user.googleId) {
      // Link existing account
      user.googleId = googleId;
      await user.save();
    }

    // ✅ Issue tokens
    const accessToken = generateToken(user._id.toString(), user.role);
    const refreshToken = generateToken(user._id.toString(), "refresh");

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        //picture: user.profile_picture_url,
      },
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

//------------------------------------------OTP Verification ------------------------------------------
const verifySchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const verifyOtp = async (req: Request, res: Response) => {
  console.log("Verifying otp called");

  //safeParse(req.body) = tries to validate the incoming request body against that schema.
  const parse = verifySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });

  const { email, otp } = parse.data;
  // console.log("the eamil and otp form the verify otp is ", email, otp);
  const result = await verifyOtpAgainstPending(email, otp);
  console.log("result form the redis is ", result);

  if (!result.ok) {
    if (result.reason === "invalid_code")
      return res
        .status(400)
        .json({ error: "Invalid code", attemptsLeft: result.attemptsLeft });
    if (result.reason === "too_many_attempts")
      return res
        .status(429)
        .json({ error: "Too many attempts. Request a new code." });
    return res
      .status(410)
      .json({ error: "Code expired. Please register again." });
  }
  // learn about the "!" mark
  // the "!" mark is used to assert that a value is not null or undefined for TS
  const rec = result.rec!;
  const newUser = await User.create({
    name: rec.name,
    email: rec.email,
    password: rec.passwordHash,
    role: rec.role || "user",
    emailVerified: true,
  });

  await deletePendingSignup(email);

  return res
    .status(201)
    .json({ message: "Email verified. Account created.", userId: newUser._id });
};

//-----------------------------RESEND-OTP-----------------------------------------------------
const resendSchema = z.object({ email: z.email() });

export const resendOtp = async (req: Request, res: Response) => {
  const parse = resendSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });

  const email = parse.data.email.toLowerCase();
  const rec = await getPendingSignup(email);
  if (!rec)
    return res.status(404).json({ error: "No pending signup for this email." });

  if (rec.resentCount >= 3)
    return res.status(429).json({ error: "Resend limit reached." });
  if (Date.now() - rec.lastSentAt < 30_000)
    return res.status(429).json({ error: "Please wait before resending." });

  const nextOtp = generateOtp();
  const nextHash = await bcrypt.hash(nextOtp, 10);

  await updatePendingSignup(email, {
    otpHash: nextHash,
    attemptsLeft: 5, // reset attempts
    resentCount: rec.resentCount + 1,
    lastSentAt: Date.now(),
  });

  await sendSignupOtp(email, nextOtp);
  return res.status(200).json({ message: "A new OTP has been sent." });
};

//--------------------------------------User Login------------------------------------------
// in this schema it will check for valid email and password inculding does it contains emojes
const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const userLogin = async (req: Request, res: Response) => {
  try {
    const parse = LoginSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: "Invalid input" });
    const { email, password } = parse.data;
    console.log("Parsed login data:", { email, password });

    //checking user do exist
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("User found:", user);

    //validating the password
    const isValid = !!(await bcrypt.compare(password, user.password ?? ""));
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    console.log("login successful");

    const refreshToken = generateToken(user._id.toString(), "refresh");

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // required for cross-site cookies (e.g., if frontend is on another port/domain)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    // Generate JWT accessToken for the new user
    const accessToken = generateToken(user._id.toString(), user.role);
    console.log("🔑 JWT accessToken generated:", accessToken);

    // Send response with user data (excluding password)
    return res.status(200).json({
      message: "User Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });

    

    
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({
      error: "Server error during user login",
      details: (error as Error).message,
    });
  }
};
//--------------------------------------Admin Login------------------------------------------
// in this schema it will check for valid email and password inculding does it contains emojes
export const adminLogin = async (req: Request, res: Response) => {
  // console.log("User login attempt:", req.body);

  const parse = LoginSchema.safeParse(req.body);

  if (!parse.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password } = parse.data;
  console.log("Parsed login data:", { email, password });

  //checking user do exist
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!user) return res.status(404).json({ error: "User not found" });
  console.log("User found:", user);

  //validating the password
  //converting the password to a boolean
  // '' is used when the lean method in mongo may return an object and it may null or undefined
  const isValid = !!(await bcrypt.compare(password, user.password ?? ""));
  if (!isValid) return res.status(401).json({ error: "Invalid password" });

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  console.log(" Admin login successful");

  const refreshToken = generateToken(user._id.toString(), "refresh");

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // required for cross-site cookies (e.g., if frontend is on another port/domain)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
  });

  // Generate JWT accessToken for the new user
  const accessToken = generateToken(user._id.toString(), user.role);
  console.log("🔑 JWT accessToken generated:", accessToken);

  // Send response with user data (excluding password)
  return res.status(201).json({
    message: "admin Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
};

//--------------------------------------reset Password------------------------------------------

//-----------------------------VERIFY OTP AND RESET PASSWORD----------------------------------

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

export const requestPasswordResetOtp = async (req: Request, res: Response) => {
  // 1. Validate the email
  const parse = forgotPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  const { email } = parse.data;

  try {
    // 2. Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() }).lean();

    // 3. IMPORTANT: Always send a 200 OK response for security
    // This prevents attackers from guessing which emails are registered.
    if (!user) {
      console.log(`Password reset OTP attempt for non-existent user: ${email}`);
      return res.status(200).json({
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    // 4. (Security) Check for recent resends to prevent spam
    const pending = await getPendingReset(email); // From otp.service.js
    if (pending && Date.now() - pending.lastSentAt < 30_000) {
      // 30s throttle
      return res.status(429).json({ error: "Please wait before resending." });
    }

    // 5. Generate and store the OTP
    const otp = generateOtp(); // Your existing function
    await putPendingReset(email, otp); // Your new function from otp.service.js

    // 6. Send the email
    await sendPasswordResetOtp(email, otp); // Your new function from email.js

    return res.status(200).json({
      message: "If an account with this email exists, an OTP has been sent.",
    });
  } catch (err) {
    console.error("Forgot Password OTP Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyResetSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const verifyResetOtpController = async (req: Request, res: Response) => {
  console.log("Verifying password reset OTP called");

  // 1️⃣ Validate input
  const parse = verifyResetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, otp } = parse.data;

  try {
    // 2️⃣ Verify OTP from Redis
    const result = await verifyResetOtp(email, otp);
    console.log("Result from Redis for password reset verification:", result);

    if (!result.ok) {
      if (result.reason === "invalid_code") {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      if (result.reason === "too_many_attempts") {
        return res.status(429).json({
          error: "Too many attempts. Please request a new OTP.",
        });
      }
      // expired_or_missing
      return res.status(410).json({
        error: "OTP expired or invalid. Please request a new one.",
      });
    }

    // 3️⃣ OTP is valid — optionally delete it if you don’t want reuse
    await deletePendingReset(email);

    const resetToken = generateToken(email, "reset");

    // 4️⃣ Send success response
    return res.status(200).json({
      resetToken,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (err) {
    console.error("Password reset OTP verification error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const resetPassword = async (req: Request, res: Response) => {
  // 1️⃣ Validate input
  const parse = resetPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parse.error });
  }

  const { resetToken, password } = parse.data;

  try {
    // 2️⃣ Verify the reset token
    const decoded = verifyToken(resetToken, "reset");
    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
      return res.status(401).json({ error: "Invalid or expired reset token" });
    }

    const email = decoded.sub as string;

    // 3️⃣ Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 4️⃣ Hash and update the password
    const passwordHash = await bcrypt.hash(password, 12);
    user.password = passwordHash;
    await user.save();

    // 5️⃣ Respond with success
    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateToken(decoded.userId, decoded.userRole);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token failed:", error.message);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const tutorLogin = async (req: Request, res: Response) => {
  console.log("tutor login called");
  try {
    //  Validate input
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid input" });

    const { email, password } = parse.data;
    console.log("Parsed tutor login data:", { email, password });

    //  Check if tutor exists
    const tutor = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!tutor) return res.status(404).json({ error: "Tutor not found" });

    if (tutor.role !== "tutor") {
      return res.status(403).json({ error: "Access denied not a tutor" });
    }
    // Validate password
    const isValid = await bcrypt.compare(password, tutor.password ?? "");
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    console.log("Tutor login successful");

    const refreshToken = generateToken(tutor._id.toString(), "refresh");

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const accessToken = generateToken(tutor._id.toString(), tutor.role);
    console.log(" JWT accessToken generated for tutor:", accessToken);

    // Send response (exclude password)
    return res.status(200).json({
      message: "Tutor logged in successfully",
      user: {
        _id: tutor._id,
        name: tutor.name,
        email: tutor.email,
        role: tutor.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Error during tutor login:", error);
    return res.status(500).json({
      error: "Server error during tutor login",
      details: (error as Error).message,
    });
  }
};
