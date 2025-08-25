"use client";
import { useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";

export default function AddBookmarkModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const addBookmark = useBookmarksStore((s) => s.addBookmark);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");

  async function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUrl(value);

    try {
      const domain = new URL(value).hostname;
      setIcon(`https://www.google.com/s2/favicons?sz=64&domain=${domain}`);
      if (!title) setTitle(domain.replace("www.", ""));
    } catch {
      // Invalid URL — ignore
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    addBookmark({
      id: crypto.randomUUID(),
      title: title || url,
      url,
      icon: icon || "",
    });
    onClose();
    setUrl("");
    setTitle("");
    setIcon("");
  }

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Bookmark</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={handleUrlChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">Save</button>
        </form>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
