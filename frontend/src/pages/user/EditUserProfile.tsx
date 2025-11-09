import React, { useState } from "react";
import axiosInstance from "@/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { updateProfile } from "@/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function EditProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("the user in the edit  profile is",user);
  e.preventDefault();
  if (!user?.userId) {
    setError("User not logged in");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");
  
  try {
    const response = await axiosInstance.put(`/user/edit/${user.userId}`, formData);
    const updatedUser = response.data.data;

    dispatch(updateProfile(updatedUser));
    setSuccess("Profile updated successfully!");
  } catch (err: any) {
    setError(err.response?.data?.message || "Error updating profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label className="block font-medium">Bio</label>
          <Textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
