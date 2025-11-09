import React, { useMemo, useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/authSlice";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
};

interface SidebarProps {
  items: SidebarItem[];
  heading?: string;
  variant?: "admin" | "secondary" ;
  collapsible?: boolean;
}

const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ items, heading = "Dashboard", variant = "admin", collapsible = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    /* ---------- Handlers ---------- */
    const handleLogout = useCallback(() => {
      dispatch(logout());
      navigate("/login");
    }, [dispatch, navigate]);

    const toggleCollapse = useCallback(() => {
      setCollapsed((prev) => !prev);
    }, []);

    /* ---------- Active Item Logic ---------- */
    const memoizedSidebarItems = useMemo(() => {
      return items.map((item) => {
        const Icon = item.icon;

        // ✅ Fix: strict active check
        const isActive =
          location.pathname === item.path ||
          (item.path !== "/admin/" && location.pathname.startsWith(item.path + "/"));

        return (
          <Button
            key={item.id}
            type="button"
            variant={isActive ? variant : "ghost2"}
            size="lg"
            icon={<Icon className="w-5 h-5 shrink-0" />}
            onClick={() => navigate(item.path)}
            className={`w-full justify-start px-4 transition-all duration-200 ${
              collapsed ? "px-2" : ""
            } ${isActive ? "shadow-md" : ""}`}
          >
            {!collapsed && <span>{item.label}</span>}
          </Button>
        );
      });
    }, [items, location.pathname, navigate, variant, collapsed]);

    /* ---------- Render ---------- */
    return (
      <aside
        className={`${
          collapsed ? "w-20" : "w-72"
        } h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300`}
      >
        {/* Header */}
        {collapsible && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!collapsed && <h2 className="font-semibold text-lg">{heading}</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="text-gray-600"
              type="button"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Scrollable Items */}
        <div className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {memoizedSidebarItems}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="destructive"
            size="lg"
            icon={<LogOut className="w-5 h-5 shrink-0" />}
            onClick={handleLogout}
            className="w-full justify-start"
            type="button"
          >
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>
    );
  }
);

export default Sidebar;
