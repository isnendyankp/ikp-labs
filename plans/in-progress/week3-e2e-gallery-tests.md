# Week 3: E2E Gallery Tests Implementation Plan

## 📋 Overview

**Duration:** 6 Days (Monday - Saturday)
**Goal:** Implement 20 E2E Gallery tests with daily commits
**Strategy:** Step-by-step learning with consistent progress
**Context:** Parallel with Hijra take-home test preparation

---

## 🎯 Objectives

### Primary Goals
- ✅ Create 20 comprehensive E2E Gallery tests
- ✅ Maintain daily commit streak (6 consecutive days)
- ✅ Learn Playwright E2E testing patterns deeply
- ✅ Achieve 100% Gallery user flow coverage

### Learning Outcomes
- Master Playwright file upload testing
- Understand E2E test architecture
- Practice authorization testing patterns
- Learn pagination and multi-user scenarios

### Success Metrics
- All 20 tests passing consistently
- Clean, documented, reusable code
- Ready for Week 3 LinkedIn post
- Portfolio showcase material

---

## 📊 Current Status

### ✅ Completed (Before Week 3)
- **Week 1:** 40 Integration Tests (Spring Boot + MockMvc + @MockBean)
- **Week 2:** 31 API Tests (Playwright API + real HTTP + database)
- **Existing E2E:** 30 tests (Registration, Login, Auth Flow, Profile Picture)

### ❌ Missing
- **Gallery E2E Tests:** 0 tests
- **Gap:** Backend tested (31 API tests), Frontend implemented, but NO E2E user journey tests

---

## 🗓️ Day-by-Day Implementation Plan

### Day 1 (Monday): Foundation + First Upload Test
**Time Estimate:** 2-3 hours
**Focus:** Setup infrastructure, learn patterns

#### Tasks
1. **Create Helper Functions** (`tests/e2e/helpers/gallery-helpers.ts`)
   - `generateGalleryTestEmail()`: Unique test user emails
   - `createAuthenticatedGalleryUser(page)`: Register + login helper
   - `uploadGalleryPhoto()`: Upload photo via UI helper
   - `verifyPhotoInGrid()`: Assertion helper
   - `verifyPhotoPrivacy()`: Privacy badge verification

2. **Setup Test File** (`tests/e2e/gallery.spec.ts`)
   - Test structure with describe blocks
   - beforeEach hook for test isolation
   - Import helpers and fixtures

3. **Implement Test**
   - ✅ **E2E-001:** Upload single photo successfully [P0]

#### Learning Focus
- Playwright file upload mechanisms
- Test helper patterns from `profile-picture.spec.ts`
- Gallery upload form selectors

#### Deliverables
- `tests/e2e/helpers/gallery-helpers.ts` (~200 lines)
- `tests/e2e/gallery.spec.ts` (initial structure + 1 test)
- **1 test passing** ✅

#### Commit Template
```
feat(e2e): add Gallery E2E test infrastructure + upload test

- Create gallery-helpers.ts with auth & upload helpers
- Implement E2E-001: Upload single photo test
- Setup gallery.spec.ts test structure

Day 1/6: 1 test passing ✅
```

---

### Day 2 (Tuesday): Upload Variations & Validation
**Time Estimate:** 2-3 hours
**Focus:** Form validation, public/private toggle

#### Tasks
1. **Implement Upload Variations**
   - ✅ **E2E-002:** Upload photo as public [P0]
   - ✅ **E2E-003:** Upload multiple photos sequentially [P1]

2. **Implement File Validation**
   - ✅ **E2E-011:** Reject file larger than 5MB [P1]

3. **Enhance Helpers**
   - Add `uploadMultiplePhotos()` helper
   - Add file validation assertion helpers

#### Learning Focus
- Public/private checkbox toggling
- Multiple sequential uploads
- File size validation testing
- Error message assertions

#### Deliverables
- 3 new tests implemented
- Enhanced helper functions
- **4 tests passing** (cumulative) ✅

#### Commit Template
```
test(e2e): add upload variations & validation tests

- E2E-002: Upload as public photo
- E2E-003: Upload multiple photos sequentially
- E2E-011: File size validation (reject >5MB)

Day 2/6: 4 tests passing (cumulative) ✅
```

---

### Day 3 (Wednesday): View & Navigation Tests
**Time Estimate:** 2-3 hours
**Focus:** Gallery views, tab switching, detail page

#### Tasks
1. **Implement View Tests**
   - ✅ **E2E-004:** View My Photos shows all owned photos [P0]
   - ✅ **E2E-005:** View Public Photos shows only public [P0]
   - ✅ **E2E-006:** View photo detail shows complete info [P0]

2. **Create View Helpers**
   - `viewMyPhotos(page)`: Navigate to My Photos tab
   - `viewPublicPhotos(page)`: Navigate to Public Photos tab
   - `openPhotoDetail(page, title)`: Open photo detail page
   - `verifyPhotoDetail()`: Assert detail page content

#### Learning Focus
- Tab navigation patterns
- Photo grid assertions
- Detail page selectors
- Multi-field verification

#### Deliverables
- 3 new tests implemented
- View navigation helpers
- **7 tests passing** (cumulative) ✅

#### Commit Template
```
test(e2e): add Gallery view & navigation tests

- E2E-004: My Photos tab displays owned photos
- E2E-005: Public Photos tab filters correctly
- E2E-006: Photo detail page shows full info

Day 3/6: 7 tests passing ✅
```

---

### Day 4 (Thursday): Edit & Delete Operations
**Time Estimate:** 2-3 hours
**Focus:** CRUD operations, dialog handling

#### Tasks
1. **Implement Edit Tests**
   - ✅ **E2E-007:** Edit photo title and description [P0]
   - ✅ **E2E-008:** Toggle privacy from private to public [P1]

2. **Implement Delete Tests**
   - ✅ **E2E-009:** Delete photo with confirmation [P0]
   - ✅ **E2E-010:** Cancel delete keeps photo [P1]

3. **Create Edit/Delete Helpers**
   - `editPhotoMetadata()`: Edit mode + save
   - `togglePhotoPrivacy()`: Privacy toggle helper
   - `deleteGalleryPhoto()`: Delete with confirmation
   - `cancelDelete()`: Cancel confirmation dialog

#### Learning Focus
- Edit mode toggling
- Form state management
- Dialog handling (accept/dismiss)
- Privacy toggle verification

#### Deliverables
- 4 new tests implemented
- Edit/delete helper functions
- **11 tests passing** (cumulative) ✅

#### Commit Template
```
test(e2e): add Gallery edit & delete operations

- E2E-007: Edit photo metadata
- E2E-008: Privacy toggle (private → public)
- E2E-009: Delete photo with confirmation dialog
- E2E-010: Cancel delete preserves photo

Day 4/6: 11 tests passing ✅
```

---

### Day 5 (Friday): Validation & Persistence
**Time Estimate:** 2-3 hours
**Focus:** Edge cases, data integrity

#### Tasks
1. **Implement Validation Tests**
   - ✅ **E2E-012:** Reject non-image file [P1]
   - ✅ **E2E-013:** Reject invalid file format (PDF) [P2]

2. **Implement Persistence Tests**
   - ✅ **E2E-018:** Photos persist after page refresh [P1]
   - ✅ **E2E-019:** Privacy setting persists after refresh [P2]

3. **Enhance Test Fixtures**
   - Add `invalid-file.pdf` fixture
   - Reuse existing `invalid-file.txt`

#### Learning Focus
- File type validation
- Browser refresh patterns
- Data persistence verification
- Edge case handling

#### Deliverables
- 4 new tests implemented
- Additional test fixtures
- **15 tests passing** (cumulative) ✅

#### Commit Template
```
test(e2e): add validation & persistence tests

- E2E-012: File type validation (reject non-image)
- E2E-013: Reject PDF files
- E2E-018: Photos persist after refresh
- E2E-019: Privacy persists after refresh

Day 5/6: 15 tests passing ✅
```

---

### Day 6 (Saturday): Pagination & Authorization
**Time Estimate:** 3-4 hours
**Focus:** Advanced scenarios, complete coverage

#### Tasks
1. **Implement Pagination Tests**
   - ✅ **E2E-014:** Pagination in My Photos [P1]
   - ✅ **E2E-015:** Pagination in Public Photos [P2]

2. **Implement Authorization Tests**
   - ✅ **E2E-016:** Cannot edit other user's photo [P1]
   - ✅ **E2E-017:** Cannot delete other user's photo [P2]

3. **Implement Complete Journey**
   - ✅ **E2E-020:** Complete Gallery flow [P0]

4. **Create Multi-User Helpers**
   - `createSecondUser()`: Multi-user scenario setup
   - `verifyOwnerOnlyActions()`: Authorization assertions
   - `bulkUploadPhotos()`: Bulk upload for pagination

#### Learning Focus
- Pagination logic and navigation
- Multi-user test scenarios
- Authorization boundary testing
- Complete user journey patterns

#### Deliverables
- 5 new tests implemented
- Multi-user helpers
- **20 tests passing** (cumulative) ✅
- **100% Gallery E2E coverage!** 🎉

#### Commit Template
```
test(e2e): complete Gallery E2E test suite

- E2E-014: My Photos pagination
- E2E-015: Public Photos pagination
- E2E-016: Edit authorization (owner-only)
- E2E-017: Delete authorization (owner-only)
- E2E-020: Complete end-to-end journey test

🎉 Day 6/6: ALL 20 TESTS PASSING! ✅

Total E2E coverage:
- Registration: 8 tests
- Login: 4 tests
- Auth Flow: 8 tests
- Profile Picture: 10 tests
- Gallery: 20 tests
TOTAL: 50 E2E tests! 🚀
```

---

## 🧪 Test Implementation Patterns

### Pattern 1: Helper Function Structure
```typescript
// tests/e2e/helpers/gallery-helpers.ts

import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * Generate unique email for gallery tests
 */
export function generateGalleryTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `gallery.test.${timestamp}.${random}@example.com`;
}

/**
 * Create authenticated user and navigate to gallery
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

/**
 * Upload photo via UI
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

### Pattern 2: Test Structure
```typescript
// tests/e2e/gallery.spec.ts

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

  test.describe('Upload Photo', () => {

    test('should upload single photo successfully', async ({ page }) => {
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

      // AND: Privacy badge shows "Private"
      const privacyBadge = page.locator('span:has-text("Private")').first();
      await expect(privacyBadge).toBeVisible();
    });

  });
});
```

### Pattern 3: Delete with Dialog Handling
```typescript
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

## 📚 Technical References

### Key Selectors
```typescript
// Gallery Page
const myPhotosTab = page.locator('button:has-text("My Photos")');
const publicPhotosTab = page.locator('button:has-text("Public Photos")');
const uploadButton = page.locator('button:has-text("+ Upload Photo")');

// Upload Form
const fileInput = page.locator('input[type="file"]');
const titleInput = page.locator('input[type="text"]');
const descriptionTextarea = page.locator('textarea');
const publicCheckbox = page.locator('input#isPublic');
const uploadSubmitButton = page.locator('button[type="submit"]:has-text("Upload Photo")');

// Photo Grid
const photoCard = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
const photoTitle = page.locator('h3');
const privacyBadge = page.locator('span:has-text("Public")');

// Photo Detail
const editButton = page.locator('button:has-text("Edit")');
const deleteButton = page.locator('button:has-text("Delete")');
const saveButton = page.locator('button:has-text("Save Changes")');
const backButton = page.locator('button:has-text("← Back to Gallery")');

// Pagination
const previousButton = page.locator('button:has-text("← Previous")');
const nextButton = page.locator('button:has-text("Next →")');
const pageIndicator = page.locator('text=/Page \\d+ of \\d+/');
```

### Test Fixtures
```
tests/fixtures/images/
├── test-photo.jpg (385 bytes) - Valid JPEG
├── test-photo.png (97 bytes) - Valid PNG
├── large-image.jpg (6MB) - For size validation
├── invalid-file.txt (55 bytes) - For type validation
└── invalid-file.pdf (NEW) - For type validation
```

---

## 🎯 Success Criteria

### Code Quality
- ✅ All helpers use TypeScript types
- ✅ Clear function names and documentation
- ✅ Reusable, modular helper functions
- ✅ No hardcoded waits (use Playwright auto-wait)
- ✅ Stable selectors (semantic or data-testid)

### Test Quality
- ✅ All 20 tests pass consistently (3+ runs)
- ✅ Tests run in < 10 minutes total
- ✅ No test dependencies (can run in any order)
- ✅ Clear Given/When/Then structure
- ✅ Helpful console logging for debugging

### Documentation
- ✅ Test scenarios documented
- ✅ Helper functions documented
- ✅ Fixture usage documented
- ✅ Known limitations documented

### Portfolio Impact
- ✅ GitHub shows 6-day commit streak
- ✅ Professional test architecture
- ✅ Ready for LinkedIn Week 3 post
- ✅ Showcase material for interviews

---

## ⚠️ Prerequisites

### Before Starting Day 1:
- [ ] Backend running on `localhost:8081`
- [ ] Frontend running on `localhost:3005`
- [ ] PostgreSQL database running
- [ ] Playwright installed (`npm install`)
- [ ] Test fixtures in place

### Environment Check:
```bash
# Backend
cd backend/registration-form-api
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev

# Tests
npx playwright test --help
```

---

## 🚧 Known Challenges & Solutions

### Challenge 1: Pagination Requires Many Photos
**Solution:** Create bulk upload helper via API (faster than UI)

### Challenge 2: Multi-User Authorization Tests
**Solution:** Use Playwright contexts to maintain two sessions

### Challenge 3: File Upload Timing
**Solution:** Use `waitForURL()` instead of fixed timeouts

### Challenge 4: Test Data Cleanup
**Solution:** Accept accumulation (matches current pattern)

---

## 📈 Progress Tracking

Use the companion checklist: `docs/checklists/week3-e2e-gallery-checklist.md`

**Daily Targets:**
- Day 1: 1 test (setup intensive)
- Day 2: 3 tests (cumulative: 4)
- Day 3: 3 tests (cumulative: 7)
- Day 4: 4 tests (cumulative: 11)
- Day 5: 4 tests (cumulative: 15)
- Day 6: 5 tests (cumulative: 20) 🎉

---

## 🎓 Learning Resources

### Reference Materials:
- Existing: `tests/e2e/profile-picture.spec.ts` (10 tests, excellent patterns)
- Playwright Docs: https://playwright.dev/docs/test-assertions
- File Upload: https://playwright.dev/docs/input#upload-files

### Key Learnings to Apply:
1. Copy proven patterns from `profile-picture.spec.ts`
2. Use `page.once('dialog')` for confirmations
3. Generate unique emails per test
4. Clear localStorage in beforeEach
5. Use waitForURL for navigation

---

## 🚀 Next Steps After Week 3

### Week 4 Options:
1. **Performance Testing:** Load testing with k6
2. **Accessibility Testing:** Add a11y tests with axe
3. **Visual Regression:** Percy or Playwright screenshots
4. **CI/CD Integration:** GitHub Actions test automation

### LinkedIn Post Preparation:
- Screenshot: Playwright HTML report (50 E2E tests)
- Code snippet: Complete journey test
- Metrics: Test count, execution time
- Learning: E2E vs Integration vs API testing

---

## 📞 Support

If stuck:
1. Check `profile-picture.spec.ts` for reference
2. Review Playwright docs
3. Console.log debug output
4. Run single test: `npx playwright test gallery.spec.ts -g "upload single photo"`

---

**Created:** Sunday, Week 3 Planning Day
**Author:** IKP Labs Team
**Status:** Ready for execution Monday-Saturday
**Goal:** 20 E2E Gallery tests with daily commits 🚀
