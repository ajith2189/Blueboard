import LoginForm from "@/components/auth/LoginForm";
import { TutorLoginApi } from "@/api/authApi";
import { tutorGoogleLogin } from "@/api/tutorApi";

export default function AdminLogin() {
  return (
    <LoginForm
      onLogin={TutorLoginApi}
      onGoogleLogin={tutorGoogleLogin}
      roleRedirects={{ user: "/", tutor: "/tutor" }}
      role ={"tutor"}
    />
  );
}
