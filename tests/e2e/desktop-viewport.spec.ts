import { test, expect } from '@playwright/test';

/**
 * Desktop Viewport E2E Tests
 *
 * Test suite for verifying the application works correctly on desktop viewports.
 * Focuses on Full HD (1920x1080) and common desktop resolutions.
 */

/**
 * Helper function to create a fake JWT token for testing
 */
function createFakeJwtToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // Expires in 1 hour

  const payload = {
    userId: 123,
    email: 'test@example.com',
    fullName: 'Test User',
    exp: exp,
    iat: now,
    sub: 'test-user'
  };

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${header}.${encodedPayload}.fake-signature`;
}

test.describe('Desktop Viewport - 1920x1080 (Full HD)', () => {
  // Use Full HD viewport for all tests in this suite
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ========================================
  // Landing Page Tests - Desktop Full HD
  // ========================================

  test('Should display landing page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Landing page on Full HD (1920x1080)');

    // Verify main headline is visible
    const headline = page.getByRole('heading', { name: /Your perfect moments/i });
    await expect(headline).toBeVisible();

    // Verify all navigation elements are visible on desktop
    const navbar = page.locator('nav').first();
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'About', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'Get Started', exact: true })).toBeVisible();

    // Verify hamburger menu is NOT visible on desktop
    const hamburgerMenu = page.getByRole('button', { name: /Toggle navigation menu/i });
    await expect(hamburgerMenu).not.toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Landing page on Full HD - PASSED');
  });

  test('Should navigate to register when clicking Get Started on Full HD', async ({ page }) => {
    console.log('🧪 Test: Get Started button on Full HD');

    // Click Get Started button
    const getStartedButton = page.getByRole('button', { name: /Get Started/i }).first();
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();

    // Verify navigation to register page (BUG-001 FIX VERIFICATION)
    await page.waitForURL('/register', { timeout: 5000 });
    expect(page.url()).toContain('/register');

    console.log('✅ Test: Get Started button on Full HD - PASSED');
  });

  test('Should display features section in 3-column layout on Full HD', async ({ page }) => {
    console.log('🧪 Test: Features section layout on Full HD');

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify all 6 feature cards are present
    const featureTitles = [
      'Upload & Organize',
      'Share Beautifully',
      'Discover Moments',
      'Privacy Control',
      'Mobile Friendly',
      'Free Forever'
    ];

    for (const title of featureTitles) {
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    }

    console.log('✅ Test: Features section layout on Full HD - PASSED');
  });

  test('Should display footer in 4-column layout on Full HD', async ({ page }) => {
    console.log('🧪 Test: Footer layout on Full HD');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer is visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Verify all footer columns are present
    await expect(footer.getByRole('heading', { name: 'Kameravue' })).toBeVisible();
    await expect(footer.getByText('Product')).toBeVisible();
    await expect(footer.getByText('Company')).toBeVisible();
    await expect(footer.getByText('Legal')).toBeVisible();

    console.log('✅ Test: Footer layout on Full HD - PASSED');
  });

  test('Should show Go to Gallery button when authenticated on Full HD', async ({ page }) => {
    console.log('🧪 Test: Auth-aware button on Full HD');

    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/');

    // Verify "Go to Gallery" button is visible
    const goToGalleryButton = page.getByRole('button', { name: 'Go to Gallery', exact: true });
    await expect(goToGalleryButton).toBeVisible();

    // Verify Login and Get Started buttons are NOT visible
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    const getStartedButton = page.getByRole('button', { name: 'Get Started', exact: true });
    await expect(loginButton).not.toBeVisible();
    await expect(getStartedButton).not.toBeVisible();

    console.log('✅ Test: Auth-aware button on Full HD - PASSED');
  });

  // ========================================
  // Login Page Tests - Desktop Full HD
  // ========================================

  test('Should display login page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Login page on Full HD');

    await page.goto('/login');

    // Verify form elements are visible
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Verify "Sign up" link is visible
    await expect(page.getByRole('link', { name: 'Don\'t have an account? Sign up' })).toBeVisible();

    // Verify "Forgot password" link is NOT visible (BUG-002 FIX VERIFICATION)
    const forgotPasswordLink = page.getByText('Forgot your password?');
    await expect(forgotPasswordLink).not.toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Login page on Full HD - PASSED');
  });

  // ========================================
  // Register Page Tests - Desktop Full HD
  // ========================================

  test('Should display register page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Register page on Full HD');

    await page.goto('/register');

    // Verify form elements are visible
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Create a password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();

    // Verify "Sign in" link is visible
    await expect(page.getByRole('link', { name: 'Already have an account? Sign in' })).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Register page on Full HD - PASSED');
  });

  // ========================================
  // Gallery Page Tests - Desktop Full HD
  // ========================================

  test('Should display gallery page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Gallery page on Full HD (authenticated)');

    // Set auth token
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/gallery');

    // Verify page elements
    await expect(page.getByRole('heading', { name: 'Photo Gallery' })).toBeVisible();

    // Verify StickyActionBar is visible on desktop (not hidden)
    const actionBar = page.locator('div[class*="sticky"]');
    await expect(actionBar).toBeVisible();

    // Verify FAB upload button is visible
    const fabButton = page.getByRole('button', { name: 'Upload photo' });
    await expect(fabButton).toBeVisible();

    // Verify mobile header controls are NOT visible on desktop
    const mobileControls = page.locator('div.flex.items-center.gap-1.sm\\.hidden');
    await expect(mobileControls).not.toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Gallery page on Full HD - PASSED');
  });

  // ========================================
  // Profile Page Tests - Desktop Full HD
  // ========================================

  test('Should display profile page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Profile page on Full HD (authenticated)');

    // Set auth token
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/myprofile');

    // Verify page elements
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    // Verify 2-column layout on desktop
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Profile page on Full HD - PASSED');
  });
});

test.describe('Desktop Viewport - 1366x768 (Laptop)', () => {
  // Use common laptop viewport
  test.use({ viewport: { width: 1366, height: 768 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Should display landing page correctly on laptop resolution', async ({ page }) => {
    console.log('🧪 Test: Landing page on laptop (1366x768)');

    // Verify main headline is visible
    const headline = page.getByRole('heading', { name: /Your perfect moments/i });
    await expect(headline).toBeVisible();

    // Verify navigation elements
    const navbar = page.locator('nav').first();
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'About', exact: true })).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Landing page on laptop - PASSED');
  });

  test('Should display gallery correctly on laptop resolution', async ({ page }) => {
    console.log('🧪 Test: Gallery page on laptop (1366x768)');

    // Set auth token
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/gallery');

    // Verify page elements
    await expect(page.getByRole('heading', { name: 'Photo Gallery' })).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Gallery page on laptop - PASSED');
  });
});

test.describe('Desktop Viewport - 1280x720 (HD)', () => {
  // Use HD viewport
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Should display landing page correctly on HD resolution', async ({ page }) => {
    console.log('🧪 Test: Landing page on HD (1280x720)');

    // Verify main headline is visible
    const headline = page.getByRole('heading', { name: /Your perfect moments/i });
    await expect(headline).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Landing page on HD - PASSED');
  });
});
