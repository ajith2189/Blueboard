"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BookOpen,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import InputField from "@/components/userComponents/InputField";
import OtpVerificationModal from "../../components/userComponents/OtpVerificationModal";
import { useNavigate } from "react-router-dom";
import { RegisterApi } from "@/api/authApi";
import { OtpVerification } from "@/api/authApi";
import { GoogleLogin } from "@react-oauth/google";

import { googleSignUp } from "@/api/authApi";
import type { CredentialResponse } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "@/features/authSlice";
import { toast } from "sonner";
// import { set } from "lodash";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setOtpError(null);
    console.log("Submitting registration:", data);

    try {
      const response = await RegisterApi(data);
      console.log("Registration successful:", response);

      setUserEmail(data.email);
      setShowOtpModal(true);
      toast.success("OTP sent to your email!");
    } 
    catch (error: any) {

      console.log(error);

      if (error.response?.status === 409) {
        toast.error(error.response?.data?.error || "Email already exists");
      } else {
        toast.error(error.response?.data?.error || "Registration failed");
      }
      console.error("Registration failed:", error);
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
      setOtpError(error?.response?.data?.message || "Invalid or expired OTP");
      toast.error("Invalid OTP. Please try again.");
    }
  };

  //--------------------------google sign up--------------------------------

  const dispatch = useDispatch();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;

    try {
      const response = await googleSignUp(credentialResponse.credential);

      console.log("Backend response:", response);
      const userPayload = {
        user: {
          userId: response.user._id, // backend sends `_id`
          name: response.user.name,
          email: response.user.email,
        },
        accessToken: response.accessToken || "",
      };

      // setting user data in the store
      await dispatch(loginSuccessful(userPayload));
      navigate("/");
    } catch (err) {
      console.error("Google Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>

      <div className="relative w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-border/50">
        {/* Header with Trust Indicators */}
        <div className="bg-primary/5 border-b border-border/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-mono">
                  Blueboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional E-Learning Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>50K+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Industry Certified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Side - Hero Content */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Join Our Learning Community
              </div>

              <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                Transform Your Career with
                <span className="text-primary block">Expert-Led Courses</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Access premium courses, connect with industry experts, and
                advance your skills with our comprehensive learning platform
                trusted by professionals worldwide.
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  "Interactive video lessons with real-world projects",
                  "Personalized learning paths and progress tracking",
                  "Direct access to industry mentors and experts",
                  "Certificates recognized by top companies",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Join 50,000+ learners
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Average rating: 4.9/5 ⭐
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-3 font-mono">
                  Create Your Account
                </h3>
                <p className="text-muted-foreground">
                  Start your learning journey today with full access to our
                  platform
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  register={register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  error={errors.name}
                />

                <InputField
                  label="Email Address"
                  placeholder="Enter your professional email"
                  type="email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  error={errors.email}
                />

                <InputField
                  label="Password"
                  placeholder="Create a strong password"
                  register={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  error={errors.password}
                  showToggle
                />

                <InputField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  register={register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  error={errors.confirmPassword}
                  showToggle
                />

                {/* Terms and Privacy */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                    . I understand that my data will be processed securely.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-mono"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm text-muted-foreground bg-background px-3">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Google Sign Up */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Sign In Failed")}
                  useOneTap
                />
              </div>

              {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </a>
              </p>
            </div>{" "}
            {/* ✅ Close max-w-md here */}
          </div>
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
