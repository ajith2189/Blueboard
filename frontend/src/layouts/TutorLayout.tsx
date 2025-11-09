// src/App.jsx

import Navbar from '../components/tutorComponent/Navbar';
// import Sidebar from '../components/tutorComponent/TutorSidebar';
import Sidebar from '@/components/shared/Sidebar';
import { tutorSidebarItems } from '@/data/tutorSidebarItems';
import { Outlet } from "react-router-dom";


function TutorLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />
      <div className="flex  overflow-auto">
        {/* Left Sidebar */}
 <div className="flex flex-1">
      <Sidebar items={tutorSidebarItems} variant="secondary" collapsible={true} />
        <main className="flex-1 ">
          <Outlet /> 
        </main>
      </div>       
      
      </div>
    </div>
  );
}

export default TutorLayout;