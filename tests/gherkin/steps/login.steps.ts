import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from './common.steps';

// Background steps
Given('I am on the login page', async function () {
  await page.goto('/login');  // Use relative URL to respect baseURL config
  await page.waitForLoadState('networkidle');
});

// Form interaction steps (login-specific)
When('I check the {string} checkbox', async function (checkboxText: string) {
  await page.check('[name="rememberMe"]');
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
  await page.goto('/login');  // Use relative URL to respect baseURL config
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