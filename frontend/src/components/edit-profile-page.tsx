import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save } from "lucide-react";
import noProfilePic from "../../public/diverse-user-avatars.png";
import { toast } from "sonner";

import { getPreSignedUrlApi, updateProfileApi } from "@/api/userApi";
import uploadToS3 from "@/utils/uploadToS3";
import { updateProfile } from "@/features/authSlice";
import type { User } from "@/api/adminApi";

export default function EditProfilePage() {
  const dispatch = useDispatch();

  const user = useSelector((state: User) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState({
    userId: user._id,
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    profile_picture_url: user?.profile_picture_url || noProfilePic,
  });

  const [tempImage, setTempImage] = useState<{
    file: File | null;
    localPreview: string | null;
  }>({
    file: null,
    localPreview: null,
  });

  // -------------------- IMAGE HANDLING --------------------
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTempImage({
      file,
      localPreview: URL.createObjectURL(file),
    });
  };

  // -------------------- FORM INPUT HANDLING --------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- SAVE PROFILE --------------------
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const { name, about, userId } = profileData;

      if (!name.trim()) {
        toast.error("Name cannot be empty");
        return;
      }

      // Step 1: Upload image if selected
      let uploadedImageKey = null;

      if (tempImage.file) {
        const preSignRes = await getPreSignedUrlApi(
          userId,
          tempImage.file.type
        );
        const { uploadURL, key } = preSignRes.data;

        const uploadResult = await uploadToS3(tempImage.file, uploadURL);
        if (!uploadResult.ok) throw new Error("S3 upload failed");

        uploadedImageKey = key;
      }

      // Step 2: Prepare profile update payload
      const updateData: any = {
        name,
        about,
      };

      if (uploadedImageKey) {
        updateData.profile_picture_url = uploadedImageKey;
      }

      // Step 3: Send update request
      const updatedResponse = await updateProfileApi(updateData, userId);

      console.log("SERVER UPDATE RESPONSE →", updatedResponse.data.data);

      // Step 4: Update Redux store
      dispatch(updateProfile(updatedResponse.data.data));

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          {/* <button className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button> */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground mt-1">
              Update your learning profile and preferences
            </p>
          </div>
        </div>

        {/* Profile Image Section */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src={
                    tempImage.localPreview || profileData.profile_picture_url
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-primary/20 object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a clear profile picture to help instructors recognize
                    you
                  </p>
                </div>
                <Button variant={"ghost"} onClick={handleImageClick}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4" />
                  <span>Change Photo</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-foreground font-medium"
                >
                  Full Name
                </Label>
                {/* <span className="text-red-600 block text-sm mb-1 font-medium">
                  {validationError.name}
                </span> */}
                <Input
                  id="fullName"
                  name="fullName"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div> */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                {/* <span className="text-red-600 block text-sm mb-1 font-medium">
                  {validationError.email}
                </span> */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Learning Profile */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Learning Profile
            </CardTitle>
            <CardDescription>
              Your educational background and interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground font-medium">
                About
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself and your learning goals..."
                className="min-h-24 resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                {profileData.about.length}/500 characters
              </p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-foreground font-medium">
                  Specialization
                </Label>
                <select
                  id="specialization"
                  name="specialization"
                  value={profileData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Web Development</option>
                  <option>Full Stack Development</option>
                  <option>Mobile Development</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                  <option>DevOps</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground font-medium">
                  Experience Level
                </Label>
                <select
                  id="experience"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <Button variant={"ghost"} onClick={() => setIsLoading(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg flex items-center justify-center gap-2 flex-1 md:flex-none transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
