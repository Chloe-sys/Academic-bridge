import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "../taskStore";
import type { Task } from "../../types";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test description",
  status: "todo",
  priority: "high",
  startDate: "2024-05-18",
  endDate: "2024-05-26",
  assignees: [],
  attachments: [],
  createdAt: "2024-05-15T10:00:00Z",
  updatedAt: "2024-05-20T15:30:00Z",
};

describe("taskStore", () => {
  beforeEach(() => {
    const store = useTaskStore.getState();
    store.setTasks([]);
    store.setSearchQuery("");
    store.setFilterStatus("all");
  });

  it("sets tasks", () => {
    const store = useTaskStore.getState();
    store.setTasks([mockTask]);
    
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe("Test Task");
  });

  it("adds a task", () => {
    const store = useTaskStore.getState();
    store.addTask(mockTask);
    
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("updates a task", () => {
    const store = useTaskStore.getState();
    store.setTasks([mockTask]);
    store.updateTask("1", { title: "Updated Task" });
    
    expect(useTaskStore.getState().tasks[0].title).toBe("Updated Task");
  });

  it("deletes a task", () => {
    const store = useTaskStore.getState();
    store.setTasks([mockTask]);
    store.deleteTask("1");
    
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it("moves a task to a new status", () => {
    const store = useTaskStore.getState();
    store.setTasks([mockTask]);
    store.moveTask("1", "in-progress");
    
    expect(useTaskStore.getState().tasks[0].status).toBe("in-progress");
  });

  it("sets view mode", () => {
    const store = useTaskStore.getState();
    store.setViewMode("kanban");
    
    expect(useTaskStore.getState().viewMode).toBe("kanban");
  });

  it("sets search query", () => {
    const store = useTaskStore.getState();
    store.setSearchQuery("test");
    
    expect(useTaskStore.getState().searchQuery).toBe("test");
  });

  it("sets filter status", () => {
    const store = useTaskStore.getState();
    store.setFilterStatus("todo");
    
    expect(useTaskStore.getState().filterStatus).toBe("todo");
  });

  it("gets tasks by status", () => {
    const store = useTaskStore.getState();
    const task2: Task = { ...mockTask, id: "2", status: "in-progress" };
    store.setTasks([mockTask, task2]);
    
    const todoTasks = store.getTasksByStatus("todo");
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].status).toBe("todo");
  });

  it("filters tasks by search query", () => {
    const store = useTaskStore.getState();
    const task2: Task = { ...mockTask, id: "2", title: "Different Task" };
    store.setTasks([mockTask, task2]);
    store.setSearchQuery("Different");
    
    const filteredTasks = store.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].title).toBe("Different Task");
  });

  it("filters tasks by status", () => {
    const store = useTaskStore.getState();
    const task2: Task = { ...mockTask, id: "2", status: "in-progress" };
    store.setTasks([mockTask, task2]);
    store.setFilterStatus("in-progress");
    
    const filteredTasks = store.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].status).toBe("in-progress");
  });
});
