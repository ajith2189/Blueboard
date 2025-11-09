
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redis } from "../utils/redis.js";

export function generateOtp(length = 6) {
  console.log("otp generating");
  
  // 6-digit numeric
  return crypto.randomInt(0, 1_000_000).toString().padStart(length, "0");
}

const SIGNUP_KEY = (email: string) => `signup:${email.toLowerCase()}`;

type PendingSignup = {
  otpHash: string;
  name: string;
  email: string;
  role?: string;
  passwordHash: string;
  attemptsLeft: number;  // e.g., 5
  resentCount: number;   // e.g., max 3
  lastSentAt: number;    // throttle resends (e.g., 30s)
};

export async function putPendingSignup(
  data: { name: string; email: string; passwordHash: string; otp: string, role?:string }
) {
  const otpHash = await bcrypt.hash(data.otp, 10);
  const record: PendingSignup = {
    otpHash,
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    passwordHash: data.passwordHash,
    attemptsLeft: 5,
    resentCount: 0,
    lastSentAt: Date.now(),
  };
  await redis.set(SIGNUP_KEY(record.email), JSON.stringify(record), { EX: 600 }); // 10 min
}

export async function getPendingSignup(email: string): Promise<PendingSignup | null> {
  const raw = await redis.get(SIGNUP_KEY(email));
  return raw ? (JSON.parse(raw) as PendingSignup) : null;
}

export async function updatePendingSignup(email: string, update: Partial<PendingSignup>) {
  const key = SIGNUP_KEY(email);
  const current = await getPendingSignup(email);
  if (!current) return null;
  const next = { ...current, ...update };
  const ttl = await redis.ttl(key);
  await redis.set(key, JSON.stringify(next), { EX: ttl > 0 ? ttl : 600 });
  return next as PendingSignup;
}

export async function deletePendingSignup(email: string) {
  await redis.del(SIGNUP_KEY(email));
}

export async function verifyOtpAgainstPending(email: string, otp: string) {
  const rec = await getPendingSignup(email.toLowerCase());
  if (!rec) return { ok: false, reason: "expired_or_missing" };

  if (rec.attemptsLeft <= 0) return { ok: false, reason: "too_many_attempts" };

  const match = await bcrypt.compare(otp, rec.otpHash);
  if (!match) {
    const remaining = rec.attemptsLeft - 1;
    await updatePendingSignup(email, { attemptsLeft: remaining });
    return { ok: false, reason: "invalid_code", attemptsLeft: remaining };
  }
  return { ok: true, rec };
}


///reset password otp functions///////////////////////////////////////////////////////////////////////////

// --- ADD THE FOLLOWING NEW CODE ---

// 1. New Key Prefix
const RESET_KEY = (email: string) => `reset-otp:${email.toLowerCase()}`;

// 2. New Type (simpler, no user data to store)
type PendingReset = {
  otpHash: string;
  attemptsLeft: number;
  resentCount: number;
  lastSentAt: number;
};

// 3. New 'put' function for reset
export async function putPendingReset(email: string, otp: string) {
  const otpHash = await bcrypt.hash(otp, 10);
  const record: PendingReset = {
    otpHash,
    attemptsLeft: 5,
    resentCount: 0,
    lastSentAt: Date.now(),
  };
  // Use a 10 min expiry, just like your signup
  await redis.set(RESET_KEY(email), JSON.stringify(record), { EX: 600 });
}

// 4. New 'get' function for reset
export async function getPendingReset(email: string): Promise<PendingReset | null> {
  const raw = await redis.get(RESET_KEY(email));
  return raw ? (JSON.parse(raw) as PendingReset) : null;
}

// 5. New 'update' function for reset
export async function updatePendingReset(email: string, update: Partial<PendingReset>) {
  const key = RESET_KEY(email);
  const current = await getPendingReset(email);
  if (!current) return null;
  const next = { ...current, ...update };
  const ttl = await redis.ttl(key);
  await redis.set(key, JSON.stringify(next), { EX: ttl > 0 ? ttl : 600 });
  return next as PendingReset;
}

// 6. New 'delete' function for reset
export async function deletePendingReset(email: string) {
  await redis.del(RESET_KEY(email));
}

// 7. New 'verify' function for reset
export async function verifyResetOtp(email: string, otp: string) {
  const rec = await getPendingReset(email.toLowerCase());
  if (!rec) return { ok: false, reason: "expired_or_missing" };

  if (rec.attemptsLeft <= 0) return { ok: false, reason: "too_many_attempts" };

  const match = await bcrypt.compare(otp, rec.otpHash);
  if (!match) {
    const remaining = rec.attemptsLeft - 1;
    await updatePendingReset(email, { attemptsLeft: remaining });
    return { ok: false, reason: "invalid_code", attemptsLeft: remaining };
  }
  
  // Success!
  return { ok: true };
}
