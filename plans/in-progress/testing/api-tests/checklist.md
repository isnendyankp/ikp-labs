# Implementation Checklist - API Tests

## Quick Stats (Days 3-6)

| Day | Focus | Tasks | Completed | Progress |
|-----|-------|-------|-----------|----------|
| **Day 3 (Wed)** | Setup + Auth/User | 10 | 0 | 0% |
| **Day 4 (Thu)** | Profile + Gallery Upload | 12 | 0 | 0% |
| **Day 5 (Fri)** | Gallery Retrieve | 12 | 0 | 0% |
| **Day 6 (Sat)** | Gallery Update/Delete | 14 | 0 | 0% |
| **TOTAL** | **4 Days** | **48** | **0** | **0%** |

---

## Day 3 (Wednesday, Nov 26): Setup + Auth/User API Tests

**Prerequisites:**
- [ ] PostgreSQL running locally
- [ ] Database `registrationform_db` exists
- [ ] Server NOT running yet (will start manually)

### API-SETUP-001: Environment Verification
- [ ] Verify PostgreSQL running: `psql -U postgres -d registrationform_db`
- [ ] Verify database clean or create fresh
- [ ] Create test resources folder: `src/test/resources/`
- [ ] Add test photos: `test-photo.jpg`, `test-photo.png`, `large-photo.jpg` (>5MB), `invalid.pdf`

### API-SETUP-002: Server Start
- [ ] Open Terminal 1
- [ ] Run: `mvn spring-boot:run`
- [ ] Verify server starts on port 8081
- [ ] Verify no errors in console

### API-SETUP-003: Run Existing API Tests (Smoke Test)
- [ ] Open Terminal 2
- [ ] Run: `mvn test -Dtest=AuthControllerAPITest`
- [ ] Verify tests pass (proves setup working)

**Commit:** "test(api): verify API test infrastructure ready for Gallery tests"

---

## Day 4 (Thursday, Nov 27): Profile + Gallery Upload API Tests

### API-UPLOAD-001: Gallery Upload Tests (10 tests)
- [ ] Create `src/test/java/com/registrationform/api/api/GalleryAPITest.java`
- [ ] Extend BaseAPITest pattern
- [ ] Test POST /api/gallery/upload - Valid JPEG (verify DB + file)
- [ ] Test POST /api/gallery/upload - Valid PNG
- [ ] Test POST /api/gallery/upload - File too large (>5MB) - 400
- [ ] Test POST /api/gallery/upload - Invalid type (.pdf) - 400
- [ ] Test POST /api/gallery/upload - Without JWT - 401
- [ ] Test POST /api/gallery/upload - With title and description
- [ ] Test POST /api/gallery/upload - Default privacy (private)
- [ ] Test POST /api/gallery/upload - Public photo
- [ ] Verify file exists on disk after upload
- [ ] Verify database record created

**Commit:** "test(api): add Gallery photo upload API tests with real database (10 tests)"

---

## Day 5 (Friday, Nov 28): Gallery Retrieve API Tests

### API-GET-001: Retrieve Tests (12 tests)
- [ ] Test GET /api/gallery/my-photos - Owner sees all photos (public + private)
- [ ] Test GET /api/gallery/my-photos - Pagination page 0
- [ ] Test GET /api/gallery/my-photos - Pagination page 1
- [ ] Test GET /api/gallery/my-photos - Empty gallery
- [ ] Test GET /api/gallery/public - Shows only public photos
- [ ] Test GET /api/gallery/public - Pagination
- [ ] Test GET /api/gallery/user/{userId}/public - Specific user's public photos
- [ ] Test GET /api/gallery/photo/{photoId} - Public photo (anyone can view)
- [ ] Test GET /api/gallery/photo/{photoId} - Private photo by owner (200)
- [ ] Test GET /api/gallery/photo/{photoId} - Private photo by non-owner (403)
- [ ] Test GET /api/gallery/photo/{photoId} - Photo not found (404)
- [ ] Verify response JSON structure

**Commit:** "test(api): add Gallery retrieve and pagination API tests (12 tests)"

---

## Day 6 (Saturday, Nov 29): Gallery Update/Delete/Privacy API Tests

### API-UPDATE-001: Update Tests (8 tests)
- [ ] Test PUT /api/gallery/photo/{photoId} - Update by owner (200)
- [ ] Test PUT /api/gallery/photo/{photoId} - Update by non-owner (403)
- [ ] Test PUT /api/gallery/photo/{photoId} - Not found (404)
- [ ] Test PUT /api/gallery/photo/{photoId} - Partial update (title only)
- [ ] Test PUT /api/gallery/photo/{photoId} - Partial update (description only)
- [ ] Test PUT /api/gallery/photo/{photoId} - Validation error (empty title)
- [ ] Verify database updated (query DB)
- [ ] Verify updatedAt timestamp changed

**Commit:** "test(api): add Gallery update API tests (8 tests)"

### API-DELETE-001: Delete Tests (6 tests)
- [ ] Test DELETE /api/gallery/photo/{photoId} - By owner (204)
- [ ] Test DELETE /api/gallery/photo/{photoId} - By non-owner (403)
- [ ] Test DELETE /api/gallery/photo/{photoId} - Not found (404)
- [ ] Verify file deleted from disk
- [ ] Verify database record deleted
- [ ] Test cascade: Delete user deletes their photos

**Commit:** "test(api): add Gallery delete API tests (6 tests)"

### API-PRIVACY-001: Privacy Tests (4 tests)
- [ ] Test PUT /api/gallery/photo/{photoId}/toggle-privacy - Private to public
- [ ] Test PUT /api/gallery/photo/{photoId}/toggle-privacy - Public to private
- [ ] Verify private photo NOT in public gallery
- [ ] Verify public photo IN public gallery

**Commit:** "test(api): add Gallery privacy toggle API tests (4 tests)"

### API-FINAL-001: Final Verification
- [ ] Run all Gallery API tests: `mvn test -Dtest=GalleryAPITest`
- [ ] Expected: ~38 tests pass
- [ ] Run all API tests: `mvn test -Dtest=*APITest`
- [ ] Expected: ~69 tests pass (31 existing + 38 new)
- [ ] Verify cleanup working (no leftover test data)

**Commit:** "test(api): complete Gallery API tests - 38 tests with real database"

---

## Testing Commands

```bash
# Day 4-6: Before running tests
# Terminal 1:
mvn spring-boot:run

# Terminal 2:
mvn test -Dtest=GalleryAPITest

# Run all API tests
mvn test -Dtest=*APITest
```

---

**Plan Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED on Days 3-6 (Nov 26-29)
