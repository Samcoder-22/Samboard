// import MainLayout from "@/components/layout/MainLayout";
// import ClockWidget from "@/components/widgets/ClockWidget";
// import BookmarkGrid from "@/components/grid/BookmarkGrid";

// export default function HomePage() {
//   return (
//     <MainLayout>
//       <div className="flex flex-col gap-6">
//         <ClockWidget />
//         <BookmarkGrid />
//       </div>
//     </MainLayout>
//   );
// }

"use client";
import { useState } from "react";
import BookmarkGrid from "@/components/grid/BookmarkGrid";
import AddBookmarkModal from "@/components/modals/addBookmarkModal";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Homepage</h1>
        <details className="dropdown dropdown-end">
          <summary className="btn m-1">open or close</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-45 p-2 shadow-sm">
            {/* <li>
              <a>Item 1</a>
            </li> */}
            <button
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Add Bookmark
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Edit Bookmarks
            </button>
            {/* <li>
              <a>Item 2</a>
            </li> */}
          </ul>
        </details>
      </div>
      <BookmarkGrid />
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      /> */}
    </div>
  );
}
