import { useTranslation } from "react-i18next";
import { MoreHorizontal, MessageCircle, Paperclip, CheckSquare } from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { Task } from "../../types";

interface TaskCardProps { task: Task; onEdit: (task: Task) => void; onDelete: (id: string) => void; isDragging?: boolean; }

export function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
  const { t } = useTranslation();
  
  const done = task.checklist?.filter((c) => c.completed).length ?? 0;
  const total = task.checklist?.length ?? 0;
  
  // Progress Bar Segments (Dynamic based on total items, max 10 to keep UI clean)
  const segments = Array.from({ length: Math.min(total, 10) }, (_, i) => {
    const threshold = (i + 1) / Math.min(total, 10);
    const progress = done / total;
    return progress >= threshold;
  });

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-[18px] p-4 transition-all duration-200 cursor-pointer group shadow-sm",
        isDragging ? "opacity-40 rotate-[2deg] scale-[1.02] shadow-2xl" : "hover:shadow-md"
      )}
      onClick={() => onEdit(task)}
    >
      {/* Header: Date + Dots */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[12px] text-slate-400 font-semibold uppercase tracking-tight">
            {new Date(task.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="h-6 w-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>{t("actions.edit")}</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(task.id)}>{t("actions.delete")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body: Title + Description */}
      <h3 className="font-bold text-[15px] text-slate-800 dark:text-white leading-snug mb-1">
        {task.title}
      </h3>
      <p className="text-[12px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {task.description}
      </p>

      {/* Checklist Segmented Progress */}
      {total > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="border border-slate-200 rounded p-0.5">
                <CheckSquare className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-bold">Checklist</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">{done}/{total}</span>
          </div>
          <div className="flex gap-1">
            {segments.map((completed, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-[5px] flex-1 rounded-full transition-colors",
                  completed ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-800"
                )} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer: Stats + Avatars */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{task.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{task.attachments?.length || 0}</span>
          </div>
        </div>
        <div className="flex items-center">
          {task.assignees.slice(0, 3).map((a, i) => (
            <Avatar key={a.id} className={cn("w-7 h-7 border-2 border-white dark:border-slate-800", i > 0 && "-ml-2.5")}>
              <AvatarImage src={a.avatar} alt={a.name} />
              <AvatarFallback className="text-[9px] font-bold">{a.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
}