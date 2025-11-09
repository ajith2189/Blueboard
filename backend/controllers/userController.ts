import { Request, Response } from "express";
import User from "../model/userModel.js";

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { userId: userId } = req.params;
    const { name, email, bio } = req.body;
    console.log("the edit profile recieves",userId, name, email, bio);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optional: Check for duplicate email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    await user.save();

    const { password, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Error editing profile:", error);
    return res.status(500).json({
      message: "Server error while editing profile",
      error: (error as Error).message,
    });
  }
};
