/**
 * E2E Photo Favorites Tests
 *
 * Tests Photo Favorites feature through browser automation.
 * Tests favorite/unfavorite from gallery, detail view, persistence, and favorited photos page.
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
  openPhotoDetail,
  cleanupTestUser
} from './helpers/gallery-helpers';

test.describe('Photo Favorites Feature', () => {
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

  test.describe('Basic Favorite/Unfavorite Operations', () => {

    test('E2E-PF-001: should favorite photo from gallery view', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Favorite',
        description: 'Testing favorite from gallery view',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B navigates to Public Photos and sees User A's photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500); // Wait for photos to load

      // Debug: Check current URL and page title
      const currentURL = page.url();
      const pageTitle = await page.title();
      console.log(`🔍 Current URL: ${currentURL}`);
      console.log(`🔍 Page title: ${pageTitle}`);

      // If on detail page, go back to gallery
      if (currentURL.includes('/gallery/photo/')) {
        console.log('⚠️  Detected detail page, navigating back to Public Photos...');
        await page.goto('/gallery');
        await page.click('button:has-text("Public Photos")');
        await page.waitForTimeout(1500);
      }

      // Select FIRST photo card with title "Photo to Favorite" (in case of duplicates)
      const photoCard = page.locator('h3:has-text("Photo to Favorite")').locator('../..').first();

      // Select favorite button specifically with aria-label
      const favoriteButton = photoCard.locator('button[aria-label*="Favorite"]');

      // Verify favorite button is visible
      await expect(favoriteButton).toBeVisible();

      // AND: User B clicks the favorite button
      await favoriteButton.click({ force: true });
      await page.waitForTimeout(1000); // Wait for optimistic update

      // Verify we're still on gallery page
      const urlAfterClick = page.url();
      console.log(`🔍 URL after favorite click: ${urlAfterClick}`);
      expect(urlAfterClick).toContain('/gallery');

      // THEN: Photo should show as favorited (filled star)
      const updatedFavoriteButton = photoCard.locator('button[aria-label*="Unfavorite"]');
      await expect(updatedFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`User B favorited photo`);
      console.log(`✅ E2E-PF-001: Favorite photo from gallery view test PASSED`);
    });

    test('E2E-PF-002: should unfavorite photo from gallery view', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Unfavorite',
        description: 'Testing unfavorite from gallery view',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      // User B navigates to Public Photos
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoCard = page.locator('h3:has-text("Photo to Unfavorite")').locator('../..').first();

      // WHEN: User B favorites the photo
      const favoriteButton = photoCard.locator('button[aria-label*="Favorite"]');
      await favoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User B favorited photo`);

      // AND: User B unfavorites the photo
      const unfavoriteButton = photoCard.locator('button[aria-label*="Unfavorite"]');
      await unfavoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      // THEN: Photo should show as not favorited (outline star)
      const revertedFavoriteButton = photoCard.locator('button[aria-label*="Favorite"]');
      await expect(revertedFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`User B unfavorited photo`);
      console.log(`✅ E2E-PF-002: Unfavorite photo from gallery view test PASSED`);
    });

    test('E2E-PF-003: should favorite photo from detail view', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Detail Favorite Photo',
        description: 'Testing favorite from detail view',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      // User B navigates to Public Photos
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      // WHEN: User B opens photo detail
      await openPhotoDetail(page, 'Detail Favorite Photo');

      // Verify we're on detail page
      await expect(page.locator('h1:has-text("Detail Favorite Photo")')).toBeVisible();

      // Initial favorite button state (outline star)
      const initialFavoriteButton = page.locator('button[aria-label*="Favorite"]').first();
      console.log(`Detail page initial favorite button text: ${await initialFavoriteButton.textContent()}`);

      // AND: User B clicks favorite on detail page
      await initialFavoriteButton.click();
      await page.waitForTimeout(1000);

      // THEN: Photo should show as favorited (filled star)
      const updatedFavoriteButton = page.locator('button[aria-label*="Unfavorite"]').first();
      await expect(updatedFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`Detail page updated favorite button text: ${await updatedFavoriteButton.textContent()}`);
      console.log(`✅ E2E-PF-003: Favorite photo from detail view test PASSED`);
    });

  });

  test.describe('Persistence Tests', () => {

    test('E2E-PF-004: favorite persists after page refresh', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Refresh Persistence Photo',
        description: 'Testing favorite persistence after refresh',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      // User B navigates to Public Photos and favorites the photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoCard = page.locator('h3:has-text("Refresh Persistence Photo")').locator('../..').first();
      const favoriteButton = photoCard.locator('button[aria-label*="Favorite"]');
      await favoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User B favorited photo`);

      // WHEN: User B refreshes the page
      await page.reload();
      await page.waitForTimeout(2000); // Wait for reload

      // THEN: Photo should still be favorited
      const refreshedPhotoCard = page.locator('h3:has-text("Refresh Persistence Photo")').locator('../..').first();
      const persistedFavoriteButton = refreshedPhotoCard.locator('button[aria-label*="Unfavorite"]');
      await expect(persistedFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`After refresh, still favorited`);
      console.log(`✅ E2E-PF-004: Favorite persists after page refresh test PASSED`);
    });

    test('E2E-PF-005: favorite persists after logout and login', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Logout Persistence Photo',
        description: 'Testing favorite persistence after logout/login',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in and favorites the photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoCard = page.locator('h3:has-text("Logout Persistence Photo")').locator('../..').first();
      const favoriteButton = photoCard.locator('button[aria-label*="Favorite"]');
      await favoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User B favorited photo`);

      // WHEN: User B logs out and logs back in
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // Login with same credentials (User B)
      await page.goto('/login');
      await page.fill('[name="email"]', userB.email);
      await page.fill('[name="password"]', userB.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Navigate to Public Photos
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      // THEN: Photo should still be favorited
      const persistedPhotoCard = page.locator('h3:has-text("Logout Persistence Photo")').locator('../..').first();
      const persistedFavoriteButton = persistedPhotoCard.locator('button[aria-label*="Unfavorite"]');
      await expect(persistedFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`After User B logout/login, still favorited`);
      console.log(`✅ E2E-PF-005: Favorite persists after logout and login test PASSED`);
    });

  });

  test.describe('Multi-User Tests', () => {

    test('E2E-PF-006: multiple users can favorite same photo independently', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Multi-User Favorite Photo',
        description: 'Testing multiple users favoriting same photo',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // WHEN: User B logs in and favorites the photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoBCard = page.locator('h3:has-text("Multi-User Favorite Photo")').locator('../..').first();
      const favoriteBButton = photoBCard.locator('button[aria-label*="Favorite"]');
      await favoriteBButton.click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User B favorited photo`);

      // User B logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // AND: User C logs in and favorites the same photo
      const { user: userC } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userC.email);

      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoCCard = page.locator('h3:has-text("Multi-User Favorite Photo")').locator('../..').first();
      const favoriteCButton = photoCCard.locator('button[aria-label*="Favorite"]');
      await favoriteCButton.click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User C favorited photo`);

      // User C logs out and User B logs back in
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      await page.goto('/login');
      await page.fill('[name="email"]', userB.email);
      await page.fill('[name="password"]', userB.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      // THEN: User B should still see photo as favorited (independent from User C)
      const userBPhotoCard = page.locator('h3:has-text("Multi-User Favorite Photo")').locator('../..').first();
      const userBFavoriteButton = userBPhotoCard.locator('button[aria-label*="Unfavorite"]');
      await expect(userBFavoriteButton).toBeVisible({ timeout: 5000 });

      console.log(`User B after refresh, still favorited`);
      console.log(`✅ E2E-PF-006: Multiple users can favorite same photo test PASSED`);
    });

  });

  test.describe('Favorited Photos Page', () => {

    test('E2E-PF-007: view favorited photos page', async ({ page }) => {
      // GIVEN: User A uploads 2 public photos
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Favorited Photo 1',
        description: 'First favorited photo',
        isPublic: true
      });

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Favorited Photo 2',
        description: 'Second favorited photo',
        isPublic: true
      });

      // Also upload a photo that won't be favorited
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Not Favorited Photo',
        description: 'This will not be favorited',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      // User B favorites 2 photos
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photo1Card = page.locator('h3:has-text("Favorited Photo 1")').locator('../..').first();
      await photo1Card.locator('button[aria-label*="Favorite"]').click({ force: true });
      await page.waitForTimeout(1000);

      const photo2Card = page.locator('h3:has-text("Favorited Photo 2")').locator('../..').first();
      await photo2Card.locator('button[aria-label*="Favorite"]').click({ force: true });
      await page.waitForTimeout(1000);

      // WHEN: User B navigates to Favorited Photos page
      await page.goto('/gallery/favorited');
      await page.waitForTimeout(2000);

      // THEN: Should see 2 favorited photos
      await expect(page.locator('h3:has-text("Favorited Photo 1")')).toBeVisible();
      await expect(page.locator('h3:has-text("Favorited Photo 2")')).toBeVisible();

      // Should NOT see the non-favorited photo
      await expect(page.locator('h3:has-text("Not Favorited Photo")')).not.toBeVisible();

      console.log(`✅ E2E-PF-007: View favorited photos page test PASSED`);
    });

    test('E2E-PF-008: unfavorite from favorited photos page', async ({ page }) => {
      // GIVEN: User A uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Unfavorite from Favorited Page',
        description: 'Testing unfavorite from favorited page',
        isPublic: true
      });

      // User A logs out
      await page.click('button:has-text("Logout")');
      await page.waitForTimeout(500);

      // User B logs in and favorites the photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email);

      await viewPublicPhotos(page);
      await page.waitForTimeout(1500);

      const photoCard = page.locator('h3:has-text("Photo to Unfavorite from Favorited Page")').locator('../..').first();
      await photoCard.locator('button[aria-label*="Favorite"]').click({ force: true });
      await page.waitForTimeout(1000);

      console.log(`User B favorited photo`);

      // User B navigates to Favorited Photos page
      await page.goto('/gallery/favorited');
      await page.waitForTimeout(2000);

      // Verify photo is present
      await expect(page.locator('h3:has-text("Photo to Unfavorite from Favorited Page")')).toBeVisible();

      // WHEN: User B unfavorites the photo from favorited page
      const favoritedPageCard = page.locator('h3:has-text("Photo to Unfavorite from Favorited Page")').locator('../..').first();
      const unfavoriteButton = favoritedPageCard.locator('button[aria-label*="Unfavorite"]');
      await unfavoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      // THEN: Photo should disappear from favorited photos page
      await expect(page.locator('h3:has-text("Photo to Unfavorite from Favorited Page")')).not.toBeVisible({ timeout: 5000 });

      console.log(`✅ E2E-PF-008: Unfavorite from favorited photos page test PASSED`);
    });

    test('E2E-PF-009: empty state when no favorited photos', async ({ page }) => {
      // GIVEN: User is logged in with no favorited photos
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email);

      // WHEN: User navigates to Favorited Photos page
      await page.goto('/gallery/favorited');
      await page.waitForTimeout(2000);

      // THEN: Should see empty state message
      const emptyStateMessage = page.locator('text=/no favorited photos|haven\'t favorited/i');
      await expect(emptyStateMessage).toBeVisible({ timeout: 5000 });

      console.log(`✅ E2E-PF-009: Empty state when no favorited photos test PASSED`);
    });

  });

  test.describe('Can Favorite Own Photos', () => {

    test('E2E-PF-010: user can favorite their own photo', async ({ page }) => {
      // GIVEN: User A uploads a photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email);

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'My Own Photo to Favorite',
        description: 'Testing favoriting own photo',
        isPublic: true
      });

      // User A navigates to My Photos
      await viewMyPhotos(page);
      await page.waitForTimeout(1500);

      // WHEN: User A favorites their own photo
      const photoCard = page.locator('h3:has-text("My Own Photo to Favorite")').locator('../..').first();
      const favoriteButton = photoCard.locator('button[aria-label*="Favorite"]');

      // Verify favorite button is visible (unlike likes, favorites allow own photos)
      await expect(favoriteButton).toBeVisible();

      await favoriteButton.click({ force: true });
      await page.waitForTimeout(1000);

      // THEN: Photo should show as favorited
      const unfavoriteButton = photoCard.locator('button[aria-label*="Unfavorite"]');
      await expect(unfavoriteButton).toBeVisible({ timeout: 5000 });

      // AND: Photo should appear in Favorited Photos page
      await page.goto('/gallery/favorited');
      await page.waitForTimeout(2000);

      await expect(page.locator('h3:has-text("My Own Photo to Favorite")')).toBeVisible();

      console.log(`✅ E2E-PF-010: User can favorite their own photo test PASSED`);
    });

  });

});
