import { test, expect } from '@playwright/test';

test.describe('Registration Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should render registration form correctly', async ({ page }) => {
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign up with Google")')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.click('button:has-text("Create Account")');
    
    await expect(page.locator('text=Name must be at least 2 characters long')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button:has-text("Create Account")');
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    
    await page.click('button:has-text("Create Account")');
    
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    
    await page.click('button:has-text("Create Account")');
    
    await expect(page.locator('text=Passwords don\'t match')).toBeVisible();
  });

  test('should submit valid form successfully', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // Listen for the alert dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Registration successful!');
      await dialog.accept();
    });
    
    await page.click('button:has-text("Create Account")');
  });

  test('should clear errors when user starts typing', async ({ page }) => {
    // First trigger validation errors
    await page.click('button:has-text("Create Account")');
    await expect(page.locator('text=Name must be at least 2 characters long')).toBeVisible();
    
    // Start typing in name field
    await page.fill('input[name="name"]', 'Jo');
    
    // Error should disappear
    await expect(page.locator('text=Name must be at least 2 characters long')).not.toBeVisible();
  });

  test('should apply error styling to invalid fields', async ({ page }) => {
    await page.click('button:has-text("Create Account")');
    
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveClass(/border-red-500/);
  });

  test('should handle Google signup button click', async ({ page }) => {
    let consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    await page.click('button:has-text("Sign up with Google")');
    
    // Wait a moment for the console message
    await page.waitForTimeout(100);
    
    expect(consoleMessages).toContain('Sign up with Google clicked');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/register');
    
    // Hero section should be hidden on mobile
    const heroSection = page.locator('.lg\\:flex.lg\\:w-1\\/2');
    await expect(heroSection).toHaveClass(/hidden/);
    
    // Form should still be visible
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();
  });
});