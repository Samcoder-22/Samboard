"use client";
import { useEffect, useRef, useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
  const searchQuery = useBookmarksStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarksStore((s) => s.setSearchQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const encoded = encodeURIComponent(searchQuery.trim());
      window.location.href = `https://www.google.com/search?q=${encoded}`;
    }
  };

   const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    // Focus input when page first loads
    inputRef.current?.focus();
  }, []);


  const showPlaceholder = !isFocused && searchQuery === "";

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={showPlaceholder ? "Search bookmarks or Google..." : ""}
        className="input input-bordered w-full rounded-full h-14 text-lg pl-6 pr-12"
      />
      {searchQuery ? (
        <XMarkIcon
          className="h-6 w-6 absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={handleClear}
        />
      ) : (
        <MagnifyingGlassIcon
          className="h-6 w-6 absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      )}
    </div>
  );
}