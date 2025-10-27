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
} from "../services/otp.service.js";
import { sendSignupOtp } from "../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

//----------------------------------REGISTER--------------------------------------------
const maskEmail = (email: string) => {
  const [u, d] = email.split("@");
  return `${u[0]}***@${d[0]}***${d.slice(-2)}`;
};

export const userRegister = async (req: Request, res: Response) => {
  console.log("user register called");
  
  try {
    const { name, email, password,  } = req.body;
    // .lean will help to search without updating or saving data which is much faster
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }
    //hashing the password
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    console.log("the otp is", otp);

    // saving the data temporary in redis for otp verification
    await putPendingSignup({ name, email, passwordHash, otp });
    await sendSignupOtp(email, otp);

    return res.status(202).json({
      message:
        "OTP sent to your email. Complete verification to finish signup.",
      emailMasked: maskEmail(email),
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// ----------------------------------------Google register -----------------------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignUp = async (req: Request, res: Response) => {
  const { credential } = req.body;

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
        role: "user",
        createdAt: new Date(),
      });
      await user.save();
    } else if (!user.googleId) {
      // Link existing account
      user.googleId = googleId;
      await user.save();
    }

    // ✅ Issue tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

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
  const result = await verifyOtpAgainstPending(email, otp);

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
    emailVerified: true,
  });

  await deletePendingSignup(email);

  return res
    .status(201)
    .json({ message: "Email verified. Account created.", userId: newUser._id,

     });
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
//Login schema
// in this schema it will check for valid email and password inculding does it contains emojes
const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const userLogin = async (req: Request, res: Response) => {
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
  const isValid = !!await bcrypt.compare(password, user.password ?? '');
  if (!isValid) return res.status(401).json({ error: "Invalid password" });


console.log("login successful");

    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // required for cross-site cookies (e.g., if frontend is on another port/domain)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    // Generate JWT accessToken for the new user
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    console.log("🔑 JWT accessToken generated:", accessToken);

    // Send response with user data (excluding password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
};


//--------------------------------------Admin Login------------------------------------------
//Login schema
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
  const isValid = !!await bcrypt.compare(password, user.password ?? '');
  if (!isValid) return res.status(401).json({ error: "Invalid password" });

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

console.log(" Admin login successful");

   const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // required for cross-site cookies (e.g., if frontend is on another port/domain)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    // Generate JWT accessToken for the new user
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    console.log("🔑 JWT accessToken generated:", accessToken);

    // Send response with user data (excluding password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
};

