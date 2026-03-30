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

const DEFAULT_BOOKMARKS = [
  {
    id: "default-github",
    title: "GitHub",
    url: "https://github.com/Samcoder-22",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    createdAt: Date.now()
  },
  {
    id: "default-linkedin",
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/m-s-sampath-kumar-reddy-06156a218/",
    icon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128",
    createdAt: Date.now() + 1
  },
  {
    id: "default-hn",
    title: "Hacker News",
    url: "https://news.ycombinator.com/",
    icon: "https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=128",
    createdAt: Date.now() + 2
  },
  {
    id: "default-chatgpt",
    title: "ChatGPT",
    url: "https://chatgpt.com/",
    icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
    createdAt: Date.now() + 3
  }
];

export function getBookmarks() {
  if (typeof window === "undefined") return DEFAULT_BOOKMARKS;
  const data = localStorage.getItem("bookmarks");
  return data ? JSON.parse(data) : DEFAULT_BOOKMARKS;
}

export function saveBookmarks(bookmarks: unknown[]) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
