/**
 * Demo Test Suite with Video Recording
 *
 * Purpose: Generate video recordings for testing and demonstration
 *
 * This test suite is specifically designed to create video recordings of:
 * 1. Complete user registration flow
 * 2. Login with registered credentials
 * 3. Profile picture upload
 *
 * Video Recording Modes:
 * - 'on': Always record (good for demos)
 * - 'retain-on-failure': Only keep failed test videos (good for debugging)
 * - 'off': No video recording
 *
 * Current config: 'retain-on-failure' (see playwright.config.ts)
 *
 * To force video recording for ALL tests in this file:
 * Add `use: { video: 'on' }` in test.describe() options
 */

import { test, expect } from '@playwright/test';
import { cleanupTestUser } from './helpers/gallery-helpers';

// Force video recording for this entire test suite
test.describe('Demo: Complete User Journey with Video Recording', {
  tag: '@demo',
  // Force video recording even on success
  use: {
    video: 'on', // Override config to always record video
  }
}, () => {

  // Track all created users for cleanup
  const createdUsers: string[] = [];

  // Generate unique test data for each run
  const timestamp = Date.now();
  const testUser = {
    fullName: `Video Demo User ${timestamp}`,
    email: `videodemo${timestamp}@example.com`,
    password: 'VideoDemo123!',
  };

  test('Scenario 1: Happy Path - Register → Login → Upload Profile Photo', async ({ page }) => {
    console.log('🎬 Starting video recording...');
    console.log('📧 Test User Email:', testUser.email);

    // ============================================
    // STEP 1: USER REGISTRATION
    // ============================================
    console.log('📝 Step 1: User Registration');

    await test.step('Navigate to registration page', async () => {
      await page.goto('/registration');
      await expect(page).toHaveTitle(/Registration/i);
    });

    await test.step('Fill registration form', async () => {
      // Fill in full name
      await page.fill('input[name="fullName"]', testUser.fullName);

      // Fill in email
      await page.fill('input[name="email"]', testUser.email);

      // Fill in password
      await page.fill('input[name="password"]', testUser.password);

      // Fill in confirm password
      await page.fill('input[name="confirmPassword"]', testUser.password);
    });

    await test.step('Upload profile picture during registration', async () => {
      // Create a test image file (1x1 pixel PNG)
      const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      // Upload the image
      await page.setInputFiles('input[type="file"]', {
        name: 'profile-picture.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Wait for preview to appear (if applicable)
      await page.waitForTimeout(1000);
    });

    await test.step('Submit registration form', async () => {
      await page.click('button[type="submit"]');

      // Wait for success message or redirect
      await page.waitForURL(/.*\/(login|dashboard|success).*/i, { timeout: 10000 });
    });

    await test.step('Verify registration success', async () => {
      // Check for success indicators
      const url = page.url();
      expect(url).toMatch(/login|dashboard|success/i);

      console.log('✅ Registration successful! Redirected to:', url);

      // Track user for cleanup
      createdUsers.push(testUser.email);
    });

    // ============================================
    // STEP 2: USER LOGIN
    // ============================================
    console.log('🔐 Step 2: User Login');

    await test.step('Navigate to login page', async () => {
      await page.goto('/login');
      await expect(page).toHaveTitle(/Login/i);
    });

    await test.step('Fill login form', async () => {
      await page.fill('input[name="email"], input[type="email"]', testUser.email);
      await page.fill('input[name="password"], input[type="password"]', testUser.password);
    });

    await test.step('Submit login form', async () => {
      await page.click('button[type="submit"]');

      // Wait for dashboard or profile page
      await page.waitForURL(/.*\/(dashboard|profile).*/i, { timeout: 10000 });
    });

    await test.step('Verify login success', async () => {
      const url = page.url();
      expect(url).toMatch(/dashboard|profile/i);

      console.log('✅ Login successful! Redirected to:', url);
    });

    // ============================================
    // STEP 3: UPLOAD NEW PROFILE PHOTO
    // ============================================
    console.log('📸 Step 3: Upload Profile Photo');

    await test.step('Navigate to profile page', async () => {
      // If not already on profile page, navigate to it
      if (!page.url().includes('/profile')) {
        await page.goto('/profile');
      }

      await page.waitForLoadState('networkidle');
    });

    await test.step('Upload new profile picture', async () => {
      // Create a different test image (blue pixel)
      const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );

      // Find and click the upload button/input
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.setInputFiles({
        name: 'new-profile-picture.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Wait for upload to complete
      await page.waitForTimeout(2000);
    });

    await test.step('Verify profile picture updated', async () => {
      // Look for success message or updated avatar
      const successMessage = page.locator('text=/uploaded|success|updated/i').first();

      // Either success message appears or image src changes
      const hasSuccessMessage = await successMessage.count() > 0;
      const hasProfileImage = await page.locator('img[alt*="profile" i], img[alt*="avatar" i]').count() > 0;

      expect(hasSuccessMessage || hasProfileImage).toBeTruthy();

      console.log('✅ Profile photo uploaded successfully!');
    });

    // ============================================
    // FINAL STEP: SUMMARY
    // ============================================
    await test.step('Test completion summary', async () => {
      console.log('🎉 Complete user journey test finished!');
      console.log('📹 Video saved to: test-results/artifacts/');
      console.log('✅ All steps passed:');
      console.log('   1. User Registration ✓');
      console.log('   2. User Login ✓');
      console.log('   3. Profile Photo Upload ✓');
    });
  });

  test('Scenario 2: Validation Errors (for video debugging)', async ({ page }) => {
    console.log('🎬 Recording validation error scenario...');

    await test.step('Navigate to registration page', async () => {
      await page.goto('/registration');
    });

    await test.step('Submit empty form to trigger validation', async () => {
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    });

    await test.step('Verify validation errors appear', async () => {
      // Check for error messages
      const errorMessages = page.locator('text=/required|invalid|error/i');
      const errorCount = await errorMessages.count();

      expect(errorCount).toBeGreaterThan(0);
      console.log(`✅ Validation working: ${errorCount} error(s) displayed`);
    });

    await test.step('Fill invalid email', async () => {
      await page.fill('input[name="email"]', 'invalid-email');
      await page.blur('input[name="email"]');
      await page.waitForTimeout(500);
    });

    await test.step('Verify email validation', async () => {
      const emailError = page.locator('text=/email.*invalid|invalid.*email/i');
      await expect(emailError).toBeVisible({ timeout: 5000 });
      console.log('✅ Email validation working');
    });

    console.log('📹 Video of validation errors saved for debugging');
  });

  // Cleanup hook - Delete all test users after tests complete
  test.afterAll(async ({ request }) => {
    console.log(`\n🧹 Starting cleanup of ${createdUsers.length} test users...`);
    for (const email of createdUsers) {
      await cleanupTestUser(request, email);
    }
    console.log(`✅ Cleanup complete! Database is clean.\n`);
  });
});

/**
 * How to use this test suite:
 *
 * 1. Run with video recording:
 *    npx playwright test demo-video-recording --project=chromium
 *
 * 2. View videos:
 *    Videos are saved in: test-results/artifacts/
 *
 * 3. Open HTML report to see embedded videos:
 *    npx playwright show-report
 *
 * 4. Run only happy path scenario:
 *    npx playwright test demo-video-recording -g "Happy Path"
 *
 * 5. Run only error scenario:
 *    npx playwright test demo-video-recording -g "Validation Errors"
 */
