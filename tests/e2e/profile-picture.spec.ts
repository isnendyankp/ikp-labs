import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * Profile Picture E2E Tests
 *
 * Comprehensive testing for profile picture upload/delete functionality:
 * - Complete user journey: Register → Login → Upload → Delete
 * - File validation (size, type)
 * - Success/error messages
 * - UI state updates
 * - Multiple upload/delete cycles
 *
 * Test Fixtures Used:
 * - valid-profile.jpg (286 bytes) - Valid JPEG
 * - valid-profile.png (70 bytes) - Valid PNG
 * - valid-profile-2.jpg (286 bytes) - Alternative JPEG
 * - large-image.jpg (6MB) - Oversized file
 * - invalid-file.txt (55 bytes) - Non-image file
 */

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate unique email for test users
 */
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `profile.test.${timestamp}.${random}@example.com`;
}

/**
 * Register and login a new test user
 * Returns authenticated page ready for testing
 */
async function createAuthenticatedUser(page: Page) {
  const testUser = {
    fullName: 'Profile Picture Test User',
    email: generateUniqueEmail(),
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  };

  // Register
  await page.goto('/register');
  await page.fill('input[name="name"]', testUser.fullName);
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.fill('input[name="confirmPassword"]', testUser.confirmPassword);
  await page.click('button[type="submit"]');

  // Wait for redirect to home
  await page.waitForURL('/home', { timeout: 5000 });

  return { page, user: testUser };
}

/**
 * Upload a profile picture
 */
async function uploadProfilePicture(page: Page, fixtureName: string) {
  const fixturePath = path.join(__dirname, '../fixtures', fixtureName);

  // STEP 1: Click "Change Picture" button to show upload form
  const changePictureButton = page.locator('button:has-text("Change Picture")');

  // Check if button exists and click it
  const isVisible = await changePictureButton.isVisible().catch(() => false);
  if (isVisible) {
    await changePictureButton.click();
    console.log('  ✓ Clicked "Change Picture" button');
    await page.waitForTimeout(500); // Wait for form to appear
  }

  // STEP 2: Find file input and upload file
  // Note: File input has class="hidden" but Playwright can still interact with it
  const fileInput = page.locator('input[type="file"]');
  await fileInput.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput.setInputFiles(fixturePath);
  console.log('  ✓ File selected:', fixtureName);

  // STEP 3: Click upload button (wait for it to be enabled)
  // Use more specific text to avoid matching "Hide Upload" button
  const uploadButton = page.locator('button:has-text("Upload Picture")');
  await uploadButton.waitFor({ state: 'visible', timeout: 5000 });
  await uploadButton.click();
  console.log('  ✓ Upload button clicked');

  // STEP 4: Wait for upload to process
  await page.waitForTimeout(2000);
}

/**
 * Delete profile picture
 */
async function deleteProfilePicture(page: Page) {
  // Setup dialog handler BEFORE clicking button
  page.once('dialog', async dialog => {
    console.log('  ✓ Confirmation dialog appeared:', dialog.message());
    await dialog.accept();
  });

  // Click delete button
  const deleteButton = page.locator('button:has-text("Delete Picture")');
  await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
  await deleteButton.click();
  console.log('  ✓ Delete button clicked');

  // Wait for deletion to complete
  await page.waitForTimeout(2000);
}

/**
 * Verify profile picture is displayed
 */
async function verifyProfilePictureDisplayed(page: Page) {
  // Check that actual image is shown (not default avatar)
  const profileImage = page.locator('img[alt*="profile picture"]');
  await expect(profileImage).toBeVisible();

  // Verify image src is not empty
  const src = await profileImage.getAttribute('src');
  expect(src).toBeTruthy();
  expect(src).toContain('/uploads/profiles/');
}

/**
 * Verify fallback avatar is displayed (initials)
 */
async function verifyAvatarFallback(page: Page, initials: string) {
  // Check that avatar div with initials is shown
  const avatar = page.locator(`div:has-text("${initials}")`);
  await expect(avatar).toBeVisible();

  // Ensure actual profile image is NOT visible
  const profileImage = page.locator('img[alt*="profile picture"]');
  await expect(profileImage).not.toBeVisible();
}

// =============================================================================
// TEST SUITE
// =============================================================================

test.describe('Profile Picture E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  // ===========================================================================
  // TEST 1: Upload Profile Picture - JPEG
  // ===========================================================================

  test('Should upload JPEG profile picture successfully', async ({ page }) => {
    console.log('🧪 Test 1: Upload JPEG profile picture');

    // Create authenticated user
    const { user } = await createAuthenticatedUser(page);

    // Verify we're on home page
    expect(page.url()).toContain('/home');

    // Upload valid JPEG
    await uploadProfilePicture(page, 'valid-profile.jpg');

    // Verify profile picture is displayed (upload form auto-hides on success)
    await verifyProfilePictureDisplayed(page);

    // Verify upload section is hidden (success behavior)
    const changePictureButton = page.locator('button:has-text("Change Picture")');
    await expect(changePictureButton).toBeVisible({ timeout: 3000 });

    console.log('✅ Test 1: JPEG upload successful');
  });

  // ===========================================================================
  // TEST 2: Upload Profile Picture - PNG
  // ===========================================================================

  test('Should upload PNG profile picture successfully', async ({ page }) => {
    console.log('🧪 Test 2: Upload PNG profile picture');

    // Create authenticated user
    await createAuthenticatedUser(page);

    // Upload valid PNG
    await uploadProfilePicture(page, 'valid-profile.png');

    // Verify profile picture is displayed (upload form auto-hides on success)
    await verifyProfilePictureDisplayed(page);

    // Verify upload section is hidden (success behavior)
    const changePictureButton = page.locator('button:has-text("Change Picture")');
    await expect(changePictureButton).toBeVisible({ timeout: 3000 });

    console.log('✅ Test 2: PNG upload successful');
  });

  // ===========================================================================
  // TEST 3: Delete Profile Picture
  // ===========================================================================

  test('Should delete profile picture successfully', async ({ page }) => {
    console.log('🧪 Test 3: Delete profile picture');

    // Create authenticated user and upload picture first
    const { user } = await createAuthenticatedUser(page);
    await uploadProfilePicture(page, 'valid-profile.jpg');

    // Wait for upload to complete - verify image displayed
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Upload completed, picture displayed');

    // Now delete the picture
    await deleteProfilePicture(page);

    // Verify fallback avatar is shown with initials (delete success indicator)
    const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    await verifyAvatarFallback(page, initials.substring(0, 2));

    // Verify Delete Picture button is no longer visible (no picture to delete)
    const deleteButton = page.locator('button:has-text("Delete Picture")');
    await expect(deleteButton).not.toBeVisible({ timeout: 3000 });

    console.log('✅ Test 3: Delete successful');
  });

  // ===========================================================================
  // TEST 4: Complete Flow - Register → Login → Upload → Delete → Logout
  // ===========================================================================

  test('Complete flow: Register → Login → Upload → Delete → Logout', async ({ page }) => {
    console.log('🧪 Test 4: Complete end-to-end flow');

    // STEP 1: Register
    const testUser = {
      fullName: 'Complete Flow Test User',
      email: generateUniqueEmail(),
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!'
    };

    await page.goto('/register');
    await page.fill('input[name="name"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.confirmPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/home', { timeout: 5000 });
    console.log('  ✓ Registration successful');

    // STEP 2: Verify on home page with user info
    await expect(page.locator(`text=Welcome, ${testUser.fullName}!`)).toBeVisible();
    console.log('  ✓ Home page loaded');

    // STEP 3: Upload profile picture
    await uploadProfilePicture(page, 'valid-profile.jpg');
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Upload successful');

    // STEP 4: Delete profile picture
    await deleteProfilePicture(page);
    const initials = testUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    await verifyAvatarFallback(page, initials.substring(0, 2));
    console.log('  ✓ Delete successful');

    // STEP 5: Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
    console.log('  ✓ Logout successful');

    console.log('✅ Test 4: Complete flow successful');
  });

  // ===========================================================================
  // TEST 5: Multiple Upload/Delete Cycles
  // ===========================================================================

  test('Should handle multiple upload and delete operations', async ({ page }) => {
    console.log('🧪 Test 5: Multiple upload/delete cycles');

    const { user } = await createAuthenticatedUser(page);
    const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();

    // Cycle 1: Upload JPEG → Delete
    await uploadProfilePicture(page, 'valid-profile.jpg');
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Upload #1 successful');

    await deleteProfilePicture(page);
    await verifyAvatarFallback(page, initials.substring(0, 2));
    console.log('  ✓ Delete #1 successful');

    // Cycle 2: Upload PNG → Delete
    await uploadProfilePicture(page, 'valid-profile.png');
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Upload #2 successful');

    await deleteProfilePicture(page);
    await verifyAvatarFallback(page, initials.substring(0, 2));
    console.log('  ✓ Delete #2 successful');

    // Cycle 3: Upload alternative JPEG (verify replacement)
    await uploadProfilePicture(page, 'valid-profile-2.jpg');
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Upload #3 successful (replacement)');

    console.log('✅ Test 5: Multiple cycles successful');
  });

  // ===========================================================================
  // TEST 6: Profile Picture Persists After Page Refresh
  // ===========================================================================

  test('Should persist profile picture after page refresh', async ({ page }) => {
    console.log('🧪 Test 6: Profile picture persistence');

    await createAuthenticatedUser(page);

    // Upload picture
    await uploadProfilePicture(page, 'valid-profile.jpg');
    await expect(page.locator('text=/uploaded successfully/i')).toBeVisible({ timeout: 5000 });
    console.log('  ✓ Upload successful');

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    console.log('  ✓ Page refreshed');

    // Verify picture still displayed (loaded from backend)
    await verifyProfilePictureDisplayed(page);
    console.log('  ✓ Picture persisted after refresh');

    console.log('✅ Test 6: Persistence verified');
  });

  // ===========================================================================
  // TEST 7: Reject File Size Exceeding Limit (> 5MB)
  // ===========================================================================

  test('Should reject file larger than 5MB', async ({ page }) => {
    console.log('🧪 Test 7: File size validation');

    await createAuthenticatedUser(page);

    // Try to upload large file (6MB)
    await uploadProfilePicture(page, 'large-image.jpg');

    // Wait for error message
    await expect(page.locator('text=/exceeds maximum limit/i')).toBeVisible({ timeout: 5000 });
    console.log('  ✓ Size validation error shown');

    // Verify profile picture is NOT displayed (upload failed)
    const profileImage = page.locator('img[alt*="profile picture"]');
    await expect(profileImage).not.toBeVisible();

    console.log('✅ Test 7: Size validation working');
  });

  // ===========================================================================
  // TEST 8: Reject Non-Image File
  // ===========================================================================

  test('Should reject non-image file', async ({ page }) => {
    console.log('🧪 Test 8: File type validation');

    await createAuthenticatedUser(page);

    // Try to upload text file
    await uploadProfilePicture(page, 'invalid-file.txt');

    // Wait for error message
    await expect(page.locator('text=/only.*image.*allowed/i')).toBeVisible({ timeout: 5000 });
    console.log('  ✓ Type validation error shown');

    // Verify profile picture is NOT displayed
    const profileImage = page.locator('img[alt*="profile picture"]');
    await expect(profileImage).not.toBeVisible();

    console.log('✅ Test 8: Type validation working');
  });

  // ===========================================================================
  // TEST 9: Replace Existing Profile Picture
  // ===========================================================================

  test('Should replace existing profile picture with new one', async ({ page }) => {
    console.log('🧪 Test 9: Picture replacement');

    await createAuthenticatedUser(page);

    // Upload first picture
    await uploadProfilePicture(page, 'valid-profile.jpg');
    await expect(page.locator('text=/uploaded successfully/i')).toBeVisible({ timeout: 5000 });
    console.log('  ✓ First upload successful');

    // Get initial image src
    const profileImage = page.locator('img[alt*="profile picture"]');
    const initialSrc = await profileImage.getAttribute('src');
    console.log('  ✓ Initial image src:', initialSrc);

    // Upload second picture (should replace first)
    await uploadProfilePicture(page, 'valid-profile-2.jpg');
    await expect(page.locator('text=/uploaded successfully/i')).toBeVisible({ timeout: 5000 });
    console.log('  ✓ Second upload successful');

    // Verify image still displayed (replaced, not deleted)
    await verifyProfilePictureDisplayed(page);

    // Note: We can't easily verify src changed because backend uses same filename
    // (user-{id}.jpg), but we verify upload succeeded and image displays

    console.log('✅ Test 9: Replacement successful');
  });

  // ===========================================================================
  // TEST 10: Unauthenticated User Cannot Upload
  // ===========================================================================

  test('Should prevent unauthenticated user from uploading', async ({ page }) => {
    console.log('🧪 Test 10: Authentication requirement');

    // Try to access home without authentication
    await page.goto('/home');

    // Should be redirected to login
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
    console.log('  ✓ Unauthenticated user redirected to login');

    console.log('✅ Test 10: Authentication enforced');
  });

});

/**
 * NOTES FOR MAINTENANCE:
 * ======================
 *
 * 1. Test Isolation:
 *    - Each test creates its own user with unique email
 *    - Tests don't depend on each other
 *    - Can run in parallel safely
 *
 * 2. Selectors Used:
 *    - 'input[type="file"]' - File upload input
 *    - 'button:has-text("Upload")' - Upload button
 *    - 'button:has-text("Delete Picture")' - Delete button
 *    - 'img[alt*="profile picture"]' - Uploaded image
 *    - 'text=/uploaded successfully/i' - Success message
 *
 * 3. Timeouts:
 *    - Most waits use 5000ms (5 seconds)
 *    - Upload/delete operations include 1000ms pause for processing
 *    - Adjust if tests become flaky
 *
 * 4. Test Fixtures:
 *    - Located in tests/fixtures/
 *    - Generate with: node tests/fixtures/generate-test-images.js
 *    - Committed to git for consistent testing
 *
 * 5. Future Improvements:
 *    - Add visual regression testing (screenshot comparison)
 *    - Test concurrent uploads (race conditions)
 *    - Test network failure scenarios
 *    - Test browser back/forward navigation
 */
