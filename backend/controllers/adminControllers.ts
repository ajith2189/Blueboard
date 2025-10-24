import { loadavg } from "os";
import User from "../model/userModel.js";
import { Request, Response } from "express";

 export const getAllUsers = async (req: Request, res: Response) => {
    console.log("get all users called");
    
  try {
  //----------------------Pagination logic------------------------
// the parseInt will convert the query parameters (default as string) to integers
  const page = parseInt(req.query.page as string) || 1; // Current page number, default to 1 if not provided
  const limit = parseInt(req.query.limit as string) || 10; // Number of users per page, default to 10 if not provided
  const skip = (page - 1) * limit; // Calculate the number of users to skip

    const users = await User.find({ role: "user" }).skip(skip).limit(limit);
    res.json(users);

    
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 export const getAllTutors = async (req: Request, res: Response) => {
    console.log("get all tutors called");
  try {
    const users = await User.find({ role: "tutor" });
    console.log("Fetched tutor details:");
    res.json(users);
  } catch (error) {
    console.error("Error fetching tutor details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


