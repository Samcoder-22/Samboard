// import { create } from "zustand";

// interface Bookmark {
//   id: string;
//   title: string;
//   url: string;
// }

// interface BookmarkState {
//   bookmarks: Bookmark[];
//   addBookmark: (bm: Bookmark) => void;
// }

// export const useBookmarksStore = create<BookmarkState>((set) => ({
//   bookmarks: [
//     { id: "1", title: "Google", url: "https://google.com" },
//     { id: "2", title: "GitHub", url: "https://github.com" }
//   ],
//   addBookmark: (bm) =>
//     set((state) => ({ bookmarks: [...state.bookmarks, bm] }))
// }));

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
}

export const useBookmarksStore = create<BookmarkState>((set) => ({
  bookmarks: getBookmarks(),
  addBookmark: (bm) =>
    set((state) => {
      const updated = [...state.bookmarks, bm];
      saveBookmarks(updated);
      return { bookmarks: updated };
    }),
}));
