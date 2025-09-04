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

export default function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    // ensure https:// is added
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

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
      icon: `https://www.google.com/s2/favicons?sz=64&domain=${normalizedUrl}`,
    });

    setTitle("");
    setUrl("");
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-lg font-bold mb-4">Add Bookmark</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title (optional)"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL"
            className="input input-bordered w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
