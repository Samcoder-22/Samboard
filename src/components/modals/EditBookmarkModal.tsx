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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Manage Bookmarks</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.map((bm, idx) => (
                <tr key={bm.id}>
                  <td>
                    {editingId === bm.id ? (
                      <input
                        className="input input-sm input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    ) : (
                      bm.title
                    )}
                  </td>
                  <td>
                    {editingId === bm.id ? (
                      <input
                        className="input input-sm input-bordered w-full"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    ) : (
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary"
                      >
                        {bm.url}
                      </a>
                    )}
                  </td>
                  <td className="flex gap-2">
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
                          className="btn btn-primary btn-xs"
                          onClick={() => startEdit(bm.id, bm.title, bm.url)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => removeBookmark(bm.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          disabled={idx === 0}
                          onClick={() => moveBookmark(bm.id, "up")}
                        >
                          ↑
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          disabled={idx === bookmarks.length - 1}
                          onClick={() => moveBookmark(bm.id, "down")}
                        >
                          ↓
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
