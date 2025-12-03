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
  uploadGalleryPhotoExpectError,
  viewMyPhotos,
  viewPublicPhotos,
  verifyPhotoInGrid,
  verifyPhotoPrivacy,
  openPhotoDetail,
  verifyPhotoDetail,
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

  test.describe('Upload Validation', () => {

    test('E2E-011: should reject file larger than 5MB', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // WHEN: User attempts to upload file > 5MB
      // THEN: Error message is displayed
      await uploadGalleryPhotoExpectError(
        page,
        'large-file.jpg',
        'File size must be less than 5MB'
      );

      console.log('✅ E2E-011: File size validation test PASSED');
    });

  });

  test.describe('View Photos', () => {

    test('E2E-004: should display all owned photos in My Photos tab', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User has uploaded 2 photos (1 private, 1 public)
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'My Private Photo',
        description: 'This is my private photo',
        isPublic: false
      });

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'My Public Photo',
        description: 'This is my public photo',
        isPublic: true
      });

      // WHEN: User navigates to My Photos tab
      await viewMyPhotos(page);

      // THEN: Both photos are visible (regardless of privacy)
      await verifyPhotoInGrid(page, 'My Private Photo');
      await verifyPhotoInGrid(page, 'My Public Photo');

      console.log('✅ E2E-004: View My Photos test PASSED');
    });

    test('E2E-005: should display only public photos in Public Photos tab', async ({ page }) => {
      // GIVEN: User A is registered and logged in
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      // AND: User A has uploaded 1 public photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'User A Public Photo',
        description: 'This is a public photo from User A',
        isPublic: true
      });

      // AND: User A has uploaded 1 private photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'User A Private Photo',
        description: 'This is a private photo from User A',
        isPublic: false
      });

      // AND: User A logs out
      await page.goto('/login');
      await page.evaluate(() => localStorage.clear());

      // AND: User B is registered and logged in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B has uploaded 1 public photo
      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'User B Public Photo',
        description: 'This is a public photo from User B',
        isPublic: true
      });

      // WHEN: User B navigates to Public Photos tab
      await viewPublicPhotos(page);

      // THEN: Both public photos are visible
      await verifyPhotoInGrid(page, 'User A Public Photo');
      await verifyPhotoInGrid(page, 'User B Public Photo');

      // AND: Private photos are NOT visible
      const privatePhotoLocator = page.locator('h3:has-text("User A Private Photo")');
      await expect(privatePhotoLocator).not.toBeVisible();

      console.log('✅ E2E-005: View Public Photos test PASSED');
    });

  });
});
