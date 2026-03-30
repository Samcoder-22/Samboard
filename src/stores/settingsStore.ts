// stores/settingsStore.ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface SettingsState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isIncognito: boolean;
  toggleIncognito: () => void;
  setIncognito: (v: boolean) => void;
  isDynamicTheme: boolean;
  setDynamicTheme: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: "light",

  setTheme: (t: Theme) => {
    set({ theme: t });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", t);
      } catch { }
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
    }
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next);
  },

  isDynamicTheme: true,

  setDynamicTheme: (v: boolean) => {
    set({ isDynamicTheme: v });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("dynamicTheme", v.toString());
      } catch { }
    }
  },

  isIncognito: false,

  setIncognito: (v: boolean) => {
    set({ isIncognito: v });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("incognito", v.toString());
      } catch { }
    }
  },

  toggleIncognito: () => {
    const next = !get().isIncognito;
    get().setIncognito(next);
  },
}));
