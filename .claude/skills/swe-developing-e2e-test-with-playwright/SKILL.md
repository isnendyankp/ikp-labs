# Skill: E2E Testing with Playwright

**Category**: Testing
**Purpose**: Playwright E2E and API testing standards for IKP-Labs
**Used By**: swe-e2e-dev, test-maker, test-checker, test-fixer

---

## Project Test Structure

```text
IKP-Labs/
├── tests/
│   ├── e2e/          — browser E2E tests (*.spec.ts)
│   ├── api/          — API contract tests (*.spec.ts)
│   └── fixtures/     — shared test data and helpers
└── specs/            — Gherkin feature files
    ├── gallery/
    └── authentication/
```

Services must be running for E2E tests:

- Frontend: `http://localhost:3002`
- Backend: `http://localhost:8081`

---

## Selector Priority

Use selectors in this order (most to least preferred):

```typescript
// 1. Role-based (most accessible, most stable)
page.getByRole('button', { name: 'Upload Photo' })
page.getByRole('textbox', { name: 'Email' })

// 2. Label
page.getByLabel('Photo Title')

// 3. Text
page.getByText('No photos yet')

// 4. Test ID (explicit, stable)
page.getByTestId('photo-card-123')

// 5. CSS — last resort only
page.locator('.gallery-grid')
```

Add `data-testid` attributes to components when role/label is insufficient:

```tsx
<div data-testid={`photo-card-${photo.id}`}>
```

---

## Test Structure

### E2E Test

```typescript
// tests/e2e/gallery/gallery-view.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/gallery');
  });

  test('should display photo list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();
    await expect(page.getByTestId('photo-grid')).toBeVisible();
  });

  test('should show empty state when no photos', async ({ page }) => {
    await expect(page.getByText('No photos yet')).toBeVisible();
  });

  test('should navigate to photo detail on click', async ({ page }) => {
    await page.getByTestId('photo-card').first().click();
    await expect(page).toHaveURL(/\/photos\/\d+/);
  });
});
```

### API Test

```typescript
// tests/api/photos/photos-api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Photos API', () => {
  test('GET /api/photos returns photo list', async ({ request }) => {
    const response = await request.get('http://localhost:8081/api/photos');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /api/photos creates new photo', async ({ request }) => {
    const response = await request.post('http://localhost:8081/api/photos', {
      data: { title: 'Test Photo', url: 'https://example.com/photo.jpg' },
    });

    expect(response.status()).toBe(201);
    const photo = await response.json();
    expect(photo.title).toBe('Test Photo');
  });

  test('GET /api/photos/:id returns 404 for unknown id', async ({ request }) => {
    const response = await request.get('http://localhost:8081/api/photos/nonexistent');
    expect(response.status()).toBe(404);
  });
});
```

---

## Assertions — Use Web-First

Web-first assertions auto-retry until element meets condition:

```typescript
// ✅ Web-first — auto-retry
await expect(page.getByText('Saved!')).toBeVisible();
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByTestId('count')).toHaveText('5');

// ❌ Not web-first — no retry
const text = await page.textContent('.count');
expect(text).toBe('5');
```

---

## Page Object Pattern

Use Page Objects for repeated flows:

```typescript
// tests/fixtures/pages/gallery-page.ts
import { Page, Locator } from '@playwright/test';

export class GalleryPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly photoGrid: Locator;
  readonly uploadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Gallery' });
    this.photoGrid = page.getByTestId('photo-grid');
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
  }

  async goto() {
    await this.page.goto('http://localhost:3002/gallery');
  }

  async uploadPhoto(title: string, filePath: string) {
    await this.uploadButton.click();
    await this.page.getByLabel('Title').fill(title);
    await this.page.getByLabel('File').setInputFiles(filePath);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
}
```

Usage:

```typescript
test('should upload photo successfully', async ({ page }) => {
  const galleryPage = new GalleryPage(page);
  await galleryPage.goto();
  await galleryPage.uploadPhoto('Sunset', './fixtures/sunset.jpg');

  await expect(page.getByText('Photo uploaded!')).toBeVisible();
});
```

---

## Anti-Patterns

```typescript
// ❌ Manual waits — flaky
await page.waitForTimeout(2000);

// ✅ Wait for specific condition
await expect(page.getByText('Loaded')).toBeVisible();

// ❌ Fragile CSS selector
page.locator('div.gallery > ul > li:first-child > a')

// ✅ Role-based
page.getByRole('link', { name: 'First Photo' })

// ❌ Tests that depend on each other
// ✅ Each test is fully independent
```

---

## Running Tests

```bash
# All E2E tests
npx nx e2e kameravue-fe-e2e

# API tests
npx nx e2e kameravue-be-e2e

# Debug with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/gallery/gallery-view.spec.ts

# Trace viewer (after failed test)
npx playwright show-trace test-results/trace.zip
```

---

## Coverage and Gherkin

E2E tests should correspond to Gherkin scenarios in `specs/`:

```gherkin
# specs/gallery/gallery-view.feature
Feature: Gallery View

  Scenario: User views photo gallery
    Given the user is on the gallery page
    When the gallery loads
    Then the user sees the photo grid
```

Each scenario → one `test()` in the E2E spec file.
