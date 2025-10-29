import React, { useEffect, useState } from "react"; // Import memo
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import {
  deleteCategory,
  updateCategory,
  getAllCategories,
  addCategory,
} from "@/api/adminApi";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Button } from "../../components/ui/button";
import EditCategoryDialog from "../../components/ui/EditCategoryDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: { $date: string };
  updated_at: { $date: string };
  __v: number;
}

// Use memo to prevent re-renders unless props change
const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const response: Category[] = await getAllCategories();
        console.log(response);
        setCategories(response);
        setLoading(false);

      } catch (error) {
        console.log(
          "error fetching categories in the categoryMangement component",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory: { name: string; description: string }) => {
    try {
      console.log("new category called ", newCategory);
      const response = await addCategory(newCategory);
      // Update the categories state to include the new category
      setCategories((prevCategories) => [...prevCategories, response.category]);
      toast.success(response.message);
    } catch (error) {
      toast.error("Error adding category. Please try again.");
      console.log("errro while adding a new category", error);
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/categories/${id}`);
  };

  const handleSaveChanges = async (
    category_id: string,
    data: { name: string; description: string }
  ) => {
    try {
      const response = await updateCategory(category_id, data);

      // Update category immediately in UI
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.category_id === response.category_id ? response : cat
        )
      );
    } catch (error) {
      console.error("Error while editing category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCategory(id);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.category_id === response.category_id ? response : cat
        )
      );
    } catch (error) {
      console.log("error while delting category", error);
    }
  };

  console.log("CategoryManagement: Rendering..."); // To show when re-renders happen

  return (loading ? <Spinner className="size-8 text-blue-500 justify-center"/> : (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Category Management
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Add, edit, or remove course categories for your platform.
      </p>

      {/* Main Category List Card */}
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Card Header with Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            List of Categories
          </h2>
          <EditCategoryDialog
            title="Create new Category"
            dialogDescription="Provide a name and description for the new category."
            defaultName={""}
            defaultDescription={""}
            onSave={(data) => handleAddCategory(data)}
            trigger={<Button icon={<Plus />}>Add Categor</Button>}
          />
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 sm:mb-0">
                {category.name}
              </p>
              <div className="flex space-x-2">
                {/* View Button */}
                <button
                  onClick={() => handleView(category.category_id)}
                  className="flex items-center justify-center w-full sm:w-auto text-sm font-medium px-3.5 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-colors"
                >
                  <Eye className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">View</span>
                </button>

                {/* Edit Button */}
                {/*testing ------------------------------------------------------*/}
                <EditCategoryDialog
                  title="Edit Category"
                  dialogDescription="Update the name and description for this category."
                  defaultName={category.name}
                  defaultDescription={category.description}
                  onSave={(data) =>
                    handleSaveChanges(category.category_id, data)
                  }
                  trigger={
                    <Button
                      variant="edit"
                      icon={<Pencil className="w-4 h-4 sm:mr-1.5" />}
                    >
                      Edit
                    </Button>
                  }
                />
                {/* Delete Button */}
                <ConfirmDialog
                  icon={<Trash2 className="w-4 h-4 sm:mr-1.5" />}
                  triggerText="Delete"
                  title="Confirm Deletion"
                  description={`Are you sure you want to delete ${category.name}`}
                  confirmText="Yes, Delete"
                  variant="destructive"
                  onConfirm={() => handleDelete(category.category_id)}
                />
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));
}; // Close the memo wrapper

export default CategoryManagement;
