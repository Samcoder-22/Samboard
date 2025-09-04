"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface BookmarkPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookmarkPagination({
  page,
  totalPages,
  onPageChange,
}: BookmarkPaginationProps) {
  if (totalPages <= 1) return null; // hide if only one page

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
