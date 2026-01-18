import { test, expect } from '@playwright/test';

/**
 * UX Story Journey - Filter State Bug Fix Demo
 *
 * Uses existing user account (must have photos in gallery)
 */

test.describe('UX Story Journey', () => {
  // Use a consistent test user - you can create this account manually first
  const TEST_USER = {
    name: 'Demo User',
    email: 'demo@kameravue.com',  // Create this account manually and upload some photos first
    password: 'Demo123456!',
  };

  test.setTimeout(120000);

  test('Filter State Bug Fix Demo (with existing photos)', async ({ page }) => {
    // ========== PART 1: LOGIN ==========
    await test.step('Login with existing account', async () => {
      await page.goto('http://localhost:3002/login');
      await page.waitForLoadState('networkidle');

      await page.fill('input[name="email"]', TEST_USER.email);
      await page.waitForTimeout(500);

      await page.fill('input[name="password"]', TEST_USER.password);
      await page.waitForTimeout(500);

      await page.click('button[type="submit"]');
      await page.waitForURL('**/gallery', { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    // ========== PART 2: SORT FILTER BUG FIX DEMO ==========
    await test.step('Test sort filter state preservation', async () => {
      // Wait for sort dropdown to be visible
      await page.waitForSelector('select[name="sort"]', { state: 'visible', timeout: 10000 });

      // Step 1: Select "Oldest First" sort option
      await page.selectOption('select[name="sort"]', 'oldestFirst');
      await page.waitForTimeout(1500);

      // Verify URL has sort parameter
      await expect(page).toHaveURL(/sort=oldestFirst/);
      await page.waitForTimeout(1000);

      // Step 2: Navigate to upload page
      const uploadLink = page.locator('a:has-text("Upload"), button:has-text("Upload Photo")').first();
      await uploadLink.click({ timeout: 5000 });
      await page.waitForURL('**/upload', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Step 3: Click "Back" button - BUG FIX: Should preserve sort state!
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back"), text=←').first();
      await backButton.click();

      // Step 4: BUG FIX VERIFICATION - Sort should still be "oldestFirst"!
      await expect(page).toHaveURL(/sort=oldestFirst/);
      await page.waitForTimeout(2000);

      // Also verify the dropdown value is still correct
      const sortValue = await page.locator('select[name="sort"]').inputValue();
      expect(sortValue).toBe('oldestFirst');
      await page.waitForTimeout(2000);

      console.log('✅ Bug Fix Verified: Sort state preserved after navigation!');
    });

    await page.waitForTimeout(2000);
  });
});
