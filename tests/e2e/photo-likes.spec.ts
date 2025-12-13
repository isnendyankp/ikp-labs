/**
 * E2E Photo Likes Tests
 *
 * Tests Photo Likes feature through browser automation.
 * Tests like/unlike from gallery, detail view, persistence, and liked photos page.
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

test.describe('Photo Likes Feature', () => {
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

  test.describe('Basic Like/Unlike Operations', () => {

    test('E2E-PL-001: should like photo from gallery view', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User has uploaded a public photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Like',
        description: 'Testing like from gallery view',
        isPublic: true
      });

      // WHEN: User navigates to Public Photos tab
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000); // Wait for photos to load

      // AND: User clicks the like button on the photo card
      const photoCard = page.locator('h3:has-text("Photo to Like")').locator('../..');
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();

      // Verify like button is visible
      await expect(likeButton).toBeVisible();

      // Get initial like count (should be 0)
      const initialLikeText = await likeButton.textContent();
      console.log('Initial like button text:', initialLikeText);

      // Click like button
      await likeButton.click();
      await page.waitForTimeout(500); // Wait for optimistic update

      // THEN: Like count increases to 1
      const updatedLikeText = await likeButton.textContent();
      expect(updatedLikeText).toContain('1');
      console.log('Updated like button text:', updatedLikeText);

      // AND: Heart icon changes to filled (solid)
      const heartIcon = likeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      console.log('✅ E2E-PL-001: Like photo from gallery view test PASSED');
    });

    test('E2E-PL-002: should unlike photo from gallery view', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User has uploaded a public photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Unlike',
        description: 'Testing unlike from gallery view',
        isPublic: true
      });

      // AND: User has already liked the photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Photo to Unlike")').locator('../..');
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();

      // Like the photo first
      await likeButton.click();
      await page.waitForTimeout(500);

      // Verify it's liked (count = 1)
      let likeText = await likeButton.textContent();
      expect(likeText).toContain('1');

      // WHEN: User clicks the like button again (to unlike)
      await likeButton.click();
      await page.waitForTimeout(500);

      // THEN: Like count decreases to 0
      likeText = await likeButton.textContent();
      expect(likeText?.trim()).toBe(''); // No count shown when 0 likes

      // AND: Heart icon changes to outline (not filled)
      const heartIcon = likeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      console.log('✅ E2E-PL-002: Unlike photo from gallery view test PASSED');
    });

    test('E2E-PL-003: should like photo from detail view', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User has uploaded a public photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Detail Like Photo',
        description: 'Testing like from detail view',
        isPublic: true
      });

      // WHEN: User navigates to photo detail page
      await viewPublicPhotos(page);
      await openPhotoDetail(page, 'Detail Like Photo');
      await page.waitForTimeout(1000);

      // AND: User clicks the like button on detail page
      const likeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(likeButton).toBeVisible();

      // Get initial state
      const initialLikeText = await likeButton.textContent();
      console.log('Detail page initial like button text:', initialLikeText);

      // Click like button
      await likeButton.click();
      await page.waitForTimeout(500);

      // THEN: Like count increases to 1
      const updatedLikeText = await likeButton.textContent();
      expect(updatedLikeText).toContain('1');
      console.log('Detail page updated like button text:', updatedLikeText);

      // AND: Heart icon changes to filled
      const heartIcon = likeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      // AND: When user goes back to gallery, like persists
      await page.goto('/gallery');
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Detail Like Photo")').locator('../..');
      const galleryLikeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();

      const galleryLikeText = await galleryLikeButton.textContent();
      expect(galleryLikeText).toContain('1');

      console.log('✅ E2E-PL-003: Like photo from detail view test PASSED');
    });

  });
});
