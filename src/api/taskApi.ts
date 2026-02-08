/**
 * Task API Service
 *
 * Integrates with DummyJSON (https://dummyjson.com/docs/todos) for CRUD operations.
 * Since DummyJSON only provides simple todo objects ({ id, todo, completed, userId }),
 * I enrich each fetched todo with additional fields (priority, dates, assignees, etc.)
 * so the UI has enough data to render Kanban cards, calendar events, and list rows.
 *
 * DummyJSON simulates server-side changes — POSTs, PUTs, and DELETEs return
 * the expected response but don't persist. To keep the app functional across
 * views I also maintain an in-memory cache that syncs with every mutation.
 */

import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from "../types";
import { generateId } from "../lib/utils";

// ── Base URL for DummyJSON Todos endpoint ──
const BASE_URL = "https://dummyjson.com/todos";

// ── Mock users used to populate assignee avatars throughout the app ──
const mockUsers = [
  { id: "1", name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "2", name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { id: "3", name: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: "4", name: "Sarah Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
];

// ── Helpers ──

/** Returns an ISO date string offset by `days` from today */
function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/** Deterministically pick a status based on the todo's id */
function deriveStatus(id: number, completed: boolean): TaskStatus {
  if (completed) return "done";
  const pool: TaskStatus[] = ["todo", "in-progress", "need-review"];
  return pool[id % pool.length];
}

/** Deterministically pick a priority based on the todo's id */
function derivePriority(id: number): TaskPriority {
  const pool: TaskPriority[] = ["high", "medium", "low"];
  return pool[id % pool.length];
}

/** Pick mock assignees deterministically */
function deriveAssignees(id: number) {
  const count = (id % 3) + 1;
  return mockUsers.slice(0, count);
}

/**
 * Transform a raw DummyJSON todo into the enriched Task shape
 * that the rest of the application expects.
 */
function enrichTodo(raw: { id: number; todo: string; completed: boolean; userId: number }): Task {
  const id = raw.id;
  const spread = (id % 5) + 1; // date spread 1-5 days
  const offset = ((id % 7) - 3); // shift around today from -3 to +3

  return {
    id: String(id),
    title: raw.todo,
    description: raw.todo,
    status: deriveStatus(id, raw.completed),
    priority: derivePriority(id),
    startDate: dateOffset(offset),
    endDate: dateOffset(offset + spread),
    assignees: deriveAssignees(id),
    attachments: id % 2 === 0
      ? [{ id: `att-${id}`, name: `document_${id}.pdf`, type: "document" }]
      : [],
    checklist: id % 3 === 0
      ? [
          { id: `cl-${id}-1`, text: "Research", completed: true },
          { id: `cl-${id}-2`, text: "Draft", completed: id % 2 === 0 },
          { id: `cl-${id}-3`, text: "Review", completed: false },
        ]
      : [],
    comments: (id * 3) % 15,
    createdAt: dateOffset(-7) + "T10:00:00Z",
    updatedAt: dateOffset(-1) + "T14:00:00Z",
  };
}

// ── In-memory cache so mutations feel persistent within a session ──
let cachedTasks: Task[] | null = null;

// ── Public API ──

export const taskApi = {
  /**
   * Fetch all tasks.
   * On the first call we hit DummyJSON; subsequent calls serve from cache
   * so Kanban drag-and-drop and inline edits feel instant.
   */
  getTasks: async (): Promise<Task[]> => {
    if (cachedTasks) return [...cachedTasks];

    try {
      const res = await fetch(`${BASE_URL}?limit=15`);
      const data = await res.json();
      cachedTasks = (data.todos || []).map(enrichTodo);
    } catch {
      // Fallback to an empty list if the network request fails
      console.warn("[taskApi] DummyJSON request failed — returning empty list");
      cachedTasks = [];
    }
    return [...cachedTasks!];
  },

  /** Fetch a single task by id */
  getTask: async (id: string): Promise<Task | undefined> => {
    const tasks = await taskApi.getTasks();
    return tasks.find((t) => t.id === id);
  },

  /**
   * Create a new task.
   * We POST to DummyJSON to demonstrate the API call, then
   * add the task to our local cache so it appears immediately.
   */
  createTask: async (input: CreateTaskInput): Promise<Task> => {
    // POST to DummyJSON (simulated — won't persist server-side)
    const res = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: input.title,
        completed: input.status === "done",
        userId: 1,
      }),
    });
    const created = await res.json();

    const newTask: Task = {
      id: String(created.id ?? generateId()),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      startDate: input.startDate,
      endDate: input.endDate,
      assignees: input.assignees
        ? mockUsers.filter((u) => input.assignees?.includes(u.id))
        : [],
      attachments: [],
      checklist: [],
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (cachedTasks) cachedTasks = [...cachedTasks, newTask];
    return newTask;
  },

  /**
   * Update an existing task.
   * PUTs to DummyJSON, then patches the local cache.
   */
  updateTask: async (input: UpdateTaskInput): Promise<Task> => {
    // PUT to DummyJSON (simulated)
    await fetch(`${BASE_URL}/${input.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: input.title,
        completed: input.status === "done",
      }),
    });

    if (!cachedTasks) await taskApi.getTasks();

    const idx = cachedTasks!.findIndex((t) => t.id === input.id);
    if (idx === -1) throw new Error("Task not found");

    const updated: Task = {
      ...cachedTasks![idx],
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status && { status: input.status }),
      ...(input.priority && { priority: input.priority }),
      ...(input.startDate && { startDate: input.startDate }),
      ...(input.endDate && { endDate: input.endDate }),
      ...(input.assignees && {
        assignees: mockUsers.filter((u) => input.assignees?.includes(u.id)),
      }),
      updatedAt: new Date().toISOString(),
    };

    cachedTasks = cachedTasks!.map((t) => (t.id === input.id ? updated : t));
    return updated;
  },

  /**
   * Delete a task.
   * DELETEs on DummyJSON (simulated), then removes from cache.
   */
  deleteTask: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (cachedTasks) cachedTasks = cachedTasks.filter((t) => t.id !== id);
  },

  /** Quick status update (used by Kanban drag-and-drop) */
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    return taskApi.updateTask({ id, status });
  },

  /** Return the list of mock users (for assignee pickers) */
  getUsers: async () => mockUsers,

  /** Reset the in-memory cache — forces a fresh fetch on next getTasks() */
  resetTasks: () => { cachedTasks = null; },
};

export { mockUsers };
