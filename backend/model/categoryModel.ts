import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  category_id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
const Category = new Schema<ICategory>(
  {
    category_id: {
      type: String,
      default: uuidv4, 
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", Category);
