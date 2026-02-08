/**
 * CalendarView (Timeline View)
 *
 * Weekly timeline grid with row-packed task cards.
 * Uses a packing algorithm so overlapping tasks stack into separate rows.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import {
  format, startOfWeek, addDays, addWeeks, subWeeks,
  isSameDay, parseISO, differenceInDays,
} from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import type { Task } from "../../types";

interface CalendarViewProps {
  tasks?: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onNewTask: () => void;
}

const prioColors: Record<string, { border: string; bg: string; text: string }> = {
  high:   { border: "#EF4444", bg: "bg-[#FEE2E2]", text: "text-[#EF4444]" },
  medium: { border: "#F59E0B", bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  low:    { border: "#6366F1", bg: "bg-[#EDE9FE]", text: "text-[#6366F1]" },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView({ tasks = [], onEdit, onDelete, onNewTask }: CalendarViewProps) {
  const { t } = useTranslation();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayIdx = weekDays.findIndex((d) => isSameDay(d, today));

  // Filter tasks that overlap this week
  const weekTasks = useMemo(() => {
    const wEnd = addDays(weekStart, 6);
    return tasks.filter((tk) => {
      const s = parseISO(tk.startDate);
      const e = parseISO(tk.endDate);
      return s <= wEnd && e >= weekStart;
    });
  }, [tasks, weekStart]);

  // Get column + span for a task, clamped to the visible week
  const getColSpan = (task: Task) => {
    const s = parseISO(task.startDate);
    const e = parseISO(task.endDate);
    const cs = s < weekStart ? weekStart : s;
    const wEnd = addDays(weekStart, 6);
    const ce = e > wEnd ? wEnd : e;
    const col = Math.max(0, differenceInDays(cs, weekStart));
    const span = Math.max(1, Math.min(7 - col, differenceInDays(ce, cs) + 1));
    return { col, span };
  };

  // Row-packing algorithm — prevents cards from overlapping
  const positioned = useMemo(() => {
    const sorted = [...weekTasks].sort((a, b) => {
      const ap = getColSpan(a);
      const bp = getColSpan(b);
      return ap.col - bp.col || bp.span - ap.span;
    });

    const items = sorted.map((task) => ({ task, ...getColSpan(task), row: 0 }));
    const occupancy: Set<number>[] = [];

    items.forEach((item) => {
      const cols = Array.from({ length: item.span }, (_, i) => item.col + i);
      let rowIdx = 0;
      while (true) {
        if (!occupancy[rowIdx]) occupancy[rowIdx] = new Set();
        if (!cols.some((c) => occupancy[rowIdx].has(c))) {
          cols.forEach((c) => occupancy[rowIdx].add(c));
          item.row = rowIdx;
          break;
        }
        rowIdx++;
      }
    });
    return items;
  }, [weekTasks, weekStart]);

  const maxRow = positioned.length > 0 ? Math.max(...positioned.map((p) => p.row)) : 0;
  const ROW_H = 115;
  const ROW_GAP = 8;
  const contentH = Math.max(450, (maxRow + 1) * (ROW_H + ROW_GAP) + 40);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 sm:px-5 h-[52px] border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1">
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          </button>
          <span className="text-[14px] font-bold text-slate-800 dark:text-white px-2 min-w-[110px] sm:min-w-[130px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="hidden sm:flex items-center gap-1.5 h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {t("calendar.week")} <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button onClick={onNewTask} className="h-8 px-3 flex items-center gap-1.5 bg-[#111827] dark:bg-white hover:bg-[#1F2937] dark:hover:bg-slate-100 text-white dark:text-[#111827] text-[13px] font-bold rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">{t("tasks.newTask")}</span>
          </button>
          <button className="h-8 w-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Day headers ── */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 shrink-0">
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div key={day.toISOString()} className="py-3 sm:py-4 text-center border-r border-slate-50 dark:border-slate-800 last:border-r-0">
              <div className={cn(
                "text-[20px] sm:text-[24px] font-semibold leading-none",
                isToday ? "text-[#7C3AED]" : "text-slate-800 dark:text-white"
              )}>
                {format(day, "d")}
              </div>
              <div className={cn(
                "text-[11px] sm:text-[12px] font-medium mt-0.5 uppercase tracking-wide",
                isToday ? "text-[#7C3AED]" : "text-slate-400 dark:text-slate-500"
              )}>
                {DAY_LABELS[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Timeline body ── */}
      <div className="flex-1 overflow-y-auto overflow-x-auto relative">
        <div className="min-w-[650px] relative" style={{ minHeight: contentH }}>

          {/* Column grid lines */}
          <div className="absolute inset-0 grid grid-cols-7 pointer-events-none" style={{ minHeight: contentH }}>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="border-r border-slate-50 dark:border-slate-800/40 last:border-r-0" />
            ))}
          </div>

          {/* Today vertical line */}
          {todayIdx >= 0 && (
            <div
              className="absolute pointer-events-none z-[5]"
              style={{ left: `${((todayIdx + 0.5) / 7) * 100}%`, top: 0, bottom: 0 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[#6366F1]/40" />
              <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#6366F1]" />
            </div>
          )}

          {/* Empty state */}
          {positioned.length === 0 && (
            <div className="flex items-center justify-center h-[350px] text-slate-400 text-[13px]">
              {t("tasks.noTasks")}
            </div>
          )}

          {/* ── Task cards ── */}
          {positioned.map(({ task, col, span, row }) => {
            const pc = prioColors[task.priority] || prioColors.medium;
            const top = 14 + row * (ROW_H + ROW_GAP);

            return (
              <div
                key={task.id}
                className="absolute cursor-pointer transition-all duration-200 ease-out hover:z-30 hover:-translate-y-[2px] group"
                style={{
                  top,
                  left: `calc(${(col / 7) * 100}% + 5px)`,
                  width: `calc(${(span / 7) * 100}% - 10px)`,
                }}
                onClick={() => onEdit(task)}
              >
                <div
                  className={cn(
                    "bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700",
                    "px-3 py-2.5 overflow-hidden",
                    "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
                    "group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                    "group-hover:border-slate-300 dark:group-hover:border-slate-600",
                    "transition-all duration-200"
                  )}
                  style={{ borderBottom: `3px solid ${pc.border}` }}
                >
                  {/* Date + badge + menu */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                      <div className="w-[5px] h-[5px] rounded-full bg-slate-400 shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-400 truncate whitespace-nowrap">
                        {format(parseISO(task.startDate), "MMM d")} - {format(parseISO(task.endDate), "d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap", pc.bg, pc.text)}>
                        {task.priority}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="h-5 w-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28">
                          <DropdownMenuItem onClick={() => onEdit(task)}>{t("actions.edit")}</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => onDelete(task.id)}>{t("actions.delete")}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-[13px] text-slate-800 dark:text-white line-clamp-1 leading-snug">
                    {task.title}
                  </h4>

                  {/* Description */}
                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
