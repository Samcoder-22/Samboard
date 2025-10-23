"use client";
import { useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import BookmarkPagination from "./BookmarkPagination";

interface BookmarkGridProps {
  rows?: number;
  cols?: number;
}

export default function BookmarkGrid({ rows = 1, cols = 4 }: BookmarkGridProps) {
  const [page, setPage] = useState(1);

  const getPaged = useBookmarksStore((s) => s.getPagedBookmarks!);
  const getFiltered = useBookmarksStore((s) => s.getFilteredBookmarks);
  const searchQuery = useBookmarksStore((s) => s.searchQuery);

  const filtered = getFiltered();
  const perPage = rows * cols;
  const totalPages = Math.ceil(filtered.length / perPage);

  const pageBookmarks = getPaged(page, perPage);

  return (
    <div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {pageBookmarks.map((bm) => (
          <a
            key={bm.id}
            href={bm.url}
            target="_blank"
            className="flex flex-col items-center p-4 bg-base-200 rounded-lg shadow hover:shadow-lg transition"
          >
            {bm.icon && (
              <img
                src={bm.icon}
                alt={bm.title}
                className="w-8 h-8 mb-2"
              />
            )}
            <span className="text-sm">{bm.title}</span>
          </a>
        ))}
      </div>

      {filtered.length === 0 && searchQuery && (
        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-gray-500">No bookmarks found.</p>
          {/* <a
            href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            className="btn btn-primary"
          >
            Search Google for {searchQuery}
          </a> */}
        </div>
      )}

      <BookmarkPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
