import express,{ Request, Response }  from "express";
import { userRegister } from "../controllers/authControllers.js";
const userRoutes = express.Router();

userRoutes.post("/register", userRegister);

// this need to written
// userRoutes.post("/login", (req:Request, res:Response) => {
//     res.status(200).json({ message: "User logged in" });
// });

export default userRoutes;
