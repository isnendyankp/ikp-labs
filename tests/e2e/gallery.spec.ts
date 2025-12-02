/**
 * E2E Gallery Tests
 *
 * Tests Gallery photo management features through browser automation.
 * Tests upload, view, edit, delete, pagination, and authorization flows.
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
  verifyPhotoInGrid,
  verifyPhotoPrivacy,
  cleanupTestUser
} from './helpers/gallery-helpers';

test.describe('Gallery Photo Management', () => {
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

  test.describe('Upload Photo', () => {

    test('E2E-001: should upload single photo successfully', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User uploads photo with complete metadata
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Sunset Beach',
        description: 'Beautiful sunset view from the beach',
        isPublic: false // Private photo
      });

      // THEN: Photo appears in My Photos tab
      await viewMyPhotos(page);
      await verifyPhotoInGrid(page, 'Sunset Beach');

      // AND: Photo shows correct privacy badge
      await verifyPhotoPrivacy(page, 'Sunset Beach', false);

      console.log('✅ E2E-001: Upload single photo test PASSED');
    });

    test('E2E-002: should upload photo as public', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User uploads photo marked as public
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Mountain Sunrise',
        description: 'Stunning sunrise over the mountains',
        isPublic: true // Public photo
      });

      // THEN: Photo appears in Public Photos tab
      await viewPublicPhotos(page);
      await verifyPhotoInGrid(page, 'Mountain Sunrise');

      // AND: Photo shows "Public" badge
      await verifyPhotoPrivacy(page, 'Mountain Sunrise', true);

      console.log('✅ E2E-002: Upload photo as public test PASSED');
    });

    test('E2E-003: should upload multiple photos sequentially', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User uploads 3 photos sequentially
      const photos = [
        { title: 'Photo One', description: 'First photo', isPublic: false },
        { title: 'Photo Two', description: 'Second photo', isPublic: true },
        { title: 'Photo Three', description: 'Third photo', isPublic: false }
      ];

      for (const photo of photos) {
        await uploadGalleryPhoto(page, 'test-photo.jpg', photo);
      }

      // THEN: All 3 photos appear in My Photos tab
      await viewMyPhotos(page);
      await verifyPhotoInGrid(page, 'Photo One');
      await verifyPhotoInGrid(page, 'Photo Two');
      await verifyPhotoInGrid(page, 'Photo Three');

      console.log('✅ E2E-003: Upload multiple photos sequentially test PASSED');
    });

  });
});
