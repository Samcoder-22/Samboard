import { create } from "zustand";
import { getBookmarks, saveBookmarks } from "@/lib/storage";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bm: Bookmark) => void;
  updateBookmark: (id: string, updated: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
  moveBookmark: (id: string, direction: "up" | "down") => void;
}

export const useBookmarksStore = create<BookmarkState>((set) => ({
  bookmarks: getBookmarks(),

  addBookmark: (bm) =>
    set((state) => {
      const updated = [...state.bookmarks, bm];
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
}));
