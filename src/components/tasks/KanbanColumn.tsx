import { useTranslation } from "react-i18next";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Pencil } from "lucide-react";
import { cn } from "../../lib/utils";
import { SortableTaskCard } from "./SortableTaskCard";
import type { Task, TaskColumn } from "../../types";

interface KanbanColumnProps { column: TaskColumn; tasks: Task[]; onEdit: (t: Task) => void; onDelete: (id: string) => void; onNewTask: () => void; }

const colStyle: Record<string, { dot: string; badgeBg: string; badgeText: string }> = {
  todo:          { dot: "bg-[#8B5CF6]",  badgeBg: "bg-[#EDE9FE] dark:bg-[#4C1D95]/40", badgeText: "text-[#7C3AED] dark:text-[#A78BFA]" },
  "in-progress": { dot: "bg-[#3B82F6]",  badgeBg: "bg-[#DBEAFE] dark:bg-[#1E3A5F]/40", badgeText: "text-[#3B82F6] dark:text-[#93C5FD]" },
  "need-review": { dot: "bg-[#F59E0B]",  badgeBg: "bg-[#FEF3C7] dark:bg-[#78350F]/40", badgeText: "text-[#D97706] dark:text-[#FCD34D]" },
  done:          { dot: "bg-[#10B981]",  badgeBg: "bg-[#D1FAE5] dark:bg-[#064E3B]/40", badgeText: "text-[#10B981] dark:text-[#6EE7B7]" },
};

export function KanbanColumn({ column, tasks, onEdit, onDelete, onNewTask }: KanbanColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const s = colStyle[column.id] || colStyle.todo;

  return (
    <div className="flex flex-col h-full w-[260px] sm:w-[280px] shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Plus className="w-4 h-4 text-[#9CA3AF] dark:text-[#94A3B8] cursor-pointer hover:text-[#6B7280] transition-colors" onClick={onNewTask} strokeWidth={1.5} />
          <div className={cn("w-2 h-2 rounded-full", s.dot)} />
          <h3 className="font-semibold text-[14px] text-[#374151] dark:text-[#F1F5F9] leading-tight">{column.title}</h3>
          <span className={cn("min-w-[22px] h-[22px] flex items-center justify-center rounded-md px-1 text-[12px] font-semibold", s.badgeBg, s.badgeText)}>{tasks.length}</span>
        </div>
        <button className="h-7 w-7 flex items-center justify-center rounded-md text-[#9CA3AF] dark:text-[#94A3B8] hover:text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-all duration-150">
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
      <div ref={setNodeRef} className={cn("flex-1 overflow-y-auto space-y-3 rounded-xl transition-all duration-150", isOver && "bg-[#EDE9FE] dark:bg-[#7C3AED]/10 ring-2 ring-[#8B5CF6]/20")}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <SortableTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
        </SortableContext>
        <button onClick={onNewTask} className="w-full py-3 border-2 border-dashed border-[#E5E7EB] dark:border-[#334155] rounded-xl text-[13px] font-medium text-[#9CA3AF] dark:text-[#94A3B8] flex items-center justify-center gap-2 hover:border-[#8B5CF6] hover:text-[#7C3AED] dark:hover:text-[#A78BFA] hover:bg-[#EDE9FE] dark:hover:bg-[#7C3AED]/10 transition-all duration-150">
          <Plus className="w-4 h-4" strokeWidth={1.5} />{t("tasks.addNew")}
        </button>
      </div>
    </div>
  );
}
