"use client";
import { useState } from "react";
import BookmarkGrid from "@/components/grid/BookmarkGrid";
import AddBookmarkModal from "@/components/modals/addBookmarkModal";
import EditBookmarkModal from "@/components/modals/EditBookmarkModal";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Samboard</h1>

        {/* Dropdown */}
        <details className="dropdown dropdown-end">
          <summary className="btn btn-ghost btn-circle m-1">
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-40 p-2 shadow">
            <li>
              <button onClick={() => setModalOpen(true)}>Add Bookmark</button>
            </li>
            <li>
              <button onClick={() => setEditModalOpen(true)}>Edit Bookmarks</button>
            </li>
          </ul>
        </details>
      </div>

      <BookmarkGrid />

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
