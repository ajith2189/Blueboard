import { useState } from "react";
import { useForm } from "react-hook-form";
import { BookOpen, Send } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi, verifyResetOtpApi } from "@/api/authApi";
import OtpVerificationModal from "@/components/userComponents/OtpVerificationModal";
// import { da } from "zod/v4/locales";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await forgotPasswordApi(data.email);
      localStorage.setItem("resetEmail", data.email);
      setSuccessMessage("OTP sent to your email.");
      setOtpModalOpen(true); // open modal instead of navigating
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const email = localStorage.getItem("resetEmail");
    if (!email) return;

    try {
      const token = await verifyResetOtpApi(email, otp);
      setOtpModalOpen(false);
      navigate(`/reset-password/?token=${token.data.resetToken}`);
    } catch (err) {
      setOtpError("Invalid OTP. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-border/50 p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-mono">Blueboard</h1>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-foreground mb-3 font-mono">Reset Password</h3>
          <p className="text-muted-foreground">Enter your email to receive an OTP</p>
        </div>

        {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {successMessage && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{successMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Email Address"
            placeholder="Enter your email address"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-mono"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send OTP
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Remembered your password?{" "}
          <a onClick={() => navigate("/login")} className="text-primary hover:underline font-medium cursor-pointer">
            Sign in
          </a>
        </p>
      </div>

      {otpModalOpen && (
        <OtpVerificationModal
          email={localStorage.getItem("resetEmail") || ""}
          onClose={() => setOtpModalOpen(false)}
          onVerify={handleVerifyOtp}
          otpError={otpError}
          purpose="reset"
          onResend={handleSubmit(data => onSubmit(data))}
        />
      )}
    </div>
  );
}
