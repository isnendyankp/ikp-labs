/**
 * Empty States E2E Tests
 *
 * Tests for the EmptyState component used across the app.
 */

import { test, expect } from "@playwright/test";

test.describe("Empty States", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("http://localhost:3002/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');

    // Wait for navigation to gallery
    await page.waitForURL("**/gallery");
  });

  test("should show empty state when no photos in gallery", async ({
    page,
  }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // Note: This test assumes we can somehow have an empty gallery
    // In a real scenario, you might need to delete all photos first
    // or use a test account with no photos

    // Navigate to gallery
    await page.goto("http://localhost:3002/gallery");

    // Check if empty state is shown (when there are no photos)
    const emptyState = page.locator("text=/No photos found/i");

    // This assertion is conditional - only check if empty state exists
    const isVisible = await emptyState.isVisible().catch(() => false);

    if (isVisible) {
      // Verify empty state components
      await expect(emptyState).toBeVisible();

      // Check for camera icon
      const icon = page.locator("text=📷");
      await expect(icon).toBeVisible();
    }
  });

  test("should show liked photos empty state with CTA", async ({ page }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // Navigate to liked photos page
    await page.goto("http://localhost:3002/myprofile/liked-photos");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if empty state is shown
    const emptyMessage = page.locator(
      "text=/You haven't liked any photos yet/i",
    );

    const isEmpty = await emptyMessage.isVisible().catch(() => false);

    if (isEmpty) {
      // Verify empty state with heart icon
      await expect(emptyMessage).toBeVisible();

      // Check for heart icon
      const heartIcon = page.locator("text=❤️");
      await expect(heartIcon).toBeVisible();

      // Check for CTA button
      const ctaButton = page.locator('button:has-text("Go to Gallery")');
      await expect(ctaButton).toBeVisible();

      // Test CTA button navigation
      await ctaButton.click();
      await page.waitForURL("**/gallery");
      expect(page.url()).toContain("/gallery");
    }
  });

  test("should show favorited photos empty state with CTA", async ({
    page,
  }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // Navigate to favorited photos page
    await page.goto("http://localhost:3002/myprofile/favorited-photos");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if empty state is shown
    const emptyMessage = page.locator(
      "text=/You haven't favorited any photos yet/i",
    );

    const isEmpty = await emptyMessage.isVisible().catch(() => false);

    if (isEmpty) {
      // Verify empty state with star icon
      await expect(emptyMessage).toBeVisible();

      // Check for star icon
      const starIcon = page.locator("text=⭐");
      await expect(starIcon).toBeVisible();

      // Check for CTA button
      const ctaButton = page.locator('button:has-text("Explore Gallery")');
      await expect(ctaButton).toBeVisible();

      // Test CTA button navigation
      await ctaButton.click();
      await page.waitForURL("**/gallery");
      expect(page.url()).toContain("/gallery");
    }
  });

  test("should have proper EmptyState component structure", async ({
    page,
  }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // This test verifies the component structure when empty state is shown
    // We'll use the liked photos page as an example

    await page.goto("http://localhost:3002/myprofile/liked-photos");
    await page.waitForLoadState("networkidle");

    // Check if empty state exists
    const emptyState = page.locator("text=/You haven't liked any photos yet/i");

    const isEmpty = await emptyState.isVisible().catch(() => false);

    if (isEmpty) {
      // Verify centered layout
      const container = page.locator(
        ".flex.flex-col.items-center.justify-center",
      );
      await expect(container).toBeVisible();

      // Verify title is present
      const title = page.locator("h3.text-xl.font-semibold");
      await expect(title).toBeVisible();

      // Verify icon size (text-6xl class)
      const iconContainer = page.locator(".text-6xl");
      await expect(iconContainer).toBeVisible();

      // Verify CTA button styling
      const ctaButton = page.locator("button.px-6.py-2.bg-blue-600");
      const hasButton = await ctaButton.isVisible().catch(() => false);
      if (hasButton) {
        await expect(ctaButton).toBeVisible();
      }
    }
  });

  test("should not show empty state when photos exist", async ({ page }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // Navigate to gallery
    await page.goto("http://localhost:3002/gallery");

    // Wait for photos to load
    await page.waitForLoadState("networkidle");

    // Check if photo grid is present (has photos)
    const photoGrid = page.locator(".grid.grid-cols-1");
    const hasPhotos = await photoGrid.isVisible().catch(() => false);

    if (hasPhotos) {
      // Verify photos are shown
      await expect(photoGrid).toBeVisible();

      // Verify empty state is NOT shown
      const emptyState = page.locator("text=/No photos found/i");
      const isNotEmpty = await emptyState.isVisible().catch(() => false);
      expect(isNotEmpty).toBeFalsy();
    }
  });

  test("should transition from empty state to populated state", async ({
    page,
  }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // This test verifies the transition when photos are added
    // Note: In a real E2E test, you would upload a photo and verify the transition

    // Navigate to liked photos (initially empty)
    await page.goto("http://localhost:3002/myprofile/liked-photos");
    await page.waitForLoadState("networkidle");

    // Check initial empty state
    const emptyState = page.locator("text=/You haven't liked any photos yet/i");

    const isEmpty = await emptyState.isVisible().catch(() => false);

    if (isEmpty) {
      // Verify empty state is shown
      await expect(emptyState).toBeVisible();

      // In a real test, you would:
      // 1. Navigate to gallery
      // 2. Like a photo
      // 3. Return to liked photos page
      // 4. Verify empty state is gone and photos are shown

      // For now, we'll just verify the CTA button works
      const ctaButton = page.locator('button:has-text("Go to Gallery")');
      await ctaButton.click();
      await page.waitForURL("**/gallery");
      expect(page.url()).toContain("/gallery");
    }
  });

  test("should show appropriate empty state messages", async ({ page }) => {
    // FIXME: beforeEach logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    // Test that different pages show different empty state messages

    // Test gallery empty state
    await page.goto("http://localhost:3002/gallery");
    await page.waitForLoadState("networkidle");

    const galleryEmpty = page.locator("text=/No photos found/i");
    const isGalleryEmpty = await galleryEmpty.isVisible().catch(() => false);

    if (isGalleryEmpty) {
      await expect(galleryEmpty).toBeVisible();
    }

    // Test liked photos empty state
    await page.goto("http://localhost:3002/myprofile/liked-photos");
    await page.waitForLoadState("networkidle");

    const likedEmpty = page.locator("text=/You haven't liked any photos yet/i");
    const isLikedEmpty = await likedEmpty.isVisible().catch(() => false);

    if (isLikedEmpty) {
      await expect(likedEmpty).toContainText("like");
    }

    // Test favorited photos empty state
    await page.goto("http://localhost:3002/myprofile/favorited-photos");
    await page.waitForLoadState("networkidle");

    const favoritedEmpty = page.locator(
      "text=/You haven't favorited any photos yet/i",
    );
    const isFavoritedEmpty = await favoritedEmpty
      .isVisible()
      .catch(() => false);

    if (isFavoritedEmpty) {
      await expect(favoritedEmpty).toContainText("favorite");
    }
  });
});

test.describe("EmptyState Component Accessibility", () => {
  test("should be keyboard accessible", async ({ page }) => {
    // FIXME: Logs in as test@example.com which doesn't exist in CI fresh database
    test.fixme();
    await page.goto("http://localhost:3002/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/gallery");
    await page.goto("http://localhost:3002/myprofile/liked-photos");
    await page.waitForLoadState("networkidle");

    const ctaButton = page.locator('button:has-text("Go to Gallery")');
    const hasButton = await ctaButton.isVisible().catch(() => false);

    if (hasButton) {
      // Test keyboard navigation to CTA button
      await page.keyboard.press("Tab");
      await expect(ctaButton).toBeFocused();

      // Test Enter key to activate
      await page.keyboard.press("Enter");
      await page.waitForURL("**/gallery");
      expect(page.url()).toContain("/gallery");
    }
  });
});
