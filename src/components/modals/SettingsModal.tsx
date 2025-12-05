"use client";
import { useSettingsStore } from "@/stores/settingsStore";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = {
  id: string;
  label: string;
};

const sections: SettingsSection[] = [
  { id: "appearance", label: "Appearance" },
  { id: "bookmarks", label: "Bookmarks" },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, setTheme } = useSettingsStore();
  const [active, setActive] = useState<string>(sections[0].id);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open glass">
      
      <div className="modal-box max-w-4xl w-full h-[70vh] flex p-0 glass rounded-3xl">
        {/* Sidebar */}
        <div className="w-1/4 border-r p-4 glass">
          <ul className="menu space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`w-full text-left p-2 rounded ${
                    active === section.id ? " font-semibold" : ""
                  }`}
                  onClick={() => setActive(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

<div className="modal-action absolute right-6 top-0">
        <div className="size-6 cursor-pointer" onClick={onClose}>
          <XMarkIcon className="text-white-500"/>
        </div>
      </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === "appearance" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Appearance</h2>
              <div className="space-y-6">
                {/* Wallpaper mode options */}
                {/* <div>
                  <h3 className="font-semibold mb-2">Wallpaper Mode</h3>
                  <div className="flex gap-3">
                    <button className="btn btn-sm">Plain</button>
                    <button className="btn btn-sm">Dynamic</button>
                    <button className="btn btn-sm">Image</button>
                  </div>
                </div> */}

                {/* Dark mode toggle */}
                <div>
                  <h3 className="font-semibold mb-2">Dark Mode</h3>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={theme === "dark"}
                    aria-label="Toggle dark mode"
                    onChange={(e) => {
                      // keep toggleTheme for convenience, or use setTheme directly:
                      if (e.target.checked) setTheme("dark");
                      else setTheme("light");
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {active === "bookmarks" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
              <div className="space-y-4">
                <button className="btn btn-outline">Export Bookmarks</button>
                <button className="btn btn-outline">Import Bookmarks</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal action */}
      
    </div>
  );
}
