// components/grid/BookmarkGrid.tsx
"use client";
import { useEffect, useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import BookmarkPagination from "./BookmarkPagination";

interface BookmarkGridProps {
  rows?: number;
  cols?: number;
}

export default function BookmarkGrid({ rows = 1, cols = 4 }: BookmarkGridProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const getPaged = useBookmarksStore((s) => s.getPagedBookmarks);
  const getFiltered = useBookmarksStore((s) => s.getFilteredBookmarks);
  const searchQuery = useBookmarksStore((s) => s.searchQuery);

  const [page, setPage] = useState(1);

  const filtered = getFiltered();
  const perPage = rows * cols;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageBookmarks = getPaged(page, perPage);

  useEffect(() => {
    if (!mounted) return;
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page, mounted]);

  if (!mounted) {
    return (
      <div aria-hidden className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={`placeholder-${i}`} className="h-24 rounded-2xl glass" />
        ))}
      </div>
    );
  }

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
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-2xl shadow hover:shadow-lg transition glass"
          >
            {bm.icon ? (
              <img src={bm.icon} alt={bm.title} className="w-8 h-8 mb-2" />
            ) : (
              <div className="w-8 h-8 mb-2 rounded-full bg-slate-200 flex items-center justify-center">
                {bm.title?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-sm">{bm.title}</span>
          </a>
        ))}
      </div>

      {filtered.length === 0 && searchQuery && (
        <div className="mt-6 text-center">
          <p className="mb-2 ">No bookmarks found.</p>
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
