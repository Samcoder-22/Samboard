import { create } from "zustand";

type Theme = "light" | "dark";

interface SettingsState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: (typeof window !== "undefined" && (localStorage.getItem("theme") as Theme)) || "light",

  setTheme: (t) => {
    set({ theme: t });
    localStorage.setItem("theme", t);

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
    }
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next);
  },
}));
