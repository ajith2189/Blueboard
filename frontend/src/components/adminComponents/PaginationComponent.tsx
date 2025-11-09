import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // helper: range of visible page numbers
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // show first, last, current, and nearby pages
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(currentPage - i) <= 1
      ) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pages.map((page, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis (if not showing all) */}
        {totalPages > 5 && <PaginationEllipsis />}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
