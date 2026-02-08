/**
 * Theme Store (Zustand)
 *
 * Manages the user's theme preference (light / dark / system).
 * Persisted to localStorage so the choice survives page reloads.
 * On load, I immediately apply the saved theme to <html> so there's
 * no flash of the wrong colour scheme.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/** Apply the correct class and color-scheme to the document root */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  let effective: "light" | "dark";
  if (theme === "system") {
    effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } else {
    effective = theme;
  }

  root.classList.add(effective);
  root.style.colorScheme = effective;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    { name: "theme-storage" }
  )
);

// Apply the saved theme immediately on page load (avoids FOUC)
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("theme-storage");
  if (saved) {
    try {
      const { state } = JSON.parse(saved);
      applyTheme(state.theme || "light");
    } catch {
      applyTheme("light");
    }
  } else {
    applyTheme("light");
  }

  // Re-apply when the OS-level theme changes (relevant for "system" mode)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (useThemeStore.getState().theme === "system") applyTheme("system");
    });
}
