import { useState } from "react";
import AdminNavbar from "../components/adminComponents/AdminNavbar";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import DetailsTable from "@/components/adminComponents/DetailsTable";
// import AdminTutors from "@/components/adminComponents/AdminTutors";
import AdminDashboard from "@/components/adminComponents/AdminDashboard";
import { getAllUsers } from "../api/admin/getAllUsers";
import { getAllTutors } from "../api/admin/getAllTutors";

// interface AdminLayoutProps {
//   children: ReactNode;
// }

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  //const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

let child
   switch (activeTab) {
    case "dashboard":
      child  = <AdminDashboard />;
      break;
    case "tutors":
      child  =  <DetailsTable getFunction={getAllTutors} componentName="Tutors" />;
      break;
    case "students":
      child  = <DetailsTable getFunction={getAllUsers} componentName="Students" />;
      break;
    default:
      child  = <AdminDashboard />;
  }

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      } min-h-screen flex flex-col`}
    >
      {/* Navbar always full width at top */}
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Sidebar + main content below navbar */}
      <div className="flex flex-1">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          //sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-8">{child}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
