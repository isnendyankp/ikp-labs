# Photo Gallery Feature - Requirements

**Status:** 🚧 IN PROGRESS
**Last Updated:** 2025-11-13

---

## Scope Definition

### ✅ What IS Included (In Scope)

#### Backend Components

**1. Database Layer:**
- `gallery_photos` table with privacy control
- Foreign key to users table with CASCADE delete
- Indexes for performance (user_id, is_public)
- Migration file (V2__create_gallery_photos_table.sql)

**2. Entity & Repository:**
- GalleryPhoto JPA entity with ManyToOne relationship
- GalleryPhotoRepository with custom queries:
  - Find photos by user ID (paginated)
  - Find public photos (paginated)
  - Find user's public photos (paginated)
  - Count methods for pagination

**3. Service Layer:**
- FileStorageService extensions for gallery photos
- GalleryService for business logic:
  - Upload photo with validation
  - Get user's photos (all: public + private)
  - Get public photos (filtered)
  - Update photo metadata
  - Delete photo (with file cleanup)
  - Toggle privacy setting

**4. API Endpoints (8 total):**
- POST /api/gallery/upload - Upload new photo
- GET /api/gallery/my-photos - Get authenticated user's photos
- GET /api/gallery/public - Get all public photos
- GET /api/gallery/public/{userId} - Get specific user's public photos
- GET /api/gallery/photo/{photoId} - Get photo details
- PUT /api/gallery/photo/{photoId} - Update photo metadata
- PATCH /api/gallery/photo/{photoId}/privacy - Toggle public/private
- DELETE /api/gallery/photo/{photoId} - Delete photo

**5. DTOs:**
- GalleryPhotoRequest (upload/update)
- GalleryPhotoResponse (single photo)
- GalleryListResponse (paginated list)
- GalleryPhotoDetailResponse (with user info)

**6. Exception Handling:**
- GalleryException (base exception)
- GalleryNotFoundException (photo not found)
- UnauthorizedGalleryAccessException (authorization failures)

**7. Security & Authorization:**
- JWT authentication for protected endpoints
- Public endpoints: /api/gallery/public/** (no auth)
- Owner-only operations: edit, delete, toggle privacy
- Privacy filtering at repository level

**8. File Storage:**
- User subdirectories: uploads/gallery/user-{userId}/
- Unique filenames: photo-{photoId}-{timestamp}.{ext}
- File validation: size (5MB max), type (images only), extension
- Auto-delete files when photo deleted

#### Frontend Components

**1. Components:**
- GalleryGrid - Responsive photo grid layout
- PhotoCard - Individual photo thumbnail with actions
- PhotoUploadModal - File upload with preview
- PhotoDetailModal - Full-size view with metadata
- PrivacyToggle - Public/Private switch
- ImageLightbox - Full-screen viewer

**2. Pages:**
- MyGallery - View all own photos (public + private)
- PublicGallery - View all users' public photos
- Navigation integration

**3. API Service:**
- galleryService.ts with all API methods
- Error handling and loading states
- Toast notifications

#### Testing

**1. Backend Tests (42 tests):**
- Repository tests (7 tests)
- FileStorageService tests (8 tests)
- GalleryService tests (18 tests)
- Integration/API tests (9 tests)

**2. Frontend Tests (6 tests):**
- Component tests (optional - not priority)
- Critical E2E tests (6 scenarios)

**3. Test Infrastructure:**
- TestPlanTracker integration
- Test fixtures (valid/invalid images)
- Cleanup endpoints for test data

---

### ❌ What is NOT Included (Out of Scope)

**Future Features (Explicitly Excluded):**
- Photo tags or categories
- Photo search functionality
- Photo comments
- Photo likes or reactions
- Photo statistics (views, downloads)
- Photo albums or collections
- Bulk operations (delete multiple, upload multiple)
- Image editing or cropping
- Photo sharing links
- Photo download feature
- Social features (follow users, feed)

**Advanced Features (Not Now):**
- Image thumbnails generation
- CDN integration
- Cloud storage (S3, etc.)
- Image optimization/compression
- EXIF data extraction
- Geolocation tagging
- Face detection
- Duplicate detection

**Rationale for Exclusions:**
- Focus on core functionality first
- Keep scope manageable (5 days)
- Can be added incrementally later
- MVP approach

---

## User Stories

### Epic: Photo Gallery Management

#### Story 1: Upload Photo

**As a** registered user
**I want to** upload photos to my gallery
**So that** I can share my photos with others or keep them private

**Acceptance Criteria:**

**Given** I am a logged-in user
**When** I upload a valid image file (JPG, PNG, GIF, WEBP)
**Then** The photo is saved to my gallery
**And** The photo is set to Private by default
**And** I receive a success message
**And** The photo appears in My Gallery

**Given** I am a logged-in user
**When** I try to upload a file larger than 5MB
**Then** I receive an error message "File size exceeds 5MB"
**And** The upload is rejected

**Given** I am a logged-in user
**When** I try to upload a non-image file
**Then** I receive an error message "Only image files are allowed"
**And** The upload is rejected

---

#### Story 2: View My Gallery

**As a** registered user
**I want to** view all my uploaded photos
**So that** I can manage my photo collection

**Acceptance Criteria:**

**Given** I am a logged-in user
**When** I navigate to My Gallery
**Then** I see all my photos (both public and private)
**And** Each photo displays a privacy badge (Public or Private)
**And** Photos are paginated (20 per page)

**Given** I am a logged-in user with no photos
**When** I navigate to My Gallery
**Then** I see an empty state message "No photos yet. Upload your first photo!"

---

#### Story 3: View Public Gallery

**As a** any user (logged in or not)
**I want to** view all public photos from all users
**So that** I can discover content shared by the community

**Acceptance Criteria:**

**Given** I am any user (authenticated or anonymous)
**When** I navigate to Public Gallery
**Then** I see only public photos from all users
**And** Private photos are not visible
**And** Each photo shows the owner's name
**And** Photos are paginated (20 per page)

**Given** There are no public photos
**When** I navigate to Public Gallery
**Then** I see an empty state message "No public photos available"

---

#### Story 4: Toggle Photo Privacy

**As a** registered user
**I want to** change my photo's privacy setting
**So that** I can control who sees my photos

**Acceptance Criteria:**

**Given** I am a logged-in user with a private photo
**When** I toggle the privacy to Public
**Then** The photo becomes visible in Public Gallery
**And** I receive a success message
**And** The privacy badge updates to "Public"

**Given** I am a logged-in user with a public photo
**When** I toggle the privacy to Private
**Then** The photo is removed from Public Gallery
**And** The photo is still visible in My Gallery
**And** The privacy badge updates to "Private"

**Given** I am not the owner of a photo
**When** I try to toggle its privacy
**Then** I receive a 403 Forbidden error
**And** The photo privacy is not changed

---

#### Story 5: Delete Photo

**As a** registered user
**I want to** delete my photos
**So that** I can remove photos I no longer want

**Acceptance Criteria:**

**Given** I am a logged-in user with a photo
**When** I click the delete button
**And** I confirm the deletion
**Then** The photo is removed from my gallery
**And** The photo file is deleted from the server
**And** I receive a success message

**Given** I am not the owner of a photo
**When** I try to delete it
**Then** I receive a 403 Forbidden error
**And** The photo is not deleted

---

#### Story 6: Edit Photo Metadata

**As a** registered user
**I want to** edit my photo's title and description
**So that** I can provide context for my photos

**Acceptance Criteria:**

**Given** I am a logged-in user with a photo
**When** I edit the title and description
**And** I save the changes
**Then** The photo metadata is updated
**And** I receive a success message
**And** The updated metadata is displayed

**Given** I am not the owner of a photo
**When** I try to edit its metadata
**Then** I receive a 403 Forbidden error
**And** The photo metadata is not changed

---

### Epic: Privacy & Authorization

#### Story 7: Privacy Filtering

**As a** system
**I want to** enforce privacy rules at the database level
**So that** private photos are never exposed accidentally

**Acceptance Criteria:**

**Given** A user requests public photos
**When** The query is executed
**Then** Only photos with is_public = TRUE are returned
**And** Private photos are filtered at repository level

**Given** A user requests their own photos
**When** The query is executed
**Then** All their photos are returned (public + private)

**Given** A user requests another user's photos
**When** The query is executed
**Then** Only that user's public photos are returned

---

#### Story 8: Authorization Enforcement

**As a** system
**I want to** prevent unauthorized photo operations
**So that** users can only modify their own photos

**Acceptance Criteria:**

**Given** A user tries to edit another user's photo
**When** The request is processed
**Then** The request is rejected with 403 Forbidden
**And** The photo is not modified

**Given** A user tries to delete another user's photo
**When** The request is processed
**Then** The request is rejected with 403 Forbidden
**And** The photo is not deleted

---

### Epic: File Management

#### Story 9: File Upload Validation

**As a** system
**I want to** validate uploaded files
**So that** only valid images are stored

**Acceptance Criteria:**

**Given** A file larger than 5MB is uploaded
**When** Validation runs
**Then** The upload is rejected
**And** Error message is returned

**Given** A non-image file is uploaded
**When** Validation runs
**Then** The upload is rejected
**And** Error message is returned

**Given** A valid image file is uploaded
**When** Validation runs
**Then** The upload is accepted
**And** File is saved to disk

---

#### Story 10: File Cleanup

**As a** system
**I want to** clean up files when photos are deleted
**So that** disk space is not wasted

**Acceptance Criteria:**

**Given** A photo is deleted by the user
**When** The deletion is processed
**Then** The database record is removed
**And** The file is deleted from disk

**Given** A user is deleted
**When** The CASCADE delete runs
**Then** All the user's photos are deleted from database
**And** All the user's photo files are deleted from disk

---

## Success Criteria

### Functional Requirements

**Backend:**
- ✅ All 8 API endpoints implemented and working
- ✅ Privacy filtering works correctly (private photos not exposed)
- ✅ Authorization prevents unauthorized access
- ✅ File upload validation enforces size/type limits
- ✅ File cleanup works on photo delete
- ✅ Pagination works for large galleries

**Frontend:**
- ✅ My Gallery shows all own photos (public + private)
- ✅ Public Gallery shows only public photos
- ✅ Upload modal supports file selection and preview
- ✅ Privacy toggle updates immediately
- ✅ Delete confirms before removing photo
- ✅ Responsive design works on mobile/tablet/desktop

**Integration:**
- ✅ Upload → Photo appears in gallery
- ✅ Toggle privacy → Photo appears/disappears from Public Gallery
- ✅ Delete → Photo removed from gallery and disk
- ✅ Page refresh → Photos persist correctly

### Quality Requirements

**Testing:**
- ✅ Backend test coverage >80%
- ✅ All 42 backend tests pass (100% pass rate)
- ✅ 6 critical E2E tests pass
- ✅ No flaky tests

**Performance:**
- ✅ Photo upload <3 seconds (5MB file)
- ✅ Gallery load <2 seconds (20 photos)
- ✅ API response time <500ms
- ✅ Pagination query <200ms

**Security:**
- ✅ No private photos leaked to public endpoints
- ✅ Authorization checks prevent unauthorized operations
- ✅ File validation prevents malicious uploads
- ✅ SQL injection prevented (parameterized queries)

**Code Quality:**
- ✅ Code follows project conventions
- ✅ Comprehensive Javadoc comments
- ✅ No code smells or warnings
- ✅ Proper exception handling

### Documentation Requirements

**Technical Docs:**
- ✅ API endpoints documented with examples
- ✅ Database schema explained
- ✅ Architecture decisions documented
- ✅ Testing strategy explained

**User Docs:**
- ✅ How to upload photos
- ✅ How to set privacy
- ✅ How to manage gallery

---

## Validation Steps

**Before marking feature complete, verify:**

1. ✅ All user stories pass acceptance criteria
2. ✅ All 8 API endpoints tested manually
3. ✅ Privacy filtering validated (no leaks)
4. ✅ Authorization validated (403 for unauthorized)
5. ✅ File upload validation tested (size, type)
6. ✅ File cleanup verified (delete works)
7. ✅ All 42 backend tests pass
8. ✅ 6 E2E tests pass
9. ✅ UI works on mobile/tablet/desktop
10. ✅ No console errors in browser
11. ✅ LinkedIn post drafted and reviewed
12. ✅ Plan marked as COMPLETED

---

## Dependencies

**Prerequisites (Must be complete before starting):**
- ✅ User authentication (JWT) - Already done
- ✅ File upload infrastructure (FileStorageService) - Already done
- ✅ Database (PostgreSQL) - Already configured
- ✅ Test framework (Playwright) - Already set up

**No Blockers:** All dependencies are met.

---

## Risks & Mitigations

**Risk 1: File storage grows quickly**
- **Impact:** Disk space usage
- **Mitigation:** Add storage limit per user (e.g., max 100 photos)
- **Status:** Accepted risk for MVP

**Risk 2: Privacy bugs expose private photos**
- **Impact:** Security/privacy violation
- **Mitigation:** Repository-level filtering, comprehensive tests
- **Status:** Mitigated with testing

**Risk 3: Large uploads slow down system**
- **Impact:** User experience
- **Mitigation:** 5MB file size limit, validation before save
- **Status:** Mitigated with limits

---

**Last Updated:** 2025-11-13
**Status:** Requirements finalized, ready for implementation
