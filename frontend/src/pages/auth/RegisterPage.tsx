"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";

import { userRegisterApi, OtpVerification, usergoogleSignUp } from "@/api/authApi";
import { loginSuccessful } from "@/features/authSlice";
import OtpVerificationModal from "../../components/userComponents/OtpVerificationModal";

// Import the new components
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterHero from "@/components/auth/RegisterHero";
import RegisterForm from "@/components/auth/RegisterForm";
import type { RegisterFormData } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "tutor">("user"); // State for the toggle
  const [emailError, setEmailError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setOtpError(null);
    setEmailError(null);
    console.log("Submitting registration:", data, "as");

    try {
      // Pass the role to your API
      const response = await userRegisterApi({ ...data, role });
      console.log("Registration successful:", response);

      setUserEmail(data.email);
      setShowOtpModal(true);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      
      // Improved Error Handling: Get message from API response
      const errorMessage = error.message || "Something went wrong!";

      if (error.status === 409) {
        setEmailError(error)
        toast.error(errorMessage || "Email already exists");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      const response = await OtpVerification(otp, userEmail);
      console.log("✅ OTP verification response:", response);

      toast.success("OTP verified! You can now log in.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ OTP verification failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Invalid or expired OTP";
      setOtpError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;

    try {
      const response = await usergoogleSignUp(
        credentialResponse.credential,role
    );

      console.log("Backend response:", response);
      const userPayload = {
        user: {
          userId: response.user._id,
          name: response.user.name,
          email: response.user.email,
        },
        accessToken: response.accessToken || "",
      };

      await dispatch(loginSuccessful(userPayload));
      navigate("/");
    } catch (err) {
      console.error("Google Login failed:", err);
      toast.error("Google Sign-Up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>

      <div className="relative w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-border/50">
        <RegisterHeader />

        <div className="flex">
          <RegisterHero />

          <RegisterForm
            role={role}
            setRole={setRole}
            onSubmit={onSubmit}
            onGoogleSuccess={handleGoogleSuccess}
            loading={loading}
            navigateToLogin={() => navigate("/login")}
            emailError={emailError} 
          />
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpVerificationModal
          email={userEmail}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleOtpVerify}
          otpError={otpError}
        />
      )}
    </div>
  );
}