/**
 * Task Store (Zustand)
 *
 * Client-side state for tasks, view mode, search query, and status filter.
 * The `viewMode` preference is persisted to localStorage so users come back
 * to the same view they left off on. Task data itself is not persisted here —
 * it comes from the API via React Query and is synced into this store by useTasks().
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus, ViewMode } from "../types";

interface TaskState {
  tasks: Task[];
  viewMode: ViewMode;
  searchQuery: string;
  filterStatus: TaskStatus | "all";

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: TaskStatus | "all") => void;

  getTasksByStatus: (status: TaskStatus) => Task[];
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      viewMode: "kanban",
      searchQuery: "",
      filterStatus: "all",

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
          ),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),

      getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),

      getFilteredTasks: () => {
        const { tasks, searchQuery, filterStatus } = get();
        return tasks.filter((t) => {
          const matchesSearch =
            searchQuery === "" ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = filterStatus === "all" || t.status === filterStatus;
          return matchesSearch && matchesStatus;
        });
      },
    }),
    {
      name: "task-storage",
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
);
