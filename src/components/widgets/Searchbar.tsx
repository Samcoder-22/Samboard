"use client";
import { useBookmarksStore } from "@/stores/bookmarkStore";

export default function SearchBar() {
  const searchQuery = useBookmarksStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarksStore((s) => s.setSearchQuery);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const encoded = encodeURIComponent(searchQuery.trim());
      window.location.href = `https://www.google.com/search?q=${encoded}`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search bookmarks or Google..."
        className="input input-bordered w-full rounded-full h-14 text-lg px-6"
      />
    </div>
  );
}
