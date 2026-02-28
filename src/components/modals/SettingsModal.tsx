"use client";
import { triggerExportDownload } from "@/lib/bookmarkIO";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSearchHistoryStore } from "@/stores/useSearchHistoryStore";

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
  { id: "search-history", label: "Search History" },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, setTheme, isDynamicTheme, setDynamicTheme } = useSettingsStore();
  const [active, setActive] = useState<string>(sections[0].id);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const { history: searchHistory, clearHistory, removeSearchRecord } = useSearchHistoryStore();

  // Group history by date string representing the local date
  const groupedHistory = searchHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((acc, item) => {
      const dateStr = new Date(item.timestamp).toLocaleDateString();
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(item);
      return acc;
    }, {} as Record<string, typeof searchHistory>);

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
                    <span className="label-text text-lg font-medium">Dynamic Sky Theme</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-secondary"
                      checked={isDynamicTheme}
                      onChange={(e) => setDynamicTheme(e.target.checked)}
                    />
                  </label>
                  <p className="text-sm opacity-60 mt-2">
                    Automatically changes the background based on the time of day.
                  </p>
                </div>

                <div className="form-control">
                  <label className={`label cursor-pointer justify-start gap-4 ${isDynamicTheme ? 'opacity-50' : ''}`}>
                    <span className="label-text text-lg font-medium">Dark Mode</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={theme === "dark"}
                      onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                      disabled={isDynamicTheme}
                    />
                  </label>
                  <p className="text-sm opacity-60 mt-2">
                    Switch between light and dark themes manually. (Disabled when Dynamic Theme is active)
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
          {active === "search-history" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Search History</h3>
                {searchHistory.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={clearHistory}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <p className="text-sm opacity-60">No search history available yet.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedHistory).map(([dateStr, items]) => (
                    <div key={dateStr} className="card bg-base-200/50 p-4 rounded-xl border border-base-content/5">
                      <h4 className="font-semibold text-lg mb-3 opacity-80">{dateStr}</h4>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item.id} className="flex justify-between items-center group p-2 hover:bg-base-300 rounded-lg transition-colors">
                            <span className="font-medium">{item.query}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs opacity-50">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button
                                className="p-1 hover:bg-base-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSearchRecord(item.id)}
                                title="Remove"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
