import { Shield, Mail, ArrowRight } from "lucide-react";
import InputField from "@/components/userComponents/InputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "@/features/authSlice";
import { adminLoginApi } from "@/api/admin/adminLoginApi";

interface AdminLoginFormData {
  email: string;
  password: string;
}
export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const onSubmit = async (data: AdminLoginFormData) => {
    setLoading(true);
    // console.log("the date reaching the onsubmit",data);

    try {
      const response = await adminLoginApi(data);
      console.log("user data received", response);

      const userPayload = {
        user: {
          userId: response.userId,
          name: response.name,
          email: response.email,
        },
        accessToken: response.accessToken || "", // if your API adds token later
      };

      // setting user data in the store
      dispatch(loginSuccessful(userPayload));
      navigate("/admin/dashboard"); // Redirect to dashboard on successful login

      // Handle successful login - redirect to dashboard
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100">
      <div className="min-h-screen flex">
        {/* Left Panel */}
        <div className="hidden lg:flex w-2/5 bg-blue-700 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-800 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-800 rounded-full translate-x-1/4 translate-y-1/4 opacity-50"></div>

          <div className="z-10">
            <div className="flex items-center space-x-3">
              <Shield size={48} className="text-white" />
              <span className="text-white text-2xl font-bold">Blueboard</span>
            </div>
          </div>
          <div className="z-10">
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              The control center for your business.
            </h1>
            <p className="text-blue-200 text-lg">
              Manage users, analyze data, and oversee operations with clarity
              and efficiency.
            </p>
          </div>
          <div className="z-10 text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Admin Log In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please enter your details.
              </p>
            </div>

            {error && (
              <div className="flex items-center justify-between bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-4">
                {/* Left side: icon + message */}
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  ✕
                </button>
              </div>
            )}

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

              <InputField
                label="Password"
                placeholder="Enter your password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password}
                showToggle
              />

              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
