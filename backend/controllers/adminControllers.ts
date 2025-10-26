import { Request, Response } from "express";
import User from "../model/userModel.js";

export const getAllUsers = async (req: Request, res: Response) => {
  console.log("get all users called");

  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query: any = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // ✅ Sort by createdAt descending (latest first)
    // const sortOption : object = ;

    const [data, totalItems] = await Promise.all([
      User.find(query)
      .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        ,
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / Number(limit));

    res.json({
      data,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
