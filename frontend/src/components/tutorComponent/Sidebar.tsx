// src/components/Sidebar.jsx

import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Book,
  DollarSign,
  MessageSquare,
  HelpCircle,
  LogOut,
  Share2,
  PlusCircle,
} from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice"; 
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';

// Navigation items configuration
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Profile', icon: User },
  { name: 'Courses', icon: Book },
  { name: 'Revenues', icon: DollarSign },
  { name: 'Chat & video', icon: MessageSquare },
  { name: 'Quiz', icon: HelpCircle },
];

interface RootState {
  auth: {
    user: UserState | null;
  };
}

export default function Sidebar() {



  const [activeItem, setActiveItem] = useState('Dashboard');

  const dispatch = useDispatch();
const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);


      const handleLogout = () => {
        dispatch(logout());
        console.log("User logged out");
        navigate("/login"); // Redirect to home page after logout
      };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 border-b border-gray-200">
        <img
          className="h-24 w-24 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          alt="User profile"
        />
        <h3 className="mt-4 text-xl font-semibold">{user.name}</h3>
        <a
          href="#"
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Share Profile <Share2 className="ml-1 h-4 w-4" />
        </a>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    activeItem === item.name
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
          {/* Logout Link */}
          <li className="mt-4 border-t border-gray-200 pt-4">
            <a
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>LogOut</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Add New Course Button */}
      <div className="p-6 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-semibold hover:bg-blue-700 transition-colors duration-200">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Course
        </button>
      </div>
    </aside>
  );
}