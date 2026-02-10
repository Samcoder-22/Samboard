"use client";
import { useEffect, useRef, useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
  const searchQuery = useBookmarksStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarksStore((s) => s.setSearchQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        const filtered = useBookmarksStore.getState().getFilteredBookmarks();
        if (filtered.length > 0) {
          window.location.href=filtered[0].url;
        }
        return;
      }

      if (searchQuery.trim() !== "") {
        const encoded = encodeURIComponent(searchQuery.trim());
        window.location.href = `https://www.google.com/search?q=${encoded}`;
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If user presses slash and not already focusing an input/textarea
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const showPlaceholder = !isFocused && searchQuery === "";

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Optional: minimal delay to allow click on clear button to register before blur hides things (if you were hiding based on focus)
          setIsFocused(false)
        }}
        placeholder={showPlaceholder ? "Search bookmarks or press '/'..." : ""}
        className="input input-bordered w-full rounded-full h-14 text-lg pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-shadow"
      />
      {searchQuery ? (
        <button
          className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 hover:bg-base-200 rounded-full z-10 transition-colors"
          onClick={handleClear}
          onMouseDown={(e) => e.preventDefault()} // Prevents blur on click
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5 text-base-content/70" />
        </button>
      ) : (
        <MagnifyingGlassIcon
          className="h-6 w-6 absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-base-content/50"
        />
      )}
    </div>
  );
}