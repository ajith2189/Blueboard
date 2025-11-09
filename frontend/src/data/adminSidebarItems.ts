import {
  BarChart3,
  LayoutGrid,
  Users,
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const adminSidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin/" },
  { id: "category", label: "Category", icon: LayoutGrid, path: "/admin/categories" },
  { id: "students", label: "Students", icon: Users, path: "/admin/students" },
  { id: "tutors", label: "Tutors", icon: GraduationCap, path: "/admin/tutors" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "admin/test" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/test" },
  { id: "settings", label: "Settings", icon: Settings, path: "/test" },
];
