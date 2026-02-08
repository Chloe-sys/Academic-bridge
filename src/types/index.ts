/**
 * Type Definitions
 *
 * Central type definitions for the entire application.
 * Keeping all types in one place makes refactoring safer —
 * any shape change here is immediately caught by the compiler
 * across every component, hook, and API function.
 */

/** The four possible statuses a task can be in */
export type TaskStatus = "todo" | "in-progress" | "need-review" | "done";

/** Priority levels that map to colour-coded badges */
export type TaskPriority = "high" | "medium" | "low";

/** Represents a team member assignable to tasks */
export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

/** File attachment metadata */
export interface Attachment {
  id: string;
  name: string;
  type: string;
  url?: string;
}

/** Single item inside a task's checklist */
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Core Task model used throughout the application.
 * This shape is what the Kanban cards, list rows, and calendar events consume.
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  assignees: User[];
  attachments: Attachment[];
  checklist?: ChecklistItem[];
  comments?: number;
  createdAt: string;
  updatedAt: string;
}

/** Column definition for the Kanban board */
export interface TaskColumn {
  id: TaskStatus;
  title: string;
}

/** Payload sent when creating a new task */
export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  assignees?: string[];
}

/** Payload sent when updating an existing task (all fields optional except id) */
export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  endDate?: string;
  assignees?: string[];
}

/** The three view modes available from the header tabs */
export type ViewMode = "list" | "kanban" | "calendar";
