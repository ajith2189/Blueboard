"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

// Form data type
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Props interface for this component
interface RegisterFormProps {
  role: "user" | "tutor";
  setRole: React.Dispatch<React.SetStateAction<"user" | "tutor">>;
  onSubmit: (data: RegisterFormData) => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
  loading: boolean;
  navigateToLogin: () => void;
  emailError?: {message: string} | null;
}

export default function RegisterForm({
  role,
  setRole,
  onSubmit,
  onGoogleSuccess,
  loading,
  navigateToLogin,
  emailError,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors, 
  } = useForm<RegisterFormData>();

  // --- 2. THIS IS THE UPDATED useEffect ---
  useEffect(() => {
    if (emailError) {
      // If the parent passes an error string, set it
      console.log("RegisterForm: useEffect SETTING error:", emailError.message);
      setError("email", {
        type: "manual",
        message: emailError.message,
      });
    } else {
      // If the parent passes null/undefined, clear the error
      console.log("RegisterForm: useEffect CLEARING error.");
      clearErrors("email");
    }
  }, [emailError, setError, clearErrors]); // --- 3. ADD clearErrors TO DEPENDENCIES ---

  return (
    <div className="w-full lg:w-1/2 p-8 lg:p-12">
      <div className="max-w-md mx-auto">
        {/* Form Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-foreground mb-3 font-mono">
            Create Your {role === "user" ? "User" : "Tutor"} Account
          </h3>
          <p className="text-muted-foreground">
            Start your journey today with full access to our platform.
          </p>
        </div>

        {/* === ROLE TOGGLE === */}
        <div className="flex w-full mb-6 gap-2 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === "user"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:bg-background/50"
            }`}
          >
            Register as a User
          </button>
          <button
            type="button"
            onClick={() => setRole("tutor")}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === "tutor"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:bg-background/50"
            }`}
          >
            Register as a Tutor
          </button>
        </div>
        {/* ======================== */}

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
            error={errors.email}
          />

          <InputField
            label="Email Address"
            placeholder="Enter your professional email"
            type="email"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-T0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
                message: "Must contain uppercase, lowercase, and a number",
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
              <a href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
              .
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
            onSuccess={onGoogleSuccess}
            onError={() => console.log("Google Sign In Failed")}
            useOneTap
          />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <a
            onClick={navigateToLogin}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}