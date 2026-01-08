# Skill: Playwright Testing Patterns

**Category**: Testing
**Purpose**: Best practices for Playwright E2E testing
**Used By**: test-validator, gherkin-spec-writer

---

## Overview

This skill defines **comprehensive Playwright E2E testing patterns** for the IKP-Labs project. Playwright is a modern, reliable, and fast end-to-end testing framework that verifies complete user workflows from browser to backend.

**What is Playwright?**

Playwright is a Node.js library for automating Chromium, Firefox, and WebKit browsers. It provides:
- **Auto-wait**: Automatically waits for elements to be ready
- **Multi-browser**: Test across Chrome, Firefox, Safari
- **Fast execution**: Parallel test execution
- **Debugging tools**: Screenshots, videos, trace viewer
- **Reliable selectors**: Built-in smart retry logic

**When to Use Playwright:**
- ✅ Testing complete user workflows (login → navigate → action → verify)
- ✅ Testing UI interactions (clicks, form inputs, dropdowns)
- ✅ Testing cross-page navigation
- ✅ Testing responsive behavior
- ✅ Verifying data persistence (create data → refresh → verify still there)

**When NOT to Use Playwright:**
- ❌ Testing individual functions (use unit tests)
- ❌ Testing API logic (use integration tests)
- ❌ Testing every edge case (too slow, use unit tests)
- ❌ Testing non-critical paths (focus on happy paths and critical journeys)

**IKP-Labs Setup:**
```bash
# Location: frontend/tests/
# Config: frontend/playwright.config.ts
# Run: npm run test:e2e
```

---

## Core Concepts

### 1. Locators

**Locators** are Playwright's way of finding elements on the page. They auto-wait and retry until elements are ready.

**Recommended Selector Priority:**

| Priority | Selector Type | Example | Use Case |
|----------|--------------|---------|----------|
| **1 (Best)** | Role | `page.getByRole('button', { name: 'Submit' })` | Semantic, accessible |
| **2** | Label | `page.getByLabel('Email')` | Form inputs with labels |
| **3** | Placeholder | `page.getByPlaceholder('Enter email')` | Inputs with placeholders |
| **4** | Text | `page.getByText('Welcome')` | Text content |
| **5** | Test ID | `page.getByTestId('submit-btn')` | Custom data-testid attributes |
| **6 (Last Resort)** | CSS/XPath | `page.locator('.btn-primary')` | When nothing else works |

**Good Selector Examples:**

```typescript
// ✅ GOOD: Semantic, accessible, resilient to refactoring
await page.getByRole('button', { name: /submit/i }); // Case-insensitive regex
await page.getByLabel('Email address');
await page.getByPlaceholder('Search photos...');
await page.getByText('Photo uploaded successfully');
await page.getByTestId('gallery-sort-dropdown');

// ❌ BAD: Fragile, breaks on refactoring
await page.locator('.css-abc123 > div:nth-child(2)');
await page.locator('button.MuiButton-root.MuiButton-contained');
await page.locator('//div[@class="container"]/button[1]');
```

**Why Semantic Selectors Matter:**

```typescript
// Example: Button text changes from "Submit" to "Send"

// ✅ This still works (role-based)
await page.getByRole('button', { name: /submit|send/i });

// ❌ This breaks (text-based)
await page.getByText('Submit').click(); // Fails when text changes
```

---

### 2. Actions

**Actions** are interactions with elements (click, type, select, etc.). Playwright auto-waits for actionability before performing actions.

**Common Actions:**

```typescript
// Click
await page.getByRole('button', { name: 'Login' }).click();

// Fill input (clears first, then types)
await page.getByLabel('Email').fill('test@example.com');

// Type (types character by character, useful for testing autocomplete)
await page.getByLabel('Search').type('sunset', { delay: 100 });

// Select dropdown
await page.getByLabel('Sort by').selectOption('mostLiked');

// Check/uncheck checkbox
await page.getByLabel('Remember me').check();
await page.getByLabel('Remember me').uncheck();

// Upload file
await page.getByLabel('Upload photo').setInputFiles('/path/to/photo.jpg');

// Hover
await page.getByRole('button', { name: 'More' }).hover();

// Double click
await page.getByText('Editable text').dblclick();

// Right click
await page.getByText('Context menu').click({ button: 'right' });
```

**Actionability Checks (Automatic):**

Before performing an action, Playwright automatically verifies:
- ✅ Element is visible
- ✅ Element is stable (not animating)
- ✅ Element receives events (not covered by another element)
- ✅ Element is enabled (not disabled)

---

### 3. Assertions

**Assertions** verify expected outcomes. Use Playwright's `expect` for auto-retry assertions.

**Common Assertions:**

```typescript
// Visibility
await expect(page.getByText('Success')).toBeVisible();
await expect(page.getByText('Error')).toBeHidden();

// Text content
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByTestId('username')).toContainText('John');

// Value (for inputs)
await expect(page.getByLabel('Email')).toHaveValue('test@example.com');

// Attribute
await expect(page.getByRole('link')).toHaveAttribute('href', '/gallery');

// Count
await expect(page.getByTestId('photo-card')).toHaveCount(12);

// URL
await expect(page).toHaveURL(/\/gallery\?sortBy=mostLiked/);
await expect(page).toHaveTitle('Gallery - IKP Labs');

// Disabled/Enabled
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// Checked
await expect(page.getByLabel('Remember me')).toBeChecked();
```

**Why Use `await expect()` Instead of Regular `expect()`?**

```typescript
// ❌ BAD: No auto-retry, flaky
const text = await page.getByText('Loading...').textContent();
expect(text).toBe('Loaded'); // Fails if still loading

// ✅ GOOD: Auto-retries for 5 seconds
await expect(page.getByText('Loaded')).toBeVisible(); // Waits until visible
```

---

## Best Practices

### 1. Use Auto-Waiting (Don't Use Fixed Timeouts)

Playwright auto-waits for elements to be ready. Avoid manual timeouts.

**❌ BAD: Fixed timeout**
```typescript
await page.click('#submit-button');
await page.waitForTimeout(3000); // Brittle, flaky
expect(await page.locator('.success-message').isVisible()).toBe(true);
```

**✅ GOOD: Wait for condition**
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Success')).toBeVisible(); // Auto-waits up to 5s
```

---

### 2. Use data-testid for Complex Selectors

When semantic selectors don't work, add `data-testid` attributes.

**Add to Component:**
```tsx
// File: frontend/src/components/GalleryCard.tsx

export function GalleryCard({ photo }) {
  return (
    <div data-testid="photo-card" data-photo-id={photo.id}>
      <img src={photo.url} alt={photo.title} />
      <button data-testid="like-button">Like ({photo.likeCount})</button>
    </div>
  );
}
```

**Use in Test:**
```typescript
// File: frontend/tests/gallery.spec.ts

await page.getByTestId('photo-card').first().getByTestId('like-button').click();
await expect(page.getByTestId('photo-card').first()).toContainText('Like (1)');
```

---

### 3. Use Page Object Model (POM)

Encapsulate page logic in reusable classes to reduce duplication and improve maintainability.

**Without POM (Duplication):**
```typescript
// gallery.spec.ts
test('login and view gallery', async ({ page }) => {
  await page.goto('http://localhost:3002/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');
  await page.goto('http://localhost:3002/gallery');
});

// sorting.spec.ts
test('login and sort photos', async ({ page }) => {
  await page.goto('http://localhost:3002/login');
  await page.getByLabel('Email').fill('test@example.com'); // Duplicated!
  await page.getByLabel('Password').fill('password123'); // Duplicated!
  await page.getByRole('button', { name: 'Login' }).click(); // Duplicated!
  await page.waitForURL('**/dashboard');
  // ...
});
```

**With POM (Reusable):**
```typescript
// File: frontend/tests/pages/LoginPage.ts

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3002/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL('**/dashboard');
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}

// File: frontend/tests/pages/GalleryPage.ts

export class GalleryPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3002/gallery');
  }

  async sortBy(option: 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited') {
    await this.page.getByLabel('Sort by').selectOption(option);
  }

  async expectPhotoCount(count: number) {
    await expect(this.page.getByTestId('photo-card')).toHaveCount(count);
  }

  async likeFirstPhoto() {
    await this.page.getByTestId('photo-card').first().getByTestId('like-button').click();
  }
}

// File: frontend/tests/gallery.spec.ts (Clean!)

import { LoginPage } from './pages/LoginPage';
import { GalleryPage } from './pages/GalleryPage';

test('login and view gallery', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const galleryPage = new GalleryPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');

  await galleryPage.goto();
  await galleryPage.expectPhotoCount(12);
});

test('sort photos by most liked', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const galleryPage = new GalleryPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');

  await galleryPage.goto();
  await galleryPage.sortBy('mostLiked');
  await expect(page).toHaveURL(/sortBy=mostLiked/);
});
```

**Benefits of POM:**
- ✅ **DRY**: No code duplication
- ✅ **Maintainable**: Change once, update everywhere
- ✅ **Readable**: Tests read like English
- ✅ **Reusable**: Share logic across tests

---

### 4. Use Fixtures for Common Setup

Playwright fixtures allow you to set up common state before tests.

**Custom Fixture:**
```typescript
// File: frontend/tests/fixtures.ts

import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type Fixtures = {
  authenticatedPage: Page; // Logged-in page
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login before test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');

    // Provide authenticated page to test
    await use(page);

    // Teardown: (optional cleanup)
  },
});

export { expect } from '@playwright/test';
```

**Use Fixture in Tests:**
```typescript
// File: frontend/tests/gallery.spec.ts

import { test, expect } from './fixtures'; // Use custom test
import { GalleryPage } from './pages/GalleryPage';

test('view gallery as authenticated user', async ({ authenticatedPage }) => {
  // Already logged in!
  const galleryPage = new GalleryPage(authenticatedPage);

  await galleryPage.goto();
  await galleryPage.expectPhotoCount(12);
});
```

---

### 5. Organize Tests with describe() and beforeEach()

Structure tests logically with grouping and setup hooks.

**Good Test Organization:**
```typescript
// File: frontend/tests/gallery-sorting.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Gallery Photo Sorting', () => {
  // Runs before EACH test in this describe block
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3002/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/dashboard');

    // Navigate to gallery
    await page.goto('http://localhost:3002/gallery');
    await page.waitForSelector('[data-testid="photo-card"]', { state: 'visible' });
  });

  test('should sort by newest first (default)', async ({ page }) => {
    await expect(page.getByLabel('Sort by')).toHaveValue('newest');
  });

  test('should sort by most liked', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption('mostLiked');
    await expect(page).toHaveURL(/sortBy=mostLiked/);
  });

  test('should sort by most favorited', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption('mostFavorited');
    await expect(page).toHaveURL(/sortBy=mostFavorited/);
  });
});

test.describe('Gallery Empty State', () => {
  test('should show empty message when no photos', async ({ page }) => {
    // ... test for empty state
  });
});
```

---

## Wait Strategies

Playwright auto-waits, but sometimes you need explicit waits.

### 1. Wait for Element State

```typescript
// Wait for visible (default for most actions)
await page.getByText('Success').waitFor({ state: 'visible' });

// Wait for hidden
await page.getByText('Loading...').waitFor({ state: 'hidden' });

// Wait for attached to DOM (may not be visible)
await page.getByTestId('dialog').waitFor({ state: 'attached' });

// Wait for detached from DOM
await page.getByTestId('dialog').waitFor({ state: 'detached' });
```

---

### 2. Wait for URL/Navigation

```typescript
// Wait for URL to match pattern
await page.waitForURL('**/gallery');
await page.waitForURL(/sortBy=mostLiked/);

// Wait for navigation to complete
await page.goto('http://localhost:3002/gallery', { waitUntil: 'networkidle' });

// Wait for specific response
await page.waitForResponse(response =>
  response.url().includes('/api/gallery/public') && response.status() === 200
);
```

---

### 3. Wait for Network Idle

```typescript
// Wait for all network requests to finish (useful after form submit)
await page.waitForLoadState('networkidle');

// Wait for DOM to be fully loaded
await page.waitForLoadState('domcontentloaded');
```

---

### 4. Wait for Function/Condition

```typescript
// Wait for custom condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.photo-card').length === 12;
});

// Wait for element count
await page.waitForFunction(
  count => document.querySelectorAll('.photo-card').length >= count,
  12
);
```

---

### 5. When to Use Each Wait

| Scenario | Wait Strategy |
|----------|--------------|
| Element appears after loading | `await expect(element).toBeVisible()` |
| Element disappears after action | `await expect(element).toBeHidden()` |
| Navigation after click | `await page.waitForURL(pattern)` |
| API call completes | `await page.waitForResponse(url)` |
| Multiple requests finish | `await page.waitForLoadState('networkidle')` |
| Custom condition | `await page.waitForFunction(() => ...)` |

---

## Common Pitfalls

### ❌ 1. Using Fixed Timeouts

**Bad:**
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // Flaky!
```

**Good:**
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Success')).toBeVisible();
```

---

### ❌ 2. Not Waiting for Navigation

**Bad:**
```typescript
await page.click('a[href="/gallery"]');
await page.getByTestId('photo-card').count(); // Race condition!
```

**Good:**
```typescript
await page.click('a[href="/gallery"]');
await page.waitForURL('**/gallery');
await expect(page.getByTestId('photo-card')).toHaveCount(12);
```

---

### ❌ 3. Using Brittle CSS Selectors

**Bad:**
```typescript
await page.locator('.MuiButton-root.MuiButton-containedPrimary').click();
```

**Good:**
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

---

### ❌ 4. Not Cleaning Up Test Data

**Bad:**
```typescript
test('upload photo', async ({ page }) => {
  await uploadPhoto('test.jpg');
  // Photo left in database forever!
});
```

**Good:**
```typescript
test('upload photo', async ({ page }) => {
  const photoId = await uploadPhoto('test.jpg');

  // Test logic...

  // Cleanup
  await deletePhoto(photoId);
});

// OR use afterEach hook
test.afterEach(async () => {
  await cleanupTestData();
});
```

---

### ❌ 5. Testing Implementation Details

**Bad:**
```typescript
// Testing internal React state
await expect(page.locator('[data-state="loading"]')).toBeVisible();
```

**Good:**
```typescript
// Testing user-visible behavior
await expect(page.getByText('Loading...')).toBeVisible();
```

---

### ❌ 6. Ignoring Flaky Tests

**Bad:**
```typescript
test('flaky test', async ({ page }) => {
  // Test fails randomly, mark as skip
  test.skip(); // ❌ Ignoring the problem
});
```

**Good:**
```typescript
test('fixed test', async ({ page }) => {
  // Identify root cause (race condition, timing issue)
  // Fix with proper waits
  await page.getByRole('button', { name: 'Load' }).click();
  await expect(page.getByText('Loaded')).toBeVisible(); // ✅ Proper wait
});
```

---

## Debugging Techniques

### 1. Screenshots

Automatically capture screenshots on failure:

```typescript
// File: playwright.config.ts

export default defineConfig({
  use: {
    screenshot: 'only-on-failure', // or 'on', 'off'
  },
});
```

Manual screenshots:
```typescript
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

---

### 2. Videos

Record videos of test execution:

```typescript
// File: playwright.config.ts

export default defineConfig({
  use: {
    video: 'retain-on-failure', // or 'on', 'off'
  },
});
```

---

### 3. Trace Viewer

Record detailed traces (network, DOM snapshots, console):

```typescript
// File: playwright.config.ts

export default defineConfig({
  use: {
    trace: 'retain-on-failure', // or 'on', 'off'
  },
});
```

View traces:
```bash
npx playwright show-trace trace.zip
```

---

### 4. Headed Mode (Watch Browser)

Run tests with visible browser:

```bash
npm run test:e2e -- --headed
```

---

### 5. Debug Mode (Step Through)

Run tests with debugger:

```bash
npm run test:e2e -- --debug
```

Or add `await page.pause()` in test:

```typescript
test('debug this test', async ({ page }) => {
  await page.goto('http://localhost:3002/gallery');
  await page.pause(); // Opens Playwright Inspector
  // Step through from here
});
```

---

### 6. Console Logs

Listen to browser console:

```typescript
page.on('console', msg => console.log('BROWSER:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err));
```

---

## Test Organization

### Recommended Structure

```
frontend/
├── tests/
│   ├── fixtures.ts              # Custom fixtures
│   ├── pages/                   # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── GalleryPage.ts
│   │   └── DashboardPage.ts
│   ├── helpers/                 # Test utilities
│   │   ├── testData.ts
│   │   └── cleanup.ts
│   ├── gallery-sorting.spec.ts  # Feature tests
│   ├── authentication.spec.ts
│   └── photo-upload.spec.ts
├── playwright.config.ts         # Playwright config
└── package.json
```

---

## Real Examples from IKP-Labs

### Example 1: Gallery Sorting Test (Actual Code)

```typescript
// File: frontend/tests/gallery-sorting.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Gallery Photo Sorting', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3002/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Navigate to gallery
    await page.goto('http://localhost:3002/gallery');
  });

  test('should display gallery page with photos', async ({ page }) => {
    await expect(page.locator('.photo-card')).toHaveCount(12, { timeout: 10000 });
  });

  test('should sort photos by most liked', async ({ page }) => {
    await page.selectOption('select[name="sortBy"]', 'mostLiked');
    await expect(page).toHaveURL(/sortBy=mostLiked/);

    // Verify first photo has highest likes
    const firstPhotoLikes = await page.locator('.photo-card').first()
      .locator('.like-count').textContent();
    const secondPhotoLikes = await page.locator('.photo-card').nth(1)
      .locator('.like-count').textContent();

    expect(parseInt(firstPhotoLikes || '0')).toBeGreaterThanOrEqual(
      parseInt(secondPhotoLikes || '0')
    );
  });

  test('should persist sort option after page reload', async ({ page }) => {
    await page.selectOption('select[name="sortBy"]', 'mostFavorited');
    await page.reload();
    await expect(page.locator('select[name="sortBy"]')).toHaveValue('mostFavorited');
  });
});
```

**What's Good:**
- ✅ Uses `beforeEach` for common setup
- ✅ Tests user-visible behavior (URL, sort order)
- ✅ Uses explicit waits (`toHaveCount` with timeout)
- ✅ Tests persistence (reload scenario)

**What Could Be Better:**
- ⚠️ Login logic duplicated (should use fixture or POM)
- ⚠️ CSS selectors (`.photo-card`) should use `data-testid`
- ⚠️ Should extract magic strings (`'test@example.com'`)

---

### Example 2: Refactored with POM

```typescript
// File: frontend/tests/pages/AuthFixture.ts

import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('http://localhost:3002/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

// File: frontend/tests/pages/GalleryPage.ts

export class GalleryPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3002/gallery');
    await this.page.waitForSelector('[data-testid="photo-card"]', { state: 'visible' });
  }

  async sortBy(option: string) {
    await this.page.getByLabel('Sort by').selectOption(option);
  }

  async getFirstPhotoLikes(): Promise<number> {
    const text = await this.page.getByTestId('photo-card').first()
      .getByTestId('like-count').textContent();
    return parseInt(text || '0');
  }

  async getPhotoCount(): Promise<number> {
    return await this.page.getByTestId('photo-card').count();
  }
}

// File: frontend/tests/gallery-sorting-improved.spec.ts

import { test, expect } from './pages/AuthFixture';
import { GalleryPage } from './pages/GalleryPage';

test.describe('Gallery Photo Sorting (Improved)', () => {
  let galleryPage: GalleryPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    galleryPage = new GalleryPage(authenticatedPage);
    await galleryPage.goto();
  });

  test('should display 12 photos', async () => {
    const count = await galleryPage.getPhotoCount();
    expect(count).toBe(12);
  });

  test('should sort by most liked', async ({ authenticatedPage }) => {
    await galleryPage.sortBy('mostLiked');
    await expect(authenticatedPage).toHaveURL(/sortBy=mostLiked/);
  });
});
```

**Improvements:**
- ✅ Login extracted to fixture (reusable)
- ✅ Gallery logic in POM (maintainable)
- ✅ Tests are concise and readable
- ✅ Uses semantic selectors (`getByLabel`, `getByRole`)

---

## Playwright vs Other Tools

| Feature | Playwright | Cypress | Selenium |
|---------|-----------|---------|----------|
| **Speed** | ⚡ Fast | ⚡ Fast | 🐢 Slow |
| **Auto-wait** | ✅ Yes | ✅ Yes | ❌ No |
| **Multi-browser** | ✅ Chrome, Firefox, Safari | ⚠️ Chrome only | ✅ All browsers |
| **Parallel execution** | ✅ Yes | ⚠️ Paid feature | ✅ Yes |
| **Network mocking** | ✅ Built-in | ✅ Built-in | ❌ No |
| **Screenshots/Videos** | ✅ Built-in | ✅ Built-in | ⚠️ Third-party |
| **Debugging** | ✅ Trace viewer | ✅ Time travel | ⚠️ Limited |

**Why IKP-Labs Uses Playwright:**
- ✅ Modern, actively developed (Microsoft)
- ✅ Fast and reliable
- ✅ Excellent debugging tools (trace viewer)
- ✅ Auto-wait reduces flaky tests
- ✅ Multi-browser support

---

## Checklist: Writing Good Playwright Tests

Before marking a Playwright test as "complete", verify:

- [ ] **Semantic Selectors**: Uses `getByRole`, `getByLabel`, or `data-testid` (not CSS)
- [ ] **No Fixed Timeouts**: Uses auto-wait or explicit waits (not `waitForTimeout`)
- [ ] **Proper Assertions**: Uses `await expect()` with auto-retry
- [ ] **Clean Setup**: Uses `beforeEach` or fixtures for common setup
- [ ] **Isolated Tests**: Each test can run independently
- [ ] **Test Data Cleanup**: Cleans up created data in `afterEach`
- [ ] **Descriptive Names**: Test names clearly describe what's being tested
- [ ] **No Flakiness**: Tests pass consistently (run 10 times, all pass)
- [ ] **Fast Execution**: Tests run in reasonable time (< 30s per test)
- [ ] **Documented Waits**: Complex waits have comments explaining why

---

## Related Skills

- **test__coverage-rules** - Overall testing standards and coverage requirements
- **wow__criticality-assessment** - For prioritizing which E2E tests to write

---

**Last Updated**: January 7, 2026
**Version**: 1.0
