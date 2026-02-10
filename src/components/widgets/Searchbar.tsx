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
    const tryFocus = () => {
      if (document.hasFocus()) {
        inputRef.current?.focus();
      } else {
        window.focus?.();
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    };

    // try once, and again when window becomes focused
    tryFocus();
    window.addEventListener("focus", tryFocus);
    return () => window.removeEventListener("focus", tryFocus);
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
        onBlur={() => {
          // Optional: minimal delay to allow click on clear button to register before blur hides things (if you were hiding based on focus)
          setIsFocused(false)
        }}
        placeholder={showPlaceholder ? "Search bookmarks or Google..." : ""}
        className="input input-bordered w-full rounded-full h-14 text-lg pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {searchQuery ? (
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-1 hover:bg-base-200 rounded-full"
          onClick={handleClear}
          onMouseDown={(e) => e.preventDefault()} // Prevents blur on click
        >
          <XMarkIcon className="h-6 w-6 text-base-content/70" />
        </button>
      ) : (
        <MagnifyingGlassIcon
          className="h-6 w-6 absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-base-content/50"
        />
      )}
    </div>
  );
}