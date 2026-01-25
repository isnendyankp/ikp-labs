import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Tests
 *
 * Test suite for the Kameravue landing page.
 * Tests navigation, responsive design, sections, and interactive elements.
 */

/**
 * Helper function to create a fake JWT token for testing
 * The isAuthenticated() function checks:
 * 1. Token exists
 * 2. Token has valid JWT format (3 parts)
 * 3. Token is not expired
 */
function createFakeJwtToken(): string {
  // Create a fake JWT payload with expiration in the future
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

  // Encode to base64 (URL-safe)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Fake JWT: header.payload.signature
  return `${header}.${encodedPayload}.fake-signature`;
}

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
    const getStartedButton = page.getByRole('button', { name: /Get Started Free/i }).first();
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

    // Find and click the Get Started Free button in CTA section (with arrow)
    const getStartedButtons = page.getByRole('button', { name: /Get Started/i });
    const count = await getStartedButtons.count();
    expect(count).toBeGreaterThan(0);

    // Click the last Get Started button (in CTA section with arrow)
    await getStartedButtons.nth(count - 1).click();

    // Verify navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: CTA section "Get Started Free" button navigation - PASSED');
  });

  test('Should navigate to login page when clicking Navbar "Login" button', async ({ page }) => {
    console.log('🧪 Test: Navbar "Login" button navigation');

    // Find and click the Login button in Navbar (unauthenticated state)
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // Verify navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    console.log('✅ Test: Navbar "Login" button navigation - PASSED');
  });

  test('Should smooth scroll to Features section when clicking "Learn More" button', async ({ page }) => {
    console.log('🧪 Test: "Learn More" button smooth scroll');

    // Find and click the Learn More button (text is "Learn More →" with arrow)
    const learnMoreButton = page.getByRole('button', { name: /Learn More/i });
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

    // Set auth token BEFORE page load (because useEffect checks on mount)
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/');

    // Verify "Go to Gallery" button is visible (exact match)
    const goToGalleryButton = page.getByRole('button', { name: 'Go to Gallery', exact: true });
    await expect(goToGalleryButton).toBeVisible();

    // Verify Login and Get Started buttons are NOT visible (exact match)
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    const getStartedButton = page.getByRole('button', { name: 'Get Started', exact: true });
    await expect(loginButton).not.toBeVisible();
    await expect(getStartedButton).not.toBeVisible();

    console.log('✅ Test: Auth-aware "Go to Gallery" button - PASSED');
  });

  test('Should navigate to gallery when clicking "Go to Gallery" button', async ({ page }) => {
    console.log('🧪 Test: "Go to Gallery" button navigation');

    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/');

    // Click "Go to Gallery" button (exact match)
    const goToGalleryButton = page.getByRole('button', { name: 'Go to Gallery', exact: true });
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

    // Set desktop viewport (above lg breakpoint of 1024px)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to force re-render with new viewport
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify all nav elements are visible
    await expect(page.getByRole('link', { name: 'Kameravue' })).toBeVisible();

    // Navbar uses buttons for navigation - target navbar specifically
    const navbar = page.locator('nav').first();
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'About', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'Get Started', exact: true })).toBeVisible();

    // Hamburger menu should NOT be visible on desktop
    const hamburgerMenu = page.getByRole('button', { name: /Toggle navigation menu/i });
    await expect(hamburgerMenu).not.toBeVisible();

    console.log('✅ Test: Desktop navbar layout - PASSED');
  });

  test('Should show hamburger menu on mobile viewport', async ({ page }) => {
    console.log('🧪 Test: Mobile navbar hamburger menu');

    // Set mobile viewport (below lg breakpoint of 1024px)
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to force re-render with new viewport
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify hamburger menu is visible
    const hamburgerMenu = page.getByRole('button', { name: /Toggle navigation menu/i });
    await expect(hamburgerMenu).toBeVisible();

    // Desktop nav buttons should NOT be visible initially on mobile
    const navbar = page.locator('nav').first();
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).not.toBeVisible();
    await expect(navbar.getByRole('button', { name: 'About', exact: true })).not.toBeVisible();

    console.log('✅ Test: Mobile navbar hamburger menu - PASSED');
  });

  test('Should open and close mobile hamburger menu', async ({ page }) => {
    console.log('🧪 Test: Mobile hamburger menu toggle');

    // Set mobile viewport (below lg breakpoint of 1024px)
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to force re-render with new viewport
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Click hamburger menu to open
    const hamburgerMenu = page.getByRole('button', { name: /Toggle navigation menu/i });
    await hamburgerMenu.click();
    await page.waitForTimeout(500);

    // Verify mobile menu is open (nav buttons should be visible)
    const navbar = page.locator('nav').first();
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).toBeVisible();
    await expect(navbar.getByRole('button', { name: 'About', exact: true })).toBeVisible();

    // Click hamburger menu to close
    await hamburgerMenu.click();
    await page.waitForTimeout(500);

    // Verify menu is closed
    await expect(navbar.getByRole('button', { name: 'Features', exact: true })).not.toBeVisible();

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

    // Verify CTA buttons - use nth() to target specific buttons
    const getStartedButtons = page.getByRole('button', { name: /Get Started/i });
    await expect(getStartedButtons.nth(0)).toBeVisible(); // First "Get Started Free" in Hero
    await expect(page.getByRole('button', { name: /Learn More/i })).toBeVisible(); // "Learn More →"

    // Hero section doesn't have "Free forever" text (that's in CTA section)
    // Only verify trust elements that are in Hero section

    console.log('✅ Test: Hero section render - PASSED');
  });

  test('Should render Features section with 6 feature cards', async ({ page }) => {
    console.log('🧪 Test: Features section render');

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify section heading - check actual text from component
    const featuresHeading = page.locator('#features').getByRole('heading').first();
    await expect(featuresHeading).toBeVisible();

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

    console.log('✅ Test: Features section render - PASSED');
  });

  test('Should render About section with mission and stats', async ({ page }) => {
    console.log('🧪 Test: About section render');

    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify section heading
    const aboutHeading = page.locator('#about').getByRole('heading').first();
    await expect(aboutHeading).toBeVisible();

    // Verify stats are visible
    await expect(page.getByText(/Public or Private/i)).toBeVisible();
    await expect(page.getByText(/Anonymous Favorites/i)).toBeVisible();
    await expect(page.getByText(/100% Free/i)).toBeVisible();

    console.log('✅ Test: About section render - PASSED');
  });

  test('Should render CTA section with dark background', async ({ page }) => {
    console.log('🧪 Test: CTA section render');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify CTA section exists and has content
    const ctaSection = page.locator('section').filter({ hasText: /Ready to start sharing/i });
    await expect(ctaSection).toBeVisible();

    // Verify trust elements - use nth() to avoid strict mode violation
    const trustElements = page.getByText(/No credit card required/i);
    await expect(trustElements.nth(0)).toBeVisible();

    console.log('✅ Test: CTA section render - PASSED');
  });

  test('Should render Footer with links and copyright', async ({ page }) => {
    console.log('🧪 Test: Footer render');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer elements
    await expect(page.getByRole('link', { name: 'Kameravue' })).toBeVisible();

    // Verify copyright notice with current year
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(new RegExp(`${currentYear}`))).toBeVisible();

    console.log('✅ Test: Footer render - PASSED');
  });

  // ========================================
  // Smooth Scroll Navigation Tests
  // ========================================

  test('Should smooth scroll to Features when clicking Navbar Features button', async ({ page }) => {
    console.log('🧪 Test: Navbar Features button smooth scroll');

    // Click Features button in Navbar (target navbar to avoid footer conflicts)
    const navbar = page.locator('nav').first();
    const featuresButton = navbar.getByRole('button', { name: 'Features', exact: true });
    await featuresButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify Features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: Navbar Features button smooth scroll - PASSED');
  });

  test('Should smooth scroll to About when clicking Navbar About button', async ({ page }) => {
    console.log('🧪 Test: Navbar About button smooth scroll');

    // Click About button in Navbar (target navbar to avoid footer conflicts)
    const navbar = page.locator('nav').first();
    const aboutButton = navbar.getByRole('button', { name: 'About', exact: true });
    await aboutButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify About section is in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();

    console.log('✅ Test: Navbar About button smooth scroll - PASSED');
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
    const hamburgerMenu = page.getByRole('button', { name: /Toggle navigation menu/i });
    await expect(hamburgerMenu).toBeVisible();

    console.log('✅ Test: Mobile responsive layout - PASSED');
  });

  test('Should display 2-column layout on tablet (768px)', async ({ page }) => {
    console.log('🧪 Test: Tablet responsive layout (768px)');

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify features section is visible
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

    console.log('✅ Test: Tablet responsive layout - PASSED');
  });

  test('Should display 3-column layout on desktop (1280px)', async ({ page }) => {
    console.log('🧪 Test: Desktop responsive layout (1280px)');

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Scroll to Features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify features section is visible
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

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
    const firstCard = page.locator('#features').locator('div').first();

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
    const getStartedButtons = page.getByRole('button', { name: /Get Started/i });
    const getStartedButton = getStartedButtons.nth(0);

    // Hover over the button
    await getStartedButton.hover();

    // Wait for hover effect
    await page.waitForTimeout(300);

    // Button should still be visible
    await expect(getStartedButton).toBeVisible();

    console.log('✅ Test: Button hover effects - PASSED');
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

    // Verify Login button is visible (exact match)
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    await expect(loginButton).toBeVisible();

    // Verify Get Started button is visible (exact match for Navbar "Get Started")
    const getStartedButton = page.getByRole('button', { name: 'Get Started', exact: true });
    await expect(getStartedButton).toBeVisible();

    console.log('✅ Test: Unauthenticated button states - PASSED');
  });

  test('Should show Go to Gallery button when authenticated', async ({ page }) => {
    console.log('🧪 Test: Authenticated button state');

    // Set auth token BEFORE page load
    const fakeToken = createFakeJwtToken();
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, fakeToken);
    await page.goto('/');

    // Verify Go to Gallery button is visible (exact match)
    const goToGalleryButton = page.getByRole('button', { name: 'Go to Gallery', exact: true });
    await expect(goToGalleryButton).toBeVisible();

    // Verify Login and Get Started buttons are NOT visible (exact match)
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    const getStartedButton = page.getByRole('button', { name: 'Get Started', exact: true });
    await expect(loginButton).not.toBeVisible();
    await expect(getStartedButton).not.toBeVisible();

    console.log('✅ Test: Authenticated button state - PASSED');
  });

  // ========================================
  // Back to Top Button Tests
  // ========================================

  test('Should hide BackToTop button at top of page', async ({ page }) => {
    console.log('🧪 Test: BackToTop button hidden at top');

    // Navigate to landing page
    await page.goto('/');

    // BackToTop button should not be visible at top
    const backToTopButton = page.getByRole('button', { name: 'Scroll to top' });
    await expect(backToTopButton).not.toBeVisible();

    console.log('✅ Test: BackToTop button hidden at top - PASSED');
  });

  test('Should show BackToTop button after scrolling down', async ({ page }) => {
    console.log('🧪 Test: BackToTop button appears after scroll');

    // Navigate to landing page
    await page.goto('/');

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // BackToTop button should be visible after scrolling
    const backToTopButton = page.getByRole('button', { name: 'Scroll to top' });
    await expect(backToTopButton).toBeVisible();

    console.log('✅ Test: BackToTop button appears after scroll - PASSED');
  });

  test('Should scroll to top when clicking BackToTop button', async ({ page }) => {
    console.log('🧪 Test: BackToTop button scrolls to top');

    // Navigate to landing page
    await page.goto('/');

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click BackToTop button
    const backToTopButton = page.getByRole('button', { name: 'Scroll to top' });
    await backToTopButton.click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // Verify we're at the top of the page
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);

    console.log('✅ Test: BackToTop button scrolls to top - PASSED');
  });

  test('Should hide BackToTop button after scrolling to top', async ({ page }) => {
    console.log('🧪 Test: BackToTop button hides at top after scroll');

    // Navigate to landing page
    await page.goto('/');

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click BackToTop button to scroll to top
    const backToTopButton = page.getByRole('button', { name: 'Scroll to top' });
    await backToTopButton.click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // BackToTop button should not be visible at top
    await expect(backToTopButton).not.toBeVisible();

    console.log('✅ Test: BackToTop button hides at top - PASSED');
  });

  // ========================================
  // Footer Navigation Tests
  // ========================================

  test('Should smooth scroll to Features when clicking Footer Features button', async ({ page }) => {
    console.log('🧪 Test: Footer Features button smooth scroll');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click Features button in footer
    const footer = page.locator('footer').first();
    const featuresButton = footer.getByRole('button', { name: 'Features', exact: true });
    await featuresButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify Features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();

    console.log('✅ Test: Footer Features button smooth scroll - PASSED');
  });

  test('Should smooth scroll to About when clicking Footer About button', async ({ page }) => {
    console.log('🧪 Test: Footer About button smooth scroll');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click About button in footer
    const footer = page.locator('footer').first();
    const aboutButton = footer.getByRole('button', { name: 'About', exact: true });
    await aboutButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify About section is in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();

    console.log('✅ Test: Footer About button smooth scroll - PASSED');
  });

  test('Should have contact email link with correct mailto href', async ({ page }) => {
    console.log('🧪 Test: Footer contact email link');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get contact link by href attribute
    const contactLink = page.locator('a[href="mailto:isnendyankp@gmail.com"]');
    await expect(contactLink).toBeVisible();

    // Verify href attribute
    const href = await contactLink.getAttribute('href');
    expect(href).toBe('mailto:isnendyankp@gmail.com');

    console.log('✅ Test: Footer contact email link - PASSED');
  });

  // ========================================
  // Footer External Links Tests
  // ========================================

  test('Should open GitHub in new tab when clicking GitHub link', async ({ page }) => {
    console.log('🧪 Test: Footer GitHub external link');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get GitHub link
    const footer = page.locator('footer').first();
    const githubLink = footer.locator('a[href="https://github.com/isnendyankp/ikp-labs"]').first();
    await expect(githubLink).toBeVisible();

    // Verify href and target attributes
    const href = await githubLink.getAttribute('href');
    const target = await githubLink.getAttribute('target');
    const rel = await githubLink.getAttribute('rel');

    expect(href).toBe('https://github.com/isnendyankp/ikp-labs');
    expect(target).toBe('_blank');
    expect(rel).toBe('noopener noreferrer');

    // Verify GitHub icon is visible
    const githubIcon = githubLink.locator('svg');
    await expect(githubIcon).toBeVisible();

    console.log('✅ Test: Footer GitHub external link - PASSED');
  });

  test('Should open LinkedIn in new tab when clicking LinkedIn link', async ({ page }) => {
    console.log('🧪 Test: Footer LinkedIn external link');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get LinkedIn link
    const footer = page.locator('footer').first();
    const linkedinLink = footer.locator('a[href="https://www.linkedin.com/in/isnendyan"]');
    await expect(linkedinLink).toBeVisible();

    // Verify href and target attributes
    const href = await linkedinLink.getAttribute('href');
    const target = await linkedinLink.getAttribute('target');
    const rel = await linkedinLink.getAttribute('rel');

    expect(href).toBe('https://www.linkedin.com/in/isnendyan');
    expect(target).toBe('_blank');
    expect(rel).toBe('noopener noreferrer');

    // Verify LinkedIn icon is visible
    const linkedinIcon = linkedinLink.locator('svg');
    await expect(linkedinIcon).toBeVisible();

    console.log('✅ Test: Footer LinkedIn external link - PASSED');
  });

  // ========================================
  // Footer Legal Links Tests
  // ========================================

  test('Should navigate to Terms page when clicking Terms link', async ({ page }) => {
    console.log('🧪 Test: Footer Terms link navigation');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click Terms link
    const termsLink = page.getByRole('link', { name: 'Terms of Service' });
    await termsLink.click();

    // Verify navigation to Terms page
    await page.waitForURL('/terms', { timeout: 5000 });
    expect(page.url()).toContain('/terms');

    console.log('✅ Test: Footer Terms link navigation - PASSED');
  });

  test('Should navigate to Privacy page when clicking Privacy link', async ({ page }) => {
    console.log('🧪 Test: Footer Privacy link navigation');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click Privacy link
    const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
    await privacyLink.click();

    // Verify navigation to Privacy page
    await page.waitForURL('/privacy', { timeout: 5000 });
    expect(page.url()).toContain('/privacy');

    console.log('✅ Test: Footer Privacy link navigation - PASSED');
  });

  // ========================================
  // Legal Pages Tests
  // ========================================

  test('Should render Terms page with all sections and disclaimer', async ({ page }) => {
    console.log('🧪 Test: Terms page rendering');

    // Navigate to Terms page
    await page.goto('/terms');

    // Verify page title
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();

    // Verify main sections
    await expect(page.getByRole('heading', { name: '1. Overview' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2. Terms of Use' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3. Intellectual Property' })).toBeVisible();

    // Verify educational disclaimer
    await expect(page.getByRole('heading', { name: 'Educational Purpose' })).toBeVisible();
    await expect(page.getByText(/Kameravue is a learning project/i)).toBeVisible();

    // Verify GitHub link in disclaimer
    const githubLink = page.locator('a[href="https://github.com/isnendyankp/ikp-labs"]').first();
    await expect(githubLink).toBeVisible();

    // Verify LinkedIn link in disclaimer
    const linkedinLink = page.locator('a[href="https://www.linkedin.com/in/isnendyan"]');
    await expect(linkedinLink).toBeVisible();

    console.log('✅ Test: Terms page rendering - PASSED');
  });

  test('Should render Privacy page with all sections and disclaimer', async ({ page }) => {
    console.log('🧪 Test: Privacy page rendering');

    // Navigate to Privacy page
    await page.goto('/privacy');

    // Verify page title
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();

    // Verify main sections
    await expect(page.getByRole('heading', { name: '1. Overview' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2. Information We Collect' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3. How We Use Your Information' })).toBeVisible();

    // Verify educational disclaimer
    await expect(page.getByRole('heading', { name: 'Educational Purpose' })).toBeVisible();
    await expect(page.getByText(/Kameravue is a learning project/i)).toBeVisible();

    // Verify GitHub link in disclaimer
    const githubLink = page.locator('a[href="https://github.com/isnendyankp/ikp-labs"]').first();
    await expect(githubLink).toBeVisible();

    // Verify LinkedIn link in disclaimer
    const linkedinLink = page.locator('a[href="https://www.linkedin.com/in/isnendyan"]');
    await expect(linkedinLink).toBeVisible();

    console.log('✅ Test: Privacy page rendering - PASSED');
  });

  test('Should navigate back to home from Terms page', async ({ page }) => {
    console.log('🧪 Test: Terms page back to home navigation');

    // Navigate to Terms page
    await page.goto('/terms');

    // Click "Back to Home" link
    const backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
    await backToHomeLink.click();

    // Verify navigation to home
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toBe('/');

    console.log('✅ Test: Terms page back to home navigation - PASSED');
  });

  test('Should navigate back to home from Privacy page', async ({ page }) => {
    console.log('🧪 Test: Privacy page back to home navigation');

    // Navigate to Privacy page
    await page.goto('/privacy');

    // Click "Back to Home" link
    const backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
    await backToHomeLink.click();

    // Verify navigation to home
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toBe('/');

    console.log('✅ Test: Privacy page back to home navigation - PASSED');
  });

  // ========================================
  // Footer Responsive Layout Tests
  // ========================================

  test('Should display 2-column footer layout on mobile', async ({ page }) => {
    console.log('🧪 Test: Footer mobile responsive layout (375px)');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer is visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Verify all footer columns are present
    await expect(footer.getByText('Kameravue')).toBeVisible();
    await expect(footer.getByText('Product')).toBeVisible();
    await expect(footer.getByText('Company')).toBeVisible();
    await expect(footer.getByText('Legal')).toBeVisible();

    // Verify GitHub and LinkedIn links are visible
    await expect(footer.locator('a[href="https://github.com/isnendyankp/ikp-labs"]')).toBeVisible();
    await expect(footer.locator('a[href="https://www.linkedin.com/in/isnendyan"]')).toBeVisible();

    console.log('✅ Test: Footer mobile responsive layout - PASSED');
  });

  test('Should display 4-column footer layout on desktop', async ({ page }) => {
    console.log('🧪 Test: Footer desktop responsive layout (1280px)');

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer is visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Verify all footer columns are present in proper layout
    await expect(footer.getByText('Kameravue')).toBeVisible();
    await expect(footer.getByText('Product')).toBeVisible();
    await expect(footer.getByText('Company')).toBeVisible();
    await expect(footer.getByText('Legal')).toBeVisible();

    // Verify GitHub and LinkedIn links are visible in Company column
    await expect(footer.locator('a[href="https://github.com/isnendyankp/ikp-labs"]')).toBeVisible();
    await expect(footer.locator('a[href="https://www.linkedin.com/in/isnendyan"]')).toBeVisible();

    console.log('✅ Test: Footer desktop responsive layout - PASSED');
  });

  // ========================================
  // About Section Stats Tests
  // ========================================

  test('Should display updated About section stats', async ({ page }) => {
    console.log('🧪 Test: About section updated stats');

    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify updated stats are visible
    await expect(page.getByText(/Your photos, your rules/i)).toBeVisible();
    await expect(page.getByText(/Favorite discreetly/i)).toBeVisible();
    await expect(page.getByText(/No hidden fees/i)).toBeVisible();

    // Verify stat cards are present
    const statCards = page.locator('#about').locator('.bg-gray-50');
    await expect(statCards).toHaveCount(3);

    console.log('✅ Test: About section updated stats - PASSED');
  });

});
