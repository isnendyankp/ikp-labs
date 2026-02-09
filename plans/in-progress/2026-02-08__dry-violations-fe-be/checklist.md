# Checklist - Fix Frontend & Backend DRY Violations

**Project**: Fix Frontend & Backend DRY Violations
**Status**: 🚧 In Progress - Priority 1-3 Completed
**Created**: February 8, 2026

---

## Table of Contents

1. [Priority 1: FE Auth Token Consolidation](#priority-1-fe-auth-token-consolidation)
2. [Priority 2: BE Pagination Utility](#priority-2-be-pagination-utility)
3. [Priority 3: BE SortBy Enum](#priority-3-be-sortby-enum)
4. [Priority 4: ActionButton Component (Optional)](#priority-4-actionbutton-component-optional)
5. [Final Verification](#final-verification)

---

## Priority 1: FE Auth Token Consolidation

**Estimated Time**: 30 minutes
**Impact**: HIGH (~100 lines duplicate code eliminated)

### 1.1 Create apiClient.ts
- [x] Create file `frontend/src/lib/apiClient.ts` - Already existed
- [x] Implement `getToken()` function - Already existed
  - [x] Read from localStorage key `'authToken'`
  - [x] Return null if not found
  - [x] Return token string if exists
- [x] Implement `createAuthHeaders()` function - Already existed
  - [x] Call `getToken()`
  - [x] Return `Authorization: Bearer ${token}` header
  - [x] Return empty object if no token
- [x] Implement `fetchWithAuth()` wrapper - Already existed
  - [x] Accept URL and fetch options
  - [x] Automatically add auth headers
  - [x] Return fetch Response
- [x] Add `createFormDataHeaders()` function - **NEW ADDED**
- [x] Add JSDoc comments

### 1.2 Update api.ts
- [x] Import `createAuthHeaders` from `@/lib/apiClient`
- [x] Update inline auth headers to use `createAuthHeaders()`
- [x] Test compilation

### 1.3 Update profileService.ts
- [x] Import `createFormDataHeaders` from `@/lib/apiClient`
- [x] Remove local `createFormDataHeaders()` function
- [x] Test compilation

### 1.4 Update galleryService.ts
- [x] Import `createFormDataHeaders` from `@/lib/apiClient`
- [x] Remove local `createFormDataHeaders()` function
- [x] Remove inline `localStorage.getItem()` access
- [x] Test compilation

### 1.5 Update photoLikeService.ts
- [x] Already using `createAuthHeaders` from apiClient - No changes needed
- [x] Test compilation

### 1.6 Update photoFavoriteService.ts
- [x] Already using `createAuthHeaders` from apiClient - No changes needed
- [x] Test compilation

### 1.7 Testing
- [x] TypeScript compilation successful
- [ ] Run frontend E2E tests - Deferred to final verification
- [ ] Manual test: Login functionality works - Deferred to final verification
- [ ] Manual test: Gallery loads correctly - Deferred to final verification
- [ ] Manual test: Profile page loads correctly - Deferred to final verification
- [ ] Manual test: Like/favorite buttons work - Deferred to final verification

### 1.8 Commit
- [x] Stage all changes
- [x] Commit with message: `feat(frontend): consolidate FormData headers in apiClient`
- [x] Push to remote: **Commit 97fc992**

**Total Estimated Time**: 30 minutes

---

## Priority 2: BE Pagination Utility

**Estimated Time**: 20 minutes
**Impact**: MEDIUM (~30 lines duplicate code eliminated)
**Status**: ✅ **ALREADY COMPLETED** (Created 2026-02-07, before plan)

### 2.1 Create PaginationUtil.java
- [x] File created at `backend/ikp-labs-api/src/main/java/com/ikplabs/api/util/PaginationUtil.java`
- [x] Package declaration: `com.ikplabs.api.util`
- [x] `buildPaginatedResponse()` static method implemented
  - [x] Accept `photos`, `page`, `totalPhotos`, `size` parameters
  - [x] Calculate `totalPages` (ceiling division)
  - [x] Calculate `hasNext`
  - [x] Calculate `hasPrevious`
  - [x] Return `GalleryListResponse` using static factory method
- [x] Javadoc comments included
- [x] Private constructor to prevent instantiation

### 2.2 Update GalleryController.java
- [x] Import `PaginationUtil`
- [x] 3 occurrences using `PaginationUtil.buildPaginatedResponse()`:
  - [x] getMyPhotos() (line 219-221)
  - [x] getPublicPhotos() (line 291-293)
  - [x] getUserPublicPhotos() (line 353-355)
- [x] Using `SortBy.isValid()` instead of `isValidSortBy()`

### 2.3 Update PhotoLikeController.java
- [x] Import `PaginationUtil`
- [x] getLikedPhotos() using `PaginationUtil.buildPaginatedResponse()` (line 285-287)
- [x] Using `SortBy.isValid()` instead of `isValidSortBy()`

### 2.4 Update PhotoFavoriteController.java
- [x] Import `PaginationUtil`
- [x] getFavoritedPhotos() using `PaginationUtil.buildPaginatedResponse()` (line 327-329)
- [x] Using `SortBy.isValid()` instead of `isValidSortBy()`

### 2.5 Testing
- [x] Compilation successful
- [ ] Run backend tests: `mvn test` - Deferred to final verification
- [ ] Manual test: Gallery pagination works - Deferred to final verification
- [ ] Manual test: Liked photos pagination works - Deferred to final verification
- [ ] Manual test: Favorited photos pagination works - Deferred to final verification

### 2.6 Commit
- [x] Already committed before this plan (2026-02-07)

**Total Estimated Time**: 20 minutes
**Actual Status**: ✅ COMPLETED (Pre-existing implementation)

---

## Priority 3: BE SortBy Enum

**Estimated Time**: 15 minutes
**Impact**: MEDIUM (~24 lines duplicate code eliminated + type-safe)
**Status**: ✅ **ALREADY COMPLETED** (Created 2026-02-07, before plan)

### 3.1 Create SortBy.java (Enum)
- [x] File created at `backend/ikp-labs-api/src/main/java/com/ikplabs/api/enums/SortBy.java`
- [x] Package declaration: `com.ikplabs.api.enums`
- [x] Enum values created:
  - [x] `NEWEST("newest")`
  - [x] `OLDEST("oldest")`
  - [x] `MOST_LIKED("mostLiked")`
  - [x] `MOST_FAVORITED("mostFavorited")`
- [x] `private final String value;` field
- [x] Constructor
- [x] `getValue()` method
- [x] `fromValue(String value)` static method
- [x] `isValid(String value)` static method
- [x] `getAllowedValues()` static method
- [x] Javadoc comments included

### 3.2 Update GalleryController.java
- [x] Import `SortBy` enum
- [x] getMyPhotos() using `SortBy.isValid(sortBy)` (line 194)
- [x] getPublicPhotos() using `SortBy.isValid(sortBy)` (line 264)
- [x] Compilation successful

### 3.3 Update PhotoLikeController.java
- [x] Import `SortBy` enum
- [x] getLikedPhotos() using `SortBy.isValid(sortBy)` (line 258)
- [x] Compilation successful

### 3.4 Update PhotoFavoriteController.java
- [x] Import `SortBy` enum
- [x] getFavoritedPhotos() using `SortBy.isValid(sortBy)` (line 290)
- [x] Compilation successful

### 3.5 Testing
- [x] Compilation successful
- [ ] Run backend tests: `mvn test` - Deferred to final verification
- [ ] Manual test: Sort by newest works - Deferred to final verification
- [ ] Manual test: Sort by oldest works - Deferred to final verification
- [ ] Manual test: Sort by mostLiked works - Deferred to final verification
- [ ] Manual test: Sort by mostFavorited works - Deferred to final verification

### 3.6 Commit
- [x] Already committed before this plan (2026-02-07)

**Total Estimated Time**: 15 minutes
**Actual Status**: ✅ COMPLETED (Pre-existing implementation)

---

## Priority 4: ActionButton Component (Optional)

**Estimated Time**: 30 minutes
**Impact**: LOW (~60 lines duplicate code eliminated)
**Status**: OPTIONAL - Can be deferred

### 4.1 Create ActionButton.tsx
- [ ] Create file `frontend/src/components/ActionButton.tsx`
- [ ] Define `ActionButtonProps` interface
- [ ] Implement optimistic update logic
  - [ ] State for optimistic active status
  - [ ] State for optimistic count
  - [ ] State for loading
  - [ ] Handle click with optimistic update
  - [ ] Rollback on error
  - [ ] Reset when props change
- [ ] Add accessibility attributes
- [ ] Add JSDoc comments

### 4.2 Update LikeButton.tsx
- [ ] Import `ActionButton`
- [ ] Remove local optimistic update logic
- [ ] Use `ActionButton` component
- [ ] Pass appropriate props (Heart icons, count, API function)
- [ ] Test compilation

### 4.3 Update FavoriteButton.tsx
- [ ] Import `ActionButton`
- [ ] Remove local optimistic update logic
- [ ] Use `ActionButton` component
- [ ] Pass appropriate props (Star icons, count, API function)
- [ ] Test compilation

### 4.4 Testing
- [ ] Run frontend E2E tests
- [ ] Manual test: Like button works
- [ ] Manual test: Favorite button works
- [ ] Manual test: Optimistic update works
- [ ] Manual test: Error rollback works

### 4.5 Commit
- [ ] Stage all changes
- [ ] Commit with message: `feat(frontend): create reusable ActionButton component`

**Total Estimated Time**: 30 minutes

---

## Final Verification

### Overall Progress
- [x] Priority 1: FE Auth Token Consolidation (30 min) ✅ **COMPLETED** - Commit 97fc992
- [x] Priority 2: BE Pagination Utility (20 min) ✅ **ALREADY COMPLETED** - Pre-existing (2026-02-07)
- [x] Priority 3: BE SortBy Enum (15 min) ✅ **ALREADY COMPLETED** - Pre-existing (2026-02-07)
- [ ] Priority 4: ActionButton Component - OPTIONAL (30 min)

### Code Quality Checks
- [ ] No TypeScript compilation errors
- [ ] No Java compilation errors
- [ ] All E2E tests pass
- [ ] All backend tests pass
- [ ] No new linting errors

### Functional Verification
- [ ] Login/logout works
- [ ] Gallery pagination works
- [ ] Gallery sorting works (all options)
- [ ] Like button works
- [ ] Favorite button works
- [ ] Profile page loads

### Documentation
- [ ] All new code has JSDoc/Javadoc
- [ ] Git commits follow atomic commit pattern
- [ ] Plan marked as complete

### Completion Summary
- [ ] Frontend: ~100 lines duplicate code eliminated
- [ ] Backend: ~54 lines duplicate code eliminated
- [ ] Type-safe sortBy values added
- [ ] Single source of truth for auth, pagination, validation
- [ ] Improved code maintainability

**Total Estimated Time**: 65 minutes (without Priority 4)
**Total Estimated Time**: 95 minutes (with Priority 4)

---

## Notes

### Atomic Commit Strategy
Each priority should be committed independently for easy rollback:

1. `feat(frontend): create centralized API client`
2. `feat(backend): add PaginationUtil for pagination metadata`
3. `feat(backend): add SortByEnum for type-safe sort validation`
4. `feat(frontend): create reusable ActionButton component` (optional)

### Rollback Commands
```bash
# Rollback specific commit
git revert <commit-hash>

# Reset to before work started
git reset --hard <before-commit-hash>
```

### Related Plans
- **Parent Plan**: [Bug Analysis & Testing Coverage](../../done/2026-02-02__bug-analysis-testing-coverage/) (Phase 14)
