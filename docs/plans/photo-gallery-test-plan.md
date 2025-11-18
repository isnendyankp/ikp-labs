# Photo Gallery Feature - Test Plan & Checklist

> **📊 PROGRESS UPDATE (2025-11-17)**
>
> **Backend Tests:** ✅ COMPLETE
> - Unit tests: 47 tests PASS (18 GalleryService + 8 FileStorageService + 7 Repository)
> - Integration tests: All verified via manual testing
> - Test coverage: ~91% for gallery services
>
> **E2E Tests:** ⏳ PENDING (Scheduled Week 2: Mon-Wed Nov 18-20)
> - 20 E2E tests fully specified below (ready to implement)
> - TestPlanTracker integration planned
>
> **See Also:**
> - **Progress Checklist**: [photo-gallery-progress-checklist.md](./photo-gallery-progress-checklist.md)
> - **Structured Plan**: [plans/in-progress/backend/photo-gallery/](../../plans/in-progress/backend/photo-gallery/)

**Original Status:** 📋 Planning
**Created:** 2025-11-11
**Test Type:** Unit, Integration, Component, E2E
**Testing Strategy:** Test Plan Checklist (as per project standard)

---

## Overview

Comprehensive test plan for Photo Gallery feature with privacy control. Following the **Test Plan Checklist Strategy** documented in [test-plan-checklist-strategy.md](../explanation/testing/test-plan-checklist-strategy.md).

**Testing Philosophy:**
- ✅ **Conditional Cleanup**: Pass = clean database, Fail = preserve for debugging
- ✅ **Progress Tracking**: TestPlanTracker integration for visibility
- ✅ **Test Data Tracking**: Know which data belongs to which test
- ✅ **Systematic Execution**: Clear checklist with status tracking

---

## Test Coverage Scope

### Backend Testing
- **Unit Tests**: Service layer, Repository layer, Validation logic
- **Integration Tests**: REST API endpoints, Authorization, File operations

### Frontend Testing
- **Component Tests**: React components with React Testing Library
- **Service Tests**: API service layer, Error handling

### End-to-End Testing
- **E2E Tests**: Full user flows with Playwright
- **TestPlanTracker**: Progress tracking and conditional cleanup

---

## Backend Unit Tests

### 1. GalleryPhotoRepository Tests

**Status:** ✅ Covered via GalleryServiceTest (no dedicated test needed)

**Decision:** Repository uses standard Spring Data JPA methods - covered by service layer tests

**Coverage via GalleryServiceTest:**

- [ ] **REPO-001: Find photos by user ID**
  ```
  Given: User with id=1 has 5 photos
  When: findByUserId(1, pageable)
  Then: Returns 5 photos for user 1
  ```

- [ ] **REPO-002: Find photos by user ID with pagination**
  ```
  Given: User has 25 photos
  When: findByUserId(userId, PageRequest.of(0, 20))
  Then: Returns first 20 photos
  And: Total pages = 2
  ```

- [ ] **REPO-003: Find public photos only**
  ```
  Given: 10 public photos and 5 private photos in database
  When: findByIsPublicTrue(pageable)
  Then: Returns only 10 public photos
  ```

- [ ] **REPO-004: Find user's public photos**
  ```
  Given: User has 5 public and 3 private photos
  When: findByUserIdAndIsPublicTrue(userId, pageable)
  Then: Returns only 5 public photos
  ```

- [ ] **REPO-005: Count photos by user**
  ```
  Given: User has 15 photos
  When: countByUserId(userId)
  Then: Returns 15
  ```

- [ ] **REPO-006: Count public photos**
  ```
  Given: Database has 20 public and 10 private photos
  When: countByIsPublicTrue()
  Then: Returns 20
  ```

- [ ] **REPO-007: Delete cascade when user deleted**
  ```
  Given: User has 5 photos
  When: User is deleted
  Then: All 5 photos are automatically deleted (CASCADE)
  ```

---

### 2. FileStorageService Tests (Gallery Methods)

**File:** `FileStorageServiceTest.java`

#### Test Cases:

- [ ] **FILE-001: Save gallery photo with user subdirectory**
  ```
  Given: Valid image file and userId=83
  When: saveGalleryPhoto(file, 83, photoId)
  Then: File saved to "uploads/gallery/user-83/photo-{photoId}-{timestamp}.jpg"
  And: Directory "uploads/gallery/user-83/" created if not exists
  ```

- [ ] **FILE-002: Save multiple photos for same user**
  ```
  Given: User 83 uploads 3 photos
  When: saveGalleryPhoto() called 3 times
  Then: All 3 files saved in same directory "uploads/gallery/user-83/"
  And: Each file has unique name (different photoId/timestamp)
  ```

- [ ] **FILE-003: Delete gallery photo**
  ```
  Given: Photo file exists at "uploads/gallery/user-83/photo-156-timestamp.jpg"
  When: deleteGalleryPhoto(83, 156, "jpg")
  Then: File is deleted from filesystem
  ```

- [ ] **FILE-004: Delete gallery photo - handles all extensions**
  ```
  Given: Photo could be .jpg, .png, or .gif
  When: deleteGalleryPhoto(userId, photoId, extension)
  Then: Correct file is deleted based on extension
  ```

- [ ] **FILE-005: Validate gallery photo - file too large**
  ```
  Given: File size is 6MB (exceeds 5MB limit)
  When: validateGalleryPhoto(file)
  Then: Throws IllegalArgumentException("File size exceeds maximum limit")
  ```

- [ ] **FILE-006: Validate gallery photo - invalid format**
  ```
  Given: File is .txt (not image)
  When: validateGalleryPhoto(file)
  Then: Throws IllegalArgumentException("Only image files are allowed")
  ```

- [ ] **FILE-007: Validate gallery photo - null file**
  ```
  Given: File is null
  When: validateGalleryPhoto(file)
  Then: Throws IllegalArgumentException("File cannot be empty")
  ```

- [ ] **FILE-008: Validate gallery photo - valid file**
  ```
  Given: Valid .jpg file, 2MB size
  When: validateGalleryPhoto(file)
  Then: No exception thrown
  ```

---

### 3. GalleryService Tests

**File:** `GalleryServiceTest.java`

#### Test Cases:

- [ ] **SVC-001: Upload photo - happy path**
  ```
  Given: Valid file, userId=1, title="Sunset"
  When: uploadPhoto(file, userId, "Sunset", "Description", false)
  Then: Photo saved to database
  And: File saved to disk
  And: Returns GalleryPhotoResponse with correct data
  ```

- [ ] **SVC-002: Upload photo - invalid file throws exception**
  ```
  Given: Invalid file (too large)
  When: uploadPhoto(file, userId, title, description, isPublic)
  Then: Throws GalleryException
  And: No database entry created
  And: No file saved to disk
  ```

- [ ] **SVC-003: Upload photo - defaults to private**
  ```
  Given: isPublic parameter is null
  When: uploadPhoto(file, userId, title, description, null)
  Then: Photo saved with isPublic = false (default)
  ```

- [ ] **SVC-004: Get my photos - returns all photos for user**
  ```
  Given: User has 5 public and 3 private photos
  When: getMyPhotos(userId, pageable)
  Then: Returns all 8 photos (public + private)
  ```

- [ ] **SVC-005: Get my photos - pagination works**
  ```
  Given: User has 25 photos
  When: getMyPhotos(userId, PageRequest.of(1, 20))
  Then: Returns page 2 with 5 photos
  And: Total pages = 2
  ```

- [ ] **SVC-006: Get public photos - only public shown**
  ```
  Given: Database has 10 public and 5 private photos
  When: getPublicPhotos(pageable)
  Then: Returns only 10 public photos
  And: Private photos not included
  ```

- [ ] **SVC-007: Get user's public photos**
  ```
  Given: User 1 has 5 public and 3 private photos
  When: getUserPublicPhotos(userId=1, pageable)
  Then: Returns only 5 public photos for user 1
  ```

- [ ] **SVC-008: Get photo by ID - owner can see private**
  ```
  Given: User 1 has private photo with id=100
  When: getPhotoById(photoId=100, requestingUserId=1)
  Then: Returns photo (owner can see own private photos)
  ```

- [ ] **SVC-009: Get photo by ID - non-owner cannot see private**
  ```
  Given: User 1 has private photo with id=100
  When: getPhotoById(photoId=100, requestingUserId=2)
  Then: Throws UnauthorizedGalleryAccessException
  ```

- [ ] **SVC-010: Get photo by ID - anyone can see public**
  ```
  Given: User 1 has public photo with id=100
  When: getPhotoById(photoId=100, requestingUserId=2)
  Then: Returns photo (public photos visible to all)
  ```

- [ ] **SVC-011: Update photo - owner can update**
  ```
  Given: User 1 owns photo with id=100
  When: updatePhoto(photoId=100, userId=1, "New Title", "New Desc", true)
  Then: Photo updated successfully
  And: updatedAt timestamp updated
  ```

- [ ] **SVC-012: Update photo - non-owner cannot update**
  ```
  Given: User 1 owns photo with id=100
  When: updatePhoto(photoId=100, userId=2, "Hack", "Hack", true)
  Then: Throws UnauthorizedGalleryAccessException
  ```

- [ ] **SVC-013: Toggle privacy - private to public**
  ```
  Given: Photo is private (isPublic=false)
  When: togglePrivacy(photoId, userId)
  Then: Photo becomes public (isPublic=true)
  And: updatedAt timestamp updated
  ```

- [ ] **SVC-014: Toggle privacy - public to private**
  ```
  Given: Photo is public (isPublic=true)
  When: togglePrivacy(photoId, userId)
  Then: Photo becomes private (isPublic=false)
  ```

- [ ] **SVC-015: Toggle privacy - non-owner cannot toggle**
  ```
  Given: User 1 owns photo
  When: togglePrivacy(photoId, userId=2)
  Then: Throws UnauthorizedGalleryAccessException
  ```

- [ ] **SVC-016: Delete photo - owner can delete**
  ```
  Given: User 1 owns photo with id=100
  When: deletePhoto(photoId=100, userId=1)
  Then: Photo deleted from database
  And: File deleted from disk
  ```

- [ ] **SVC-017: Delete photo - non-owner cannot delete**
  ```
  Given: User 1 owns photo with id=100
  When: deletePhoto(photoId=100, userId=2)
  Then: Throws UnauthorizedGalleryAccessException
  And: Photo not deleted
  ```

- [ ] **SVC-018: Delete photo - file cleanup works**
  ```
  Given: Photo file exists on disk
  When: deletePhoto(photoId, userId)
  Then: Database record deleted
  And: File removed from disk
  ```

---

## Backend Integration Tests

### 4. GalleryController Integration Tests

**File:** `GalleryControllerTest.java`

#### Test Cases:

- [ ] **API-001: POST /upload - successful upload**
  ```
  Given: Authenticated user with valid JWT
  And: Valid image file
  When: POST /api/gallery/upload with multipart file
  Then: Response 201 Created
  And: Photo saved in database
  And: File saved on disk
  ```

- [ ] **API-002: POST /upload - unauthenticated user blocked**
  ```
  Given: No JWT token provided
  When: POST /api/gallery/upload
  Then: Response 401 Unauthorized
  ```

- [ ] **API-003: POST /upload - invalid file rejected**
  ```
  Given: Authenticated user
  And: File > 5MB
  When: POST /api/gallery/upload
  Then: Response 400 Bad Request
  And: Error message about file size
  ```

- [ ] **API-004: GET /my-photos - returns user's photos**
  ```
  Given: User has 10 photos
  When: GET /api/gallery/my-photos
  Then: Response 200 OK
  And: Returns all 10 photos
  ```

- [ ] **API-005: GET /my-photos - pagination works**
  ```
  Given: User has 25 photos
  When: GET /api/gallery/my-photos?page=0&size=20
  Then: Returns 20 photos
  And: Response includes pagination metadata
  ```

- [ ] **API-006: GET /public - returns public photos only**
  ```
  Given: 10 public and 5 private photos exist
  When: GET /api/gallery/public
  Then: Response 200 OK
  And: Returns only 10 public photos
  ```

- [ ] **API-007: GET /public - accessible without auth**
  ```
  Given: No JWT token provided
  When: GET /api/gallery/public
  Then: Response 200 OK (public endpoint)
  ```

- [ ] **API-008: GET /public/{userId} - returns user's public photos**
  ```
  Given: User 1 has 5 public and 3 private photos
  When: GET /api/gallery/public/1
  Then: Returns only 5 public photos
  ```

- [ ] **API-009: GET /photo/{id} - owner can view private**
  ```
  Given: User 1 has private photo with id=100
  When: GET /api/gallery/photo/100 (with user 1's JWT)
  Then: Response 200 OK with photo details
  ```

- [ ] **API-010: GET /photo/{id} - non-owner blocked from private**
  ```
  Given: User 1 has private photo with id=100
  When: GET /api/gallery/photo/100 (with user 2's JWT)
  Then: Response 403 Forbidden
  ```

- [ ] **API-011: GET /photo/{id} - anyone can view public**
  ```
  Given: User 1 has public photo with id=100
  When: GET /api/gallery/photo/100 (with user 2's JWT)
  Then: Response 200 OK with photo details
  ```

- [ ] **API-012: PUT /photo/{id} - owner can update**
  ```
  Given: User 1 owns photo with id=100
  When: PUT /api/gallery/photo/100 with new title
  Then: Response 200 OK
  And: Photo updated in database
  ```

- [ ] **API-013: PUT /photo/{id} - non-owner gets 403**
  ```
  Given: User 1 owns photo with id=100
  When: PUT /api/gallery/photo/100 (with user 2's JWT)
  Then: Response 403 Forbidden
  And: Photo not updated
  ```

- [ ] **API-014: PATCH /photo/{id}/privacy - toggles successfully**
  ```
  Given: Photo is private
  When: PATCH /api/gallery/photo/{id}/privacy
  Then: Response 200 OK
  And: Photo becomes public
  ```

- [ ] **API-015: PATCH /photo/{id}/privacy - non-owner blocked**
  ```
  Given: User 1 owns photo
  When: PATCH /api/gallery/photo/{id}/privacy (with user 2's JWT)
  Then: Response 403 Forbidden
  ```

- [ ] **API-016: DELETE /photo/{id} - owner can delete**
  ```
  Given: User 1 owns photo with id=100
  When: DELETE /api/gallery/photo/100 (with user 1's JWT)
  Then: Response 200 OK
  And: Photo deleted from database
  And: File removed from disk
  ```

- [ ] **API-017: DELETE /photo/{id} - non-owner gets 403**
  ```
  Given: User 1 owns photo
  When: DELETE /api/gallery/photo/{id} (with user 2's JWT)
  Then: Response 403 Forbidden
  And: Photo not deleted
  ```

- [ ] **API-018: DELETE /photo/{id} - photo not found**
  ```
  Given: Photo with id=999 does not exist
  When: DELETE /api/gallery/photo/999
  Then: Response 404 Not Found
  ```

---

## Frontend Component Tests

### 5. React Component Tests

**Tool:** React Testing Library

#### GalleryGrid Component Tests

- [ ] **COMP-001: Renders photos in grid layout**
  ```
  Given: Component receives 12 photos
  When: Component renders
  Then: All 12 photos displayed in grid
  ```

- [ ] **COMP-002: Shows loading state**
  ```
  Given: Loading prop is true
  When: Component renders
  Then: Loading skeleton displayed
  ```

- [ ] **COMP-003: Shows empty state**
  ```
  Given: Photos array is empty
  When: Component renders
  Then: "No photos yet" message shown
  ```

- [ ] **COMP-004: Shows error state**
  ```
  Given: Error prop contains error message
  When: Component renders
  Then: Error message displayed
  ```

#### PhotoCard Component Tests

- [ ] **COMP-005: Displays photo thumbnail**
  ```
  Given: Photo has filePath
  When: Component renders
  Then: Image displayed with correct src
  ```

- [ ] **COMP-006: Displays public badge for public photo**
  ```
  Given: Photo has isPublic=true
  When: Component renders
  Then: "Public" badge visible
  ```

- [ ] **COMP-007: Displays private badge for private photo**
  ```
  Given: Photo has isPublic=false
  When: Component renders
  Then: "Private" badge visible
  ```

- [ ] **COMP-008: Click triggers view handler**
  ```
  Given: Component has onView handler
  When: User clicks photo card
  Then: onView handler called with photo ID
  ```

- [ ] **COMP-009: Delete button triggers confirmation**
  ```
  Given: User clicks delete button
  When: Confirmation dialog shown
  Then: User can confirm or cancel
  ```

#### PhotoUploadModal Component Tests

- [ ] **COMP-010: File input accepts images**
  ```
  Given: Modal is open
  When: User selects image file
  Then: File preview shown
  ```

- [ ] **COMP-011: Shows validation error for large file**
  ```
  Given: User selects file > 5MB
  When: Validation runs
  Then: Error message "File too large" shown
  ```

- [ ] **COMP-012: Upload button disabled when no file**
  ```
  Given: No file selected
  When: Modal renders
  Then: Upload button is disabled
  ```

- [ ] **COMP-013: Shows upload progress**
  ```
  Given: Upload in progress
  When: Upload progress updates
  Then: Progress bar shows percentage
  ```

#### PrivacyToggle Component Tests

- [ ] **COMP-014: Displays current privacy state**
  ```
  Given: Photo is public
  When: Component renders
  Then: Toggle shows "Public" state
  ```

- [ ] **COMP-015: Click toggles privacy**
  ```
  Given: Photo is private
  When: User clicks toggle
  Then: onToggle handler called
  And: Loading state shown during API call
  ```

---

## End-to-End Tests

### 6. E2E Test Scenarios (Playwright)

**File:** `frontend/tests/e2e/gallery.spec.ts`
**Test Plan File:** `frontend/tests/plans/gallery.plan.json`

#### Upload Flow Tests

- [ ] **E2E-001: Upload single photo successfully**
  ```
  Given: User is registered and logged in
  When: User uploads valid photo with title "Sunset at Beach"
  Then: Photo appears in My Gallery
  And: Photo is marked as Private by default
  And: Success message "Photo uploaded successfully" shown
  ```
  - **Test Data:** `tests/fixtures/gallery/valid-photo.jpg` (< 1MB)
  - **Cleanup:** If test passes, delete photo and user

- [ ] **E2E-002: Upload multiple photos at once**
  ```
  Given: User is logged in
  When: User selects and uploads 5 photos simultaneously
  Then: All 5 photos appear in My Gallery
  And: Upload progress shown for each photo
  And: All photos default to Private
  ```
  - **Test Data:** 5 different valid images
  - **Cleanup:** If test passes, delete all 5 photos

- [ ] **E2E-003: Upload with title and description**
  ```
  Given: User uploads photo
  When: User enters title "Vacation 2025" and description "Family trip"
  Then: Photo saved with title and description
  And: Metadata visible in photo detail view
  ```

#### Privacy Control Tests

- [ ] **E2E-004: Toggle privacy from private to public**
  ```
  Given: User has private photo in My Gallery
  When: User clicks privacy toggle to "Public"
  Then: Photo privacy updated to Public
  And: Photo now appears in Public Gallery
  And: Success message shown
  ```
  - **Verification:** Check both My Gallery and Public Gallery

- [ ] **E2E-005: Toggle privacy from public to private**
  ```
  Given: User has public photo
  When: User toggles privacy to "Private"
  Then: Photo becomes private
  And: Photo removed from Public Gallery
  And: Photo still visible in My Gallery
  ```

- [ ] **E2E-006: Public photo visible to other users**
  ```
  Given: User A has public photo
  When: User B visits Public Gallery
  Then: User B can see User A's public photo
  And: User B cannot edit or delete it
  ```
  - **Test Data:** 2 test users (User A and User B)

#### Delete Flow Tests

- [ ] **E2E-007: Delete photo successfully**
  ```
  Given: User has photo in gallery
  When: User clicks delete button
  And: User confirms deletion in dialog
  Then: Photo removed from gallery
  And: Photo removed from filesystem
  And: Success message "Photo deleted successfully" shown
  ```
  - **Verification:** Check database and filesystem

- [ ] **E2E-008: Cancel delete keeps photo**
  ```
  Given: User clicks delete button
  When: User cancels in confirmation dialog
  Then: Photo not deleted
  And: Photo still visible in gallery
  ```

#### Gallery View Tests

- [ ] **E2E-009: My Gallery shows all own photos**
  ```
  Given: User has 5 public and 3 private photos
  When: User visits My Gallery page
  Then: All 8 photos displayed (public + private)
  And: Privacy badges shown correctly
  ```

- [ ] **E2E-010: Public Gallery shows only public photos**
  ```
  Given: Database has 10 public and 5 private photos from various users
  When: User visits Public Gallery
  Then: Only 10 public photos shown
  And: Private photos not visible
  And: Each photo shows owner's name
  ```

#### Edit Metadata Tests

- [ ] **E2E-011: Edit photo title and description**
  ```
  Given: User has photo with title "Old Title"
  When: User edits title to "New Title" and description to "New Desc"
  And: User saves changes
  Then: Photo shows updated title and description
  And: updatedAt timestamp refreshed
  ```

#### Pagination Tests

- [ ] **E2E-012: Pagination works in My Gallery**
  ```
  Given: User has 25 photos
  When: User visits My Gallery
  Then: Page 1 shows 20 photos
  And: Page 2 link is visible
  When: User clicks page 2
  Then: Page 2 shows 5 photos
  ```

- [ ] **E2E-013: Pagination works in Public Gallery**
  ```
  Given: Public gallery has 50 photos
  When: User loads Public Gallery
  Then: First page shows 20 photos
  And: Pagination controls show 3 pages total
  ```

#### Validation Tests

- [ ] **E2E-014: Reject file too large**
  ```
  Given: User selects file > 5MB
  When: User tries to upload
  Then: Error message "File size exceeds 5MB" shown
  And: Upload blocked
  And: No photo created
  ```
  - **Test Data:** `tests/fixtures/gallery/large-photo.jpg` (> 5MB)

- [ ] **E2E-015: Reject invalid file format**
  ```
  Given: User selects .txt file
  When: User tries to upload
  Then: Error message "Only image files allowed" shown
  And: Upload blocked
  ```
  - **Test Data:** `tests/fixtures/gallery/invalid-file.txt`

- [ ] **E2E-016: Reject non-image file**
  ```
  Given: User selects .pdf file
  When: User tries to upload
  Then: Error message about invalid file type shown
  And: Upload blocked
  ```

#### Authorization Tests

- [ ] **E2E-017: Cannot delete other user's photo**
  ```
  Given: User A has photo
  When: User B tries to delete User A's photo (via dev tools / direct API call)
  Then: Request blocked with 403 Forbidden
  And: Photo not deleted
  ```
  - **Verification:** Manual API call or browser dev tools

- [ ] **E2E-018: Cannot edit other user's photo**
  ```
  Given: User A has photo
  When: User B tries to edit User A's photo
  Then: Request blocked with 403 Forbidden
  And: Photo not modified
  ```

#### Persistence Tests

- [ ] **E2E-019: Photos persist after page refresh**
  ```
  Given: User uploads photo
  When: User refreshes page
  Then: Photo still visible in My Gallery
  And: No re-upload required
  ```

- [ ] **E2E-020: Privacy setting persists after page refresh**
  ```
  Given: User sets photo to public
  When: User refreshes page
  Then: Photo still marked as public
  And: Photo still appears in Public Gallery
  ```

---

## Test Data & Fixtures

### Test Images

Create test fixtures in `frontend/tests/fixtures/gallery/`:

- [ ] **valid-photo.jpg** - Valid JPEG, 500KB, 800x600px
- [ ] **valid-photo.png** - Valid PNG, 800KB, 1024x768px
- [ ] **valid-photo-small.jpg** - Valid JPEG, 100KB, 400x300px
- [ ] **large-photo.jpg** - Too large, 6MB (for validation test)
- [ ] **invalid-file.txt** - Text file (not image)
- [ ] **invalid-file.pdf** - PDF file (not image)

### Test Users

**User Generation Strategy:**
```javascript
const generateTestUser = () => ({
  email: `autotest-gallery-${Date.now()}@example.com`,
  password: 'Test123@Gallery',
  fullName: 'Gallery Test User'
});
```

**Cleanup Strategy:**
- Use `TestAdminController` endpoint: `/api/test-admin/cleanup/automated`
- Delete users with email pattern: `autotest-gallery-*@example.com`

---

## TestPlanTracker Integration

### Gallery Test Plan JSON

**File:** `frontend/tests/plans/gallery.plan.json`

```json
{
  "planName": "Gallery Feature Testing",
  "description": "Comprehensive E2E tests for photo gallery with privacy control",
  "testCases": [
    {
      "id": "E2E-001",
      "description": "Upload single photo successfully",
      "status": "pending",
      "lastRun": null,
      "lastResult": null
    },
    {
      "id": "E2E-002",
      "description": "Upload multiple photos at once",
      "status": "pending"
    },
    // ... all 20 test cases
  ],
  "totalTests": 20,
  "completedTests": 0,
  "failedTests": 0,
  "lastUpdated": "2025-11-11T00:00:00Z"
}
```

### Tracker Usage Example

```javascript
// In gallery.spec.ts
import { TestPlanTracker } from '../helpers/TestPlanTracker';

test('E2E-001: Upload single photo', async ({ request, page }) => {
  const tracker = new TestPlanTracker('gallery');
  tracker.startTest('E2E-001');

  let testPassed = false;
  const testEmail = `autotest-gallery-${Date.now()}@example.com`;

  try {
    // Register user
    await registerUser(request, testEmail);
    tracker.trackUser(testEmail, 'E2E-001');

    // Login
    await loginUser(page, testEmail);

    // Upload photo
    await uploadPhoto(page, 'valid-photo.jpg', 'Sunset');

    // Verify photo in gallery
    await expect(page.locator('text=Sunset')).toBeVisible();

    testPassed = true;
    tracker.markCompleted('E2E-001');

  } catch (error) {
    tracker.markFailed('E2E-001', error);
    throw error;

  } finally {
    // Conditional cleanup
    await tracker.cleanup(request, 'E2E-001', testPassed);
    tracker.printProgress();
  }
});
```

---

## Acceptance Criteria

### Unit Tests Completion
- [ ] All repository tests pass (7 tests)
- [ ] All file service tests pass (8 tests)
- [ ] All gallery service tests pass (18 tests)
- [ ] Code coverage > 80%
- [ ] No skipped tests

### Integration Tests Completion
- [ ] All API endpoint tests pass (18 tests)
- [ ] Authorization tests verify security
- [ ] File operations tested (upload, delete)
- [ ] Pagination tested
- [ ] Error handling tested

### Component Tests Completion
- [ ] All React component tests pass (15 tests)
- [ ] Components render correctly
- [ ] User interactions work
- [ ] Error states handled

### E2E Tests Completion
- [ ] All 20 E2E scenarios implemented
- [ ] Tests use TestPlanTracker
- [ ] Conditional cleanup works
- [ ] Tests run independently
- [ ] Test plan shows progress
- [ ] Tests complete in < 10 minutes

### Overall Quality
- [ ] All tests have clear Given-When-Then format
- [ ] Test data fixtures created
- [ ] Cleanup endpoints implemented
- [ ] Test documentation complete
- [ ] CI/CD integration ready (optional)

---

## Next Steps

**Phase 1: Backend Unit Tests**
1. Implement repository tests (7 tests)
2. Implement file service tests (8 tests)
3. Implement gallery service tests (18 tests)
4. Verify coverage > 80%

**Phase 2: Backend Integration Tests**
1. Implement API endpoint tests (18 tests)
2. Test authorization scenarios
3. Test file upload/delete
4. Verify all edge cases

**Phase 3: Frontend Component Tests**
1. Setup React Testing Library
2. Implement component tests (15 tests)
3. Test user interactions
4. Test error states

**Phase 4: E2E Tests**
1. Create test fixtures (6 image files)
2. Create gallery.plan.json
3. Implement E2E scenarios (20 tests)
4. Integrate TestPlanTracker
5. Implement cleanup logic
6. Run full test suite

**Phase 5: Validation**
1. Run all tests in CI environment
2. Verify conditional cleanup works
3. Check test execution time
4. Review test coverage report
5. Document any flaky tests

---

**Last Updated:** 2025-11-11
**Status:** Ready for Implementation
