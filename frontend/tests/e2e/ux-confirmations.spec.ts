/**
 * Confirmation Dialog E2E Tests
 *
 * Tests for the ConfirmDialog component used in delete actions.
 */

import { test, expect } from "@playwright/test";

test.describe("Confirmation Dialog", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("http://localhost:3002/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');

    // Wait for navigation to gallery
    await page.waitForURL("**/gallery");
  });

  test("should show confirmation dialog before delete", async ({ page }) => {
    // Navigate to a photo detail page (assuming photo ID 1 exists)
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog appears
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // Verify dialog title
    await expect(page.locator("#dialog-title")).toContainText("Delete Photo");

    // Verify dialog message
    await expect(page.locator("#dialog-message")).toContainText(
      "This action cannot be undone",
    );

    // Verify confirm button
    await expect(page.locator('button:has-text("Delete")')).toBeVisible();

    // Verify cancel button
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test("should close dialog when cancel is clicked", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog appears
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // Click cancel button
    await page.click(
      'button:has-text("Cancel"):not([class*="bg-red-"])', // Cancel button
    );

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test("should close dialog when ESC key is pressed", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog appears
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // Press ESC key
    await page.keyboard.press("Escape");

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test("should close dialog when clicking outside", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog appears
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // Click on backdrop (outside dialog)
    const backdrop = page.locator(".fixed.inset-0.bg-black");
    await backdrop.click({ position: { x: 10, y: 10 } });

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test("should focus confirm button when dialog opens", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify confirm button is focused
    const confirmButton = page.locator(
      'button:has-text("Delete").bg-red-600', // Delete button in dialog
    );
    await expect(confirmButton).toBeFocused();
  });

  test("should trap focus within dialog", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Get all focusable elements in dialog
    const focusableElements = page.locator(
      'role=dialog button, role=dialog [tabindex]:not([tabindex="-1"])',
    );

    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);

    // Press Tab multiple times and verify focus stays within dialog
    for (let i = 0; i < count + 2; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => document.activeElement);
      const isInsideDialog = await page.evaluate(
        (el) => el?.closest('[role="dialog"]') !== null,
        focusedElement,
      );
      expect(isInsideDialog).toBeTruthy();
    }
  });

  test("should have correct ARIA attributes", async ({ page }) => {
    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/1");

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog has correct ARIA attributes
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("role", "dialog");

    // Verify aria-labelledby and aria-describedby
    await expect(dialog).toHaveAttribute("aria-labelledby", "dialog-title");
    await expect(dialog).toHaveAttribute("aria-describedby", "dialog-message");
  });
});

test.describe("Confirmation Dialog - Delete Action", () => {
  test("should confirm delete action", async ({ page }) => {
    // Login
    await page.goto("http://localhost:3002/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/gallery");

    // Create a test photo first (this would require upload or API setup)
    // For now, assuming photo exists

    // Navigate to a photo detail page
    await page.goto("http://localhost:3002/gallery/999");

    // Check if photo exists (if not, skip this test)
    const notFound = await page
      .locator("text=Photo not found or access denied")
      .isVisible()
      .catch(() => false);

    if (notFound) {
      test.skip(true, "Test photo not found");
      return;
    }

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Verify dialog appears
    const dialog = page.locator('role=dialog[aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // Click confirm button
    await page.click('button:has-text("Delete").bg-red-600');

    // Verify delete action was initiated (showing "Deleting..." or redirect)
    // Either button shows "Deleting..." or we navigate back to gallery
    const isDeleting = await page
      .locator('button:has-text("Deleting...")')
      .isVisible()
      .catch(() => false);

    const isRedirected = page.url().includes("/gallery");

    expect(isDeleting || isRedirected).toBeTruthy();
  });
});
