import { Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";

interface AdminNavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

 // Example user object (you can replace with real user data from props or context)
  const user = {
    name: "Edwin",
    role: "Administrator",
    image: "", // If empty, fallback will be used
  };

const AdminNavbar: React.FC<AdminNavbarProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BlueBoard
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses, students, analytics..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500 flex items-center justify-center bg-blue-600 text-white font-bold">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      </div>
    </header>
  );
};
export default AdminNavbar;
