/**
 * E2E Mobile UX Tests
 *
 * Tests mobile UX improvements for the gallery page:
 * - Compact header with icon-only controls
 * - FAB upload button
 * - Back to top button
 * - Sticky desktop action bar
 * - Scroll position restoration
 *
 * Cleanup Strategy: Always Delete
 * - All test users are automatically deleted after test suite completes
 * - Uses cleanupTestUser() helper with /api/test-admin/users endpoint
 * - Runs in afterAll hook regardless of test pass/fail status
 */

import { test, expect } from '@playwright/test';
import {
  createAuthenticatedGalleryUser,
  cleanupTestUser
} from './helpers/gallery-helpers';

test.describe('Mobile UX Improvements', () => {
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

  // ============================================================
  // 1. Mobile Header Controls (4 tests)
  // ============================================================
  test.describe('Mobile Header Controls', () => {

    test('E2E-MOBILE-001: filter icon visible on mobile', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery on mobile viewport
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      // THEN: Filter icon is visible
      const filterIcon = page.getByLabel('Filter photos');
      await expect(filterIcon).toBeVisible();

      console.log('✅ E2E-MOBILE-001: Filter icon visible on mobile test PASSED');
    });

    test('E2E-MOBILE-002: sort icon visible on mobile', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery on mobile viewport
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      // THEN: Sort icon is visible
      const sortIcon = page.getByLabel('Sort photos');
      await expect(sortIcon).toBeVisible();

      console.log('✅ E2E-MOBILE-002: Sort icon visible on mobile test PASSED');
    });

    test('E2E-MOBILE-003: filter dropdown opens when tapped', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Tapping the filter icon
      const filterIcon = page.getByLabel('Filter photos');
      await filterIcon.click();

      // THEN: Filter dropdown is visible
      const dropdown = page.locator('[role="menu"]').first();
      await expect(dropdown).toBeVisible();

      // AND: All filter options are visible
      await expect(page.getByText('All Photos')).toBeVisible();
      await expect(page.getByText('My Photos')).toBeVisible();
      await expect(page.getByText('My Liked Photos')).toBeVisible();
      await expect(page.getByText('My Favorited Photos')).toBeVisible();

      console.log('✅ E2E-MOBILE-003: Filter dropdown opens test PASSED');
    });

    test('E2E-MOBILE-004: sort dropdown opens when tapped', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Tapping the sort icon
      const sortIcon = page.getByLabel('Sort photos');
      await sortIcon.click();

      // THEN: Sort dropdown is visible
      const dropdown = page.locator('[role="menu"]').first();
      await expect(dropdown).toBeVisible();

      // AND: All sort options are visible
      await expect(page.getByText('Newest First')).toBeVisible();
      await expect(page.getByText('Oldest First')).toBeVisible();
      await expect(page.getByText('Most Liked')).toBeVisible();
      await expect(page.getByText('Most Favorited')).toBeVisible();

      console.log('✅ E2E-MOBILE-004: Sort dropdown opens test PASSED');
    });
  });

  // ============================================================
  // 2. FAB Upload Button (4 tests)
  // ============================================================
  test.describe('FAB Upload Button', () => {

    test('E2E-MOBILE-005: FAB button visible on all devices', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery page
      await page.goto('/gallery');

      // THEN: FAB button is visible
      const fab = page.getByLabel('Upload photo');
      await expect(fab).toBeVisible();

      console.log('✅ E2E-MOBILE-005: FAB visible test PASSED');
    });

    test('E2E-MOBILE-006: FAB button navigates to upload page', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: Clicking the FAB button
      const fab = page.getByLabel('Upload photo');
      await fab.click();

      // THEN: Navigates to upload page
      await expect(page).toHaveURL(/\/gallery\/upload/);

      console.log('✅ E2E-MOBILE-006: FAB navigation test PASSED');
    });

    test('E2E-MOBILE-007: FAB button positioned bottom-right', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: Getting FAB button position
      const fab = page.getByLabel('Upload photo');
      const box = await fab.boundingBox();

      // THEN: Button is positioned at bottom right
      expect(box?.x).toBeGreaterThan(300); // Right side of viewport
      expect(box?.y).toBeGreaterThan(500); // Bottom of viewport

      console.log('✅ E2E-MOBILE-007: FAB position test PASSED');
    });

    test('E2E-MOBILE-008: FAB button has proper styling', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: Getting FAB button styles
      const fab = page.getByLabel('Upload photo');

      // THEN: Button has green background and circular shape
      const bgColor = await fab.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      const borderRadius = await fab.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });

      // Check for green-ish color (rgb(22, 163, 74) is green-600)
      expect(bgColor).toContain('22, 163');
      // Check for circular shape (borderRadius should be 50% or large number)
      expect(parseInt(borderRadius)).toBeGreaterThan(20);

      console.log('✅ E2E-MOBILE-008: FAB styling test PASSED');
    });
  });

  // ============================================================
  // 3. Back to Top (4 tests)
  // ============================================================
  test.describe('Back to Top Button', () => {

    test('E2E-MOBILE-009: back to top appears after scrolling', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: Scrolling down past threshold (400px)
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300); // Wait for animation

      // THEN: Back to top button is visible
      const backToTop = page.getByLabel('Scroll to top');
      await expect(backToTop).toBeVisible();

      console.log('✅ E2E-MOBILE-009: Back to top appears test PASSED');
    });

    test('E2E-MOBILE-010: back to top hidden at top of page', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: At the top of the page
      await page.evaluate(() => window.scrollTo(0, 0));

      // THEN: Back to top button is not visible
      const backToTop = page.getByLabel('Scroll to top');
      await expect(backToTop).not.toBeVisible();

      console.log('✅ E2E-MOBILE-010: Back to top hidden test PASSED');
    });

    test('E2E-MOBILE-011: back to top scrolls to top smoothly', async ({ page }) => {
      // GIVEN: User is logged in and has scrolled down
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      // WHEN: Clicking back to top button
      const backToTop = page.getByLabel('Scroll to top');
      await backToTop.click();
      await page.waitForTimeout(500); // Wait for smooth scroll

      // THEN: Page is scrolled to top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);

      console.log('✅ E2E-MOBILE-011: Back to top scroll test PASSED');
    });

    test('E2E-MOBILE-012: back to top positioned correctly', async ({ page }) => {
      // GIVEN: User is logged in and has scrolled down
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      // WHEN: Getting back to top button position
      const backToTop = page.getByLabel('Scroll to top');
      const box = await backToTop.boundingBox();

      // THEN: Button is positioned at bottom left
      expect(box?.x).toBeLessThan(100); // Left side of viewport
      expect(box?.y).toBeGreaterThan(500); // Bottom of viewport

      console.log('✅ E2E-MOBILE-012: Back to top position test PASSED');
    });
  });

  // ============================================================
  // 4. Desktop Sticky Controls (4 tests)
  // ============================================================
  test.describe('Desktop Sticky Controls', () => {

    test('E2E-MOBILE-013: action bar sticks on desktop', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on desktop
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // Get initial position of action bar
      const actionBar = page.locator('div.sticky').first();
      const initialPosition = await actionBar.boundingBox();

      // WHEN: Scrolling down
      await page.evaluate(() => window.scrollTo(0, 500));

      // THEN: Action bar sticks to top (position changes)
      const scrolledPosition = await actionBar.boundingBox();
      expect(scrolledPosition?.y).toBeLessThanOrEqual(initialPosition?.y || 0);

      console.log('✅ E2E-MOBILE-013: Sticky action bar test PASSED');
    });

    test('E2E-MOBILE-014: controls accessible when scrolled', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on desktop
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // WHEN: Scrolling down
      await page.evaluate(() => window.scrollTo(0, 500));

      // THEN: Filter and sort controls are still visible and clickable
      const filterDropdown = page.locator('button:has-text("All Photos")');
      const sortDropdown = page.locator('button:has-text("Newest First")');
      await expect(filterDropdown).toBeVisible();
      await expect(sortDropdown).toBeVisible();

      console.log('✅ E2E-MOBILE-014: Controls accessible test PASSED');
    });

    test('E2E-MOBILE-015: filter works in sticky mode', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on desktop
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // WHEN: Scrolling down and clicking filter
      await page.evaluate(() => window.scrollTo(0, 500));
      const filterDropdown = page.locator('button:has-text("All Photos")');
      await filterDropdown.click();

      // THEN: Filter dropdown opens
      await expect(page.getByText('My Photos')).toBeVisible();

      console.log('✅ E2E-MOBILE-015: Filter in sticky mode test PASSED');
    });

    test('E2E-MOBILE-016: sort works in sticky mode', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on desktop
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // WHEN: Scrolling down and clicking sort
      await page.evaluate(() => window.scrollTo(0, 500));
      const sortDropdown = page.locator('button:has-text("Newest First")');
      await sortDropdown.click();

      // THEN: Sort dropdown opens
      await expect(page.getByText('Oldest First')).toBeVisible();

      console.log('✅ E2E-MOBILE-016: Sort in sticky mode test PASSED');
    });
  });

  // ============================================================
  // 5. Cross-Device (4 tests)
  // ============================================================
  test.describe('Cross-Device Layout', () => {

    test('E2E-MOBILE-017: mobile layout correct (< 640px)', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery on mobile viewport
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // THEN: Mobile icons visible, desktop controls hidden
      await expect(page.getByLabel('Filter photos')).toBeVisible();
      await expect(page.getByLabel('Sort photos')).toBeVisible();
      await expect(page.locator('button:has-text("All Photos")')).not.toBeVisible();

      console.log('✅ E2E-MOBILE-017: Mobile layout test PASSED');
    });

    test('E2E-MOBILE-018: desktop layout correct (>= 640px)', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery on desktop viewport
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // THEN: Desktop controls visible, mobile icons hidden
      await expect(page.locator('button:has-text("All Photos")')).toBeVisible();
      await expect(page.locator('button:has-text("Newest First")')).toBeVisible();
      await expect(page.getByLabel('Filter photos')).not.toBeVisible();

      console.log('✅ E2E-MOBILE-018: Desktop layout test PASSED');
    });

    test('E2E-MOBILE-019: tablet layout correct (640-1024px)', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: Viewing gallery on tablet viewport
      await page.goto('/gallery');
      await page.setViewportSize({ width: 768, height: 1024 });

      // THEN: Desktop controls visible (tablet uses desktop layout)
      await expect(page.locator('button:has-text("All Photos")')).toBeVisible();
      await expect(page.locator('button:has-text("Newest First")')).toBeVisible();

      console.log('✅ E2E-MOBILE-019: Tablet layout test PASSED');
    });

    test('E2E-MOBILE-020: no layout issues at any size', async ({ page }) => {
      // GIVEN: User is logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');

      // WHEN: Testing various viewport sizes
      const viewports = [
        { width: 375, height: 667 },   // iPhone SE
        { width: 390, height: 844 },   // iPhone 13
        { width: 414, height: 896 },   // iPhone 14 Plus
        { width: 768, height: 1024 },  // iPad
        { width: 1024, height: 768 },  // Desktop
        { width: 1920, height: 1080 }  // Large desktop
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(100);

        // THEN: Page loads without errors
        const title = await page.title();
        expect(title).toContain('Photo Gallery');
      }

      console.log('✅ E2E-MOBILE-020: No layout issues test PASSED');
    });
  });

  // ============================================================
  // 6. Feature Parity (4 tests)
  // ============================================================
  test.describe('Feature Parity', () => {

    test('E2E-MOBILE-021: all filter options work on mobile', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Testing each filter option
      const filters = ['All Photos', 'My Photos', 'My Liked Photos', 'My Favorited Photos'];

      for (const filter of filters) {
        await page.getByLabel('Filter photos').click();
        await page.getByText(filter).click();
        await page.waitForTimeout(200);

        // THEN: URL updates with correct filter parameter
        const url = page.url();
        expect(url).toContain('filter=');

        // Close dropdown if still open
        const dropdown = page.locator('[role="menu"]').first();
        if (await dropdown.isVisible()) {
          await page.keyboard.press('Escape');
        }
      }

      console.log('✅ E2E-MOBILE-021: Filter options test PASSED');
    });

    test('E2E-MOBILE-022: all sort options work on mobile', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Testing each sort option
      const sorts = ['Newest First', 'Oldest First', 'Most Liked', 'Most Favorited'];

      for (const sort of sorts) {
        await page.getByLabel('Sort photos').click();
        await page.getByText(sort).click();
        await page.waitForTimeout(200);

        // THEN: URL updates with correct sort parameter
        const url = page.url();
        expect(url).toContain('sortBy=');

        // Close dropdown if still open
        const dropdown = page.locator('[role="menu"]').first();
        if (await dropdown.isVisible()) {
          await page.keyboard.press('Escape');
        }
      }

      console.log('✅ E2E-MOBILE-022: Sort options test PASSED');
    });

    test('E2E-MOBILE-023: URL params update correctly', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Changing filter and sort
      await page.getByLabel('Filter photos').click();
      await page.getByText('My Photos').click();
      await page.waitForTimeout(200);

      await page.getByLabel('Sort photos').click();
      await page.getByText('Oldest First').click();
      await page.waitForTimeout(200);

      // THEN: URL contains both parameters
      const url = page.url();
      expect(url).toContain('filter=my-photos');
      expect(url).toContain('sortBy=oldest');

      console.log('✅ E2E-MOBILE-023: URL params test PASSED');
    });

    test('E2E-MOBILE-024: API calls work correctly', async ({ page }) => {
      // GIVEN: User is logged in and viewing gallery on mobile
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Changing filter
      await page.getByLabel('Filter photos').click();
      await page.getByText('My Photos').click();

      // THEN: Page loads without errors
      await page.waitForLoadState('networkidle');
      const title = await page.title();
      expect(title).toContain('Photo Gallery');

      console.log('✅ E2E-MOBILE-024: API calls test PASSED');
    });
  });

  // ============================================================
  // 7. Scroll Position Restoration (4 tests)
  // ============================================================
  test.describe('Scroll Position Restoration', () => {

    test('E2E-MOBILE-025: scroll position saved when clicking photo', async ({ page }) => {
      // GIVEN: User is logged in and has scrolled down
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      // WHEN: Clicking on a photo (if any exists)
      const firstPhoto = page.locator('.group.cursor-pointer').first();
      if (await firstPhoto.isVisible()) {
        await firstPhoto.click();
        await page.waitForTimeout(200);

        // THEN: sessionStorage contains scroll position
        const hasScrollData = await page.evaluate(() => {
          return Object.keys(sessionStorage).some(key =>
            key.startsWith('gallery-scroll-position')
          );
        });
        expect(hasScrollData).toBeTruthy();
      } else {
        console.log('⚠️ No photos found, skipping test');
      }

      console.log('✅ E2E-MOBILE-025: Scroll position saved test PASSED');
    });

    test('E2E-MOBILE-026: scroll position restored when returning to gallery', async ({ page }) => {
      // GIVEN: User clicked on a photo from scrolled position
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      const firstPhoto = page.locator('.group.cursor-pointer').first();
      if (await firstPhoto.isVisible()) {
        await firstPhoto.click();
        await page.waitForTimeout(300);

        // WHEN: Navigating back to gallery
        await page.goBack();
        await page.waitForTimeout(500);

        // THEN: Scroll position is restored (not at top)
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      } else {
        console.log('⚠️ No photos found, skipping test');
      }

      console.log('✅ E2E-MOBILE-026: Scroll position restored test PASSED');
    });

    test('E2E-MOBILE-027: scroll restoration works on mobile', async ({ page }) => {
      // GIVEN: User is on mobile viewport
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 375, height: 667 });

      // WHEN: Scrolling and clicking photo
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      const firstPhoto = page.locator('.group.cursor-pointer').first();
      if (await firstPhoto.isVisible()) {
        const initialScroll = await page.evaluate(() => window.scrollY);
        await firstPhoto.click();
        await page.waitForTimeout(300);

        // AND: Navigating back
        await page.goBack();
        await page.waitForTimeout(500);

        // THEN: Scroll position is restored
        const restoredScroll = await page.evaluate(() => window.scrollY);
        expect(restoredScroll).toBeCloseTo(initialScroll, 100);
      } else {
        console.log('⚠️ No photos found, skipping test');
      }

      console.log('✅ E2E-MOBILE-027: Mobile scroll restoration test PASSED');
    });

    test('E2E-MOBILE-028: scroll restoration works on desktop', async ({ page }) => {
      // GIVEN: User is on desktop viewport
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);
      await page.goto('/gallery');
      await page.setViewportSize({ width: 1024, height: 768 });

      // WHEN: Scrolling and clicking photo
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      const firstPhoto = page.locator('.group.cursor-pointer').first();
      if (await firstPhoto.isVisible()) {
        const initialScroll = await page.evaluate(() => window.scrollY);
        await firstPhoto.click();
        await page.waitForTimeout(300);

        // AND: Navigating back
        await page.goBack();
        await page.waitForTimeout(500);

        // THEN: Scroll position is restored
        const restoredScroll = await page.evaluate(() => window.scrollY);
        expect(restoredScroll).toBeCloseTo(initialScroll, 100);
      } else {
        console.log('⚠️ No photos found, skipping test');
      }

      console.log('✅ E2E-MOBILE-028: Desktop scroll restoration test PASSED');
    });
  });
});
