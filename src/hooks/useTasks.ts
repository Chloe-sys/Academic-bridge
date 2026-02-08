/**
 * useTasks Hook
 *
 * Manages all task-related server state via TanStack Query (React Query).
 * Provides queries, mutations, and derived filtered data to any component
 * that needs to read or modify tasks.
 *
 * Design decisions:
 * - Optimistic updates for status changes (instant drag-and-drop feedback).
 * - Cache invalidation after every successful mutation to keep data fresh.
 * - The Zustand store is synced here so that non-query components (e.g. Header search)
 *   can still access the task list without directly depending on React Query.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { taskApi } from "../api/taskApi";
import { useTaskStore } from "../store/taskStore";
import type { CreateTaskInput, UpdateTaskInput, TaskStatus } from "../types";

export function useTasks() {
  const queryClient = useQueryClient();
  const { setTasks, searchQuery, filterStatus } = useTaskStore();

  // ── Fetch all tasks (cached for 5 minutes) ──
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  // Keep the Zustand store in sync whenever React Query data changes
  useEffect(() => {
    if (tasksQuery.data) setTasks(tasksQuery.data);
  }, [tasksQuery.data, setTasks]);

  // ── Client-side filtering (search + status) ──
  const filteredTasks =
    tasksQuery.data?.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "all" || task.status === filterStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  // ── Mutations ──

  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: taskApi.updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Optimistic update for drag-and-drop status changes
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskApi.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old: any[]) =>
        old?.map((task) => (task.id === id ? { ...task, status } : task))
      );
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    tasks: filteredTasks,
    allTasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,

    createTask: (data: CreateTaskInput) => createMutation.mutateAsync(data),
    updateTask: (data: UpdateTaskInput) => updateMutation.mutateAsync(data),
    deleteTask: (id: string) => deleteMutation.mutateAsync(id),
    updateTaskStatus: (id: string, status: TaskStatus) =>
      updateStatusMutation.mutate({ id, status }),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
