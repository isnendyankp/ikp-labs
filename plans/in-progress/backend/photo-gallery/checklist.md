# Photo Gallery Feature - Implementation Checklist

**Status:** 🚧 IN PROGRESS
**Last Updated:** 2025-11-13
**Completion:** 2/74 tasks (2.7%)

---

## Progress Overview

| Phase | Tasks | Completed | In Progress | Pending | Progress |
|-------|-------|-----------|-------------|---------|----------|
| Phase 1: Backend Dev | 35 | 2 | 1 | 32 | 5.7% |
| Phase 2: Backend Tests | 25 | 0 | 0 | 25 | 0% |
| Phase 3: Frontend Dev | 14 | 0 | 0 | 14 | 0% |
| **TOTAL** | **74** | **2** | **1** | **71** | **2.7%** |

---

## Phase 1: Backend Development (5.7%)

### 1.1 Database Layer (50% complete)

- [x] **DB-001:** Create `V2__create_gallery_photos_table.sql` migration
  - ✅ Completed: 2025-11-12
  - Location: `backend/.../db/migration/V2__create_gallery_photos_table.sql`

- [x] **DB-002:** Create `GalleryPhoto` entity class
  - ✅ Completed: 2025-11-12
  - Location: `backend/.../entity/GalleryPhoto.java`

- [ ] **DB-003:** Create `GalleryPhotoRepository` interface
  - 🔄 In Progress
  - Todo: Define custom queries (findByUserId, findByIsPublicTrue, etc.)
  - Location: `backend/.../repository/GalleryPhotoRepository.java`

- [ ] **DB-004:** Test database migration
  - Todo: Run Spring Boot application
  - Todo: Verify table `gallery_photos` exists in PostgreSQL
  - Todo: Verify indexes created
  - Todo: Verify foreign key constraint works

---

### 1.2 Service Layer - FileStorageService (0% complete)

- [ ] **SVC-FILE-001:** Add `saveGalleryPhoto()` method
  - Todo: Accept (MultipartFile, userId, photoId)
  - Todo: Create user subdirectory if not exists
  - Todo: Generate filename: photo-{photoId}-{timestamp}.{ext}
  - Todo: Save file to: uploads/gallery/user-{userId}/
  - Todo: Return path: gallery/user-{userId}/filename

- [ ] **SVC-FILE-002:** Add `deleteGalleryPhoto()` method
  - Todo: Accept (userId, photoId, extension)
  - Todo: Build file path
  - Todo: Delete file from filesystem
  - Todo: Handle file not found gracefully

- [ ] **SVC-FILE-003:** Add `validateGalleryPhoto()` method
  - Todo: Check file not null/empty
  - Todo: Check file size ≤ 5MB
  - Todo: Check content type starts with "image/"
  - Todo: Check extension in allowed list (jpg, jpeg, png, gif, webp)
  - Todo: Throw IllegalArgumentException on failure

---

### 1.3 Service Layer - GalleryService (0% complete)

- [ ] **SVC-GAL-001:** Create `GalleryService` class
  - Todo: Add @Service annotation
  - Todo: Autowire GalleryPhotoRepository
  - Todo: Autowire FileStorageService
  - Todo: Autowire UserRepository

- [ ] **SVC-GAL-002:** Implement `uploadPhoto()` method
  - Todo: Validate file via FileStorageService
  - Todo: Get user from database
  - Todo: Create GalleryPhoto entity
  - Todo: Save to database (get ID)
  - Todo: Save file to disk
  - Todo: Update entity with file path
  - Todo: Return GalleryPhotoResponse

- [ ] **SVC-GAL-003:** Implement `getMyPhotos()` method
  - Todo: Accept (userId, Pageable)
  - Todo: Query repository.findByUserId()
  - Todo: Count total with repository.countByUserId()
  - Todo: Return GalleryListResponse with pagination

- [ ] **SVC-GAL-004:** Implement `getPublicPhotos()` method
  - Todo: Accept (Pageable)
  - Todo: Query repository.findByIsPublicTrue()
  - Todo: Count total with repository.countByIsPublicTrue()
  - Todo: Return GalleryListResponse with pagination

- [ ] **SVC-GAL-005:** Implement `getUserPublicPhotos()` method
  - Todo: Accept (userId, Pageable)
  - Todo: Query repository.findByUserIdAndIsPublicTrue()
  - Todo: Count total
  - Todo: Return GalleryListResponse

- [ ] **SVC-GAL-006:** Implement `getPhotoById()` method
  - Todo: Accept (photoId, requestingUserId)
  - Todo: Find photo or throw GalleryNotFoundException
  - Todo: Check privacy: if private, verify owner
  - Todo: Throw UnauthorizedGalleryAccessException if not authorized
  - Todo: Return GalleryPhotoDetailResponse

- [ ] **SVC-GAL-007:** Implement `updatePhoto()` method
  - Todo: Accept (photoId, userId, title, description, isPublic)
  - Todo: Find photo or throw GalleryNotFoundException
  - Todo: Check ownership (userId matches)
  - Todo: Update fields (title, description, isPublic)
  - Todo: Save to database
  - Todo: Return GalleryPhotoResponse

- [ ] **SVC-GAL-008:** Implement `togglePrivacy()` method
  - Todo: Accept (photoId, userId)
  - Todo: Find photo or throw GalleryNotFoundException
  - Todo: Check ownership
  - Todo: Call photo.togglePrivacy()
  - Todo: Save to database
  - Todo: Return GalleryPhotoResponse

- [ ] **SVC-GAL-009:** Implement `deletePhoto()` method
  - Todo: Accept (photoId, userId)
  - Todo: Find photo or throw GalleryNotFoundException
  - Todo: Check ownership
  - Todo: Delete file from disk
  - Todo: Delete from database
  - Todo: Return success

---

### 1.4 DTOs (0% complete)

- [ ] **DTO-001:** Create `GalleryPhotoRequest` DTO
  - Todo: Fields: title, description, isPublic
  - Todo: Add validation annotations (@Size, @NotNull optional)
  - Todo: Add Javadoc comments

- [ ] **DTO-002:** Create `GalleryPhotoResponse` DTO
  - Todo: Fields: id, userId, userName, filePath, title, description, isPublic, createdAt, updatedAt
  - Todo: Add static factory method: from(GalleryPhoto)
  - Todo: Add success field

- [ ] **DTO-003:** Create `GalleryListResponse` DTO
  - Todo: Fields: success, photos (List), pagination
  - Todo: Pagination fields: totalPhotos, totalPages, currentPage, pageSize
  - Todo: Add static factory method: from(List<GalleryPhoto>, total, Pageable)

- [ ] **DTO-004:** Create `GalleryPhotoDetailResponse` DTO
  - Todo: Extends GalleryPhotoResponse
  - Todo: Additional fields: userEmail
  - Todo: Add static factory method

- [ ] **DTO-005:** Add validation annotations
  - Todo: @NotNull where required
  - Todo: @Size for title (max 100)
  - Todo: @Size for description (max 5000)
  - Todo: Document validation rules

---

### 1.5 Controller Layer (0% complete)

- [ ] **CTRL-001:** Create `GalleryController` class
  - Todo: Add @RestController annotation
  - Todo: Add @RequestMapping("/api/gallery")
  - Todo: Autowire GalleryService
  - Todo: Add Javadoc

- [ ] **CTRL-002:** Implement `POST /api/gallery/upload`
  - Todo: Add @PostMapping("/upload")
  - Todo: Accept @RequestParam("file") MultipartFile
  - Todo: Accept optional params: title, description, isPublic
  - Todo: Get authenticated user from Authentication
  - Todo: Call service.uploadPhoto()
  - Todo: Return ResponseEntity<GalleryPhotoResponse>
  - Todo: Handle exceptions (FileUploadException, etc.)

- [ ] **CTRL-003:** Implement `GET /api/gallery/my-photos`
  - Todo: Add @GetMapping("/my-photos")
  - Todo: Accept @RequestParam for pagination
  - Todo: Get authenticated user from Authentication
  - Todo: Call service.getMyPhotos()
  - Todo: Return ResponseEntity<GalleryListResponse>

- [ ] **CTRL-004:** Implement `GET /api/gallery/public`
  - Todo: Add @GetMapping("/public")
  - Todo: Accept @RequestParam for pagination
  - Todo: Call service.getPublicPhotos()
  - Todo: Return ResponseEntity<GalleryListResponse>
  - Todo: Allow anonymous access

- [ ] **CTRL-005:** Implement `GET /api/gallery/public/{userId}`
  - Todo: Add @GetMapping("/public/{userId}")
  - Todo: Accept @PathVariable Long userId
  - Todo: Accept @RequestParam for pagination
  - Todo: Call service.getUserPublicPhotos()
  - Todo: Return ResponseEntity<GalleryListResponse>

- [ ] **CTRL-006:** Implement `GET /api/gallery/photo/{photoId}`
  - Todo: Add @GetMapping("/photo/{photoId}")
  - Todo: Accept @PathVariable Long photoId
  - Todo: Get requesting user ID (or null if anonymous)
  - Todo: Call service.getPhotoById()
  - Todo: Return ResponseEntity<GalleryPhotoDetailResponse>

- [ ] **CTRL-007:** Implement `PUT /api/gallery/photo/{photoId}`
  - Todo: Add @PutMapping("/photo/{photoId}")
  - Todo: Accept @PathVariable Long photoId
  - Todo: Accept @RequestBody GalleryPhotoRequest
  - Todo: Get authenticated user from Authentication
  - Todo: Call service.updatePhoto()
  - Todo: Return ResponseEntity<GalleryPhotoResponse>

- [ ] **CTRL-008:** Implement `PATCH /api/gallery/photo/{photoId}/privacy`
  - Todo: Add @PatchMapping("/photo/{photoId}/privacy")
  - Todo: Accept @PathVariable Long photoId
  - Todo: Get authenticated user from Authentication
  - Todo: Call service.togglePrivacy()
  - Todo: Return ResponseEntity<GalleryPhotoResponse>

- [ ] **CTRL-009:** Implement `DELETE /api/gallery/photo/{photoId}`
  - Todo: Add @DeleteMapping("/photo/{photoId}")
  - Todo: Accept @PathVariable Long photoId
  - Todo: Get authenticated user from Authentication
  - Todo: Call service.deletePhoto()
  - Todo: Return ResponseEntity with success message

---

### 1.6 Exception Handling (0% complete)

- [ ] **EXC-001:** Create `GalleryException` class
  - Todo: Extend RuntimeException
  - Todo: Add constructors (message, message+cause)
  - Todo: Add Javadoc

- [ ] **EXC-002:** Create `GalleryNotFoundException` class
  - Todo: Extend GalleryException
  - Todo: Default message: "Photo not found"
  - Todo: Add constructors

- [ ] **EXC-003:** Create `UnauthorizedGalleryAccessException` class
  - Todo: Extend GalleryException
  - Todo: Default message: "You are not authorized to access this photo"
  - Todo: Add constructors

- [ ] **EXC-004:** Update `GlobalExceptionHandler`
  - Todo: Add @ExceptionHandler for GalleryException
  - Todo: Add @ExceptionHandler for GalleryNotFoundException (404)
  - Todo: Add @ExceptionHandler for UnauthorizedGalleryAccessException (403)
  - Todo: Return proper ErrorResponse

---

### 1.7 Security & Config (0% complete)

- [ ] **SEC-001:** Update `SecurityConfig`
  - Todo: Add "/api/gallery/public/**" to permitAll()
  - Todo: Add "/api/gallery/**" to authenticated()
  - Todo: Verify JWT filter applied to gallery endpoints

- [ ] **CFG-001:** Update `application.properties`
  - Todo: Add `file.upload.gallery-directory=uploads/gallery/`
  - Todo: Verify multipart settings (already 5MB)
  - Todo: Document new properties

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

### Day 1: Wednesday, 2025-11-13

**Planned:**
- [x] Migrate plans to structured system (DB-001, DB-002 done)
- [ ] Create GalleryPhotoRepository (DB-003)
- [ ] Extend FileStorageService (SVC-FILE-001 to 003)
- [ ] Create GalleryService (SVC-GAL-001 to 009)

**Target:** 15 tasks (DB-003 to SVC-GAL-009)

**Actual Progress:** _To be filled at end of day_

**Blockers:** _None so far_

**Notes:**
- Planning migration complete
- 4-document system created
- Ready to start implementation

---

**Last Updated:** 2025-11-13
**Next Review:** 2025-11-13 (end of day)
