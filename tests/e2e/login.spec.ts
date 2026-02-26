import { test, expect } from "@playwright/test";
import { testUsers, apiEndpoints } from "../fixtures/test-users";

/**
 * Login Flow E2E Tests
 *
 * Test suite for login functionality based on TESTING_STEP_5.4.md
 * These tests automate the manual test cases documented in backend/docs/
 */

test.describe("Login Flow - End-to-End Tests", () => {
  // Before each test, ensure we're starting fresh
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * Test Case 1: Login with Valid Credentials
   *
   * Reference: backend/docs/TESTING_STEP_5.4.md - Test Case 1
   * Expected: Successful login, token saved, redirect occurs
   */
  test("Test Case 1: Should login successfully with valid credentials", async ({
    page,
  }) => {
    console.log("🧪 Test Case 1: Login with Valid Credentials");

    // STEP 1: Create a user first
    const testUser = {
      fullName: "Login Test User",
      email: `login.test.${Date.now()}@example.com`,
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="name"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.confirmPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL("/gallery", { timeout: 5000 });
    console.log("  ✓ User created:", testUser.email);

    // STEP 2: Logout
    await page.evaluate(() => localStorage.clear());
    console.log("  ✓ Logged out");

    // STEP 3: Login with created user
    await page.goto("/login");

    // Fill login form with valid credentials
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Setup network listener to catch login response
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/login") && response.status() === 200,
    );

    // Click sign in button
    await page.click('button[type="submit"]');

    // Wait for response
    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response contains expected data
    expect(responseData.success).toBe(true);
    expect(responseData.token).toBeTruthy();
    expect(responseData.email).toBe(testUser.email);
    expect(responseData.fullName).toBe(testUser.fullName);

    // Verify token is saved to localStorage
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeTruthy();
    expect(token).toBe(responseData.token);

    // Wait for redirect to gallery
    await page.waitForURL("/gallery", { timeout: 5000 });

    console.log("✅ Test Case 1: PASSED");
  });

  /**
   * Test Case 2: Login with Invalid Password
   *
   * Reference: backend/docs/TESTING_STEP_5.4.md - Test Case 2
   * Expected: 401 error, generic error message, no token saved
   */
  test("Test Case 2: Should show error with invalid password", async ({
    page,
  }) => {
    console.log("🧪 Test Case 2: Login with Invalid Password");

    await page.goto("/login");

    // Fill form with correct email but wrong password
    await page.fill('input[name="email"]', testUsers.invalidPassword.email);
    await page.fill(
      'input[name="password"]',
      testUsers.invalidPassword.password,
    );

    // Setup network listener for 401 response
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/login") && response.status() === 401,
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for 401 response
    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe("Invalid email or password");
    expect(responseData.token).toBeNull();

    // Verify no token in localStorage
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeNull();

    // Verify error message displayed (adjust selector)
    // await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Verify form is still on login page (no redirect)
    expect(page.url()).toContain("/login");

    // Verify email field still contains the entered email (form not reset)
    const emailValue = await page.inputValue('input[name="email"]');
    expect(emailValue).toBe(testUsers.invalidPassword.email);

    console.log("✅ Test Case 2: PASSED");
  });

  /**
   * Test Case 3: Login with Non-Existent Email
   *
   * Reference: backend/docs/TESTING_STEP_5.4.md - Test Case 3
   * Expected: Same error as Test Case 2 (security best practice)
   */
  test("Test Case 3: Should show same error for non-existent email", async ({
    page,
  }) => {
    console.log("🧪 Test Case 3: Login with Non-Existent Email");

    await page.goto("/login");

    // Fill form with non-existent email
    await page.fill('input[name="email"]', testUsers.nonExistentUser.email);
    await page.fill(
      'input[name="password"]',
      testUsers.nonExistentUser.password,
    );

    // Setup network listener
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/login") && response.status() === 401,
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response
    const response = await responsePromise;
    const responseData = await response.json();

    // IMPORTANT: Error message must be IDENTICAL to Test Case 2
    // This prevents email enumeration attacks
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe("Invalid email or password");
    expect(responseData.token).toBeNull();

    // Verify no token saved
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeNull();

    console.log("✅ Test Case 3: PASSED - Security best practice verified");
  });

  /**
   * Test Case 10: CORS Configuration
   *
   * Reference: backend/docs/TESTING_STEP_5.4.md - Test Case 10
   * Expected: No CORS errors in console
   */
  test("Test Case 10: Should not have CORS errors", async ({ page }) => {
    console.log("🧪 Test Case 10: CORS Configuration");

    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/login");

    // Fill and submit form
    await page.fill('input[name="email"]', testUsers.validUser.email);
    await page.fill('input[name="password"]', testUsers.validUser.password);

    await page.click('button[type="submit"]');

    // Wait a bit for any CORS errors to appear
    await page.waitForTimeout(2000);

    // Check that no CORS errors occurred
    const corsErrors = consoleErrors.filter(
      (err) =>
        err.includes("CORS") || err.includes("Access-Control-Allow-Origin"),
    );

    expect(corsErrors.length).toBe(0);

    console.log("✅ Test Case 10: PASSED - No CORS errors");
  });
});
