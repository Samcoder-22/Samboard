// "use client";
// import { useState } from "react";
// import { useBookmarksStore } from "@/stores/bookmarkStore";
// import { getFallbackTitle } from "@/lib/getFallbackTitle";

// export default function AddBookmarkModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const addBookmark = useBookmarksStore((s) => s.addBookmark);

//   const [url, setUrl] = useState("");
//   const [title, setTitle] = useState("");
//   const [icon, setIcon] = useState("");

//   async function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const value = e.target.value;
//     setUrl(value);

//     try {
//       const domain = new URL(value).hostname;
//       setIcon(`https://www.google.com/s2/favicons?sz=64&domain=${domain}`);
//       // if (!title) setTitle(domain.replace("www.", ""));
//       setTitle(getFallbackTitle(domain));
//     } catch {
//       // Invalid URL — ignore
//       return "/default-favicon.png";
//     }
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!url) return;
//     addBookmark({
//       id: crypto.randomUUID(),
//       title: title || url,
//       url,
//       icon: icon || "",
//     });
//     onClose();
//     setUrl("");
//     setTitle("");
//     setIcon("");
//   }

//   if (!isOpen) return null;

//   return (
//     <div className="modal modal-open">
//       <div className="modal-box">
//         <h3 className="font-bold text-lg">Add Bookmark</h3>
//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           <input
//             type="url"
//             placeholder="https://example.com"
//             value={url}
//             onChange={handleUrlChange}
//             className="input input-bordered w-full"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="input input-bordered w-full"
//           />
//           <button type="submit" className="btn btn-primary w-full">
//             Save
//           </button>
//         </form>
//         <div className="modal-action">
//           <button className="btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBookmarkModal({
  isOpen,
  onClose,
}: AddBookmarkModalProps) {
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    // ensure https:// is added
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const hostname = (() => {
      try {
        return new URL(normalizedUrl).hostname;
      } catch {
        return "";
      }
    })();

    // if title input is blank, fallback from URL
    const fallbackTitle = (() => {
      try {
        const { hostname } = new URL(normalizedUrl);
        return hostname.replace("www.", "").split(".")[0];
      } catch {
        return "Untitled";
      }
    })();

    const finalTitle = title.trim() || fallbackTitle;

    addBookmark({
      id: Date.now().toString(),
      title: finalTitle,
      url: normalizedUrl,
      icon: hostname
        ? `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`
        : "",
    });

    setTitle("");
    setUrl("");
    onClose();
  };

  return (
    <div className="modal modal-open bg-black/50 backdrop-blur-sm">
      <div className="modal-box relative max-w-md p-6 rounded-2xl shadow-xl">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-6 text-center">Add New Bookmark</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">URL</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Title <span className="text-xs opacity-60">(Optional)</span></span>
            </label>
            <input
              type="text"
              placeholder="My Awesome Site"
              className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="modal-action mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-8">
              Save Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
