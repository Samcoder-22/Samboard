"use client";
import { triggerExportDownload } from "@/lib/bookmarkIO";
import { useBookmarksStore } from "@/stores/bookmarkStore";
import { useSettingsStore, SearchEngine } from "@/stores/settingsStore";
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
  { id: "search-engine", label: "Search Engine" },
  { id: "search-history", label: "Search History" },
  { id: "about", label: "About Samboard" },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    theme, 
    toggleTheme, 
    setTheme, 
    isDynamicTheme, 
    setDynamicTheme,
    searchEngine,
    setSearchEngine
  } = useSettingsStore();
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
    <div className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box max-w-4xl h-[80vh] md:h-[70vh] flex flex-col md:flex-row p-0 rounded-2xl backdrop-blur-md shadow-3xl bg-base-100 overflow-hidden relative border border-solid">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50 text-base-content/70 hover:bg-base-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-base-200/50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-base-content/5 flex-shrink-0">
          <h2 className="text-xl font-bold mb-2 md:mb-6 px-2 hidden md:block">Settings</h2>
          <div className="mt-4 md:mt-0">
          <ul className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-2 pb-2 md:pb-0 scrollbar-hide">
            {sections.map((section) => (
              <li key={section.id} className="flex-shrink-0">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all whitespace-nowrap ${active === section.id
                    ? "bg-primary text-primary-content font-medium shadow-sm"
                    : "hover:bg-base-200 text-[var(--modal-text-secondary)]"
                    }`}
                  onClick={() => setActive(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 bg-base-200/25 overflow-y-auto w-full">
          {active === "appearance" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold mb-6">Appearance</h3>

              <div className="space-y-8 bg-base-200/50 p-6 rounded-xl">
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

          {active === "search-engine" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold mb-4">Search Engine</h3>
              <p className="text-sm opacity-70 mb-6">
                Choose your default search engine. All search queries that are not direct URLs will be redirected to the selected provider.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {(["Google", "Bing", "StartPage", "DuckDuckGo"] as SearchEngine[]).map((engine) => {
                  const isSelected = searchEngine === engine;
                  return (
                    <button
                      key={engine}
                      onClick={() => setSearchEngine(engine)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          : "bg-base-200/50 border-base-content/5 hover:bg-base-200"
                      }`}
                    >
                      {/* Search Engine Icon/Placeholder */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-base-100 shadow-inner">
                        <span className="text-xl font-bold text-primary">
                          {engine.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Search Engine Name */}
                      <span className={`font-semibold text-lg ${isSelected ? "text-primary" : "text-[var(--modal-text-primary)]"}`}>
                        {engine}
                      </span>
                      
                      {/* Selection indicator */}
                      {/* <div className="mt-4 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-primary animate-pulse" : "bg-base-content/20"}`} />
                        <span className="text-xs opacity-60">
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </div> */}
                    </button>
                  );
                })}
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
                            <span className="font-medium text-[var(--modal-text-primary)]">{item.query}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs opacity-50">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button
                                className="p-1 hover:bg-base-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-[var(--modal-text-secondary)]"
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

          {active === "about" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold mb-6">About Samboard</h3>

              <div className="space-y-6 bg-base-200/50 p-6 rounded-2xl border border-base-content/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-md overflow-hidden">

                      <img src="./favicon.ico" alt="Samboard" width={100} height={100} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--modal-text-primary)]">Samboard</h4>
                    <p className="text-sm opacity-70 mt-1">
                      Focused browsing with local-first control.
                    </p>
                  </div>
                </div>

                <div className="divider opacity-10 my-2" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    {/* <span className="font-semibold text-[var(--modal-text-secondary)]">Developer</span> */}
                    <span className="font-medium text-[var(--modal-text-primary)]">Built by Sampath</span>
                  </div>
                </div>

                {/* <div className="divider opacity-10 my-2" /> */}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <a
                    href="https://github.com/Samcoder-22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline hover:bg-base-content/10 flex items-center justify-center gap-2 transition-all duration-300 rounded-xl py-3 text-center border-base-content/10 font-semibold"
                  >
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/m-s-sampath-kumar-reddy-06156a218/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline hover:bg-base-content/10 flex items-center justify-center gap-2 transition-all duration-300 rounded-xl py-3 text-center border-base-content/10 font-semibold"
                  >
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
