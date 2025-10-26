import { useState} from "react";
import AdminNavbar from "../components/adminComponents/AdminNavbar";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import DetailsTable from "@/components/adminComponents/DetailsTable";
import AdminDashboard from "@/components/adminComponents/AdminDashboard";
import { getAllUsers } from "@/api/adminApi";

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

  const userParams = { limit: 3, role: "user" };
  const TutorParams = { limit: 3, role: "tutor" };

  let child;

  switch (activeTab) {
    case "dashboard":
      child = <AdminDashboard />;

      break;

    case "students":
      child = (
        <DetailsTable
          getFunction={getAllUsers}
          initialParams={userParams}
          title="Students"
        />
      );

      break;

    case "tutors":
      child = (
        <DetailsTable
          getFunction={getAllUsers}
          initialParams={TutorParams}
          title="Tutors"
        />
      );

      break;

    default:
      child = <AdminDashboard />;
  }

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      } min-h-screen flex flex-col`}
    >
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-8">{child}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
