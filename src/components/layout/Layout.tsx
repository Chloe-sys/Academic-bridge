/**
 * Layout Component
 *
 * The shell that wraps every page. It provides:
 * - A collapsible sidebar (fixed on desktop, overlay on mobile)
 * - A main content area rendered via <Outlet />
 * - Responsive breakpoint detection (< 1024px = mobile)
 * - Automatic sidebar close on route changes (mobile only)
 *
 * The `onToggleSidebar` and `isMobile` values are passed to child
 * pages through React Router's outlet context so that pages like
 * Settings can render a mobile menu button without prop-drilling.
 */

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "../../lib/utils";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const location = useLocation();

  // Detect mobile breakpoint on mount and resize
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close the mobile sidebar whenever the user navigates
  useEffect(() => {
    if (isMobile) setShowMobileSidebar(false);
  }, [location.pathname, isMobile]);

  const toggle = () => {
    if (isMobile) setShowMobileSidebar(!showMobileSidebar);
    else setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0F172A] overflow-hidden">
      {/* Mobile backdrop */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 z-50",
          isMobile
            ? cn("fixed inset-y-0 left-0", showMobileSidebar ? "translate-x-0" : "-translate-x-full")
            : ""
        )}
      >
        <Sidebar collapsed={isMobile ? false : sidebarCollapsed} onToggle={toggle} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#F9FAFB] dark:bg-slate-950">
        <Outlet context={{ onToggleSidebar: toggle, isMobile }} />
      </main>
    </div>
  );
}
