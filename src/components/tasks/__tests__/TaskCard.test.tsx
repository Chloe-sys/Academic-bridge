import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/utils";
import { TaskCard } from "../TaskCard";
import type { Task } from "../../../types";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "This is a test task description",
  status: "todo",
  priority: "high",
  startDate: "2024-05-18",
  endDate: "2024-05-26",
  assignees: [
    { id: "1", name: "John Doe", avatar: "https://example.com/avatar.jpg" },
    { id: "2", name: "Jane Smith", avatar: "https://example.com/avatar2.jpg" },
  ],
  attachments: [{ id: "a1", name: "document.pdf", type: "document" }],
  checklist: [
    { id: "c1", text: "Task 1", completed: true },
    { id: "c2", text: "Task 2", completed: false },
  ],
  comments: 5,
  createdAt: "2024-05-15T10:00:00Z",
  updatedAt: "2024-05-20T15:30:00Z",
};

describe("TaskCard", () => {
  it("renders task title", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("renders task description", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("This is a test task description")).toBeInTheDocument();
  });

  it("renders priority badge", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders checklist progress", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("renders attachment count", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders comment count", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onEdit when card is clicked", () => {
    const onEdit = vi.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={vi.fn()} />);
    
    fireEvent.click(screen.getByText("Test Task"));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it("renders assignee initials when avatar fails to load", () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    // Avatar fallback shows initials when image fails to load (both John and Jane start with J)
    const initials = screen.getAllByText("J");
    expect(initials.length).toBeGreaterThan(0);
  });

  it("applies dragging styles when isDragging is true", () => {
    const { container } = render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} isDragging />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass("opacity-50");
  });
});
