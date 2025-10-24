// src/App.jsx

import React from 'react';
import Navbar from '../components/tutorComponent/Navbar';
import Sidebar from '../components/tutorComponent/Sidebar';
import Dashboard from '../components/tutorComponent/Dashboard';

function TutorLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        {/* Main Content Area */}
        <Dashboard />
      </div>
    </div>
  );
}

export default TutorLayout;