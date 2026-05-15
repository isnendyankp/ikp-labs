# Photo Favorites Feature - Requirements Document

**Feature Name:** Photo Favorites
**Version:** 1.0
**Last Updated:** December 18, 2024
**Status:** ✅ Approved for Implementation
**Timeline:** December 19-23, 2024 (5 days)

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

Users can currently like photos to show appreciation (public engagement), but there is **no way to privately save photos for later viewing**. This limits the ability to build personal collections and organize content they want to revisit.

### Current State

- ✅ Users can like photos (public appreciation)
- ❌ No way to privately bookmark photos
- ❌ No personal collection management
- ❌ Cannot save own photos to favorites
- ❌ No quick access to saved content

### Desired State

- ✅ Users can favorite any photo (public or own)
- ✅ Users can unfavorite photos
- ✅ Users can view all their favorited photos
- ✅ Favorites are private (only user can see)
- ✅ Works alongside Likes feature

---

### Solution Summary

Implement a **Photo Favorites system** that allows authenticated users to:

1. **Favorite** any photo they have access to
2. **Unfavorite** photos they've previously saved
3. **View** a dedicated "Favorited Photos" page showing all their saved photos
4. **Private collection** - only the user can see their favorites
5. **Experience instant feedback** through optimistic UI updates

### Key Benefits

- 🔖 Personal bookmarking system
- 📂 Content organization for later
- 🔒 Private collection (unlike Likes which are public)
- ⚡ Quick access to saved content
- 💡 Can favorite own photos for portfolio/showcase

---

## Scope Definition

### In Scope ✅

### Phase 2 (This Week): Photo Favorites

1. **Favorite/Unfavorite Functionality**
   - Users can favorite any photo they have access to
   - Users can unfavorite photos they've saved
   - One favorite per user per photo (no duplicates)
   - **Users CAN favorite their own photos** (different from Likes)
   - Private bookmarks (only user sees their favorites)

2. **Favorited Photos Page**
   - Dedicated page showing all favorited photos
   - Pagination support (12 photos per page)
   - Same photo grid layout as gallery
   - Navigation link in sidebar/menu
   - Empty state with helpful message

3. **Backend Implementation**
   - Database table: `photo_favorites`
   - 3 REST API endpoints
   - Entity, Repository, Service, Controller layers
   - Database constraints (unique photo+user)

4. **Frontend Implementation**
   - FavoriteButton component with star icon
   - Optimistic UI updates
   - Error handling & rollback
   - FavoritedPhotosPage component

5. **Testing**
   - 8 Unit tests (service logic)
   - 6 Integration tests (controller + service)
   - 8 API tests (full backend with real DB)
   - 10 E2E tests (full FE + BE flow)

6. **Documentation**
   - Gherkin specs for Photo Favorites (12 scenarios)
   - API documentation updates
   - README updates

---

### Out of Scope ❌

### NOT in Phase 2 (This Week)

1. ❌ **Favorite Collections/Folders** - Organizing favorites into categories (future)
2. ❌ **Favorite Tags** - Tagging favorites for organization (future)
3. ❌ **Share Favorites** - Sharing favorite collections with others (future)
4. ❌ **Favorite Notes** - Adding personal notes to favorites (future)
5. ❌ **Favorite Counter** - Public display of how many users favorited (future)
6. ❌ **Export Favorites** - Download favorited photos as zip (future)
7. ❌ **Sort Favorited Photos** - Custom sorting options (future)

### Deferred to Future Phases

- Favorite Collections (Phase 3 - Future)
- Public favorite counter (Phase 4 - Future)
- Export functionality (Phase 5 - Future)
- Advanced organization features (Phase 6 - Future)

---

### Scope Boundaries

### Clear Boundaries

- **Favorites vs Likes:**
  - Favorites = **Private** bookmarks (only you see)
  - Likes = **Public** appreciation (everyone sees count)
  - **Both can coexist** on same photo!
  - This week: **Favorites only**

- **Privacy Model:**
  - Favorites are 100% private
  - No one else can see what you favorited
  - No favorite counter visible to others
  - Your own favorite status not visible to others

- **Photo Access:**
  - Can favorite any photo you can view
  - Can favorite your own photos
  - Can favorite public photos
  - **Can favorite private photos IF you're the owner**

- **Authentication Required:**
  - Must be logged in to favorite
  - Unauthenticated users cannot favorite
  - Favorites tied to user account

---

## User Stories

### Epic: Photo Favorites System

**As a** registered user
**I want to** save photos to my favorites
**So that I** can easily find and revisit content I want to keep

---

### User Story 1: Favorite a Photo

**As a** registered user
**I want to** favorite a photo
**So that I** can save it for later viewing

### Acceptance Criteria

- ✅ When viewing a photo (gallery or detail), I see a star icon
- ✅ When I click the star icon, it fills in (visual feedback)
- ✅ The photo is saved to my "Favorited Photos" collection
- ✅ I cannot favorite the same photo twice
- ✅ **I CAN favorite my own photos** (unlike Likes)
- ✅ I can favorite public AND my own private photos
- ✅ No counter visible to others (private)

**Given** I am a logged-in user
**And** I am viewing a photo I haven't favorited
**When** I click the favorite button
**Then** the photo should be marked as favorited
**And** the favorite button should show as filled star
**And** the photo should appear in my Favorited Photos page

---

### User Story 2: Unfavorite a Photo

**As a** registered user
**I want to** unfavorite a photo I previously saved
**So that I** can clean up my collection or change my mind

### Acceptance Criteria

- ✅ When viewing a photo I've favorited, the star icon is filled
- ✅ When I click the filled star, it becomes outline (unfavorite)
- ✅ The photo is removed from my "Favorited Photos" collection
- ✅ I can favorite the photo again later
- ✅ Unfavoriting is instant with optimistic update

**Given** I am a logged-in user
**And** I am viewing a photo I have favorited
**When** I click the favorite button
**Then** the photo should be unmarked as favorited
**And** the favorite button should show as outline
**And** the photo should be removed from my collection

---

### User Story 3: View Favorited Photos

**As a** registered user
**I want to** see all photos I've favorited in one place
**So that I** can easily access my saved content

### Acceptance Criteria

- ✅ I can navigate to "Favorited Photos" page from main menu
- ✅ The page shows all photos I've favorited, newest first
- ✅ Photos display in same grid layout as gallery
- ✅ I can see photo title, description (if I favorited my own photos)
- ✅ Pagination works (12 photos per page)
- ✅ I can click a photo to view details
- ✅ If I haven't favorited any photos, I see a helpful empty state
- ✅ **Only I can see my favorited photos** (private)

**Given** I am a logged-in user
**And** I have favorited multiple photos
**When** I navigate to "Favorited Photos" page
**Then** I should see all photos I've favorited
**And** they should be ordered by most recently favorited first
**And** no one else can see this list

---

### User Story 4: Private Favorites

**As a** registered user
**I want** my favorites to be private
**So that** I can save content without others knowing

### Acceptance Criteria

- ✅ My favorited photos are only visible to me
- ✅ No favorite counter displays on photos (unlike Likes)
- ✅ Other users cannot see what I've favorited
- ✅ Photo owners don't know who favorited their photos
- ✅ Privacy is enforced at API level

**Given** I am any user
**When** I view someone else's photo
**Then** I should NOT see if others have favorited it
**And** I should NOT see a favorite count

---

### User Story 5: Favorite Own Photos

**As a** registered user
**I want to** favorite my own photos
**So that I** can highlight them or organize my portfolio

### Acceptance Criteria

- ✅ I can favorite photos I uploaded
- ✅ I can favorite my own public photos
- ✅ I can favorite my own private photos
- ✅ **This is different from Likes** (where I cannot like my own photos)
- ✅ Use case: Portfolio organization, featured content

**Given** I am a logged-in user
**And** I am viewing my own photo
**When** I click the favorite button
**Then** the photo should be added to my favorites
**And** I can easily access it later

---

### User Story 6: Optimistic UI Updates

**As a** registered user
**I want** instant feedback when I favorite/unfavorite
**So that** the app feels fast and responsive

### Acceptance Criteria

- ✅ When I click favorite, UI updates immediately (no loading spinner)
- ✅ If API fails, UI rolls back to previous state
- ✅ Error message shows if favorite fails
- ✅ Retry option available on failure

**Given** I am a logged-in user
**When** I click the favorite button
**Then** the UI should update instantly
**And** the API request should happen in the background
**And** if the API fails, the UI should revert

---

### User Story 7: Works Alongside Likes

**As a** registered user
**I want to** both like AND favorite the same photo
**So that I** can show appreciation (public) and save (private)

### Acceptance Criteria

- ✅ I can like and favorite the same photo
- ✅ Like button (heart) and Favorite button (star) work independently
- ✅ Both buttons can be active at same time
- ✅ Unlike and Unfavorite are independent actions

**Given** I am viewing a photo
**When** I like the photo
**Then** I should still be able to favorite it
**And** both buttons should show as active

---

## Functional Requirements

### FR-1: Favorite Photo Endpoint

**Endpoint:** `POST /api/gallery/photo/{photoId}/favorite`
**Authentication:** Required (JWT)
**Request Body:** None (user ID from token)
**Response:** 201 Created

### Business Rules

1. User must be authenticated
2. Photo must exist
3. **User CAN favorite their own photo** (different from Likes!)
4. User cannot favorite the same photo twice (unique constraint)
5. Creates record in `photo_favorites` table with `(photo_id, user_id, created_at)`
6. No visibility to other users (private)

### Validations

- Photo ID must be valid (photo exists)
- Photo must be accessible (public OR user is owner)
- No existing favorite for this photo+user combination

### Error Cases

- 401 Unauthorized: No JWT token
- 404 Not Found: Photo doesn't exist
- 403 Forbidden: Photo is private AND user is not owner
- 409 Conflict: Already favorited

---

### FR-2: Unfavorite Photo Endpoint

**Endpoint:** `DELETE /api/gallery/photo/{photoId}/favorite`
**Authentication:** Required (JWT)
**Request Body:** None (user ID from token)
**Response:** 204 No Content

### Business Rules

1. User must be authenticated
2. Favorite must exist (user has previously favorited this photo)
3. Deletes record from `photo_favorites` table matching `(photo_id, user_id)`

### Validations

- Photo ID must be valid
- Favorite record must exist for this photo+user

### Error Cases

- 401 Unauthorized: No JWT token
- 404 Not Found: Photo doesn't exist OR not favorited
- 400 Bad Request: Photo not previously favorited

---

### FR-3: Get Favorited Photos Endpoint

**Endpoint:** `GET /api/gallery/favorited-photos?page=0&size=12`
**Authentication:** Required (JWT)

### Query Parameters

- `page` (optional, default: 0)
- `size` (optional, default: 12)

**Response:** 200 OK with paginated photo list

### Business Rules

1. Returns all photos favorited by current user
2. Ordered by most recently favorited first (created_at DESC)
3. Pagination support
4. Includes full photo details (same as gallery response)
5. **Only returns current user's favorites** (private)

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
      "uploadDate": "2024-12-18T10:00:00",
      "userId": 45,
      "userFullName": "John Doe",
      "likeCount": 15,
      "isLikedByCurrentUser": true,
      "isFavoritedByCurrentUser": true
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

### FR-4: Favorite Button Component

**Component:** `FavoriteButton.tsx`

### Props

- `photoId: number` - Photo to favorite/unfavorite
- `isFavorited: boolean` - Current favorite state
- `onFavoriteChange?: (favorited: boolean) => void` - Callback

### Behavior

1. Displays star icon (outline if not favorited, filled if favorited)
2. On click:
   - Optimistically updates UI (instant feedback)
   - Calls API endpoint (POST or DELETE)
   - If API fails, rolls back UI
   - Shows error toast on failure

### States

- Default: Outline star
- Favorited: Filled star (gold/yellow color)
- Loading: Disabled state (during API call)
- Error: Reverts to previous state + error message

### Visual Design

- Outline star: ⭐ (border only)
- Filled star: ⭐ (solid gold/yellow)
- Position: Next to like button

---

### FR-5: Favorited Photos Page

**Route:** `/home/favorited-photos`
**Component:** `FavoritedPhotosPage.tsx`
**Authentication:** Required

### Layout

- Page title: "Favorited Photos"
- Same grid layout as gallery (1-4 columns)
- Pagination controls at bottom
- Empty state: "You haven't favorited any photos yet. Start exploring!"

### Features

- Displays all favorited photos
- Each photo card shows:
  - Photo image
  - Title & description
  - Both like AND favorite buttons
  - Like count (if applicable)
  - Upload date
  - Uploader name
- Click photo to view details
- Pagination (12 per page)

---

## Non-Functional Requirements

### NFR-1: Performance

- ✅ Favorite/unfavorite API response time: < 200ms (p95)
- ✅ Favorited Photos page load time: < 1 second (p95)
- ✅ Optimistic update: UI changes in < 50ms
- ✅ Database query optimization: Proper indexes on photo_id and user_id

---

### NFR-2: Scalability

- ✅ System handles 1000 favorites per minute
- ✅ Database constraint prevents duplicate favorites
- ✅ Pagination prevents loading all favorites at once
- ✅ Indexes on foreign keys for fast lookups

---

### NFR-3: Reliability

- ✅ 100% test coverage for favorite/unfavorite logic
- ✅ Error handling for all edge cases
- ✅ Graceful degradation if API fails
- ✅ Rollback mechanism for optimistic updates

---

### NFR-4: Usability

- ✅ Favorite button visible on all photo cards
- ✅ Instant visual feedback (< 50ms)
- ✅ Clear error messages for users
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Clear distinction between Like (heart) and Favorite (star)

---

### NFR-5: Security & Privacy

- ✅ JWT authentication required for all favorite endpoints
- ✅ Users can only see their own favorites
- ✅ **Favorites are 100% private** - no leakage to other users
- ✅ SQL injection prevention (JPA parameterized queries)
- ✅ CORS configuration allows only frontend origin
- ✅ API enforces privacy at controller level

---

## Success Criteria

### Feature Completeness

✅ **Must Have (Phase 2 - This Week):**

1. Users can favorite any photo they have access to
2. Users can unfavorite photos they've saved
3. Users can favorite their own photos
4. Favorited Photos page shows user's favorited photos with pagination
5. Favorites are completely private
6. Optimistic UI updates work correctly
7. Works alongside Likes feature (both buttons on same photo)
8. All 32 tests pass (4 types: Unit, Integration, API, E2E)
9. Gherkin specs written for Photo Favorites

✅ **Should Have (Nice to Have):**

1. Favorite button animation (star pops when favorited)
2. Loading state during API call
3. Error toast notifications
4. Empty state with helpful message
5. Clear visual distinction from Like button

❌ **Won't Have (Out of Scope):**

1. Favorite collections/folders (future)
2. Public favorite counter (future)
3. Share favorites (future)
4. Export favorites (future)

---

### Quality Metrics

### Testing

- ✅ 32 tests total with 100% pass rate
- ✅ Unit tests: 8 tests (PhotoFavoriteService)
- ✅ Integration tests: 6 tests (Controller + Service)
- ✅ API tests: 8 tests (Full backend with real DB)
- ✅ E2E tests: 10 tests (Full FE + BE flow)

### Code Quality

- ✅ No duplicate code
- ✅ Follows project coding conventions
- ✅ Proper error handling
- ✅ Clear variable/function names
- ✅ Privacy enforced at all layers

### Documentation

- ✅ Gherkin specs complete (12 scenarios)
- ✅ API documentation updated
- ✅ README updated with feature
- ✅ Code comments for complex logic

---

### User Acceptance Criteria

### Feature is accepted when

1. ✅ I can favorite a photo and see immediate visual feedback
2. ✅ I can unfavorite a photo
3. ✅ I can favorite my own photos (unlike Likes)
4. ✅ I can navigate to Favorited Photos and see all my favorites
5. ✅ My favorites are private (no one else can see)
6. ✅ System prevents duplicate favorites
7. ✅ Error messages are clear and helpful
8. ✅ All tests pass
9. ✅ Performance is acceptable (< 1 sec page load)
10. ✅ Works alongside Likes feature

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
- ✅ Photo Likes - Already implemented (works alongside)

### Blocked Features (Cannot start until this is done)

- ⏳ Favorite Collections - Depends on Favorites foundation
- ⏳ Export Favorites - Depends on Favorites data structure

---

## Assumptions

### Business Assumptions

1. **Favorites = Private Bookmarks**
   - Assumption: Favorites are 100% private (not visible to others)
   - Risk: Users expect social sharing? (Low - clear documentation)

2. **One Favorite Per User Per Photo**
   - Assumption: Users cannot "super favorite" or give multiple favorites
   - Risk: Users expect weighted favorites? (Low - standard pattern)

3. **Can Favorite Own Photos**
   - Assumption: Users want to organize their own portfolio
   - Risk: Confusion with Likes? (Low - clear UI distinction)

4. **No Favorite Counter**
   - Assumption: Favorites are private, no need for counter
   - Risk: Users expect to see popularity? (Low - use Likes for that)

---

### Technical Assumptions

1. **Database Performance**
   - Assumption: Indexes on photo_id and user_id provide good performance
   - Validation: Test with 10,000+ favorites

2. **Optimistic Updates**
   - Assumption: Network latency is acceptable for optimistic pattern
   - Validation: Test on slow 3G connection

3. **Privacy Enforcement**
   - Assumption: API-level privacy is sufficient (no frontend leaks)
   - Validation: Security testing & code review

---

## Risks & Mitigation

### Risk 1: Duplicate Favorites (Database Race Condition)

**Risk:** Two simultaneous favorite requests create duplicate records
**Probability:** Medium
**Impact:** High (data integrity)

### Mitigation

- ✅ Database unique constraint on (photo_id, user_id)
- ✅ API returns 409 Conflict if duplicate
- ✅ Frontend disables button during API call
- ✅ Test concurrent requests in integration tests

---

### Risk 2: Privacy Leakage

**Risk:** Favorites accidentally exposed to other users
**Probability:** Low
**Impact:** High (privacy breach)

### Mitigation

- ✅ Privacy enforced at API controller level
- ✅ No public endpoints for favorite counts
- ✅ Security testing for all endpoints
- ✅ Code review focused on privacy

---

### Risk 3: Confusion with Likes

**Risk:** Users confused about difference between Likes and Favorites
**Probability:** Medium
**Impact:** Medium (UX confusion)

### Mitigation

- ✅ Clear visual distinction (heart vs star)
- ✅ Tooltips explaining difference
- ✅ Documentation in UI
- ✅ User education in onboarding

---

### Risk 4: Performance with Many Favorites

**Risk:** Favorited Photos page slow with 1000+ favorited photos
**Probability:** Low (most users < 100 favorites)
**Impact:** Medium (slow page load)

### Mitigation

- ✅ Pagination (12 per page) prevents loading all at once
- ✅ Database indexes on photo_favorites.user_id
- ✅ Lazy loading images
- ✅ Performance test with 1000+ favorites

---

## Next Steps

### Immediate Actions (Today - Thursday)

1. ✅ Review and approve this requirements document
2. ⏳ Read [Technical Design](technical-design.md)
3. ⏳ Create database migration (V4\_\_create_photo_favorites.sql)
4. ⏳ Create PhotoFavorite entity
5. ⏳ Write Gherkin specs

### Tomorrow (Friday)

- Implement PhotoFavoriteService
- Create REST endpoints
- Write Playwright API tests (automated!)

### See [Daily Checklist](checklist.md) for detailed task breakdown

---

**Document Status:** ✅ Approved for Implementation
**Next Document:** [Technical Design](technical-design.md)

---

### Ready to build! Let's make this happen! 🚀
