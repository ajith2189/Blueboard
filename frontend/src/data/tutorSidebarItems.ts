import {
  BarChart3,
  LayoutGrid,
  Users,
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const tutorSidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/tutor/dashboard" },
  { id: "profile", label: "Profile", icon: LayoutGrid, path: "/tutor/profile" },
  { id: "students", label: "Students", icon: Users, path: "/tutor/test" },
  { id: "tutors", label: "Tutors", icon: GraduationCap, path: "/tutor/test" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "/tutor/test" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/tutor/test" },
  { id: "settings", label: "Settings", icon: Settings, path: "/tutor/test" },
];
