"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "@/api/authApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle } from "lucide-react";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPasswordApi(token, data.password);
      setSuccessMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError("Failed to reset password. The link may be expired ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // if (!token && !successMessage) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="max-w-sm text-center">
  //         <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Link</h2>
  //         <p className="text-muted-foreground mb-4">
  //           This password reset link is invalid or expired.
  //         </p>
  //         <Button variant="link" onClick={() => navigate("/forgot-password")}>
  //           Request a new link
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 p-6 rounded-xl border bg-card shadow-md">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter your new password below.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-2">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Saving..." : "Save New Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
