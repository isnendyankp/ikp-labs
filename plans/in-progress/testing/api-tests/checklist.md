# Implementation Checklist - API Tests (Playwright)

## Quick Stats (Days 3-6)

| Day | Focus | Tasks | Completed | Progress |
|-----|-------|-------|-----------|----------|
| **Day 3 (Wed)** | Setup + Upload & Get | 8 | 7 | ✅ COMPLETE |
| **Day 4 (Thu)** | Get Detail & Pagination | 10 | 10 | ✅ COMPLETE |
| **Day 5 (Fri)** | Update & Authorization | 10 | 10 | ✅ COMPLETE |
| **Day 6 (Sat)** | Delete & Privacy | 10 | 0 | 0% |
| **TOTAL** | **4 Days** | **38** | **27** | **71%** |

---

## ✅ Day 3 (Wednesday, Nov 26): Setup + Upload & Get Photos - COMPLETE

**Status:** ✅ **7/7 tests PASSING** (888ms)

**Prerequisites:**
- [x] PostgreSQL running locally
- [x] Database `registrationform_db` exists
- [x] Backend server running (mvn spring-boot:run on port 8081)
- [x] Playwright already installed

### ✅ API-SETUP-001: Environment Verification
- [x] Verify PostgreSQL running
- [x] Verify Playwright installed
- [x] Create test data folder: `tests/fixtures/images/`
- [x] Add test photos: `test-photo.jpg`, `test-photo.png`
- [x] Update .gitignore to allow test fixtures in subdirectories

**Commit:** cb0f7cd, 17da13e, f8039c3, 5851606

### ✅ API-SETUP-002: Backend Server Start
- [x] Backend server running on port 8081
- [x] Health check verified: `curl http://localhost:8081/api/auth/health`

### ✅ API-SETUP-003: Study Existing Pattern
- [x] Read `tests/api/auth.api.spec.ts` for pattern reference
- [x] Understand `ApiClient` usage - added `postMultipart()` method
- [x] Enhanced `AuthHelper` with `registerAndLogin()` and `deleteUser()`
- [x] Learned proper Playwright fixture usage (avoid beforeAll/afterAll with request)

**Commits:**
- 89a689f: Add postMultipart method to ApiClient
- a05d618: Add registerAndLogin and deleteUser to AuthHelper

---

### ✅ API-CREATE-001: Create Gallery API Test File
- [x] Create `tests/api/gallery.api.spec.ts`
- [x] Import dependencies (test, expect, ApiClient, AuthHelper)
- [x] Setup test.describe block for Gallery API
- [x] Add getAuthenticatedUser() helper (lazy initialization pattern)
- [x] Follow proper Playwright pattern (each test gets { request } parameter)
- [x] 7 test.describe blocks for all Gallery endpoints

**Commit:** 3663208 "test(api): create gallery.api.spec.ts skeleton with test structure"

---

### ✅ API-UPLOAD-001: Upload Photo Tests (4 tests) - 100% PASSING
- [x] ✅ Test POST /api/gallery/upload - Valid JPEG with full metadata
  - Verify 201 CREATED
  - Verify response body (id, title, description, isPublic, filePath, userId)
  - Verify filePath contains 'gallery/user-'

- [x] ✅ Test POST /api/gallery/upload - Minimal metadata (title only)
  - Verify defaults (isPublic = false, description = null)
  - Verify 201 CREATED

- [x] ✅ Test POST /api/gallery/upload - Public photo (isPublic=true)
  - Verify isPublic = true in response

- [x] ✅ Test POST /api/gallery/upload - Without authentication
  - Verify 403 FORBIDDEN

**Result:** 4/4 tests PASSING
**Commits:**
- 5851606: Implement upload and get my photos API tests (7 tests)
- f55c0e1: Fix pattern to follow Playwright best practices

---

### ✅ API-GET-001: Get My Photos Tests (3 tests) - 100% PASSING
- [x] ✅ Test GET /api/gallery/my-photos - With pagination
  - Upload 2 photos first
  - Verify response contains both photos
  - Verify pagination metadata (photos, currentPage, totalPhotos, totalPages)
  - Verify all photos belong to authenticated user

- [x] ✅ Test GET /api/gallery/my-photos - Empty list (new user)
  - Create new user with no photos
  - Verify empty array returned
  - Verify pagination shows 0 photos

- [x] ✅ Test GET /api/gallery/my-photos - Without authentication
  - Verify 403 FORBIDDEN

**Result:** 3/3 tests PASSING
**Total Day 3:** 7/7 tests PASSING (888ms)

---

## ✅ Day 4 (Thursday, Nov 27): Get Detail & Pagination Tests - COMPLETE

**Status:** ✅ **17/17 tests PASSING** (1.4s)

### ✅ API-DETAIL-001: Photo Detail Tests (5 tests) - 100% PASSING
- [x] ✅ Test GET /api/gallery/photo/{id} - Public photo by anyone
  - User A uploads public photo
  - User B retrieves it successfully (200 OK)
  - Verify all fields (id, title, ownerName, ownerEmail, etc)

- [x] ✅ Test GET /api/gallery/photo/{id} - Private photo by owner
  - User A uploads private photo
  - User A retrieves it successfully (200 OK)

- [x] ✅ Test GET /api/gallery/photo/{id} - Private photo by non-owner
  - User A uploads private photo
  - User B tries to retrieve (403 FORBIDDEN) ✅

- [x] ✅ Test GET /api/gallery/photo/{id} - Photo not found
  - Request non-existent ID (999999)
  - Verify 404 NOT FOUND ✅

- [x] ✅ Test GET /api/gallery/photo/{id} - Response structure
  - Verify all required fields present and correct types
  - Fields: id, userId, ownerName, ownerEmail, title, description, filePath, isPublic, createdAt, updatedAt

**Result:** 5/5 tests PASSING
**Commit:** 73d33df "test(api): add photo detail tests with authorization (5 tests)"

---

### ✅ API-PAGINATION-001: Public Photos & Pagination Tests (5 tests) - 100% PASSING

**Public Photos Tests (3 tests):**
- [x] ✅ Test GET /api/gallery/public - Pagination basic
  - Upload 5 public photos
  - Verify pagination metadata (currentPage, totalPhotos, pageSize, hasNext, hasPrevious)
  - Verify all returned photos are public

- [x] ✅ Test GET /api/gallery/public - Excludes private photos
  - Upload 3 public + 2 private photos
  - GET /public returns only 3 public photos
  - Verify no private photos leak ✅

- [x] ✅ Test GET /api/gallery/public - Multiple users
  - User A uploads 2 public photos
  - User B uploads 3 public photos
  - GET /public returns all 5 photos from both users

**Advanced Pagination Tests (2 tests):**
- [x] ✅ Test GET /api/gallery/my-photos - Pagination page 0
  - Upload 15 photos total
  - GET page 0, size 12
  - Verify 12 photos returned, totalPages >= 2
  - Verify hasNext = true, hasPrevious = false

- [x] ✅ Test GET /api/gallery/my-photos - Pagination page 1
  - Check existing photo count, upload more if needed
  - GET page 1, size 12
  - Verify hasPrevious = true (not first page)
  - Verify all photos belong to current user

**Result:** 5/5 tests PASSING (3 public + 2 pagination)
**Commits:**
- f4b7e28: "test(api): add public photos pagination tests (3 tests)"
- fb05d2a: "test(api): add advanced pagination tests for my-photos (2 tests)"
- 7080e33: "fix(api): ensure page 1 test has sufficient photos (17/17 passing)"

**Total Day 4:** 10/10 tests PASSING (1.4s)

---

## ✅ Day 5 (Friday, Nov 28): Update & Authorization Tests - COMPLETE

**Status:** ✅ **27/27 tests PASSING** (1.6s)

### ✅ API-UPDATE-001: Update Photo Tests (10 tests) - 100% PASSING

**Basic Update Tests (4 tests):**
- [x] ✅ Test PUT /api/gallery/photo/{id} - Update title only (partial update)
  - Upload photo with original title
  - Update only title field
  - Verify title changed, description and isPublic unchanged ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Update description only (partial update)
  - Upload photo with original description
  - Update only description field
  - Verify description changed, title and isPublic unchanged ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Update isPublic only (privacy toggle)
  - Upload private photo (isPublic=false)
  - Update only isPublic to true
  - Verify privacy changed, title and description unchanged ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Update all fields (full update)
  - Upload photo with original data
  - Update title, description, AND isPublic
  - Verify all fields updated, filePath unchanged ✅

**Commit:** 580e8a4 "test(api): add basic update photo tests (4 tests)"

---

**Authorization Tests (3 tests):**
- [x] ✅ Test PUT /api/gallery/photo/{id} - Update by non-owner (403 FORBIDDEN)
  - User A uploads photo
  - User B tries to update User A's photo
  - Verify 403 FORBIDDEN ✅
  - Verify photo NOT modified (original title unchanged) ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Update without authentication (403 FORBIDDEN)
  - Upload photo with token
  - Try to update WITHOUT token
  - Verify 403 FORBIDDEN ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Update non-existent photo (404 NOT FOUND)
  - Try to update photo ID 999999
  - Verify 404 NOT FOUND ✅

**Commit:** 3445a52 "test(api): add authorization tests for update photo (3 tests)"

---

**Validation Tests (3 tests):**
- [x] ✅ Test PUT /api/gallery/photo/{id} - Title too long (400 BAD REQUEST)
  - Upload photo
  - Try to update with title > 100 chars ('A'.repeat(101))
  - Verify 400 BAD REQUEST with validation error ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Description too long (400 BAD REQUEST)
  - Upload photo
  - Try to update with description > 5000 chars ('B'.repeat(5001))
  - Verify 400 BAD REQUEST with validation error ✅

- [x] ✅ Test PUT /api/gallery/photo/{id} - Empty request body (no-op)
  - Upload photo
  - Send PUT with empty body {}
  - Verify 200 OK (success, no changes) ✅
  - Verify all fields remain unchanged ✅

**Commit:** b931e20 "test(api): add validation tests for update photo (3 tests)"

---

**Bug Fix:**
- [x] ✅ Fixed failing test: "should return only public photos (excludes private)"
  - Issue: Test expected ALL user photos to have title "Public Test"
  - Root cause: Shared user has photos from previous tests with different titles
  - Fix: Filter for specific photos uploaded in this test, verify we find 3 public photos
  - Result: Test now handles shared user scenario correctly ✅

**Commit:** 4ae2a49 "fix(api): improve public photos test assertion"

---

**Final Verification:**
- [x] ✅ Run all 27 tests: `npx playwright test tests/api/gallery.api.spec.ts --project=api-tests`
- [x] ✅ Result: **27/27 tests PASSING** (1.6s)
- [x] ✅ All update tests working (partial and full updates)
- [x] ✅ All authorization tests enforcing proper access control
- [x] ✅ All validation tests catching invalid input
- [x] ✅ Test suite stable and passing consistently

---

## Day 6 (Saturday, Nov 29): Delete & Privacy Tests

### API-DELETE-001: Delete Photo Tests (4 tests)
- [ ] Test DELETE /api/gallery/photo/{id} - By owner
  - Upload photo
  - Delete photo
  - Verify 204 NO CONTENT
  - Verify photo not in my-photos anymore

- [ ] Test DELETE /api/gallery/photo/{id} - By non-owner
  - User A uploads photo
  - User B tries to delete (403)

- [ ] Test DELETE /api/gallery/photo/{id} - Not found
  - Delete non-existent photo (404)

- [ ] Test DELETE /api/gallery/photo/{id} - Verify cascade
  - Upload 3 photos
  - Delete all 3
  - Verify my-photos returns empty

**Commit:** "test(api): add delete photo API tests with Playwright (4 tests)"

---

### API-PRIVACY-001: Privacy Toggle Tests (4 tests)
- [ ] Test PUT /api/gallery/photo/{id}/toggle-privacy - Private to public
  - Upload private photo
  - Toggle privacy
  - Verify isPublic = true
  - Verify photo appears in public gallery

- [ ] Test PUT /api/gallery/photo/{id}/toggle-privacy - Public to private
  - Upload public photo
  - Toggle privacy
  - Verify isPublic = false
  - Verify photo NOT in public gallery

- [ ] Test toggle privacy - By non-owner
  - User A's photo, User B tries to toggle (403)

- [ ] Test toggle privacy - Not found
  - Toggle non-existent photo (404)

**Commit:** "test(api): add privacy toggle API tests with Playwright (4 tests)"

---

### API-EDGE-001: Edge Cases & Error Tests (2 tests)
- [ ] Test upload - File too large (>5MB)
  - Verify 400 BAD REQUEST
  - Verify error message mentions file size

- [ ] Test upload - Invalid file type (.txt, .pdf)
  - Verify 400 BAD REQUEST
  - Verify error message mentions file type

**Commit:** "test(api): add edge cases and error handling tests (2 tests)"

---

### API-FINAL-001: Final Verification
- [ ] Run all Gallery API tests: `npx playwright test tests/api/gallery.api.spec.ts`
- [ ] Expected: ~35-38 tests pass
- [ ] Run all API tests: `npx playwright test --project="API Tests"`
- [ ] Expected: ~50-55 tests pass (15 existing + 35-40 new)
- [ ] Verify cleanup working (no leftover test data)
- [ ] View HTML report: `npx playwright show-report`

**Commit:** "test(api): complete Gallery API tests - 38 tests with Playwright and real database"

---

## Testing Commands (Playwright)

```bash
# Day 3-6: Before running tests
# Terminal 1: Start backend server
cd backend/registration-form-api
mvn spring-boot:run

# Terminal 2: Run Playwright API tests
# Run all Gallery API tests
npx playwright test tests/api/gallery.api.spec.ts

# Run with UI mode (interactive)
npx playwright test tests/api/gallery.api.spec.ts --ui

# Run all API tests
npx playwright test --project="API Tests"

# Run specific test by name
npx playwright test -g "upload photo"

# View HTML report
npx playwright show-report

# Debug mode
npx playwright test tests/api/gallery.api.spec.ts --debug
```

---

## Playwright vs REST Assured

**Why Playwright for API Tests:**
- ✅ Already configured (`playwright.config.ts` with API Tests project)
- ✅ Helper classes ready (`ApiClient`, `AuthHelper`)
- ✅ Existing API tests as reference (`auth.api.spec.ts`, `users.api.spec.ts`)
- ✅ Consistent with E2E tests (same tool, same language)
- ✅ TypeScript (better type safety than Java)
- ✅ Built-in reporters (HTML, JSON, trace viewer)

**Pattern:**
```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';

test.describe('Gallery API', () => {
  let client: ApiClient;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    client = new ApiClient(request);
    const response = await client.post('/api/auth/login', { ... });
    authToken = response.body.token;
  });

  test('should upload photo', async () => {
    const response = await client.postMultipart(
      '/api/gallery/upload',
      { file: './fixtures/test-photo.jpg', title: 'Test' },
      authToken
    );
    expect(response.status).toBe(201);
  });
});
```

---

**Plan Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED on Days 3-6 (Nov 26-29)
