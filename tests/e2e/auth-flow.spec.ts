import { test, expect } from '@playwright/test';

/**
 * Authentication Flow E2E Tests
 *
 * Tests complete user journey through the authentication system:
 * - Register → Home
 * - Login → Home
 * - Home page display
 * - Logout → Login
 * - Route protection
 * - Token persistence
 */

test.describe('Authentication Flow - Complete User Journey', () => {

  // Helper function to generate unique email
  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `auth.flow.${timestamp}.${random}@example.com`;
  };

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * Test 1: Registration → Auto Redirect to Home
   */
  test('Should register and redirect to home page', async ({ page }) => {
    const testData = {
      fullName: 'Auth Flow Test User',
      email: generateUniqueEmail(),
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!'
    };

    // Go to registration page
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="name"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to /home
    await page.waitForURL('/home', { timeout: 5000 });

    // Verify on home page
    expect(page.url()).toContain('/home');

    // Verify welcome message
    await expect(page.locator('h2')).toContainText(`Welcome, ${testData.fullName}!`);

    // Verify user email displayed
    await expect(page.locator('text=' + testData.email)).toBeVisible();

    // Verify logout button exists
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Verify token saved in localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();

    console.log('✅ Test 1: Registration → Home redirect successful');
  });

  /**
   * Test 2: Login → Redirect to Home
   */
  test('Should login and redirect to home page', async ({ page }) => {
    // Use existing test user (created in registration tests)
    const credentials = {
      email: 'testuser123@example.com',
      password: 'SecurePass123!'
    };

    // Go to login page
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to /home
    await page.waitForURL('/home', { timeout: 5000 });

    // Verify on home page
    expect(page.url()).toContain('/home');

    // Verify welcome message appears
    await expect(page.locator('h2')).toContainText('Welcome');

    // Verify token saved
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();

    console.log('✅ Test 2: Login → Home redirect successful');
  });

  /**
   * Test 3: Home Page Displays User Info Correctly
   */
  test('Should display user information from JWT token', async ({ page }) => {
    // First, login to get token
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser123@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');

    // Verify user information displayed
    await expect(page.locator('text=Full Name')).toBeVisible();
    await expect(page.locator('text=Email Address')).toBeVisible();
    await expect(page.locator('text=testuser123@example.com')).toBeVisible();

    // Verify JWT authentication info message
    await expect(page.locator('text=JWT authentication')).toBeVisible();

    console.log('✅ Test 3: User info displayed correctly');
  });

  /**
   * Test 4: Logout Clears Token and Redirects
   */
  test('Should logout, clear token, and redirect to login', async ({ page }) => {
    // First, login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser123@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');

    // Verify token exists
    let token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();

    // Click logout button
    await page.click('button:has-text("Logout")');

    // Wait for redirect to /login
    await page.waitForURL('/login', { timeout: 5000 });

    // Verify redirected to login
    expect(page.url()).toContain('/login');

    // Verify token cleared
    token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeNull();

    console.log('✅ Test 4: Logout successful');
  });

  /**
   * Test 5: Unauthenticated Access to Home → Redirect to Login
   */
  test('Should redirect unauthenticated user to login', async ({ page }) => {
    // Ensure no token in localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Try to access /home directly
    await page.goto('/home');

    // Should be redirected to /login
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    // Verify login page is shown
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();

    console.log('✅ Test 5: Unauthenticated redirect working');
  });

  /**
   * Test 6: Authenticated User Accessing Login → Redirect to Home
   */
  test('Should redirect authenticated user from login to home', async ({ page }) => {
    // First, login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser123@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');

    // Try to access /login again
    await page.goto('/login');

    // Should be redirected to /home
    await page.waitForURL('/home', { timeout: 5000 });
    expect(page.url()).toContain('/home');

    // Verify on home page (not login)
    await expect(page.locator('h2')).toContainText('Welcome');

    console.log('✅ Test 6: Authenticated redirect from login working');
  });

  /**
   * Test 7: Authenticated User Accessing Register → Redirect to Home
   */
  test('Should redirect authenticated user from register to home', async ({ page }) => {
    // First, login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser123@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');

    // Try to access /register
    await page.goto('/register');

    // Should be redirected to /home
    await page.waitForURL('/home', { timeout: 5000 });
    expect(page.url()).toContain('/home');

    // Verify on home page (not register)
    await expect(page.locator('h2')).toContainText('Welcome');

    console.log('✅ Test 7: Authenticated redirect from register working');
  });

  /**
   * Test 8: Token Persists Across Page Refresh
   */
  test('Should maintain authentication after page refresh', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser123@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');

    // Refresh page
    await page.reload();

    // Should still be on /home
    expect(page.url()).toContain('/home');

    // Should still see user info
    await expect(page.locator('h2')).toContainText('Welcome');

    // Token should still exist
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();

    console.log('✅ Test 8: Token persists after refresh');
  });

});
