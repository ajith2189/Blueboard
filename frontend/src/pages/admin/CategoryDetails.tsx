import { ArrowLeft, BookOpen, Calendar, Hash } from "lucide-react";
import {  useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategoryById } from "@/api/adminApi";
import { Spinner } from "@/components/ui/spinner";
// import { getCategoryById } from "@/api/categoryApi";

// This interface must match the one in CategoryManagement.tsx
interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: { $date: string };
  updated_at: { $date: string };
}

// Mock course data for demonstration
const mockCourses = [
  {
    id: "c1",
    title: "Introduction to Business Management",
    tutor: "Dr. Emily White",
    price: 49.99,
  },
  {
    id: "c2",
    title: "Advanced Financial Modeling",
    tutor: "Prof. James Brown",
    price: 89.99,
  },
  {
    id: "c3",
    title: "Digital Marketing Fundamentals",
    tutor: "Sarah Jenkins",
    price: 39.99,
  },
];

// Helper to format the date
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const CategoryDetails = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        console.warn("No category id provided");
        return;
      }

      try {
        const response = await getCategoryById(id);
        setCategory(response);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  if (!category) return <Spinner />;

  return (
    <div className="p-4 md:p-6">
      {/* Page Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
        onClick={() => navigate(-1)}
        
        className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1.5" />
          Back to Categories
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        {category.name}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Detailed view of the category and its associated courses.
      </p>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Category Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Category Details
            </h2>
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {category.description || "No description provided."}
                </p>
              </div>

              {/* Category ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Category ID
                </h3>
                <p className="flex items-center text-gray-800 dark:text-gray-200 font-mono text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded-md">
                  <Hash className="w-4 h-4 mr-2 text-gray-500" />
                  {category.category_id}
                </p>
              </div>

              {/* Created Date */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Date Created
                </h3>
                <p className="flex items-center text-gray-800 dark:text-gray-200">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {formatDate(category.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Associated Courses */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Associated Courses
            </h2>
            <div className="space-y-3">
              {mockCourses.length > 0 ? (
                mockCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                        {course.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {course.tutor}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${course.price}
                      </p>
                      <button className="flex items-center justify-center text-sm font-medium px-3.5 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors">
                        <BookOpen className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">View Course</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No courses are associated with this category yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
