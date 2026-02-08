/**
 * App – Root Component
 *
 * Sets up the core providers (React Query, Theme, Tooltips, Router)
 * and defines the route structure:
 *   /          → TasksPage  (Kanban / List / Timeline)
 *   /settings  → SettingsPage (Theme + Language)
 *
 * ThemeProvider listens to the Zustand theme store and applies
 * the correct class to <html> so Tailwind's dark: variants work.
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Layout } from "./components/layout/Layout";
import { TasksPage } from "./pages/TasksPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useThemeStore } from "./store/themeStore";
import "./i18n";

// Single QueryClient instance shared across the entire app
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

/** Reactive theme wrapper — keeps <html> class in sync with Zustand */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
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
  }, [theme]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<TasksPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
