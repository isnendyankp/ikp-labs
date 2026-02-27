import { test, expect } from "@playwright/test";
import { apiEndpoints } from "../fixtures/test-users";
import { cleanupTestUser } from "./helpers/gallery-helpers";

/**
 * Registration Flow E2E Tests
 *
 * Automated tests based on backend/docs/TESTING_STEP_5.3.md
 * These tests verify the complete registration flow:
 * Frontend → Backend API → Database
 *
 * Test Coverage:
 * - Valid registration
 * - Duplicate email handling
 * - Password mismatch validation
 * - Empty fields validation
 * - Email format validation
 */

test.describe("Registration Flow - End-to-End Tests", () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  // Helper function to generate unique email
  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    return `test.e2e.${timestamp}@example.com`;
  };

  // Before each test, navigate to registration page
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * Test Case 1: Registration with Valid Data
   *
   * Reference: TESTING_STEP_5.3.md - Test 1
   * Expected: Successful registration, JWT token, redirect
   */
  test("Test 1: Should register successfully with valid data", async ({
    page,
  }) => {
    console.log("🧪 Test 1: Registration with Valid Data");

    const uniqueEmail = generateUniqueEmail();
    const testData = {
      fullName: "Playwright Test User",
      email: uniqueEmail,
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Fill registration form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Setup network listener for registration response
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/register") &&
        response.status() === 201,
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response
    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response
    expect(responseData.success).toBe(true);
    expect(responseData.token).toBeTruthy();
    expect(responseData.email).toBe(testData.email);
    expect(responseData.fullName).toBe(testData.fullName);
    expect(responseData.userId).toBeTruthy();

    // Verify JWT token is saved to localStorage
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeTruthy();
    expect(token).toBe(responseData.token);

    // Verify redirect occurred (to gallery)
    await page.waitForURL("/gallery", { timeout: 5000 });

    console.log("✅ Test 1: PASSED");
    console.log(
      `   User created: ${testData.email} (ID: ${responseData.userId})`,
    );

    // Track user for cleanup
    createdUsers.push(testData.email);
  });

  /**
   * Test Case 2: Duplicate Email Registration
   *
   * Reference: TESTING_STEP_5.3.md - Test 2
   * Expected: Error message, no registration
   */
  test("Test 2: Should reject duplicate email registration", async ({
    page,
  }) => {
    console.log("🧪 Test 2: Duplicate Email Registration");

    // STEP 1: Create a user first
    const uniqueEmail = generateUniqueEmail();
    const firstUser = {
      fullName: "First Test User",
      email: uniqueEmail,
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    await page.fill('input[name="name"]', firstUser.fullName);
    await page.fill('input[name="email"]', firstUser.email);
    await page.fill('input[name="password"]', firstUser.password);
    await page.fill('input[name="confirmPassword"]', firstUser.confirmPassword);
    await page.click('button[type="submit"]');

    // Wait for successful registration
    await page.waitForURL("/gallery", { timeout: 5000 });
    createdUsers.push(firstUser.email);
    console.log("  ✓ First user created:", firstUser.email);

    // STEP 2: Logout (clear auth token) before testing duplicate email
    await page.evaluate(() => localStorage.clear());
    console.log("  ✓ Logged out (cleared auth token)");

    // Go back to registration and try duplicate email
    await page.goto("/register");

    const testData = {
      fullName: "Duplicate Test User",
      email: uniqueEmail, // Same email as first user
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Fill form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Setup network listener for any register response
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/auth/register"),
      { timeout: 10000 },
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response
    const response = await responsePromise;
    const responseData = await response.json();

    // Verify error response (should be 400 or 409 for duplicate)
    expect([400, 409]).toContain(response.status());
    expect(responseData.success).toBe(false);
    expect(responseData.message.toLowerCase()).toMatch(
      /already|exists|duplicate/,
    );

    // Verify no new token saved (we cleared it before, should still be null)
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeNull(); // Token should still be null after failed registration

    // Verify still on registration page (no redirect)
    expect(page.url()).toContain("/register");

    // Verify form fields still contain data (not reset)
    const emailValue = await page.inputValue('input[name="email"]');
    expect(emailValue).toBe(testData.email);

    console.log("✅ Test 2: PASSED - Duplicate email rejected");
  });

  /**
   * Test Case 3: Password Mismatch Validation
   *
   * Reference: TESTING_STEP_5.3.md - Test 3
   * Expected: Frontend validation error, no API call
   */
  test("Test 3: Should show error for password mismatch", async ({ page }) => {
    console.log("🧪 Test 3: Password Mismatch Validation");

    const testData = {
      fullName: "Mismatch Test User",
      email: generateUniqueEmail(),
      password: "Password123!",
      confirmPassword: "Different123!", // Intentionally different
    };

    // Fill form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Try to submit
    await page.click('button[type="submit"]');

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Verify error message appears (adjust selector based on your UI)
    // Common patterns: validation message, error text, etc.
    const hasValidationError = await page.evaluate(() => {
      // Check for validation messages in the DOM
      const errorElements = document.querySelectorAll(
        '.error, .text-red-500, [role="alert"]',
      );
      return errorElements.length > 0;
    });

    // Should see validation error
    expect(hasValidationError).toBe(true);

    // Verify still on registration page (form didn't submit)
    expect(page.url()).toContain("/register");

    // Verify no token saved
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeNull();

    console.log("✅ Test 3: PASSED - Password mismatch validation working");
  });

  /**
   * Test Case 4: Empty Fields Validation
   *
   * Reference: TESTING_STEP_5.3.md - Test 4
   * Expected: Required field validation, no submission
   */
  test("Test 4: Should validate required fields", async ({ page }) => {
    console.log("🧪 Test 4: Empty Fields Validation");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check browser's HTML5 validation or custom validation
    const nameInput = page.locator('input[name="name"]');
    const nameValidation = await nameInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );

    // Should have validation message
    expect(nameValidation).toBeTruthy();

    // Verify still on registration page
    expect(page.url()).toContain("/register");

    console.log("✅ Test 4: PASSED - Required field validation working");
  });

  /**
   * Test Case 5: Email Format Validation
   *
   * Expected: Invalid email format rejected
   */
  test("Test 5: Should validate email format", async ({ page }) => {
    console.log("🧪 Test 5: Email Format Validation");

    const testData = {
      fullName: "Email Test User",
      email: "invalid-email-format", // Invalid format (no @)
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Fill form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Try to submit
    await page.click('button[type="submit"]');

    // Check email input validation
    const emailInput = page.locator('input[name="email"]');
    const emailValidation = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );

    // Should have validation message
    expect(emailValidation).toBeTruthy();

    // Verify still on registration page
    expect(page.url()).toContain("/register");

    console.log("✅ Test 5: PASSED - Email format validation working");
  });

  /**
   * Test Case 6: Password Strength Validation
   *
   * Expected: Weak passwords rejected
   */
  test("Test 6: Should validate password strength", async ({ page }) => {
    console.log("🧪 Test 6: Password Strength Validation");

    const testData = {
      fullName: "Password Test User",
      email: generateUniqueEmail(),
      password: "weak", // Too short/weak
      confirmPassword: "weak",
    };

    // Fill form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Try to submit
    await page.click('button[type="submit"]');

    // Wait for validation
    await page.waitForTimeout(1000);

    // Check for password validation error
    const hasPasswordError = await page.evaluate(() => {
      const errorElements = document.querySelectorAll(
        '.error, .text-red-500, [role="alert"]',
      );
      const errorText = Array.from(errorElements)
        .map((el) => el.textContent)
        .join(" ");
      return (
        errorText.toLowerCase().includes("password") ||
        errorText.toLowerCase().includes("character")
      );
    });

    // Should show password error
    expect(hasPasswordError).toBe(true);

    // Verify still on registration page
    expect(page.url()).toContain("/register");

    console.log("✅ Test 6: PASSED - Password strength validation working");
  });

  /**
   * Test Case 7: Loading State During Registration
   *
   * Expected: Loading indicator shown during submission
   */
  test("Test 7: Should show loading state during registration", async ({
    page,
  }) => {
    console.log("🧪 Test 7: Loading State Verification");

    const testData = {
      fullName: "Loading Test User",
      email: generateUniqueEmail(),
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Fill form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Click submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Immediately check if button is disabled or shows loading
    const isDisabled = await submitButton.isDisabled();
    const buttonText = await submitButton.textContent();

    // Button should be disabled or show loading text
    const showsLoadingState =
      isDisabled ||
      buttonText?.toLowerCase().includes("loading") ||
      buttonText?.toLowerCase().includes("registering");

    expect(showsLoadingState).toBe(true);

    // Wait for registration to complete
    await page.waitForResponse((response) =>
      response.url().includes("/api/auth/register"),
    );

    // Track user for cleanup
    createdUsers.push(testData.email);

    console.log("✅ Test 7: PASSED - Loading state displayed correctly");
  });

  /**
   * Test Case 8: No CORS Errors
   *
   * Expected: No CORS errors in console
   */
  test("Test 8: Should not have CORS errors", async ({ page }) => {
    console.log("🧪 Test 8: CORS Configuration Verification");

    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const testData = {
      fullName: "CORS Test User",
      email: generateUniqueEmail(),
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Fill and submit form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    await page.click('button[type="submit"]');

    // Wait for response
    await page.waitForResponse((response) =>
      response.url().includes("/api/auth/register"),
    );

    // Check for CORS errors
    const corsErrors = consoleErrors.filter(
      (err) =>
        err.includes("CORS") || err.includes("Access-Control-Allow-Origin"),
    );

    expect(corsErrors.length).toBe(0);

    // Track user for cleanup
    createdUsers.push(testData.email);

    console.log("✅ Test 8: PASSED - No CORS errors detected");
  });

  // Cleanup hook - Delete all test users after tests complete
  test.afterAll(async ({ request }) => {
    console.log(
      `\n🧹 Starting cleanup of ${createdUsers.length} test users...`,
    );
    for (const email of createdUsers) {
      await cleanupTestUser(request, email);
    }
    console.log(`✅ Cleanup complete! Database is clean.\n`);
  });
});
