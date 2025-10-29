import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/adminComponents/AdminNavbar";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import { useState } from "react";

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen flex flex-col`}>
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Outlet /> {/* 👈 This is where nested routes will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
