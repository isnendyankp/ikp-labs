# 🎭 End-to-End (E2E) Testing Guide

**Playwright-native browser automation tests** using TypeScript.

## Overview

E2E tests simulate real user interactions in a browser environment, testing the complete flow from frontend to backend. These tests use **Playwright** with **TypeScript** for maximum developer productivity.

## 🚀 Quick Start

### Prerequisites

**Both servers must be running:**

```bash
# Terminal 1: Backend (port 8081)
cd backend/ikp-labs-api
mvn spring-boot:run

# Terminal 2: Frontend (port 3002)
cd frontend
npm run dev
```

### Run E2E Tests

```bash
# Run all E2E tests
npx playwright test tests/e2e/

# Run specific test file
npx playwright test tests/e2e/gallery.spec.ts
npx playwright test tests/e2e/photo-likes.spec.ts

# Run in headed mode (see browser)
npx playwright test tests/e2e/ --headed

# Run in debug mode
npx playwright test tests/e2e/ --debug

# Run in UI mode (interactive)
npx playwright test tests/e2e/ --ui
```

### Run by Browser

```bash
# Chromium only
npx playwright test tests/e2e/ --project=chromium

# Firefox only
npx playwright test tests/e2e/ --project=firefox

# WebKit (Safari) only
npx playwright test tests/e2e/ --project=webkit

# All browsers
npx playwright test tests/e2e/ --project=chromium --project=firefox --project=webkit
```

## 📋 Test Files

### Core Authentication

**[login.spec.ts](login.spec.ts)** - Login flow tests
- ✅ Successful login with valid credentials
- ✅ Failed login with invalid password
- ✅ Failed login with non-existent email
- ✅ Email validation (frontend)
- ✅ Empty form submission
- ✅ CORS configuration

**[registration.spec.ts](registration.spec.ts)** - Registration flow tests
- ✅ Successful registration
- ✅ Duplicate email validation
- ✅ Password strength requirements
- ✅ Form validation errors
- ✅ Database persistence checks

**[registration-with-tracker.spec.ts](registration-with-tracker.spec.ts)** - Registration with Test Plan Tracker
- ✅ Smart test user cleanup
- ✅ Test plan progress tracking
- ✅ Failed test data preservation

**[auth-flow.spec.ts](auth-flow.spec.ts)** - Complete authentication flow
- ✅ End-to-end registration → login → logout flow
- ✅ Session management
- ✅ JWT token handling

### Gallery & Photo Features

**[gallery.spec.ts](gallery.spec.ts)** - Photo gallery tests (Week 12)
- ✅ Gallery page loads with photos
- ✅ Pagination works correctly
- ✅ Photo detail view
- ✅ Photo upload functionality
- ✅ Delete own photos
- ✅ Cannot delete others' photos
- ✅ Responsive design verification

**[photo-likes.spec.ts](photo-likes.spec.ts)** - Photo likes feature (Week 13)
- ✅ Like/unlike other users' photos
- ✅ Cannot like own photos
- ✅ Like count updates correctly
- ✅ Liked photos page shows user's liked photos
- ✅ Optimistic UI updates
- ✅ Multi-user testing (User A likes User B's photo)
- ✅ Pagination on liked photos page

**[profile-picture.spec.ts](profile-picture.spec.ts)** - Profile picture tests
- ✅ Upload profile picture
- ✅ Update existing profile picture
- ✅ Delete profile picture
- ✅ Image validation
- ✅ Display in navbar

**[photo-favorites.spec.ts](photo-favorites.spec.ts)** - Photo favorites feature
- ✅ Favorite/unfavorite other users' photos
- ✅ Cannot favorite own photos
- ✅ Favorite count updates correctly
- ✅ Favorited photos page shows user's favorited photos
- ✅ Multi-user testing
- ✅ Pagination on favorited photos page

**[gallery-sorting.spec.ts](gallery-sorting.spec.ts)** - Gallery sorting & filtering
- ✅ Sort by newest/oldest
- ✅ Sort by most liked/favorited
- ✅ Filter by all/my-photos/liked/favorited
- ✅ Sort/filter state preservation (bug fix)

### UX-Specific Tests

**[ux-validation.spec.ts](ux-validation.spec.ts)** - Form Validation UX
- ✅ Email format validation on blur
- ✅ Password strength validation on blur
- ✅ Success messages for valid input
- ✅ Error message clearing on type
- ✅ Validation on submit
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Error icons with messages
- ✅ Success icons with messages

**[ux-confirmations.spec.ts](ux-confirmations.spec.ts)** - Confirmation Dialogs
- ✅ Delete confirmation appears before action
- ✅ Cancel button closes dialog
- ✅ ESC key closes dialog
- ✅ Click outside closes dialog
- ✅ Confirm button executes action
- ✅ Focus trap within dialog
- ✅ Proper ARIA attributes

**[ux-empty-states.spec.ts](ux-empty-states.spec.ts)** - Empty State UX
- ✅ Empty gallery shows helpful message
- ✅ Empty liked photos with CTA
- ✅ Empty favorited photos with CTA
- ✅ Empty state component structure
- ✅ Transition from empty to populated
- ✅ Empty state disappears when photos exist

**[ux-story-journey.spec.ts](ux-story-journey.spec.ts)** - UX Story Journey (LinkedIn Demo)
- ✅ Register new account
- ✅ Gallery shows photos from ALL users
- ✅ Change sort from "Newest First" to "Oldest First"
- ✅ Navigate to upload page (but don't upload)
- ✅ Click back - sort preserved (bug fix!)

### Demo & Utilities

**[demo-screenshot-capture.spec.ts](demo-screenshot-capture.spec.ts)** - Screenshot testing demo
- Shows how to capture screenshots during tests
- Useful for visual regression testing

**[demo-video-recording.spec.ts](demo-video-recording.spec.ts)** - Video recording demo
- Shows how to record videos of test runs
- Useful for debugging failed tests

## 📁 Helpers

**[helpers/](helpers/)** - Reusable test utilities
- Test data generators
- Common page actions
- Authentication helpers
- Database cleanup utilities

## 📝 Writing New E2E Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/test-users';

test.describe('My Feature Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to the page
    await page.goto('http://localhost:3002/my-page');
    await page.waitForLoadState('networkidle');
  });

  test('should perform user action', async ({ page }) => {
    // Step 1: Fill form
    await page.fill('[name="email"]', testUsers.validUser.email);
    await page.fill('[name="password"]', testUsers.validUser.password);

    // Step 2: Submit
    await page.click('button[type="submit"]');

    // Step 3: Verify result
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Clear localStorage, logout, etc.
    await page.evaluate(() => localStorage.clear());
  });

});
```

### Multi-User Testing

For features involving multiple users (e.g., likes, comments):

```typescript
import { test, expect } from '@playwright/test';

test('User A likes User B photo', async ({ browser }) => {
  // Create two browser contexts (two separate users)
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();

  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  try {
    // User A: Login
    await pageA.goto('http://localhost:3002/login');
    await pageA.fill('[name="email"]', 'usera@example.com');
    await pageA.fill('[name="password"]', 'Password123!');
    await pageA.click('button[type="submit"]');

    // User B: Login
    await pageB.goto('http://localhost:3002/login');
    await pageB.fill('[name="email"]', 'userb@example.com');
    await pageB.fill('[name="password"]', 'Password123!');
    await pageB.click('button[type="submit"]');

    // User A: Like User B's photo
    await pageA.goto('http://localhost:3002/gallery');
    const photoCard = pageA.locator('[data-testid^="photo-card-"]').first();
    await photoCard.locator('[data-testid="like-button"]').click();

    // Verify like count updated
    await expect(photoCard.locator('[data-testid="like-count"]')).toContainText('1');

  } finally {
    await contextA.close();
    await contextB.close();
  }
});
```

## 🎯 Best Practices

### 1. Use Reliable Selectors

**Prefer `data-testid` attributes:**
```typescript
// ✅ GOOD: Stable, semantic selector
await page.click('[data-testid="submit-button"]');

// ❌ BAD: Brittle, implementation-dependent
await page.click('.btn.btn-primary.mt-4');
```

### 2. Wait for Network Idle

```typescript
// ✅ GOOD: Wait for network requests to complete
await page.goto('http://localhost:3002/gallery');
await page.waitForLoadState('networkidle');

// ❌ BAD: Race conditions
await page.goto('http://localhost:3002/gallery');
await page.click('button'); // Might click before page loads
```

### 3. Use Assertions Wisely

```typescript
// ✅ GOOD: Wait for element to appear
await expect(page.locator('.success')).toBeVisible();

// ❌ BAD: Doesn't wait
expect(await page.locator('.success').isVisible()).toBe(true);
```

### 4. Clean Up After Tests

```typescript
test.afterEach(async ({ page, request }) => {
  // Clear browser state
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Delete test data (if using Test Admin API)
  await request.delete(`http://localhost:8081/api/test-admin/users/${testEmail}`);
});
```

### 5. Test Isolation

```typescript
// ✅ GOOD: Each test is independent
test('test 1', async ({ page }) => {
  // Setup, test, cleanup - all contained
});

test('test 2', async ({ page }) => {
  // Does NOT depend on test 1
});

// ❌ BAD: Tests depend on each other
test('test 1', async ({ page }) => {
  // Creates user
});

test('test 2', async ({ page }) => {
  // Assumes user from test 1 exists
});
```

## 🐛 Debugging Tips

### 1. Run in Headed Mode

See the browser as tests run:
```bash
npx playwright test tests/e2e/gallery.spec.ts --headed
```

### 2. Use Debug Mode

Step through tests line by line:
```bash
npx playwright test tests/e2e/gallery.spec.ts --debug
```

### 3. Add Console Logs

```typescript
test('my test', async ({ page }) => {
  console.log('🔍 Starting test...');

  await page.goto('http://localhost:3002/gallery');
  console.log('✅ Navigated to gallery');

  const photoCount = await page.locator('[data-testid^="photo-card-"]').count();
  console.log(`📊 Found ${photoCount} photos`);
});
```

### 4. Take Screenshots on Failure

```typescript
test('my test', async ({ page }) => {
  try {
    // Test logic
  } catch (error) {
    await page.screenshot({ path: `error-${Date.now()}.png` });
    throw error;
  }
});
```

### 5. Use Playwright Inspector

Opens interactive debugger:
```bash
npx playwright test tests/e2e/gallery.spec.ts --debug
```

## 📊 Test Reports

### HTML Report

```bash
# Run tests
npx playwright test tests/e2e/

# Open HTML report
npx playwright show-report
```

### Trace Viewer

```bash
# Run with trace
npx playwright test tests/e2e/ --trace on

# View trace
npx playwright show-trace
```

## 🔗 Related Documentation

- [Main Testing Guide](../README.md) - Overview of all test types
- [API Testing Guide](../api/README.md) - Backend contract tests
- [Gherkin/BDD Guide](../gherkin/README.md) - Business-friendly specs
- [Playwright Documentation](https://playwright.dev) - Official docs
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - Tips & tricks

## 🆘 Common Issues

### Issue: "Navigation timeout exceeded"

**Cause:** Frontend/backend not running or wrong port

**Solution:**
```bash
# Check frontend is running on port 3002
curl http://localhost:3002

# Check backend is running on port 8081
curl http://localhost:8081/api/health
```

### Issue: "Element not found"

**Cause:** Element not loaded yet or wrong selector

**Solution:**
```typescript
// Add explicit wait
await page.waitForSelector('[data-testid="my-element"]');

// Or use expect with auto-retry
await expect(page.locator('[data-testid="my-element"]')).toBeVisible();
```

### Issue: "Tests pass locally but fail in CI"

**Cause:** Timing issues or missing waits

**Solution:**
```typescript
// Always wait for network idle
await page.goto('http://localhost:3002/page');
await page.waitForLoadState('networkidle');

// Increase timeout for CI environments
test.setTimeout(60000); // 60 seconds
```

---

**Happy Testing! 🎭**

For questions or issues, check the [main testing guide](../README.md) or refer to [Playwright documentation](https://playwright.dev).
