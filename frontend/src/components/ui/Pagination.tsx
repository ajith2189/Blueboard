import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

/**
 * A styled pagination component designed to match the admin dashboard's aesthetic.
 * It's meant to be placed at the bottom of a content card.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null; // Don't render if only one page

  // Logic to get page numbers, including siblings and ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalNumbers = siblingCount * 2 + 3; //
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

      pages.push(1);
      if (startPage > 2) pages.push("...");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Button style for active page
  const activeBtnClasses =
    "flex items-center justify-center px-3.5 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg";

  // Button style for inactive pages and prev/next
  const inactiveBtnClasses =
    "flex items-center justify-center px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    // This container should be placed at the bottom of your list, inside the card
    <div className="flex justify-center items-center space-x-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
      {/* Previous Button */}
      <button
        className={inactiveBtnClasses}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center justify-center px-3.5 py-2 text-sm font-medium text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={
              page === currentPage ? activeBtnClasses : inactiveBtnClasses
            }
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        className={inactiveBtnClasses}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
