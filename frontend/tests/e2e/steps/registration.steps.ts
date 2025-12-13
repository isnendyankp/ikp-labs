import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await page.close();
  await context.close();
  await browser.close();
});

// Background steps
Given('I am on the registration page', async function () {
  await page.goto('http://localhost:3002/register');
  await page.waitForLoadState('networkidle');
});

Given('I am using a mobile device', async function () {
  await context.close();
  context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
  });
  page = await context.newPage();
});

// Form interaction steps
When('I fill in the name field with {string}', async function (name: string) {
  await page.fill('[name="name"]', name);
});

When('I fill in the email field with {string}', async function (email: string) {
  await page.fill('[name="email"]', email);
});

When('I fill in the password field with {string}', async function (password: string) {
  await page.fill('[name="password"]', password);
});

When('I fill in the confirm password field with {string}', async function (confirmPassword: string) {
  await page.fill('[name="confirmPassword"]', confirmPassword);
});

When('I click the {string} button', async function (buttonText: string) {
  await page.click(`button:has-text("${buttonText}")`);
});

When('I start typing in the name field', async function () {
  await page.fill('[name="name"]', 'Jo');
});

// Assertion steps
Then('I should see a success message', async function () {
  // Wait for alert dialog and check its message
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Registration successful!');
    await dialog.accept();
  });
});

Then('I should see validation errors for empty fields', async function () {
  await expect(page.locator('text=Name must be at least 2 characters long')).toBeVisible();
  await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
});

Then('I should see {string}', async function (errorMessage: string) {
  await expect(page.locator(`text=${errorMessage}`)).toBeVisible();
});

Then('the Google signup handler should be called', async function () {
  // Listen for console.log from the Google signup handler
  let consoleMessage = '';
  page.on('console', msg => {
    if (msg.text() === 'Sign up with Google clicked') {
      consoleMessage = msg.text();
    }
  });
  
  // Wait a moment for the console message
  await page.waitForTimeout(100);
  expect(consoleMessage).toBe('Sign up with Google clicked');
});

Then('the name field error should disappear', async function () {
  await expect(page.locator('text=Name must be at least 2 characters long')).not.toBeVisible();
});

Then('the hero section should be hidden', async function () {
  const heroSection = page.locator('.lg\\:flex.lg\\:w-1\\/2');
  await expect(heroSection).toHaveClass(/hidden/);
});

Then('the form should take full width', async function () {
  const formSection = page.locator('.w-full.lg\\:w-1\\/2');
  await expect(formSection).toBeVisible();
});

Then('form fields with errors should have red borders', async function () {
  const nameInput = page.locator('[name="name"]');
  await expect(nameInput).toHaveClass(/border-red-500/);
});

Then('the name field should have normal border styling', async function () {
  const nameInput = page.locator('[name="name"]');
  await expect(nameInput).not.toHaveClass(/border-red-500/);
});

When('I view the registration page', async function () {
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');
});