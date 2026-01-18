/**
 * Form Validation E2E Tests
 *
 * Tests for real-time form validation UX.
 */

import { test, expect } from "@playwright/test";

test.describe("Form Validation UX", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto("http://localhost:3002/login");
  });

  test("should show email validation error on blur", async ({ page }) => {
    // Enter invalid email
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "TestPass123!");

    // Blur the email field to trigger validation
    await page.blur('input[name="email"]');

    // Wait for validation message
    await page.waitForTimeout(100);

    // Check for error message
    const emailField = page.locator('input[name="email"]').locator("..");
    const errorMessage = emailField.locator("p.text-red-600");
    await expect(errorMessage).toContainText("email");
  });

  test("should show password validation error on blur", async ({ page }) => {
    // Enter short password
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "short");

    // Blur the password field to trigger validation
    await page.blur('input[name="password"]');

    // Wait for validation message
    await page.waitForTimeout(100);

    // Check for error message
    const passwordField = page.locator('input[name="password"]').locator("..");
    const errorMessage = passwordField.locator("p.text-red-600");
    await expect(errorMessage).toContainText("8 characters");
  });

  test("should show valid message for correct email", async ({ page }) => {
    // Enter valid email
    await page.fill('input[name="email"]', "test@example.com");

    // Blur the email field to trigger validation
    await page.blur('input[name="email"]');

    // Wait for validation message
    await page.waitForTimeout(100);

    // Check for success message (green text with checkmark)
    const emailField = page.locator('input[name="email"]').locator("..");
    const successMessage = emailField.locator("p.text-green-600");
    await expect(successMessage).toContainText("Looks good!");
  });

  test("should show valid message for strong password", async ({ page }) => {
    // Enter strong password
    await page.fill('input[name="password"]', "StrongPass123!");

    // Blur the password field to trigger validation
    await page.blur('input[name="password"]');

    // Wait for validation message
    await page.waitForTimeout(100);

    // Check for success message (green text with checkmark)
    const passwordField = page.locator('input[name="password"]').locator("..");
    const successMessage = passwordField.locator("p.text-green-600");
    await expect(successMessage).toContainText("Looks good!");
  });

  test("should clear error when user starts typing", async ({ page }) => {
    // Enter invalid email and blur to show error
    await page.fill('input[name="email"]', "invalid-email");
    await page.blur('input[name="email"]');

    // Wait for validation
    await page.waitForTimeout(100);

    // Verify error is shown
    const emailField = page.locator('input[name="email"]').locator("..");
    const errorMessage = emailField.locator("p.text-red-600");
    await expect(errorMessage).toContainText("email");

    // Start typing valid email
    await page.fill('input[name="email"]', "test@example.com");

    // Error should be cleared immediately
    const isErrorCleared = await errorMessage.isVisible().catch(() => false);
    expect(isErrorCleared).toBeFalsy();
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator(
      'button[data-testid="password-toggle-button"]',
    );

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click toggle button to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click toggle button again to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should not validate until field is blurred", async ({ page }) => {
    // Enter invalid email but don't blur
    await page.fill('input[name="email"]', "invalid-email");

    // Wait a bit to ensure no validation happens
    await page.waitForTimeout(200);

    // Check that no error message is shown yet
    const emailField = page.locator('input[name="email"]').locator("..");
    const errorMessage = emailField.locator("p.text-red-600");
    const isErrorVisible = await errorMessage.isVisible().catch(() => false);
    expect(isErrorVisible).toBeFalsy();
  });

  test("should validate both fields on submit", async ({ page }) => {
    // Fill form with invalid data
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "short");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for validation
    await page.waitForTimeout(200);

    // Both fields should show errors
    const emailField = page.locator('input[name="email"]').locator("..");
    const emailError = emailField.locator("p.text-red-600");
    await expect(emailError).toContainText("email");

    const passwordField = page.locator('input[name="password"]').locator("..");
    const passwordError = passwordField.locator("p.text-red-600");
    await expect(passwordError).toContainText("8 characters");
  });

  test("should show required indicator on labels", async ({ page }) => {
    // Check email field has required asterisk
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toContainText("*");

    // Check password field has required asterisk
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toContainText("*");
  });

  test("should allow form submission with valid data", async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPass123!");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for API call (should not show validation errors)
    await page.waitForTimeout(500);

    // Check that no inline validation errors are shown
    const emailField = page.locator('input[name="email"]').locator("..");
    const emailError = emailField.locator("p.text-red-600");
    const isEmailErrorVisible = await emailError.isVisible().catch(() => false);
    expect(isEmailErrorVisible).toBeFalsy();

    const passwordField = page.locator('input[name="password"]').locator("..");
    const passwordError = passwordField.locator("p.text-red-600");
    const isPasswordErrorVisible = await passwordError
      .isVisible()
      .catch(() => false);
    expect(isPasswordErrorVisible).toBeFalsy();
  });

  test("should have proper keyboard navigation", async ({ page }) => {
    // Tab to email field
    await page.keyboard.press("Tab");
    await expect(page.locator('input[name="email"]')).toBeFocused();

    // Type email
    await page.keyboard.type("test@example.com");

    // Tab to password field
    await page.keyboard.press("Tab");
    await expect(page.locator('input[name="password"]')).toBeFocused();

    // Type password
    await page.keyboard.type("TestPass123!");

    // Tab to sign in button
    await page.keyboard.press("Tab");
    await expect(page.locator('button[type="submit"]')).toBeFocused();

    // Press Enter to submit
    await page.keyboard.press("Enter");
    // Form should attempt submission (will fail auth, but validation should pass)
  });

  test("should show error icon with error message", async ({ page }) => {
    // Enter invalid email
    await page.fill('input[name="email"]', "invalid-email");
    await page.blur('input[name="email"]');

    // Wait for validation
    await page.waitForTimeout(100);

    // Check for error icon (SVG)
    const emailField = page.locator('input[name="email"]').locator("..");
    const errorIcon = emailField.locator("p.text-red-600 svg");
    await expect(errorIcon).toBeVisible();
  });

  test("should show success icon with valid message", async ({ page }) => {
    // Enter valid email
    await page.fill('input[name="email"]', "test@example.com");
    await page.blur('input[name="email"]');

    // Wait for validation
    await page.waitForTimeout(100);

    // Check for success icon (SVG)
    const emailField = page.locator('input[name="email"]').locator("..");
    const successIcon = emailField.locator("p.text-green-600 svg");
    await expect(successIcon).toBeVisible();
  });
});

test.describe("Form Validation Accessibility", () => {
  test("should be accessible with screen reader", async ({ page }) => {
    await page.goto("http://localhost:3002/login");

    // Check that labels are properly associated with inputs
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("id", "email");

    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute("id", "password");

    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
  });

  test("should have appropriate ARIA attributes", async ({ page }) => {
    await page.goto("http://localhost:3002/login");

    // Check for required attribute
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("required");

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute("required");

    // Check for proper input types
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });
});
