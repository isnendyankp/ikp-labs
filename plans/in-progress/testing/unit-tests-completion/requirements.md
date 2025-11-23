# Requirements - Unit Tests Completion

## Scope Definition

### What IS Included

#### 1. GalleryControllerTest (Unit Test with Mocked Service)

**Test Class:** `GalleryControllerTest.java`
**Location:** `src/test/java/com/registrationform/api/controller/GalleryControllerTest.java`
**Test Count:** 10-15 tests
**Dependencies:** Mock GalleryService (no real service or database)

**Endpoint Coverage:**

- **POST /api/gallery/upload**
  - Test upload with valid multipart file and metadata
  - Test upload with invalid file type
  - Test upload with file exceeding size limit
  - Test upload without authentication
  - Test upload with optional metadata (title, description, isPublic)
  - Verify service.uploadPhoto() is called with correct parameters

- **GET /api/gallery/my-photos**
  - Test retrieve user's photos with pagination
  - Test pagination parameters (page, size)
  - Test default pagination values
  - Verify service.getMyPhotos() is called

- **GET /api/gallery/public**
  - Test retrieve all public photos
  - Test pagination for public gallery
  - Verify service.getPublicPhotos() is called

- **GET /api/gallery/user/{userId}/public**
  - Test retrieve specific user's public photos
  - Test with valid user ID
  - Test with invalid user ID (service throws exception)
  - Verify service.getUserPublicPhotos() is called

- **GET /api/gallery/photo/{photoId}**
  - Test get photo detail by ID
  - Test with valid photo ID
  - Test with non-existent photo ID (service throws GalleryNotFoundException)
  - Test private photo access (service throws UnauthorizedGalleryAccessException)
  - Verify service.getPhotoById() is called

- **PUT /api/gallery/photo/{photoId}**
  - Test update photo metadata with valid data
  - Test update with partial data (only title, only description)
  - Test update non-existent photo (service throws exception)
  - Test update without ownership (service throws exception)
  - Verify service.updatePhoto() is called

- **DELETE /api/gallery/photo/{photoId}**
  - Test delete photo by owner
  - Test delete non-existent photo (service throws exception)
  - Test delete without ownership (service throws exception)
  - Verify service.deletePhoto() is called

- **PUT /api/gallery/photo/{photoId}/toggle-privacy**
  - Test toggle privacy from private to public
  - Test toggle privacy from public to private
  - Test toggle for non-existent photo (service throws exception)
  - Verify service.togglePrivacy() is called

**Test Patterns:**
- Use `@WebMvcTest(GalleryController.class)` to test controller in isolation
- Use `@MockBean` for GalleryService
- Use `MockMvc` to simulate HTTP requests
- Use `MockMultipartFile` for file upload testing
- Use `when().thenReturn()` to mock service responses
- Use `verify()` to ensure service methods are called correctly
- Test HTTP status codes (201, 200, 204, 400, 404, 403)
- Test JSON response structure with `jsonPath()`
- Test request validation and error responses

#### 2. GalleryPhotoRepositoryTest (Repository Test with Real Database)

**Test Class:** `GalleryPhotoRepositoryTest.java`
**Location:** `src/test/java/com/registrationform/api/repository/GalleryPhotoRepositoryTest.java`
**Test Count:** 10-12 tests
**Database:** PostgreSQL via Testcontainers (singleton pattern)

**Repository Method Coverage:**

- **save() - Create**
  - Test save new gallery photo with all fields
  - Test save with minimal fields (no title/description)
  - Verify auto-generated ID
  - Verify timestamps (createdAt, updatedAt)
  - Verify default values (isPublic = false)

- **save() - Update**
  - Test update existing photo metadata
  - Verify updatedAt timestamp changes
  - Verify createdAt timestamp remains same

- **findById()**
  - Test find existing photo by ID
  - Test find non-existent photo (should return empty)
  - Verify all fields are correctly loaded

- **findByUserId()**
  - Test find all photos for specific user
  - Test with user who has multiple photos
  - Test with user who has no photos (should return empty list)
  - Verify photos are ordered by createdAt descending

- **findByIsPublicTrue()**
  - Test find all public photos across all users
  - Test when no public photos exist
  - Verify only public photos are returned (isPublic = true)

- **findByUserIdAndIsPublicTrue()**
  - Test find specific user's public photos only
  - Test with user who has mix of public and private photos
  - Verify only public photos of that user are returned

- **delete()**
  - Test delete existing photo
  - Verify photo is removed from database
  - Test delete non-existent photo (should not throw exception)

- **existsById()**
  - Test with existing photo ID (should return true)
  - Test with non-existent photo ID (should return false)

- **count() and countByUserId()**
  - Test total photo count
  - Test photo count for specific user
  - Test count when no photos exist (should return 0)

- **Cascade Delete Behavior**
  - Test when user is deleted, their gallery photos are also deleted
  - Verify orphan photos don't remain in database

- **Pagination Queries** (if custom queries exist)
  - Test pagination with Pageable parameter
  - Verify page size and sorting

**Test Patterns:**
- Extend `AbstractIntegrationTest` for singleton Testcontainers
- Use `@DataJpaTest` with `@AutoConfigureTestDatabase(replace = NONE)`
- Use `@Autowired` for repository and EntityManager
- Use `@Transactional` for auto-rollback between tests
- Use EntityManager for test data setup (create User, create GalleryPhoto)
- Use `entityManager.flush()` and `entityManager.clear()` to control persistence context
- Test with REAL PostgreSQL database (production-like)
- Verify database constraints (foreign key, NOT NULL)
- Test cascade relationships (User → GalleryPhoto)

### What is NOT Included

#### 1. Integration Tests
- NOT testing Controller → Service → Repository interaction
- NOT testing full Spring context with real components wired together
- NOT testing @SpringBootTest scenarios
- (These are covered in Integration Tests plan)

#### 2. API Tests with Real Database
- NOT testing with real HTTP server running
- NOT using REST Assured
- NOT testing with local PostgreSQL (mvn spring-boot:run required)
- NOT testing end-to-end API flows
- (These are covered in API Tests plan)

#### 3. End-to-End Tests
- NOT testing with frontend
- NOT using Playwright
- NOT testing browser interactions
- (These are covered in E2E Tests plan for Week 2)

#### 4. Other Features
- NOT testing Auth, User, Profile features (already have unit tests)
- NOT adding FileStorageService tests (already exists)
- NOT re-testing GalleryService (already has 18 tests)

#### 5. Performance and Load Testing
- NOT testing concurrent uploads
- NOT testing large file uploads (>100MB)
- NOT testing database performance under load
- NOT testing memory usage

## User Stories

### Story 1: GalleryController Unit Tests
**As a** backend developer
**I want** comprehensive unit tests for GalleryController
**So that** I can verify all REST endpoints work correctly in isolation

**Acceptance Criteria:**
- ✅ All 8 endpoints have at least 1 happy path test
- ✅ All 8 endpoints have at least 1 error path test
- ✅ File upload endpoints test with MockMultipartFile
- ✅ Service methods are verified with Mockito verify()
- ✅ HTTP status codes are correct (201, 200, 204, 404, 403, 400)
- ✅ JSON response structure matches DTOs
- ✅ Request validation is tested
- ✅ All tests pass independently (no shared state)

### Story 2: GalleryPhotoRepository Unit Tests
**As a** backend developer
**I want** comprehensive repository tests for GalleryPhotoRepository
**So that** I can verify database operations work correctly with real PostgreSQL

**Acceptance Criteria:**
- ✅ CRUD operations (Create, Read, Update, Delete) tested
- ✅ Custom query methods tested (findByUserId, findByIsPublicTrue, etc.)
- ✅ Cascade delete behavior verified
- ✅ Database constraints verified (foreign key, NOT NULL)
- ✅ Pagination queries tested (if exist)
- ✅ Tests use Testcontainers PostgreSQL (singleton pattern)
- ✅ Tests are transactional (auto-rollback)
- ✅ All tests pass independently

### Story 3: Test Coverage Completeness
**As a** project lead
**I want** complete unit test coverage for Gallery feature
**So that** I can confidently refactor or extend Gallery functionality

**Acceptance Criteria:**
- ✅ GalleryController coverage > 85%
- ✅ GalleryPhotoRepository coverage > 90%
- ✅ Total unit tests: ~113-118 tests (91 existing + 22-27 new)
- ✅ All tests pass (100% pass rate)
- ✅ Tests follow AAA pattern (Arrange-Act-Assert)
- ✅ Tests have comprehensive Javadoc comments
- ✅ Test execution time < 30 seconds

## Success Criteria

### Functional Requirements

| Requirement | Success Metric | Validation Method |
|-------------|----------------|-------------------|
| GalleryController unit tests complete | 10-15 tests passing | `mvn test -Dtest=GalleryControllerTest` |
| GalleryPhotoRepository tests complete | 10-12 tests passing | `mvn test -Dtest=GalleryPhotoRepositoryTest` |
| All endpoints tested | 8/8 endpoints covered | Code review + test coverage report |
| Service interactions verified | All verify() statements pass | Test execution logs |
| Error handling tested | All exception scenarios covered | Test assertions |

### Non-Functional Requirements

| Requirement | Success Metric | Validation Method |
|-------------|----------------|-------------------|
| Code coverage - Controller | >85% line coverage | JaCoCo report |
| Code coverage - Repository | >90% line coverage | JaCoCo report |
| Test execution time | <30 seconds total | Maven test output |
| Test isolation | All tests pass independently | `mvn test -Dtest=...` individual runs |
| Documentation quality | Javadoc for every test method | Code review |
| Pattern consistency | Matches UserControllerTest pattern | Code review |

### Quality Gates

**Before Marking as COMPLETE:**
- [ ] All 20-27 new tests written
- [ ] All tests pass (100% pass rate)
- [ ] No test failures or errors
- [ ] No skipped tests (@Disabled removed)
- [ ] Code coverage meets thresholds (>85% controller, >90% repository)
- [ ] All tests have comprehensive Javadoc
- [ ] Tests follow AAA pattern
- [ ] Mockito verify() statements used in controller tests
- [ ] Repository tests use Testcontainers
- [ ] Tests committed to Git with proper commit messages
- [ ] Documentation updated (test counts, coverage metrics)

## Test Scenarios - Detailed

### GalleryControllerTest Scenarios

#### Scenario GC-001: Upload Photo - Happy Path
```
GIVEN valid JWT authentication
AND valid multipart file (image/jpeg)
AND optional metadata (title, description, isPublic)
WHEN POST /api/gallery/upload is called
THEN service.uploadPhoto() should be called
AND response status should be 201 CREATED
AND response should contain photo ID, filePath, metadata
```

#### Scenario GC-002: Upload Photo - Invalid File Type
```
GIVEN valid JWT authentication
AND invalid file type (application/pdf)
WHEN POST /api/gallery/upload is called
THEN service should throw GalleryException
AND response status should be 400 BAD REQUEST
```

#### Scenario GC-003: Get My Photos - Pagination
```
GIVEN valid JWT authentication
AND page=0, size=12 parameters
WHEN GET /api/gallery/my-photos is called
THEN service.getMyPhotos(userId, pageable) should be called
AND response should contain photos array
AND response should contain pagination metadata
```

#### Scenario GC-004: Get Photo Detail - Not Found
```
GIVEN valid JWT authentication
AND non-existent photoId
WHEN GET /api/gallery/photo/{photoId} is called
THEN service should throw GalleryNotFoundException
AND response status should be 404 NOT FOUND
```

#### Scenario GC-005: Delete Photo - Unauthorized
```
GIVEN valid JWT authentication (user A)
AND photoId owned by user B
WHEN DELETE /api/gallery/photo/{photoId} is called
THEN service should throw UnauthorizedGalleryAccessException
AND response status should be 403 FORBIDDEN
```

### GalleryPhotoRepositoryTest Scenarios

#### Scenario GR-001: Save New Photo
```
GIVEN a User exists in database
AND a new GalleryPhoto entity with userId, filePath, metadata
WHEN repository.save(galleryPhoto) is called
THEN photo should be persisted with auto-generated ID
AND createdAt and updatedAt timestamps should be set
AND isPublic default should be false
```

#### Scenario GR-002: Find By User ID
```
GIVEN User A has 3 gallery photos
AND User B has 2 gallery photos
WHEN repository.findByUserId(userA.getId()) is called
THEN should return 3 photos belonging to User A
AND photos should be ordered by createdAt descending
```

#### Scenario GR-003: Find Public Photos Only
```
GIVEN 5 public photos and 3 private photos exist
WHEN repository.findByIsPublicTrue() is called
THEN should return only 5 public photos
AND private photos should NOT be included
```

#### Scenario GR-004: Cascade Delete
```
GIVEN User A has 3 gallery photos
WHEN User A is deleted from database
THEN all 3 gallery photos should also be deleted (cascade)
AND no orphan photos should remain
```

## Constraints and Assumptions

### Technical Constraints
- Must use JUnit 5 (already in use)
- Must use Mockito for mocking (already in use)
- Must use Testcontainers for repository tests (already in use)
- Must follow existing test patterns (UserControllerTest, UserRepositoryTest)
- Must run in Maven build (`mvn test`)
- Must work with existing AbstractIntegrationTest base class

### Assumptions
- GalleryService is already tested (18 tests passing) ✅
- GalleryController implementation is complete ✅
- GalleryPhotoRepository implementation is complete ✅
- FileStorageService is already tested ✅
- Test infrastructure is set up (Mockito, Testcontainers) ✅
- AbstractIntegrationTest singleton Testcontainers pattern is working ✅
- UserControllerTest and UserRepositoryTest serve as reference examples ✅

### Dependencies
- JUnit 5 (already configured)
- Mockito (already configured)
- Spring Boot Test (already configured)
- Testcontainers PostgreSQL (already configured)
- MockMvc (already configured)
- AssertJ (already configured)
- Jackson ObjectMapper (already configured)

## Out of Scope (Deferred to Other Plans)

### Deferred to Integration Tests Plan (Day 2)
- GalleryControllerIntegrationTest with @SpringBootTest
- Testing Controller → Service → Repository interaction
- Testing with @MockBean repositories
- Testing Spring context wiring

### Deferred to API Tests Plan (Day 3-6)
- GalleryAPITest with REST Assured
- Testing with real local PostgreSQL database
- Testing with mvn spring-boot:run server running
- Testing full HTTP request/response cycle
- Testing file upload to real file system

### Deferred to E2E Tests Plan (Week 2)
- Playwright tests for Gallery UI
- Browser-based file upload testing
- Frontend-backend integration testing
- Visual testing

## Risk Mitigation

### Risk 1: MockMultipartFile Testing Complexity
**Mitigation:** Use existing FileStorageServiceTest as reference (already uses MockMultipartFile)

### Risk 2: Testcontainers Startup Time
**Mitigation:** Use singleton pattern (AbstractIntegrationTest) to share container across tests

### Risk 3: Cascade Delete Testing
**Mitigation:** Carefully setup test data, use EntityManager.flush() and clear() for predictable behavior

### Risk 4: Test Isolation Issues
**Mitigation:** Use @Transactional with auto-rollback, reset mocks in @BeforeEach

## References

- [Backend Testing Automation Plan](../../../plans/in-progress/backend/testing-automation/)
- [Unit Test Java Guide](../../../docs/testing/unit-test-java-guide.md)
- [Testing Commands Reference](../../../docs/reference/testing-commands.md)
- [GalleryController Implementation](../../../backend/registration-form-api/src/main/java/com/registrationform/api/controller/GalleryController.java)
- [GalleryPhotoRepository Implementation](../../../backend/registration-form-api/src/main/java/com/registrationform/api/repository/GalleryPhotoRepository.java)
- [UserControllerTest (Reference)](../../../backend/registration-form-api/src/test/java/com/registrationform/api/controller/UserControllerTest.java)
- [UserRepositoryTest (Reference)](../../../backend/registration-form-api/src/test/java/com/registrationform/api/repository/UserRepositoryTest.java)
