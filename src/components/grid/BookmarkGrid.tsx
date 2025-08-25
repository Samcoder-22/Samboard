// "use client";
// import { useBookmarksStore } from "@/stores/bookmarkStore";

// export default function BookmarkGrid() {
//   const bookmarks = useBookmarksStore((state) => state.bookmarks);

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//       {bookmarks.map((bm) => (
//         <a
//           key={bm.id}
//           href={bm.url}
//           target="_blank"
//           rel="noreferrer"
//           className="p-4 bg-primary text-primary-content rounded-lg text-center hover:scale-105 transition-transform"
//         >
//           {bm.title}
//         </a>
//       ))}
//     </div>
//   );
// }

"use client";
import { useBookmarksStore } from "@/stores/bookmarkStore";

export default function BookmarkGrid() {
  const bookmarks = useBookmarksStore((s) => s.bookmarks);

  return (
    <div className="grid grid-cols-4 gap-4">
      {bookmarks.map((bm) => (
        <a key={bm.id} href={bm.url} target="_blank" className="flex flex-col items-center p-4 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
          {bm.icon && <img src={bm.icon} alt={bm.title} className="w-8 h-8 mb-2" />}
          <span className="text-sm">{bm.title}</span>
        </a>
      ))}
    </div>
  );
}
