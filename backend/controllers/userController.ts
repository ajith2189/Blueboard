import { Request, Response } from "express";
import User from "../model/userModel.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { userId: userId } = req.params;
    const { name, email, bio } = req.body;
    console.log("the edit profile recieves", userId, name, email, bio);

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
    if (bio) user.about = bio;

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


const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fileType } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const key = `profile-images/${userId}-${Date.now()}.${(fileType as string)?.split("/")[1] || "jpg"}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType as string,
    });

    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return res.status(200).json({
      message: "Presigned URL generated successfully",
      data: { uploadURL, key },
    });
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({
      message: "Failed to generate presigned URL",
      error: error.message || "Internal Server Error",
    });
  }
};