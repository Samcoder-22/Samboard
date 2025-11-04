"use client";
import { useEffect, useRef, useState } from "react";
import BookmarkGrid from "@/components/grid/BookmarkGrid";
import AddBookmarkModal from "@/components/modals/addBookmarkModal";
import EditBookmarkModal from "@/components/modals/EditBookmarkModal";
import SettingsModal from "@/components/modals/SettingsModal";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import SearchBar from "@/components/widgets/Searchbar";
import ClockWidget from "@/components/widgets/ClockWidget";
// import { updateDynamicWallpaper } from "@/lib/utils/updateDynamicWallpaper";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
const dropdownRef = useRef<HTMLDetailsElement>(null);

//   useEffect(() => {
//   updateDynamicWallpaper();

//   const interval = setInterval(() => {
//     updateDynamicWallpaper();
//   }, 60 * 1000); 

//   return () => clearInterval(interval);
// }, []); 

useEffect(() => {
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  const theme = saved ?? "light";
  document.documentElement.setAttribute("data-theme", theme);
}, []);


useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false; // close the <details>
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-6 h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Samboard</h1>

        {/* Dropdown */}
        <details ref={dropdownRef} className="dropdown dropdown-end">
          <summary className="btn btn-ghost btn-circle m-1">
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </summary>
          <ul className="menu dropdown-content rounded-box z-10 w-40 p-2 shadow">
            <li>
              <button onClick={() => setModalOpen(true)}>Add Bookmark</button>
            </li>
            <li>
              <button onClick={() => setEditModalOpen(true)}>
                Edit Bookmarks
              </button>
            </li>
            <li>
              <button onClick={() => setSettingsModalOpen(true)}>
                Settings
              </button>
            </li>
          </ul>
        </details>
      </div>

      <div className="flex flex-col items-center justify-center h-1/3 md:h-2/5 md:mb-12 md:justify-end gap-12">
        {/* Search */}
        <ClockWidget />
        <div className="hidden md:block w-full max-w-xl">
          <SearchBar />
        </div>
      </div>

      {/* Bookmarks */}
      <div className="flex-1 overflow-y-auto md:w-[80vw] mx-auto">
        <BookmarkGrid rows={3} cols={4} />
      </div>
      <div className="md:hidden block w-full max-w-xl">
        <SearchBar />
      </div>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={()=> setSettingsModalOpen(false)}
        />
    </div>
  );
}
