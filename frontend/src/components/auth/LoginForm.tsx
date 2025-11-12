import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BookOpen,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Lock,
  Mail,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "@/features/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormWrapperProps {
  onLogin: (credentials: LoginFormData) => Promise<any>;
  onGoogleLogin?: (credential: string) => Promise<any>;
  roleRedirects?: { [role: string]: string }; // e.g. { user: "/", tutor: "/tutor", admin: "/admin" }
  role?: string;
}

export default function LoginForm({
  onLogin,
  onGoogleLogin,
  roleRedirects = {},
  role = "user",
}: LoginFormWrapperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await onLogin(data);
      console.log("the response is ", response);

      const userPayload = {
        user: {
          userId: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user?.role,
        },
        accessToken: response.accessToken || "",
      };

      dispatch(loginSuccessful(userPayload));

      // const token: any = jwtDecode(response.accessToken);
      // const redirectPath = ;
      navigate(role === "user" ? "/" : "/tutor/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential || !onGoogleLogin) return;

    try {
      const response = await onGoogleLogin(credentialResponse.credential);

      const userPayload = {
        user: {
          userId: response.user._id,
          name: response.user.name,
          email: response.user.email,
        },
        accessToken: response.accessToken || "",
      };

      dispatch(loginSuccessful(userPayload));
      navigate("/");
    } catch (err) {
      console.error("Google Login failed:", err);
    }
  };

  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>

      <div className="relative w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-border/50">
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
          {/* Left side hero */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center relative overflow-hidden">
            <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Secure Access Portal
              </div>

              <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                Welcome Back to
                <span className="text-primary block">
                  {role === "user"
                    ? "Your Learning Journey"
                    : "Your tutor journey"}
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Continue your professional development with personalized
                courses, expert mentorship, and industry-recognized
                certifications.
              </p>

              <div className="space-y-4">
                {[
                  "Resume your courses exactly where you left off",
                  "Access your personalized learning dashboard",
                  "Connect with your assigned mentors and peers",
                  "Track your progress and achievements",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-3 font-mono">
                  {role === "user" ? "Welcome back" : "Tutor login"}
                </h3>
                <p className="text-muted-foreground">
                  Sign in to access your personalized learning dashboard
                </p>
              </div>

              {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-4">
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

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

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
              {role !== "admin" && (
                <>
                  <div className="my-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-sm text-muted-foreground bg-background px-3">
                      Or continue with
                    </span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  {onGoogleLogin && (
                    <div className="flex justify-center mt-4">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Google Sign In Failed")}
                        useOneTap
                      />
                    </div>
                  )}

                  <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't have an account?{" "}
                    <a
                      onClick={() => navigate("/register")}
                      className="text-primary hover:underline font-medium cursor-pointer"
                    >
                      Create one here
                    </a>
                  </p>

                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">
                          Secure Login
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your login is protected with enterprise-grade
                          security. We use encrypted connections and never store
                          your password in plain text.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
