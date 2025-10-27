import express from "express";
import { getAllUsers, blockUser, createCategory, getAllCategories, updateCategory,deleteCategory } from "../controllers/adminControllers.js";
// this middleware is validating the name, email, password 

const AdminRoutes = express.Router();

AdminRoutes.get("/users", getAllUsers);
AdminRoutes.patch("/users/:id/block", blockUser);

//categories
AdminRoutes.get("/categories", getAllCategories);
AdminRoutes.post("/categories", createCategory);

AdminRoutes.put("/categories/:id", updateCategory);
AdminRoutes.delete("/categories/:id", deleteCategory);

// AdminRoutes.get("/categories/:id", getCategoryById);



export default AdminRoutes;
