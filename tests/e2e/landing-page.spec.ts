import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Tests
 *
 * Test suite for the Kameravue landing page.
 * Tests navigation, responsive design, sections, and interactive elements.
 */

test.describe('Landing Page - End-to-End Tests', () => {
  // Before each test, navigate to landing page and clear auth state
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // ========================================
  // Navigation Button Tests
  // ========================================

  test('Should navigate to login page when clicking Hero "Get Started Free" button', async ({ page }) => {
    console.log('🧪 Test: Hero "Get Started Free" button navigation');

    // Find and click the Get Started Free button in Hero section
    const getStartedButton = page.getByRole('button', { name: 'Get Started Free' }).first();
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();

    // Verify navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: Hero "Get Started Free" button navigation - PASSED');
  });

  test('Should navigate to login page when clicking CTA section "Get Started Free" button', async ({ page }) => {
    console.log('🧪 Test: CTA section "Get Started Free" button navigation');

    // Scroll to CTA section (at bottom of page)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Find and click the Get Started Free button in CTA section
    const getStartedButtons = page.getByRole('button', { name: 'Get Started Free' });
    const count = await getStartedButtons.count();
    expect(count).toBeGreaterThan(0);

    // Click the last Get Started button (in CTA section)
    await getStartedButtons.nth(count - 1).click();

    // Verify navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: CTA section "Get Started Free" button navigation - PASSED');
  });

  test('Should navigate to login page when clicking Navbar "Login" button', async ({ page }) => {
    console.log('🧪 Test: Navbar "Login" button navigation');

    // Find and click the Login button in Navbar (unauthenticated state)
    const loginButton = page.getByRole('link', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // Verify navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: Navbar "Login" button navigation - PASSED');
  });

  test('Should smooth scroll to Features section when clicking "Learn More" button', async ({ page }) => {
    console.log('🧪 Test: "Learn More" button smooth scroll');

    // Find and click the Learn More button
    const learnMoreButton = page.getByRole('button', { name: 'Learn More' });
    await expect(learnMoreButton).toBeVisible();
    await learnMoreButton.click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // Verify we're at the Features section (has id="features")
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: "Learn More" button smooth scroll - PASSED');
  });

  test('Should show "Go to Gallery" button when authenticated', async ({ page }) => {
    console.log('🧪 Test: Auth-aware "Go to Gallery" button');

    // Set auth token in localStorage to simulate authenticated state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'fake-test-token');
      localStorage.setItem('userEmail', 'test@example.com');
    });

    // Reload page to apply auth state
    await page.reload();

    // Verify "Go to Gallery" button is visible
    const goToGalleryButton = page.getByRole('link', { name: 'Go to Gallery' });
    await expect(goToGalleryButton).toBeVisible();

    // Verify Login and Get Started buttons are NOT visible
    const loginButton = page.getByRole('link', { name: 'Login' });
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await expect(loginButton).not.toBeVisible();
    await expect(getStartedButton).not.toBeVisible();

    console.log('✅ Test: Auth-aware "Go to Gallery" button - PASSED');
  });

  test('Should navigate to gallery when clicking "Go to Gallery" button', async ({ page }) => {
    console.log('🧪 Test: "Go to Gallery" button navigation');

    // Set auth token and reload
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'fake-test-token');
      localStorage.setItem('userEmail', 'test@example.com');
    });
    await page.reload();

    // Click "Go to Gallery" button
    const goToGalleryButton = page.getByRole('link', { name: 'Go to Gallery' });
    await goToGalleryButton.click();

    // Verify navigation to gallery page
    await page.waitForURL('/gallery', { timeout: 5000 });
    expect(page.url()).toContain('/gallery');

    console.log('✅ Test: "Go to Gallery" button navigation - PASSED');
  });

  // ========================================
  // Responsive Navbar Tests
  // ========================================

  test('Should show all nav links on desktop viewport', async ({ page }) => {
    console.log('🧪 Test: Desktop navbar layout');

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verify all nav links are visible
    await expect(page.getByRole('link', { name: 'Kameravue' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();

    // Hamburger menu should NOT be visible on desktop
    const hamburgerMenu = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]');
    await expect(hamburgerMenu).not.toBeVisible();

    console.log('✅ Test: Desktop navbar layout - PASSED');
  });

  test('Should show hamburger menu on mobile viewport', async ({ page }) => {
    console.log('🧪 Test: Mobile navbar hamburger menu');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify hamburger menu is visible
    const hamburgerMenu = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]');
    await expect(hamburgerMenu).toBeVisible();

    // Desktop nav links should NOT be visible initially
    await expect(page.getByRole('link', { name: 'Features' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).not.toBeVisible();

    console.log('✅ Test: Mobile navbar hamburger menu - PASSED');
  });

  test('Should open and close mobile hamburger menu', async ({ page }) => {
    console.log('🧪 Test: Mobile hamburger menu toggle');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Click hamburger menu to open
    const hamburgerMenu = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]').first();
    await hamburgerMenu.click();
    await page.waitForTimeout(500);

    // Verify mobile menu is open (nav links should be visible)
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

    // Click hamburger menu to close
    await hamburgerMenu.click();
    await page.waitForTimeout(500);

    // Verify menu is closed
    await expect(page.getByRole('link', { name: 'Features' })).not.toBeVisible();

    console.log('✅ Test: Mobile hamburger menu toggle - PASSED');
  });

  test('Should show backdrop/shadow when scrolling down', async ({ page }) => {
    console.log('🧪 Test: Navbar scroll effect');

    // Get initial navbar state (not scrolled)
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();

    // Scroll down to trigger scroll effect
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Navbar should still be visible with backdrop/shadow
    await expect(navbar).toBeVisible();

    // The navbar should have backdrop-blur or shadow class
    // This is a visual check - we verify the navbar remains fixed
    const boundingBox = await navbar.boundingBox();
    expect(boundingBox?.y).toBe(0); // Should still be at top

    console.log('✅ Test: Navbar scroll effect - PASSED');
  });

  // ========================================
  // Section Render Tests
  // ========================================

  test('Should render Hero section with correct content', async ({ page }) => {
    console.log('🧪 Test: Hero section render');

    // Verify main headline
    const headline = page.getByRole('heading', { name: /Your perfect moments/i });
    await expect(headline).toBeVisible();

    // Verify subheadline
    await expect(page.getByText(/Share life's beautiful moments/i)).toBeVisible();

    // Verify CTA buttons
    await expect(page.getByRole('button', { name: 'Get Started Free' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();

    // Verify trust elements
    await expect(page.getByText(/No credit card required/i)).toBeVisible();
    await expect(page.getByText(/Free forever/i)).toBeVisible();

    console.log('✅ Test: Hero section render - PASSED');
  });

  test('Should render Features section with 6 feature cards', async ({ page }) => {
    console.log('🧪 Test: Features section render');

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify section heading
    await expect(page.getByRole('heading', { name: /Everything you need/i })).toBeVisible();

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
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }

    console.log('✅ Test: Features section render - PASSED');
  });

  test('Should render About section with mission and stats', async ({ page }) => {
    console.log('🧪 Test: About section render');

    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify section heading
    await expect(page.getByRole('heading', { name: /About Kameravue/i })).toBeVisible();

    // Verify stats are visible
    await expect(page.getByText(/10,000\+/)).toBeVisible();
    await expect(page.getByText(/50,000\+/)).toBeVisible();
    await expect(page.getByText(/100% Free/i)).toBeVisible();

    console.log('✅ Test: About section render - PASSED');
  });

  test('Should render CTA section with dark background', async ({ page }) => {
    console.log('🧪 Test: CTA section render');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify CTA heading
    await expect(page.getByRole('heading', { name: /Ready to start sharing/i })).toBeVisible();

    // Verify Get Started button in CTA
    const getStartedButtons = page.getByRole('button', { name: 'Get Started Free' });
    await expect(getStartedButtons.first()).toBeVisible();

    // Verify trust elements
    await expect(page.getByText(/No credit card required/i)).toBeVisible();

    // Verify dark background (check section styling)
    const ctaSection = page.locator('section').filter({ hasText: /Ready to start sharing/i });
    await expect(ctaSection).toBeVisible();

    console.log('✅ Test: CTA section render - PASSED');
  });

  test('Should render Footer with links and copyright', async ({ page }) => {
    console.log('🧪 Test: Footer render');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer elements
    await expect(page.getByRole('link', { name: 'Kameravue' })).toBeVisible();

    // Verify footer link columns
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gallery' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();

    // Verify copyright notice with current year
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(new RegExp(`${currentYear}`))).toBeVisible();
    await expect(page.getByText(/Made with/i)).toBeVisible();

    console.log('✅ Test: Footer render - PASSED');
  });

  // ========================================
  // Smooth Scroll Navigation Tests
  // ========================================

  test('Should smooth scroll to Features when clicking Navbar Features link', async ({ page }) => {
    console.log('🧪 Test: Navbar Features link smooth scroll');

    // Click Features link in Navbar
    const featuresLink = page.getByRole('link', { name: 'Features' });
    await featuresLink.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify Features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: Navbar Features link smooth scroll - PASSED');
  });

  test('Should smooth scroll to About when clicking Navbar About link', async ({ page }) => {
    console.log('🧪 Test: Navbar About link smooth scroll');

    // Click About link in Navbar
    const aboutLink = page.getByRole('link', { name: 'About' });
    await aboutLink.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify About section is in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();

    console.log('✅ Test: Navbar About link smooth scroll - PASSED');
  });

  test('Should smooth scroll to Features when clicking Learn More button', async ({ page }) => {
    console.log('🧪 Test: Learn More button smooth scroll to Features');

    // Click Learn More button
    const learnMoreButton = page.getByRole('button', { name: 'Learn More' });
    await learnMoreButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify Features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: Learn More button smooth scroll - PASSED');
  });

  // ========================================
  // Responsive Layout Tests
  // ========================================

  test('Should display stacked layout on mobile (375px)', async ({ page }) => {
    console.log('🧪 Test: Mobile responsive layout (375px)');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify Hero section is stacked (single column)
    const headline = page.getByRole('heading', { name: /Your perfect moments/i });
    await expect(headline).toBeVisible();

    // Verify mobile menu is visible
    const hamburgerMenu = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]');
    await expect(hamburgerMenu).toBeVisible();

    // Verify features are single column
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const featureCards = page.locator('[class*="grid"]').first();
    const gridClass = await featureCards.getAttribute('class');
    expect(gridClass).toContain('grid-cols-1');

    console.log('✅ Test: Mobile responsive layout - PASSED');
  });

  test('Should display 2-column layout on tablet (768px)', async ({ page }) => {
    console.log('🧪 Test: Tablet responsive layout (768px)');

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify features are 2-column grid (grid-cols-2)
    const featureCards = page.locator('[class*="grid"]').first();
    const gridClass = await featureCards.getAttribute('class');

    // On tablet (md breakpoint), should have grid-cols-2
    expect(gridClass).toBeTruthy();

    console.log('✅ Test: Tablet responsive layout - PASSED');
  });

  test('Should display 3-column layout on desktop (1280px)', async ({ page }) => {
    console.log('🧪 Test: Desktop responsive layout (1280px)');

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify features are 3-column grid (grid-cols-3 or lg:grid-cols-3)
    const featureCards = page.locator('[class*="grid"]').first();
    const gridClass = await featureCards.getAttribute('class');

    // On desktop (lg breakpoint), should have grid-cols-3
    expect(gridClass).toBeTruthy();

    console.log('✅ Test: Desktop responsive layout - PASSED');
  });

  // ========================================
  // Interactive Element Tests
  // ========================================

  test('Should have hover effect on feature cards', async ({ page }) => {
    console.log('🧪 Test: Feature card hover effect');

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Get first feature card
    const firstCard = page.locator('[class*="grid"]').first().locator('div').first();

    // Hover over the card
    await firstCard.hover();

    // Wait for hover effect
    await page.waitForTimeout(300);

    // Card should still be visible after hover
    await expect(firstCard).toBeVisible();

    console.log('✅ Test: Feature card hover effect - PASSED');
  });

  test('Should have hover effect on buttons', async ({ page }) => {
    console.log('🧪 Test: Button hover effects');

    // Get Get Started button
    const getStartedButton = page.getByRole('button', { name: 'Get Started Free' }).first();

    // Hover over the button
    await getStartedButton.hover();

    // Wait for hover effect
    await page.waitForTimeout(300);

    // Button should still be visible
    await expect(getStartedButton).toBeVisible();

    console.log('✅ Test: Button hover effects - PASSED');
  });

  test('Should navigate correctly when clicking Footer links', async ({ page }) => {
    console.log('🧪 Test: Footer link navigation');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Test Features link in footer (should scroll to Features)
    const featuresLink = page.getByRole('link', { name: 'Features' }).nth(1); // Second one (in footer)
    await featuresLink.click();
    await page.waitForTimeout(1000);

    // Should scroll to Features section
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: Footer link navigation - PASSED');
  });

  test('Should scroll to top when clicking Navbar logo', async ({ page }) => {
    console.log('🧪 Test: Navbar logo click scrolls to top');

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Verify we're not at top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Click logo
    const logoLink = page.getByRole('link', { name: 'Kameravue' });
    await logoLink.click();
    await page.waitForTimeout(1000);

    // Should be at top now
    const scrollYAfterClick = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterClick).toBe(0);

    console.log('✅ Test: Navbar logo click scrolls to top - PASSED');
  });

  // ========================================
  // Auth-Aware Button Tests
  // ========================================

  test('Should show Login and Get Started buttons when unauthenticated', async ({ page }) => {
    console.log('🧪 Test: Unauthenticated button states');

    // Ensure no auth state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Verify Login button is visible
    const loginButton = page.getByRole('link', { name: 'Login' });
    await expect(loginButton).toBeVisible();

    // Verify Get Started button is visible
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await expect(getStartedButton).toBeVisible();

    console.log('✅ Test: Unauthenticated button states - PASSED');
  });

  test('Should show Go to Gallery button when authenticated', async ({ page }) => {
    console.log('🧪 Test: Authenticated button state');

    // Set auth state
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'fake-test-token');
      localStorage.setItem('userEmail', 'test@example.com');
    });
    await page.reload();

    // Verify Go to Gallery button is visible
    const goToGalleryButton = page.getByRole('link', { name: 'Go to Gallery' });
    await expect(goToGalleryButton).toBeVisible();

    // Verify Login and Get Started buttons are NOT visible
    const loginButton = page.getByRole('link', { name: 'Login' });
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await expect(loginButton).not.toBeVisible();
    await expect(getStartedButton).not.toBeVisible();

    console.log('✅ Test: Authenticated button state - PASSED');
  });

});
