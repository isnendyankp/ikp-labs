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

import { test, expect } from "@playwright/test";
import {
  createAuthenticatedGalleryUser,
  uploadGalleryPhoto,
  viewMyPhotos,
  viewPublicPhotos,
  bulkUploadPhotosViaAPI,
  cleanupTestUser,
} from "./helpers/gallery-helpers";

test.describe("Gallery Sorting Feature", () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear localStorage for test isolation
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test.afterAll(async ({ request }) => {
    // AUTO DELETE: Cleanup all test users after suite completes
    console.log(
      `\n🧹 Starting cleanup of ${createdUsers.length} test users...`,
    );

    for (const email of createdUsers) {
      await cleanupTestUser(request, email);
    }

    console.log(`✅ Cleanup complete! Database is clean.\n`);
  });

  test.describe("Task 4.1: Sort Dropdown UI", () => {
    test("SORT-001: should display sort dropdown on main gallery page", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator(
        'span:has-text("Newest First")',
      );
      await expect(dropdownText).toBeVisible();

      // AND: Dropdown button has correct icon
      const dropdownIcon = sortDropdown.locator('span:text("🆕")');
      await expect(dropdownIcon).toBeVisible();

      console.log("✅ SORT-001: Sort dropdown visible on main gallery page");
    });

    test("SORT-002: should display sort dropdown on liked photos page", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to liked photos page
      await page.goto("/myprofile/liked-photos");
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator(
        'span:has-text("Newest First")',
      );
      await expect(dropdownText).toBeVisible();

      console.log("✅ SORT-002: Sort dropdown visible on liked photos page");
    });

    test("SORT-003: should display sort dropdown on favorited photos page", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to favorited photos page
      await page.goto("/myprofile/favorited-photos");
      await page.waitForTimeout(1000); // Wait for page load

      // THEN: Sort dropdown is visible
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });

      // AND: Default sort option is "Newest First"
      const dropdownText = sortDropdown.locator(
        'span:has-text("Newest First")',
      );
      await expect(dropdownText).toBeVisible();

      console.log(
        "✅ SORT-003: Sort dropdown visible on favorited photos page",
      );
    });

    test("SORT-004: should open dropdown menu when clicked", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User clicks on sort dropdown button (desktop version)
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(sortDropdown).toBeVisible({ timeout: 10000 });
      await sortDropdown.click();
      await page.waitForTimeout(500); // Wait for dropdown animation

      // THEN: Dropdown menu is visible
      const dropdownMenu = page.locator("div.absolute.top-full").last();
      await expect(dropdownMenu).toBeVisible();

      // AND: Dropdown chevron rotates (has rotate-180 class)
      const chevron = sortDropdown.locator("svg.rotate-180");
      await expect(chevron).toBeVisible();

      console.log("✅ SORT-004: Dropdown menu opens when clicked");
    });

    test("SORT-005: should display all 4 sort options in dropdown", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User opens sort dropdown
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: All 4 sort options are visible
      const newestOption = page
        .locator('button:has-text("Newest First")')
        .last();
      await expect(newestOption).toBeVisible();

      const oldestOption = page.locator('button:has-text("Oldest First")');
      await expect(oldestOption).toBeVisible();

      const mostLikedOption = page.locator('button:has-text("Most Liked")');
      await expect(mostLikedOption).toBeVisible();

      const mostFavoritedOption = page.locator(
        'button:has-text("Most Favorited")',
      );
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
      await expect(page.getByText("Most recently uploaded")).toBeVisible();
      await expect(page.getByText("Oldest uploads first")).toBeVisible();
      await expect(page.getByText("Sorted by likes count")).toBeVisible();
      await expect(page.getByText("Sorted by favorites count")).toBeVisible();

      console.log(
        "✅ SORT-005: All 4 sort options displayed with icons and descriptions",
      );
    });

    test("SORT-006: should highlight currently selected sort option", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User opens sort dropdown
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: Default "Newest First" option has blue background (bg-blue-50)
      const newestOption = page
        .locator('button.bg-blue-50:has-text("Newest First")')
        .last();
      await expect(newestOption).toBeVisible();

      // AND: Selected option has checkmark icon
      const checkmark = newestOption.locator("svg.text-blue-600");
      await expect(checkmark).toBeVisible();

      // AND: Selected option text is blue (text-blue-700)
      const selectedText = newestOption.locator(
        'span.text-blue-700:has-text("Newest First")',
      );
      await expect(selectedText).toBeVisible();

      console.log(
        "✅ SORT-006: Currently selected option is highlighted with blue background and checkmark",
      );
    });

    test("SORT-007: should close dropdown when clicking outside", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // Verify dropdown is open
      const dropdownMenu = page.locator("div.absolute.top-full.left-0.mt-2");
      await expect(dropdownMenu).toBeVisible();

      // WHEN: User clicks outside the dropdown (on page header)
      await page.locator("header").click();
      await page.waitForTimeout(300); // Wait for close animation

      // THEN: Dropdown menu is no longer visible
      await expect(dropdownMenu).not.toBeVisible();

      // AND: Chevron is back to normal (not rotated)
      const chevron = sortDropdown.locator("svg:not(.rotate-180)");
      await expect(chevron).toBeVisible();

      console.log("✅ SORT-007: Dropdown closes when clicking outside");
    });

    test("SORT-008: should close dropdown after selecting an option", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // Verify dropdown is open
      const dropdownMenu = page.locator("div.absolute.top-full.left-0.mt-2");
      await expect(dropdownMenu).toBeVisible();

      // WHEN: User selects "Oldest First" option
      const oldestOption = page.locator('button:has-text("Oldest First")');
      await oldestOption.click();
      await page.waitForTimeout(1000); // Wait for API call and close animation

      // THEN: Dropdown menu is no longer visible
      await expect(dropdownMenu).not.toBeVisible();

      // AND: Dropdown button now shows "Oldest First"
      const dropdownText = sortDropdown.locator(
        'span:has-text("Oldest First")',
      );
      await expect(dropdownText).toBeVisible();

      // AND: Icon changed to 📅
      const dropdownIcon = sortDropdown.locator('span:text("📅")');
      await expect(dropdownIcon).toBeVisible();

      console.log(
        "✅ SORT-008: Dropdown closes after selecting an option and updates display",
      );
    });

    test("SORT-009: should maintain dropdown state across different gallery pages", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on main gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User changes sort to "Oldest First" on main gallery
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);
      await page.locator('button:has-text("Oldest First")').click();
      await page.waitForTimeout(1000);

      // AND: User navigates to liked photos page
      await page.goto("/myprofile/liked-photos");
      await page.waitForTimeout(1000);

      // THEN: Liked photos page has default "Newest First" (independent state)
      const likedSortDropdown = page.locator(
        'button[aria-label="Sort photos"]',
      );
      const likedDropdownText = likedSortDropdown.locator(
        'span:has-text("Newest First")',
      );
      await expect(likedDropdownText).toBeVisible();

      // WHEN: User navigates to favorited photos page
      await page.goto("/myprofile/favorited-photos");
      await page.waitForTimeout(1000);

      // THEN: Favorited photos page also has default "Newest First" (independent state)
      const favoritedSortDropdown = page.locator(
        'button[aria-label="Sort photos"]',
      );
      const favoritedDropdownText = favoritedSortDropdown.locator(
        'span:has-text("Newest First")',
      );
      await expect(favoritedDropdownText).toBeVisible();

      console.log(
        "✅ SORT-009: Each gallery page maintains independent sort state",
      );
    });

    test("SORT-010: should display dropdown with correct styling", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User views the sort dropdown button
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();

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
      const dropdownMenu = page.locator("div.absolute.top-full.left-0.mt-2");
      await expect(dropdownMenu).toHaveClass(/bg-white/);
      await expect(dropdownMenu).toHaveClass(/border/);
      await expect(dropdownMenu).toHaveClass(/border-gray-200/);
      await expect(dropdownMenu).toHaveClass(/rounded-lg/);
      await expect(dropdownMenu).toHaveClass(/shadow-lg/);
      await expect(dropdownMenu).toHaveClass(/z-50/);

      console.log("✅ SORT-010: Dropdown has correct Tailwind styling");
    });

    test("SORT-011: should show hover effects on dropdown options", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // AND: User has opened the sort dropdown
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // WHEN: User hovers over "Oldest First" option
      const oldestOption = page.locator('button:has-text("Oldest First")');

      // THEN: Option should have hover:bg-gray-50 class
      await expect(oldestOption).toHaveClass(/hover:bg-gray-50/);

      // AND: Option should have transition-colors class
      await expect(oldestOption).toHaveClass(/transition-colors/);

      console.log("✅ SORT-011: Dropdown options have hover effects");
    });

    test("SORT-012: should be accessible via keyboard navigation", async ({
      page,
    }) => {
      // FIXME: Sort dropdown not found on /gallery page in CI (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User is on gallery page
      await page.goto("/gallery");
      await page.waitForTimeout(1000);

      // WHEN: User focuses on sort dropdown button
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.focus();

      // THEN: Dropdown button should have aria-label attribute
      await expect(sortDropdown).toHaveAttribute("aria-label", "Sort photos");

      // AND: Dropdown should have aria-expanded attribute
      await expect(sortDropdown).toHaveAttribute("aria-expanded", "false");

      // WHEN: User opens dropdown
      await sortDropdown.click();
      await page.waitForTimeout(300);

      // THEN: aria-expanded should be true
      await expect(sortDropdown).toHaveAttribute("aria-expanded", "true");

      console.log(
        "✅ SORT-012: Dropdown is accessible with proper ARIA attributes",
      );
    });
  });

  test.describe("Task 4.2: Sort Functionality", () => {
    test("SORT-013: should sort photos by newest first (default)", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 photos sequentially (newest to oldest)
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 1 - Newest",
        description: "Uploaded first (newest)",
        isPublic: false, // Privacy doesn't matter for "My Photos" view
      });

      // Wait 1 second to ensure different timestamps
      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 2 - Middle",
        description: "Uploaded second",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 3 - Oldest",
        description: "Uploaded third (oldest)",
        isPublic: false,
      });

      // WHEN: User navigates to "My Photos" view with URL parameters
      await page.goto("/gallery?filter=my-photos", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000); // Wait for photos to load

      // Wait for photos to appear
      await page.waitForSelector("h3", { timeout: 10000 });
      await page.waitForTimeout(500);

      // THEN: Photos appear in newest-first order
      const photoTitles = await page.locator("h3").allTextContents();

      // Verify order: Photo 3 (newest) → Photo 2 → Photo 1 (oldest)
      expect(photoTitles[0]).toContain("Photo 3 - Oldest"); // Most recent upload
      expect(photoTitles[1]).toContain("Photo 2 - Middle");
      expect(photoTitles[2]).toContain("Photo 1 - Newest"); // Oldest upload

      console.log("✅ SORT-013: Photos sorted by newest first (default)");
    });

    test("SORT-014: should sort photos by oldest first", async ({ page }) => {
      // FIXME: Sort assertion fails in CI environment (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 photos sequentially
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "First Upload",
        description: "Oldest photo",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Second Upload",
        description: "Middle photo",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Third Upload",
        description: "Newest photo",
        isPublic: false,
      });

      // WHEN: User navigates to My Photos view with URL parameters
      await page.goto("/gallery?filter=my-photos", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000); // Wait for photos to load

      // AND: User selects "Oldest First" sort option
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      const oldestOption = page.locator('button:has-text("Oldest First")');
      await oldestOption.click();
      await page.waitForTimeout(2000); // Wait for API call and re-render

      // THEN: Photos appear in oldest-first order
      const photoTitles = await page.locator("h3").allTextContents();

      // Verify order: First Upload → Second Upload → Third Upload
      expect(photoTitles[0]).toContain("First Upload");
      expect(photoTitles[1]).toContain("Second Upload");
      expect(photoTitles[2]).toContain("Third Upload");

      console.log("✅ SORT-014: Photos sorted by oldest first");
    });

    test("SORT-015: should sort photos by most liked", async ({ page }) => {
      // FIXME: Sort assertion fails in CI environment (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 public photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo with 0 Likes",
        description: "No likes",
        isPublic: true, // Must be public to be liked by others
      });

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo with Some Likes",
        description: "Will have likes",
        isPublic: true, // FIX: Make public for consistency
      });

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo with Most Likes",
        description: "Will have most likes",
        isPublic: true, // FIX: Make public for consistency
      });

      // WHEN: User navigates to gallery
      await page.goto("/gallery");
      await page.waitForTimeout(1000); // Wait for page to load

      // AND: User selects "My Photos" from filter dropdown
      const filterDropdown = page
        .locator('button:has-text("All Photos"), button:has-text("My Photos")')
        .first();
      await filterDropdown.click();
      await page.waitForTimeout(300);

      const myPhotosOption = page
        .locator('button:has-text("My Photos")')
        .last();
      await myPhotosOption.click();
      await page.waitForTimeout(2000); // Wait for filter to apply and photos to load

      // AND: User selects "Most Liked" sort option
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      const mostLikedOption = page.locator('button:has-text("Most Liked")');
      await mostLikedOption.click();
      await page.waitForTimeout(2000); // Wait for API call

      // THEN: Photos are displayed (order depends on like counts)
      // Since we haven't added likes yet, all have 0 likes, so order may vary
      // This test verifies the sort option works without errors
      const photoCards = page.locator(
        ".group.cursor-pointer.bg-white.rounded-lg",
      );
      const count = await photoCards.count();
      expect(count).toBe(3);

      // Verify sort dropdown shows "Most Liked"
      const dropdownText = sortDropdown.locator('span:has-text("Most Liked")');
      await expect(dropdownText).toBeVisible();

      console.log(
        "✅ SORT-015: Most Liked sort option works (all have 0 likes)",
      );
    });

    test("SORT-016: should sort photos by most favorited", async ({ page }) => {
      // FIXME: Sort assertion fails in CI environment (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo A",
        description: "No favorites",
        isPublic: false,
      });

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo B",
        description: "Some favorites",
        isPublic: false,
      });

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo C",
        description: "Most favorites",
        isPublic: false,
      });

      // WHEN: User navigates to My Photos view with URL parameters
      await page.goto("/gallery?filter=my-photos", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000); // Wait for photos to load

      // AND: User selects "Most Favorited" sort option
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      const mostFavoritedOption = page.locator(
        'button:has-text("Most Favorited")',
      );
      await mostFavoritedOption.click();
      await page.waitForTimeout(2000); // Wait for API call

      // THEN: Photos are displayed (order depends on favorite counts)
      // Since we haven't added favorites yet, all have 0 favorites
      // This test verifies the sort option works without errors
      const photoCards = page.locator(
        ".group.cursor-pointer.bg-white.rounded-lg",
      );
      const count = await photoCards.count();
      expect(count).toBe(3);

      // Verify sort dropdown shows "Most Favorited"
      const dropdownText = sortDropdown.locator(
        'span:has-text("Most Favorited")',
      );
      await expect(dropdownText).toBeVisible();

      console.log(
        "✅ SORT-016: Most Favorited sort option works (all have 0 favorites)",
      );
    });
  });

  test.describe("Task 4.3: Sort Persistence", () => {
    test("SORT-017: should update URL when sort option is selected", async ({
      page,
    }) => {
      // FIXME: Sort URL persistence fails in CI environment (works locally)
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads a photo
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Test Photo",
        description: "For URL persistence test",
        isPublic: false,
      });

      // AND: User is on My Photos view
      await page.goto("/gallery?filter=my-photos", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(2000);

      // WHEN: User selects "Oldest First" sort option
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await sortDropdown.click();
      await page.waitForTimeout(300);

      const oldestOption = page.locator('button:has-text("Oldest First")');
      await oldestOption.click();
      await page.waitForTimeout(1000); // Wait for URL update

      // THEN: URL should contain sortBy=oldest parameter
      const currentUrl = page.url();
      expect(currentUrl).toContain("sortBy=oldest");
      expect(currentUrl).toContain("filter=my-photos");

      console.log(
        "✅ SORT-017: URL updated with sortBy parameter:",
        currentUrl,
      );
    });

    test("SORT-018: should persist sort after page refresh", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "First Photo",
        description: "Oldest",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Second Photo",
        description: "Newest",
        isPublic: false,
      });

      // AND: User navigates to My Photos with oldest sort
      await page.goto("/gallery?filter=my-photos&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(2000);

      // Verify initial sort is "Oldest First"
      const sortDropdownBefore = page.locator(
        'button[aria-label="Sort photos"]',
      );
      await expect(
        sortDropdownBefore.locator('span:has-text("Oldest First")'),
      ).toBeVisible();

      // WHEN: User refreshes the page
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      // THEN: Sort should still be "Oldest First"
      const sortDropdownAfter = page.locator(
        'button[aria-label="Sort photos"]',
      );
      await expect(
        sortDropdownAfter.locator('span:has-text("Oldest First")'),
      ).toBeVisible();

      // AND: URL should still contain sortBy=oldest
      const currentUrl = page.url();
      expect(currentUrl).toContain("sortBy=oldest");

      console.log("✅ SORT-018: Sort persisted after refresh");
    });

    test("SORT-019: should load correct sort from direct URL access", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 1",
        description: "Uploaded first",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 2",
        description: "Uploaded second",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Photo 3",
        description: "Uploaded third",
        isPublic: false,
      });

      // WHEN: User directly navigates to URL with sortBy=oldest
      await page.goto("/gallery?filter=my-photos&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000); // Wait for photos to load

      // THEN: Sort dropdown shows "Oldest First"
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(
        sortDropdown.locator('span:has-text("Oldest First")'),
      ).toBeVisible();

      // AND: Photos are sorted oldest first
      const photoTitles = await page.locator("h3").allTextContents();
      expect(photoTitles[0]).toContain("Photo 1"); // Oldest
      expect(photoTitles[1]).toContain("Photo 2");
      expect(photoTitles[2]).toContain("Photo 3"); // Newest

      console.log("✅ SORT-019: Direct URL with sortBy loaded correctly");
    });

    test("SORT-020: should maintain sort with combined filter and sortBy URL parameters", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads a photo
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Test Photo",
        description: "For combined params test",
        isPublic: false,
      });

      // WHEN: User navigates to URL with both filter and sortBy parameters
      await page.goto("/gallery?filter=my-photos&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000);

      // THEN: URL contains both parameters
      const currentUrl = page.url();
      expect(currentUrl).toContain("filter=my-photos");
      expect(currentUrl).toContain("sortBy=oldest");

      // AND: Sort dropdown shows "Oldest First"
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(
        sortDropdown.locator('span:has-text("Oldest First")'),
      ).toBeVisible();

      // AND: Filter dropdown shows "My Photos"
      const filterDropdown = page
        .locator('button:has-text("My Photos")')
        .first();
      await expect(filterDropdown).toBeVisible();

      console.log(
        "✅ SORT-020: Combined filter + sortBy parameters work together",
      );
    });
  });

  test.describe("Task 4.4: Sort + Filter Combination", () => {
    test("SORT-021: should sort All Photos filter correctly", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 2 public photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Public Photo 1",
        description: "First public",
        isPublic: true,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Public Photo 2",
        description: "Second public",
        isPublic: true,
      });

      // WHEN: User navigates to All Photos with oldest sort
      await page.goto("/gallery?filter=all&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000);

      // THEN: URL contains both parameters
      const currentUrl = page.url();
      expect(currentUrl).toContain("filter=all");
      expect(currentUrl).toContain("sortBy=oldest");

      // AND: Photos are displayed (oldest first based on created_at)
      const photoCards = page.locator(
        ".group.cursor-pointer.bg-white.rounded-lg",
      );
      const count = await photoCards.count();
      expect(count).toBeGreaterThanOrEqual(2);

      console.log("✅ SORT-021: All Photos filter with oldest sort works");
    });

    test("SORT-022: should sort Public Photos filter correctly", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 1 public and 1 private photo
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Private Photo",
        description: "Should not appear in public filter",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "Public Photo",
        description: "Should appear in public filter",
        isPublic: true,
      });

      // WHEN: User navigates to Public Photos with newest sort
      await page.goto("/gallery?filter=public&sortBy=newest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000);

      // THEN: URL contains both parameters
      const currentUrl = page.url();
      expect(currentUrl).toContain("filter=public");
      expect(currentUrl).toContain("sortBy=newest");

      // AND: Only public photos are shown (at least 1)
      const photoCards = page.locator(
        ".group.cursor-pointer.bg-white.rounded-lg",
      );
      const count = await photoCards.count();
      expect(count).toBeGreaterThanOrEqual(1);

      console.log("✅ SORT-022: Public Photos filter with newest sort works");
    });

    test("SORT-023: should sort My Photos filter with all sort options", async ({
      page,
    }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User uploads 3 photos
      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "My Photo 1",
        description: "Oldest",
        isPublic: false,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "My Photo 2",
        description: "Middle",
        isPublic: true,
      });

      await page.waitForTimeout(1000);

      await uploadGalleryPhoto(page, "test-photo.jpg", {
        title: "My Photo 3",
        description: "Newest",
        isPublic: false,
      });

      // TEST 1: Oldest sort
      await page.goto("/gallery?filter=my-photos&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000);

      let photoTitles = await page.locator("h3").allTextContents();
      expect(photoTitles[0]).toContain("My Photo 1"); // Oldest

      // TEST 2: Newest sort
      await page.goto("/gallery?filter=my-photos&sortBy=newest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(3000);

      photoTitles = await page.locator("h3").allTextContents();
      expect(photoTitles[0]).toContain("My Photo 3"); // Newest

      console.log(
        "✅ SORT-023: My Photos filter works with multiple sort options",
      );
    });

    test("SORT-024: should handle empty filter results with sort", async ({
      page,
    }) => {
      // FIXME: Empty filter + sort assertion fails in CI environment (works locally)
      // GIVEN: User is registered and logged in (no photos uploaded)
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User navigates to My Photos with sort (but has no photos)
      await page.goto("/gallery?filter=my-photos&sortBy=oldest", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(2000);

      // THEN: URL contains parameters
      const currentUrl = page.url();
      expect(currentUrl).toContain("filter=my-photos");
      expect(currentUrl).toContain("sortBy=oldest");

      // AND: Empty state is shown (no photos)
      const photoCards = page.locator(
        ".group.cursor-pointer.bg-white.rounded-lg",
      );
      const count = await photoCards.count();
      expect(count).toBe(0);

      // AND: Sort dropdown still works
      const sortDropdown = page
        .locator('button[aria-label="Sort photos"]')
        .last();
      await expect(sortDropdown).toBeVisible();

      console.log("✅ SORT-024: Empty filter with sort handled correctly");
    });
  });
});
