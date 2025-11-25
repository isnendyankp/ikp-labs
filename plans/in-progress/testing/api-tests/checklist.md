# Implementation Checklist - API Tests (Playwright)

## Quick Stats (Days 3-6)

| Day | Focus | Tasks | Completed | Progress |
|-----|-------|-------|-----------|----------|
| **Day 3 (Wed)** | Setup + Upload & Get | 8 | 0 | 0% |
| **Day 4 (Thu)** | Get Detail & Pagination | 10 | 0 | 0% |
| **Day 5 (Fri)** | Update & Authorization | 10 | 0 | 0% |
| **Day 6 (Sat)** | Delete & Privacy | 10 | 0 | 0% |
| **TOTAL** | **4 Days** | **38** | **0** | **0%** |

---

## Day 3 (Wednesday, Nov 26): Setup + Upload & Get Photos

**Prerequisites:**
- [ ] PostgreSQL running locally
- [ ] Database `registrationform_db` exists
- [ ] Backend server NOT running yet (will start manually)
- [ ] Playwright already installed (verify: `npm list @playwright/test`)

### API-SETUP-001: Environment Verification
- [ ] Verify PostgreSQL running: `psql -U postgres -d registrationform_db`
- [ ] Verify Playwright installed: `npm list @playwright/test`
- [ ] Verify existing API tests work: `npx playwright test tests/api/auth.api.spec.ts`
- [ ] Create test data folder: `tests/fixtures/images/`
- [ ] Add test photos: `test-photo.jpg`, `test-photo.png`, `large-photo.jpg` (>5MB)

### API-SETUP-002: Backend Server Start
- [ ] Open Terminal 1
- [ ] Navigate: `cd backend/registration-form-api`
- [ ] Run: `mvn spring-boot:run`
- [ ] Verify server starts on port 8081
- [ ] Verify health check: `curl http://localhost:8081/api/auth/health`

### API-SETUP-003: Study Existing Pattern
- [ ] Read `tests/api/auth.api.spec.ts` for pattern reference
- [ ] Understand `ApiClient` usage in `tests/api/helpers/api-client.ts`
- [ ] Understand `AuthHelper` for JWT management
- [ ] Review test data generators in `tests/api/helpers/test-data.ts`

**Commit:** "test(api): verify Playwright API test infrastructure ready"

---

### API-CREATE-001: Create Gallery API Test File
- [ ] Create `tests/api/gallery.api.spec.ts`
- [ ] Import dependencies (test, expect, ApiClient, AuthHelper)
- [ ] Setup test.describe block for Gallery API
- [ ] Add test.beforeAll for authentication setup
- [ ] Add test.afterEach for cleanup
- [ ] Add helper variables (authToken, client, testUser)

**Commit:** "test(api): add gallery.api.spec.ts skeleton with Playwright setup"

---

### API-UPLOAD-001: Upload Photo Tests (3-4 tests)
- [ ] Test POST /api/gallery/upload - Valid JPEG with full metadata
  - Verify 201 CREATED
  - Verify response body (id, title, description, isPublic, filePath)
  - Verify database record exists (query via API)

- [ ] Test POST /api/gallery/upload - Minimal metadata (title only)
  - Verify defaults (isPublic = false, description = null)

- [ ] Test POST /api/gallery/upload - Without authentication
  - Verify 403 FORBIDDEN

- [ ] Test POST /api/gallery/upload - Invalid file type (.pdf)
  - Verify 400 BAD REQUEST
  - Verify error message

**Commit:** "test(api): add upload photo API tests with Playwright (3-4 tests)"

---

### API-GET-001: Get Photos Tests (3 tests)
- [ ] Test GET /api/gallery/my-photos - With photos
  - Upload 2 photos first (1 public, 1 private)
  - Verify response contains both photos
  - Verify pagination metadata (totalPhotos, currentPage)

- [ ] Test GET /api/gallery/public - Only public photos
  - Upload 1 public + 1 private photo
  - Verify response contains only public photo

- [ ] Test GET /api/gallery/photo/{photoId} - Get by ID
  - Upload 1 photo
  - Get photo detail
  - Verify all fields present (id, title, ownerName, etc)

**Commit:** "test(api): add get photos API tests with Playwright (3 tests)"

---

## Day 4 (Thursday, Nov 27): Get Detail & Pagination Tests

### API-DETAIL-001: Photo Detail Tests (5 tests)
- [ ] Test GET /api/gallery/photo/{id} - Public photo by anyone
  - User A uploads public photo
  - User B retrieves it successfully

- [ ] Test GET /api/gallery/photo/{id} - Private photo by owner
  - User A uploads private photo
  - User A retrieves it successfully (200 OK)

- [ ] Test GET /api/gallery/photo/{id} - Private photo by non-owner
  - User A uploads private photo
  - User B tries to retrieve (403 FORBIDDEN)

- [ ] Test GET /api/gallery/photo/{id} - Photo not found
  - Request non-existent ID
  - Verify 404 NOT FOUND

- [ ] Test GET /api/gallery/photo/{id} - Response structure
  - Verify all fields present and correct types

**Commit:** "test(api): add photo detail API tests with authorization (5 tests)"

---

### API-PAGINATION-001: Pagination Tests (5 tests)
- [ ] Test GET /api/gallery/my-photos - Pagination page 0
  - Upload 15 photos
  - Get page 0, size 12
  - Verify 12 photos returned, totalPages = 2

- [ ] Test GET /api/gallery/my-photos - Pagination page 1
  - Verify 3 photos returned (remainder)
  - Verify hasNext = false, hasPrevious = true

- [ ] Test GET /api/gallery/my-photos - Empty gallery
  - New user with no photos
  - Verify empty array, totalPhotos = 0

- [ ] Test GET /api/gallery/public - Pagination
  - Upload 20 public photos
  - Verify pagination works correctly

- [ ] Test GET /api/gallery/user/{userId}/public - Specific user
  - User A uploads 5 public photos
  - Get User A's public photos
  - Verify only User A's photos returned

**Commit:** "test(api): add pagination API tests with Playwright (5 tests)"

---

## Day 5 (Friday, Nov 28): Update & Authorization Tests

### API-UPDATE-001: Update Photo Tests (5 tests)
- [ ] Test PUT /api/gallery/photo/{id} - Update by owner
  - Upload photo with title "Old Title"
  - Update to "New Title"
  - Verify 200 OK, response has new title
  - Verify database updated

- [ ] Test PUT /api/gallery/photo/{id} - Update by non-owner
  - User A uploads photo
  - User B tries to update (403 FORBIDDEN)

- [ ] Test PUT /api/gallery/photo/{id} - Partial update (title only)
  - Update only title, description unchanged

- [ ] Test PUT /api/gallery/photo/{id} - Partial update (description only)
  - Update only description, title unchanged

- [ ] Test PUT /api/gallery/photo/{id} - Not found
  - Update non-existent photo (404)

**Commit:** "test(api): add update photo API tests with Playwright (5 tests)"

---

### API-AUTH-001: Authorization Tests (5 tests)
- [ ] Test upload - Without JWT token
  - Verify 403 FORBIDDEN

- [ ] Test get my-photos - Without JWT
  - Verify 403 FORBIDDEN

- [ ] Test update - Wrong user's photo
  - User A's photo, User B tries to update
  - Verify 403 FORBIDDEN with proper error message

- [ ] Test delete - Wrong user's photo
  - User A's photo, User B tries to delete
  - Verify 403 FORBIDDEN

- [ ] Test toggle privacy - Wrong user
  - Verify 403 FORBIDDEN

**Commit:** "test(api): add authorization API tests with Playwright (5 tests)"

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
