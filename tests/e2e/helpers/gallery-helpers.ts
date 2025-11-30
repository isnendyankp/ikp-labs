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
