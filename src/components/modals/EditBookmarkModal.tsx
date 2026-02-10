"use client";
import { useState } from "react";
import { useBookmarksStore } from "@/stores/bookmarkStore";

export default function EditBookmarkModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { bookmarks, updateBookmark, removeBookmark, moveBookmark } =
    useBookmarksStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const startEdit = (id: string, currentTitle: string, currentUrl: string) => {
    setEditingId(id);
    setTitle(currentTitle);
    setUrl(currentUrl);
  };

  const saveEdit = () => {
    if (editingId) {
      updateBookmark(editingId, { title, url });
      setEditingId(null);
      setTitle("");
      setUrl("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open bg-black/50 backdrop-blur-sm">
      <div className="modal-box relative max-w-3xl p-6 rounded-2xl shadow-xl">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-6">Manage Bookmarks</h3>

        <div className="overflow-x-auto max-h-[60vh]">
          <table className="table w-full">
            <thead className="bg-base-200/50 sticky top-0 z-10">
              <tr>
                <th className="rounded-tl-lg">Title</th>
                <th>URL</th>
                <th className="rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-base-content/50">
                    No bookmarks yet. Add some to get started!
                  </td>
                </tr>
              ) : (
                bookmarks.map((bm, idx) => (
                  <tr key={bm.id} className="hover:bg-base-200/30 transition-colors">
                    <td className="w-1/3">
                      {editingId === bm.id ? (
                        <input
                          className="input input-sm input-bordered w-full focus:outline-none"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <div className="font-medium truncate max-w-[200px]" title={bm.title}>{bm.title}</div>
                      )}
                    </td>
                    <td className="w-1/3">
                      {editingId === bm.id ? (
                        <input
                          className="input input-sm input-bordered w-full focus:outline-none"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      ) : (
                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary truncate block max-w-[200px]"
                          title={bm.url}
                        >
                          {bm.url}
                        </a>
                      )}
                    </td>
                    <td className="flex gap-2 justify-end">
                      {editingId === bm.id ? (
                        <>
                          <button
                            className="btn btn-success btn-xs"
                            onClick={saveEdit}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => startEdit(bm.id, bm.title, bm.url)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                            onClick={() => removeBookmark(bm.id)}
                          >
                            Delete
                          </button>
                          <div className="flex gap-1 ml-2">
                            <button
                              className="btn btn-square btn-outline btn-xs"
                              disabled={idx === 0}
                              onClick={() => moveBookmark(bm.id, "up")}
                            >
                              ↑
                            </button>
                            <button
                              className="btn btn-square btn-outline btn-xs"
                              disabled={idx === bookmarks.length - 1}
                              onClick={() => moveBookmark(bm.id, "down")}
                            >
                              ↓
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-action mt-6">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
