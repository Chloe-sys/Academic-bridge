import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/utils";
import { TaskForm } from "../TaskForm";
import type { Task } from "../../../types";

const mockTask: Task = {
  id: "1",
  title: "Existing Task",
  description: "Existing description",
  status: "in-progress",
  priority: "medium",
  startDate: "2024-05-18",
  endDate: "2024-05-26",
  assignees: [],
  attachments: [],
  createdAt: "2024-05-15T10:00:00Z",
  updatedAt: "2024-05-20T15:30:00Z",
};

describe("TaskForm", () => {
  it("renders create form when no task is provided", () => {
    render(
      <TaskForm
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/New Task/)).toBeInTheDocument();
  });

  it("renders edit form when task is provided", () => {
    render(
      <TaskForm
        open={true}
        onOpenChange={vi.fn()}
        task={mockTask}
        onSubmit={vi.fn()}
      />
    );
    
    expect(screen.getByText(/Edit/)).toBeInTheDocument();
  });

  it("populates form fields when editing", () => {
    render(
      <TaskForm
        open={true}
        onOpenChange={vi.fn()}
        task={mockTask}
        onSubmit={vi.fn()}
      />
    );
    
    const titleInput = screen.getByPlaceholderText("Enter task title...");
    expect(titleInput).toHaveValue("Existing Task");
    
    const descriptionInput = screen.getByPlaceholderText("Enter task description...");
    expect(descriptionInput).toHaveValue("Existing description");
  });

  it("calls onSubmit with form data when submitted", async () => {
    const onSubmit = vi.fn();
    render(
      <TaskForm
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    
    const titleInput = screen.getByPlaceholderText("Enter task title...");
    fireEvent.change(titleInput, { target: { value: "New Task Title" } });
    
    const submitButton = screen.getByText("Create");
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("calls onOpenChange when cancel is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <TaskForm
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={vi.fn()}
      />
    );
    
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables submit button when loading", () => {
    render(
      <TaskForm
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={true}
      />
    );
    
    const submitButton = screen.getByText("...");
    expect(submitButton).toBeDisabled();
  });
});
