import React, { useMemo, useCallback } from "react"; // <-- Import useMemo
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  // ... other icons
  LogOut,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin/" },
  { id: "category", label: "Category", icon: LayoutGrid, path: "/admin/categories" },
  { id: "students", label: "Students", icon: Users, path: "/admin/students" },
  { id: "tutors", label: "Tutors", icon: GraduationCap, path: "/admin/tutors" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminSidebar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation(); // This will still cause the component to re-render
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/admin/login");
  }, [dispatch, navigate]);

  // --- THIS IS THE FIX ---

  const memoizedSidebarItems = useMemo(() => {
    return sidebarItems.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.path === "/admin/"
          ? location.pathname === "/admin/"
          : location.pathname.startsWith(item.path);

      return (
        <Button
          key={item.id}
          variant={isActive ? "admin" : "ghost2"}
          size="lg"
          icon={<Icon className="w-5 h-5" />}
          onClick={() => navigate(item.path)}
          className={`w-full justify-start px-4 ${isActive ? "shadow-md" : ""}`}
        >
          <span>{item.label}</span>
        </Button>
      );
    });
  }, [location.pathname, navigate]); // Dependencies are pathname and navigate

  return (
    <aside className="w-72 transition-all duration-300 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 flex flex-col p-4 space-y-2">
        {/* Render the memoized list */}
        {memoizedSidebarItems}
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="destructive"
          size="lg"
          icon={<LogOut className="w-5 h-5" />}
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
});

export default AdminSidebar;