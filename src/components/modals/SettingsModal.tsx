"use client";
import { triggerExportDownload } from "@/lib/bookmarkIO";
import { useBookmarksStore } from "@/stores/bookmarkStore";
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

  const bookmarks = useBookmarksStore((s) => s.bookmarks);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open bg-black/50 backdrop-blur-sm">
      <div className="modal-box max-w-4xl w-full h-[70vh] flex p-0 rounded-2xl shadow-xl bg-base-100 overflow-hidden relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50 text-base-content/70 hover:bg-base-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Sidebar */}
        <div className="w-1/4 bg-base-200/50 p-6 border-r border-base-content/5">
          <h2 className="text-xl font-bold mb-6 px-2">Settings</h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${active === section.id
                      ? "bg-primary text-primary-content font-medium shadow-sm"
                      : "hover:bg-base-200 text-base-content/70"
                    }`}
                  onClick={() => setActive(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {active === "appearance" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold mb-6">Appearance</h3>

              <div className="space-y-8">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <span className="label-text text-lg font-medium">Dark Mode</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={theme === "dark"}
                      onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                    />
                  </label>
                  <p className="text-sm opacity-60 mt-2">
                    Switch between light and dark themes for better visibility.
                  </p>
                </div>
              </div>
            </div>
          )}

          {active === "bookmarks" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold mb-6">Data Management</h3>

              <div className="card bg-base-200/50 p-6 rounded-xl border border-base-content/5">
                <h4 className="font-semibold text-lg mb-2">Export Data</h4>
                <p className="text-sm opacity-70 mb-4">
                  Download a JSON file containing all your bookmarks and settings.
                  Useful for backups or migrating to another device.
                </p>
                <div>
                  <button
                    className="btn btn-outline gap-2"
                    onClick={() => triggerExportDownload(bookmarks)}
                  >
                    Export Bookmarks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
