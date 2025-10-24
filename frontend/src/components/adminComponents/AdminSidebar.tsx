import {
  BarChart3,

  Users,
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice"; 
import { useDispatch } from "react-redux";
interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  //sidebarCollapsed: boolean;
}

// const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, sidebarCollapsed }) => {

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    // { id: "analytics", label: "Analytics", icon: Activity },
    { id: "students", label: "Students", icon: Users },
    { id: "tutors", label: "Tutors", icon: GraduationCap },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

const dispatch = useDispatch();
const navigate = useNavigate()

    const handleLogout = () => {
      dispatch(logout());
      console.log("User logged out");
      navigate("/admin/login"); // Redirect to home page after logout
    };
  

  return (
    <aside className=// `${sidebarCollapsed ? "w-20" : "w-72"}
    "w-72 transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
<div className="p-4 pb-6 flex flex-col h-full">
        {/* User */}
        {/* <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">EDWIN</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View Profile
              </button>
            </div>
          )}
        </div> */}

        {/* Menu */}
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {/* {!sidebarCollapsed && <span className="font-medium">{item.label}</span>} */}

                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            {/* {!sidebarCollapsed && <span className="font-medium">Logout</span>} */}
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
