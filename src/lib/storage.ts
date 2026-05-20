const DEFAULT_BOOKMARKS = [
  {}
];

export function getBookmarks() {
  if (typeof window === "undefined") return DEFAULT_BOOKMARKS;
  const data = localStorage.getItem("bookmarks");
  return data ? JSON.parse(data) : [];
}

export function saveBookmarks(bookmarks: unknown[]) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
