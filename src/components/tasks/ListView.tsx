import { useState } from "react";
import { MoreHorizontal, ChevronDown, Plus, Paperclip, FileText } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import type { TaskStatus } from "../../types";

const prioStyle: Record<string, { bg: string; text: string }> = {
  high:   { bg: "bg-red-50", text: "text-red-500" },
  medium: { bg: "bg-orange-50", text: "text-orange-500" },
  low:    { bg: "bg-indigo-50", text: "text-indigo-500" },
};

const statusMeta: Record<string, { label: string; badge: string; countColor: string }> = {
  todo:          { label: "To-do",       badge: "bg-red-50 text-red-400",    countColor: "✏️" },
  "in-progress": { label: "On Progress", badge: "bg-indigo-50 text-indigo-400", countColor: "⚙️" },
  "need-review": { label: "Need Review", badge: "bg-amber-50 text-amber-500",  countColor: "🔍" },
  done:          { label: "Done",        badge: "bg-emerald-50 text-emerald-400", countColor: "✅" },
};

export function ListView({ tasks = [] }: any) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const ORDER: TaskStatus[] = ["todo", "in-progress", "need-review", "done"];

  return (
    <div className="space-y-4 pb-10">
      {ORDER.map((status) => {
        const meta = statusMeta[status];
        const statusTasks = tasks.filter((t: any) => t.status === status);
        if (statusTasks.length === 0) return null;

        return (
          <div key={status}>
            {/* Header */}
            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-slate-300 cursor-pointer" />
                <h3 className="text-sm font-bold text-slate-700">{meta.label}</h3>
                <div className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1", meta.badge)}>
                  {status === 'todo' ? <FileText className="w-3 h-3"/> : null}
                  {statusTasks.length}
                </div>
              </div>
              <ChevronDown 
                className={cn("w-4 h-4 text-slate-400 cursor-pointer transition-transform", collapsed[status] && "-rotate-90")} 
                onClick={() => setCollapsed(prev => ({ ...prev, [status]: !prev[status] }))}
              />
            </div>

            {/* Table */}
            {!collapsed[status] && (
              <div className="mt-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {/* Table Head */}
                <div className="grid grid-cols-[48px_1fr_220px_100px_220px_120px_48px] items-center px-4 h-12 border-b border-slate-50 text-[11px] font-black uppercase text-slate-300 tracking-wider">
                  <div className="flex justify-center"><Checkbox className="rounded border-slate-200" /></div>
                  <div>Name</div>
                  <div>Dates</div>
                  <div className="text-center">Status</div>
                  <div>Attachment</div>
                  <div>People</div>
                  <div />
                </div>

                {/* Rows */}
                {statusTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="grid grid-cols-[48px_1fr_220px_100px_220px_120px_48px] items-center px-4 h-14 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 group"
                  >
                    <div className="flex justify-center"><Checkbox className="rounded border-slate-200" /></div>
                    <div className="text-sm font-bold text-slate-800 truncate pr-4">{task.title}</div>
                    <div className="text-[12px] font-bold text-slate-400">
                      {new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                      {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex justify-center">
                       <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase", prioStyle[task.priority.toLowerCase()].bg, prioStyle[task.priority.toLowerCase()].text)}>
                        {task.priority}
                      </span>
                    </div>
                    <div>
                      {task.attachments?.[0] && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full group/file">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[12px] font-bold text-slate-500 truncate max-w-[120px]">{task.attachments[0].name}</span>
                          <div className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
                            <MoreHorizontal className="w-3 h-3 text-slate-400" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {task.assignees.map((a: any) => (
                        <Avatar key={a.id} className="w-7 h-7 border-2 border-white ring-0">
                          <AvatarImage src={a.avatar} />
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}