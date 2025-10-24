import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/auth/UserRegister";
// import OtpVerification from "./pages/OtpVerificationModal";
import Home from "./pages/user/Home";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/auth/AdminLogin";
//import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import TestPage from "./pages/Test";
import NotFound from "./pages/NotFound";
import TutorLayout from "./layouts/TutorLayout";
//import AdminDashboard from "./components/adminComponents/AdminDashboard";
//import AdminTutors from "./components/adminComponents/AdminTutors";
//import AdminStudents from "./components/adminComponents/AdminStudents";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* test route */}
        <Route path="/test" element={<TestPage />} />

        {/*User--tutor Authentication Routes*/}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />

        {/* Tutor Routes */}
        <Route path="/tutor" element={<TutorLayout />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout />} />

        {/* catch all error routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
