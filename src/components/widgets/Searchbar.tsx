"use client";
import { useEffect, useRef, useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchHistoryStore } from "@/stores/useSearchHistoryStore";
import { useSettingsStore } from "@/stores/settingsStore";

export default function SearchBar() {
  const searchQuery = useBookmarksStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarksStore((s) => s.setSearchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { history, addSearchRecord, removeSearchRecord } = useSearchHistoryStore();
  const isIncognito = useSettingsStore((s) => s.isIncognito);

  // Suggestions logic: only if >= 3 chars
  const suggestions =
    searchQuery.trim().length >= 3
      ? history
        .filter((h) => h.query.toLowerCase().includes(searchQuery.trim().toLowerCase()))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
      : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Dropdown Navigation
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // If user selected from dropdown, set query to that
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        setSearchQuery(suggestions[selectedIndex].query);
        setSelectedIndex(-1);
        // Optional: you can immediately search that query here if desired
        return;
      }

      // Execute search
      if (e.shiftKey) {
        const filtered = useBookmarksStore.getState().getFilteredBookmarks();
        if (filtered.length > 0) {
          window.location.href = filtered[0].url;
        }
        return;
      }

      if (searchQuery.trim() !== "") {
        if (!isIncognito) {
          addSearchRecord(searchQuery);
        }
        if (searchQuery.trim().endsWith(".com")) {
          const url = searchQuery.trim();
          window.location.href = `https://${url}`;
          return;
        }
        const encoded = encodeURIComponent(searchQuery.trim());
        window.location.href = `https://www.google.com/search?q=${encoded}`;
      }
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
    setSelectedIndex(-1);
  };

  const selectSuggestion = (query: string) => {
    setSearchQuery(query);
    if (!isIncognito) {
      addSearchRecord(query);
    }
    inputRef.current?.focus();
    setSelectedIndex(-1);

    // Perform search immediately
    const encoded = encodeURIComponent(query.trim());
    window.location.href = `https://www.google.com/search?q=${encoded}`;
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
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay to allow click on suggestions or clear button to register
          setTimeout(() => setIsFocused(false), 200);
        }}
        placeholder={showPlaceholder ? "Search bookmarks or press '/'..." : ""}
        className="input input-bordered w-full rounded-full h-14 text-lg pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-shadow"
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
        <MagnifyingGlassIcon className="h-6 w-6 absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-base-content/50" />
      )}

      {/* Dropdown Suggestions */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-lg border border-base-200 py-2 z-50">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${index === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                }`}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
              onClick={() => selectSuggestion(item.query)}
            >
              <div className="flex items-center gap-3">
                <MagnifyingGlassIcon className="h-4 w-4 opacity-50" />
                <span>{item.query}</span>
              </div>
              <button
                className="p-1 hover:bg-base-300 rounded-md opacity-60 hover:opacity-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearchRecord(item.id);
                }}
                title="Remove from history"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}