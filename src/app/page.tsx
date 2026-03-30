"use client";
import { useEffect, useRef, useState } from "react";
import BookmarkGrid from "@/components/grid/BookmarkGrid";
import AddBookmarkModal from "@/components/modals/addBookmarkModal";
import EditBookmarkModal from "@/components/modals/EditBookmarkModal";
import SettingsModal from "@/components/modals/SettingsModal";
import { EllipsisHorizontalIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SearchBar from "@/components/widgets/Searchbar";
import ClockWidget from "@/components/widgets/ClockWidget";
import { useSettingsStore } from "@/stores/settingsStore";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import { useGridLayout } from "@/hooks/useGridLayout"

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const { isIncognito, toggleIncognito } = useSettingsStore();
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const {cols, rows} = useGridLayout()
  // console.log(cols, rows)
  useDynamicTheme();

  //   useEffect(() => {
  //   updateDynamicWallpaper();

  //   const interval = setInterval(() => {
  //     updateDynamicWallpaper();
  //   }, 60 * 1000);

  //   return () => clearInterval(interval);
  // }, []);

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

  function Greeting({ name }: { name?: string }) {
    const hour = new Date().getHours();
    const greet =
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return (
      <div className="mb-2 text-sm opacity-80 select-none">
        {greet}{name ? `, ${name}` : ""}.
      </div>
    );
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") ?? "light";
    useSettingsStore.getState().setTheme(savedTheme);

    const savedDynamicThemeStr = localStorage.getItem("dynamicTheme");
    const savedDynamicTheme = savedDynamicThemeStr !== null ? savedDynamicThemeStr === "true" : true;
    useSettingsStore.getState().setDynamicTheme(savedDynamicTheme);

    const savedIncognito = localStorage.getItem("incognito") === "true";
    useSettingsStore.getState().setIncognito(savedIncognito);
  }, []);

  return (
    <div className="p-3 h-[100dvh] flex flex-col max-w-[2560px] max-h-[1440px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold opacity-20">Samboard</h1>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Incognito Toggle */}
          <button
            className={`btn btn-ghost btn-circle m-1 ${isIncognito ? "text-primary bg-primary/10" : "text-base-content/50"}`}
            onClick={toggleIncognito}
            title={isIncognito ? "Incognito Mode is ON" : "Incognito Mode is OFF"}

          >
            <EyeSlashIcon className="h-6 w-6" />
          </button>
          {/* Dropdown */}
          <details ref={dropdownRef} className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-circle m-1">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </summary>

            <ul className="menu dropdown-content rounded-box z-10 w-40 p-1 md:p-2 shadow backdrop-blur-md border border-solid glass">
              <li>
                <button onClick={() => {setModalOpen(true);dropdownRef.current?.removeAttribute("open");}}>Add Bookmark</button>
              </li>
              <li>
                <button onClick={() => {setEditModalOpen(true);dropdownRef.current?.removeAttribute("open");}}>
                  Edit Bookmarks
                </button>
              </li>
              <li>
                <button onClick={() => {setSettingsModalOpen(true);dropdownRef.current?.removeAttribute("open");}}>
                  Settings
                </button>
              </li>
            </ul>
          </details>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-1/3 md:h-2/5 md:mb-12 md:justify-end gap-12">
        {/* Search */}
        <ClockWidget />
        {/* <Greeting name="Samcoder" /> */}
        <div className="hidden md:block w-full max-w-xl">
          <SearchBar />
        </div>
      </div>

      {/* Bookmarks */}
      <div className="flex-1 overflow-y-auto md:w-[50vw] mx-auto rounded-2xl">
        <BookmarkGrid rows={rows} cols={cols} />
      </div>
      <div className="md:hidden block w-full max-w-xl">
        <SearchBar />
      </div>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => {setModalOpen(false);}}
      />
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
