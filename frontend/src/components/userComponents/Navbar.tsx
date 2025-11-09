import { useState, useEffect, useRef } from "react";
// This import has been updated to use a CDN to resolve the compilation error.
import { useSelector, useDispatch } from  "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { logout } from "../../features/authSlice"; 
import { Button } from "../ui/button";

// --- Placeholder Types ---
// Since we can't access your local "@/store" file, these types are defined
// here as placeholders to ensure the component works correctly.
interface UserState {
  name?: string;
  email?: string;
}

interface RootState {
  auth: {
    user: UserState | null;
  };
}
// -------------------------


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State to manage the visibility of the profile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user data from the Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("the user is ", user);

  const handleLogout = () => {
    // Dispatch your logout action here. For example:
    // dispatch({ type: 'auth/logout' });
    dispatch(logout());
    
    console.log("User logged out");
    setIsDropdownOpen(false);
    navigate("/"); // Redirect to home page after logout
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 shadow-md bg-white sticky top-0 z-50">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Blueboard</h1>

        {/* Menu */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Home</li>
          <li className="hover:text-blue-600 cursor-pointer">About Us</li>
          <li className="hover:text-blue-600 cursor-pointer">Courses</li>
          <li className="hover:text-blue-600 cursor-pointer">Blog</li>
        </ul>

        {/* Auth Buttons or User Profile Section */}
        <div className="flex items-center gap-4">
          {user ? (
            // --- User Profile Section (when logged in) ---
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {/* Display first letter of user's name as avatar */}
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {/* --- Dropdown Menu --- */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 animate-fadeIn transition-all duration-300">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Button
                  variant={"ghost2"}
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                  <a
                  onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover: bg-gray-100"
                  >
                    <User size={16} />
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // --- Auth Buttons (when logged out) ---
            <div className="flex gap-2 sm:gap-4">
              <button
                className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
