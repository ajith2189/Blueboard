import express,{ Request, Response }  from "express";
import { editProfile } from "../controllers/userController.js";
const userRoutes = express.Router();

userRoutes.put("/edit/:userId", editProfile);


export default userRoutes;
