import { useState } from "react";
import RegisterModal from "../pages/auth/UserRegister";

export default function Navbar() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">Blueboard</h1>

        {/* Menu */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">About Us</li>
          <li className="hover:text-blue-600 cursor-pointer">Courses</li>
          <li className="hover:text-blue-600 cursor-pointer">Blog</li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-blue-600">Login</button>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
