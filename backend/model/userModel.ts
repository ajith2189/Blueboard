import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    googleId: {
      type: String,
      default: null,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    //without timestamp it needed to done manually and error prone
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
