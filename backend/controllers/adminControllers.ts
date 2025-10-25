import { loadavg } from "os";
import User from "../model/userModel.js";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  console.log("get all users called");

  try {
    //----------------------Pagination logic------------------------
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role || "user";
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

const filter: any = {
  ...(role && { role }),
  ...(search && {
    $or: [
      { name: { $regex: search, $options: "i" } }, // "AJI" matches "AJITH", "RajaJITH"
      { email: { $regex: search, $options: "i" } },
    ],
  }),
};



    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional sorting

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
