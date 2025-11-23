# Implementation Checklist - Integration Tests

## Quick Stats

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| **Setup** | 3 | 0 | 0% |
| **Upload Tests** | 3 | 0 | 0% |
| **Get Tests** | 8 | 0 | 0% |
| **Update/Delete Tests** | 7 | 0 | 0% |
| **Verification** | 2 | 0 | 0% |
| **TOTAL** | **23** | **0** | **0%** |

---

## Day 2 (Tuesday, November 25, 2025): Gallery Integration Tests

**Commit Messages (Bertahap per Batch):**
1. "test: add GalleryControllerIntegrationTest skeleton with @SpringBootTest setup"
2. "test: add upload endpoint integration tests (3 tests)"
3. "test: add get endpoints integration tests for my-photos and public (4 tests)"
4. "test: add get photo detail integration tests with authorization (4 tests)"
5. "test: add update photo integration tests (3 tests)"
6. "test: add delete and toggle privacy integration tests (4 tests)"
7. "test: complete GalleryControllerIntegrationTest with 18 tests"
8. "docs: update integration test documentation with Gallery coverage"

---

## Morning Session: Test Setup and Upload Tests

### IT-SETUP-001: Test Infrastructure
- [ ] Create `src/test/java/com/registrationform/api/integration/GalleryControllerIntegrationTest.java`
  - @SpringBootTest
  - @AutoConfigureMockMvc(addFilters = false)
  - @Autowired MockMvc, ObjectMapper
  - @MockBean GalleryPhotoRepository, UserRepository

- [ ] Create @BeforeEach setup
  - Reset mocks: reset(galleryPhotoRepository, userRepository)

- [ ] Create helper methods
  - `mockAuth()` - Mock Authentication
  - `createMockUser()` - Create User entity
  - `createMockPhoto()` - Create GalleryPhoto entity

**Commit:** "test: add GalleryControllerIntegrationTest skeleton with @SpringBootTest setup"

---

### IT-UPLOAD-001: Upload Endpoint Tests (3 tests)
- [ ] Test POST /api/gallery/upload - Success
  - Mock userRepository.findByEmail()
  - Mock galleryPhotoRepository.save()
  - Verify 201 CREATED
  - verify(repository).save()

- [ ] Test POST /api/gallery/upload - Invalid file type
  - Mock service throws GalleryException
  - Verify 400 BAD REQUEST

- [ ] Test POST /api/gallery/upload - No authentication
  - NO auth token
  - Verify 401 UNAUTHORIZED (if security enabled)

**Commit:** "test: add upload endpoint integration tests (3 tests)"

---

## Mid-Morning: Get Endpoints Tests

### IT-GET-001: My Photos and Public Endpoints (4 tests)
- [ ] Test GET /api/gallery/my-photos - With photos
  - Mock repository.findByUserId() returns list
  - Verify 200 OK
  - Verify pagination metadata

- [ ] Test GET /api/gallery/my-photos - Empty gallery
  - Mock repository returns empty list
  - Verify 200 OK with empty array

- [ ] Test GET /api/gallery/public - With public photos
  - Mock repository.findByIsPublicTrue()
  - Verify 200 OK

- [ ] Test GET /api/gallery/user/{userId}/public - Valid user
  - Mock repository.findByUserIdAndIsPublicTrue()
  - Verify 200 OK

**Commit:** "test: add get endpoints integration tests for my-photos and public (4 tests)"

---

### IT-GET-002: Get Photo Detail with Authorization (4 tests)
- [ ] Test GET /api/gallery/photo/{id} - Public photo
  - Mock repository.findById() returns public photo
  - Verify 200 OK

- [ ] Test GET /api/gallery/photo/{id} - Private photo by owner
  - Mock photo with userId = current user
  - Verify 200 OK

- [ ] Test GET /api/gallery/photo/{id} - Private photo by non-owner
  - Mock photo with different userId
  - Verify 403 FORBIDDEN

- [ ] Test GET /api/gallery/photo/{id} - Photo not found
  - Mock repository.findById() returns empty
  - Verify 404 NOT FOUND

**Commit:** "test: add get photo detail integration tests with authorization (4 tests)"

---

## Afternoon: Update and Delete Tests

### IT-UPDATE-001: Update Photo Tests (3 tests)
- [ ] Test PUT /api/gallery/photo/{id} - Update by owner
  - Mock repository.findById() returns photo owned by current user
  - Mock repository.save()
  - Verify 200 OK
  - verify(repository).save()

- [ ] Test PUT /api/gallery/photo/{id} - Update by non-owner
  - Mock photo owned by different user
  - Verify 403 FORBIDDEN

- [ ] Test PUT /api/gallery/photo/{id} - Photo not found
  - Mock repository.findById() returns empty
  - Verify 404 NOT FOUND

**Commit:** "test: add update photo integration tests (3 tests)"

---

### IT-DELETE-001: Delete and Toggle Privacy Tests (4 tests)
- [ ] Test DELETE /api/gallery/photo/{id} - Delete by owner
  - Mock repository.findById()
  - Mock repository.delete()
  - Verify 204 NO CONTENT
  - verify(repository).delete()

- [ ] Test DELETE /api/gallery/photo/{id} - Delete by non-owner
  - Mock photo owned by different user
  - Verify 403 FORBIDDEN

- [ ] Test PUT /api/gallery/photo/{id}/toggle-privacy - Success
  - Mock repository.findById()
  - Mock repository.save()
  - Verify 200 OK
  - Verify isPublic toggled

- [ ] Test PUT /api/gallery/photo/{id}/toggle-privacy - Unauthorized
  - Mock photo owned by different user
  - Verify 403 FORBIDDEN

**Commit:** "test: add delete and toggle privacy integration tests (4 tests)"

---

## Evening: Final Verification

### IT-FINAL-001: Run All Integration Tests
- [ ] Run GalleryControllerIntegrationTest
  - Command: `mvn test -Dtest=GalleryControllerIntegrationTest`
  - Expected: 18 tests pass

- [ ] Run ALL integration tests
  - Command: `mvn test -Dtest=*IntegrationTest`
  - Expected: ~58 tests pass (40 existing + 18 new)

- [ ] Verify execution time < 60 seconds for Gallery tests

**Commit:** "test: complete GalleryControllerIntegrationTest with 18 tests"

---

### IT-FINAL-002: Documentation Update
- [ ] Update integration test count in documentation
  - Total: ~58 integration tests

- [ ] Update testing commands reference

**Commit:** "docs: update integration test documentation with Gallery coverage"

---

## Completion Criteria

- [ ] 18 integration tests created
- [ ] All tests pass (100%)
- [ ] All 8 endpoints covered
- [ ] @MockBean for repositories
- [ ] verify() for repository interactions
- [ ] Spring context loads successfully
- [ ] Documentation updated

---

## Testing Commands

```bash
# Run Gallery integration tests only
mvn test -Dtest=GalleryControllerIntegrationTest

# Run all integration tests
mvn test -Dtest=*IntegrationTest

# Run with Spring Boot context visible
mvn test -Dtest=GalleryControllerIntegrationTest -X
```

---

**Plan Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED on 2025-11-25
