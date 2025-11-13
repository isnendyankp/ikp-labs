# Photo Gallery Feature - Implementation Checklist

**Status:** 🚧 IN PROGRESS
**Last Updated:** 2025-11-13 (End of Day 2)
**Completion:** 35/74 tasks (47.3%)

---

## Progress Overview

| Phase | Tasks | Completed | In Progress | Pending | Progress |
|-------|-------|-----------|-------------|---------|----------|
| Phase 1: Backend Dev | 35 | 35 | 0 | 0 | 100% ✅ |
| Phase 2: Backend Tests | 25 | 0 | 0 | 25 | 0% |
| Phase 3: Frontend Dev | 14 | 0 | 0 | 14 | 0% |
| **TOTAL** | **74** | **35** | **0** | **39** | **47.3%** |

---

## Phase 1: Backend Development (100% ✅)

### 1.1 Database Layer (100% complete)

- [x] **DB-001:** Create `V2__create_gallery_photos_table.sql` migration
  - ✅ Completed: 2025-11-12 (Commit 1)
  - Location: `backend/.../db/migration/V2__create_gallery_photos_table.sql`

- [x] **DB-002:** Create `GalleryPhoto` entity class
  - ✅ Completed: 2025-11-12 (Commit 2)
  - Location: `backend/.../entity/GalleryPhoto.java`

- [x] **DB-003:** Create `GalleryPhotoRepository` interface
  - ✅ Completed: 2025-11-12 (Commit 3)
  - Custom queries: findByUserId, findByIsPublicTrue, findByUserIdAndIsPublicTrue, count methods
  - Location: `backend/.../repository/GalleryPhotoRepository.java`

- [x] **DB-004:** Test database migration
  - ✅ Completed: 2025-11-13 (Day 2 regression testing)
  - Table `gallery_photos` verified in PostgreSQL
  - Indexes created successfully
  - Foreign key constraint working

---

### 1.2 Service Layer - FileStorageService (100% complete)

- [x] **SVC-FILE-001:** Add `saveGalleryPhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 4-5)
  - Accepts (MultipartFile, userId, photoId)
  - Creates user subdirectory if not exists
  - Generates filename: photo-{photoId}-{timestamp}.{ext}
  - Saves to: uploads/gallery/user-{userId}/
  - Returns path: gallery/user-{userId}/filename

- [x] **SVC-FILE-002:** Add `deleteGalleryPhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 4-5)
  - Accepts (userId, photoId, extension)
  - Builds file path correctly
  - Deletes file from filesystem
  - Handles file not found gracefully

- [x] **SVC-FILE-003:** Add `validateGalleryPhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 4-5)
  - Checks file not null/empty
  - Checks file size ≤ 5MB
  - Checks content type starts with "image/"
  - Checks extension in allowed list (jpg, jpeg, png, gif, webp)
  - Throws IllegalArgumentException on failure

---

### 1.3 Service Layer - GalleryService (100% complete)

- [x] **SVC-GAL-001:** Create `GalleryService` class
  - ✅ Completed: 2025-11-12 (Commits 6-10)
  - @Service annotation added
  - Autowired GalleryPhotoRepository
  - Autowired FileStorageService
  - Autowired UserRepository

- [x] **SVC-GAL-002:** Implement `uploadPhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10)
  - Validates file via FileStorageService
  - Gets user from database
  - Creates GalleryPhoto entity
  - Saves to database (gets ID)
  - Saves file to disk
  - Updates entity with file path
  - Returns GalleryPhotoResponse

- [x] **SVC-GAL-003:** Implement `getMyPhotos()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10)
  - Accepts (userId, Pageable)
  - Queries repository.findByUserId()
  - Counts total with repository.countByUserId()
  - Returns GalleryListResponse with pagination

- [x] **SVC-GAL-004:** Implement `getPublicPhotos()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10)
  - Accepts (Pageable)
  - Queries repository.findByIsPublicTrue()
  - Counts total with repository.countByIsPublicTrue()
  - Returns GalleryListResponse with pagination

- [x] **SVC-GAL-005:** Implement `getUserPublicPhotos()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10)
  - Accepts (userId, Pageable)
  - Queries repository.findByUserIdAndIsPublicTrue()
  - Counts total correctly
  - Returns GalleryListResponse

- [x] **SVC-GAL-006:** Implement `getPhotoById()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10, updated Commit 19)
  - Accepts (photoId, requestingUserId)
  - Finds photo or throws GalleryNotFoundException
  - Checks privacy: if private, verifies owner
  - Throws UnauthorizedGalleryAccessException if not authorized
  - Returns GalleryPhotoDetailResponse

- [x] **SVC-GAL-007:** Implement `updatePhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10, updated Commit 19)
  - Accepts (photoId, userId, title, description, isPublic)
  - Finds photo or throws GalleryNotFoundException
  - Checks ownership (userId matches)
  - Updates fields (title, description, isPublic)
  - Saves to database
  - Returns GalleryPhotoResponse

- [x] **SVC-GAL-008:** Implement `togglePrivacy()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10, updated Commit 19)
  - Accepts (photoId, userId)
  - Finds photo or throws GalleryNotFoundException
  - Checks ownership
  - Calls photo.togglePrivacy()
  - Saves to database
  - Returns GalleryPhotoResponse

- [x] **SVC-GAL-009:** Implement `deletePhoto()` method
  - ✅ Completed: 2025-11-12 (Commits 6-10, updated Commit 19)
  - Accepts (photoId, userId)
  - Finds photo or throws GalleryNotFoundException
  - Checks ownership
  - Deletes file from disk
  - Deletes from database
  - Returns success

---

### 1.4 DTOs (100% complete)

- [x] **DTO-001:** Create `GalleryPhotoRequest` DTO
  - ✅ Completed: 2025-11-12 (Commits 11-12)
  - Fields: title, description, isPublic
  - Validation annotations added (@Size, @NotNull optional)
  - Javadoc comments added

- [x] **DTO-002:** Create `GalleryPhotoResponse` DTO
  - ✅ Completed: 2025-11-12 (Commits 11-12)
  - Fields: id, userId, userName, filePath, title, description, isPublic, createdAt, updatedAt
  - Static factory method: from(GalleryPhoto)
  - Success field included

- [x] **DTO-003:** Create `GalleryListResponse` DTO
  - ✅ Completed: 2025-11-12 (Commits 11-12)
  - Fields: success, photos (List), pagination
  - Pagination fields: totalPhotos, totalPages, currentPage, pageSize
  - Static factory method: from(List<GalleryPhoto>, total, Pageable)

- [x] **DTO-004:** Create `GalleryPhotoDetailResponse` DTO
  - ✅ Completed: 2025-11-12 (Commits 11-12)
  - Extends GalleryPhotoResponse
  - Additional fields: userEmail
  - Static factory method added

- [x] **DTO-005:** Add validation annotations
  - ✅ Completed: 2025-11-12 (Commits 11-12)
  - @NotNull where required
  - @Size for title (max 100)
  - @Size for description (max 5000)
  - Validation rules documented

---

### 1.5 Controller Layer (100% complete)

- [x] **CTRL-001:** Create `GalleryController` class
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @RestController annotation added
  - @RequestMapping("/api/gallery") configured
  - GalleryService autowired
  - Javadoc added

- [x] **CTRL-002:** Implement `POST /api/gallery/upload`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @PostMapping("/upload") configured
  - Accepts @RequestParam("file") MultipartFile
  - Accepts optional params: title, description, isPublic
  - Gets authenticated user from Authentication
  - Calls service.uploadPhoto()
  - Returns ResponseEntity<GalleryPhotoResponse>
  - Exception handling implemented

- [x] **CTRL-003:** Implement `GET /api/gallery/my-photos`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @GetMapping("/my-photos") configured
  - Accepts @RequestParam for pagination
  - Gets authenticated user from Authentication
  - Calls service.getMyPhotos()
  - Returns ResponseEntity<GalleryListResponse>

- [x] **CTRL-004:** Implement `GET /api/gallery/public`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @GetMapping("/public") configured
  - Accepts @RequestParam for pagination
  - Calls service.getPublicPhotos()
  - Returns ResponseEntity<GalleryListResponse>
  - Anonymous access allowed

- [x] **CTRL-005:** Implement `GET /api/gallery/user/{userId}/public`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @GetMapping("/user/{userId}/public") configured
  - Accepts @PathVariable Long userId
  - Accepts @RequestParam for pagination
  - Calls service.getUserPublicPhotos()
  - Returns ResponseEntity<GalleryListResponse>

- [x] **CTRL-006:** Implement `GET /api/gallery/photo/{photoId}`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @GetMapping("/photo/{photoId}") configured
  - Accepts @PathVariable Long photoId
  - Gets requesting user ID (or null if anonymous)
  - Calls service.getPhotoById()
  - Returns ResponseEntity<GalleryPhotoDetailResponse>

- [x] **CTRL-007:** Implement `PUT /api/gallery/photo/{photoId}`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @PutMapping("/photo/{photoId}") configured
  - Accepts @PathVariable Long photoId
  - Accepts @RequestBody GalleryPhotoRequest
  - Gets authenticated user from Authentication
  - Calls service.updatePhoto()
  - Returns ResponseEntity<GalleryPhotoResponse>

- [x] **CTRL-008:** Implement `PUT /api/gallery/photo/{photoId}/toggle-privacy`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @PutMapping("/photo/{photoId}/toggle-privacy") configured
  - Accepts @PathVariable Long photoId
  - Gets authenticated user from Authentication
  - Calls service.togglePrivacy()
  - Returns ResponseEntity<GalleryPhotoResponse>

- [x] **CTRL-009:** Implement `DELETE /api/gallery/photo/{photoId}`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - @DeleteMapping("/photo/{photoId}") configured
  - Accepts @PathVariable Long photoId
  - Gets authenticated user from Authentication
  - Calls service.deletePhoto()
  - Returns ResponseEntity with success message

---

### 1.6 Exception Handling (100% complete)

- [x] **EXC-001:** Create `GalleryException` class
  - ✅ Completed: 2025-11-12 (Commits 16-17)
  - Extends RuntimeException
  - Constructors added (message, message+cause)
  - Javadoc added

- [x] **EXC-002:** Create `GalleryNotFoundException` class
  - ✅ Completed: 2025-11-12 (Commits 16-17)
  - Extends GalleryException
  - Default message: "Photo not found"
  - Constructors added

- [x] **EXC-003:** Create `UnauthorizedGalleryAccessException` class
  - ✅ Completed: 2025-11-12 (Commits 16-17)
  - Extends GalleryException
  - Default message: "You are not authorized to access this photo"
  - Constructors added

- [x] **EXC-004:** Update `GlobalExceptionHandler`
  - ✅ Completed: 2025-11-13 (Commit 18)
  - @ExceptionHandler for GalleryException (400 Bad Request)
  - @ExceptionHandler for GalleryNotFoundException (404 Not Found)
  - @ExceptionHandler for UnauthorizedGalleryAccessException (403 Forbidden)
  - Proper ErrorResponse returned

---

### 1.7 Security & Config (100% complete)

- [x] **SEC-001:** Update `SecurityConfig`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - "/api/gallery/public/**" added to permitAll()
  - "/api/gallery/**" requires authentication
  - JWT filter applied to gallery endpoints

- [x] **CFG-001:** Update `application.properties`
  - ✅ Completed: 2025-11-12 (Commits 13-15)
  - `file.upload.gallery-directory=uploads/gallery/` added
  - Multipart settings verified (5MB max)
  - Properties documented

- [x] **CFG-002:** Create gallery directory structure
  - ✅ Completed: 2025-11-13 (Commit 20)
  - Created `uploads/gallery/` directory
  - Added `.gitkeep` file
  - Updated `.gitignore` with proper rules

---

## Phase 2: Backend Testing (0%)

### 2.1 Repository Tests (0% complete)

- [ ] **RT-001:** Test findByUserId with pagination
- [ ] **RT-002:** Test findByIsPublicTrue filtering
- [ ] **RT-003:** Test findByUserIdAndIsPublicTrue
- [ ] **RT-004:** Test countByUserId
- [ ] **RT-005:** Test countByIsPublicTrue
- [ ] **RT-006:** Test cascade delete when user deleted
- [ ] **RT-007:** Verify test coverage >80%

---

### 2.2 FileStorageService Tests (0% complete)

- [ ] **FST-001:** Test saveGalleryPhoto - happy path
- [ ] **FST-002:** Test saveGalleryPhoto - creates subdirectory
- [ ] **FST-003:** Test saveGalleryPhoto - unique filenames
- [ ] **FST-004:** Test deleteGalleryPhoto - file removed
- [ ] **FST-005:** Test validateGalleryPhoto - file too large
- [ ] **FST-006:** Test validateGalleryPhoto - invalid format
- [ ] **FST-007:** Test validateGalleryPhoto - null file
- [ ] **FST-008:** Test validateGalleryPhoto - valid file

---

### 2.3 GalleryService Tests (0% complete)

- [ ] **GST-001:** Test uploadPhoto - happy path
- [ ] **GST-002:** Test uploadPhoto - invalid file throws exception
- [ ] **GST-003:** Test uploadPhoto - defaults to private
- [ ] **GST-004:** Test getMyPhotos - returns all user photos
- [ ] **GST-005:** Test getMyPhotos - pagination works
- [ ] **GST-006:** Test getPublicPhotos - only public shown
- [ ] **GST-007:** Test getUserPublicPhotos - filters correctly
- [ ] **GST-008:** Test getPhotoById - owner can see private
- [ ] **GST-009:** Test getPhotoById - non-owner cannot see private
- [ ] **GST-010:** Test getPhotoById - anyone can see public
- [ ] **GST-011:** Test updatePhoto - owner can update
- [ ] **GST-012:** Test updatePhoto - non-owner gets exception
- [ ] **GST-013:** Test togglePrivacy - private to public
- [ ] **GST-014:** Test togglePrivacy - public to private
- [ ] **GST-015:** Test togglePrivacy - non-owner gets exception
- [ ] **GST-016:** Test deletePhoto - owner can delete
- [ ] **GST-017:** Test deletePhoto - non-owner gets exception
- [ ] **GST-018:** Test deletePhoto - file cleanup works

---

### 2.4 Integration Tests (0% complete)

- [ ] **IT-001:** Test POST /upload with multipart file
- [ ] **IT-002:** Test POST /upload - unauthenticated blocked
- [ ] **IT-003:** Test POST /upload - invalid file rejected
- [ ] **IT-004:** Test GET /my-photos - returns user photos
- [ ] **IT-005:** Test GET /my-photos - pagination works
- [ ] **IT-006:** Test GET /public - accessible without auth
- [ ] **IT-007:** Test GET /public - only public photos shown
- [ ] **IT-008:** Test PUT /photo/{id} - owner updates successfully
- [ ] **IT-009:** Test PUT /photo/{id} - non-owner gets 403
- [ ] **IT-010:** Test PATCH /privacy - toggles successfully
- [ ] **IT-011:** Test DELETE /photo/{id} - owner deletes successfully
- [ ] **IT-012:** Test DELETE /photo/{id} - non-owner gets 403

---

## Phase 3: Frontend Development (0%)

### 3.1 Components (0% complete)

- [ ] **FC-001:** Create GalleryGrid component
- [ ] **FC-002:** Create PhotoCard component
- [ ] **FC-003:** Create PhotoUploadModal component
- [ ] **FC-004:** Create PhotoDetailModal component
- [ ] **FC-005:** Create PrivacyToggle component
- [ ] **FC-006:** Create ImageLightbox component

---

### 3.2 Pages (0% complete)

- [ ] **FP-001:** Create MyGallery page
- [ ] **FP-002:** Create PublicGallery page
- [ ] **FP-003:** Update navigation with gallery links

---

### 3.3 API Service (0% complete)

- [ ] **API-001:** Create galleryService.ts file
- [ ] **API-002:** Implement uploadPhoto()
- [ ] **API-003:** Implement getMyPhotos()
- [ ] **API-004:** Implement getPublicPhotos()
- [ ] **API-005:** Implement getPhotoById()
- [ ] **API-006:** Implement updatePhoto()
- [ ] **API-007:** Implement togglePrivacy()
- [ ] **API-008:** Implement deletePhoto()
- [ ] **API-009:** Add error handling and toasts

---

## Validation Gates

### Phase 1 Complete When:
- ✅ All 35 backend tasks checked off
- ✅ All 8 API endpoints implemented
- ✅ Manual testing passes (Postman/curl)
- ✅ No compilation errors
- ✅ Code follows project conventions

### Phase 2 Complete When:
- ✅ All 25 test tasks checked off
- ✅ Test coverage >80%
- ✅ All tests pass (100% pass rate)
- ✅ No flaky tests

### Phase 3 Complete When:
- ✅ All 14 frontend tasks checked off
- ✅ Upload works in browser
- ✅ Gallery displays correctly
- ✅ Privacy toggle works
- ✅ Responsive on mobile/tablet/desktop

---

## Daily Progress Log

### Day 1: Wednesday, 2025-11-12

**Planned:**
- [x] Migrate plans to structured system (DB-001, DB-002 done)
- [x] Create GalleryPhotoRepository (DB-003)
- [x] Extend FileStorageService (SVC-FILE-001 to 003)
- [x] Create GalleryService (SVC-GAL-001 to 009)

**Target:** 15 tasks (DB-003 to SVC-GAL-009)

**Actual Progress:** 17 commits, ~30 backend tasks completed (EXCEEDED TARGET!)

**Achievements:**
- ✅ All database layer complete (DB-003, DB-004)
- ✅ All FileStorageService extensions complete (SVC-FILE-001 to 003)
- ✅ All GalleryService methods complete (SVC-GAL-001 to 009)
- ✅ All DTOs complete (DTO-001 to 005)
- ✅ All Controller endpoints complete (CTRL-001 to 009)
- ✅ All custom exceptions complete (EXC-001 to 003)
- ✅ Security & config complete (SEC-001, CFG-001)

**Commits:** 17 total
- Commits 1-2: Database migration + entity
- Commits 3: Repository with custom queries
- Commits 4-5: FileStorageService gallery methods
- Commits 6-10: GalleryService complete implementation
- Commits 11-12: All 4 DTOs created
- Commits 13-15: GalleryController with 8 endpoints
- Commits 16-17: Custom exceptions

**Blockers:** None

**Notes:**
- Exceeded expectations - completed almost ALL backend in Day 1
- Only exception handlers remain for Day 2

---

### Day 2: Thursday, 2025-11-13

**Planned:**
- [x] Update GlobalExceptionHandler (EXC-004)
- [x] Refactor GalleryService to use custom exceptions
- [x] Create gallery directory structure
- [x] Regression testing (verify old features work)

**Target:** 5 tasks (exception handling + testing)

**Actual Progress:** 4 commits, all backend tasks 100% complete

**Achievements:**
- ✅ GlobalExceptionHandler updated with 3 new handlers (Commit 18)
- ✅ GalleryService refactored to use specific exceptions (Commit 19)
- ✅ Gallery directory structure created (Commit 20)
- ✅ Regression testing complete - 91/91 tests pass (Commit 21)
- ✅ **PHASE 1 (Backend Development) 100% COMPLETE**

**Commits:** 4 total (18-21)
- Commit 18: GlobalExceptionHandler updates
- Commit 19: GalleryService exception refactoring
- Commit 20: Gallery directory + .gitignore
- Commit 21: Regression test documentation

**Test Results:**
- Spring Boot: Started successfully ✅
- All 91 existing tests: PASSED ✅
- No regression detected ✅
- Build time: 2.892 seconds

**Blockers:** None

**Notes:**
- Backend 100% complete, ready for testing phase
- No breaking changes to existing features
- Friday: Write gallery-specific tests (Option A agreed)

---

**Last Updated:** 2025-11-13 (End of Day 2)
**Next Review:** 2025-11-14 (Friday - Testing Day)
