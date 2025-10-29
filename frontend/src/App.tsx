import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/auth/UserRegister";
import Home from "./pages/user/Home";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
 import TestPage from "./pages/Test";
import NotFound from "./pages/NotFound";
import TutorLayout from "./layouts/TutorLayout";
// import Pagination from '@/components/ui/Pagination';
import { Toaster } from "sonner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryDetails from "./pages/admin/CategoryDetails";
import CategoryManagement from "./pages/admin/CategoryManagement";
import StudentsDetails from "./pages/admin/StudentsDetails";
import TutorDetails  from "./pages/admin/TutorDetails";
// import CategoryDetails from "./pages/admin/CategoryDetails";
// import { ConfirmDialog } from "./components/ui/ConfirmDialog";


export default function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        {/* test route */}
        <Route path="/test" element={<TestPage/>} />

        {/*User--tutor Authentication Routes*/}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />

        {/* Tutor Routes */}
        <Route path="/tutor" element={<TutorLayout />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="categories/:id" element={<CategoryDetails />} />
          <Route path="students/" element={<StudentsDetails />} />
          <Route path="tutors/" element={<TutorDetails />} />


          {/* <Route path="categories/:id/courses/:courseId" element={<CourseDetails />} /> */}
        </Route>
        {/* catch all error routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
