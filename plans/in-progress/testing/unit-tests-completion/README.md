# Unit Tests Completion - Implementation Plan

**Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED

**Created:** 2025-11-23

**Last Updated:** 2025-11-23

**Timeline:** November 24, 2025 (Day 1 of Backend Testing Week)

## Overview

This plan completes the unit test coverage for the Gallery Photo feature by adding missing controller and repository unit tests. This ensures all backend components have comprehensive unit test coverage before moving to integration and API testing.

## Scope Summary

**What IS Included:**
- GalleryControllerTest (unit test with mocked service)
- GalleryPhotoRepositoryTest (repository test with Testcontainers PostgreSQL)
- Complete test coverage for Gallery feature at unit level
- Mockito patterns for controller testing
- Testcontainers patterns for repository testing
- Test documentation and verification

**What is NOT Included:**
- Integration tests (covered in separate plan)
- API tests with real database (covered in separate plan)
- E2E tests with Playwright (scheduled for Week 2)
- Performance or load testing
- Manual testing procedures

## Current State

**Existing Unit Tests (Already Completed):**
- ✅ GalleryServiceTest (18 tests) - Service layer COMPLETE
- ✅ FileStorageServiceTest - File operations COMPLETE
- ✅ AuthServiceTest (11 tests) - Auth service COMPLETE
- ✅ UserServiceTest (17 tests) - User service COMPLETE
- ✅ JwtUtilTest (15 tests) - JWT utility COMPLETE
- ✅ PasswordValidatorTest (28 tests) - Password validation COMPLETE
- ✅ DtoValidationTest (30 tests) - DTO validation COMPLETE
- ✅ UserControllerTest (20 tests) - User controller COMPLETE
- ✅ ProfileControllerTest (18 tests) - Profile controller COMPLETE
- ✅ UserRepositoryTest (17 tests) - User repository with Testcontainers COMPLETE

**Missing Unit Tests (To Be Completed):**
- ❌ GalleryControllerTest - Controller layer for Gallery
- ❌ GalleryPhotoRepositoryTest - Repository layer for Gallery

**Total Existing:** ~91 unit tests
**To Add:** ~22-27 unit tests
**Final Total:** ~113-118 unit tests

## Plan Documents

1. **[requirements.md](./requirements.md)** - Detailed scope, test scenarios, and success criteria
2. **[technical-design.md](./technical-design.md)** - Test architecture, patterns, and implementation approach
3. **[checklist.md](./checklist.md)** - Day-by-day tasks, verification steps, and progress tracking

## Key Deliverables

### 1. GalleryControllerTest (10-15 tests)
**Purpose:** Unit test for Gallery REST controller
**Approach:** Mock GalleryService dependency
**Coverage Areas:**
- POST /api/gallery/upload (file upload handling)
- GET /api/gallery/my-photos (pagination)
- GET /api/gallery/public (public photos)
- GET /api/gallery/user/{userId}/public (user's public photos)
- GET /api/gallery/photo/{photoId} (single photo detail)
- PUT /api/gallery/photo/{photoId} (update metadata)
- DELETE /api/gallery/photo/{photoId} (delete photo)
- PUT /api/gallery/photo/{photoId}/toggle-privacy (toggle visibility)
- Request validation and error handling
- HTTP status codes verification

**Test Pattern:**
- Use Mockito to mock GalleryService
- Use MockMvc for simulated HTTP requests (NO real server)
- Verify service method calls with `verify()`
- Test all 8 endpoints from GalleryController
- Test request/response DTO mapping
- Test exception handling (404, 403, 400 errors)

### 2. GalleryPhotoRepositoryTest (10-12 tests)
**Purpose:** Repository test for Gallery database operations
**Approach:** Use Testcontainers PostgreSQL (singleton pattern like UserRepositoryTest)
**Coverage Areas:**
- save() - Create new gallery photo
- findById() - Find photo by ID
- findByUserId() - Find all photos by user
- findByIsPublicTrue() - Find all public photos
- findByUserIdAndIsPublicTrue() - Find user's public photos
- delete() - Delete photo
- existsById() - Check photo existence
- count() and countByUserId() - Count operations
- Pagination queries (if any custom queries exist)
- Cascade delete behavior (when user deleted)

**Test Pattern:**
- Extend AbstractIntegrationTest (for singleton Testcontainers)
- Use @DataJpaTest with @AutoConfigureTestDatabase
- Use EntityManager for test data setup
- Test with real PostgreSQL (production-like)
- Verify cascade relationships (User → GalleryPhoto)

## Success Metrics

**Quantitative:**
- ✅ GalleryControllerTest: 10-15 tests passing (100%)
- ✅ GalleryPhotoRepositoryTest: 10-12 tests passing (100%)
- ✅ Total new tests: 20-27 tests
- ✅ Code coverage for GalleryController: >85%
- ✅ Code coverage for GalleryPhotoRepository: >90%
- ✅ Test execution time: <30 seconds for unit tests
- ✅ All tests isolated (can run independently)

**Qualitative:**
- ✅ Tests follow AAA pattern (Arrange-Act-Assert)
- ✅ Comprehensive Javadoc comments for beginners
- ✅ Consistent with existing test patterns (UserControllerTest, UserRepositoryTest)
- ✅ Mock strategy clear (mock external dependencies only)
- ✅ Repository tests use real database (Testcontainers)
- ✅ Controller tests use mocked service (NO real DB)

## Timeline

**Day 1 (Monday, November 24, 2025):**
- Morning Session (2-3 hours):
  - Create GalleryControllerTest.java (10-15 tests)
  - Run and verify all tests pass
  - Commit: "test: add comprehensive GalleryControllerTest with 15 unit tests"

- Afternoon Session (2-3 hours):
  - Create GalleryPhotoRepositoryTest.java (10-12 tests)
  - Run and verify all tests pass with Testcontainers
  - Commit: "test: add GalleryPhotoRepositoryTest with Testcontainers (12 tests)"

- Evening Session (1 hour):
  - Run full unit test suite: `mvn test`
  - Verify ~113-118 total tests passing
  - Generate JaCoCo coverage report
  - Update documentation
  - Final commit: "test: complete unit test coverage for Gallery feature"

**Total Time Estimate:** 5-7 hours

## Related Documentation

- [Backend Testing Automation Plan](../../../plans/in-progress/backend/testing-automation/)
- [Integration Tests Plan](../integration-tests/)
- [API Tests Plan](../api-tests/)
- [Unit Test Java Guide](../../../docs/testing/unit-test-java-guide.md)
- [Testing Commands Reference](../../../docs/reference/testing-commands.md)

## Dependencies

**Prerequisites:**
- ✅ GalleryService implementation complete
- ✅ GalleryController implementation complete
- ✅ GalleryPhotoRepository implementation complete
- ✅ GalleryServiceTest (18 tests) complete
- ✅ Test infrastructure setup (Mockito, JUnit 5, Testcontainers)
- ✅ AbstractIntegrationTest base class exists

**Blocked By:** None (all dependencies ready)

**Blocks:**
- Integration Tests (Day 2) - Need unit tests complete first
- API Tests (Day 3-6) - Build upon unit and integration tests

## Risk Assessment

**Low Risk:**
- Patterns well-established (UserControllerTest, UserRepositoryTest exist as templates)
- Test infrastructure already configured
- GalleryService already tested (18 tests passing)
- Testcontainers working (UserRepositoryTest using it successfully)

**Potential Challenges:**
- Multipart file upload testing in GalleryControllerTest (use MockMultipartFile)
- Cascade delete testing in repository (need to verify behavior)

**Mitigation:**
- Follow existing UserControllerTest pattern for controller tests
- Follow existing UserRepositoryTest pattern for repository tests
- Use MockMultipartFile for file upload testing (already used in FileStorageServiceTest)

## Next Steps After Completion

1. **Mark this plan as COMPLETED** - Move to `/plans/completed/testing/unit-tests-completion/`
2. **Start Integration Tests** - Day 2 (Tuesday, November 25)
3. **Update Testing Documentation** - Add new test counts and coverage metrics
4. **Update LinkedIn Post Template** - Document Day 1 achievements

## Notes

- This plan focuses ONLY on unit tests (no integration/API tests)
- Controller tests use MOCKED service (not real)
- Repository tests use REAL database via Testcontainers
- All tests must be isolated (no shared state between tests)
- Follow existing patterns for consistency
- Comprehensive Javadoc for beginner-friendly learning
