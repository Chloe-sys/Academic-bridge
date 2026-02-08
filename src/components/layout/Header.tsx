import {
  Search, Filter, ArrowUpDown, Share2, Star,
  MessageCircle, History, Plus, MoreHorizontal,
  LayoutGrid, List, Calendar, Globe, Menu,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Input } from "../ui/input";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import type { ViewMode } from "../../types";
import { useTaskStore } from "../../store/taskStore";

export function Header() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useTaskStore();
  const ctx = useOutletContext<{ onToggleSidebar: () => void; isMobile: boolean } | undefined>();

  const views: { id: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { id: "kanban", icon: LayoutGrid, label: "Kanban" },
    { id: "list", icon: List, label: "List" },
    { id: "calendar", icon: Calendar, label: "Timeline" },
  ];

  return (
    <header className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
      {/* ── Row 1: Breadcrumb bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-12 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
          {/* Mobile hamburger */}
          {ctx?.isMobile && (
            <button onClick={ctx.onToggleSidebar} className="p-1.5 hover:bg-slate-50 rounded-md mr-1 lg:hidden">
              <Menu className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
            </button>
          )}
          <Plus className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors" />
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Shared Pages</span>
          </div>
          <span className="text-slate-300 font-normal">&gt;</span>
          <span className="text-slate-900 dark:text-white font-semibold">HR Tasks Hub</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-400 transition-colors"><Star className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-400 transition-colors"><MessageCircle className="w-4 h-4" /></button>
          <span className="text-slate-200 mx-1">|</span>
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-400 transition-colors"><History className="w-4 h-4" /></button>
          <button className="flex items-center gap-1.5 ml-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* ── Row 2: Title Area ── */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="mb-6">
          <h1 className="text-[24px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
            HR Tasks Hub <span className="text-xl">🗿</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">Welcome to the Human Resources hub</p>
        </div>

        {/* ── Row 3: Controls Bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: View Switcher */}
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 h-9 border rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap",
                    viewMode === v.id
                      ? "bg-white border-slate-200 text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <v.icon className={cn("w-4 h-4", viewMode === v.id ? "text-slate-900" : "text-slate-400")} />
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Search, Filter, Sort, Avatars */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] md:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-12 h-10 bg-slate-50/50 border-slate-200 rounded-xl text-[13px] font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-sans font-bold shadow-sm">⌘ F</kbd>
              </div>
            </div>

            {/* Filter/Sort Buttons */}
            <button className="flex items-center gap-2 h-10 px-3 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 text-slate-500" /> Filter
            </button>
            <button className="flex items-center gap-2 h-10 px-3 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowUpDown className="w-4 h-4 text-slate-500" /> Sort
            </button>

            {/* Avatars with Separator */}
            <div className="flex items-center gap-3 pl-1">
              <span className="text-slate-200">|</span>
              <div className="flex -space-x-2.5">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="w-8 h-8 border-2 border-white ring-0 shadow-sm transition-transform hover:z-10 hover:scale-110">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} />
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}