// DetailsTable.tsx

import { useState, useCallback, useEffect } from "react"; // <-- Added useCallback
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
// import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
// import { ConfirmDialog } from "../../ui/ConfirmDialog";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import PaginationComponent from "../PaginationComponent";
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

const DetailsTable = ({
  getFunction,
  blockFunction,
  initialParams,
  title,
}: DetailsTableProps) => {
  const {
    data: users,
    loading,
    error,
    totalPages,
    page,
    setPage,
    refetch,
    updateParams
  } = usePaginatedFetch<User>(getFunction, initialParams);

  const [searchTerm, setSearchTerm] = useState("");
 

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1); // reset pagination on search
      updateParams({ search: searchTerm || undefined });
    }, 400); // 400ms debounce

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleBlock = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Updating user...");
      try {
        await blockFunction(id);
        toast.success("User updated successfully");
        // Refetch the data to update the status in the table
        refetch();
      } catch {
        toast.error("Failed to update user");
      } finally {
        toast.dismiss(toastId);
      }
    },
    [blockFunction, refetch] 
  );


  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={(term) => setSearchTerm(term)} // only update state
          onClear={() => setSearchTerm("")}
          placeholder="Search users..."
        />

        <button className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-4 py-3 shadow-lg hover:opacity-90">
          <UserPlus className="w-5 h-5" />
          <span className="ml-2">Add {title}</span>
        </button>
      </div>

      <div
        className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden 
                   **min-h-[400px] relative**" // <-- ADDED: min-height to stop vertical jump, relative for loading spinner
      >
        {loading && (
          // OPTIONAL: Overlay Spinner to maintain original structure/height
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm flex justify-center items-center z-10">
            <LoadingSpinner />
          </div>
        )}

        {error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : users.length === 0 && !loading ? (
          <div className="text-center py-20 text-gray-500">
            No {title} found.
          </div>
        ) : (
          // Added table-fixed for fixed column widths
          <table className="w-full text-left **table-fixed**">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                {/* Setting explicit column widths is highly recommended for fixed layout */}
                <th className="px-6 py-3 **w-1/3**">Name</th>
                <th className="px-6 py-3 **w-[120px]**">Courses</th>
                <th className="px-6 py-3 **w-[150px]**">Join Date</th>
                <th className="px-6 py-3 **w-[120px]**">Status</th>
                <th className="px-6 py-3 **w-[100px]**">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user._id} user={user} onBlock={handleBlock} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DetailsTable;
