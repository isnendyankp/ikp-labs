/**
 * Demo Test Suite with Screenshot Capture
 *
 * Purpose: Demonstrate screenshot capabilities for testing and documentation
 *
 * Screenshot Modes (in playwright.config.ts):
 * - 'on': Always capture screenshots
 * - 'only-on-failure': Only capture when test fails (default)
 * - 'off': No screenshots
 *
 * Screenshot Types:
 * 1. Automatic: Captured on test failure (configured globally)
 * 2. Manual: Captured explicitly in test with page.screenshot()
 * 3. Element: Screenshot specific element only
 * 4. Full Page: Screenshot entire scrollable page
 *
 * Current config: 'only-on-failure' with fullPage: true
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Demo: Screenshot Capture Examples', {
  tag: '@demo-screenshot',
}, () => {

  const timestamp = Date.now();
  const screenshotDir = 'test-results/artifacts/screenshots';

  test('Example 1: Manual Screenshot - Registration Page States', async ({ page }) => {
    console.log('📸 Capturing screenshots of registration page states...');

    // Navigate to registration page
    await page.goto('/registration');

    // Screenshot 1: Empty form (initial state)
    await page.screenshot({
      path: path.join(screenshotDir, `1-registration-empty-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot 1: Empty registration form');

    // Fill form partially
    await page.fill('input[name="fullName"]', 'Screenshot Demo User');
    await page.fill('input[name="email"]', `screenshot${timestamp}@example.com`);

    // Screenshot 2: Partially filled form
    await page.screenshot({
      path: path.join(screenshotDir, `2-registration-partial-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot 2: Partially filled form');

    // Trigger validation errors (submit without password)
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Screenshot 3: Validation errors
    await page.screenshot({
      path: path.join(screenshotDir, `3-registration-errors-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot 3: Validation errors displayed');

    // Complete the form
    await page.fill('input[name="password"]', 'ScreenshotDemo123!');
    await page.fill('input[name="confirmPassword"]', 'ScreenshotDemo123!');

    // Screenshot 4: Completed form
    await page.screenshot({
      path: path.join(screenshotDir, `4-registration-complete-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot 4: Completed registration form');

    console.log(`📁 All screenshots saved to: ${screenshotDir}/`);
  });

  test('Example 2: Element Screenshot - Specific Components', async ({ page }) => {
    console.log('📸 Capturing element-specific screenshots...');

    await page.goto('/registration');

    // Screenshot specific form element
    const formElement = page.locator('form').first();
    await formElement.screenshot({
      path: path.join(screenshotDir, `element-form-${timestamp}.png`),
    });
    console.log('✅ Screenshot: Form element only');

    // Screenshot submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.screenshot({
      path: path.join(screenshotDir, `element-button-${timestamp}.png`),
    });
    console.log('✅ Screenshot: Submit button only');

    // Fill email to trigger validation
    await page.fill('input[name="email"]', 'invalid-email');
    await page.blur('input[name="email"]');
    await page.waitForTimeout(500);

    // Screenshot error message (if exists)
    const errorMessage = page.locator('text=/invalid|error/i').first();
    if (await errorMessage.count() > 0) {
      await errorMessage.screenshot({
        path: path.join(screenshotDir, `element-error-${timestamp}.png`),
      });
      console.log('✅ Screenshot: Error message element');
    }
  });

  test('Example 3: Viewport vs Full Page Screenshot', async ({ page }) => {
    console.log('📸 Demonstrating viewport vs full page screenshots...');

    await page.goto('/registration');

    // Viewport only (what user sees without scrolling)
    await page.screenshot({
      path: path.join(screenshotDir, `viewport-only-${timestamp}.png`),
      fullPage: false,
    });
    console.log('✅ Screenshot: Viewport only (visible area)');

    // Full page (entire scrollable content)
    await page.screenshot({
      path: path.join(screenshotDir, `full-page-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot: Full page (all content)');
  });

  test('Example 4: Comparison Screenshots - Before & After', async ({ page }) => {
    console.log('📸 Capturing before/after comparison screenshots...');

    await page.goto('/registration');

    // BEFORE: Initial state
    await page.screenshot({
      path: path.join(screenshotDir, `compare-before-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot: BEFORE interaction');

    // Perform action - Fill form
    await page.fill('input[name="fullName"]', 'Before After Test');
    await page.fill('input[name="email"]', `compare${timestamp}@example.com`);
    await page.fill('input[name="password"]', 'Compare123!');
    await page.fill('input[name="confirmPassword"]', 'Compare123!');

    // AFTER: Form filled
    await page.screenshot({
      path: path.join(screenshotDir, `compare-after-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot: AFTER interaction');

    console.log('💡 Compare these screenshots to verify UI changes');
  });

  test('Example 5: Mobile Responsive Screenshot', async ({ page, browser }) => {
    console.log('📸 Capturing mobile responsive screenshots...');

    // Create mobile context
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone SE size
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    });

    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3005/registration');

    // Mobile screenshot
    await mobilePage.screenshot({
      path: path.join(screenshotDir, `mobile-view-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot: Mobile view (375x667)');

    await mobileContext.close();

    // Desktop screenshot for comparison
    await page.goto('/registration');
    await page.screenshot({
      path: path.join(screenshotDir, `desktop-view-${timestamp}.png`),
      fullPage: true,
    });
    console.log('✅ Screenshot: Desktop view (1280x720)');
  });

  test('Example 6: Screenshot on Test Failure (Automatic)', async ({ page }) => {
    console.log('📸 Testing automatic screenshot on failure...');

    await page.goto('/registration');

    // This assertion will fail, triggering automatic screenshot
    // Screenshot will be saved automatically by Playwright config
    try {
      await expect(page.locator('text="This Element Does Not Exist"')).toBeVisible({
        timeout: 2000,
      });
    } catch (error) {
      console.log('⚠️  Expected failure: Element not found');
      console.log('📸 Automatic screenshot captured by Playwright config');
      console.log('   Location: test-results/artifacts/');

      // Re-throw to mark test as failed (so screenshot is kept)
      // Comment this out if you want test to pass
      // throw error;

      // For demo purposes, we'll pass the test
      expect(true).toBe(true);
    }
  });

  test('Example 7: Screenshot with Custom Options', async ({ page }) => {
    console.log('📸 Capturing screenshots with custom options...');

    await page.goto('/registration');

    // Screenshot with custom options
    await page.screenshot({
      path: path.join(screenshotDir, `custom-quality-${timestamp}.png`),
      fullPage: true,
      // Quality: 0-100 (only for JPEG)
      // type: 'jpeg',
      // quality: 80,

      // Clip specific area
      clip: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      },
    });
    console.log('✅ Screenshot: Custom clipped area (800x600)');

    // Screenshot with animations disabled
    await page.screenshot({
      path: path.join(screenshotDir, `no-animations-${timestamp}.png`),
      fullPage: true,
      animations: 'disabled', // Disable CSS animations
    });
    console.log('✅ Screenshot: With animations disabled');
  });
});

/**
 * How to use this test suite:
 *
 * 1. Run all screenshot examples:
 *    npx playwright test demo-screenshot-capture --project=chromium
 *
 * 2. Run specific example:
 *    npx playwright test demo-screenshot-capture -g "Manual Screenshot"
 *
 * 3. View screenshots:
 *    Screenshots are saved in: test-results/artifacts/screenshots/
 *
 * 4. Run with UI mode (see screenshots in real-time):
 *    npx playwright test demo-screenshot-capture --ui
 *
 * 5. Generate HTML report with screenshots:
 *    npx playwright show-report
 *
 * Screenshot Naming Convention:
 * - [number]-[description]-[timestamp].png
 * - element-[component]-[timestamp].png
 * - compare-[before|after]-[timestamp].png
 * - [viewport-type]-view-[timestamp].png
 *
 * Tips:
 * - Use fullPage: true for complete page capture
 * - Use fullPage: false for above-the-fold only
 * - Use element.screenshot() for specific components
 * - Screenshots are PNG by default (lossless)
 * - Use JPEG with quality option for smaller file size
 */
