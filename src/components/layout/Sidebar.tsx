/**
 * Sidebar Component
 *
 * Renders the fixed left navigation panel with:
 * - App branding (logo + name + trial badge)
 * - Primary navigation items (Search, AI, Inbox, Calendar, Settings)
 * - Shared / Private page sections with drag handles
 * - Account section with user avatar
 * - Upgrade promotional card at the bottom
 *
 * The Settings nav item uses react-router to navigate to /settings.
 * Sidebar can collapse on desktop and slides in/out on mobile via the Layout.
 */

import { Link, useLocation } from "react-router-dom";
import {
  Search, Sparkles, Inbox, Calendar, Settings,
  ChevronDown, ChevronLeft, MoreHorizontal,
  GripVertical, Flame, Sun,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const isSettings = location.pathname === "/settings";

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-slate-100 bg-[#F8FAFC] dark:bg-[#1E293B] transition-all duration-300 shrink-0",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* ── Branding ── */}
      <div className="flex items-center justify-between px-5 h-[80px] shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
            <Sun className="w-6 h-6 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[17px] text-slate-800 dark:text-white tracking-tight">
                Klaboard
              </span>
              <span className="text-[12px] font-bold text-[#6366F1] dark:text-[#A78BFA] flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] dark:bg-[#A78BFA]" />
                free-trial
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center bg-white dark:bg-[#334155] border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" strokeWidth={3} />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-0.5 custom-scrollbar">
        <NavItem icon={Search} label="Search" collapsed={collapsed} />
        <NavItem icon={Sparkles} label="Kla AI" collapsed={collapsed} />
        <NavItem
          icon={Inbox}
          label="Inbox"
          collapsed={collapsed}
          badge={
            <span className="bg-[#EDE9FE] dark:bg-[#4C1D95]/50 text-[#7C3AED] dark:text-[#A78BFA] text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ml-auto">
              <Flame className="w-3 h-3 fill-[#7C3AED] dark:fill-[#A78BFA]" /> New
            </span>
          }
        />
        <NavItem icon={Calendar} label="Calendar" collapsed={collapsed} />

        {/* Settings — navigates to /settings */}
        <Link to="/settings">
          <div
            className={cn(
              "flex items-center p-2.5 rounded-xl group cursor-pointer transition-colors",
              isSettings
                ? "bg-[#EEF2FF] dark:bg-[#4C1D95]/30"
                : "hover:bg-slate-100/50 dark:hover:bg-slate-700/30"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                isSettings
                  ? "text-[#6366F1] dark:text-[#A78BFA]"
                  : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white"
              )}
            >
              <Settings className="w-[20px] h-[20px]" strokeWidth={1.5} />
              {!collapsed && (
                <span className="text-[14px] font-semibold">Settings & Preferences</span>
              )}
            </div>
          </div>
        </Link>

        {/* ── Shared Pages ── */}
        {!collapsed && (
          <div className="pt-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Shared Pages
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              <PageItem active label="HR Tasks Hub" icon="bg-[#FEE2E2] text-[#EF4444]" glyph="≡" />
              <PageItem label="Windah Comp" icon="bg-[#DCFCE7] text-[#22C55E]" glyph="G" />
              <PageItem label="NoSpace Dev" icon="bg-[#FEF3C7] text-[#F59E0B]" glyph="C" />
            </div>
          </div>
        )}

        {/* ── Private Pages ── */}
        {!collapsed && (
          <div className="pt-5">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Private Pages
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <PageItem label="Dribbble Portfolio" icon="bg-[#E0E7FF] text-[#6366F1]" glyph="◎" />
          </div>
        )}

        {/* ── Account ── */}
        {!collapsed && (
          <div className="pt-5">
            <div className="flex items-center justify-between group p-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teheran"
                  className="w-9 h-9 rounded-lg object-cover shadow-sm"
                  alt="User avatar"
                />
                <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">Teheran</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}
      </nav>

      {/* ── Upgrade Card ── */}
      {!collapsed && (
        <div className="px-4 pb-4 mt-auto">
          <div className="relative bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-700 rounded-[24px] overflow-visible shadow-sm text-center">
            {/* Gradient top section */}
            <div
              className="h-24 w-full rounded-t-[24px]"
              style={{
                background: "radial-gradient(circle at 50% 100%, #FF00FF 0%, #7C3AED 50%, #4F46E5 100%)",
                opacity: 0.9,
              }}
            />
            {/* Icon centered on the gradient-to-white seam */}
            <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: "72px" }}>
              <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-[14px] flex items-center justify-center shadow-xl border-[3px] border-white dark:border-[#0F172A]">
                <Sun className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            {/* Text content */}
            <div className="px-5 pb-5 pt-10">
              <h4 className="font-bold text-[16px] text-slate-900 dark:text-white leading-tight">
                Maximize your<br />productivity
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed px-1">
                Boost your task management with advanced tools & features.
              </p>
              <button className="w-full mt-4 py-3 bg-[#1E293B] dark:bg-white text-white dark:text-[#1E293B] rounded-xl text-[13px] font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ── Sub-components ── */

function NavItem({ icon: Icon, label, badge, collapsed }: any) {
  return (
    <div className="flex items-center p-2.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/30 group cursor-pointer transition-colors">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white">
        <Icon className="w-[20px] h-[20px]" strokeWidth={1.5} />
        {!collapsed && <span className="text-[14px] font-semibold">{label}</span>}
      </div>
      {!collapsed && badge}
    </div>
  );
}

function PageItem({ label, active, icon, glyph }: any) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-xl group transition-all cursor-pointer",
        active
          ? "border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#334155] shadow-sm"
          : "hover:bg-slate-100/50 dark:hover:bg-slate-700/30"
      )}
    >
      <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-60" />
      <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold", icon)}>
        {glyph}
      </div>
      <span
        className={cn(
          "text-[13px] flex-1 truncate",
          active ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-500 dark:text-slate-400"
        )}
      >
        {label}
      </span>
    </div>
  );
}
