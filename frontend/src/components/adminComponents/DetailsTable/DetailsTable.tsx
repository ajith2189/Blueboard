import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
// import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import Pagination from "../../ui/Pagination";
import SearchInput from "../../ui/SearchInput";
import TableRow from "./TableRow";
import type { User, PaginatedResponse } from "../../../api/adminApi";

interface DetailsTableProps {
  getFunction: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    role?: string;
  }) => Promise<PaginatedResponse<User>>;
  blockFunction: (userId: string) => Promise<User>;
  title: string;
  initialParams?: { limit?: number; role?: string };
}

const DetailsTable = ({getFunction,blockFunction, initialParams,title,}: DetailsTableProps) => {
  const {
    data: users,
    loading,
    error,
    totalPages,
    page,
    setPage,
    refetch,
  } = usePaginatedFetch<User>(getFunction, initialParams);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const debouncedSearch = useDebouncedSearch(async (term: string) => {
    const res = await getFunction({ ...initialParams, search: term });
    setFilteredUsers(res.data);
  });

  useEffect(() => {
    if (searchTerm) debouncedSearch(searchTerm);
    else setFilteredUsers([]);
  }, [searchTerm]);

  const handleBlock = async (id: string) => {
    const toastId = toast.loading("Updating user...");
    try {
      await blockFunction(id);
      toast.success("User updated successfully");
      refetch();
    } catch {
      toast.error("Failed to update user");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const displayedUsers = searchTerm ? filteredUsers : users;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Search users..."
        />
        <button className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-4 py-3 shadow-lg hover:opacity-90">
          <UserPlus className="w-5 h-5" />
          <span className="ml-2">Add {title}</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : displayedUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No {title} found.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Courses</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <TableRow key={user._id} user={user} onBlock={handleBlock} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && !loading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DetailsTable;
