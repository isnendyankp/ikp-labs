# Photo Gallery Feature - Implementation Plan

> **⚠️ LEGACY DOCUMENT NOTICE**
>
> This document is kept for **historical reference** and contains the original detailed technical design.
>
> **For current progress and task tracking**, see the structured plan:
> - **Main Plan**: [plans/in-progress/backend/photo-gallery/](../../plans/in-progress/backend/photo-gallery/)
> - **Progress Checklist**: [photo-gallery-progress-checklist.md](./photo-gallery-progress-checklist.md)
> - **Test Plan**: [photo-gallery-test-plan.md](./photo-gallery-test-plan.md)
>
> **Status Update (2025-11-17):** ✅ Backend & Frontend COMPLETE, E2E & Docs pending Week 2

**Original Status:** 📋 Planning
**Created:** 2025-11-11
**Feature Type:** New Feature
**Priority:** Medium

---

## Executive Summary

Implement multi-photo gallery feature with privacy control, allowing users to upload multiple photos and set each photo as public or private. This extends the existing profile picture functionality.

**Current State:**
- ✅ Single profile picture per user
- ✅ File upload infrastructure (FileStorageService)
- ✅ User authentication (JWT)
- ✅ Test automation framework (Playwright + Test Plan Checklist)

**Target State:**
- 🎯 Multiple photos per user (gallery)
- 🎯 Privacy control (public/private) per photo
- 🎯 Public gallery page (view all users' public photos)
- 🎯 Personal gallery page (view own photos: public + private)
- 🎯 Photo management (upload, edit metadata, delete, toggle privacy)

---

## Scope

### ✅ In Scope

**Backend:**
- Gallery photos database table with privacy control
- REST API endpoints for gallery management
- File storage for multiple photos per user
- Privacy filtering in queries
- Authorization (users can only edit/delete own photos)

**Frontend:**
- Gallery grid component (responsive layout)
- Photo upload modal (single and multi-file)
- Photo detail modal (full size view)
- Privacy toggle component
- My Gallery page (all own photos)
- Public Gallery page (all public photos)
- Pagination for large galleries

**Testing:**
- Unit tests (backend services and repositories)
- Integration tests (API endpoints)
- Component tests (React components)
- E2E tests (full user flows with TestPlanTracker)

**Documentation:**
- API reference
- User guide (how to use gallery)
- Technical documentation (architecture)

### ❌ Out of Scope (Future Features)

- Photo tags/categories
- Photo search by title
- Photo sharing links
- Photo statistics (views, likes)
- Image cropping/editing
- Bulk operations (delete multiple)
- Comments on photos
- Photo albums/collections

---

## Technical Design

### Database Schema

**New Table: `gallery_photos`**

```sql
CREATE TABLE gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    upload_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_gallery_user_id ON gallery_photos(user_id);
CREATE INDEX idx_gallery_public ON gallery_photos(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_gallery_user_created ON gallery_photos(user_id, created_at DESC);
```

**Fields Explanation:**
- `id`: Auto-generated unique identifier
- `user_id`: Foreign key to users table (photo owner)
- `file_path`: Path to photo file (e.g., "gallery/user-83/photo-156-1731238845123.jpg")
- `title`: Optional photo title (max 100 chars)
- `description`: Optional long description (TEXT)
- `is_public`: Privacy flag (true = public, false = private, default = false)
- `upload_order`: Custom sort order (default 0, sort by created_at)
- `created_at`: Upload timestamp
- `updated_at`: Last update timestamp

---

### File Storage Structure

```
uploads/
├── profiles/                    # Existing (profile pictures)
│   └── user-{userId}.jpg
└── gallery/                     # NEW (gallery photos)
    ├── user-1/
    │   ├── photo-1-1731238845123.jpg
    │   ├── photo-2-1731238850456.png
    │   └── photo-3-1731238855789.jpg
    ├── user-2/
    │   └── photo-4-1731238860123.jpg
    └── ...
```

**Naming Convention:**
- Directory: `gallery/user-{userId}/`
- Filename: `photo-{photoId}-{timestamp}.{extension}`

**Benefits:**
- Organized per user (easy cleanup when user deleted)
- Unique filenames (photoId + timestamp)
- No conflicts between users
- Easy to find photos for debugging

---

### API Endpoints

#### 1. Upload Photo
```
POST /api/gallery/upload
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

Request Body:
- file: (binary file)
- title: (optional string)
- description: (optional string)
- isPublic: (optional boolean, default: false)

Response (201 Created):
{
  "success": true,
  "message": "Photo uploaded successfully",
  "photo": {
    "id": 156,
    "userId": 83,
    "filePath": "gallery/user-83/photo-156-1731238845123.jpg",
    "title": "Sunset at Beach",
    "description": "Beautiful sunset during vacation",
    "isPublic": false,
    "createdAt": "2025-11-11T10:30:00",
    "updatedAt": "2025-11-11T10:30:00"
  }
}
```

#### 2. Get My Photos
```
GET /api/gallery/my-photos?page=0&size=20&sort=createdAt,desc
Authorization: Bearer {jwt-token}

Response (200 OK):
{
  "success": true,
  "photos": [
    {
      "id": 156,
      "filePath": "gallery/user-83/photo-156-1731238845123.jpg",
      "title": "Sunset at Beach",
      "isPublic": false,
      "createdAt": "2025-11-11T10:30:00"
    },
    ...
  ],
  "totalPhotos": 25,
  "currentPage": 0,
  "totalPages": 2,
  "pageSize": 20
}
```

#### 3. Get Public Photos (All Users)
```
GET /api/gallery/public?page=0&size=20
Authorization: Optional (can be accessed without login)

Response (200 OK):
{
  "success": true,
  "photos": [
    {
      "id": 157,
      "userId": 84,
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "filePath": "gallery/user-84/photo-157-1731238850123.jpg",
      "title": "Mountain View",
      "isPublic": true,
      "createdAt": "2025-11-11T11:00:00"
    },
    ...
  ],
  "totalPhotos": 100,
  "currentPage": 0,
  "totalPages": 5
}
```

#### 4. Get User's Public Photos
```
GET /api/gallery/public/{userId}?page=0&size=20
Authorization: Optional

Response (200 OK):
{
  "success": true,
  "user": {
    "id": 84,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "photos": [ ... ],
  "totalPhotos": 15,
  "currentPage": 0,
  "totalPages": 1
}
```

#### 5. Get Photo Details
```
GET /api/gallery/photo/{photoId}
Authorization: Bearer {jwt-token} (required for private photos)

Response (200 OK):
{
  "success": true,
  "photo": {
    "id": 156,
    "userId": 83,
    "userName": "Demo User",
    "filePath": "gallery/user-83/photo-156-1731238845123.jpg",
    "title": "Sunset at Beach",
    "description": "Beautiful sunset during vacation",
    "isPublic": false,
    "createdAt": "2025-11-11T10:30:00",
    "updatedAt": "2025-11-11T10:30:00"
  }
}
```

#### 6. Update Photo Metadata
```
PUT /api/gallery/photo/{photoId}
Authorization: Bearer {jwt-token}
Content-Type: application/json

Request Body:
{
  "title": "New Title",
  "description": "New description",
  "isPublic": true
}

Response (200 OK):
{
  "success": true,
  "message": "Photo updated successfully",
  "photo": { ... }
}
```

#### 7. Toggle Privacy
```
PATCH /api/gallery/photo/{photoId}/privacy
Authorization: Bearer {jwt-token}

Response (200 OK):
{
  "success": true,
  "message": "Privacy updated successfully",
  "photo": {
    "id": 156,
    "isPublic": true,  // toggled
    "updatedAt": "2025-11-11T11:00:00"
  }
}
```

#### 8. Delete Photo
```
DELETE /api/gallery/photo/{photoId}
Authorization: Bearer {jwt-token}

Response (200 OK):
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

---

### Security Rules

**Authorization Matrix:**

| Endpoint | Anonymous | Authenticated User | Photo Owner |
|----------|-----------|-------------------|-------------|
| Upload photo | ❌ | ✅ (own) | ✅ |
| Get my photos | ❌ | ✅ (own) | ✅ |
| Get public photos | ✅ | ✅ | ✅ |
| Get photo details | ✅ (public only) | ✅ (public only) | ✅ (own: public + private) |
| Update photo | ❌ | ❌ | ✅ (own only) |
| Toggle privacy | ❌ | ❌ | ✅ (own only) |
| Delete photo | ❌ | ❌ | ✅ (own only) |

**Privacy Filtering:**
- Public endpoints: Always filter `is_public = TRUE`
- My photos endpoint: Show all (public + private) for owner only
- Photo details: Show private photos only to owner
- Update/Delete: Only owner can modify/delete

**File Validation:**
- Max file size: 5MB
- Allowed formats: JPG, JPEG, PNG, GIF, WEBP
- Max photos per user: No limit (can add later if needed)

---

## Implementation Checklist

### Phase 1: Backend Development

#### Database Layer
- [x] Create `V2__create_gallery_photos_table.sql` migration
- [x] Create `GalleryPhoto` entity with JPA mappings
- [ ] Create `GalleryPhotoRepository` with custom queries:
  - [ ] `findByUserId(Long userId, Pageable pageable)`
  - [ ] `findByIsPublicTrue(Pageable pageable)`
  - [ ] `findByUserIdAndIsPublicTrue(Long userId, Pageable pageable)`
  - [ ] `countByUserId(Long userId)`
  - [ ] `countByIsPublicTrue()`

#### Service Layer
- [ ] Extend `FileStorageService` with gallery methods:
  - [ ] `saveGalleryPhoto(MultipartFile file, Long userId, Long photoId)`
  - [ ] `deleteGalleryPhoto(Long userId, Long photoId, String extension)`
  - [ ] `validateGalleryPhoto(MultipartFile file)`
- [ ] Create `GalleryService` for business logic:
  - [ ] `uploadPhoto(MultipartFile file, Long userId, String title, String description, Boolean isPublic)`
  - [ ] `getMyPhotos(Long userId, Pageable pageable)`
  - [ ] `getPublicPhotos(Pageable pageable)`
  - [ ] `getUserPublicPhotos(Long userId, Pageable pageable)`
  - [ ] `getPhotoById(Long photoId, Long requestingUserId)`
  - [ ] `updatePhoto(Long photoId, Long userId, String title, String description, Boolean isPublic)`
  - [ ] `togglePrivacy(Long photoId, Long userId)`
  - [ ] `deletePhoto(Long photoId, Long userId)`

#### Controller Layer
- [ ] Create `GalleryController`:
  - [ ] POST `/api/gallery/upload`
  - [ ] GET `/api/gallery/my-photos`
  - [ ] GET `/api/gallery/public`
  - [ ] GET `/api/gallery/public/{userId}`
  - [ ] GET `/api/gallery/photo/{photoId}`
  - [ ] PUT `/api/gallery/photo/{photoId}`
  - [ ] PATCH `/api/gallery/photo/{photoId}/privacy`
  - [ ] DELETE `/api/gallery/photo/{photoId}`

#### DTOs
- [ ] Create `GalleryPhotoRequest` DTO (for upload/update)
- [ ] Create `GalleryPhotoResponse` DTO (single photo)
- [ ] Create `GalleryListResponse` DTO (paginated list)
- [ ] Create `GalleryPhotoDetailResponse` DTO (with user info)
- [ ] Add validation annotations (@NotNull, @Size, etc.)

#### Exception Handling
- [ ] Create `GalleryException` class
- [ ] Create `GalleryNotFoundException` class
- [ ] Create `UnauthorizedGalleryAccessException` class
- [ ] Update `GlobalExceptionHandler` with gallery exceptions

#### Security Configuration
- [ ] Update `SecurityConfig` for gallery endpoints
- [ ] Public endpoints: `/api/gallery/public/**`
- [ ] Protected endpoints: `/api/gallery/**`
- [ ] Add authorization checks in service layer

#### Configuration
- [ ] Update `application.properties`:
  - [ ] `file.upload.gallery-directory=uploads/gallery/`
  - [ ] `gallery.max-photos-per-user=100` (optional limit)

---

### Phase 2: Backend Testing

#### Unit Tests
- [x] ~~`GalleryPhotoRepositoryTest`~~ → **Covered by GalleryServiceTest** ✅
  - [x] Repository methods tested via service layer (best practice)
  - [x] No dedicated repository test needed (standard Spring Data JPA)
- [ ] `FileStorageServiceTest` (gallery methods):
  - [ ] Test save gallery photo with user subdirectory
  - [ ] Test delete gallery photo all extensions
  - [ ] Test validation (size, type, extension)
- [ ] `GalleryServiceTest`:
  - [ ] Test upload photo (happy path)
  - [ ] Test upload with invalid file (should throw)
  - [ ] Test get my photos (pagination)
  - [ ] Test get public photos (only public shown)
  - [ ] Test privacy filtering (private not shown to others)
  - [ ] Test update photo (owner only)
  - [ ] Test toggle privacy
  - [ ] Test delete photo with file cleanup
  - [ ] Test authorization (non-owner cannot edit/delete)

#### Integration Tests
- [ ] `GalleryControllerTest`:
  - [ ] Test POST `/upload` with multipart file
  - [ ] Test GET `/my-photos` with authentication
  - [ ] Test GET `/public` without authentication
  - [ ] Test GET `/photo/{id}` authorization
  - [ ] Test PUT `/photo/{id}` (owner updates successfully)
  - [ ] Test PUT `/photo/{id}` (non-owner gets 403)
  - [ ] Test PATCH `/privacy` toggle
  - [ ] Test DELETE `/photo/{id}` (owner deletes successfully)
  - [ ] Test DELETE `/photo/{id}` (non-owner gets 403)
  - [ ] Test pagination (page size, page number)
  - [ ] Test file cleanup on delete

---

### Phase 3: Frontend Development

#### Gallery Components
- [ ] Create `GalleryGrid.tsx`:
  - [ ] Responsive grid layout (3-4 columns)
  - [ ] Loading state
  - [ ] Empty state
  - [ ] Error state
- [ ] Create `PhotoCard.tsx`:
  - [ ] Thumbnail image
  - [ ] Title display
  - [ ] Public/Private badge
  - [ ] Action buttons (View, Edit, Delete)
  - [ ] Privacy toggle switch
  - [ ] Hover effects
- [ ] Create `PhotoUploadModal.tsx`:
  - [ ] File input (single and multi-file)
  - [ ] Image preview
  - [ ] Title input field
  - [ ] Description textarea
  - [ ] Privacy toggle (Public/Private)
  - [ ] Upload progress bar
  - [ ] Validation messages
- [ ] Create `PhotoDetailModal.tsx`:
  - [ ] Full-size image display
  - [ ] Photo metadata (title, description, date)
  - [ ] Owner info (if public photo)
  - [ ] Edit mode (title, description, privacy)
  - [ ] Delete confirmation
- [ ] Create `PrivacyToggle.tsx`:
  - [ ] Toggle switch component
  - [ ] Public/Private labels
  - [ ] Loading state during toggle
  - [ ] Success/error feedback
- [ ] Create `ImageLightbox.tsx`:
  - [ ] Full-screen image viewer
  - [ ] Close button
  - [ ] Navigation (prev/next) if in gallery
  - [ ] Zoom controls (optional)

#### Gallery Pages
- [ ] Create `MyGallery.tsx` page:
  - [ ] Page header with "Upload Photo" button
  - [ ] Filter: All / Public / Private
  - [ ] Sort: Newest / Oldest / Title A-Z
  - [ ] GalleryGrid integration
  - [ ] Pagination controls
  - [ ] Empty state: "No photos yet. Upload your first photo!"
- [ ] Create `PublicGallery.tsx` page:
  - [ ] Page header: "Public Gallery"
  - [ ] Filter by user (optional)
  - [ ] GalleryGrid integration
  - [ ] Pagination controls
  - [ ] Empty state: "No public photos available"
- [ ] Update navigation:
  - [ ] Add "My Gallery" link in user menu
  - [ ] Add "Public Gallery" link in main nav

#### API Service
- [ ] Create `galleryService.ts`:
  - [ ] `uploadPhoto(file, title, description, isPublic)`
  - [ ] `getMyPhotos(page, size, sort)`
  - [ ] `getPublicPhotos(page, size)`
  - [ ] `getUserPublicPhotos(userId, page, size)`
  - [ ] `getPhotoById(photoId)`
  - [ ] `updatePhoto(photoId, data)`
  - [ ] `togglePrivacy(photoId)`
  - [ ] `deletePhoto(photoId)`
  - [ ] Error handling with try-catch
  - [ ] Loading states
  - [ ] Toast notifications (success/error)

#### State Management
- [ ] Create gallery state context (or Redux slice):
  - [ ] Photos array
  - [ ] Loading state
  - [ ] Error state
  - [ ] Pagination state (current page, total pages)
  - [ ] Filter state (all/public/private)
  - [ ] Sort state

#### UI/UX Enhancements
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading skeletons
- [ ] Image lazy loading
- [ ] Infinite scroll (alternative to pagination)
- [ ] Confirmation dialogs (delete, privacy toggle)
- [ ] Success toasts (upload, update, delete)
- [ ] Error toasts with retry option
- [ ] Keyboard shortcuts (Esc to close modal)

---

### Phase 4: End-to-End Testing

#### E2E Test Scenarios (Playwright)

**Test File:** `frontend/tests/e2e/gallery.spec.ts`

- [ ] **GAL-001: Upload Single Photo**
  - Given user is logged in
  - When user uploads valid photo with title "Sunset"
  - Then photo appears in My Gallery
  - And photo is marked as Private by default

- [ ] **GAL-002: Upload Multiple Photos**
  - Given user is logged in
  - When user uploads 5 photos at once
  - Then all 5 photos appear in My Gallery

- [ ] **GAL-003: Toggle Privacy to Public**
  - Given user has private photo
  - When user toggles privacy to Public
  - Then photo appears in Public Gallery

- [ ] **GAL-004: Delete Photo**
  - Given user has photo in gallery
  - When user deletes photo
  - Then photo is removed from gallery
  - And file is deleted from server

- [ ] **GAL-005: View Public Gallery**
  - Given multiple users have public photos
  - When user visits Public Gallery
  - Then only public photos are shown
  - And private photos are not visible

- [ ] **GAL-006: Edit Photo Metadata**
  - Given user has photo with title "Old Title"
  - When user updates title to "New Title"
  - Then photo shows "New Title"

- [ ] **GAL-007: Pagination**
  - Given user has 25 photos
  - When user loads My Gallery
  - Then page 1 shows 20 photos
  - And page 2 shows 5 photos

- [ ] **GAL-008: Upload Validation - File Too Large**
  - Given user selects file > 5MB
  - When user tries to upload
  - Then error message "File size exceeds 5MB" shown

- [ ] **GAL-009: Upload Validation - Invalid Format**
  - Given user selects .txt file
  - When user tries to upload
  - Then error message "Only image files allowed" shown

- [ ] **GAL-010: Authorization - Cannot Delete Others' Photos**
  - Given user A has photo
  - When user B tries to delete user A's photo (via API)
  - Then request is blocked with 403 Forbidden

#### Test Plan Integration
- [ ] Create `gallery.plan.json` test plan file
- [ ] Integrate with `TestPlanTracker` class
- [ ] Implement conditional cleanup (delete on pass, keep on fail)
- [ ] Create test fixtures:
  - [ ] `tests/fixtures/gallery/valid-photo.jpg` (< 1MB)
  - [ ] `tests/fixtures/gallery/valid-photo.png` (< 1MB)
  - [ ] `tests/fixtures/gallery/large-photo.jpg` (> 5MB)
  - [ ] `tests/fixtures/gallery/invalid-file.txt`
- [ ] Add cleanup endpoint in `TestAdminController` for gallery photos
- [ ] Document test execution in test README

#### Component Tests (React Testing Library)
- [ ] Test `GalleryGrid` rendering
- [ ] Test `PhotoCard` actions (edit, delete, toggle)
- [ ] Test `PhotoUploadModal` file selection and preview
- [ ] Test `PrivacyToggle` click behavior
- [ ] Test pagination controls

---

### Phase 5: Documentation

#### API Documentation
- [ ] Create `docs/reference/gallery-api.md`:
  - [ ] All 8 endpoints documented
  - [ ] Request/response examples
  - [ ] Error codes and messages
  - [ ] Authorization requirements
  - [ ] Rate limiting (if added)

#### User Documentation
- [ ] Create `docs/how-to/use-gallery.md`:
  - [ ] How to upload photos
  - [ ] How to set privacy (public/private)
  - [ ] How to edit photo metadata
  - [ ] How to delete photos
  - [ ] How to view public gallery

#### Technical Documentation
- [ ] Create `docs/explanation/gallery-architecture.md`:
  - [ ] Database schema explanation
  - [ ] File storage strategy
  - [ ] Privacy control implementation
  - [ ] Security design
  - [ ] Performance considerations

#### Tutorial
- [ ] Create `docs/tutorials/gallery-tutorial.md`:
  - [ ] Step-by-step: Upload first photo
  - [ ] Step-by-step: Create public photo gallery
  - [ ] Step-by-step: Manage privacy settings

#### Update Existing Docs
- [ ] Update main `README.md` with gallery feature
- [ ] Update `docs/reference/database-schema.md` with gallery_photos table
- [ ] Update `docs/reference/api-endpoints.md` with gallery endpoints

---

### Phase 6: Optimization & Polish

#### Performance Optimization
- [ ] Backend:
  - [ ] Add database query optimization (avoid N+1)
  - [ ] Add pagination to all list endpoints
  - [ ] Add caching for public gallery (Redis - optional)
  - [ ] Generate thumbnails for faster loading (optional)
- [ ] Frontend:
  - [ ] Implement image lazy loading
  - [ ] Add loading skeletons
  - [ ] Optimize bundle size (code splitting)
  - [ ] Add service worker for offline support (optional)

#### Code Quality
- [ ] Backend:
  - [ ] Code review checklist
  - [ ] Test coverage > 80%
  - [ ] No code smells (SonarQube - optional)
  - [ ] Javadoc comments complete
- [ ] Frontend:
  - [ ] ESLint/Prettier formatting
  - [ ] Accessibility (ARIA labels)
  - [ ] Responsive design tested on mobile
  - [ ] Browser compatibility (Chrome, Firefox, Safari)

#### Production Readiness
- [ ] Add logging (upload, delete, privacy toggle)
- [ ] Add monitoring (photo upload metrics)
- [ ] Add error tracking (Sentry - optional)
- [ ] Add rate limiting for upload endpoint
- [ ] Add storage limit per user (e.g., max 100 photos)
- [ ] Add total storage usage tracking

---

## Success Criteria

**Functional Requirements:**
- ✅ Users can upload multiple photos
- ✅ Users can set each photo as public or private
- ✅ Public photos visible to all users in Public Gallery
- ✅ Private photos only visible to owner
- ✅ Users can edit photo metadata (title, description, privacy)
- ✅ Users can delete own photos (with file cleanup)
- ✅ Gallery supports pagination
- ✅ Authorization prevents users from editing/deleting others' photos

**Technical Requirements:**
- ✅ All backend unit tests pass (>80% coverage)
- ✅ All integration tests pass
- ✅ All E2E tests pass
- ✅ API response time < 500ms (for single photo operations)
- ✅ Gallery page load time < 2s (for 20 photos)
- ✅ File upload < 3s (for 5MB file)
- ✅ No security vulnerabilities (photo access, file upload)

**Quality Requirements:**
- ✅ Code follows project conventions
- ✅ Comprehensive documentation complete
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Accessibility standards met (WCAG 2.1 Level A)
- ✅ No console errors in production

---

## Dependencies

**Must Complete Before Starting:**
- ✅ User authentication system (JWT) - Already done
- ✅ File upload infrastructure (FileStorageService) - Already done
- ✅ Test automation framework (Playwright) - Already done

**External Dependencies:**
- PostgreSQL database (already configured)
- Spring Boot 3.3.6
- React (already set up)
- Playwright test runner

**Inter-Task Dependencies:**
1. Entity → Repository → Service → Controller (sequential)
2. Backend APIs → Frontend Services → Frontend Components
3. Unit Tests → Integration Tests → E2E Tests
4. Implementation → Testing → Documentation

---

## Acceptance Criteria

**For Backend Completion:**
- [ ] All 8 API endpoints implemented and working
- [ ] Privacy filtering works correctly
- [ ] Authorization prevents unauthorized access
- [ ] File storage creates user subdirectories
- [ ] File cleanup works on photo delete
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Code coverage > 80%

**For Frontend Completion:**
- [ ] My Gallery page shows all own photos
- [ ] Public Gallery page shows only public photos
- [ ] Upload modal supports single and multi-file
- [ ] Privacy toggle updates database and UI
- [ ] Delete confirms and removes photo
- [ ] Pagination works correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] All component tests pass

**For E2E Testing Completion:**
- [ ] All 10 test scenarios implemented
- [ ] Tests use TestPlanTracker integration
- [ ] Conditional cleanup works (pass = clean, fail = preserve)
- [ ] Tests run independently (no dependencies)
- [ ] Tests complete in < 5 minutes total
- [ ] Test plan shows progress tracking

**For Documentation Completion:**
- [ ] API reference complete with examples
- [ ] User guide published
- [ ] Technical architecture documented
- [ ] Tutorial walkthrough complete
- [ ] All docs reviewed and approved

---

## Next Steps

**Today (Planning Phase):**
1. Review this plan document
2. Approve scope and technical design
3. Clarify any questions or concerns
4. Adjust checklist if needed

**Tomorrow (Implementation):**
1. Start Phase 1: Backend Development
2. Complete database layer (Repository)
3. Implement service layer
4. Create DTOs and exceptions

**This Week:**
1. Complete Backend Development (Phase 1)
2. Complete Backend Testing (Phase 2)
3. Start Frontend Development (Phase 3)

---

## Notes

- Migration V2 and GalleryPhoto entity already created (2025-11-11)
- Following Test Plan Checklist Strategy for all tests
- Using existing FileStorageService pattern for consistency
- Privacy-first approach: default is_public = false
- File storage mirrors profile picture pattern (separate directories)

---

**Last Updated:** 2025-11-11
**Status:** Ready for Review
