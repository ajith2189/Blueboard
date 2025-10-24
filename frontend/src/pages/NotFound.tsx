import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react"; // modern icon pack

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center px-6">
      <div className="flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you’re looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition duration-200"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
      <footer className="absolute bottom-4 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Blueboard. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;
