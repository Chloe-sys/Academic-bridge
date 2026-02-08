/**
 * Tasks Page
 *
 * The main page of the application. Renders the Header and one of
 * three view components depending on the selected view mode:
 *   - KanbanBoard  (default)
 *   - ListView
 *   - CalendarView
 *
 * Also handles the create/edit form modal and delete confirmation.
 * All CRUD operations are delegated to the useTasks() hook which
 * talks to the DummyJSON API and manages cache via TanStack Query.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Header } from "../components/layout/Header";
import { KanbanBoard } from "../components/tasks/KanbanBoard";
import { ListView } from "../components/tasks/ListView";
import { CalendarView } from "../components/tasks/CalendarView";
import { TaskForm } from "../components/tasks/TaskForm";
import { useTaskStore } from "../store/taskStore";
import { useTasks } from "../hooks/useTasks";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types";

export function TasksPage() {
  const { t } = useTranslation();
  const { viewMode } = useTaskStore();
  const {
    tasks: filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    isError,
    refetch,
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Handlers
  const handleNewTask = () => { setEditTask(null); setFormOpen(true); };
  const handleEdit = (task: Task) => { setEditTask(task); setFormOpen(true); };
  const handleDelete = (id: string) => {
    if (window.confirm(t("actions.confirmDelete"))) deleteTask(id);
  };
  const handleSubmit = (data: Partial<Task>) => {
    // Map User[] assignees to string[] ids for the API input types
    const assigneeIds = data.assignees?.map((a) => (typeof a === "string" ? a : a.id));
    if (data.id) {
      updateTask({
        id: data.id, title: data.title, description: data.description,
        status: data.status, priority: data.priority,
        startDate: data.startDate, endDate: data.endDate, assignees: assigneeIds,
      } as UpdateTaskInput);
    } else {
      createTask({
        title: data.title!, description: data.description,
        status: data.status!, priority: data.priority!,
        startDate: data.startDate!, endDate: data.endDate!, assignees: assigneeIds,
      } as CreateTaskInput);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex-1 overflow-hidden relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-[#0F172A]/80 z-10 flex items-center justify-center">
            <div className="flex items-center gap-3 text-[#7C3AED] dark:text-[#A78BFA]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[13px] font-medium">{t("common.loading")}</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <p className="text-[#EF4444] mb-4">{t("errors.loadFailed")}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#7C3AED] dark:bg-[#A78BFA] text-white dark:text-[#0F172A] rounded-lg hover:bg-[#6D28D9] transition-all"
            >
              {t("common.retry")}
            </button>
          </div>
        )}

        {/* View content */}
        {!isError && (
          <div className="h-full overflow-auto p-3 sm:p-4 md:p-6">
            {viewMode === "kanban" && (
              <KanbanBoard
                tasks={filteredTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateTask={(id: string, data: Partial<Task>) =>
                  updateTask({ id, ...data } as UpdateTaskInput)
                }
                onNewTask={handleNewTask}
              />
            )}
            {viewMode === "list" && (
              <ListView tasks={filteredTasks} />
            )}
            {viewMode === "calendar" && (
              <CalendarView
                tasks={filteredTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNewTask={handleNewTask}
              />
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <TaskForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTask(null); }}
        onSubmit={handleSubmit}
        task={editTask}
      />
    </div>
  );
}
