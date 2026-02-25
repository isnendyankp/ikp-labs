import { test, expect } from "@playwright/test";
import { cleanupTestUser } from "./helpers/gallery-helpers";

/**
 * Authentication Flow E2E Tests
 *
 * Tests complete user journey through the authentication system:
 * - Register → Gallery
 * - Login → Gallery
 * - Token persistence
 */

test.describe("Authentication Flow - Complete User Journey", () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  // Helper function to generate unique email
  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `auth.flow.${timestamp}.${random}@example.com`;
  };

  // Helper function to create a test user via registration
  const createTestUser = async (page: any) => {
    const testUser = {
      fullName: "Auth Test User",
      email: generateUniqueEmail(),
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

    // Clear localStorage to prepare for login test
    await page.evaluate(() => localStorage.clear());

    // Track user for cleanup
    createdUsers.push(testUser.email);

    return testUser;
  };

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * Test 1: Registration → Auto Redirect to Gallery
   */
  test("Should register and redirect to gallery page", async ({ page }) => {
    const testData = {
      fullName: "Auth Flow Test User",
      email: generateUniqueEmail(),
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };

    // Go to registration page
    await page.goto("/register");

    // Fill registration form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to /gallery
    await page.waitForURL("/gallery", { timeout: 5000 });

    // Verify on gallery page
    expect(page.url()).toContain("/gallery");

    // Verify gallery page title
    await expect(page.locator("h1")).toContainText("Photo Gallery");

    // Verify token saved in localStorage
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeTruthy();

    // Track user for cleanup
    createdUsers.push(testData.email);

    console.log("✅ Test 1: Registration → Gallery redirect successful");
  });

  /**
   * Test 2: Login → Redirect to Gallery
   */
  test("Should login and redirect to gallery page", async ({ page }) => {
    // Create a test user first
    const testUser = await createTestUser(page);

    // Go to login page
    await page.goto("/login");

    // Fill login form with the newly created user credentials
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to /gallery
    await page.waitForURL("/gallery", { timeout: 5000 });

    // Verify on gallery page
    expect(page.url()).toContain("/gallery");

    // Verify gallery page title
    await expect(page.locator("h1")).toContainText("Photo Gallery");

    // Verify token saved
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeTruthy();

    console.log("✅ Test 2: Login → Gallery redirect successful");
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
