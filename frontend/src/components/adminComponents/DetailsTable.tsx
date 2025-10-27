import { UserPlus, FileDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import type { User, PaginatedResponse } from "@/api/adminApi"; // Import PaginatedResponse
import { debounce } from "lodash";
import Pagination from "../ui/Pagination";
import SearchInput from "../ui/SearchInput";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface DetailsTableProps {
  getFunction: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    role?: string; // Add role to match getAllUsers
  }) => Promise<PaginatedResponse<User>>; // Update return type
  blockFunction: (userId: string) => Promise<User>;
  title: string;
  initialParams?: {
    limit?: number;
    role?: string;
  };
}

const noProfileUrl =
  "https://res.cloudinary.com/dlgrbt3t2/image/upload/v1755875794/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651_y24ilw.svg";




// ----------------------------- Start of Component-----------------------------------------

const DetailsTable = ({
  getFunction,
  blockFunction,

  initialParams,
  title,
}: DetailsTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const displayedUsers = searchTerm ? filteredUsers : users;

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await getFunction({
          ...initialParams,
          page: currentPage,
        });
        setUsers(response.data); // Access the User[] array from response.data
        setTotalPages(response.pagination.totalPages); // Access pagination
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getFunction, initialParams, currentPage]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        try {
          const results = await getFunction({ ...initialParams, search: term });
          setFilteredUsers(results.data); // Access User[] from results.data
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 400),
    [getFunction, initialParams]
  );

  // Trigger search on searchTerm change
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setFilteredUsers([]);
    }
    return debouncedSearch.cancel;
  }, [searchTerm, debouncedSearch]);

  //Blocking user
  const handleBlock = async (id: string) => {
    const loadingToastId = toast.loading("Blocking the user");
    try {
      const updatedUser = await blockFunction(id);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user))
      );
      toast.success(`user action  successfully`)
    } catch (err) {
      console.error("Failed to block user", err);
      toast.error("Failed to block user. Please try again.");
    }finally{
      toast.dismiss(loadingToastId);
    }
  };

  const getStatusChipClass = (status: boolean) =>
    status
      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Manage {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View, add, edit, or remove {title.toLowerCase()} profiles.
      </p>

      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex justify-between items-center mb-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search users by name or email..."
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
            <span className="font-medium">Add {title}</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading && <p>Loading {title.toLowerCase()}...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && displayedUsers.length === 0 && (
        <p>
          No {title.toLowerCase()} found
          {searchTerm ? ` for "${searchTerm}"` : ""}.
        </p>
      )}
      {!loading && !error && displayedUsers.length > 0 && (
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
              {displayedUsers.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={student.profile_picture_url || noProfileUrl}
                      alt={student.name}
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

                  {/* ----------------------------block button --------------------- */}
                  <td className="p-4">
                    <ConfirmDialog
                      triggerText={student.is_blocked ? "Unblock" : "Block"}
                      title={`${student.is_blocked ? "Unblock" : "Block"} ${
                        student.name
                      }?`}
                      description={`Are you sure you want to ${
                        student.is_blocked ? "unblock" : "block"
                      } this user?`}
                      confirmText={student.is_blocked ? "Unblock" : "Block"}
                      variant={student.is_blocked ? "outline" : "destructive"}
                      onConfirm={() => handleBlock(student._id)}
                    />
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DetailsTable;
