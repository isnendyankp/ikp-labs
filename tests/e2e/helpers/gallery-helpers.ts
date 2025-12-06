/**
 * Gallery E2E Test Helpers
 *
 * This file contains reusable helper functions for Gallery E2E tests.
 * Includes authentication, upload, navigation, and cleanup utilities.
 */

import { Page, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

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

  // Find privacy badge anywhere on the page that matches the expected text
  // The badge should be visible on the photo card
  const badge = page.getByText(expectedBadge, { exact: true }).first();
  await expect(badge).toBeVisible();

  console.log(`✅ Privacy verified: ${title} is ${expectedBadge}`);
}

/**
 * Attempt to upload photo and expect validation error
 * Used for testing file size validation, file type validation, etc.
 *
 * @param page - Playwright Page object
 * @param fixtureName - Name of image file in tests/fixtures/images/
 * @param expectedError - Expected error message text
 */
export async function uploadGalleryPhotoExpectError(
  page: Page,
  fixtureName: string,
  expectedError: string
) {
  const fixturePath = path.join(__dirname, '../../fixtures/images', fixtureName);

  // Navigate to upload page
  await page.goto('/gallery/upload');

  // Upload file via file input
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  // Wait for error message to appear
  await page.waitForTimeout(1000);

  // Verify error message is displayed
  const errorMessage = page.getByText(expectedError, { exact: false });
  await expect(errorMessage).toBeVisible({ timeout: 5000 });

  console.log(`✅ Error message verified: "${expectedError}"`);
}

/**
 * Open photo detail page by clicking on photo title
 *
 * @param page - Playwright Page object
 * @param title - Title of photo to open
 */
export async function openPhotoDetail(page: Page, title: string) {
  // Click on photo title to open detail page
  const photoTitle = page.locator(`h3:has-text("${title}")`).first();
  await photoTitle.click();

  // Wait for detail page to load
  await page.waitForURL(/\/gallery\/\d+/, { timeout: 5000 });
  await page.waitForTimeout(500);

  console.log(`✅ Opened photo detail: ${title}`);
}

/**
 * Verify photo detail page shows complete information
 *
 * @param page - Playwright Page object
 * @param expectedData - Expected photo data (title, description, privacy)
 */
export async function verifyPhotoDetail(
  page: Page,
  expectedData: {
    title: string;
    description?: string;
    isPublic: boolean;
  }
) {
  // Verify title
  const titleElement = page.locator('h1, h2').filter({ hasText: expectedData.title });
  await expect(titleElement).toBeVisible();

  // Verify description if provided
  if (expectedData.description) {
    const descElement = page.getByText(expectedData.description);
    await expect(descElement).toBeVisible();
  }

  // Verify privacy badge
  const expectedBadge = expectedData.isPublic ? 'Public' : 'Private';
  const badge = page.getByText(expectedBadge, { exact: true });
  await expect(badge).toBeVisible();

  console.log(`✅ Photo detail verified: ${expectedData.title} (${expectedBadge})`);
}

/**
 * Edit photo metadata (title, description, privacy)
 * Clicks Edit button, modifies fields, and saves changes
 *
 * @param page - Playwright Page object
 * @param newData - New photo data to update
 */
export async function editPhotoMetadata(
  page: Page,
  newData: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }
) {
  // Click Edit button to enter edit mode
  await page.click('button:has-text("Edit")');
  await page.waitForTimeout(500);

  // Update title if provided
  if (newData.title !== undefined) {
    await page.fill('input[type="text"]', newData.title);
  }

  // Update description if provided
  if (newData.description !== undefined) {
    await page.fill('textarea', newData.description);
  }

  // Update privacy if provided
  if (newData.isPublic !== undefined) {
    const checkbox = page.locator('input#editIsPublic');
    const isChecked = await checkbox.isChecked();

    // Toggle checkbox if current state doesn't match desired state
    if (isChecked !== newData.isPublic) {
      await checkbox.click(); // Click to toggle (not check())
    }
  }

  // Setup dialog handler for success alert BEFORE clicking Save
  page.once('dialog', async dialog => {
    console.log(`📢 Alert message: "${dialog.message()}"`);
    await dialog.accept();
  });

  // Click Save Changes button
  await page.click('button:has-text("Save Changes")');

  // Wait for UI to exit edit mode (Edit button appears again = view mode)
  await page.waitForSelector('button:has-text("Edit")', { timeout: 5000 });
  await page.waitForTimeout(500); // Extra buffer for UI to fully render

  console.log(`✅ Photo metadata updated`);
}

/**
 * Delete photo with confirmation
 * Clicks Delete button and accepts confirmation dialog
 *
 * @param page - Playwright Page object
 */
export async function deleteGalleryPhoto(page: Page) {
  // Setup dialog handler BEFORE clicking delete
  page.once('dialog', async dialog => {
    console.log(`📢 Dialog message: "${dialog.message()}"`);
    await dialog.accept();
  });

  // Click Delete button
  await page.click('button:has-text("Delete")');

  // Wait for redirect to gallery page
  await page.waitForURL('/gallery', { timeout: 5000 });
  await page.waitForTimeout(1000);

  console.log(`✅ Photo deleted successfully`);
}

/**
 * Cancel delete operation
 * Clicks Delete button and dismisses confirmation dialog
 *
 * @param page - Playwright Page object
 */
export async function cancelDelete(page: Page) {
  // Setup dialog handler to DISMISS (cancel)
  page.once('dialog', async dialog => {
    console.log(`📢 Dialog message: "${dialog.message()}"`);
    await dialog.dismiss();
  });

  // Click Delete button
  await page.click('button:has-text("Delete")');
  await page.waitForTimeout(1000);

  console.log(`✅ Delete cancelled`);
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

/**
 * Bulk upload photos via API (faster than UI for pagination testing)
 * Uses backend API directly to create multiple photos quickly
 *
 * @param page - Playwright Page object (for auth token)
 * @param count - Number of photos to upload
 * @param isPublic - Privacy setting for photos (default: false)
 */
export async function bulkUploadPhotosViaAPI(
  page: Page,
  count: number,
  isPublic: boolean = false
): Promise<void> {
  // Get auth token from localStorage
  const token = await page.evaluate(() => localStorage.getItem('authToken'));

  if (!token) {
    throw new Error('No auth token found - user must be logged in');
  }

  const fixturePath = path.join(__dirname, '../../fixtures/images/test-photo.jpg');
  const fileBuffer = await fs.promises.readFile(fixturePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });

  console.log(`📤 Bulk uploading ${count} photos via API...`);

  for (let i = 1; i <= count; i++) {
    const formData = new FormData();
    formData.append('file', blob, 'test-photo.jpg');
    formData.append('title', `Bulk Photo ${i}`);
    formData.append('description', `Auto-generated photo ${i} for pagination testing`);
    formData.append('isPublic', String(isPublic));

    const response = await fetch('http://localhost:8081/api/gallery/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error(`❌ Failed to upload photo ${i}: ${response.status}`);
    }
  }

  console.log(`✅ Bulk uploaded ${count} photos`);
  await page.waitForTimeout(500); // Brief pause to ensure backend processed all uploads
}
