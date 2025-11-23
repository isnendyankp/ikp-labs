# Implementation Checklist - Unit Tests Completion

## Quick Stats

| Phase | Task ID | Tasks | Completed | Progress |
|-------|---------|-------|-----------|----------|
| **Morning Session** | UT-CTRL-001 to UT-CTRL-015 | 15 | 0 | 0% |
| **Afternoon Session** | UT-REPO-001 to UT-REPO-012 | 12 | 0 | 0% |
| **Evening Session** | UT-FINAL-001 to UT-FINAL-003 | 3 | 0 | 0% |
| **TOTAL** | **UT-CTRL/REPO/FINAL-001+** | **30** | **0** | **0%** |

---

## Day 1 (Monday, November 24, 2025): Gallery Unit Tests

**Commit Messages (Bertahap per File):**
1. "test: add GalleryControllerTest skeleton with test infrastructure setup"
2. "test: add upload endpoint tests for GalleryControllerTest (3 tests)"
3. "test: add get my photos endpoint tests for GalleryControllerTest (2 tests)"
4. "test: add public gallery endpoint tests for GalleryControllerTest (2 tests)"
5. "test: add user public photos endpoint tests for GalleryControllerTest (2 tests)"
6. "test: add get photo detail endpoint tests for GalleryControllerTest (3 tests)"
7. "test: add update photo endpoint tests for GalleryControllerTest (3 tests)"
8. "test: add delete photo endpoint tests for GalleryControllerTest (2 tests)"
9. "test: complete GalleryControllerTest with 15 comprehensive tests"
10. "test: add GalleryPhotoRepositoryTest skeleton with Testcontainers setup"
11. "test: add save operation tests for GalleryPhotoRepositoryTest (3 tests)"
12. "test: add find operations tests for GalleryPhotoRepositoryTest (5 tests)"
13. "test: add delete and count operations tests for GalleryPhotoRepositoryTest (4 tests)"
14. "test: complete GalleryPhotoRepositoryTest with 12 comprehensive tests"
15. "test: verify all Gallery unit tests pass (27 new tests, 118 total)"
16. "docs: update test documentation with Gallery test coverage"

---

## Morning Session (2-3 hours): GalleryControllerTest

### Task UT-CTRL-001: Test Infrastructure Setup
- [ ] Create `src/test/java/com/registrationform/api/controller/GalleryControllerTest.java`
  - ✅ Status: NOT STARTED
  - 📂 File: GalleryControllerTest.java
  - ⏱️ Est: 15 min
  - 📝 Notes: Use @WebMvcTest(GalleryController.class)

- [ ] Setup class-level annotations
  - @WebMvcTest(GalleryController.class)
  - @MockBean for GalleryService
  - @Autowired MockMvc
  - @Autowired ObjectMapper

- [ ] Create @BeforeEach setup method
  - Reset GalleryService mock
  - Setup common test data (mock UserPrincipal)

- [ ] Create helper methods
  - `mockAuth()` - Returns mock Authentication with UserPrincipal
  - `createMockPhoto()` - Creates mock GalleryPhoto entity
  - `createMockPhotoList()` - Creates list of mock photos

**Verification:**
- [ ] Compile: `mvn test-compile -Dtest=GalleryControllerTest`
- [ ] Class structure ready with no compilation errors

**Commit:** "test: add GalleryControllerTest skeleton with test infrastructure setup"

---

### Task UT-CTRL-002: Upload Endpoint Tests (3 tests)
- [ ] **UT-CTRL-002a:** Test POST /api/gallery/upload - Success with valid file
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUploadPhoto_ValidFile_ShouldReturn201()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Use MockMultipartFile for JPEG upload

- [ ] **UT-CTRL-002b:** Test POST /api/gallery/upload - Invalid file type
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUploadPhoto_InvalidFileType_ShouldReturn400()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw GalleryException

- [ ] **UT-CTRL-002c:** Test POST /api/gallery/upload - File too large
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUploadPhoto_FileTooLarge_ShouldReturn400()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw GalleryException

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testUploadPhoto*`
- [ ] All 3 upload tests pass
- [ ] verify(galleryService).uploadPhoto() called with correct parameters

**Commit:** "test: add upload endpoint tests for GalleryControllerTest (3 tests)"

---

### Task UT-CTRL-003: Get My Photos Endpoint Tests (2 tests)
- [ ] **UT-CTRL-003a:** Test GET /api/gallery/my-photos - Success with pagination
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetMyPhotos_WithPagination_ShouldReturn200()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Mock service to return list of photos

- [ ] **UT-CTRL-003b:** Test GET /api/gallery/my-photos - Empty gallery
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetMyPhotos_EmptyGallery_ShouldReturnEmptyList()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to return empty list

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testGetMyPhotos*`
- [ ] Both tests pass
- [ ] Verify pagination metadata in response (page, size, totalPages, hasNext)

**Commit:** "test: add get my photos endpoint tests for GalleryControllerTest (2 tests)"

---

### Task UT-CTRL-004: Public Gallery Endpoint Tests (2 tests)
- [ ] **UT-CTRL-004a:** Test GET /api/gallery/public - Success with photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetPublicPhotos_WithPhotos_ShouldReturn200()`
  - ⏱️ Est: 10 min

- [ ] **UT-CTRL-004b:** Test GET /api/gallery/public - No public photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetPublicPhotos_NoPhotos_ShouldReturnEmptyList()`
  - ⏱️ Est: 10 min

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testGetPublicPhotos*`
- [ ] Both tests pass

**Commit:** "test: add public gallery endpoint tests for GalleryControllerTest (2 tests)"

---

### Task UT-CTRL-005: User Public Photos Endpoint Tests (2 tests)
- [ ] **UT-CTRL-005a:** Test GET /api/gallery/user/{userId}/public - Success
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetUserPublicPhotos_ValidUserId_ShouldReturn200()`
  - ⏱️ Est: 10 min

- [ ] **UT-CTRL-005b:** Test GET /api/gallery/user/{userId}/public - User has no photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetUserPublicPhotos_NoPhotos_ShouldReturnEmptyList()`
  - ⏱️ Est: 10 min

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testGetUserPublicPhotos*`
- [ ] Both tests pass

**Commit:** "test: add user public photos endpoint tests for GalleryControllerTest (2 tests)"

---

### Task UT-CTRL-006: Get Photo Detail Endpoint Tests (3 tests)
- [ ] **UT-CTRL-006a:** Test GET /api/gallery/photo/{photoId} - Success for public photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetPhotoDetail_PublicPhoto_ShouldReturn200()`
  - ⏱️ Est: 10 min

- [ ] **UT-CTRL-006b:** Test GET /api/gallery/photo/{photoId} - Photo not found
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetPhotoDetail_NotFound_ShouldReturn404()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw GalleryNotFoundException

- [ ] **UT-CTRL-006c:** Test GET /api/gallery/photo/{photoId} - Unauthorized access to private photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testGetPhotoDetail_PrivatePhotoUnauthorized_ShouldReturn403()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw UnauthorizedGalleryAccessException

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testGetPhotoDetail*`
- [ ] All 3 tests pass

**Commit:** "test: add get photo detail endpoint tests for GalleryControllerTest (3 tests)"

---

### Task UT-CTRL-007: Update Photo Endpoint Tests (3 tests)
- [ ] **UT-CTRL-007a:** Test PUT /api/gallery/photo/{photoId} - Success by owner
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUpdatePhoto_ByOwner_ShouldReturn200()`
  - ⏱️ Est: 15 min

- [ ] **UT-CTRL-007b:** Test PUT /api/gallery/photo/{photoId} - Unauthorized (not owner)
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUpdatePhoto_NotOwner_ShouldReturn403()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw UnauthorizedGalleryAccessException

- [ ] **UT-CTRL-007c:** Test PUT /api/gallery/photo/{photoId} - Photo not found
  - ✅ Status: NOT STARTED
  - 📂 Method: `testUpdatePhoto_NotFound_ShouldReturn404()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw GalleryNotFoundException

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testUpdatePhoto*`
- [ ] All 3 tests pass

**Commit:** "test: add update photo endpoint tests for GalleryControllerTest (3 tests)"

---

### Task UT-CTRL-008: Delete Photo Endpoint Tests (2 tests)
- [ ] **UT-CTRL-008a:** Test DELETE /api/gallery/photo/{photoId} - Success by owner
  - ✅ Status: NOT STARTED
  - 📂 Method: `testDeletePhoto_ByOwner_ShouldReturn204()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Verify HTTP 204 No Content

- [ ] **UT-CTRL-008b:** Test DELETE /api/gallery/photo/{photoId} - Unauthorized (not owner)
  - ✅ Status: NOT STARTED
  - 📂 Method: `testDeletePhoto_NotOwner_ShouldReturn403()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Mock service to throw UnauthorizedGalleryAccessException

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryControllerTest#testDeletePhoto*`
- [ ] Both tests pass

**Commit:** "test: add delete photo endpoint tests for GalleryControllerTest (2 tests)"

---

### Task UT-CTRL-009: Final Controller Test Verification
- [ ] Run all GalleryControllerTest tests
  - ✅ Command: `mvn test -Dtest=GalleryControllerTest`
  - ✅ Expected: All 15 tests pass (100%)

- [ ] Verify test coverage for GalleryController
  - ✅ Command: `mvn test jacoco:report`
  - ✅ Expected: >85% line coverage for GalleryController.java

- [ ] Code review checklist
  - [ ] All tests follow AAA pattern (Arrange-Act-Assert)
  - [ ] All tests have comprehensive Javadoc
  - [ ] All tests use @DisplayName annotation
  - [ ] All service interactions verified with verify()
  - [ ] All HTTP status codes verified
  - [ ] All JSON responses verified with jsonPath()

**Verification:**
- [ ] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
- [ ] JaCoCo report shows GalleryController >85% coverage
- [ ] No @Disabled annotations

**Commit:** "test: complete GalleryControllerTest with 15 comprehensive tests"

---

## Afternoon Session (2-3 hours): GalleryPhotoRepositoryTest

### Task UT-REPO-001: Test Infrastructure Setup
- [ ] Create `src/test/java/com/registrationform/api/repository/GalleryPhotoRepositoryTest.java`
  - ✅ Status: NOT STARTED
  - 📂 File: GalleryPhotoRepositoryTest.java
  - ⏱️ Est: 15 min
  - 📝 Notes: Extend AbstractIntegrationTest for Testcontainers

- [ ] Setup class-level annotations
  - @DataJpaTest
  - @AutoConfigureTestDatabase(replace = NONE)
  - @Transactional
  - Extend AbstractIntegrationTest

- [ ] Autowire dependencies
  - GalleryPhotoRepository
  - UserRepository (needed for foreign key)
  - EntityManager

- [ ] Create @BeforeEach setup method
  - Clean database (deleteAll)
  - Create test user
  - Flush and clear EntityManager

- [ ] Create helper methods
  - `createUser(email)` - Creates and saves User
  - `createPhoto(userId, filePath, isPublic)` - Creates and saves GalleryPhoto
  - `flushAndClear()` - Calls entityManager.flush() and clear()

**Verification:**
- [ ] Compile: `mvn test-compile -Dtest=GalleryPhotoRepositoryTest`
- [ ] Testcontainers PostgreSQL starts successfully

**Commit:** "test: add GalleryPhotoRepositoryTest skeleton with Testcontainers setup"

---

### Task UT-REPO-002: Save Operation Tests (3 tests)
- [ ] **UT-REPO-002a:** Test save() - Create new photo with all fields
  - ✅ Status: NOT STARTED
  - 📂 Method: `testSave_NewPhoto_ShouldPersistWithGeneratedId()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Verify auto-generated ID, createdAt, updatedAt

- [ ] **UT-REPO-002b:** Test save() - Create photo with minimal fields
  - ✅ Status: NOT STARTED
  - 📂 Method: `testSave_MinimalFields_ShouldUseDefaults()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Verify default isPublic = false

- [ ] **UT-REPO-002c:** Test save() - Update existing photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testSave_UpdateExisting_ShouldUpdateFields()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Verify updatedAt changes, createdAt stays same

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryPhotoRepositoryTest#testSave*`
- [ ] All 3 save tests pass
- [ ] Verify database persistence with findById()

**Commit:** "test: add save operation tests for GalleryPhotoRepositoryTest (3 tests)"

---

### Task UT-REPO-003: Find Operations Tests (5 tests)
- [ ] **UT-REPO-003a:** Test findById() - Existing photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testFindById_ExistingPhoto_ShouldReturnPhoto()`
  - ⏱️ Est: 10 min

- [ ] **UT-REPO-003b:** Test findById() - Non-existent photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testFindById_NonExistent_ShouldReturnEmpty()`
  - ⏱️ Est: 5 min

- [ ] **UT-REPO-003c:** Test findByUserId() - Multiple photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testFindByUserId_MultiplePhotos_ShouldReturnAll()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Create 3 photos for user A, 2 for user B, verify isolation

- [ ] **UT-REPO-003d:** Test findByIsPublicTrue() - Public photos only
  - ✅ Status: NOT STARTED
  - 📂 Method: `testFindByIsPublicTrue_ShouldReturnOnlyPublic()`
  - ⏱️ Est: 15 min
  - 📝 Notes: Create 5 public + 3 private, verify only 5 returned

- [ ] **UT-REPO-003e:** Test findByUserIdAndIsPublicTrue() - User's public photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testFindByUserIdAndIsPublicTrue_ShouldReturnUserPublicOnly()`
  - ⏱️ Est: 15 min
  - 📝 Notes: User has 2 public + 2 private, verify only 2 returned

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryPhotoRepositoryTest#testFind*`
- [ ] All 5 find tests pass

**Commit:** "test: add find operations tests for GalleryPhotoRepositoryTest (5 tests)"

---

### Task UT-REPO-004: Delete and Count Operations Tests (4 tests)
- [ ] **UT-REPO-004a:** Test delete() - Remove existing photo
  - ✅ Status: NOT STARTED
  - 📂 Method: `testDelete_ExistingPhoto_ShouldRemoveFromDatabase()`
  - ⏱️ Est: 10 min

- [ ] **UT-REPO-004b:** Test existsById() - Photo exists and not exists
  - ✅ Status: NOT STARTED
  - 📂 Method: `testExistsById_ShouldReturnCorrectBoolean()`
  - ⏱️ Est: 10 min

- [ ] **UT-REPO-004c:** Test countByUserId() - Count user's photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testCountByUserId_ShouldReturnCorrectCount()`
  - ⏱️ Est: 10 min
  - 📝 Notes: Create 3 photos for user A, verify count = 3

- [ ] **UT-REPO-004d:** Test cascade delete - Delete user deletes photos
  - ✅ Status: NOT STARTED
  - 📂 Method: `testCascadeDelete_DeleteUser_ShouldDeletePhotos()`
  - ⏱️ Est: 20 min
  - 📝 Notes: Create user with 3 photos, delete user, verify photos gone

**Verification:**
- [ ] Run tests: `mvn test -Dtest=GalleryPhotoRepositoryTest#testDelete* -Dtest=GalleryPhotoRepositoryTest#testExists* -Dtest=GalleryPhotoRepositoryTest#testCount* -Dtest=GalleryPhotoRepositoryTest#testCascade*`
- [ ] All 4 tests pass

**Commit:** "test: add delete and count operations tests for GalleryPhotoRepositoryTest (4 tests)"

---

### Task UT-REPO-005: Final Repository Test Verification
- [ ] Run all GalleryPhotoRepositoryTest tests
  - ✅ Command: `mvn test -Dtest=GalleryPhotoRepositoryTest`
  - ✅ Expected: All 12 tests pass (100%)

- [ ] Verify test coverage for GalleryPhotoRepository
  - ✅ Command: `mvn test jacoco:report`
  - ✅ Expected: >90% line coverage for GalleryPhotoRepository.java

- [ ] Code review checklist
  - [ ] All tests follow AAA pattern
  - [ ] All tests use Testcontainers PostgreSQL
  - [ ] All tests use @Transactional for auto-rollback
  - [ ] All tests use EntityManager.flush() and clear() correctly
  - [ ] All tests verify database state

**Verification:**
- [ ] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
- [ ] JaCoCo report shows GalleryPhotoRepository >90% coverage
- [ ] Testcontainers container starts and stops properly

**Commit:** "test: complete GalleryPhotoRepositoryTest with 12 comprehensive tests"

---

## Evening Session (1 hour): Final Verification and Documentation

### Task UT-FINAL-001: Run Full Unit Test Suite
- [ ] Run all unit tests (existing + new Gallery tests)
  - ✅ Command: `mvn test`
  - ✅ Expected: ~118 tests pass (91 existing + 27 new)

- [ ] Verify test execution time
  - ✅ Expected: <2 minutes total

- [ ] Verify no test failures or errors
  - ✅ Tests run: ~118
  - ✅ Failures: 0
  - ✅ Errors: 0
  - ✅ Skipped: 0

**Verification:**
- [ ] All unit tests passing
- [ ] No compilation errors
- [ ] No @Disabled annotations

**Commit:** "test: verify all Gallery unit tests pass (27 new tests, 118 total)"

---

### Task UT-FINAL-002: Generate and Verify Coverage Report
- [ ] Generate JaCoCo coverage report
  - ✅ Command: `mvn clean test jacoco:report`

- [ ] Open coverage report
  - ✅ Command: `open target/site/jacoco/index.html`

- [ ] Verify coverage thresholds
  - [ ] GalleryController: >85% line coverage
  - [ ] GalleryPhotoRepository: >90% line coverage
  - [ ] Overall backend: Check if still meets project standards

- [ ] Screenshot coverage report for documentation

**Verification:**
- [ ] Coverage report generated successfully
- [ ] All coverage thresholds met

---

### Task UT-FINAL-003: Update Documentation
- [ ] Update test count in project documentation
  - 📂 File: `/docs/testing/unit-test-summary.md`
  - ✅ Update total unit test count: ~118 tests
  - ✅ Add Gallery test breakdown: 15 controller + 12 repository

- [ ] Update testing commands reference
  - 📂 File: `/docs/reference/testing-commands.md`
  - ✅ Add commands to run Gallery tests specifically

- [ ] Update plan status
  - 📂 File: This checklist (mark all tasks complete)
  - 📂 File: `README.md` (update status to COMPLETED)

**Commit:** "docs: update test documentation with Gallery test coverage"

---

## Daily Progress Log

### Date: 2025-11-24 (Day 1)
**Status:** ⏳ NOT STARTED → ✅ TO BE COMPLETED

**Completed Tasks:**
- [ ] GalleryControllerTest created (15 tests)
- [ ] GalleryPhotoRepositoryTest created (12 tests)
- [ ] All tests passing (27 new tests)
- [ ] Coverage verified (>85% controller, >90% repository)
- [ ] Documentation updated

**Challenges:**
- TBD during implementation

**Learnings:**
- TBD during implementation

**Next Steps:**
- Mark this plan as COMPLETED
- Move to Integration Tests (Day 2)

---

## Completion Criteria

### Must Have (Required)
- [x] GalleryControllerTest exists with 10-15 tests
- [x] GalleryPhotoRepositoryTest exists with 10-12 tests
- [x] All new tests pass (100% pass rate)
- [x] GalleryController coverage >85%
- [x] GalleryPhotoRepository coverage >90%
- [x] All tests follow AAA pattern
- [x] All tests have Javadoc comments
- [x] All tests use proper naming convention
- [x] Code committed to Git with proper messages

### Should Have (Recommended)
- [x] Test execution time <30 seconds for new tests
- [x] Test documentation updated
- [x] Coverage report generated
- [x] No @Disabled annotations
- [x] All verify() statements in controller tests

### Nice to Have (Optional)
- [ ] Test code reviewed by peer
- [ ] Additional edge case tests
- [ ] Performance benchmarks for repository tests

---

## Testing Commands Reference

### Run Individual Test Classes
```bash
# Run GalleryControllerTest only
mvn test -Dtest=GalleryControllerTest

# Run GalleryPhotoRepositoryTest only
mvn test -Dtest=GalleryPhotoRepositoryTest

# Run both Gallery tests
mvn test -Dtest=Gallery*Test
```

### Run by Test Method
```bash
# Run specific test method
mvn test -Dtest=GalleryControllerTest#testUploadPhoto_ValidFile_ShouldReturn201

# Run all upload tests
mvn test -Dtest=GalleryControllerTest#testUploadPhoto*

# Run all save tests
mvn test -Dtest=GalleryPhotoRepositoryTest#testSave*
```

### Run with Coverage
```bash
# Generate coverage report
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Run All Unit Tests
```bash
# Run full unit test suite
mvn test

# Run with detailed output
mvn test -X

# Run with summary only
mvn test --quiet
```

---

## Troubleshooting Checklist

### If Tests Don't Compile
- [ ] Check @WebMvcTest imports
- [ ] Check @DataJpaTest imports
- [ ] Check Mockito imports
- [ ] Run `mvn clean compile test-compile`

### If Controller Tests Fail
- [ ] Verify GalleryService is @MockBean
- [ ] Verify when().thenReturn() mocking is correct
- [ ] Verify MockMvc request mapping
- [ ] Check authentication mocking

### If Repository Tests Fail
- [ ] Verify Testcontainers PostgreSQL started
- [ ] Verify @BeforeEach cleanup runs
- [ ] Verify foreign key constraints (User must exist)
- [ ] Check EntityManager flush() and clear() usage

### If Coverage is Low
- [ ] Check if all endpoints tested
- [ ] Check if all exception paths tested
- [ ] Check if edge cases covered
- [ ] Review JaCoCo exclusions in pom.xml

---

## Tips for Success

1. **Commit Frequently (Bertahap!):**
   - Commit after every 2-3 tests (not all at once)
   - Use meaningful commit messages
   - Push to GitHub to show daily activity

2. **Test One Method at a Time:**
   - Don't write all 15 tests at once
   - Write 1 test → Run → Pass → Commit
   - Iterate quickly

3. **Use Existing Tests as Reference:**
   - Copy structure from UserControllerTest
   - Copy patterns from UserRepositoryTest
   - Don't reinvent the wheel

4. **Verify Immediately:**
   - Run test after writing it
   - Don't wait until all tests written
   - Fix failures immediately

5. **Keep Tests Simple:**
   - One assertion per test (when possible)
   - Clear AAA pattern
   - Descriptive test names

---

## Success Metrics Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| GalleryControllerTest count | 10-15 | TBD | ⏳ |
| GalleryPhotoRepositoryTest count | 10-12 | TBD | ⏳ |
| Total new tests | 20-27 | TBD | ⏳ |
| GalleryController coverage | >85% | TBD | ⏳ |
| GalleryPhotoRepository coverage | >90% | TBD | ⏳ |
| Test execution time | <30s | TBD | ⏳ |
| Pass rate | 100% | TBD | ⏳ |

---

**Plan Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED on 2025-11-24
