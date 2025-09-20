import { test, expect } from '@playwright/test';

test.describe('Login Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render login form correctly', async ({ page }) => {
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="rememberMe"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', '123');
    
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
  });

  test('should submit valid form successfully', async ({ page }) => {
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Listen for the alert dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Login successful!');
      await dialog.accept();
    });
    
    await page.click('button:has-text("Sign In")');
  });

  test('should handle remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[name="rememberMe"]');
    
    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();
    
    // Check the checkbox
    await page.check('input[name="rememberMe"]');
    await expect(rememberMeCheckbox).toBeChecked();
    
    // Uncheck the checkbox
    await page.uncheck('input[name="rememberMe"]');
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('should clear errors when user starts typing', async ({ page }) => {
    // First trigger validation errors
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    
    // Start typing in email field
    await page.fill('input[name="email"]', 'jo');
    
    // Error should disappear
    await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();
  });

  test('should apply error styling to invalid fields', async ({ page }) => {
    await page.click('button:has-text("Sign In")');
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveClass(/border-red-500/);
  });

  test('should handle Google signin button click', async ({ page }) => {
    let consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    await page.click('button:has-text("Sign in with Google")');
    
    // Wait a moment for the console message
    await page.waitForTimeout(100);
    
    expect(consoleMessages).toContain('Sign in with Google clicked');
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    
    // Fill password field
    await page.fill('input[name="password"]', 'mypassword');
    
    // Initially password should be hidden (type="password")
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button to show password
    await page.click('input[name="password"] + div button');
    
    // Password should now be visible (type="text")
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide password
    await page.click('input[name="password"] + div button');
    
    // Password should be hidden again (type="password")
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // Hero section should be hidden on mobile
    const heroSection = page.locator('.lg\\:flex.lg\\:w-1\\/2');
    await expect(heroSection).toHaveClass(/hidden/);
    
    // Form should still be visible
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
  });

  test('should render hero section with login context', async ({ page }) => {
    await expect(page.locator('text=abc.com')).toBeVisible();
    await expect(page.locator('text=Welcome back! Ready to continue your journey')).toBeVisible();
    await expect(page.locator('text=Madhushan sasanka')).toBeVisible();
    await expect(page.locator('text=CEO, abc.com')).toBeVisible();
  });
});