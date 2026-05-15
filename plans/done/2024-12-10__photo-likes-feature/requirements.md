# Photo Likes Feature - Requirements Document

**Feature Name:** Photo Likes
**Version:** 1.0
**Last Updated:** December 10, 2024
**Status:** ✅ Approved for Implementation
**Timeline:** December 10-14, 2024 (5 days)

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Scope Definition](#scope-definition)
3. [User Stories](#user-stories)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [Success Criteria](#success-criteria)
7. [Dependencies](#dependencies)
8. [Assumptions](#assumptions)
9. [Risks & Mitigation](#risks--mitigation)

---

## Feature Overview

### Problem Statement

Users can currently upload, view, edit, and delete photos in the gallery, but there is **no way to express appreciation** for photos they enjoy or **save interesting photos for later**. This limits user engagement and prevents building a sense of community around shared photos.

### Current State

- ❌ No way to show appreciation for photos
- ❌ No way to bookmark interesting photos
- ❌ No engagement metrics for photo owners
- ❌ No social interaction features

### Desired State

- ✅ Users can like photos they enjoy
- ✅ Users can unlike photos
- ✅ Users can see how many likes a photo has
- ✅ Users can view all photos they've liked
- ✅ Photo owners can see engagement on their photos

---

### Solution Summary

Implement a **Photo Likes system** that allows authenticated users to:

1. **Like** any public photo with a single click
2. **Unlike** photos they've previously liked
3. **View** a dedicated "Liked Photos" page showing all photos they've liked
4. **See like counts** on photo cards and detail pages
5. **Experience instant feedback** through optimistic UI updates

### Key Benefits

- 🎯 Increased user engagement
- 💬 Foundation for future social features (comments, follows)
- 📊 Engagement metrics for content creators
- 🔖 Personal collection of favorite content

---

## Scope Definition

### In Scope ✅

### Phase 1 (This Week): Photo Likes

1. **Like/Unlike Functionality**
   - Users can like any public photo
   - Users can unlike photos they've liked
   - One like per user per photo (no duplicates)
   - Like count displayed on photos

2. **Liked Photos Page**
   - Dedicated page showing all liked photos
   - Pagination support (12 photos per page)
   - Same photo grid layout as gallery
   - Navigation link in sidebar/menu

3. **Backend Implementation**
   - Database table: `photo_likes`
   - 3 REST API endpoints
   - Entity, Repository, Service, Controller layers
   - Database constraints (unique photo+user)

4. **Frontend Implementation**
   - LikeButton component with heart icon
   - Optimistic UI updates
   - Error handling & rollback
   - LikedPhotosPage component

5. **Testing**
   - 8 Unit tests (service logic)
   - 6 Integration tests (controller + service)
   - 8 API tests (full backend with real DB)
   - 10 E2E tests (full FE + BE flow)

6. **Documentation**
   - Gherkin specs for Photo Likes (12 scenarios)
   - Gherkin specs for Profile Picture (10 scenarios - backfill)
   - API documentation updates
   - README updates

---

### Out of Scope ❌

### NOT in Phase 1 (This Week)

1. ❌ **Favorites/Bookmarks** - Different feature (next week)
2. ❌ **Photo Comments** - Separate feature (future)
3. ❌ **Like Notifications** - Requires email system (future)
4. ❌ **Who Liked This Photo** - List of users who liked (future)
5. ❌ **Unlike from Liked Photos Page** - Can only unlike from photo card/detail
6. ❌ **Sort by Most Liked** - Gallery sorting enhancement (future)
7. ❌ **Like Own Photos** - Users cannot like their own photos (business rule)

### Deferred to Future Phases

- Photo Favorites (Phase 2 - Next week)
- Real-time like updates via WebSocket (Phase 3 - Future)
- Like activity feed (Phase 4 - Future)
- Analytics dashboard (Phase 5 - Future)

---

### Scope Boundaries

### Clear Boundaries

- **Likes vs Favorites:**
  - Likes = Public appreciation (visible to others)
  - Favorites = Private bookmarks (only you see)
  - This week: **Likes only**

- **Public Photos Only:**
  - Users can only like public photos
  - Private photos cannot be liked
  - Own photos cannot be liked

- **Authentication Required:**
  - Must be logged in to like
  - Unauthenticated users can see like counts but cannot like

---

## User Stories

### Epic: Photo Likes System

**As a** registered user
**I want to** like photos I enjoy
**So that I** can show appreciation and save interesting content

---

### User Story 1: Like a Photo

**As a** registered user
**I want to** like a public photo
**So that I** can show appreciation for content I enjoy

### Acceptance Criteria

- ✅ When viewing a photo (gallery or detail), I see a heart icon
- ✅ When I click the heart icon, it fills in (visual feedback)
- ✅ The like count increases by 1 immediately
- ✅ The photo is saved to my "Liked Photos" collection
- ✅ I cannot like the same photo twice
- ✅ I cannot like my own photos
- ✅ I can only like public photos

**Given** I am a logged-in user
**And** I am viewing a public photo I haven't liked
**When** I click the like button
**Then** the photo should be marked as liked
**And** the like count should increase by 1
**And** the like button should show as filled

---

### User Story 2: Unlike a Photo

**As a** registered user
**I want to** unlike a photo I previously liked
**So that I** can change my mind or clean up my collection

### Acceptance Criteria

- ✅ When viewing a photo I've liked, the heart icon is filled
- ✅ When I click the filled heart, it becomes outline (unlike)
- ✅ The like count decreases by 1 immediately
- ✅ The photo is removed from my "Liked Photos" collection
- ✅ I can like the photo again later

**Given** I am a logged-in user
**And** I am viewing a photo I have liked
**When** I click the like button
**Then** the photo should be unmarked as liked
**And** the like count should decrease by 1
**And** the like button should show as outline

---

### User Story 3: View Liked Photos

**As a** registered user
**I want to** see all photos I've liked in one place
**So that I** can revisit content I enjoyed

### Acceptance Criteria

- ✅ I can navigate to "Liked Photos" page from main menu
- ✅ The page shows all photos I've liked, newest first
- ✅ Photos display in same grid layout as gallery
- ✅ I can see photo title, description, and like count
- ✅ Pagination works (12 photos per page)
- ✅ I can click a photo to view details
- ✅ If I haven't liked any photos, I see a helpful empty state

**Given** I am a logged-in user
**And** I have liked multiple photos
**When** I navigate to "Liked Photos" page
**Then** I should see all photos I've liked
**And** they should be ordered by most recently liked first

---

### User Story 4: See Like Count

**As a** any user (logged in or not)
**I want to** see how many likes a photo has
**So that I** can gauge its popularity

### Acceptance Criteria

- ✅ Like count displays on photo cards in gallery
- ✅ Like count displays on photo detail page
- ✅ Count updates immediately when I like/unlike
- ✅ Count is accurate (matches database)
- ✅ "0 likes" shows as "0" (not hidden)

**Given** I am viewing a photo
**When** the page loads
**Then** I should see the current like count
**And** the count should reflect the total number of users who liked it

---

### User Story 5: Optimistic UI Updates

**As a** registered user
**I want** instant feedback when I like/unlike
**So that** the app feels fast and responsive

### Acceptance Criteria

- ✅ When I click like, UI updates immediately (no loading spinner)
- ✅ Like count increases before API confirms
- ✅ If API fails, UI rolls back to previous state
- ✅ Error message shows if like fails
- ✅ Retry option available on failure

**Given** I am a logged-in user
**When** I click the like button
**Then** the UI should update instantly
**And** the API request should happen in the background
**And** if the API fails, the UI should revert

---

## Functional Requirements

### FR-1: Like Photo Endpoint

**Endpoint:** `POST /api/gallery/photo/{photoId}/like`
**Authentication:** Required (JWT)
**Request Body:** None (user ID from token)
**Response:** 201 Created

### Business Rules

1. User must be authenticated
2. Photo must exist and be public
3. User cannot like their own photo
4. User cannot like the same photo twice (unique constraint)
5. Creates record in `photo_likes` table with `(photo_id, user_id, created_at)`

### Validations

- Photo ID must be valid (photo exists)
- Photo must be public (is_public = true)
- Photo owner_id ≠ current user_id
- No existing like for this photo+user combination

### Error Cases

- 401 Unauthorized: No JWT token
- 404 Not Found: Photo doesn't exist
- 403 Forbidden: Photo is private OR user is owner
- 409 Conflict: Already liked

---

### FR-2: Unlike Photo Endpoint

**Endpoint:** `DELETE /api/gallery/photo/{photoId}/like`
**Authentication:** Required (JWT)
**Request Body:** None (user ID from token)
**Response:** 204 No Content

### Business Rules

1. User must be authenticated
2. Like must exist (user has previously liked this photo)
3. Deletes record from `photo_likes` table matching `(photo_id, user_id)`

### Validations

- Photo ID must be valid
- Like record must exist for this photo+user

### Error Cases

- 401 Unauthorized: No JWT token
- 404 Not Found: Photo doesn't exist OR not liked
- 400 Bad Request: Photo not previously liked

---

### FR-3: Get Liked Photos Endpoint

**Endpoint:** `GET /api/gallery/liked-photos?page=0&size=12`
**Authentication:** Required (JWT)

### Query Parameters

- `page` (optional, default: 0)
- `size` (optional, default: 12)

**Response:** 200 OK with paginated photo list

### Business Rules

1. Returns all photos liked by current user
2. Ordered by most recently liked first (created_at DESC)
3. Pagination support
4. Includes full photo details (same as gallery response)

### Response Format

```json
{
  "content": [
    {
      "id": 123,
      "photoUrl": "/uploads/gallery/...",
      "title": "Sunset Beach",
      "description": "Beautiful sunset",
      "isPublic": true,
      "uploadDate": "2024-12-10T10:00:00",
      "userId": 45,
      "userFullName": "John Doe",
      "likeCount": 15,
      "isLikedByCurrentUser": true
    }
  ],
  "pageable": {...},
  "totalPages": 3,
  "totalElements": 28,
  "size": 12,
  "number": 0
}
```

---

### FR-4: Like Button Component

**Component:** `LikeButton.tsx`

### Props

- `photoId: number` - Photo to like/unlike
- `isLiked: boolean` - Current like state
- `likeCount: number` - Current like count
- `onLikeChange?: (liked: boolean) => void` - Callback

### Behavior

1. Displays heart icon (outline if unliked, filled if liked)
2. Shows like count next to icon
3. On click:
   - Optimistically updates UI (instant feedback)
   - Calls API endpoint (POST or DELETE)
   - If API fails, rolls back UI
   - Shows error toast on failure

### States

- Default: Outline heart + count
- Liked: Filled heart + count
- Loading: Disabled state (during API call)
- Error: Reverts to previous state + error message

---

### FR-5: Liked Photos Page

**Route:** `/home/liked-photos`
**Component:** `LikedPhotosPage.tsx`
**Authentication:** Required

### Layout

- Page title: "Liked Photos"
- Same grid layout as gallery (1-4 columns)
- Pagination controls at bottom
- Empty state: "You haven't liked any photos yet. Start exploring!"

### Features

- Displays all liked photos
- Each photo card shows:
  - Photo image
  - Title & description
  - Like button (already liked)
  - Like count
  - Upload date
  - Uploader name
- Click photo to view details
- Pagination (12 per page)

---

## Non-Functional Requirements

### NFR-1: Performance

- ✅ Like/unlike API response time: < 200ms (p95)
- ✅ Liked Photos page load time: < 1 second (p95)
- ✅ Optimistic update: UI changes in < 50ms
- ✅ Database query optimization: Proper indexes on photo_id and user_id

---

### NFR-2: Scalability

- ✅ System handles 1000 likes per minute
- ✅ Database constraint prevents duplicate likes
- ✅ Pagination prevents loading all likes at once
- ✅ Indexes on foreign keys for fast lookups

---

### NFR-3: Reliability

- ✅ 100% test coverage for like/unlike logic
- ✅ Error handling for all edge cases
- ✅ Graceful degradation if API fails
- ✅ Rollback mechanism for optimistic updates

---

### NFR-4: Usability

- ✅ Like button visible on all photo cards
- ✅ Instant visual feedback (< 50ms)
- ✅ Clear error messages for users
- ✅ Accessible (keyboard navigation, screen readers)

---

### NFR-5: Security

- ✅ JWT authentication required for all like endpoints
- ✅ Users can only like public photos
- ✅ Users cannot like their own photos
- ✅ SQL injection prevention (JPA parameterized queries)
- ✅ CORS configuration allows only frontend origin

---

## Success Criteria

### Feature Completeness

✅ **Must Have (Phase 1 - This Week):**

1. Users can like any public photo
2. Users can unlike photos they've liked
3. Like count displays correctly on all photo views
4. Liked Photos page shows user's liked photos with pagination
5. Optimistic UI updates work correctly
6. All 32 tests pass (4 types: Unit, Integration, API, E2E)
7. Gherkin specs written for Photo Likes and Profile Picture

✅ **Should Have (Nice to Have):**

1. Like button animation (heart pops when liked)
2. Loading state during API call
3. Error toast notifications
4. Empty state with helpful message

❌ **Won't Have (Out of Scope):**

1. Favorites feature (next week)
2. Real-time updates (future)
3. Like notifications (future)
4. Who liked list (future)

---

### Quality Metrics

### Testing

- ✅ 32 tests total with 100% pass rate
- ✅ Unit tests: 8 tests (PhotoLikeService)
- ✅ Integration tests: 6 tests (Controller + Service)
- ✅ API tests: 8 tests (Full backend with real DB)
- ✅ E2E tests: 10 tests (Full FE + BE flow)

### Code Quality

- ✅ No duplicate code
- ✅ Follows project coding conventions
- ✅ Proper error handling
- ✅ Clear variable/function names

### Documentation

- ✅ Gherkin specs complete (22 scenarios total)
- ✅ API documentation updated
- ✅ README updated with feature
- ✅ Code comments for complex logic

---

### User Acceptance Criteria

### Feature is accepted when

1. ✅ I can like a photo and see immediate visual feedback
2. ✅ I can unlike a photo and see count decrease
3. ✅ I can navigate to Liked Photos and see all my likes
4. ✅ Like count is accurate across all views
5. ✅ System prevents duplicate likes
6. ✅ Error messages are clear and helpful
7. ✅ All tests pass
8. ✅ Performance is acceptable (< 1 sec page load)

---

## Dependencies

### Technical Dependencies

### Backend

- ✅ Spring Boot 3.3.6 (already installed)
- ✅ PostgreSQL database (already running)
- ✅ Spring Data JPA (already configured)
- ✅ JWT authentication (already implemented)
- ✅ Flyway migrations (already configured)

### Frontend

- ✅ Next.js 15.5.0 (already installed)
- ✅ React 19.1.0 (already installed)
- ✅ Tailwind CSS 4 (already installed)
- ✅ JWT token management (already implemented)

### Testing

- ✅ JUnit 5 + Mockito (already configured)
- ✅ Playwright (already installed)
- ✅ PostgreSQL test database (already configured)

### No new dependencies required

---

### Feature Dependencies

### Required Features (Must be complete)

- ✅ User Authentication (JWT) - Already implemented
- ✅ Photo Gallery (upload, view, CRUD) - Already implemented
- ✅ Public/Private photo privacy - Already implemented

### Blocked Features (Cannot start until this is done)

- ⏳ Photo Favorites - Depends on Likes pattern
- ⏳ Comments - Depends on engagement foundation
- ⏳ Like notifications - Depends on email system (future)

---

## Assumptions

### Business Assumptions

1. **Like = Public Appreciation**
   - Assumption: Likes are visible to all users (public metric)
   - Risk: Privacy concerns? (Low - social norm)

2. **One Like Per User Per Photo**
   - Assumption: Users cannot "super like" or give multiple likes
   - Risk: Users expect weighted likes? (Low - standard pattern)

3. **No Undo After Unlike**
   - Assumption: Unlike is permanent (no "are you sure?" dialog)
   - Risk: Accidental unlikes? (Low - can re-like immediately)

4. **Public Photos Only**
   - Assumption: Private photos cannot be liked
   - Risk: Users expect to like private photos in shared albums? (Low - not implemented yet)

---

### Technical Assumptions

1. **Database Performance**
   - Assumption: Indexes on photo_id and user_id provide good performance
   - Validation: Test with 10,000+ likes

2. **Optimistic Updates**
   - Assumption: Network latency is acceptable for optimistic pattern
   - Validation: Test on slow 3G connection

3. **JWT Token Validity**
   - Assumption: Token is valid for entire session
   - Validation: Handle token expiration gracefully

---

## Risks & Mitigation

### Risk 1: Duplicate Likes (Database Race Condition)

**Risk:** Two simultaneous like requests create duplicate records
**Probability:** Medium
**Impact:** High (data integrity)

### Mitigation

- ✅ Database unique constraint on (photo_id, user_id)
- ✅ API returns 409 Conflict if duplicate
- ✅ Frontend disables button during API call
- ✅ Test concurrent requests in integration tests

---

### Risk 2: Optimistic Update Rollback UX

**Risk:** Failed API causes confusing UI state changes
**Probability:** Low
**Impact:** Medium (user confusion)

### Mitigation

- ✅ Clear error toast with "Failed to like. Please try again."
- ✅ UI smoothly reverts to previous state
- ✅ Retry button in error toast
- ✅ Test network failures in E2E tests

---

### Risk 3: Performance with Many Likes

**Risk:** Liked Photos page slow with 1000+ liked photos
**Probability:** Low (most users < 100 likes)
**Impact:** Medium (slow page load)

### Mitigation

- ✅ Pagination (12 per page) prevents loading all at once
- ✅ Database indexes on photo_likes.user_id
- ✅ Lazy loading images
- ✅ Performance test with 1000+ likes

---

### Risk 4: Scope Creep

**Risk:** Adding Favorites, Comments, etc. during implementation
**Probability:** Medium
**Impact:** High (missed deadline)

### Mitigation

- ✅ Clear scope document (this file!)
- ✅ Defer all "nice to have" features
- ✅ Focus on 32 tests passing
- ✅ Daily checklist keeps focus

---

## Next Steps

### Immediate Actions (Today - Tuesday)

1. ✅ Review and approve this requirements document
2. ⏳ Read [Technical Design](technical-design.md)
3. ⏳ Create database migration (V3\_\_create_photo_likes.sql)
4. ⏳ Create PhotoLike entity
5. ⏳ Write Gherkin specs

### Tomorrow (Wednesday)

- Implement PhotoLikeService
- Create REST endpoints
- Write Playwright API tests (automated!)

### See [Daily Checklist](checklist.md) for detailed task breakdown

---

**Document Status:** ✅ Approved for Implementation
**Next Document:** [Technical Design](technical-design.md)

---

### Ready to build! Let's make this happen! 🚀
