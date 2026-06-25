"use client";
import { useEffect, useRef, useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchHistoryStore } from "@/stores/useSearchHistoryStore";
import { useSettingsStore, SearchEngine } from "@/stores/settingsStore";

export function getSearchUrl(query: string, engine: SearchEngine): string {
  const encoded = encodeURIComponent(query.trim());
  switch (engine) {
    case "Bing":
      return `https://www.bing.com/search?q=${encoded}`;
    case "DuckDuckGo":
      return `https://duckduckgo.com/?q=${encoded}`;
    case "StartPage":
      return `https://www.startpage.com/sp/search?query=${encoded}`;
    case "Google":
    default:
      return `https://www.google.com/search?q=${encoded}`;
  }
}

export default function SearchBar() {
  const searchQuery = useBookmarksStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarksStore((s) => s.setSearchQuery);
  const isBookmarksOnly = useBookmarksStore((s) => s.isBookmarksOnly);
  const setIsBookmarksOnly = useBookmarksStore((s) => s.setIsBookmarksOnly);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // track latest request
  const requestIdRef = useRef(0);

  const { history, addSearchRecord, removeSearchRecord } = useSearchHistoryStore();
  const isIncognito = useSettingsStore((s) => s.isIncognito);
  const searchEngine = useSettingsStore((s) => s.searchEngine);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    searchAPI(debouncedQuery).then((res) => {
      // ignore stale responses
      if (currentRequestId !== requestIdRef.current) return;

      setResults(res);
      setLoading(false);
    });
  }, [debouncedQuery]);
  function searchAPI(query: string): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([`Result for ${query}`]);
      }, 500);
    });
  }

  useEffect(() => {
    if (isBookmarksOnly && searchQuery.trim() !== "") {
      const filtered = useBookmarksStore.getState().getFilteredBookmarks();
      if (filtered.length === 1 && typeof window !== "undefined") {
        window.location.href = filtered[0].url;
      }
    }
  }, [searchQuery, isBookmarksOnly]);


  // Suggestions logic: only if >= 3 chars
  const maxSuggestions = isMobile ? 3 : 5;
  const suggestions =
    searchQuery.trim().length >= 3
      ? history
        .filter((h) => h.query.toLowerCase().includes(searchQuery.trim().toLowerCase()))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxSuggestions)
      : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      setIsBookmarksOnly(false);
      return;
    }

    // Dropdown Navigation
    if (suggestions.length > 0 && !isBookmarksOnly) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (isBookmarksOnly) {
        const filtered = useBookmarksStore.getState().getFilteredBookmarks();
        if (filtered.length > 0) {
          window.location.href = filtered[0].url;
        }
        return;
      }

      // If user selected from dropdown, search immediately
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectSuggestion(suggestions[selectedIndex].query);
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
        const trimmedQuery = searchQuery.trim();
        const isUrl = 
          trimmedQuery.toLowerCase().startsWith("http://") ||
          trimmedQuery.toLowerCase().startsWith("https://") ||
          trimmedQuery.toLowerCase().startsWith("www.") ||
          trimmedQuery.toLowerCase().endsWith(".com");

        if (isUrl) {
          let url = trimmedQuery;
          if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
          }
          window.location.href = url;
          return;
        }

        window.location.href = getSearchUrl(trimmedQuery, searchEngine);
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
    const trimmedQuery = query.trim();
    const isUrl = 
      trimmedQuery.toLowerCase().startsWith("http://") ||
      trimmedQuery.toLowerCase().startsWith("https://") ||
      trimmedQuery.toLowerCase().startsWith("www.") ||
      trimmedQuery.toLowerCase().endsWith(".com");

    if (isUrl) {
      let url = trimmedQuery;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      window.location.href = url;
      return;
    }

    window.location.href = getSearchUrl(trimmedQuery, searchEngine);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If user focuses an input/textarea, do not intercept
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        setIsBookmarksOnly(false);
        inputRef.current?.focus();
      } else if (e.key === "\\") {
        e.preventDefault();
        setIsBookmarksOnly(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [setIsBookmarksOnly]);

  const showPlaceholder = !isFocused && searchQuery === "";

  {
    loading && (
      <div className="mt-2 text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  {
    !loading && results.length > 0 && (
      <ul className="mt-2 bg-base-100 rounded-xl shadow-md border p-2">
        {results.map((r, i) => (
          <li key={i} className="px-3 py-2 hover:bg-base-200 rounded-md">
            {r}
          </li>
        ))}
      </ul>
    )
  }

  {
    !loading && debouncedQuery && results.length === 0 && (
      <div className="mt-2 text-sm text-gray-500">
        No results
      </div>
    )
  }

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
          setTimeout(() => {
            setIsFocused(false);
            setIsBookmarksOnly(false);
          }, 200);
        }}
        placeholder={
          isBookmarksOnly 
            ? (searchQuery === "" ? "Search bookmarks only..." : "")
            : (showPlaceholder 
                ? (isMobile ? "Search results and bookmarks" : "Search bookmarks or press '/'...") 
                : "")
        }
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
      {isFocused && !isBookmarksOnly && suggestions.length > 0 && (
        <ul className="search-suggestions-dropdown absolute bottom-full left-0 right-0 mb-2 bg-base-100 rounded-xl shadow-lg border border-base-200 py-2 z-50">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors text-[var(--modal-text-primary)] ${index === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                }`}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
              onClick={() => selectSuggestion(item.query)}
            >
              <div className="flex items-center gap-3">
                <MagnifyingGlassIcon className="h-4 w-4 opacity-50" />
                <span className="text-[var(--modal-text-primary)]">{item.query}</span>
              </div>
              <button
                className="p-1 hover:bg-base-300 rounded-md opacity-60 hover:opacity-100 transition-colors text-[var(--modal-text-secondary)]"
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