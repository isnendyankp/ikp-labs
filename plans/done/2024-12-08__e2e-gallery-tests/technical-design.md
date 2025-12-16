# E2E Gallery Tests - Technical Documentation

**Status:** ✅ COMPLETED
**Last Updated:** December 8, 2024
**Implementation:** December 1-6, 2024

---

## Overview

This document provides technical implementation details for the E2E Gallery Tests. It includes test architecture, helper functions, Playwright configuration, code patterns, and technical references.

**Back to:** [Main README](README.md) | **See also:** [Requirements](requirements.md) | [Daily Checklist](checklist.md)

---

## Test Architecture

### File Structure

```
tests/
├── e2e/
│   ├── gallery.spec.ts          # 20 E2E tests (798 lines)
│   ├── helpers/
│   │   └── gallery-helpers.ts   # Reusable helpers (409 lines)
│   └── ...
├── fixtures/
│   └── images/
│       ├── test-photo.jpg       # Valid JPEG (385 bytes)
│       ├── test-photo.png       # Valid PNG (97 bytes)
│       ├── large-image.jpg      # Size validation (6MB)
│       ├── invalid-file.txt     # Type validation (88 bytes)
│       └── invalid-file.pdf     # Type validation (~300 bytes)
└── ...
```

### Test Organization

**Describe Blocks:**
```typescript
describe('Gallery Photo Management', () => {
  describe('Upload Photo', () => {
    // E2E-001, E2E-002, E2E-003, E2E-011
  });

  describe('View Photos', () => {
    // E2E-004, E2E-005, E2E-006
  });

  describe('Edit Photo', () => {
    // E2E-007, E2E-008
  });

  describe('Delete Photo', () => {
    // E2E-009, E2E-010
  });

  describe('File Validation', () => {
    // E2E-012, E2E-013
  });

  describe('Pagination', () => {
    // E2E-014, E2E-015
  });

  describe('Authorization', () => {
    // E2E-016, E2E-017
  });

  describe('Persistence', () => {
    // E2E-018, E2E-019
  });

  describe('Complete Journey', () => {
    // E2E-020
  });
});
```

---

## Helper Functions

### Location
**File:** `tests/e2e/helpers/gallery-helpers.ts` (409 lines)

### Function Categories

#### 1. User Authentication

**`generateGalleryTestEmail(): string`**
```typescript
/**
 * Generate unique email for gallery tests
 * Pattern: gallery.test.{timestamp}.{random}@example.com
 */
export function generateGalleryTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `gallery.test.${timestamp}.${random}@example.com`;
}
```

**Usage:** Ensures each test uses unique user to avoid conflicts.

---

**`createAuthenticatedGalleryUser(page: Page)`**
```typescript
/**
 * Create authenticated user and navigate to gallery
 * Returns: { page, user: { fullName, email, password } }
 */
export async function createAuthenticatedGalleryUser(page: Page) {
  const testUser = {
    fullName: 'Gallery Test User',
    email: generateGalleryTestEmail(),
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
  await page.waitForURL('/home', { timeout: 5000 });

  return { page, user: testUser };
}
```

**Usage:**
```typescript
test('E2E-001: should upload photo', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);
  // user is now logged in, ready to test
});
```

---

#### 2. Photo Upload

**`uploadGalleryPhoto(page, fixtureName, options?)`**
```typescript
/**
 * Upload photo via UI
 *
 * @param page - Playwright page object
 * @param fixtureName - Filename in tests/fixtures/images/
 * @param options - { title?, description?, isPublic? }
 */
export async function uploadGalleryPhoto(
  page: Page,
  fixtureName: string,
  options?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }
) {
  const fixturePath = path.join(__dirname, '../../fixtures/images', fixtureName);

  await page.goto('/gallery/upload');

  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);
  await page.waitForTimeout(500); // Wait for preview

  // Fill metadata
  if (options?.title) {
    await page.fill('input[type="text"]', options.title);
  }
  if (options?.description) {
    await page.fill('textarea', options.description);
  }
  if (options?.isPublic) {
    await page.check('input#isPublic');
  }

  // Submit
  await page.click('button[type="submit"]:has-text("Upload Photo")');
  await page.waitForURL('/gallery', { timeout: 5000 });
  await page.waitForTimeout(1000);
}
```

**Usage:**
```typescript
await uploadGalleryPhoto(page, 'test-photo.jpg', {
  title: 'Sunset Beach',
  description: 'Beautiful sunset',
  isPublic: false
});
```

---

**`uploadGalleryPhotoExpectError(page, fixtureName, expectedError)`**
```typescript
/**
 * Upload photo expecting validation error
 *
 * @param page - Playwright page object
 * @param fixtureName - Invalid file (e.g., 'large-image.jpg', 'invalid-file.txt')
 * @param expectedError - Expected error message
 */
export async function uploadGalleryPhotoExpectError(
  page: Page,
  fixtureName: string,
  expectedError: string
) {
  const fixturePath = path.join(__dirname, '../../fixtures/images', fixtureName);

  await page.goto('/gallery/upload');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);
  await page.waitForTimeout(500);

  await page.click('button[type="submit"]:has-text("Upload Photo")');
  await page.waitForTimeout(1000);

  // Verify error message
  const errorMessage = page.locator(`text=${expectedError}`);
  await expect(errorMessage).toBeVisible();
}
```

**Usage:**
```typescript
await uploadGalleryPhotoExpectError(
  page,
  'large-image.jpg',
  'File size must not exceed 5 MB'
);
```

---

**`bulkUploadPhotosViaAPI(page, count, isPublic?)`**
```typescript
/**
 * Bulk upload photos via API (10x faster than UI)
 * Used for pagination tests requiring 15+ photos
 *
 * @param page - Playwright page (to get auth token)
 * @param count - Number of photos to upload
 * @param isPublic - Public or private (default: false)
 */
export async function bulkUploadPhotosViaAPI(
  page: Page,
  count: number,
  isPublic: boolean = false
): Promise<void> {
  const token = await page.evaluate(() => localStorage.getItem('authToken'));
  const fixturePath = path.join(__dirname, '../../fixtures/images/test-photo.jpg');
  const fileBuffer = await fs.promises.readFile(fixturePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });

  for (let i = 1; i <= count; i++) {
    const formData = new FormData();
    formData.append('file', blob, 'test-photo.jpg');
    formData.append('title', `Bulk Photo ${i}`);
    formData.append('description', `Description ${i}`);
    formData.append('isPublic', String(isPublic));

    await fetch('http://localhost:8081/api/gallery/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
  }

  // Refresh page to see new photos
  await page.reload();
  await page.waitForTimeout(1000);
}
```

**Performance:**
- UI upload: ~4 seconds per photo
- API upload: ~0.5 seconds per photo
- **10x faster!** 🚀

**Usage:**
```typescript
// Upload 15 photos for pagination test
await bulkUploadPhotosViaAPI(page, 15, false);
```

---

#### 3. Photo Verification

**`verifyPhotoInGrid(page, title)`**
```typescript
/**
 * Verify photo appears in current grid view
 *
 * @param page - Playwright page object
 * @param title - Photo title to search for
 */
export async function verifyPhotoInGrid(page: Page, title: string) {
  const photoTitle = page.locator(`h3:has-text("${title}")`);
  await expect(photoTitle).toBeVisible();
}
```

**Usage:**
```typescript
await viewMyPhotos(page);
await verifyPhotoInGrid(page, 'Sunset Beach');
```

---

**`verifyPhotoPrivacy(page, privacy: 'Public' | 'Private')`**
```typescript
/**
 * Verify privacy badge is visible
 *
 * @param page - Playwright page object
 * @param privacy - 'Public' or 'Private'
 */
export async function verifyPhotoPrivacy(page: Page, privacy: 'Public' | 'Private') {
  const badge = page.locator(`span:has-text("${privacy}")`).first();
  await expect(badge).toBeVisible();
}
```

---

#### 4. Navigation

**`viewMyPhotos(page)`**
```typescript
/**
 * Navigate to My Photos tab
 */
export async function viewMyPhotos(page: Page) {
  await page.goto('/gallery');
  await page.click('button:has-text("My Photos")');
  await page.waitForTimeout(1000);
}
```

---

**`viewPublicPhotos(page)`**
```typescript
/**
 * Navigate to Public Photos tab
 */
export async function viewPublicPhotos(page: Page) {
  await page.goto('/gallery');
  await page.click('button:has-text("Public Photos")');
  await page.waitForTimeout(1000);
}
```

---

**`openPhotoDetail(page, title)`**
```typescript
/**
 * Open photo detail page by clicking photo card
 *
 * @param page - Playwright page object
 * @param title - Photo title to click
 */
export async function openPhotoDetail(page: Page, title: string) {
  const photoCard = page.locator(`h3:has-text("${title}")`).first();
  await photoCard.click();
  await page.waitForURL(/\/gallery\/\d+/, { timeout: 5000 });
  await page.waitForTimeout(1000);
}
```

---

**`verifyPhotoDetail(page, expected)`**
```typescript
/**
 * Verify photo detail page content
 *
 * @param page - Playwright page object
 * @param expected - { title, description?, privacy? }
 */
export async function verifyPhotoDetail(
  page: Page,
  expected: {
    title: string;
    description?: string;
    privacy?: 'Public' | 'Private';
  }
) {
  // Verify title (h1 or h2, filter by title)
  const titleLocator = page.locator(`h1:has-text("${expected.title}"), h2:has-text("${expected.title}")`).first();
  await expect(titleLocator).toBeVisible();

  // Verify description if provided
  if (expected.description) {
    const descriptionLocator = page.locator(`text=${expected.description}`);
    await expect(descriptionLocator).toBeVisible();
  }

  // Verify privacy badge if provided
  if (expected.privacy) {
    await verifyPhotoPrivacy(page, expected.privacy);
  }
}
```

---

#### 5. Edit & Delete

**`editPhotoMetadata(page, updates)`**
```typescript
/**
 * Edit photo metadata in detail page
 *
 * @param page - Playwright page object
 * @param updates - { title?, description?, isPublic? }
 */
export async function editPhotoMetadata(
  page: Page,
  updates: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }
) {
  // Enter edit mode
  await page.click('button:has-text("Edit")');
  await page.waitForTimeout(500);

  // Update fields
  if (updates.title !== undefined) {
    await page.fill('input[type="text"]', updates.title);
  }
  if (updates.description !== undefined) {
    await page.fill('textarea', updates.description);
  }
  if (updates.isPublic !== undefined) {
    const checkbox = page.locator('input#isPublic');
    await checkbox.click(); // Toggle checkbox
  }

  // Setup alert handler BEFORE clicking Save
  page.once('dialog', async dialog => {
    console.log('✓ Success alert:', dialog.message());
    await dialog.accept();
  });

  // Save changes
  await page.click('button:has-text("Save Changes")');
  await page.waitForSelector('button:has-text("Edit")', { timeout: 5000 });
  await page.waitForTimeout(1000);
}
```

**Key Pattern:** `page.once('dialog')` **BEFORE** clicking button that triggers alert!

---

**`deleteGalleryPhoto(page)`**
```typescript
/**
 * Delete photo with confirmation
 * Waits for redirect to Gallery page
 */
export async function deleteGalleryPhoto(page: Page) {
  // Setup dialog handler BEFORE clicking delete
  page.once('dialog', async dialog => {
    console.log('✓ Confirmation dialog:', dialog.message());
    await dialog.accept();
  });

  await page.click('button:has-text("Delete")');
  await page.waitForURL('/gallery', { timeout: 5000 });
  await page.waitForTimeout(1000);
}
```

---

**`cancelDelete(page)`**
```typescript
/**
 * Cancel delete confirmation
 * User stays on detail page
 */
export async function cancelDelete(page: Page) {
  // Setup dialog handler to dismiss
  page.once('dialog', async dialog => {
    console.log('✓ Cancel dialog:', dialog.message());
    await dialog.dismiss();
  });

  await page.click('button:has-text("Delete")');
  await page.waitForTimeout(1000);
}
```

---

## Key Selectors

### Gallery Page

```typescript
// Tab Navigation
const myPhotosTab = page.locator('button:has-text("My Photos")');
const publicPhotosTab = page.locator('button:has-text("Public Photos")');
const uploadButton = page.locator('button:has-text("+ Upload Photo")');

// Photo Grid
const photoCard = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
const photoTitle = page.locator('h3'); // Photo titles
const privacyBadge = page.locator('span:has-text("Public")');
const privateBadge = page.locator('span:has-text("Private")');
```

### Upload Form

```typescript
const fileInput = page.locator('input[type="file"]');
const titleInput = page.locator('input[type="text"]');
const descriptionTextarea = page.locator('textarea');
const publicCheckbox = page.locator('input#isPublic');
const uploadSubmitButton = page.locator('button[type="submit"]:has-text("Upload Photo")');
const errorMessage = page.locator('.text-red-500'); // Error messages
```

### Photo Detail Page

```typescript
const photoImage = page.locator('img[alt*="photo"]');
const photoTitleH1 = page.locator('h1, h2'); // Title (h1 or h2)
const editButton = page.locator('button:has-text("Edit")');
const deleteButton = page.locator('button:has-text("Delete")');
const saveButton = page.locator('button:has-text("Save Changes")');
const backButton = page.locator('button:has-text("← Back to Gallery")');
```

### Pagination

```typescript
const previousButton = page.locator('button:has-text("← Previous")');
const nextButton = page.locator('button:has-text("Next →")');
const pageIndicator = page.locator('text=/Page \\d+ of \\d+/');
```

---

## Test Patterns

### Pattern 1: Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import {
  createAuthenticatedGalleryUser,
  uploadGalleryPhoto,
  verifyPhotoInGrid
} from './helpers/gallery-helpers';

test.describe('Gallery Photo Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('E2E-001: should upload single photo', async ({ page }) => {
    // GIVEN: User is registered and logged in
    const { user } = await createAuthenticatedGalleryUser(page);

    // WHEN: User uploads photo
    await uploadGalleryPhoto(page, 'test-photo.jpg', {
      title: 'Sunset Beach',
      description: 'Beautiful sunset',
      isPublic: false
    });

    // THEN: Photo appears in My Photos
    await page.goto('/gallery');
    await page.click('button:has-text("My Photos")');
    await verifyPhotoInGrid(page, 'Sunset Beach');
  });
});
```

---

### Pattern 2: Dialog Handling

```typescript
test('E2E-009: should delete photo with confirmation', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Photo to Delete' });
  await openPhotoDetail(page, 'Photo to Delete');

  // CRITICAL: Setup dialog handler BEFORE clicking
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('delete');
    await dialog.accept();
  });

  await page.click('button:has-text("Delete")');
  await page.waitForURL('/gallery', { timeout: 5000 });

  // Verify photo removed
  await expect(page.locator('h3:has-text("Photo to Delete")')).not.toBeVisible();
});
```

**Key:** `page.once('dialog')` MUST be called **BEFORE** the action that triggers the dialog!

---

### Pattern 3: Multi-User Scenarios

```typescript
test('E2E-016: cannot edit another user photo', async ({ page }) => {
  // SETUP: User A uploads photo
  const { user: userA } = await createAuthenticatedGalleryUser(page);
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'User A Photo',
    isPublic: true
  });

  // Logout User A
  await page.goto('/logout');

  // SETUP: User B logs in
  const { user: userB } = await createAuthenticatedGalleryUser(page);

  // User B can view User A's photo
  await viewPublicPhotos(page);
  await verifyPhotoInGrid(page, 'User A Photo');
  await openPhotoDetail(page, 'User A Photo');

  // THEN: Edit button NOT visible to User B
  const editButton = page.locator('button:has-text("Edit")');
  await expect(editButton).not.toBeVisible();

  const deleteButton = page.locator('button:has-text("Delete")');
  await expect(deleteButton).not.toBeVisible();
});
```

---

### Pattern 4: Persistence Testing

```typescript
test('E2E-018: photos persist after refresh', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload photos
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Persistent Photo 1' });
  await uploadGalleryPhoto(page, 'test-photo.png', { title: 'Persistent Photo 2' });

  // Navigate to My Photos
  await viewMyPhotos(page);

  // CRITICAL: Refresh browser (clears React state)
  await page.reload();
  await page.waitForTimeout(1000);

  // Verify photos reappear (loaded from database)
  await verifyPhotoInGrid(page, 'Persistent Photo 1');
  await verifyPhotoInGrid(page, 'Persistent Photo 2');
});
```

**Key:** `page.reload()` clears frontend state, forcing data to reload from database.

---

### Pattern 5: Bulk Data with API

```typescript
test('E2E-014: pagination in My Photos', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload 15 photos via API (10x faster than UI)
  await bulkUploadPhotosViaAPI(page, 15, false);

  await viewMyPhotos(page);

  // Verify page 1 shows max 12 photos
  const photoCards = page.locator('.group.cursor-pointer');
  await expect(photoCards).toHaveCount(12);

  // Verify pagination controls
  const nextButton = page.locator('button:has-text("Next →")');
  await expect(nextButton).toBeVisible();

  const pageIndicator = page.locator('text=/Page 1 of 2/');
  await expect(pageIndicator).toBeVisible();

  // Navigate to page 2
  await nextButton.click();
  await page.waitForTimeout(1000);

  // Verify page 2 shows remaining 3 photos
  await expect(photoCards).toHaveCount(3);
});
```

---

## Playwright Configuration

### Browser Configuration

**File:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30000, // 30 seconds per test
  retries: 0, // No retries (tests must be stable)
  workers: 3, // Run 3 tests in parallel

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  use: {
    baseURL: 'http://localhost:3005',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### Running Tests

```bash
# Run all gallery tests
npx playwright test tests/e2e/gallery.spec.ts

# Run specific test
npx playwright test -g "E2E-001"

# Run on specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# View HTML report
npx playwright show-report
```

---

## Known Challenges & Solutions

### Challenge 1: File Upload Timing

**Problem:** File upload preview may take varying time across browsers

**Solution:**
```typescript
await fileInput.setInputFiles(fixturePath);
await page.waitForTimeout(500); // Wait for preview to render
```

### Challenge 2: Alert Dialog Race Condition

**Problem:** If dialog handler not set before clicking, test fails

**Solution:** Always use `page.once('dialog')` **BEFORE** button click
```typescript
page.once('dialog', async dialog => await dialog.accept());
await page.click('button:has-text("Delete")'); // AFTER handler
```

### Challenge 3: Edit Mode Exit Detection

**Problem:** How to know when edit mode exits after Save?

**Solution:** Wait for Edit button to reappear
```typescript
await page.click('button:has-text("Save Changes")');
await page.waitForSelector('button:has-text("Edit")', { timeout: 5000 });
```

### Challenge 4: Checkbox Toggle vs Check

**Problem:** `checkbox.check()` doesn't work if already checked

**Solution:** Use `checkbox.click()` for toggle behavior
```typescript
const checkbox = page.locator('input#isPublic');
await checkbox.click(); // Works whether checked or unchecked
```

### Challenge 5: State Update After API Call

**Problem:** Frontend not showing updated data after edit (Bug discovered on Day 4)

**Root Cause:** Data structure mismatch
- Backend: `GalleryPhotoResponse` (flat)
- Frontend expected: `{ photo: { ... } }` (nested)

**Solution:** Fixed in `PhotoDetailPage.tsx`
```typescript
// BEFORE (WRONG):
setPhoto({ ...photo, ...response.data.photo }); // undefined!

// AFTER (CORRECT):
setPhoto({ ...response.data }); // Direct GalleryPhotoResponse
```

---

## Learning Resources

### Reference Code
- [`tests/e2e/profile-picture.spec.ts`](../../tests/e2e/profile-picture.spec.ts) - 10 E2E tests, file upload patterns
- [`tests/e2e/helpers/gallery-helpers.ts`](../../tests/e2e/helpers/gallery-helpers.ts) - 409 lines of helpers

### Playwright Documentation
- [Getting Started](https://playwright.dev/docs/intro)
- [File Upload](https://playwright.dev/docs/input#upload-files)
- [Dialogs](https://playwright.dev/docs/dialogs)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Project Documentation
- [Test Plan Checklist Strategy](../../docs/explanation/testing/test-plan-checklist-strategy.md)
- [Week 3 E2E Gallery Checklist](../../docs/journals/2025-12/week3-e2e-gallery-checklist.md)

---

## Technical Metrics

### Code Statistics

| Metric | Value |
|--------|-------|
| Test File Size | 798 lines |
| Helper File Size | 409 lines |
| Total Code | 1,207 lines |
| Number of Tests | 20 |
| Number of Helpers | 12+ functions |
| Browsers Tested | 3 (Chromium, Firefox, WebKit) |
| Test Executions | 60 (20 tests × 3 browsers) |

### Performance

| Operation | Time |
|-----------|------|
| Single UI Upload | ~4 seconds |
| Bulk API Upload (15 photos) | ~8 seconds |
| Full Test Suite | ~10 minutes (60 test executions) |
| Single Test Average | ~10 seconds |

---

## Future Enhancements

### Potential Improvements

1. **Visual Regression Testing**
   - Add Percy or Playwright screenshot comparison
   - Verify UI doesn't break with changes

2. **Accessibility Testing**
   - Integrate axe-core for a11y checks
   - Verify WCAG 2.1 compliance

3. **Performance Testing**
   - Add load testing with k6
   - Test with 100+ photos
   - Measure pagination performance

4. **CI/CD Integration**
   - Add GitHub Actions workflow
   - Run tests on every PR
   - Automated test reporting

5. **Test Data Management**
   - Implement test data cleanup strategy
   - Database seeding for consistent state
   - Factory pattern for test data creation

---

**Document Version:** 1.0
**Status:** ✅ COMPLETED
**Last Updated:** December 8, 2024

**Back to:** [Main README](README.md) | **Next:** [Daily Checklist](checklist.md)
