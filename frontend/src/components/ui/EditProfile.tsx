import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios";
// import { updateUser } from "../../features/users/usersSlice";
import Navbar from "../navbar/Navbar";
// import UploadImage from "./UploadImage";
import { toast } from "sonner";
import noProfile from "../../assets/noprofile.png";
import { FiCamera } from "react-icons/fi";
import { updateProfile } from "../../features/auth/authSlice";

export default function EditUserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const fileInputRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({});

  const [tempImage, setTempImage] = useState({
    imageUrl: "",
    image: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // handle input change for name/email
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   If you have a hidden <input type="file" />, you can't click it directly (e.g. it's visually hidden).
  // So instead, you make a visible button or icon, and simulate a click on the hidden input using a ref.
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTempImage({
        ...tempImage,
        image: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, name } = formData;
    let validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name Cannot be Empty";
    }

    if (!email.trim()) {
      validationErrors.email = "Email Cannot be Empty";
    } else if (
      !email.includes("@") ||
      !email.includes(".") ||
      /[^a-zA-Z0-9@.]/.test(email)
    ) {
      validationErrors.email = "Invalid Email Address";
    }

    if (Object.keys(validationErrors).length > 0) {
      setValidationError(validationErrors);
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = user?.profileImage;

      //image upload to cloudinary part
      if (tempImage.image) {
        const cloudForm = new FormData();
        cloudForm.append("file", tempImage.image);
        cloudForm.append("upload_preset", "userManagement");

        console.log("Uploading image to Cloudinary...");

        // Upload to Cloudinary
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dlgrbt3t2/image/upload",
          {
            method: "POST",
            body: cloudForm,
          }
        );

        const uploadImage = await res.json();
        imageUrl = uploadImage.secure_url;

        console.log("Image uploaded successfully:", imageUrl);
      }

      const updateData = {
        id: user?._id,
        ...formData,
        profileImage: imageUrl,
      };

      const response = await axiosInstance.patch(
        "/user/edit-profile",
        updateData
      );
      dispatch(updateProfile(response.data.user)); // fixed

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error.response?.data);
      //setError("Failed to update profile. Please try again.");
      setError(error.response?.data.message);

    } finally {
      setLoading(false);
      setValidationError({})
    }
  };

  return (
    <>
      <Navbar name={user?.name} imageUrl={user?.profileImage} />
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <p className="text-gray-500 text-sm">Update your personal details</p>
        </div>

        {/* photo upload part */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative group w-24 h-24 cursor-pointer"
            onClick={handleImageClick}
          >
            {/* Profile image - shows local imageUrl first, then user.profileImage, then default */}
            <img
              src={tempImage.imageUrl || user?.profileImage || noProfile}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />

            {/* Hover overlay text */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Edit Profile
            </div>

            {/* Camera icon bottom-right */}
            <div className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow-sm">
              <FiCamera className="text-gray-600 text-sm" />
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        {/* end of photo upload */}

        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <span className="text-red-600 block text-sm mb-1 font-medium">
              {validationError.name}
            </span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {error && (
          <span className="text-center text-red-500 text-sm mb-4">{error}</span>
        )}
            <span className="text-red-600 block text-sm mb-1 font-medium">
              {validationError.email}
            </span>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
