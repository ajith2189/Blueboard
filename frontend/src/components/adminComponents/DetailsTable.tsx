import { UserPlus, FileDown, Pencil, Eye, Trash2, Loader2 } from "lucide-react";
import  { useEffect, useState, useMemo } from "react";
import type { User, PaginatedResponse } from "@/api/adminApi"; // Import PaginatedResponse
import { debounce } from "lodash";
import Pagination from "../ui/Pagination";
import SearchInput from "../ui/SearchInput";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// --- [STUBBED IMPORTS] ---
// Mocks for components and types to make this file displayable

// type User = {
//   _id: string;
//   name: string;
//   email: string;
//   profile_picture_url?: string;
//   is_blocked: boolean;
//   createdAt: string;
// };

// type PaginatedResponse<T> = {
//   data: T[];
//   pagination: {
//     totalPages: number;
//     currentPage: number;
//   };
// };

// const debounce = (fn: Function, delay: number) => {
//   let timer: NodeJS.Timeout;
//   return (...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// };

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) => (
//   <div className="flex justify-center items-center space-x-2 mt-6">
//     <button
//       onClick={() => onPageChange(currentPage - 1)}
//       disabled={currentPage === 1}
//       className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
//     >
//       Prev
//     </button>
//     <span>
//       Page {currentPage} of {totalPages}
//     </span>
//     <button
//       onClick={() => onPageChange(currentPage + 1)}
//       disabled={currentPage === totalPages}
//       className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
//     >
//       Next
//     </button>
//   </div>
// );

// const SearchInput = ({
//   value,
//   onChange,
//   onClear,
//   placeholder,
// }: {
//   value: string;
//   onChange: (val: string) => void;
//   onClear: () => void;
//   placeholder: string;
// }) => (
//   <input
//     type="text"
//     value={value}
//     onChange={(e) => onChange(e.target.value)}
//     placeholder={placeholder}
//     className="p-2 border rounded-lg" // This is a minimal stub
//   />
// );

// const toast = {
//   loading: (msg: string) => {
//     console.log("Toast loading:", msg);
//     return "toast1";
//   },
//   success: (msg: string) => console.log("Toast success:", msg),
//   error: (msg: string) => console.log("Toast error:", msg),
//   dismiss: (id: string) => console.log("Toast dismiss:", id),
// };

// // Mock Button used by ConfirmDialog
// const Button = ({
//   variant,
//   icon,
//   children,
//   onClick,
//   ...props
// }: {
//   variant?: string;
//   icon?: React.ReactNode;
//   children?: React.ReactNode;
//   onClick?: () => void;
//   [key: string]: any;
// }) => {
//   const baseClass =
//     "flex items-center justify-center w-full sm:w-auto text-sm font-medium px-3.5 py-2 rounded-lg transition-colors";
//   const variants: { [key: string]: string } = {
//     destructive:
//       "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900",
//     outline:
//       "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
//   };
//   return (
//     <button
//       onClick={onClick}
//       className={`${baseClass} ${variants[variant || "outline"]}`}
//       {...props}
//     >
//       {icon}
//       {children && <span className={icon ? "hidden sm:inline ml-1.5" : "hidden sm:inline"}>{children}</span>}
//     </button>
//   );
// };

// // Mock ConfirmDialog that matches your original component's props
// const ConfirmDialog = ({
//   triggerText,
//   title,
//   description,
//   confirmText,
//   variant,
//   onConfirm,
// }: {
//   triggerText: string;
//   title: string;
//   description: string;
//   confirmText: string;
//   variant: string;
//   onConfirm: () => void;
// }) => (
//   <Button
//     variant={variant}
//     icon={<Trash2 className="w-4 h-4 sm:mr-1.5" />} // Icon based on your original
//     onClick={() => {
//       if (window.confirm(`${title}\n${description}`)) {
//         onConfirm();
//       }
//     }}
//   >
//     <span className="hidden sm:inline">{triggerText}</span>
//   </Button>
// );

// const LoadingSpinner = () => (
//     <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// );

// --- [END OF STUBBED IMPORTS] ---

interface DetailsTableProps {
  getFunction: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    role?: string;
  }) => Promise<PaginatedResponse<User>>;
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
        setUsers(response.data);
        setTotalPages(response.pagination.totalPages);
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
          setFilteredUsers(results.data);
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
      toast.success(`User action successfully`);
    } catch (err) {
      console.error("Failed to block user", err);
      toast.error("Failed to block user. Please try again.");
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  const getStatusChipClass = (status: boolean) =>
    status
      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";

  // --- Handlers for actions ---
  // (These are kept from your code, even if not used, to prevent breaking logic)
  const handleView = (id: string) => {
    console.log("View user:", id);
    // Add logic to show a UserView component
  };

  const handleEdit = (id: string) => {
    console.log("Edit user:", id);
    // Add logic to show an EditUser dialog
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Manage {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View, add, edit, or remove {title.toLowerCase()} profiles.
      </p>

      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search by name or email..."
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors">
            <FileDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <span className="font-medium text-gray-800 dark:text-white">
              Export
            </span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:opacity-90 transition-opacity">
            <UserPlus className="w-5 h-5" />
            <span className="font-medium">Add {title}</span>
          </button>
        </div>
      </div>

      {/* --- [STYLED] Users Table Card --- */}
      {/* This container holds loading/error/empty states for better UX */}
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {!loading && !error && displayedUsers.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              No {title.toLowerCase()} found
              {searchTerm ? ` for "${searchTerm}"` : ""}.
            </p>
          </div>
        )}

        {!loading && !error && displayedUsers.length > 0 && (
          <table className="w-full text-left">
            {/* --- [STYLED] Table Header --- */}
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Courses Enrolled
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Join Date
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            {/* --- [STYLED] Table Body --- */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedUsers.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* --- [STYLED] Table Cell (added padding) --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {"1"} {/* Placeholder */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipClass(
                        student.is_blocked
                      )}`}
                    >
                      {student.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  {/* --- [REVERTED] Actions Cell (Only shows Block/Unblock) --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
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
        )}
      </div>
      
      {/* Pagination (only show if needed) */}
      {!loading && !error && displayedUsers.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default DetailsTable;

