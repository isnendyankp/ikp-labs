# Fix Test Cleanup & Mobile Dropdown - Technical Design

**Plan**: Fix Test Cleanup & Mobile Dropdown Toggle Bugs
**Version**: 1.0
**Last Updated**: March 1, 2026

---

## Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Solution Design](#solution-design)
3. [Code Changes](#code-changes)
4. [Testing Strategy](#testing-strategy)

---

## Problem Analysis

### Bug 1: Test Photos Not Auto-Deleted

**Root Cause**:
- Cleanup mechanism exists in `gallery-helpers.ts` (`cleanupTestUser()`)
- Only **11 of 21 test files** implement `afterAll` cleanup hook
- Files without cleanup leave test users and photos in database

**Note**: Only `login.spec.ts` needed cleanup. Other files without `afterAll` don't create real users:
- `landing-page.spec.ts` - uses fake JWT tokens only
- `desktop-viewport.spec.ts` - UI tests only, no user creation
- `ux-validation.spec.ts` - UI validation tests only

### Bug 2: Mobile Dropdown Toggle Not Working

**Root Cause**: Race condition between button toggle and `handleClickOutside`

**Event Flow Problem**:
```
User clicks button (2nd time):
1. click event -> handleFilterButtonClick() -> toggle isOpen
2. handleClickOutside() also fires
3. Button is outside dropdownRef, so it triggers close
4. Result: Race condition, inconsistent state
```

**Affected Components**:
- `MobileHeaderControls.tsx` (lines 82, 104)
- `FilterDropdown.tsx` (lines 74-84)
- `SortByDropdown.tsx` (same pattern)

---

## Solution Design

### For Test Cleanup

**Approach**: Add `afterAll` hook with cleanup to `login.spec.ts`

**Files to Modify**:
1. `tests/e2e/login.spec.ts` - Add cleanup hook

### For Mobile Dropdown

**Approach**: Use `stopPropagation()` on button clicks

**Files to Modify**:
1. `frontend/src/components/gallery/MobileHeaderControls.tsx` - Add stopPropagation

---

## Code Changes

### Test Cleanup (login.spec.ts)

```typescript
import { cleanupTestUser } from './helpers/gallery-helpers';

// Track created users
const createdUsers: string[] = [];

afterAll(async ({ request }) => {
  // Clean up all created users
  for (const email of createdUsers) {
    await cleanupTestUser(request, email);
  }
});

// In tests, track created users
createdUsers.push(testEmail);
```

### Mobile Dropdown Fix (MobileHeaderControls.tsx)

```typescript
// Before (broken)
<button onClick={() => setIsFilterOpen(!isFilterOpen)}>
  <FilterIcon />
</button>

// After (fixed)
const handleFilterButtonClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsFilterOpen(!isFilterOpen);
};

const handleSortButtonClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsSortOpen(!isSortOpen);
};

<button onClick={handleFilterButtonClick}>
  <FilterIcon />
</button>
```

---

## Testing Strategy

### Test Environment
- PostgreSQL + Spring Boot + Next.js running
- Mobile viewport (375x667 or 390x844)
- Desktop viewport (1280x720)

### Manual Testing

1. **Mobile Dropdown**:
   - Open/close filter dropdown multiple times
   - Open/close sort dropdown multiple times
   - Click outside to close
   - Verify no race condition

2. **Desktop Dropdown**:
   - Verify desktop dropdowns still work
   - No regressions

### Automated Testing

```bash
# Run login tests
npx playwright test tests/e2e/login.spec.ts --project=chromium

# Check database for leftover users
# SELECT * FROM users WHERE email LIKE '%test%'
```

---

**Technical Design Version**: 1.0
**Last Updated**: March 1, 2026
