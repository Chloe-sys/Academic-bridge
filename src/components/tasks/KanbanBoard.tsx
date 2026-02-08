import { useState, useMemo, useCallback } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import type { Task, TaskColumn } from "../../types";

interface KanbanBoardProps { tasks?: Task[]; onEdit: (t: Task) => void; onDelete: (id: string) => void; onUpdateTask: (id: string, data: Partial<Task>) => void; onNewTask: () => void; }

const columns: TaskColumn[] = [
  { id: "todo", title: "To-do" },
  { id: "in-progress", title: "On Progress" },
  { id: "need-review", title: "Need Review" },
  { id: "done", title: "Done" },
];

export function KanbanBoard({ tasks = [], onEdit, onDelete, onUpdateTask, onNewTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const byCol = useMemo(() => columns.reduce((a, c) => { a[c.id] = (tasks || []).filter((t) => t.status === c.id); return a; }, {} as Record<string, Task[]>), [tasks]);

  const onStart = useCallback((e: DragStartEvent) => { const t = (tasks || []).find((x) => x.id === e.active.id); if (t) setActiveTask(t); }, [tasks]);
  const onEnd = useCallback((e: DragEndEvent) => {
    setActiveTask(null);
    if (!e.over) return;
    const id = e.active.id as string;
    const ns = e.over.id as Task["status"];
    if (columns.some((c) => c.id === ns)) { const t = (tasks || []).find((x) => x.id === id); if (t && t.status !== ns) onUpdateTask(id, { status: ns }); }
  }, [tasks, onUpdateTask]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onStart} onDragEnd={onEnd}>
      <div className="flex gap-4 sm:gap-6 h-full pb-4 overflow-x-auto">
        {columns.map((c) => <KanbanColumn key={c.id} column={c} tasks={byCol[c.id] || []} onEdit={onEdit} onDelete={onDelete} onNewTask={onNewTask} />)}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} onEdit={onEdit} onDelete={onDelete} isDragging />}</DragOverlay>
    </DndContext>
  );
}
