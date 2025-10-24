import express from "express";
import { getAllTutors, getAllUsers } from "../controllers/adminControllers.js";
// this middleware is validating the name, email, password 

const AdminRoutes = express.Router();
AdminRoutes.get("/user", getAllUsers);
AdminRoutes.get("/tutor", getAllTutors);

export default AdminRoutes;
