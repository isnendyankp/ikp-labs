# Requirements - Integration Tests

## Scope Definition

### What IS Included

#### GalleryControllerIntegrationTest (18-20 tests)

**Test Class:** `GalleryControllerIntegrationTest.java`
**Location:** `src/test/java/com/registrationform/api/integration/GalleryControllerIntegrationTest.java`
**Dependencies:** @MockBean GalleryPhotoRepository, @MockBean UserRepository

**Endpoint Coverage (All 8 endpoints):**

1. **POST /api/gallery/upload**
   - Test upload with valid multipart file and metadata
   - Test upload with invalid file type (service throws GalleryException)
   - Test upload without authentication (401 Unauthorized)
   - Verify repository.save() is called

2. **GET /api/gallery/my-photos**
   - Test retrieve user's photos with pagination
   - Test pagination parameters
   - Test empty gallery (repository returns empty list)
   - Verify repository.findByUserId() is called

3. **GET /api/gallery/public**
   - Test retrieve all public photos
   - Test pagination
   - Test when no public photos exist
   - Verify repository.findByIsPublicTrue() is called

4. **GET /api/gallery/user/{userId}/public**
   - Test retrieve specific user's public photos
   - Test when user has no photos
   - Verify repository.findByUserIdAndIsPublicTrue() is called

5. **GET /api/gallery/photo/{photoId}**
   - Test get public photo detail (success)
   - Test get private photo by owner (success)
   - Test get private photo by non-owner (403 Forbidden)
   - Test photo not found (404 Not Found)
   - Verify repository.findById() is called
   - Test authorization logic

6. **PUT /api/gallery/photo/{photoId}**
   - Test update by owner (success)
   - Test update by non-owner (403 Forbidden)
   - Test update non-existent photo (404)
   - Verify repository.save() is called

7. **DELETE /api/gallery/photo/{photoId}**
   - Test delete by owner (success, 204 No Content)
   - Test delete by non-owner (403 Forbidden)
   - Test delete non-existent photo (404)
   - Verify repository.delete() is called

8. **PUT /api/gallery/photo/{photoId}/toggle-privacy**
   - Test toggle privacy (success)
   - Test toggle by non-owner (403 Forbidden)
   - Verify repository.save() is called with updated privacy

**Test Patterns:**
- Use `@SpringBootTest` to load full Spring context
- Use `@AutoConfigureMockMvc` for MockMvc configuration
- Use `@MockBean` for GalleryPhotoRepository and UserRepository
- Use `MockMvc` for HTTP request simulation
- Use `when().thenReturn()` to mock repository responses
- Use `verify()` to ensure repository methods are called
- Test HTTP status codes (201, 200, 204, 400, 404, 403)
- Test JSON response structure
- Test Spring Security filters and JWT authentication

### What is NOT Included

#### 1. Real Database Testing
- NOT using Testcontainers
- NOT using real PostgreSQL database
- NOT testing actual database persistence
- (Real database testing in API Tests plan)

#### 2. Unit Tests
- NOT testing controller in isolation (that's unit test)
- NOT using @WebMvcTest (that's unit test approach)
- (Controller unit tests in Unit Tests plan)

#### 3. API Tests
- NOT using REST Assured
- NOT testing with real HTTP server running
- NOT testing with mvn spring-boot:run
- (API tests in API Tests plan)

#### 4. Repository Tests
- NOT testing repository methods directly
- NOT testing SQL queries
- (Repository tests in Unit Tests plan)

## User Stories

### Story 1: Gallery Integration Tests
**As a** backend developer
**I want** integration tests for GalleryController within Spring context
**So that** I can verify all components work together correctly

**Acceptance Criteria:**
- ✅ All 8 endpoints have integration tests
- ✅ Spring context loads successfully
- ✅ Repository interactions verified with verify()
- ✅ Authentication and authorization tested
- ✅ Exception handling tested
- ✅ HTTP status codes correct
- ✅ All tests pass independently

### Story 2: Component Wiring Verification
**As a** backend developer
**I want** to verify Controller → Service → Repository wiring
**So that** I can ensure Spring dependency injection works correctly

**Acceptance Criteria:**
- ✅ @MockBean repositories injected correctly
- ✅ Service layer receives correct parameters from controller
- ✅ Repository methods called with correct parameters
- ✅ Spring Security filters applied correctly
- ✅ GlobalExceptionHandler catches service exceptions

## Success Criteria

### Functional Requirements

| Requirement | Success Metric |
|-------------|----------------|
| All endpoints tested | 8/8 endpoints covered |
| Integration tests pass | 18-20 tests passing (100%) |
| Repository interactions verified | All verify() statements pass |
| Authentication tested | JWT auth working |
| Authorization tested | Owner-only operations enforced |

### Non-Functional Requirements

| Requirement | Success Metric |
|-------------|----------------|
| Test execution time | <60 seconds |
| Spring context loads | No context errors |
| Test isolation | All tests pass independently |
| Documentation quality | Javadoc for every test |
| Pattern consistency | Matches AuthControllerIntegrationTest |

## Test Scenarios

### Scenario IT-001: Upload Photo - Success
```
GIVEN user authenticated with valid JWT
AND valid multipart file (JPEG)
AND repository.save() mocked to return saved photo
WHEN POST /api/gallery/upload is called
THEN Spring Security allows request
AND Controller calls Service
AND Service calls Repository.save()
AND Response is 201 CREATED
AND verify(repository).save() passes
```

### Scenario IT-002: Get Photo Detail - Unauthorized Access
```
GIVEN user A authenticated
AND photo belongs to user B
AND photo is private
AND repository.findById() mocked to return photo
WHEN GET /api/gallery/photo/{photoId} is called
THEN Service checks ownership
AND Service throws UnauthorizedGalleryAccessException
AND GlobalExceptionHandler catches exception
AND Response is 403 FORBIDDEN
```

### Scenario IT-003: Delete Photo - Success
```
GIVEN user authenticated
AND user owns the photo
AND repository.findById() mocked to return photo
AND repository.delete() mocked
WHEN DELETE /api/gallery/photo/{photoId} is called
THEN Service verifies ownership
AND Service calls Repository.delete()
AND Response is 204 NO CONTENT
AND verify(repository).delete() passes
```

## Constraints and Assumptions

### Technical Constraints
- Must use @SpringBootTest (full Spring context)
- Must use @MockBean for repositories
- Must NOT use real database
- Must follow existing integration test patterns

### Assumptions
- GalleryController, GalleryService, GalleryPhotoRepository complete ✅
- Unit tests complete (Day 1) ✅
- Spring Boot Test framework configured ✅
- Existing integration tests as reference ✅
- @MockBean pattern understood ✅

## Out of Scope

### Deferred to API Tests (Day 3-6)
- Testing with real PostgreSQL database
- Testing with REST Assured
- Testing with server running (mvn spring-boot:run)
- Testing actual file uploads to file system
- Testing database transactions and rollbacks

## References

- [AuthControllerIntegrationTest](../../../backend/registration-form-api/src/test/java/com/registrationform/api/integration/AuthControllerIntegrationTest.java) - Reference pattern
- [Unit Tests Plan](../unit-tests-completion/) - Prerequisite
- [API Tests Plan](../api-tests/) - Next step
