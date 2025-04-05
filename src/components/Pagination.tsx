import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPageOptions?: number[];
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show 5 page numbers at most

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start and end based on current page position
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents the second ellipsis
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center mb-4 md:mb-0">
        <span className="text-sm text-gray-700">
          Showing {totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0} of{" "}
          {totalItems || 0} items
        </span>

        {onItemsPerPageChange && (
          <div className="ml-4 flex items-center">
            <span className="text-sm text-gray-700 mr-2">Items per page:</span>
            <select
              className="border border-gray-300 rounded-md text-sm p-1"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 text-sm rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === -1 || page === -2 ? (
              <span className="px-2 py-1 text-sm text-gray-700">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-2 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 text-sm rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
