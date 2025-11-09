import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/auth/RegisterPage";
import Home from "./pages/user/Home";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import NotFound from "./pages/NotFound";
import TutorLayout from "./layouts/TutorLayout";
import { Toaster } from "sonner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryDetails from "./pages/admin/CategoryDetails";
import CategoryManagement from "./pages/admin/CategoryManagement";
import StudentsDetails from "./pages/admin/StudentsDetails";
import TutorDetails from "./pages/admin/TutorDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import EditProfile from "./pages/user/EditUserProfile";
import TutorLogin from "./pages/auth/TutorLogin";
import TestPage from "./pages/Test";
import EditProfilePage from "./components/edit-profile-page";
import Dashboard from "./components/tutorComponent/Dashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* <Route path="/test" element={<TestPage />} /> */}
        <Route path="/test" element={<EditProfilePage />} />

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/*User Routes*/}
        <Route path="/profile" element={<EditProfile />} />

        {/* Tutor Routes */}
        <Route path="/tutor/login" element={<TutorLogin />} />

        <Route path="/tutor" element={<TutorLayout />} >
          <Route path = "dashboard" element={<Dashboard />} />
          <Route path="/tutor/profile" element={<EditProfilePage/>}/>
          <Route path="/tutor/test" element={<TestPage/>}/>
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="categories/:id" element={<CategoryDetails />} />
          <Route path="students" element={<StudentsDetails />} />
          <Route path="tutors" element={<TutorDetails />} />
          <Route path="test" element={<TutorDetails />} />


        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
