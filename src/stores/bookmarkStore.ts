// import { create } from "zustand";
// import { getBookmarks, saveBookmarks } from "@/lib/storage";

// export interface Bookmark {
//   id: string;
//   title: string;
//   url: string;
//   icon: string;
// }

// interface BookmarkState {
//   bookmarks: Bookmark[];
//   addBookmark: (bm: Bookmark) => void;
//   updateBookmark: (id: string, updated: Partial<Bookmark>) => void;
//   removeBookmark: (id: string) => void;
//   moveBookmark: (id: string, direction: "up" | "down") => void;
// }

// export const useBookmarksStore = create<BookmarkState>((set) => ({
//   bookmarks: getBookmarks(),

//   addBookmark: (bm) =>
//     set((state) => {
//       const updated = [...state.bookmarks, bm];
//       saveBookmarks(updated);
//       return { bookmarks: updated };
//     }),

//   updateBookmark: (id, updated) =>
//     set((state) => {
//       const updatedBookmarks = state.bookmarks.map((bm) =>
//         bm.id === id ? { ...bm, ...updated } : bm
//       );
//       saveBookmarks(updatedBookmarks);
//       return { bookmarks: updatedBookmarks };
//     }),

//   removeBookmark: (id) =>
//     set((state) => {
//       const updatedBookmarks = state.bookmarks.filter((bm) => bm.id !== id);
//       saveBookmarks(updatedBookmarks);
//       return { bookmarks: updatedBookmarks };
//     }),

//   moveBookmark: (id, direction) =>
//     set((state) => {
//       const index = state.bookmarks.findIndex((bm) => bm.id === id);
//       if (index === -1) return state;

//       const updated = [...state.bookmarks];
//       if (direction === "up" && index > 0) {
//         [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
//       } else if (direction === "down" && index < updated.length - 1) {
//         [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
//       }

//       saveBookmarks(updated);
//       return { bookmarks: updated };
//     }),
// }));

import { create } from "zustand";
import { getBookmarks, saveBookmarks } from "@/lib/storage";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon: string;
  createdAt?: number; // optional, used for "recent" sort
}

type SortBy = "manual" | "title" | "recent";

interface BookmarkState {
  bookmarks: Bookmark[];

  addBookmark: (bm: Bookmark) => void;
  updateBookmark: (id: string, updated: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
  moveBookmark: (id: string, direction: "up" | "down") => void;

  // Search + sort
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;

  // Derived selectors
  getFilteredBookmarks: () => Bookmark[];
  getPagedBookmarks?: (page: number, pageSize: number) => Bookmark[];
}

// utils
const toLower = (v: string | undefined | null) => (v ?? "").toLowerCase();
const safeHost = (rawUrl: string) => {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return "";
  }
};

export const useBookmarksStore = create<BookmarkState>((set, get) => ({
  bookmarks: getBookmarks(),

  addBookmark: (bm) =>
    set((state) => {
      const withCreatedAt: Bookmark = {
        createdAt: Date.now(),
        ...bm,
      };
      const updated = [...state.bookmarks, withCreatedAt];
      saveBookmarks(updated);
      return { bookmarks: updated };
    }),

  updateBookmark: (id, updated) =>
    set((state) => {
      const updatedBookmarks = state.bookmarks.map((bm) =>
        bm.id === id ? { ...bm, ...updated } : bm
      );
      saveBookmarks(updatedBookmarks);
      return { bookmarks: updatedBookmarks };
    }),

  removeBookmark: (id) =>
    set((state) => {
      const updatedBookmarks = state.bookmarks.filter((bm) => bm.id !== id);
      saveBookmarks(updatedBookmarks);
      return { bookmarks: updatedBookmarks };
    }),

  moveBookmark: (id, direction) =>
    set((state) => {
      const index = state.bookmarks.findIndex((bm) => bm.id === id);
      if (index === -1) return state;

      const updated = [...state.bookmarks];
      if (direction === "up" && index > 0) {
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      } else if (direction === "down" && index < updated.length - 1) {
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
      }

      saveBookmarks(updated);
      return { bookmarks: updated };
    }),

  // 🔎 Search + sort state
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  sortBy: "manual",
  setSortBy: (s) => set({ sortBy: s }),

  // 🔎 Derived selector: central place to filter + sort
  getFilteredBookmarks: () => {
    const { bookmarks, searchQuery, sortBy } = get();
    const q = toLower(searchQuery).trim();

    // 1) Filter (title, full URL, hostname)
    const results = q
      ? bookmarks.filter((b) => {
          const title = toLower(b.title);
          const url = toLower(b.url);
          const host = safeHost(b.url);
          return (
            title.includes(q) ||
            url.includes(q) ||
            host.includes(q)
          );
        })
      : [...bookmarks];

    // 2) Sort
    switch (sortBy) {
      case "title":
        results.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "", undefined, {
            sensitivity: "base",
          })
        );
        break;

      case "recent":
        // newest first; fall back to manual if missing
        results.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        break;

      case "manual":
      default:
        // keep array order as-is (matches manual move up/down)
        break;
    }

    return results;
  },

  // (optional) helper to slice for pagination — use if you like
  getPagedBookmarks: (page: number, pageSize: number) => {
    const items = get().getFilteredBookmarks();
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  },
}));
