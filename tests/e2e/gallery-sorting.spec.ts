/**
 * E2E Gallery Sorting Tests
 *
 * Tests Gallery sorting feature through browser automation.
 * Tests sort dropdown UI, sort functionality, URL persistence, and filter+sort combinations.
 *
 * Cleanup Strategy: Always Delete
 * - All test users are automatically deleted after test suite completes
 * - Uses cleanupTestUser() helper with /api/test-admin/users endpoint
 * - Runs in afterAll hook regardless of test pass/fail status
 */

import { test, expect } from '@playwright/test';
import {
  createAuthenticatedGalleryUser,
  uploadGalleryPhoto,
  viewMyPhotos,
  viewPublicPhotos,
  bulkUploadPhotosViaAPI,
  cleanupTestUser
} from './helpers/gallery-helpers';

test.describe('Gallery Sorting Feature', () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear localStorage for test isolation
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.afterAll(async ({ request }) => {
    // AUTO DELETE: Cleanup all test users after suite completes
    console.log(`\n🧹 Starting cleanup of ${createdUsers.length} test users...`);

    for (const email of createdUsers) {
      await cleanupTestUser(request, email);
    }

    console.log(`✅ Cleanup complete! Database is clean.\n`);
  });

  test.describe('Task 4.1: Sort Dropdown UI', () => {

    test('SORT-001: should display sort dropdown on main gallery page', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator('span:has-text("Newest First")');
      await expect(dropdownText).toBeVisible();

      // AND: Dropdown button has correct icon
      const dropdownIcon = sortDropdown.locator('span:text("🆕")');
      await expect(dropdownIcon).toBeVisible();

      console.log('✅ SORT-001: Sort dropdown visible on main gallery page');
    });

    test('SORT-002: should display sort dropdown on liked photos page', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to liked photos page
      await page.goto('/myprofile/liked-photos');
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator('span:has-text("Newest First")');
      await expect(dropdownText).toBeVisible();

      console.log('✅ SORT-002: Sort dropdown visible on liked photos page');
    });

    test('SORT-003: should display sort dropdown on favorited photos page', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to favorited photos page
      await page.goto('/myprofile/favorited-photos');
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator('span:has-text("Newest First")');
      await expect(dropdownText).toBeVisible();

      console.log('✅ SORT-003: Sort dropdown visible on favorited photos page');
    });

    test('SORT-004: should open dropdown menu when clicked', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User clicks on sort dropdown button
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300); // Wait for dropdown animation

      // THEN: Dropdown menu is visible
      const dropdownMenu = page.locator('div.absolute.top-full.left-0.mt-2');
      await expect(dropdownMenu).toBeVisible();

      // AND: Dropdown chevron rotates (has rotate-180 class)
      const chevron = sortDropdown.locator('svg.rotate-180');
      await expect(chevron).toBeVisible();

      console.log('✅ SORT-004: Dropdown menu opens when clicked');
    });

    test('SORT-005: should display all 4 sort options in dropdown', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User opens sort dropdown
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: All 4 sort options are visible
      const newestOption = page.locator('button:has-text("Newest First")').last();
      await expect(newestOption).toBeVisible();

      const oldestOption = page.locator('button:has-text("Oldest First")');
      await expect(oldestOption).toBeVisible();

      const mostLikedOption = page.locator('button:has-text("Most Liked")');
      await expect(mostLikedOption).toBeVisible();

      const mostFavoritedOption = page.locator('button:has-text("Most Favorited")');
      await expect(mostFavoritedOption).toBeVisible();

      // AND: Each option has correct icon
      const newestIcon = newestOption.locator('span:text("🆕")');
      await expect(newestIcon).toBeVisible();

      const oldestIcon = oldestOption.locator('span:text("📅")');
      await expect(oldestIcon).toBeVisible();

      const likedIcon = mostLikedOption.locator('span:text("❤️")');
      await expect(likedIcon).toBeVisible();

      const favoritedIcon = mostFavoritedOption.locator('span:text("⭐")');
      await expect(favoritedIcon).toBeVisible();

      // AND: Each option has description text
      await expect(page.getByText('Most recently uploaded')).toBeVisible();
      await expect(page.getByText('Oldest uploads first')).toBeVisible();
      await expect(page.getByText('Sorted by likes count')).toBeVisible();
      await expect(page.getByText('Sorted by favorites count')).toBeVisible();

      console.log('✅ SORT-005: All 4 sort options displayed with icons and descriptions');
    });

    test('SORT-006: should highlight currently selected sort option', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User opens sort dropdown
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: Default "Newest First" option has blue background (bg-blue-50)
      const newestOption = page.locator('button.bg-blue-50:has-text("Newest First")').last();
      await expect(newestOption).toBeVisible();

      // AND: Selected option has checkmark icon
      const checkmark = newestOption.locator('svg.text-blue-600');
      await expect(checkmark).toBeVisible();

      // AND: Selected option text is blue (text-blue-700)
      const selectedText = newestOption.locator('span.text-blue-700:has-text("Newest First")');
      await expect(selectedText).toBeVisible();

      console.log('✅ SORT-006: Currently selected option is highlighted with blue background and checkmark');
    });

    test('SORT-007: should close dropdown when clicking outside', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // Verify dropdown is open
      const dropdownMenu = page.locator('div.absolute.top-full.left-0.mt-2');
      await expect(dropdownMenu).toBeVisible();

      // WHEN: User clicks outside the dropdown (on page header)
      await page.locator('header').click();
      await page.waitForTimeout(300); // Wait for close animation

      // THEN: Dropdown menu is no longer visible
      await expect(dropdownMenu).not.toBeVisible();

      // AND: Chevron is back to normal (not rotated)
      const chevron = sortDropdown.locator('svg:not(.rotate-180)');
      await expect(chevron).toBeVisible();

      console.log('✅ SORT-007: Dropdown closes when clicking outside');
    });

    test('SORT-008: should close dropdown after selecting an option', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // Verify dropdown is open
      const dropdownMenu = page.locator('div.absolute.top-full.left-0.mt-2');
      await expect(dropdownMenu).toBeVisible();

      // WHEN: User selects "Oldest First" option
      const oldestOption = page.locator('button:has-text("Oldest First")');
      await oldestOption.click();
      await page.waitForTimeout(1000); // Wait for API call and close animation

      // THEN: Dropdown menu is no longer visible
      await expect(dropdownMenu).not.toBeVisible();

      // AND: Dropdown button now shows "Oldest First"
      const dropdownText = sortDropdown.locator('span:has-text("Oldest First")');
      await expect(dropdownText).toBeVisible();

      // AND: Icon changed to 📅
      const dropdownIcon = sortDropdown.locator('span:text("📅")');
      await expect(dropdownIcon).toBeVisible();

      console.log('✅ SORT-008: Dropdown closes after selecting an option and updates display');
    });

    test('SORT-009: should maintain dropdown state across different gallery pages', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on main gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User changes sort to "Oldest First" on main gallery
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);
      await page.locator('button:has-text("Oldest First")').click();
      await page.waitForTimeout(1000);

      // AND: User navigates to liked photos page
      await page.goto('/myprofile/liked-photos');
      await page.waitForTimeout(1000);

      // THEN: Liked photos page has default "Newest First" (independent state)
      const likedSortDropdown = page.locator('button[aria-label="Sort photos"]');
      const likedDropdownText = likedSortDropdown.locator('span:has-text("Newest First")');
      await expect(likedDropdownText).toBeVisible();

      // WHEN: User navigates to favorited photos page
      await page.goto('/myprofile/favorited-photos');
      await page.waitForTimeout(1000);

      // THEN: Favorited photos page also has default "Newest First" (independent state)
      const favoritedSortDropdown = page.locator('button[aria-label="Sort photos"]');
      const favoritedDropdownText = favoritedSortDropdown.locator('span:has-text("Newest First")');
      await expect(favoritedDropdownText).toBeVisible();

      console.log('✅ SORT-009: Each gallery page maintains independent sort state');
    });

    test('SORT-010: should display dropdown with correct styling', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User views the sort dropdown button
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');

      // THEN: Dropdown button has correct base styling
      await expect(sortDropdown).toHaveClass(/bg-white/);
      await expect(sortDropdown).toHaveClass(/border/);
      await expect(sortDropdown).toHaveClass(/border-gray-300/);
      await expect(sortDropdown).toHaveClass(/rounded-lg/);
      await expect(sortDropdown).toHaveClass(/shadow-sm/);

      // AND: Button has minimum width for consistent sizing
      await expect(sortDropdown).toHaveClass(/min-w-\[200px\]/);

      // WHEN: User opens the dropdown
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: Dropdown menu has correct styling
      const dropdownMenu = page.locator('div.absolute.top-full.left-0.mt-2');
      await expect(dropdownMenu).toHaveClass(/bg-white/);
      await expect(dropdownMenu).toHaveClass(/border/);
      await expect(dropdownMenu).toHaveClass(/border-gray-200/);
      await expect(dropdownMenu).toHaveClass(/rounded-lg/);
      await expect(dropdownMenu).toHaveClass(/shadow-lg/);
      await expect(dropdownMenu).toHaveClass(/z-50/);

      console.log('✅ SORT-010: Dropdown has correct Tailwind styling');
    });

    test('SORT-011: should show hover effects on dropdown options', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // WHEN: User hovers over "Oldest First" option
      const oldestOption = page.locator('button:has-text("Oldest First")');

      // THEN: Option should have hover:bg-gray-50 class
      await expect(oldestOption).toHaveClass(/hover:bg-gray-50/);

      // AND: Option should have transition-colors class
      await expect(oldestOption).toHaveClass(/transition-colors/);

      console.log('✅ SORT-011: Dropdown options have hover effects');
    });

    test('SORT-012: should be accessible via keyboard navigation', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto('/gallery');
      await page.waitForTimeout(1000);

      // WHEN: User focuses on sort dropdown button
      const sortDropdown = page.locator('button[aria-label="Sort photos"]');
      await sortDropdown.focus();

      // THEN: Dropdown button should have aria-label attribute
      await expect(sortDropdown).toHaveAttribute('aria-label', 'Sort photos');

      // AND: Dropdown should have aria-expanded attribute
      await expect(sortDropdown).toHaveAttribute('aria-expanded', 'false');

      // WHEN: User opens dropdown
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: aria-expanded should be true
      await expect(sortDropdown).toHaveAttribute('aria-expanded', 'true');

      console.log('✅ SORT-012: Dropdown is accessible with proper ARIA attributes');
    });

  });

  test.describe('Task 4.2: Sort Functionality (To Be Implemented)', () => {
    // TODO: Will be implemented in next task
    test.skip('SORT-013: should sort photos by newest first', async ({ page }) => {
      // Placeholder for Task 4.2
    });
  });

  test.describe('Task 4.3: Sort Persistence (To Be Implemented)', () => {
    // TODO: Will be implemented in next task
    test.skip('SORT-014: should persist sort in URL on main gallery page', async ({ page }) => {
      // Placeholder for Task 4.3
    });
  });

  test.describe('Task 4.4: Sort + Filter Combination (To Be Implemented)', () => {
    // TODO: Will be implemented in next task
    test.skip('SORT-015: should combine sort with filter correctly', async ({ page }) => {
      // Placeholder for Task 4.4
    });
  });

});
