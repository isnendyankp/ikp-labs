# Requirements - Fix Frontend & Backend DRY Violations

**Project**: Fix Frontend & Backend DRY Violations
**Status**: 📋 Requirements Defined
**Created**: February 8, 2026

---

## Table of Contents

1. [Frontend Requirements](#frontend-requirements)
2. [Backend Requirements](#backend-requirements)
3. [Acceptance Criteria](#acceptance-criteria)
4. [Non-Functional Requirements](#non-functional-requirements)

---

## Frontend Requirements

### FE-1: Authentication Token Handling Consolidation

**Priority**: HIGH

#### Problem Statement
Authentication token handling logic (`getToken()` and `createAuthHeaders()`) is duplicated across 5 service files.

#### Duplicate Locations
| File | Lines | Duplication |
|------|-------|-------------|
| `frontend/src/services/api.ts` | 30-53 | Token + headers logic |
| `frontend/src/services/profileService.ts` | 27-32, 37-46 | Token + headers logic |
| `frontend/src/services/galleryService.ts` | 33-38, 43-71 | Token + headers logic |
| `frontend/src/services/photoLikeService.ts` | 33-38, 43-54 | Token + headers logic |
| `frontend/src/services/photoFavoriteService.ts` | 49-54, 59-70 | Token + headers logic |

#### Requirements
- [FE-1.1] Create centralized API client at `frontend/src/lib/apiClient.ts`
- [FE-1.2] Implement `getToken()` method that:
  - Reads from localStorage key `'authToken'`
  - Returns null if token doesn't exist
  - Returns token string if exists
- [FE-1.3] Implement `createAuthHeaders()` method that:
  - Calls `getToken()`
  - Returns object with `Authorization: Bearer ${token}` header
  - Returns empty object if no token
- [FE-1.4] Implement `fetchWithAuth()` wrapper that:
  - Accepts URL and fetch options
  - Automatically adds auth headers
  - Handles token refresh (if needed in future)
- [FE-1.5] Update `api.ts` to use new `apiClient`
- [FE-1.6] Update `profileService.ts` to use new `apiClient`
- [FE-1.7] Update `galleryService.ts` to use new `apiClient`
- [FE-1.8] Update `photoLikeService.ts` to use new `apiClient`
- [FE-1.9] Update `photoFavoriteService.ts` to use new `apiClient`

#### Acceptance Criteria
- All 5 service files use centralized `apiClient`
- No duplicate token handling code remains
- All existing tests pass
- No functional regression

---

### FE-2: Like vs Favorite Button Logic

**Priority**: MEDIUM

#### Problem Statement
Both `LikeButton.tsx` and `FavoriteButton.tsx` implement nearly identical optimistic update logic.

#### Duplicate Locations
| File | Lines | Similar Logic |
|------|-------|---------------|
| `frontend/src/components/LikeButton.tsx` | 99-165 | Optimistic update, rollback, loading |
| `frontend/src/components/FavoriteButton.tsx` | 107-170 | Optimistic update, rollback, loading |

#### Requirements
- [FE-2.1] Create reusable `ActionButton.tsx` component OR extract shared hook
- [FE-2.2] Extract common optimistic update pattern:
  - Optimistic state update (immediate UI feedback)
  - API call in background
  - Rollback on error
  - Loading state management
- [FE-2.3] Update `LikeButton.tsx` to use new component/hook
- [FE-2.4] Update `FavoriteButton.tsx` to use new component/hook

#### Acceptance Criteria
- Both buttons use shared logic
- No duplicate optimistic update code
- All existing tests pass
- No functional regression

---

### FE-3: API Response Handling Pattern

**Priority**: MEDIUM

#### Problem Statement
Same response parsing and error handling pattern across all service files.

#### Requirements
- [FE-3.1] Create base API service or fetch wrapper
- [FE-3.2] Standardize response parsing:
  - Check for `response.ok`
  - Parse JSON if content-type is JSON
  - Handle specific HTTP status codes (401, 403, 404, 500)
  - Throw appropriate error objects
- [FE-3.3] Update all services to use standardized response handling

#### Acceptance Criteria
- Consistent error handling across all services
- Single source of truth for response parsing
- All existing tests pass

---

## Backend Requirements

### BE-1: Pagination Logic Consolidation

**Priority**: HIGH

#### Problem Statement
Pagination metadata calculation is duplicated across 3 controllers.

#### Duplicate Locations
| File | Lines | Duplication |
|------|-------|-------------|
| `GalleryController.java` | 216-221, 290-295, 354-359 | Pagination calculation |
| `PhotoLikeController.java` | 282-296 | Pagination calculation |
| `PhotoFavoriteController.java` | 326-337 | Pagination calculation |

#### Duplicate Code Pattern
```java
// Repeated in all 3 controllers:
int totalPages = (int) Math.ceil((double) totalPhotos / size);
boolean hasNext = page < totalPages - 1;
boolean hasPrevious = page > 0;
```

#### Requirements
- [BE-1.1] Create `PaginationUtil.java` utility class
- [BE-1.2] Create `PaginationMetadata` record/class with fields:
  - `page` (int)
  - `size` (int)
  - `totalElements` (long)
  - `totalPages` (int)
  - `hasNext` (boolean)
  - `hasPrevious` (boolean)
- [BE-1.3] Create static method `calculatePagination(page, size, totalElements)` that returns `PaginationMetadata`
- [BE-1.4] Update `GalleryController.java` to use `PaginationUtil`
- [BE-1.5] Update `PhotoLikeController.java` to use `PaginationUtil`
- [BE-1.6] Update `PhotoFavoriteController.java` to use `PaginationUtil`

#### Acceptance Criteria
- All 3 controllers use `PaginationUtil`
- No duplicate pagination code remains
- All existing tests pass
- No functional regression

---

### BE-2: SortBy Validation Logic

**Priority**: MEDIUM

#### Problem Statement
Identical `isValidSortBy()` method is duplicated across 3 controllers.

#### Duplicate Locations
| File | Lines | Same Method |
|------|-------|-------------|
| `GalleryController.java` | 577-582 | `isValidSortBy()` |
| `PhotoLikeController.java` | 311-316 | `isValidSortBy()` |
| `PhotoFavoriteController.java` | 303-308 | `isValidSortBy()` |

#### Duplicate Code
```java
// Exact same method repeated:
private boolean isValidSortBy(String sortBy) {
    return sortBy.equals("newest") ||
           sortBy.equals("oldest") ||
           sortBy.equals("mostLiked") ||
           sortBy.equals("mostFavorited");
}
```

#### Requirements
- [BE-2.1] Create `SortByEnum.java` enum with values:
  - `NEWEST("newest")`
  - `OLDEST("oldest")`
  - `MOST_LIKED("mostLiked")`
  - `MOST_FAVORITED("mostFavorited")`
- [BE-2.2] Add field `private final String value;`
- [BE-2.3] Add method `public String getValue()` that returns value
- [BE-2.4] Add static method `public static SortByEnum fromValue(String value)` for validation
- [BE-2.5] Add static method `public static boolean isValid(String value)` using enum values
- [BE-2.6] Update `GalleryController.java` to use `SortByEnum`
- [BE-2.7] Update `PhotoLikeController.java` to use `SortByEnum`
- [BE-2.8] Update `PhotoFavoriteController.java` to use `SortByEnum`

#### Acceptance Criteria
- All 3 controllers use `SortByEnum`
- No duplicate validation code remains
- Type-safe sortBy values
- All existing tests pass
- No functional regression

---

### BE-3: Controller Response Patterns (Optional)

**Priority**: LOW

#### Problem Statement
Similar `ResponseEntity` patterns with try-catch blocks across controllers.

#### Requirements
- [BE-3.1] Create base controller or response helper (optional, lower priority)
- [BE-3.2] Standardize error response format
- [BE-3.3] Consider using `@ControllerAdvice` for global exception handling

#### Acceptance Criteria
- Consistent error response format
- Reduced boilerplate in controllers
- All existing tests pass

---

## Acceptance Criteria

### Overall
- [ ] All duplicate code eliminated
- [ ] Single source of truth for shared logic
- [ ] All existing tests pass
- [ ] No functional regression
- [ ] Code follows project patterns
- [ ] Changes are atomic (can be committed independently)

### Code Quality
- [ ] Code is well-documented
- [ ] JSDoc/Javadoc comments added
- [ ] Git commits follow atomic commit pattern
- [ ] No new linting errors

---

## Non-Functional Requirements

### Performance
- No performance degradation
- API calls remain efficient
- No additional unnecessary re-renders (frontend)

### Maintainability
- Code is easier to maintain
- Changes to shared logic only need to be made once
- Clear separation of concerns

### Compatibility
- No breaking changes to existing APIs
- Backward compatible with existing code
- No changes to public interfaces

### Testing
- All existing E2E tests pass
- All existing unit tests pass (if any)
- No new tests required (this is refactoring only)
