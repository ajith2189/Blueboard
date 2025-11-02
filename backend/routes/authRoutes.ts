import express from "express";
import { userRegister, verifyOtp, userLogin, adminLogin,googleSignUp, resetPassword, requestPasswordResetOtp, verifyResetOtpController } from "../controllers/authControllers.js";
// this middleware is validating the name, email, password 
import validatingUserMiddleware from "../middlewares/validatingUserMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", validatingUserMiddleware, userRegister);
authRoutes.post("/verify-otp",verifyOtp);
authRoutes.post("/login", userLogin);
authRoutes.post("/google", googleSignUp);

//////////////////////////resetPassword//////////////////////////
authRoutes.post("/forgot-password-otp", requestPasswordResetOtp);
authRoutes.post("/verify-reset-otp", verifyResetOtpController);
authRoutes.post("/reset-password", resetPassword);

authRoutes.post("/admin/login", adminLogin);

export default authRoutes;
