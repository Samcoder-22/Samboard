// export const storage = {
//   get<T>(key: string, fallback: T): T {
//     if (typeof window === "undefined") return fallback;
//     try {
//       const item = localStorage.getItem(key);
//       return item ? JSON.parse(item) : fallback;
//     } catch {
//       return fallback;
//     }
//   },
//   set<T>(key: string, value: T) {
//     if (typeof window === "undefined") return;
//     localStorage.setItem(key, JSON.stringify(value));
//   }
// };

export function getBookmarks() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("bookmarks");
  return data ? JSON.parse(data) : [];
}

export function saveBookmarks(bookmarks: any[]) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
