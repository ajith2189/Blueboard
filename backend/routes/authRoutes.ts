import express from "express";
import { userRegister, verifyOtp } from "../controllers/authControllers.js";
// this middleware is validating the name, email, password 
import validatingUserMiddleware from "../middlewares/validatingUserMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", validatingUserMiddleware, userRegister);
authRoutes.post("/verify-otp",verifyOtp);

export default authRoutes;
