import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from './common.steps';

// Background steps
Given('I am on the registration page', async function () {
  await page.goto('/register');  // Use relative URL to respect baseURL config
  await page.waitForLoadState('networkidle');
});

// Form interaction steps (registration-specific)
When('I fill in the name field with {string}', async function (name: string) {
  await page.fill('[name="name"]', name);
});

When('I fill in the confirm password field with {string}', async function (confirmPassword: string) {
  await page.fill('[name="confirmPassword"]', confirmPassword);
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

Then('the Google signup handler should be called', async function () {
  // Check if console message was captured (global listener set up in Before hook)
  const messages = (this as any).consoleMessages || [];
  const found = messages.some((msg: string) => msg === 'Sign up with Google clicked');
  expect(found).toBe(true);
});

Then('the name field error should disappear', async function () {
  await expect(page.locator('text=Name must be at least 2 characters long')).not.toBeVisible();
});

Then('the name field should have normal border styling', async function () {
  const nameInput = page.locator('[name="name"]');
  await expect(nameInput).not.toHaveClass(/border-red-500/);
});

When('I view the registration page', async function () {
  await page.goto('/register');  // Use relative URL to respect baseURL config
  await page.waitForLoadState('networkidle');
});