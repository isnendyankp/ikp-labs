# Photo Gallery Feature - Implementation Plan

**Status:** 🚧 IN PROGRESS (Started: 2025-11-13)
**Category:** Backend Feature
**Estimated Completion:** 2025-11-17 (5 days)

---

## Overview

Multi-photo gallery feature with privacy control, allowing users to upload multiple photos and set each photo as public or private.

### Current Status

**Progress:** 47.3% (35/74 total tasks)

**Completed:**
- ✅ **Phase 1: Backend Development (100%)** - 35/35 tasks
  - Database layer (migration, entity, repository, testing)
  - FileStorageService extensions (3 methods)
  - GalleryService complete (9 methods)
  - DTOs (4 classes with validation)
  - GalleryController (8 REST endpoints)
  - Exception handling (3 custom exceptions + handlers)
  - Security & config (JWT, permitAll rules)
  - Directory structure (uploads/gallery/)

**In Progress:**
- ⏳ **Phase 2: Backend Testing (0%)** - 0/25 tasks (Friday)

**Pending:**
- ⏳ Phase 2: Backend Testing (25 tests)
- ⏳ Phase 3: Frontend Development (14 tasks)

---

## Quick Scope

### ✅ What's Included

**Backend:**
- Gallery photos database table with privacy control
- 8 REST API endpoints for gallery management
- File storage for multiple photos per user
- Privacy filtering (public/private)
- Authorization (users can only edit own photos)

**Frontend:**
- My Gallery page (all own photos)
- Public Gallery page (all public photos)
- Photo upload modal
- Privacy toggle component
- Responsive design

**Testing:**
- 42 backend tests (unit + integration)
- 6 critical E2E tests
- TestPlanTracker integration

### ❌ What's Not Included

- Photo tags/categories
- Photo search
- Comments/likes
- Photo albums
- Bulk operations

---

## Key Features

1. **Multiple Photos per User**
   - Not limited to 1 profile picture
   - Each photo stored in user subdirectory
   - Unique filename: `photo-{id}-{timestamp}.ext`

2. **Privacy Control**
   - Each photo: Public or Private
   - Default: Private (privacy-first)
   - Toggle with one click
   - Repository-level filtering

3. **Photo Management**
   - Upload (with validation)
   - View (My Gallery + Public Gallery)
   - Edit metadata (title, description)
   - Delete (with file cleanup)
   - Toggle privacy

---

## Technical Highlights

### Database Schema

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
```

### File Storage

```
uploads/gallery/
├── user-1/
│   ├── photo-1-timestamp.jpg
│   └── photo-2-timestamp.png
└── user-2/
    └── photo-3-timestamp.jpg
```

### API Endpoints (8 total)

1. `POST /api/gallery/upload` - Upload photo
2. `GET /api/gallery/my-photos` - Get own photos
3. `GET /api/gallery/public` - Get all public photos
4. `GET /api/gallery/public/{userId}` - Get user's public photos
5. `GET /api/gallery/photo/{id}` - Get photo details
6. `PUT /api/gallery/photo/{id}` - Update photo
7. `PATCH /api/gallery/photo/{id}/privacy` - Toggle privacy
8. `DELETE /api/gallery/photo/{id}` - Delete photo

---

## Plan Documents

This plan follows the 4-document structure:

1. **[README.md](README.md)** (this file) - Plan overview
2. **[requirements.md](requirements.md)** - Detailed scope & user stories
3. **[technical-design.md](technical-design.md)** - Architecture & implementation details
4. **[checklist.md](checklist.md)** - Task checklist & validation steps

---

## Timeline

**5-Day Plan (Rabu-Minggu):**

| Day | Focus | Tasks | Deliverable |
|-----|-------|-------|-------------|
| Day 1 (Wed) | Backend Foundation | 15 | Repository + Service |
| Day 2 (Thu) | Backend API | 20 | 8 endpoints working |
| Day 3 (Fri) | Backend Testing | 25 | 42 tests passing |
| Day 4 (Sat) | Frontend | 14 | Working UI |
| Day 5 (Sun) | Polish + E2E | 6 | Production-ready |

**Total:** 74 tasks

---

## Success Criteria

**Functional:**
- ✅ All 8 API endpoints working
- ✅ Privacy filtering accurate
- ✅ File upload/delete working
- ✅ UI responsive on all devices

**Quality:**
- ✅ Backend test coverage >80%
- ✅ 48 tests passing (100% pass rate)
- ✅ No console errors
- ✅ Authorization prevents unauthorized access

**Deliverable:**
- ✅ Production-ready backend
- ✅ Working UI (basic polish)
- ✅ LinkedIn post published (Sunday)

---

## Current Sprint Tasks

**Day 1 (Wednesday, 2025-11-12):**
- [x] Migrate plans to structured system
- [x] Create GalleryPhotoRepository
- [x] Extend FileStorageService
- [x] Create GalleryService
- [x] Create all DTOs
- [x] Create GalleryController
- [x] Create custom exceptions

**Result:** 17 commits, exceeded expectations!

**Day 2 (Thursday, 2025-11-13):**
- [x] Update GlobalExceptionHandler
- [x] Refactor to use custom exceptions
- [x] Create directory structure
- [x] Regression testing (91/91 tests pass)

**Result:** 4 commits, Phase 1 100% complete!

**Next (Friday, 2025-11-14):**
- [ ] Write GalleryService unit tests (20-25 tests)
- [ ] Write GalleryController integration tests (15-20 tests)
- [ ] Achieve >80% test coverage

**Target:** 25 tests, 4-6 hours

---

## Related Links

**Implementation Details:**
- [Requirements Document](requirements.md) - Full scope & user stories
- [Technical Design](technical-design.md) - Architecture details
- [Task Checklist](checklist.md) - All 74 tasks (35/74 complete)

**Code References:**
- Migration: [V2__create_gallery_photos_table.sql](../../../../backend/registration-form-api/src/main/resources/db/migration/V2__create_gallery_photos_table.sql)
- Entity: [GalleryPhoto.java](../../../../backend/registration-form-api/src/main/java/com/registrationform/api/entity/GalleryPhoto.java)
- Repository: [GalleryPhotoRepository.java](../../../../backend/registration-form-api/src/main/java/com/registrationform/api/repository/GalleryPhotoRepository.java)
- Service: [GalleryService.java](../../../../backend/registration-form-api/src/main/java/com/registrationform/api/service/GalleryService.java)
- Controller: [GalleryController.java](../../../../backend/registration-form-api/src/main/java/com/registrationform/api/controller/GalleryController.java)

**Test Reports:**
- [Regression Test Report 2025-11-13](../../../../docs/testing/regression-test-2025-11-13.md)

**Original Planning Docs:**
- [docs/plans/photo-gallery-feature-summary.md](../../../../docs/plans/photo-gallery-feature-summary.md)
- [docs/plans/photo-gallery-feature-plan.md](../../../../docs/plans/photo-gallery-feature-plan.md)
- [docs/plans/photo-gallery-test-plan.md](../../../../docs/plans/photo-gallery-test-plan.md)

---

**Last Updated:** 2025-11-13 (End of Day 2)
**Next Review:** 2025-11-14 (Friday - Testing Day)
