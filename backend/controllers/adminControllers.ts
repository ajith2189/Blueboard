import { Request, Response } from "express";
import User from "../model/userModel.js";
import Category from "../model/categoryModel.js"; // adjust path as needed
import { runInNewContext } from "vm";

//---------------------getAllUsers ---------------------------------------
export const getAllUsers = async (req: Request, res: Response) => {
  console.log("get all users called");

  try {
    const { page = 1, limit = 10, role = "user", search } = req.query;
    const query: any = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, totalItems] = await Promise.all([
      User.find(query).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
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
//----------------------------blockUser------------------------
export const blockUser = async (req: Request, res: Response) => {
  console.log("block user controller");
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      [{ $set: { is_blocked: { $not: "$is_blocked" } } }],
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to block user", error: err });
  }
};
// ---------------- Get all categories ----------------
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, totalItems] = await Promise.all([
      Category.find(query)
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Category.countDocuments(query),
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
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
// ---------------- Add new category ----------------
export const addCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    // Check for existing category
    const existing = await Category.findOne({ name: name });
    if (existing) {
      return res.status(409).json({ message: "Category already exists." });
    }

    // Create new category
    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
    });

    await category.save();

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating category",
      error,
    });
  }
};
// --------------------------updateCategory-------------------------
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id: categoryId } = req.params;
    const { name, description } = req.body;

    // Validate input
    if (!name && !description) {
      return res.status(400).json({ message: "No update fields provided." });
    }

    //  Find category
    const category = await Category.findOne({ category_id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    //  Apply only provided updates
    if (name?.trim()) category.name = name.trim();
    if (description?.trim()) category.description = description.trim();

    //  Save updated category
    await category.save();

    //  Return updated record
    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      message: "Server error while updating category",
      error: (error as Error).message,
    });
  }
};
// --------------------------delete User -------------------------
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id: categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    const category = await Category.findOne({ category_id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await Category.deleteOne({ category_id: categoryId });

    return res.status(200).json({
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
      deletedCategoryId: categoryId,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting category.",
      error: (error as Error).message,
    });
  }
};
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id: categoryId } = req.params;
    const category = await Category.findOne({ category_id: categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return res.status(500).json({
      message: "Server error while fetching category.",
      error: (error as Error).message,
    });
  }
};
