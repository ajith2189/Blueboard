import express,{ Request, Response }  from "express";
import { editProfile, uploadImage } from "../controllers/userController.js";
const userRoutes = express.Router();

userRoutes.patch("/edit/:userId", editProfile);
userRoutes.get("/get-presigned-url/:userId", uploadImage);
// userRoutes.patch

export default userRoutes;
