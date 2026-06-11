import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  toggle: () => {
    const next = get().theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    set({ theme: next });
  },
}));