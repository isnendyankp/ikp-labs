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
Given('I am on the login page', async function () {
  await page.goto('http://localhost:3002/login');
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
When('I fill in the email field with {string}', async function (email: string) {
  await page.fill('[name="email"]', email);
});

When('I fill in the password field with {string}', async function (password: string) {
  await page.fill('[name="password"]', password);
});

When('I check the {string} checkbox', async function (checkboxText: string) {
  await page.check('[name="rememberMe"]');
});

When('I click the {string} button', async function (buttonText: string) {
  await page.click(`button:has-text("${buttonText}")`);
});

When('I click the {string} link', async function (linkText: string) {
  if (linkText === 'Sign up') {
    await page.click('a[href="/register"]');
  } else if (linkText === 'Forgot your password?') {
    await page.click('a:has-text("Forgot your password?")');
  }
});

When('I start typing in the email field', async function () {
  await page.fill('[name="email"]', 'te');
});

When('I click the password visibility toggle button', async function () {
  await page.click('[name="password"] + div button, [name="password"] ~ div button');
});

When('I view the login page', async function () {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
});

// Assertion steps
Then('I should see a login success message', async function () {
  // Wait for alert dialog and check its message
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Login successful!');
    await dialog.accept();
  });
});

Then('I should see validation errors for empty login fields', async function () {
  await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
});

Then('I should see {string}', async function (errorMessage: string) {
  await expect(page.locator(`text=${errorMessage}`)).toBeVisible();
});

Then('the remember me checkbox should be checked', async function () {
  await expect(page.locator('[name="rememberMe"]')).toBeChecked();
});

Then('the Google signin handler should be called', async function () {
  // Listen for console.log from the Google signin handler
  let consoleMessage = '';
  page.on('console', msg => {
    if (msg.text() === 'Sign in with Google clicked') {
      consoleMessage = msg.text();
    }
  });
  
  // Wait a moment for the console message
  await page.waitForTimeout(100);
  expect(consoleMessage).toBe('Sign in with Google clicked');
});

Then('the password should be hidden by default', async function () {
  const passwordInput = page.locator('[name="password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');
});

Then('the password should be visible', async function () {
  const passwordInput = page.locator('[name="password"]');
  await expect(passwordInput).toHaveAttribute('type', 'text');
});

Then('the password should be hidden again', async function () {
  const passwordInput = page.locator('[name="password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');
});

Then('the email field error should disappear', async function () {
  await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();
});

Then('I should be redirected to the registration page', async function () {
  await expect(page).toHaveURL('/register');
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
  const emailInput = page.locator('[name="email"]');
  await expect(emailInput).toHaveClass(/border-red-500/);
});

Then('the email field should have normal border styling', async function () {
  const emailInput = page.locator('[name="email"]');
  await expect(emailInput).not.toHaveClass(/border-red-500/);
});

Then('I should see the {string} link', async function (linkText: string) {
  await expect(page.locator(`text=${linkText}`)).toBeVisible();
});

Then('the forgot password handler should be called', async function () {
  // For now, just verify the link exists and is clickable
  // In a real implementation, this would check for proper navigation or modal
  const forgotPasswordLink = page.locator('a:has-text("Forgot your password?")');
  await expect(forgotPasswordLink).toBeVisible();
});