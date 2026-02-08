import { test, expect } from "@playwright/test";

test.describe("Task Manager E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the app to load
    await page.waitForSelector("text=HR Tasks Hub");
  });

  test.describe("Create Task (CRUD - Create)", () => {
    test("should create a new task from Kanban view", async ({ page }) => {
      // Switch to Kanban view
      await page.click("button:has-text('Kanban')");
      
      // Click the + button in To-do column
      await page.click("button:has-text('To-do')");
      
      // Wait for dialog to open
      await page.waitForSelector("[role='dialog']");
      
      // Fill in the form
      await page.fill('input[placeholder="Enter task title..."]', "E2E Test Task");
      await page.fill(
        'textarea[placeholder="Enter task description..."]',
        "This task was created by E2E test"
      );
      
      // Select priority
      await page.click("button:has-text('Medium')");
      await page.click("text=High");
      
      // Set dates
      const today = new Date().toISOString().split("T")[0];
      await page.fill('input[type="date"]', today);
      
      // Submit the form
      await page.click("button:has-text('Create')");
      
      // Verify the task was created
      await expect(page.locator("text=E2E Test Task")).toBeVisible();
    });

    test("should create a new task from List view", async ({ page }) => {
      // Switch to List view
      await page.click("button:has-text('List')");
      
      // Click the + button in To-do section
      await page.click("button:has-text('To-do')");
      
      // Wait for dialog to open
      await page.waitForSelector("[role='dialog']");
      
      // Fill in the form
      await page.fill('input[placeholder="Enter task title..."]', "List View Test Task");
      
      // Submit the form
      await page.click("button:has-text('Create')");
      
      // Verify the task appears in the list
      await expect(page.locator("text=List View Test Task")).toBeVisible();
    });
  });

  test.describe("Read Tasks (CRUD - Read)", () => {
    test("should display tasks in Kanban view", async ({ page }) => {
      await page.click("button:has-text('Kanban')");
      
      // Verify columns are visible
      await expect(page.locator("text=To-do")).toBeVisible();
      await expect(page.locator("text=On Progress")).toBeVisible();
      await expect(page.locator("text=Need Review")).toBeVisible();
      await expect(page.locator("text=Done")).toBeVisible();
      
      // Verify some tasks are displayed
      await expect(page.locator("text=Update Employee Records System")).toBeVisible();
    });

    test("should display tasks in List view", async ({ page }) => {
      await page.click("button:has-text('List')");
      
      // Verify column headers
      await expect(page.locator("text=Name").first()).toBeVisible();
      await expect(page.locator("text=Dates").first()).toBeVisible();
      await expect(page.locator("text=Status").first()).toBeVisible();
      
      // Verify tasks are grouped by status
      await expect(page.locator("text=To-do").first()).toBeVisible();
      await expect(page.locator("text=On Progress").first()).toBeVisible();
    });

    test("should display tasks in Calendar view", async ({ page }) => {
      await page.click("button:has-text('Calendar')");
      
      // Verify calendar navigation is visible
      await expect(page.locator("text=May 2024")).toBeVisible();
      
      // Verify week days are visible
      await expect(page.locator("text=Mon")).toBeVisible();
      await expect(page.locator("text=Fri")).toBeVisible();
    });

    test("should search tasks", async ({ page }) => {
      // Type in search box
      await page.fill('input[placeholder="Search here"]', "Employee");
      
      // Wait for filter to apply
      await page.waitForTimeout(300);
      
      // Verify filtered results
      await expect(page.locator("text=Update Employee Records System")).toBeVisible();
    });
  });

  test.describe("Update Task (CRUD - Update)", () => {
    test("should edit an existing task", async ({ page }) => {
      await page.click("button:has-text('Kanban')");
      
      // Click on a task card to edit
      await page.click("text=Update Employee Records System");
      
      // Wait for dialog to open
      await page.waitForSelector("[role='dialog']");
      
      // Clear and update the title
      const titleInput = page.locator('input[placeholder="Enter task title..."]');
      await titleInput.clear();
      await titleInput.fill("Updated Employee Records System - E2E");
      
      // Submit the form
      await page.click("button:has-text('Update')");
      
      // Verify the task was updated
      await expect(
        page.locator("text=Updated Employee Records System - E2E")
      ).toBeVisible();
    });

    test("should drag and drop task to change status", async ({ page }) => {
      await page.click("button:has-text('Kanban')");
      
      // Find a task in To-do column
      const taskCard = page.locator('text=Review and Update Job').first();
      
      // Find the In Progress column
      const inProgressColumn = page.locator('text=On Progress').first();
      
      // Drag and drop
      await taskCard.dragTo(inProgressColumn);
      
      // Wait for the update
      await page.waitForTimeout(500);
    });
  });

  test.describe("Delete Task (CRUD - Delete)", () => {
    test("should delete a task", async ({ page }) => {
      await page.click("button:has-text('Kanban')");
      
      // Hover over a task to reveal the menu
      const taskCard = page
        .locator('[class*="bg-card"]')
        .filter({ hasText: "Payroll Schedule" })
        .first();
      await taskCard.hover();
      
      // Click the more options button
      await taskCard.locator("button").last().click();
      
      // Handle the confirmation dialog
      page.on("dialog", (dialog) => dialog.accept());
      
      // Click delete
      await page.click("text=Delete");
      
      // Wait for deletion
      await page.waitForTimeout(500);
    });
  });

  test.describe("Theme and Language", () => {
    test("should switch between light and dark theme", async ({ page }) => {
      // Navigate to settings
      await page.click("text=Settings & Preferences");
      
      // Click on dark theme
      await page.click("text=Dark");
      
      // Verify dark theme is applied
      await expect(page.locator("html")).toHaveClass(/dark/);
      
      // Switch back to light
      await page.click("text=Light");
      
      // Verify light theme is applied
      await expect(page.locator("html")).not.toHaveClass(/dark/);
    });

    test("should switch language to French", async ({ page }) => {
      // Navigate to settings
      await page.click("text=Settings & Preferences");
      
      // Click on French
      await page.click("text=Français");
      
      // Navigate back to home
      await page.click("text=HR Tasks Hub");
      
      // Verify French text is displayed
      await expect(page.locator("text=Hub Tâches RH")).toBeVisible();
    });
  });

  test.describe("View Switching", () => {
    test("should switch between all views", async ({ page }) => {
      // Start in default view
      await expect(page.locator("button:has-text('Kanban')")).toBeVisible();
      
      // Switch to Kanban
      await page.click("button:has-text('Kanban')");
      await expect(page.locator("text=To-do")).toBeVisible();
      
      // Switch to List
      await page.click("button:has-text('List')");
      await expect(page.locator("text=Name").first()).toBeVisible();
      
      // Switch to Calendar
      await page.click("button:has-text('Calendar')");
      await expect(page.locator("text=Week")).toBeVisible();
    });
  });
});
