// pages/UserLogin.tsx
import { usergoogleSignUp, userLoginApi } from "@/api/authApi";
// import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function UserLogin() {
  return (
      <LoginForm
      onLogin={userLoginApi}
      onGoogleLogin={usergoogleSignUp}
      roleRedirects={{ user: "/", tutor: "/tutor" }}
    />

  );
}



