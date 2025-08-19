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

const maskEmail = (email: string) => {
  const [u, d] = email.split("@");
  return `${u[0]}***@${d[0]}***${d.slice(-2)}`;
};


const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  // the email schema has changed in the newest schema of zod
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});


export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
// .lean will help to search without updating or saving data which is much faster
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }
    //hashing the password
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    console.log("the otp is",otp);
    
// saving the data temporary in redis for otp verification
    await putPendingSignup({ name, email, passwordHash, otp });
    await sendSignupOtp(email, otp);

    return res.status(202).json({
      message: "OTP sent to your email. Complete verification to finish signup.",
      emailMasked: maskEmail(email),
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const verifySchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const verifyOtp = async (req: Request, res: Response) => {
  const parse = verifySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });

  const { email, otp } = parse.data;
  const result = await verifyOtpAgainstPending(email, otp);

  if (!result.ok) {
    if (result.reason === "invalid_code")
      return res.status(400).json({ error: "Invalid code", attemptsLeft: result.attemptsLeft });
    if (result.reason === "too_many_attempts")
      return res.status(429).json({ error: "Too many attempts. Request a new code." });
    return res.status(410).json({ error: "Code expired. Please register again." });
  }

  const rec = result.rec!;
  const newUser = await User.create({
    name: rec.name,
    email: rec.email,
    password: rec.passwordHash,
    emailVerified: true,
  });

  await deletePendingSignup(email);

  return res.status(201).json({ message: "Email verified. Account created.", userId: newUser._id });
};

const resendSchema = z.object({ email: z.string().email() });

export const resendOtp = async (req: Request, res: Response) => {
  const parse = resendSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });

  const email = parse.data.email.toLowerCase();
  const rec = await getPendingSignup(email);
  if (!rec) return res.status(404).json({ error: "No pending signup for this email." });

  if (rec.resentCount >= 3) return res.status(429).json({ error: "Resend limit reached." });
  if (Date.now() - rec.lastSentAt < 30_000) return res.status(429).json({ error: "Please wait before resending." });

  const nextOtp = generateOtp();
  const nextHash = await bcrypt.hash(nextOtp, 10);

  await updatePendingSignup(email, {
    otpHash: nextHash,
    attemptsLeft: 5,           // reset attempts
    resentCount: rec.resentCount + 1,
    lastSentAt: Date.now(),
  });

  await sendSignupOtp(email, nextOtp);
  return res.status(200).json({ message: "A new OTP has been sent." });
};
