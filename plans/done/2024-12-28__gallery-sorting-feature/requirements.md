# Gallery Sorting & Filtering - Detailed Requirements

**Plan**: Gallery Sorting Feature
**Version**: 1.0
**Last Updated**: December 28, 2024

---

## Table of Contents

1. [Functional Requirements](#functional-requirements)
2. [Technical Requirements](#technical-requirements)
3. [API Requirements](#api-requirements)
4. [UI/UX Requirements](#ui-ux-requirements)
5. [Testing Requirements](#testing-requirements)
6. [Performance Requirements](#performance-requirements)
7. [Security Requirements](#security-requirements)

---

## Functional Requirements

### FR-1: Sort Options

**Requirement**: Users must be able to sort photos by 4 different criteria

| Sort Option | Label | Backend Value | Sort Order | Description |
|-------------|-------|---------------|------------|-------------|
| **Newest First** | "Newest First" | `newest` | `createdAt DESC` | Default, most recent uploads first |
| **Oldest First** | "Oldest First" | `oldest` | `createdAt ASC` | Oldest photos first |
| **Most Liked** | "Most Liked" | `mostLiked` | `likeCount DESC, createdAt DESC` | Sorted by popularity (likes) |
| **Most Favorited** | "Most Favorited" | `mostFavorited` | `favoriteCount DESC, createdAt DESC` | Sorted by favorite count |

**Acceptance Criteria:**
- ✅ Dropdown displays all 4 options with clear labels
- ✅ "Newest First" is selected by default
- ✅ Changing sort triggers immediate data refetch
- ✅ URL updates to reflect selected sort
- ✅ Sort selection persists across page navigation (via URL)

---

### FR-2: Filter + Sort Combinations

**Requirement**: All filter options must work with all sort options

**Supported Combinations** (16 total):

| Filter | All Sorts | Result |
|--------|-----------|--------|
| **All Photos** | newest, oldest, mostLiked, mostFavorited | All public photos, sorted |
| **My Photos** | newest, oldest, mostLiked, mostFavorited | User's photos, sorted |
| **Liked Photos** | newest, oldest, mostLiked, mostFavorited | User's liked photos, sorted |
| **Favorited Photos** | newest, oldest, mostLiked, mostFavorited | User's favorited photos, sorted |

**Example User Flows:**

1. **Use Case**: See my most popular photos
   - Select "My Photos" filter
   - Select "Most Liked" sort
   - Result: User's photos sorted by like count (highest first)

2. **Use Case**: Discover trending content
   - Select "All Photos" filter
   - Select "Most Liked" sort
   - Result: All public photos sorted by popularity

3. **Use Case**: Nostalgia trip - see first photos I liked
   - Select "Liked Photos" filter
   - Select "Oldest First" sort
   - Result: User's liked photos from earliest to latest

**Acceptance Criteria:**
- ✅ All 16 combinations work correctly
- ✅ No conflicts between filter and sort
- ✅ Pagination works with any combination
- ✅ Empty states handle any combination gracefully

---

### FR-3: URL State Management

**Requirement**: Gallery state must be encoded in URL for shareability

**URL Structure:**
```
/gallery?filter={filterValue}&sortBy={sortValue}&page={pageNumber}
```

**Query Parameters:**

| Parameter | Type | Values | Default | Required |
|-----------|------|--------|---------|----------|
| `filter` | string | `all`, `my-photos`, `liked`, `favorited` | `all` | No |
| `sortBy` | string | `newest`, `oldest`, `mostLiked`, `mostFavorited` | `newest` | No |
| `page` | number | 1+ | `1` | No |

**Examples:**
```
/gallery
→ All photos, newest first, page 1

/gallery?filter=liked&sortBy=oldest&page=2
→ Liked photos, oldest first, page 2

/gallery?filter=my-photos&sortBy=mostLiked
→ My photos, most liked first, page 1
```

**Acceptance Criteria:**
- ✅ URL updates immediately when filter/sort changes
- ✅ URL can be shared and works for other users (where applicable)
- ✅ Browser back/forward buttons work correctly
- ✅ Invalid query params fall back to defaults gracefully
- ✅ Page resets to 1 when filter/sort changes

---

### FR-4: Pagination with Sorting

**Requirement**: Pagination must maintain sort order

**Behavior:**
- 12 photos per page (existing)
- Page number resets to 1 when filter or sort changes
- Pagination controls show correct total pages based on filtered/sorted results

**Acceptance Criteria:**
- ✅ Photos on page 2 continue the sort order from page 1
- ✅ Total page count is accurate for current filter + sort
- ✅ "Next" and "Previous" buttons work correctly
- ✅ Page numbers update in URL
- ✅ Navigating between pages maintains filter and sort

---

### FR-5: Empty States

**Requirement**: Appropriate messages for different scenarios

| Scenario | Message |
|----------|---------|
| All Photos + No public photos | "No public photos available" |
| My Photos + User has no photos | "No photos yet. Upload your first photo!" |
| Liked Photos + User liked nothing | "You haven't liked any photos yet. Explore the gallery!" |
| Favorited Photos + No favorites | "You haven't favorited any photos yet." |
| Most Liked + No likes on any photos | "No photos have been liked yet. Be the first!" |
| Most Favorited + No favorites | "No photos have been favorited yet." |
| Filtered result empty | "No photos match your current filters." |

**Acceptance Criteria:**
- ✅ Each scenario shows contextually appropriate message
- ✅ Messages guide users to take action
- ✅ No loading indicators after data loads with 0 results

---

## Technical Requirements

### TR-1: Backend API Endpoints

**Requirement**: 4 gallery endpoints must support `sortBy` query parameter

#### Endpoint 1: GET /api/gallery/public

**Current:**
```java
GET /api/gallery/public?page=0&size=12
```

**Enhanced:**
```java
GET /api/gallery/public?page=0&size=12&sortBy=newest
GET /api/gallery/public?page=0&size=12&sortBy=mostLiked
```

**Behavior:**
- Returns all public photos
- Sorted by specified `sortBy` parameter
- Default: `newest` (createdAt DESC)
- Validates `sortBy` value (400 if invalid)

#### Endpoint 2: GET /api/gallery/my-photos

**Current:**
```java
GET /api/gallery/my-photos?page=0&size=12
```

**Enhanced:**
```java
GET /api/gallery/my-photos?page=0&size=12&sortBy=newest
GET /api/gallery/my-photos?page=0&size=12&sortBy=mostLiked
```

**Behavior:**
- Returns authenticated user's photos only
- Sorted by specified `sortBy` parameter
- Default: `newest`

#### Endpoint 3: GET /api/gallery/liked-photos

**Current:**
```java
GET /api/gallery/liked-photos?page=0&size=12
```

**Enhanced:**
```java
GET /api/gallery/liked-photos?page=0&size=12&sortBy=newest
GET /api/gallery/liked-photos?page=0&size=12&sortBy=oldest
```

**Behavior:**
- Returns photos liked by authenticated user
- Sorted by specified `sortBy` parameter
- Default: `newest` (by when photo was liked, using `photo_likes.created_at`)

#### Endpoint 4: GET /api/gallery/favorited-photos

**New Endpoint** (if doesn't exist) or **Enhanced**:
```java
GET /api/gallery/favorited-photos?page=0&size=12&sortBy=newest
```

**Behavior:**
- Returns photos favorited by authenticated user
- Sorted by specified `sortBy` parameter
- Default: `newest` (by when photo was favorited)

**Acceptance Criteria:**
- ✅ All 4 endpoints accept `sortBy` parameter
- ✅ Invalid `sortBy` returns 400 with clear error message
- ✅ Missing `sortBy` defaults to `newest`
- ✅ Backward compatible (existing clients without `sortBy` still work)
- ✅ Response structure unchanged (GalleryListResponse)

---

### TR-2: Database Query Optimization

**Requirement**: Solve N+1 query problem for like/favorite counts

**Current Problem:**
```
1 main query (get photos)
+ 12 COUNT queries (get like count per photo)
+ 12 EXISTS queries (check if user liked each photo)
= 25 queries per page
```

**Optimized Solution:**
```
1 main query with JOINs (get photos + counts + user interaction in single query)
= 1 query per page
```

**Approach:**
Use `LEFT JOIN` with `GROUP BY` to fetch counts in main query:

```sql
SELECT
    p.*,
    COALESCE(COUNT(DISTINCT pl.id), 0) as like_count,
    COALESCE(COUNT(DISTINCT pf.id), 0) as favorite_count,
    CASE WHEN user_pl.id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked_by_user,
    CASE WHEN user_pf.id IS NOT NULL THEN TRUE ELSE FALSE END as is_favorited_by_user
FROM gallery_photos p
LEFT JOIN photo_likes pl ON p.id = pl.photo_id
LEFT JOIN photo_favorites pf ON p.id = pf.photo_id
LEFT JOIN photo_likes user_pl ON p.id = user_pl.photo_id AND user_pl.user_id = :currentUserId
LEFT JOIN photo_favorites user_pf ON p.id = user_pf.photo_id AND user_pf.user_id = :currentUserId
WHERE p.is_public = TRUE
GROUP BY p.id, user_pl.id, user_pf.id
ORDER BY like_count DESC, p.created_at DESC
LIMIT 12 OFFSET 0;
```

**Acceptance Criteria:**
- ✅ Single database query per page load
- ✅ No N+1 query pattern
- ✅ Query performance < 100ms for 1000 photos
- ✅ Correct counts even with no likes/favorites
- ✅ Works with all sort options

---

### TR-3: Sort Algorithm Implementation

**Requirement**: Implement sorting logic for each option

#### Sort by Newest (Default)
```java
Sort.by("createdAt").descending()
```

#### Sort by Oldest
```java
Sort.by("createdAt").ascending()
```

#### Sort by Most Liked
```sql
ORDER BY like_count DESC, created_at DESC
```
**Note**: Use `created_at` as tiebreaker when like counts are equal

#### Sort by Most Favorited
```sql
ORDER BY favorite_count DESC, created_at DESC
```
**Note**: Use `created_at` as tiebreaker when favorite counts are equal

**Acceptance Criteria:**
- ✅ Newest/Oldest use simple timestamp sort
- ✅ Most Liked/Favorited use COUNT with tiebreaker
- ✅ Null counts treated as 0
- ✅ Consistent sort order (deterministic)

---

### TR-4: Frontend State Management

**Requirement**: React component state synchronized with URL

**State Flow:**
```
URL Query Params
    ↓
Next.js useSearchParams()
    ↓
Local State (currentFilter, currentSortBy, currentPage)
    ↓
Service Call (with params)
    ↓
Backend API
    ↓
Response (photos + pagination)
    ↓
Update UI
```

**State Synchronization:**
1. On component mount → Read URL params → Set initial state
2. On filter change → Update URL → Trigger refetch
3. On sort change → Update URL → Reset page to 1 → Trigger refetch
4. On page change → Update URL → Trigger refetch
5. On browser back/forward → Read new URL → Update state → Refetch

**Acceptance Criteria:**
- ✅ URL is single source of truth
- ✅ No state drift between URL and UI
- ✅ Browser back/forward works correctly
- ✅ Direct URL navigation works
- ✅ Shareable links work for other users

---

## API Requirements

### AR-1: Request Validation

**Requirement**: Validate all query parameters

**Validation Rules:**

| Parameter | Validation | Error Response |
|-----------|------------|----------------|
| `sortBy` | Must be one of: `newest`, `oldest`, `mostLiked`, `mostFavorited` | 400 Bad Request: "Invalid sortBy value" |
| `page` | Must be >= 0 | 400 Bad Request: "Page must be non-negative" |
| `size` | Must be 1-100 | 400 Bad Request: "Size must be between 1 and 100" |
| `filter` | Frontend only (not sent to backend) | N/A |

**Acceptance Criteria:**
- ✅ Invalid parameters return 400 status
- ✅ Error messages are clear and actionable
- ✅ Valid parameters pass through
- ✅ Missing optional parameters use defaults

---

### AR-2: Response Structure

**Requirement**: Maintain existing GalleryListResponse structure

**Response Format:**
```json
{
  "photos": [
    {
      "id": 123,
      "userId": 456,
      "ownerName": "John Doe",
      "title": "Sunset Photo",
      "description": "Beautiful sunset",
      "filePath": "gallery/user-456/photo-123.jpg",
      "isPublic": true,
      "createdAt": "2025-01-01T10:00:00",
      "updatedAt": "2025-01-01T10:00:00",
      "likeCount": 42,
      "favoriteCount": 15,
      "isLikedByUser": true,
      "isFavoritedByUser": false
    }
  ],
  "currentPage": 0,
  "totalPages": 5,
  "totalPhotos": 57,
  "pageSize": 12,
  "hasNext": true,
  "hasPrevious": false
}
```

**New Fields** (if not already present):
- `favoriteCount`: Number of times photo has been favorited
- `isFavoritedByUser`: Boolean indicating if current user favorited this photo

**Acceptance Criteria:**
- ✅ Response structure matches existing format
- ✅ All existing clients still work
- ✅ New fields added without breaking changes
- ✅ Counts are accurate

---

### AR-3: Backward Compatibility

**Requirement**: Existing API calls without `sortBy` still work

**Scenarios:**
```
GET /api/gallery/public?page=0&size=12
→ Should default to sortBy=newest (createdAt DESC)

GET /api/gallery/my-photos
→ Should default to page=0, size=12, sortBy=newest
```

**Acceptance Criteria:**
- ✅ Omitting `sortBy` defaults to `newest`
- ✅ All existing mobile/web clients continue working
- ✅ No breaking changes to API contract

---

## UI/UX Requirements

### UX-1: SortingDropdown Component

**Requirement**: New dropdown component for sort options

**Visual Design:**
```
┌─────────────────────┐
│ Sort: Newest First ▼│  ← Closed state
└─────────────────────┘

┌─────────────────────┐
│ Sort: Newest First ▼│  ← Open state
├─────────────────────┤
│ ✓ Newest First      │  ← Selected (checkmark)
│   Oldest First      │
│   Most Liked        │
│   Most Favorited    │
└─────────────────────┘
```

**Behavior:**
- Click to open/close dropdown
- Click option to select and close
- ESC key to close without selecting
- Arrow keys to navigate options
- Enter to select highlighted option
- Checkmark indicates current selection

**Styling:**
- Consistent with FilterDropdown design
- Tailwind CSS classes
- Accessible color contrast
- Responsive (mobile/desktop)

**Acceptance Criteria:**
- ✅ Matches existing FilterDropdown visual style
- ✅ Keyboard navigation works
- ✅ Click outside closes dropdown
- ✅ Mobile-friendly touch targets
- ✅ Accessible (ARIA labels, roles)

---

### UX-2: Gallery Layout

**Requirement**: Both dropdowns visible and functional

**Desktop Layout:**
```
┌────────────────────────────────────────────┐
│ Gallery                                    │
├────────────────────────────────────────────┤
│ [Filter: All Photos ▼]  [Sort: Newest ▼]  │  ← Side by side
├────────────────────────────────────────────┤
│ 📸 📸 📸 📸                                 │
│ 📸 📸 📸 📸   (Photo Grid)                 │
│ 📸 📸 📸 📸                                 │
├────────────────────────────────────────────┤
│      ← 1 2 3 4 5 →  (Pagination)           │
└────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────────┐
│ Gallery          │
├──────────────────┤
│ Filter: All ▼    │  ← Stacked
├──────────────────┤
│ Sort: Newest ▼   │  ← Stacked
├──────────────────┤
│ 📸 📸            │
│ 📸 📸  (Grid)    │
│ 📸 📸            │
├──────────────────┤
│  ← 1 2 3 →       │
└──────────────────┘
```

**Acceptance Criteria:**
- ✅ Dropdowns don't overlap
- ✅ Adequate spacing between dropdowns
- ✅ Mobile: Dropdowns stack vertically
- ✅ Desktop: Dropdowns side-by-side
- ✅ Consistent with existing Gallery page style

---

### UX-3: Loading States

**Requirement**: Clear visual feedback during data fetching

**States:**
1. **Initial Load**: Skeleton placeholders for 12 photos
2. **Filter/Sort Change**: Loading overlay + spinner
3. **Page Change**: Loading overlay + spinner
4. **Error**: Error message + retry button

**Acceptance Criteria:**
- ✅ No jarring content jumps
- ✅ Loading indicator appears within 100ms
- ✅ Skeleton maintains layout
- ✅ Error states are clear and actionable

---

### UX-4: Error Handling

**Requirement**: Graceful error handling with user guidance

**Error Scenarios:**

| Error | Message | Action |
|-------|---------|--------|
| Network failure | "Unable to load photos. Please check your connection." | Retry button |
| 401 Unauthorized | "Session expired. Please log in again." | Redirect to login |
| 400 Bad Request | "Invalid request. Please try again." | Reset to defaults |
| 500 Server Error | "Something went wrong. Please try again later." | Retry button |
| Empty result | "No photos match your current filters." | Clear filters button |

**Acceptance Criteria:**
- ✅ All errors show user-friendly messages
- ✅ Technical details hidden from users
- ✅ Errors logged to console for debugging
- ✅ Retry mechanisms available

---

## Testing Requirements

### Test-1: Gherkin BDD Tests

**Requirement**: Comprehensive BDD scenarios in `/specs/gallery/photo-sorting.feature`

**Minimum Scenarios** (12-15 total):

```gherkin
Feature: Gallery Photo Sorting

  Scenario: User sorts photos by newest first
  Scenario: User sorts photos by oldest first
  Scenario: User sorts photos by most liked
  Scenario: User sorts photos by most favorited
  Scenario: User combines liked filter with newest sort
  Scenario: User combines favorited filter with most liked sort
  Scenario: Sort selection persists in URL
  Scenario: Sort selection persists after page refresh
  Scenario: Invalid sort parameter defaults to newest
  Scenario: Pagination maintains sort order
  Scenario: Empty state shows for filtered results
  Scenario: Sort dropdown is keyboard accessible
```

**Step Definitions**: `/tests/gherkin/steps/gallery-sorting.steps.ts`

**Acceptance Criteria:**
- ✅ All scenarios pass (100%)
- ✅ Scenarios cover happy path + edge cases
- ✅ Step definitions reusable
- ✅ Clear Given/When/Then structure

---

### Test-2: Playwright E2E Tests

**Requirement**: Browser automation tests in `/tests/e2e/gallery-sorting.spec.ts`

**Test Cases** (15-20 total):

```typescript
// Sort functionality
test('E2E-GS-001: should sort My Photos by newest first')
test('E2E-GS-002: should sort My Photos by oldest first')
test('E2E-GS-003: should sort My Photos by most liked')
test('E2E-GS-004: should sort My Photos by most favorited')

// Filter + Sort combinations
test('E2E-GS-005: should combine liked filter with newest sort')
test('E2E-GS-006: should combine liked filter with most liked sort')
test('E2E-GS-007: should combine favorited filter with oldest sort')

// URL state
test('E2E-GS-008: should update URL when sort changes')
test('E2E-GS-009: should persist sort after page refresh')
test('E2E-GS-010: should support browser back/forward')
test('E2E-GS-011: should handle direct URL navigation')

// Pagination
test('E2E-GS-012: should maintain sort across pagination')
test('E2E-GS-013: should reset page to 1 when sort changes')

// UI interactions
test('E2E-GS-014: should open/close sort dropdown')
test('E2E-GS-015: should highlight selected sort option')
test('E2E-GS-016: should support keyboard navigation')

// Edge cases
test('E2E-GS-017: should handle empty filtered results')
test('E2E-GS-018: should handle invalid sort parameter')
test('E2E-GS-019: should show loading state during fetch')
test('E2E-GS-020: should handle network errors gracefully')
```

**Acceptance Criteria:**
- ✅ All tests pass (100%)
- ✅ Tests run in < 2 minutes
- ✅ No flaky tests
- ✅ Screenshots on failure

---

### Test-3: Playwright API Tests

**Requirement**: API endpoint tests in `/tests/api/gallery.api.spec.ts`

**Test Cases** (12-15 total):

```typescript
// Endpoint functionality
test('API-GS-001: GET /public?sortBy=newest returns sorted photos')
test('API-GS-002: GET /public?sortBy=oldest returns sorted photos')
test('API-GS-003: GET /public?sortBy=mostLiked returns sorted photos')
test('API-GS-004: GET /public?sortBy=mostFavorited returns sorted photos')

test('API-GS-005: GET /my-photos?sortBy=mostLiked returns user photos sorted')
test('API-GS-006: GET /liked-photos?sortBy=oldest returns liked photos sorted')
test('API-GS-007: GET /favorited-photos?sortBy=newest returns favorited photos sorted')

// Validation
test('API-GS-008: Invalid sortBy returns 400 error')
test('API-GS-009: Missing sortBy defaults to newest')

// Response structure
test('API-GS-010: Response includes likeCount field')
test('API-GS-011: Response includes favoriteCount field')
test('API-GS-012: Response includes correct pagination metadata')

// Performance
test('API-GS-013: sortBy=mostLiked executes in < 100ms')
test('API-GS-014: No N+1 query pattern detected')

// Edge cases
test('API-GS-015: Empty result set returns empty array with correct metadata')
```

**Acceptance Criteria:**
- ✅ All tests pass
- ✅ Response times < 100ms
- ✅ Validates response structure
- ✅ Tests error scenarios

---

### Test-4: Frontend Unit Tests

**Requirement**: Component and integration tests

**Files:**
- `/frontend/src/components/__tests__/SortingDropdown.test.tsx`
- `/frontend/src/app/gallery/__tests__/page.test.tsx`

**Test Cases** (8-10 total):

```typescript
// SortingDropdown.test.tsx
describe('SortingDropdown', () => {
  test('renders all sort options')
  test('displays current selected option')
  test('calls onChange when option selected')
  test('supports keyboard navigation')
  test('closes on outside click')
  test('highlights current selection')
})

// Gallery page.test.tsx
describe('Gallery Page', () => {
  test('initializes sortBy from URL')
  test('updates URL when sort changes')
  test('resets page to 1 when sort changes')
  test('fetches data with correct params')
})
```

**Acceptance Criteria:**
- ✅ All tests pass
- ✅ Coverage > 80%
- ✅ Tests use React Testing Library

---

### Test-5: Backend Unit Tests

**Requirement**: Service and controller layer tests

**Files:**
- `GalleryServiceTest.java`
- `GalleryControllerTest.java`
- `GalleryPhotoRepositoryTest.java`

**Test Cases** (10-12 total):

```java
// GalleryServiceTest.java
@Test void getPublicPhotos_SortByNewest_ReturnsPhotosOrderedByCreatedAtDesc()
@Test void getPublicPhotos_SortByOldest_ReturnsPhotosOrderedByCreatedAtAsc()
@Test void getPublicPhotos_SortByMostLiked_ReturnsPhotosOrderedByLikeCountDesc()
@Test void getPublicPhotos_SortByMostFavorited_ReturnsPhotosOrderedByFavoriteCountDesc()

@Test void getMyPhotos_WithSorting_ReturnsCorrectlySortedPhotos()
@Test void getLikedPhotos_WithSorting_ReturnsCorrectlySortedPhotos()

// GalleryControllerTest.java
@Test void getPublicPhotos_WithValidSortBy_Returns200()
@Test void getPublicPhotos_WithInvalidSortBy_Returns400()
@Test void getPublicPhotos_WithoutSortBy_DefaultsToNewest()

// GalleryPhotoRepositoryTest.java
@Test void findPublicPhotosSortedByLikeCount_ReturnsCorrectOrder()
@Test void findPublicPhotosSortedByLikeCount_HandlesZeroLikes()
@Test void findPublicPhotosSortedByLikeCount_UsesTiebreakerForEqualCounts()
```

**Acceptance Criteria:**
- ✅ All tests pass
- ✅ Mocks used appropriately
- ✅ Tests isolated and independent

---

### Test-6: Backend Integration Tests

**Requirement**: Full-stack tests with real database

**File:** `GalleryControllerIntegrationTest.java`

**Test Cases** (5-8 total):

```java
@Test void getPublicPhotos_WithSortByMostLiked_ReturnsCorrectlySortedPhotosFromDatabase()
@Test void getPublicPhotos_WithFilterAndSort_ReturnsCorrectResults()
@Test void getPublicPhotos_WithPaginationAndSort_MaintainsSortOrder()

@Test void getMyPhotos_WithSorting_OnlyReturnsCurrentUserPhotos()
@Test void getLikedPhotos_WithSorting_OnlyReturnsLikedPhotos()

@Test void getPublicPhotos_WithInvalidSortBy_Returns400WithErrorMessage()
@Test void getPublicPhotos_SortByMostLiked_PerformanceUnder100ms()

@Test void getPublicPhotos_NoN1QueryProblem_SingleDatabaseQuery()
```

**Acceptance Criteria:**
- ✅ Tests use real PostgreSQL database
- ✅ Tests clean up data after execution
- ✅ Performance assertions pass
- ✅ Query count assertions pass (no N+1)

---

## Performance Requirements

### PERF-1: API Response Time

**Requirement**: All API calls respond quickly

| Endpoint | Max Response Time | P95 Response Time |
|----------|-------------------|-------------------|
| GET /public | 200ms | 100ms |
| GET /my-photos | 200ms | 100ms |
| GET /liked-photos | 250ms | 150ms |
| GET /favorited-photos | 250ms | 150ms |

**Acceptance Criteria:**
- ✅ 95% of requests under P95 time
- ✅ No requests over max time
- ✅ Tested with 100+ photos in database

---

### PERF-2: Database Query Efficiency

**Requirement**: Minimize database load

**Metrics:**
- Max 1 SELECT query per page load
- No N+1 query patterns
- Use of indexes on `created_at`, `photo_id`
- Query execution time < 50ms

**Acceptance Criteria:**
- ✅ Query count verified in tests
- ✅ EXPLAIN ANALYZE shows index usage
- ✅ No full table scans
- ✅ Proper JOIN strategy

---

### PERF-3: Frontend Render Performance

**Requirement**: Smooth UI interactions

**Metrics:**
- Dropdown open/close < 16ms (60fps)
- Photo grid render < 100ms
- No jank during scroll
- Lighthouse performance score > 90

**Acceptance Criteria:**
- ✅ No layout shifts (CLS = 0)
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s

---

## Security Requirements

### SEC-1: Authorization

**Requirement**: Enforce photo access rules

**Rules:**
- Any user can view public photos
- Only owner can view private photos
- Only authenticated users can access any endpoint
- User can only see their own liked/favorited lists

**Acceptance Criteria:**
- ✅ Unauthenticated requests return 401
- ✅ Users cannot access other users' private data
- ✅ JWT token validated on every request

---

### SEC-2: Input Validation

**Requirement**: Sanitize all user inputs

**Validation:**
- Whitelist valid `sortBy` values
- Range check for `page` and `size`
- SQL injection prevention (use parameterized queries)

**Acceptance Criteria:**
- ✅ Invalid inputs rejected with 400
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities

---

### SEC-3: Rate Limiting

**Requirement**: Prevent abuse

**Limits:**
- Max 100 requests per minute per user
- Max 1000 requests per hour per IP

**Acceptance Criteria:**
- ✅ Rate limiting configured
- ✅ 429 Too Many Requests returned when exceeded
- ✅ Rate limit headers included in response

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [ ] All 4 gallery endpoints support `sortBy` parameter
- [ ] All 4 sort options work correctly
- [ ] All 16 filter + sort combinations work
- [ ] SortingDropdown component fully functional
- [ ] URL state reflects filter + sort + page
- [ ] Browser back/forward works
- [ ] **100% test pass rate** (all layers)
- [ ] No N+1 query problem
- [ ] Mobile responsive
- [ ] Performance requirements met
- [ ] Security requirements met

### Should Pass (P1)
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Keyboard accessibility
- [ ] Empty states with guidance
- [ ] Backward compatible API

### Nice to Have (P2)
- [ ] Animations/transitions
- [ ] Remember last sort (localStorage)
- [ ] Sort direction toggle

---

**Requirements Version**: 1.0
**Last Updated**: December 28, 2024
**Total Requirements**: 40+ detailed requirements across 7 categories
