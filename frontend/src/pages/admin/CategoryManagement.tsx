import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import PaginationComponent from "@/components/adminComponents/PaginationComponent";
import SearchInput from "@/components/ui/SearchInput";
import EditCategoryDialog from "@/components/ui/EditCategoryDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/api/adminApi";

interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: { $date: string };
  updated_at: { $date: string };
  __v: number;
}

const CategoryManagement: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: categories,
    loading,
    error,
    totalPages,
    page,
    setPage,
    refetch,
    updateParams
  } = usePaginatedFetch<Category>(getAllCategories, { limit: 3 });

  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      updateParams({ search: searchTerm || undefined });
    }, 600); 

    return () => clearTimeout(delay);
  }, [searchTerm, updateParams]);

  // ✅ Stable handlers using useCallback
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleAddCategory = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await addCategory(data);
      toast.success(response.message);
      refetch();
    } catch {
      toast.error("Error adding category. Please try again.");
    }
  };

  const handleEditCategory = async (
    id: string,
    data: { name: string; description: string }
  ) => {
    try {
      await updateCategory(id, data);
      toast.success("Category updated successfully!");
      refetch();
    } catch {
      toast.error("Error updating category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting category.");
    }
  };

  // ✅ CRITICAL: Only show full-screen spinner on INITIAL load
  const isInitialLoading = loading && categories.length === 0 && !searchTerm;
  
  if (isInitialLoading)
    return <Spinner className="size-8 text-blue-500 justify-center" />;
  if (error) return <p className="text-red-500">Error loading categories.</p>;

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Category Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add, edit, or remove categories for your platform.
        </p>
      </header>

      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search categories..."
          />

          <EditCategoryDialog
            title="Add New Category"
            dialogDescription="Provide name and description."
            defaultName=""
            defaultDescription=""
            onSave={handleAddCategory}
            trigger={<Button icon={<Plus />}>Add Category</Button>}
          />
        </div>

        {/* ✅ Inline loading indicator - doesn't unmount input */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Spinner className="size-5 text-blue-500" />
              <span className="text-sm">Searching...</span>
            </div>
          </div>
        )}

        {!loading && categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm 
                ? `No categories found matching "${searchTerm}"`
                : "No categories found. Add your first category to get started!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200"
              >
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 sm:mb-0">
                  {category.name}
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      navigate(`/admin/categories/${category.category_id}`)
                    }
                    variant="view"
                    icon={<Eye />}
                  >
                    View
                  </Button>

                  <EditCategoryDialog
                    title="Edit Category"
                    dialogDescription="Update name and description."
                    defaultName={category.name}
                    defaultDescription={category.description}
                    onSave={(data) =>
                      handleEditCategory(category.category_id, data)
                    }
                    trigger={
                      <Button variant="edit" icon={<Pencil />}>
                        Edit
                      </Button>
                    }
                  />

                  <ConfirmDialog
                    icon={<Trash2 />}
                    triggerText="Delete"
                    title="Confirm Deletion"
                    description={`Delete "${category.name}"?`}
                    variant="destructive"
                    onConfirm={() => handleDeleteCategory(category.category_id)}
                  />
                </div>
              </div>
            ))}
          </div>
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

export default CategoryManagement;