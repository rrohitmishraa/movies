import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const visibleCount = 3;
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, start + visibleCount - 1);

  return (
    <div className="mt-10 sm:mt-14 border-t border-gray-200 pt-4 sm:pt-6 text-[10px] sm:text-xs text-gray-500 flex justify-end gap-3 sm:gap-4">
      <span className="text-red-500">PAGES:</span>

      <button
        onClick={() => onPageChange(1)}
        className={
          currentPage === 1
            ? "text-red-500 font-semibold"
            : "text-gray-500 hover:text-red-500"
        }
      >
        1
      </button>

      {start > 2 && <span className="text-gray-400">...</span>}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "text-red-500 font-semibold"
                : "text-gray-500 hover:text-red-500"
            }
          >
            {page}
          </button>
        ),
      )}

      {end < totalPages - 1 && <span className="text-gray-400">...</span>}

      <button
        onClick={() => onPageChange(totalPages)}
        className={
          currentPage === totalPages
            ? "text-red-500 font-semibold"
            : "text-gray-500 hover:text-red-500"
        }
      >
        {totalPages}
      </button>
    </div>
  );
}
