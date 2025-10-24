
import { Search, UserPlus, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@/api/admin/getAllUsers";
interface DetailsTableProps {
  getFunction: () => Promise<User[]>;
  componentName: string;
}

const DetailsTable = ({ getFunction, componentName }: DetailsTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const noProfileUrl =
    "https://res.cloudinary.com/dlgrbt3t2/image/upload/v1755875794/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651_y24ilw.svg";

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await getFunction();
        setUsers(response);
        console.log("Fetched user details:", response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch users");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [getFunction]);

  const getStatusChipClass = (status: boolean) => {
    if (!status) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Manage {componentName}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View, add, edit, or remove {componentName.toLowerCase()} profiles.
      </p>

      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors">
            <FileDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <span className="font-medium text-gray-800 dark:text-white">
              Export
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:opacity-90 transition-opacity">
            <UserPlus className="w-5 h-5" />
            <span className="font-medium">Add {componentName}</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && users.length === 0 && <p>No students found.</p>}
      {!loading && !error && users.length > 0 && (
        <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Courses Enrolled
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Join Date
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={student.profile_picture_url || noProfileUrl}
                      alt={student.name}
                      // "this is done to handel when the api  returns null"
                      onError={(e) => (e.currentTarget.src = noProfileUrl)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-800 dark:text-gray-200">
                    {"1"}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipClass(
                        student.is_blocked
                      )}`}
                    >
                      {student.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailsTable;
