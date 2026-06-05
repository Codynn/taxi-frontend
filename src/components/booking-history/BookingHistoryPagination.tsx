"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingHistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function BookingHistoryPagination({
  currentPage,
  totalPages,
  onChange,
}: BookingHistoryPaginationProps) {
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex items-center justify-start gap-1.5 mt-2">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-[#2E2E2E] text-sm font-poppins"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className={[
              "w-10 h-10 flex items-center justify-center rounded-[8px] text-[16px] font-poppins transition-colors cursor-pointer",
              currentPage === page
                ? "bg-[#FEA800] text-black font-semibold"
                : "text-[#2E2E2E] hover:text-black",
            ].join(" ")}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
