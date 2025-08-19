import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import OtpVerificationModal from "./OtpVerificationModal";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../utils/axios";
import { registerSchema, validateForm } from "../../utils/validateAuth";

const schema = registerSchema;

type FormValues = z.infer<typeof schema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}
// the isOpen prop will decide whether it should be shown or not
// 
const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // ---------------- Manual Register Submit ----------------
  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const validation = await validateForm(registerSchema, data);
    if (!validation.valid) {
      Object.entries(validation.errors || {}).forEach(([field, message]) => {
        setError(field as keyof FormValues, { type: "manual", message });
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      console.log("Success:", response.data);
      setRegisteredEmail(data.email);
      setShowOtpModal(true);
      //onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "User already exists. Please log in instead.",
          });
        } else {
          alert(error.response?.data?.error || "Something went wrong.");
        }
      } else {
        alert("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Verify 
  const handleVerifyOtp = async (otp: string) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email: registeredEmail,
        otp,
      });

      console.log("OTP verified:", response.data);

      setShowOtpModal(false);
      onClose();
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "OTP verification failed.");
      } else {
        alert("Unexpected error.");
      }
    }
  };

  // Google Login 
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        const decoded: object = jwtDecode(credentialResponse.credential);
        console.log("Decoded Google JWT:", decoded);

        const response = await axiosInstance.post(
          "/auth/google",
          { token: credentialResponse.credential },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Google login success:", response.data);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed.");
    }
  };

  if (!isOpen) return null; // don’t render if closed

  return (
    <>
      {/* Register Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white w-11/12 max-w-5xl rounded-2xl overflow-hidden flex shadow-2xl relative animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
          >
            <X size={24} />
          </button>

          {/* Left Image */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://i.pinimg.com/736x/35/5e/ea/355eea6483947c8ee1444db7e867da85.jpg"
              alt="Student"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white drop-shadow-lg">
              <h1 className="text-3xl font-bold">Learn To Innovate</h1>
              <p className="text-sm">Empowering students to achieve more</p>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Blueboard
              </h2>
              <p className="text-gray-500">Register to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
                <input
                  {...register("name")}
                  placeholder="Enter your Name"
                  className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Email Address</label>
                <input
                  {...register("email")}
                  placeholder="Enter your Email Address"
                  className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your Password"
                    className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/*Google auth button*/}
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
                useOneTap
                locale="en"
              />
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {console.log(registeredEmail)}
      {showOtpModal && (
        <OtpVerificationModal
          email={registeredEmail}
          onClose={() => {
            setShowOtpModal(false);
          }}
          onVerify={handleVerifyOtp}
        />
      )}
    </>
  );
};

export default RegisterModal;
