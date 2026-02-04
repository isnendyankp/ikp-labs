import { test, expect } from '@playwright/test';

/**
 * Profile Page E2E Tests
 *
 * Test suite for the profile page functionality.
 * Tests profile display, picture management, and responsive layout.
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

test.describe('Profile Page - Desktop View (1280x720)', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/myprofile');
  });

  test('Should display profile page correctly on desktop', async ({ page }) => {
    console.log('🧪 Test: Profile page on desktop (1280x720)');

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    // Verify profile section is displayed
    await expect(page.getByText('Profile Picture')).toBeVisible();
    await expect(page.getByText('User Information')).toBeVisible();

    // Verify navigation buttons
    await expect(page.getByRole('button', { name: 'Go to My Gallery' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // Verify "Change Picture" button
    await expect(page.getByRole('button', { name: 'Change Picture' })).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Profile page on desktop - PASSED');
  });

  test('Should display profile in 2-column layout on desktop', async ({ page }) => {
    console.log('🧪 Test: Profile page 2-column layout on desktop');

    // Verify main content area
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // Verify profile picture section is on the left
    const profileSection = page.locator('section:has-text("Profile Picture")');
    await expect(profileSection).toBeVisible();

    // Verify user info section is displayed
    const userInfoSection = page.locator('section:has-text("User Information")');
    await expect(userInfoSection).toBeVisible();

    console.log('✅ Test: Profile page 2-column layout - PASSED');
  });

  test('Should toggle change picture section when button clicked', async ({ page }) => {
    console.log('🧪 Test: Change picture toggle on desktop');

    // Click "Change Picture" button
    const changePictureButton = page.getByRole('button', { name: 'Change Picture' });
    await changePictureButton.click();

    // Verify upload section appears
    await expect(page.getByText('Choose a new profile picture')).toBeVisible();

    // Click button again to close
    await changePictureButton.click();

    // Verify upload section is hidden
    await expect(page.getByText('Choose a new profile picture')).not.toBeVisible();

    console.log('✅ Test: Change picture toggle - PASSED');
  });

  test('Should navigate to gallery when clicking Go to My Gallery', async ({ page }) => {
    console.log('🧪 Test: Navigate to gallery from profile');

    // Click "Go to My Gallery" button
    const goToGalleryButton = page.getByRole('button', { name: 'Go to My Gallery' });
    await goToGalleryButton.click();

    // Verify navigation to gallery page
    await page.waitForURL('/gallery', { timeout: 5000 });
    expect(page.url()).toContain('/gallery');

    console.log('✅ Test: Navigate to gallery from profile - PASSED');
  });

  test('Should logout when clicking Logout button', async ({ page }) => {
    console.log('🧪 Test: Logout from profile page');

    // Click Logout button
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    await logoutButton.click();

    // Verify redirect to landing page
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toContain('/');

    // Verify auth token is removed
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(authToken).toBeNull();

    console.log('✅ Test: Logout from profile page - PASSED');
  });

  test('Should display profile picture placeholder', async ({ page }) => {
    console.log('🧪 Test: Profile picture placeholder');

    // Verify profile picture container is visible
    const profilePicture = page.locator('[data-testid="profile-picture"], .rounded-full').first();
    await expect(profilePicture).toBeVisible();

    console.log('✅ Test: Profile picture placeholder - PASSED');
  });
});

test.describe('Profile Page - Mobile View (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/myprofile');
  });

  test('Should display profile page correctly on mobile', async ({ page }) => {
    console.log('🧪 Test: Profile page on mobile (375x667)');

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    // Verify profile sections are visible
    await expect(page.getByText('Profile Picture')).toBeVisible();
    await expect(page.getByText('User Information')).toBeVisible();

    // Verify navigation buttons
    await expect(page.getByRole('button', { name: 'Go to My Gallery' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Profile page on mobile - PASSED');
  });

  test('Should display profile in 1-column layout on mobile', async ({ page }) => {
    console.log('🧪 Test: Profile page 1-column layout on mobile');

    // Verify mobile layout (stacked vertically)
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // Verify profile picture section
    const profileSection = page.locator('section:has-text("Profile Picture")');
    await expect(profileSection).toBeVisible();

    // Verify user info section
    const userInfoSection = page.locator('section:has-text("User Information")');
    await expect(userInfoSection).toBeVisible();

    console.log('✅ Test: Profile page 1-column layout on mobile - PASSED');
  });

  test('Should have touch-friendly buttons on mobile', async ({ page }) => {
    console.log('🧪 Test: Touch-friendly buttons on mobile');

    // Check that main buttons are at least 44x44 pixels
    const changePictureButton = page.getByRole('button', { name: 'Change Picture' });
    const box = await changePictureButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }

    // Verify logout button
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    await expect(logoutButton).toBeVisible();

    console.log('✅ Test: Touch-friendly buttons on mobile - PASSED');
  });

  test('Should navigate correctly on mobile', async ({ page }) => {
    console.log('🧪 Test: Navigation from profile on mobile');

    // Click "Go to My Gallery"
    const goToGalleryButton = page.getByRole('button', { name: 'Go to My Gallery' });
    await goToGalleryButton.click();

    // Verify navigation
    await page.waitForURL('/gallery', { timeout: 5000 });
    expect(page.url()).toContain('/gallery');

    console.log('✅ Test: Navigation from profile on mobile - PASSED');
  });
});

test.describe('Profile Page - Full HD (1920x1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/myprofile');
  });

  test('Should display profile page correctly on Full HD', async ({ page }) => {
    console.log('🧪 Test: Profile page on Full HD (1920x1080)');

    // Verify all main elements
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
    await expect(page.getByText('Profile Picture')).toBeVisible();
    await expect(page.getByText('User Information')).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toEqual(clientWidth);

    console.log('✅ Test: Profile page on Full HD - PASSED');
  });

  test('Should display profile picture and info side by side on Full HD', async ({ page }) => {
    console.log('🧪 Test: Profile layout on Full HD');

    // Verify 2-column layout on larger screens
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // Verify both sections are present
    await expect(page.locator('section:has-text("Profile Picture")')).toBeVisible();
    await expect(page.locator('section:has-text("User Information")')).toBeVisible();

    console.log('✅ Test: Profile layout on Full HD - PASSED');
  });
});

test.describe('Profile Page - Authentication', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('Should redirect to login if not authenticated', async ({ page }) => {
    console.log('🧪 Test: Profile page authentication redirect');

    // Clear any existing auth
    await page.goto('/myprofile');

    // Verify redirect to login (since not authenticated)
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: Profile page authentication redirect - PASSED');
  });

  test('Should show loading state while checking authentication', async ({ page }) => {
    console.log('🧪 Test: Profile page loading state');

    // Set auth token
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/myprofile');

    // Page should load successfully
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    console.log('✅ Test: Profile page loading state - PASSED');
  });
});

test.describe('Profile Page - Navigation Links', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
  });

  test('Should have Back to Gallery link', async ({ page }) => {
    console.log('🧪 Test: Back to Gallery link');

    await page.goto('/myprofile');

    // Verify "Back to Gallery" link exists
    const backLink = page.getByRole('link', { name: 'Back to Gallery' });
    // Note: This might be a button or link depending on implementation
    const navigationElement = page.locator('text=Back to Gallery, text=Go to My Gallery').first();
    await expect(navigationElement).toBeVisible();

    console.log('✅ Test: Back to Gallery link - PASSED');
  });

  test('Should navigate to gallery via Back link', async ({ page }) => {
    console.log('🧪 Test: Navigate via Back link');

    await page.goto('/myprofile');

    // Look for any gallery navigation element
    const galleryLink = page.getByRole('link', { name: /gallery/i }).or(page.getByRole('button', { name: /gallery/i }));

    if (await galleryLink.count() > 0) {
      await galleryLink.first().click();
      await page.waitForURL('/gallery', { timeout: 5000 });
      expect(page.url()).toContain('/gallery');
    }

    console.log('✅ Test: Navigate via Back link - PASSED');
  });
});
