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
    // Tests will be added here
  });
});
