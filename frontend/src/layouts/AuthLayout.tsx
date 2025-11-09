import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/adminComponents/AdminNavbar";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { adminSidebarItems } from "@/data/adminSidebarItems";

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen flex flex-col`}>
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* THIS IS THE FIXED SECTION */}
      <div className="flex flex-1 overflow-hidden">
      <Sidebar items={adminSidebarItems} variant="admin" collapsible={true} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* 👈 This is where nested routes will render */}
        </main>
      </div>
      {/* END OF FIXED SECTION */}

    </div>
  );
};

export default AdminLayout;