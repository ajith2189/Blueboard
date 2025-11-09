// utils/token.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// 🔐 Generate Access Token (Short-lived)
export const generateToken = (userID : string, userRole? : string, purpose? : string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  }
  return jwt.sign(
  {
    sub: userID,
    role: userRole,
    purpose: purpose || "general",
  },
  secret,
  { expiresIn: "15m", issuer: "BlueBoard", audience: "my-frontend" }
);
};

// 🔄 Generate Refresh Token (Long-lived)
export const generateRefreshToken = (userID : string) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
  }

  return jwt.sign(
  { sub: userID },
  secret,
  { expiresIn: "7d", issuer: "BlueBoard" }
);

};


