# Technical Design - Fix Frontend & Backend DRY Violations

**Project**: Fix Frontend & Backend DRY Violations
**Status**: 📋 Design Complete
**Created**: February 8, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend Design](#frontend-design)
3. [Backend Design](#backend-design)
4. [Implementation Strategy](#implementation-strategy)
5. [Testing Strategy](#testing-strategy)
6. [Risk Assessment](#risk-assessment)

---

## Architecture Overview

### Current State

```
Frontend                           Backend
────────                           ────────
api.ts          ─┐
profileService.ts─┤─> Duplicate getToken()
galleryService.ts─┤   Duplicate createAuthHeaders()
photoLikeService  │   Duplicate fetch patterns
photoFavoriteSvc─┘

                                   ┌─> Duplicate pagination calculation
GalleryController ─┤              │   (totalPages, hasNext, hasPrevious)
PhotoLikeController├─> Duplicate │
PhotoFavoriteCtrl─┘   isValidSortBy()
```

### Target State

```
Frontend                           Backend
────────                           ────────
apiClient.ts ────────> Centralized auth
                          fetch wrapper
api.ts          ────────┘
profileService.ts ──────┤  All services use apiClient
galleryService.ts  ─────┤
photoLikeService   ─────┤
photoFavoriteSvc   ─────┘

                                   ┌─> PaginationUtil.calculatePagination()
GalleryController ─┤              │   SortByEnum.isValid()
PhotoLikeController├─> Use shared │
PhotoFavoriteCtrl─┘   utilities   ┘
```

---

## Frontend Design

### FE-1: Centralized API Client

#### File Structure
```
frontend/src/lib/
├── auth.ts              (existing - login, logout, isAuthenticated)
└── apiClient.ts         (NEW - centralized API client)
```

#### API Client Interface

```typescript
// frontend/src/lib/apiClient.ts

/**
 * Centralized API Client for authenticated requests
 *
 * Provides single source of truth for:
 * - Token retrieval from localStorage
 * - Auth header creation
 * - Fetch wrapper with automatic auth injection
 */

const AUTH_TOKEN_KEY = 'authToken';

/**
 * Get authentication token from localStorage
 * @returns Token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Create authentication headers for API requests
 * @returns Headers object with Authorization bearer token
 */
export function createAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch wrapper that automatically adds authentication headers
 * @param url - API endpoint URL
 * @param options - Fetch options (method, body, etc.)
 * @returns Fetch response
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...createAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Convenience method for GET requests
 */
export async function get<T>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, { method: 'GET' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * Convenience method for POST requests
 */
export async function post<T>(url: string, data: unknown): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * Convenience method for PUT requests
 */
export async function put<T>(url: string, data: unknown): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * Convenience method for DELETE requests
 */
export async function del(url: string): Promise<void> {
  const response = await fetchWithAuth(url, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
```

#### Migration Example

**Before** (profileService.ts):
```typescript
const token = localStorage.getItem('authToken');
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const response = await fetch(`${API_URL}/profile`, {
  method: 'GET',
  headers,
});
```

**After** (profileService.ts):
```typescript
import { get } from '@/lib/apiClient';

const response = await get(`${API_URL}/profile`);
// fetchWithAuth automatically adds auth headers
```

---

### FE-2: ActionButton Component (Optional)

#### File Structure
```
frontend/src/components/
├── LikeButton.tsx        (existing - will use ActionButton)
├── FavoriteButton.tsx    (existing - will use ActionButton)
└── ActionButton.tsx      (NEW - reusable action button)
```

#### ActionButton Interface

```typescript
// frontend/src/components/ActionButton.tsx

interface ActionButtonProps {
  /** Current count (likes, favorites, etc.) */
  count: number;
  /** Whether the action is currently active */
  isActive: boolean;
  /** Icon to display when active */
  activeIcon: React.ReactNode;
  /** Icon to display when inactive */
  inactiveIcon: React.ReactNode;
  /** Label for accessibility */
  label: string;
  /** Active label for accessibility */
  activeLabel: string;
  /** API function to call on click */
  onAction: (isActive: boolean) => Promise<void>;
  /** Optional custom className */
  className?: string;
}

export function ActionButton({
  count,
  isActive,
  activeIcon,
  inactiveIcon,
  label,
  activeLabel,
  onAction,
  className = '',
}: ActionButtonProps) {
  const [optimisticActive, setOptimisticActive] = useState(isActive);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // Optimistic update
    const newActiveState = !optimisticActive;
    setOptimisticActive(newActiveState);
    setOptimisticCount(prev => newActiveState ? prev + 1 : prev - 1);

    setIsLoading(true);
    try {
      await onAction(!isActive); // Pass current actual state
    } catch {
      // Rollback on error
      setOptimisticActive(isActive);
      setOptimisticCount(count);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset optimistic values when props change
  useEffect(() => {
    setOptimisticActive(isActive);
    setOptimisticCount(count);
  }, [isActive, count]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={optimisticActive ? activeLabel : label}
      className={className}
    >
      {optimisticActive ? activeIcon : inactiveIcon}
      <span>{optimisticCount}</span>
    </button>
  );
}
```

---

## Backend Design

### BE-1: Pagination Utility

#### File Structure
```
backend/src/main/java/com/ikplabs/kameravue/util/
└── PaginationUtil.java  (NEW)
```

#### PaginationUtil Implementation

```java
// backend/.../util/PaginationUtil.java

package com.ikplabs.kameravue.util;

/**
 * Utility class for pagination calculations
 *
 * Provides centralized pagination metadata calculation
 * for all paginated endpoints.
 */
public class PaginationUtil {

    /**
     * Calculate pagination metadata
     *
     * @param page Current page number (0-indexed)
     * @param size Number of items per page
     * @param totalElements Total number of elements
     * @return PaginationMetadata containing all pagination info
     */
    public static PaginationMetadata calculatePagination(
            int page, int size, long totalElements) {

        int totalPages = (int) Math.ceil((double) totalElements / size);
        boolean hasNext = page < totalPages - 1;
        boolean hasPrevious = page > 0;

        return new PaginationMetadata(
            page,
            size,
            totalElements,
            totalPages,
            hasNext,
            hasPrevious
        );
    }

    /**
     * Record representing pagination metadata
     */
    public record PaginationMetadata(
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext,
        boolean hasPrevious
    ) {}
}
```

#### Migration Example

**Before** (GalleryController.java):
```java
int totalPages = (int) Math.ceil((double) totalPhotos / size);
boolean hasNext = page < totalPages - 1;
boolean hasPrevious = page > 0;

return ResponseEntity.ok(new PhotoResponse(
    photos,
    page,
    size,
    totalPhotos,
    totalPages,
    hasNext,
    hasPrevious
));
```

**After** (GalleryController.java):
```java
import com.ikplabs.kameravue.util.PaginationUtil;
import com.ikplabs.kameravue.util.PaginationUtil.PaginationMetadata;

PaginationMetadata pagination = PaginationUtil.calculatePagination(
    page, size, totalPhotos
);

return ResponseEntity.ok(new PhotoResponse(
    photos,
    pagination.page(),
    pagination.size(),
    pagination.totalElements(),
    pagination.totalPages(),
    pagination.hasNext(),
    pagination.hasPrevious()
));
```

---

### BE-2: SortBy Enum

#### File Structure
```
backend/src/main/java/com/ikplabs/kameravue/enums/
└── SortByEnum.java  (NEW)
```

#### SortByEnum Implementation

```java
// backend/.../enums/SortByEnum.java

package com.ikplabs.kameravue.enums;

/**
 * Enum for valid sort by options
 *
 * Provides type-safe sort by values and validation.
 */
public enum SortByEnum {

    NEWEST("newest"),
    OLDEST("oldest"),
    MOST_LIKED("mostLiked"),
    MOST_FAVORITED("mostFavorited");

    private final String value;

    SortByEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Get SortByEnum from string value
     * @param value String value to convert
     * @return Matching SortByEnum or null if invalid
     */
    public static SortByEnum fromValue(String value) {
        for (SortByEnum sortBy : SortByEnum.values()) {
            if (sortBy.value.equals(value)) {
                return sortBy;
            }
        }
        return null;
    }

    /**
     * Check if string value is a valid sort by option
     * @param value String value to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValid(String value) {
        return fromValue(value) != null;
    }
}
```

#### Migration Example

**Before** (GalleryController.java):
```java
private boolean isValidSortBy(String sortBy) {
    return sortBy.equals("newest") ||
           sortBy.equals("oldest") ||
           sortBy.equals("mostLiked") ||
           sortBy.equals("mostFavorited");
}
```

**After** (GalleryController.java):
```java
import com.ikplabs.kameravue.enums.SortByEnum;

// No need for private method - use enum directly
if (!SortByEnum.isValid(sortBy)) {
    throw new IllegalArgumentException("Invalid sortBy parameter");
}
```

---

## Implementation Strategy

### Phase Order

1. **Priority 1: FE Auth Token Consolidation** (30 min)
   - Highest impact (~100 lines duplicate code)
   - Affects all service files
   - No complex logic changes

2. **Priority 2: BE Pagination Utility** (20 min)
   - Clear utility class
   - Easy to test
   - 3 controllers need update

3. **Priority 3: BE SortBy Enum** (15 min)
   - Simple enum creation
   - Straightforward migration
   - Type-safe improvement

4. **Priority 4: ActionButton Component** (30 min) - OPTIONAL
   - More complex UI component
   - Requires careful state management
   - Lower priority

### Atomic Commit Strategy

Each priority should be committed independently:

```
feat(frontend): create centralized API client

- Add apiClient.ts with getToken, createAuthHeaders, fetchWithAuth
- Update api.ts to use apiClient
- Update profileService.ts to use apiClient
- Update galleryService.ts to use apiClient
- Update photoLikeService.ts to use apiClient
- Update photoFavoriteService.ts to use apiClient

Eliminates ~100 lines of duplicate auth handling code.
```

```
feat(backend): add PaginationUtil for pagination metadata

- Create PaginationUtil.calculatePagination()
- Create PaginationMetadata record
- Update GalleryController to use PaginationUtil
- Update PhotoLikeController to use PaginationUtil
- Update PhotoFavoriteController to use PaginationUtil

Eliminates ~30 lines of duplicate pagination code.
```

```
feat(backend): add SortByEnum for type-safe sort validation

- Create SortByEnum with all valid values
- Add fromValue() and isValid() methods
- Update GalleryController to use SortByEnum
- Update PhotoLikeController to use SortByEnum
- Update PhotoFavoriteController to use SortByEnum

Eliminates ~24 lines of duplicate validation code.
```

---

## Testing Strategy

### Approach: Refactoring Tests

Since this is pure refactoring (no functional changes), we rely on existing tests:

1. **No new tests required** - behavior should remain identical
2. **Run existing E2E tests** - ensure no regression
3. **Manual testing** - verify auth, pagination, and sorting still work

### Test Commands

```bash
# Frontend tests
npm run test          # Unit tests (if any)
npm run test:e2e      # E2E tests

# Backend tests
mvn test              # All tests
mvn test -Dtest=GalleryControllerTest
mvn test -Dtest=PhotoLikeControllerTest
mvn test -Dtest=PhotoFavoriteControllerTest
```

### Manual Testing Checklist

- [ ] Login functionality works
- [ ] Gallery pagination works
- [ ] Gallery sorting works (newest, oldest, mostLiked, mostFavorited)
- [ ] Like button works
- [ ] Favorite button works
- [ ] Profile page loads correctly

---

## Risk Assessment

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Breaking existing functionality | HIGH | LOW | Comprehensive E2E test suite |
| Introducing new bugs | MEDIUM | LOW | Atomic commits allow easy rollback |
| TypeScript compilation errors | LOW | LOW | Type checking during development |
| Java compilation errors | LOW | LOW | Compile before committing |

### Rollback Strategy

Each priority is in a separate atomic commit:

```bash
# If something breaks, rollback specific commit:
git revert <commit-hash>

# Or rollback to before the work:
git reset --hard <before-commit-hash>
```

---

## Files Summary

### Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/lib/apiClient.ts` | Centralized API client |
| `backend/.../util/PaginationUtil.java` | Pagination utility |
| `backend/.../enums/SortByEnum.java` | SortBy enum |
| `frontend/src/components/ActionButton.tsx` | Reusable action button (optional) |

### Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/services/api.ts` | Use apiClient |
| `frontend/src/services/profileService.ts` | Use apiClient |
| `frontend/src/services/galleryService.ts` | Use apiClient |
| `frontend/src/services/photoLikeService.ts` | Use apiClient |
| `frontend/src/services/photoFavoriteService.ts` | Use apiClient |
| `backend/.../controller/GalleryController.java` | Use PaginationUtil & SortByEnum |
| `backend/.../controller/PhotoLikeController.java` | Use PaginationUtil & SortByEnum |
| `backend/.../controller/PhotoFavoriteController.java` | Use PaginationUtil & SortByEnum |
| `frontend/src/components/LikeButton.tsx` | Use ActionButton (optional) |
| `frontend/src/components/FavoriteButton.tsx` | Use ActionButton (optional) |

---

## Estimated Impact

### Code Reduction

| Category | Lines Removed | Lines Added | Net Reduction |
|----------|---------------|-------------|---------------|
| FE Auth Token | ~100 | ~80 | ~20 |
| BE Pagination | ~30 | ~40 | -10 (but more maintainable) |
| BE SortBy | ~24 | ~30 | -6 (but type-safe) |
| **Total** | ~154 | ~150 | **~4 (net) + much improved maintainability** |

### Maintainability Improvement

- **Single source of truth** for auth, pagination, and validation
- **Type-safe** sortBy values
- **Easier to extend** - add new sort options in one place
- **Easier to test** - utility classes can be unit tested
- **Recruiter-friendly** - shows clean code practices
