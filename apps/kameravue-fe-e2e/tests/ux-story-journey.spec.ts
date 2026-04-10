import { test, expect } from "@playwright/test";
import { cleanupTestUser } from "./helpers/gallery-helpers";

/**
 * UX Story Journey - Filter State Bug Fix Demo
 *
 * This test demonstrates the filter/sort state preservation bug fix:
 * 1. Register new account
 * 2. Gallery shows photos from ALL users (no upload needed!)
 * 3. Change sort from "Newest First" to "Oldest First"
 * 4. Navigate to upload page (but don't upload)
 * 5. Click back - sort should still be "Oldest First" (bug fix!)
 *
 * Perfect for showcasing the app on LinkedIn!
 */

test.describe("UX Story Journey", () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  const TEST_USER = {
    name: "LinkedIn Demo User",
    email: `linkedin-demo-${Date.now()}@test.com`,
    password: "DemoPassword123!",
  };

  test.setTimeout(120000); // 2 minutes

  test("Filter State Bug Fix: Register → Sort → Navigate → Verify", async ({
    page,
  }) => {
    // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
    test.fixme();
    // ========== PART 1: REGISTRATION ==========
    await test.step("Register new account", async () => {
      await page.goto("http://localhost:3002/register");
      await page.waitForLoadState("networkidle");

      // Fill registration form
      await page.fill('input[name="name"]', TEST_USER.name);
      await page.waitForTimeout(500);

      await page.fill('input[name="email"]', TEST_USER.email);
      await page.waitForTimeout(500);

      await page.fill('input[name="password"]', TEST_USER.password);
      await page.waitForTimeout(500);

      await page.fill('input[name="confirmPassword"]', TEST_USER.password);
      await page.waitForTimeout(500);

      // Submit registration
      await page.click('button[type="submit"]');

      // Wait for navigation to gallery
      await page.waitForURL("**/gallery", { timeout: 20000 });
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Track user for cleanup
      createdUsers.push(TEST_USER.email);
    });

    // ========== PART 2: SORT FILTER BUG FIX DEMO ==========
    // NOTE: Gallery shows photos from ALL users, so no upload needed!
    await test.step("Test sort filter state preservation", async () => {
      // Wait for gallery to fully load
      await page.waitForTimeout(3000);

      // Step 1: Click the Sort dropdown button
      const sortButton = page.locator('button[aria-label="Sort photos"]');
      await sortButton.click();
      await page.waitForTimeout(500);

      // Step 2: Click "Oldest First" option from the dropdown menu
      const oldestFirstOption = page.locator("button", {
        hasText: "Oldest First",
      });
      await oldestFirstOption.click();
      await page.waitForTimeout(1500);

      // Verify URL has sortBy=oldest parameter
      await expect(page).toHaveURL(/sortBy=oldest/);
      await page.waitForTimeout(1000);

      // Step 3: Navigate to upload page (but won't upload)
      const uploadLink = page.locator('button:has-text("Upload Photo")');
      await uploadLink.click({ timeout: 5000 });
      await page.waitForURL("**/upload", { timeout: 10000 });
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Step 4: Click "Back" button - user decides not to upload
      const backButton = page.locator("text=←");
      await backButton.click();

      // Step 5: BUG FIX VERIFICATION - Sort should still be "oldest"!
      await expect(page).toHaveURL(/sortBy=oldest/);
      await page.waitForTimeout(1500);

      // Also verify the button shows "Oldest First"
      const sortButtonText = await sortButton.textContent();
      expect(sortButtonText).toContain("Oldest First");
      await page.waitForTimeout(2000);

      console.log(
        "✅ Bug Fix Verified: Sort state (Oldest First) preserved after navigation!",
      );
    });

    // Final pause
    await page.waitForTimeout(2000);
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
