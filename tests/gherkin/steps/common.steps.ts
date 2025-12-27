import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({
    baseURL: 'http://localhost:3002',  // Set baseURL for relative URL navigation
  });
  page = await context.newPage();
});

After(async function () {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});

// Common Steps - Shared between Login and Registration

Given('I am using a mobile device', async function () {
  await context.close();
  context = await browser.newContext({
    baseURL: 'http://localhost:3002',  // Set baseURL for mobile context too
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  page = await context.newPage();
});

When('I fill in the email field with {string}', async function (email: string) {
  await page.fill('[name="email"]', email);
});

When('I fill in the password field with {string}', async function (password: string) {
  await page.fill('[name="password"]', password);
});

When('I click the {string} button', async function (buttonText: string) {
  const button = page.locator(`button:has-text("${buttonText}")`).first();
  await button.click();
});

Then('I should see {string}', async function (message: string) {
  const text = page.locator(`text=${message}`).first();
  await expect(text).toBeVisible({ timeout: 10000 });
});

Then('the hero section should be hidden', async function () {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    // On mobile, hero section should not be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    const isVisible = await heroSection.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  }
});

Then('the form should take full width', async function () {
  const form = page.locator('form').first();
  const boundingBox = await form.boundingBox();
  const viewport = page.viewportSize();

  if (boundingBox && viewport) {
    // Form should take most of the viewport width on mobile
    expect(boundingBox.width).toBeGreaterThan(viewport.width * 0.8);
  }
});

Then('form fields with errors should have red borders', async function () {
  // Wait for validation to occur
  await page.waitForTimeout(500);

  const emailInput = page.locator('[name="email"]');
  const passwordInput = page.locator('[name="password"]');

  // Check if inputs have error styling (red border)
  const emailClass = await emailInput.getAttribute('class');
  const passwordClass = await passwordInput.getAttribute('class');

  expect(emailClass).toContain('border-red');
  expect(passwordClass).toContain('border-red');
});

// Export page for use in feature-specific steps
export { page };
