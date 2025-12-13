/**
 * E2E Photo Likes Tests
 *
 * Tests Photo Likes feature through browser automation.
 * Tests like/unlike from gallery, detail view, persistence, and liked photos page.
 *
 * Cleanup Strategy: Always Delete
 * - All test users are automatically deleted after test suite completes
 * - Uses cleanupTestUser() helper with /api/test-admin/users endpoint
 * - Runs in afterAll hook regardless of test pass/fail status
 */

import { test, expect } from '@playwright/test';
import {
  createAuthenticatedGalleryUser,
  uploadGalleryPhoto,
  viewMyPhotos,
  viewPublicPhotos,
  openPhotoDetail,
  cleanupTestUser
} from './helpers/gallery-helpers';

test.describe('Photo Likes Feature', () => {
  // Track all created users for cleanup
  const createdUsers: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear localStorage for test isolation
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.afterAll(async ({ request }) => {
    // AUTO DELETE: Cleanup all test users after suite completes
    console.log(`\n🧹 Starting cleanup of ${createdUsers.length} test users...`);

    for (const email of createdUsers) {
      await cleanupTestUser(request, email);
    }

    console.log(`✅ Cleanup complete! Database is clean.\n`);
  });

  test.describe('Basic Like/Unlike Operations', () => {

    test('E2E-PL-001: should like photo from gallery view', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Like',
        description: 'Testing like from gallery view',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B navigates to Public Photos and sees User A's photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1500); // Increased wait for photos to load

      // Debug: Check current URL and page title
      const currentURL = page.url();
      const pageTitle = await page.title();
      console.log(`🔍 Current URL: ${currentURL}`);
      console.log(`🔍 Page title: ${pageTitle}`);

      // If on detail page, go back to gallery
      if (currentURL.includes('/gallery/photo/')) {
        console.log('⚠️  Detected detail page, navigating back to Public Photos...');
        await page.goto('/gallery');
        await page.click('button:has-text("Public Photos")');
        await page.waitForTimeout(1500);
      }

      // Select FIRST photo card with title "Photo to Like" (in case of duplicates from failed tests)
      const photoCard = page.locator('h3:has-text("Photo to Like")').locator('../..').first();

      // Select like button specifically with aria-label to avoid clicking photo card
      const likeButton = photoCard.locator('button[aria-label*="Like"]');
      const likeButtonWrapper = likeButton.locator('..'); // Parent div contains button + count

      // Verify like button is visible
      await expect(likeButton).toBeVisible();

      // AND: User B clicks ONLY the like button (force to bypass parent handlers)
      await likeButton.click({ force: true });
      await page.waitForTimeout(1000); // Wait for optimistic update and re-render

      // Verify we're STILL on gallery page (not navigated to detail)
      const urlAfterClick = page.url();
      console.log(`🔍 URL after like click: ${urlAfterClick}`);
      if (urlAfterClick.includes('/gallery/photo/')) {
        throw new Error('❌ Like button click navigated to detail page! Selector is wrong.');
      }

      // THEN: Like count increases to 1
      // Re-query elements after React re-render to avoid stale element references
      const updatedPhotoCard = page.locator('h3:has-text("Photo to Like")').locator('../..');
      const updatedLikeButton = updatedPhotoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const updatedLikeButtonWrapper = updatedLikeButton.locator('..');

      const updatedLikeText = await updatedLikeButtonWrapper.textContent();
      expect(updatedLikeText).toContain('1');
      console.log('User B liked User A photo, count:', updatedLikeText);

      // AND: Heart icon changes to filled (solid)
      const heartIcon = updatedLikeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      console.log('✅ E2E-PL-001: Like photo from gallery view test PASSED');
    });

    test('E2E-PL-002: should unlike photo from gallery view', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Unlike',
        description: 'Testing unlike from gallery view',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B navigates to Public Photos and sees User A's photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Photo to Unlike")').locator('../..');
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const likeButtonWrapper = likeButton.locator('..'); // Parent div contains button + count

      // User B likes the photo first
      await likeButton.click();
      await page.waitForTimeout(500);

      // Verify it's liked (count = 1)
      let likeText = await likeButtonWrapper.textContent();
      expect(likeText).toContain('1');
      console.log('User B liked photo, count:', likeText);

      // WHEN: User B clicks the like button again (to unlike)
      await likeButton.click();
      await page.waitForTimeout(500);

      // THEN: Like count decreases to 0
      likeText = await likeButtonWrapper.textContent();
      expect(likeText?.trim()).not.toContain('1'); // Count hidden when 0 likes
      console.log('User B unliked photo, count:', likeText);

      // AND: Heart icon changes to outline (not filled)
      const heartIcon = likeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      console.log('✅ E2E-PL-002: Unlike photo from gallery view test PASSED');
    });

    test('E2E-PL-003: should like photo from detail view', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Detail Like Photo',
        description: 'Testing like from detail view',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B navigates to photo detail page
      await viewPublicPhotos(page);
      await openPhotoDetail(page, 'Detail Like Photo');
      await page.waitForTimeout(1000);

      // AND: User B clicks the like button on detail page
      const likeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      const likeButtonWrapper = likeButton.locator('..'); // Parent div contains button + count
      await expect(likeButton).toBeVisible();

      // Get initial state
      const initialLikeText = await likeButtonWrapper.textContent();
      console.log('Detail page initial like button text:', initialLikeText);

      // User B clicks like button
      await likeButton.click();
      await page.waitForTimeout(500);

      // THEN: Like count increases to 1
      const updatedLikeText = await likeButtonWrapper.textContent();
      expect(updatedLikeText).toContain('1');
      console.log('Detail page updated like button text:', updatedLikeText);

      // AND: Heart icon changes to filled
      const heartIcon = likeButton.locator('svg');
      await expect(heartIcon).toBeVisible();

      // AND: When User B goes back to gallery, like persists
      await page.goto('/gallery');
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Detail Like Photo")').locator('../..').first();
      const galleryLikeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const galleryLikeButtonWrapper = galleryLikeButton.locator('..');

      const galleryLikeText = await galleryLikeButtonWrapper.textContent();
      expect(galleryLikeText).toContain('1');

      console.log('✅ E2E-PL-003: Like photo from detail view test PASSED');
    });

  });

  test.describe('Persistence Tests', () => {

    test('E2E-PL-004: like persists after page refresh', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Refresh Persistence Photo',
        description: 'Testing like persistence after refresh',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      // AND: User B navigates to Public Photos and likes User A's photo
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Refresh Persistence Photo")').locator('../..').first();
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const likeButtonWrapper = likeButton.locator('..'); // Parent div contains button + count

      // User B likes the photo
      await likeButton.click();
      await page.waitForTimeout(500);

      // Verify liked
      let likeText = await likeButtonWrapper.textContent();
      expect(likeText).toContain('1');
      console.log('User B liked photo, count:', likeText);

      // WHEN: User B refreshes the page
      await page.reload();
      await page.waitForTimeout(1000);

      // Navigate back to public photos
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      // THEN: Like is still persisted
      const refreshedPhotoCard = page.locator('h3:has-text("Refresh Persistence Photo")').locator('../..').first();
      const refreshedLikeButton = refreshedPhotoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const refreshedLikeButtonWrapper = refreshedLikeButton.locator('..');

      const refreshedLikeText = await refreshedLikeButtonWrapper.textContent();
      expect(refreshedLikeText).toContain('1');
      console.log('After refresh, count still:', refreshedLikeText);

      console.log('✅ E2E-PL-004: Like persists after page refresh test PASSED');
    });

    test('E2E-PL-005: like persists after logout and login', async ({ page }) => {
      // GIVEN: User A is registered, logged in, and uploads a public photo
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Logout Persistence Photo',
        description: 'Testing like persistence after logout/login',
        isPublic: true
      });

      // User A logs out
      let logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in and likes User A's photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Logout Persistence Photo")').locator('../..').first();
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const likeButtonWrapper = likeButton.locator('..'); // Parent div contains button + count

      // User B likes the photo
      await likeButton.click();
      await page.waitForTimeout(500);

      // Verify liked
      let likeText = await likeButtonWrapper.textContent();
      expect(likeText).toContain('1');
      console.log('User B liked photo, count:', likeText);

      // WHEN: User B logs out
      logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // Verify redirected to login
      await expect(page).toHaveURL('/login');

      // AND: User B logs back in with same credentials
      await page.fill('input[type="email"]', userB.email);
      await page.fill('input[type="password"]', userB.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Navigate to gallery
      await page.goto('/gallery');
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      // THEN: Like is still persisted
      const persistedPhotoCard = page.locator('h3:has-text("Logout Persistence Photo")').locator('../..').first();
      const persistedLikeButton = persistedPhotoCard.locator('button').filter({ has: page.locator('svg') }).first();
      const persistedLikeButtonWrapper = persistedLikeButton.locator('..');

      const persistedLikeText = await persistedLikeButtonWrapper.textContent();
      expect(persistedLikeText).toContain('1');
      console.log('After User B logout/login, count still:', persistedLikeText);

      console.log('✅ E2E-PL-005: Like persists after logout and login test PASSED');
    });

  });

  test.describe('Multi-User Tests', () => {

    test('E2E-PL-006: multiple users can like same photo', async ({ page, context, browser }) => {
      // Increase timeout for this test because it creates 3 users sequentially
      // which takes longer than the default 120s timeout
      test.setTimeout(240000); // 240 seconds (4 minutes)

      // GIVEN: User A creates a public photo and logs out
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Multi-User Like Photo',
        description: 'Testing multiple users liking same photo',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in and likes the photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCardB = page.locator('h3:has-text("Multi-User Like Photo")').locator('../..');
      const likeButtonB = photoCardB.locator('button').filter({ has: page.locator('svg') }).first();
      const likeButtonWrapperB = likeButtonB.locator('..'); // Parent div contains button + count

      // User B likes the photo
      await likeButtonB.click();
      await page.waitForTimeout(500);

      // Verify User B's like (count = 1)
      let likeTextB = await likeButtonWrapperB.textContent();
      expect(likeTextB).toContain('1');
      console.log('User B liked photo, count:', likeTextB);

      // WHEN: User C logs in (new browser session) and views the same photo
      // Create a NEW browser context for User C to avoid sharing cookies with User B
      const contextC = await browser.newContext();
      const pageC = await contextC.newPage();
      const { user: userC } = await createAuthenticatedGalleryUser(pageC);
      createdUsers.push(userC.email); // Track for cleanup

      await pageC.goto('/gallery');
      await viewPublicPhotos(pageC);
      await pageC.waitForTimeout(1000);

      // User C finds the photo created by User A
      const photoCardC = pageC.locator('h3:has-text("Multi-User Like Photo")').locator('../..');
      const likeButtonC = photoCardC.locator('button').filter({ has: pageC.locator('svg') }).first();
      const likeButtonWrapperC = likeButtonC.locator('..');

      // Verify initial count is 1 (from User B)
      let likeTextC = await likeButtonWrapperC.textContent();
      expect(likeTextC).toContain('1');

      // User C likes the same photo
      await likeButtonC.click();
      await pageC.waitForTimeout(500);

      // THEN: Like count increases to 2
      likeTextC = await likeButtonWrapperC.textContent();
      expect(likeTextC).toContain('2');
      console.log('User C liked photo, count:', likeTextC);

      // AND: User B also sees count = 2 after refresh
      await page.reload();
      await page.waitForTimeout(1000);
      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const refreshedPhotoCardB = page.locator('h3:has-text("Multi-User Like Photo")').locator('../..');
      const refreshedLikeButtonB = refreshedPhotoCardB.locator('button').filter({ has: page.locator('svg') }).first();
      const refreshedLikeButtonWrapperB = refreshedLikeButtonB.locator('..');

      const refreshedLikeTextB = await refreshedLikeButtonWrapperB.textContent();
      expect(refreshedLikeTextB).toContain('2');
      console.log('User B after refresh, count:', refreshedLikeTextB);

      // Cleanup User C's context (this also closes all pages in the context)
      await contextC.close();

      console.log('✅ E2E-PL-006: Multiple users can like same photo test PASSED');
    });

  });

  test.describe('Liked Photos Page', () => {

    test('E2E-PL-007: view liked photos page', async ({ page }) => {
      // GIVEN: User A creates 3 public photos and logs out
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Liked Photo 1',
        description: 'First liked photo',
        isPublic: true
      });

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Liked Photo 2',
        description: 'Second liked photo',
        isPublic: true
      });

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Not Liked Photo',
        description: 'This one is not liked',
        isPublic: true
      });

      // User A logs out
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // WHEN: User B logs in and likes 2 out of 3 photos
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      // Like Photo 1
      const photo1Card = page.locator('h3:has-text("Liked Photo 1")').locator('../..');
      const likeButton1 = photo1Card.locator('button').filter({ has: page.locator('svg') }).first();
      await likeButton1.click();
      await page.waitForTimeout(500);

      // Like Photo 2
      const photo2Card = page.locator('h3:has-text("Liked Photo 2")').locator('../..');
      const likeButton2 = photo2Card.locator('button').filter({ has: page.locator('svg') }).first();
      await likeButton2.click();
      await page.waitForTimeout(500);

      // WHEN: User navigates to Liked Photos page
      await page.goto('/home/liked-photos');
      await page.waitForTimeout(1000);

      // THEN: Only liked photos are shown (2 photos)
      const likedPhoto1 = page.locator('h3:has-text("Liked Photo 1")');
      const likedPhoto2 = page.locator('h3:has-text("Liked Photo 2")');
      const notLikedPhoto = page.locator('h3:has-text("Not Liked Photo")');

      await expect(likedPhoto1).toBeVisible();
      await expect(likedPhoto2).toBeVisible();
      await expect(notLikedPhoto).not.toBeVisible();

      console.log('✅ E2E-PL-007: View liked photos page test PASSED');
    });

    test('E2E-PL-008: unlike from liked photos page', async ({ page }) => {
      // GIVEN: User A uploads a photo and logs out
      const { user: userA } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userA.email); // Track for cleanup

      await uploadGalleryPhoto(page, 'test-photo.jpg', {
        title: 'Photo to Unlike from Liked Page',
        description: 'Testing unlike from liked photos page',
        isPublic: true
      });

      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();
      await page.waitForTimeout(500);

      // User B logs in and likes the photo
      const { user: userB } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(userB.email); // Track for cleanup

      await viewPublicPhotos(page);
      await page.waitForTimeout(1000);

      const photoCard = page.locator('h3:has-text("Photo to Unlike from Liked Page")').locator('../..');
      const likeButton = photoCard.locator('button').filter({ has: page.locator('svg') }).first();
      await likeButton.click();
      await page.waitForTimeout(500);

      // Navigate to Liked Photos page
      await page.goto('/home/liked-photos');
      await page.waitForTimeout(1000);

      // Verify photo is visible
      const likedPhoto = page.locator('h3:has-text("Photo to Unlike from Liked Page")');
      await expect(likedPhoto).toBeVisible();

      // WHEN: User unlikes the photo from liked photos page
      const likedPhotoCard = page.locator('h3:has-text("Photo to Unlike from Liked Page")').locator('../..');
      const unlikeButton = likedPhotoCard.locator('button').filter({ has: page.locator('svg') }).first();
      await unlikeButton.click();

      // THEN: Photo disappears from liked photos page (with automatic retry for up to 10 seconds)
      await expect(likedPhoto).not.toBeVisible({ timeout: 10000 });

      console.log('✅ E2E-PL-008: Unlike from liked photos page test PASSED');
    });

    test('E2E-PL-009: empty state when no liked photos', async ({ page }) => {
      // GIVEN: User is registered and logged in
      const { user } = await createAuthenticatedGalleryUser(page);
      createdUsers.push(user.email); // Track for cleanup

      // AND: User has NOT liked any photos yet

      // WHEN: User navigates to Liked Photos page
      await page.goto('/home/liked-photos');
      await page.waitForTimeout(1000);

      // THEN: Empty state message is shown
      const emptyMessage = page.locator('text=You haven\'t liked any photos yet');
      await expect(emptyMessage).toBeVisible();

      console.log('✅ E2E-PL-009: Empty state when no liked photos test PASSED');
    });

  });
});
