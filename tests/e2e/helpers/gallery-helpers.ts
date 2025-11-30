/**
 * Gallery E2E Test Helpers
 *
 * This file contains reusable helper functions for Gallery E2E tests.
 * Includes authentication, upload, navigation, and cleanup utilities.
 */

import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * Generate unique email for gallery tests
 * Pattern: e2e-gallery-{timestamp}-{random}@test.com
 */
export function generateGalleryTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `e2e-gallery-${timestamp}-${random}@test.com`;
}

/**
 * Create authenticated user and navigate to home page
 * This helper registers a new user and logs them in automatically
 *
 * @param page - Playwright Page object
 * @returns Object with page and user credentials
 */
export async function createAuthenticatedGalleryUser(page: Page) {
  const testUser = {
    fullName: 'Gallery Test User',
    email: generateGalleryTestEmail(),
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  };

  // Navigate to registration page
  await page.goto('/register');

  // Fill registration form
  await page.fill('input[name="name"]', testUser.fullName);
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.fill('input[name="confirmPassword"]', testUser.confirmPassword);

  // Submit registration
  await page.click('button[type="submit"]');

  // Wait for redirect to home page (registration successful)
  await page.waitForURL('/home', { timeout: 5000 });

  console.log(`✅ Created and authenticated user: ${testUser.email}`);

  return { page, user: testUser };
}

/**
 * Upload photo via Gallery upload form
 *
 * @param page - Playwright Page object
 * @param fixtureName - Name of image file in tests/fixtures/images/
 * @param options - Optional metadata (title, description, isPublic)
 */
export async function uploadGalleryPhoto(
  page: Page,
  fixtureName: string,
  options?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }
) {
  const fixturePath = path.join(__dirname, '../../fixtures/images', fixtureName);

  // Navigate to upload page
  await page.goto('/gallery/upload');

  // Upload file via file input
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  // Wait for image preview to appear
  await page.waitForTimeout(500);

  // Fill metadata if provided
  if (options?.title) {
    await page.fill('input[type="text"]', options.title);
  }
  if (options?.description) {
    await page.fill('textarea', options.description);
  }
  if (options?.isPublic) {
    await page.check('input#isPublic');
  }

  // Submit upload
  await page.click('button[type="submit"]:has-text("Upload Photo")');

  // Wait for redirect to gallery page
  await page.waitForURL('/gallery', { timeout: 5000 });
  await page.waitForTimeout(1000); // Wait for photo to appear in grid

  console.log(`✅ Uploaded photo: ${fixtureName}${options?.title ? ` (${options.title})` : ''}`);
}

/**
 * Navigate to My Photos tab in gallery
 */
export async function viewMyPhotos(page: Page) {
  await page.goto('/gallery');
  await page.click('button:has-text("My Photos")');
  await page.waitForTimeout(500);
}

/**
 * Navigate to Public Photos tab in gallery
 */
export async function viewPublicPhotos(page: Page) {
  await page.goto('/gallery');
  await page.click('button:has-text("Public Photos")');
  await page.waitForTimeout(500);
}

/**
 * Verify photo appears in gallery grid
 *
 * @param page - Playwright Page object
 * @param title - Title of photo to verify
 */
export async function verifyPhotoInGrid(page: Page, title: string) {
  const photoCard = page.locator(`h3:has-text("${title}")`).first();
  await expect(photoCard).toBeVisible({ timeout: 5000 });
  console.log(`✅ Photo verified in grid: ${title}`);
}

/**
 * Verify photo privacy badge
 *
 * @param page - Playwright Page object
 * @param title - Title of photo
 * @param isPublic - Expected privacy state (true = Public, false = Private)
 */
export async function verifyPhotoPrivacy(page: Page, title: string, isPublic: boolean) {
  const expectedBadge = isPublic ? 'Public' : 'Private';

  // Find the photo card by title, then check its privacy badge
  const photoCard = page.locator(`h3:has-text("${title}")`).first().locator('..');
  const badge = photoCard.locator(`span:has-text("${expectedBadge}")`);
  await expect(badge).toBeVisible();

  console.log(`✅ Privacy verified: ${title} is ${expectedBadge}`);
}

/**
 * Cleanup test user from database (AUTO DELETE)
 * Uses backend test admin endpoint to delete user and all associated data
 *
 * @param request - Playwright APIRequestContext
 * @param email - Email of user to delete
 */
export async function cleanupTestUser(request: any, email: string) {
  try {
    const response = await request.delete(
      `http://localhost:8081/api/test-admin/users/${email}`
    );

    if (response.ok()) {
      console.log(`🧹 Cleaned up test user: ${email}`);
    } else {
      console.warn(`⚠️  Failed to cleanup user: ${email} (${response.status()})`);
    }
  } catch (error) {
    console.error(`❌ Error cleaning up user ${email}:`, error);
  }
}
