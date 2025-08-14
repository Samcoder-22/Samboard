"use client";
import { useBookmarksStore } from "@/stores/bookmarkStore";

export default function BookmarkGrid() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {bookmarks.map((bm) => (
        <a
          key={bm.id}
          href={bm.url}
          target="_blank"
          rel="noreferrer"
          className="p-4 bg-primary text-primary-content rounded-lg text-center hover:scale-105 transition-transform"
        >
          {bm.title}
        </a>
      ))}
    </div>
  );
}
