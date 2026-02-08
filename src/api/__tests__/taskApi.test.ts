import { describe, it, expect, beforeEach } from "vitest";
import { taskApi } from "../taskApi";

describe("taskApi", () => {
  beforeEach(() => {
    taskApi.resetTasks();
  });

  describe("getTasks", () => {
    it("returns all tasks", async () => {
      const tasks = await taskApi.getTasks();
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  describe("getTask", () => {
    it("returns a specific task by id", async () => {
      const task = await taskApi.getTask("1");
      expect(task).toBeDefined();
      expect(task?.id).toBe("1");
    });

    it("returns undefined for non-existent task", async () => {
      const task = await taskApi.getTask("non-existent");
      expect(task).toBeUndefined();
    });
  });

  describe("createTask", () => {
    it("creates a new task", async () => {
      const newTask = await taskApi.createTask({
        title: "New Task",
        description: "New task description",
        status: "todo",
        priority: "high",
        startDate: "2024-06-01",
        endDate: "2024-06-15",
      });

      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe("New Task");
      expect(newTask.status).toBe("todo");
      expect(newTask.priority).toBe("high");
    });

    it("assigns users when assignees are provided", async () => {
      const newTask = await taskApi.createTask({
        title: "Task with assignees",
        status: "todo",
        priority: "medium",
        startDate: "2024-06-01",
        endDate: "2024-06-15",
        assignees: ["1", "2"],
      });

      expect(newTask.assignees).toHaveLength(2);
    });
  });

  describe("updateTask", () => {
    it("updates an existing task", async () => {
      const updatedTask = await taskApi.updateTask({
        id: "1",
        title: "Updated Title",
      });

      expect(updatedTask.title).toBe("Updated Title");
    });

    it("throws error for non-existent task", async () => {
      await expect(
        taskApi.updateTask({ id: "non-existent", title: "Test" })
      ).rejects.toThrow("Task not found");
    });
  });

  describe("deleteTask", () => {
    it("deletes an existing task", async () => {
      await taskApi.deleteTask("1");
      const task = await taskApi.getTask("1");
      expect(task).toBeUndefined();
    });

    it("throws error for non-existent task", async () => {
      await expect(taskApi.deleteTask("non-existent")).rejects.toThrow(
        "Task not found"
      );
    });
  });

  describe("updateTaskStatus", () => {
    it("updates task status", async () => {
      const updatedTask = await taskApi.updateTaskStatus("1", "in-progress");
      expect(updatedTask.status).toBe("in-progress");
    });

    it("throws error for non-existent task", async () => {
      await expect(
        taskApi.updateTaskStatus("non-existent", "done")
      ).rejects.toThrow("Task not found");
    });
  });

  describe("getUsers", () => {
    it("returns mock users", async () => {
      const users = await taskApi.getUsers();
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
