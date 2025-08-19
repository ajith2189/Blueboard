import mongoose from "mongoose";
import { text } from "stream/consumers";

const userSchema = new mongoose.Schema(
  {
    // user_id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { 
        type: String, 
        required: true, 
        default: "user" 
    },
    profile_picture_url: {
      type: String,
      // required: true,
    },
    about: {
      type: String,
      //required: true,
      default: null,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    // created_at: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updated_at: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    //without timestamp it needed to done manually and error prone
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
