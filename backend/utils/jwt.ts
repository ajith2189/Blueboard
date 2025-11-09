// utils/token.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;


//-----------------------------------------------------
export const generateToken = (
  userId: string,
  userRole?: string,
  purpose: "access" | "refresh" | "reset" | "verify" = "access",
  expiresIn?: string
) => {
  const secret =
    purpose === "refresh"
      ? REFRESH_SECRET
      : ACCESS_SECRET; // use access secret for all others

  const defaultExpiry =
    purpose === "refresh"
      ? "7d"
      : purpose === "reset"
      ? "15m"
      : purpose === "verify"
      ? "1h"
      : "15m";

  const payload: Record<string, any> = {
    sub: userId,
    purpose,
  };

  if (userRole) payload.role = userRole;

  return jwt.sign(payload, Buffer.from(secret), {
    expiresIn: expiresIn || defaultExpiry,
    issuer: "BlueBoard",
    audience: "my-frontend",
  });
};

/* -----------------------------------------------------
 * 🔹 Verify Token
 * ---------------------------------------------------*/
export const verifyToken = (token: string, expectedPurpose?: string) => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as any;

    if (expectedPurpose && decoded.purpose !== expectedPurpose) {
      throw new Error("Token purpose mismatch");
    }

    return decoded; // contains sub (userId), purpose, role (if any)
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};


export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};