# Fix Gallery Sorting E2E Tests - Technical Design

**Plan**: Fix Gallery Sorting E2E Tests
**Version**: 1.0
**Last Updated**: February 28, 2026

---

## Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Solution Design](#solution-design)
3. [Code Changes](#code-changes)
4. [Testing Strategy](#testing-strategy)

---

## Problem Analysis

### Root Cause

Tests were failing because of selector ambiguity. On desktop viewport (1280x720), there are TWO buttons with `aria-label="Sort photos"`:

1. **Mobile button** in `MobileHeaderControls` (hidden with `sm:hidden` class)
2. **Desktop button** in `StickyActionBar` (visible on desktop)

Using `.first()` selected the mobile button (first in DOM) which was hidden, causing "element not visible" timeouts.

### Component Architecture

```
Gallery Page
├── MobileHeaderControls (sm:hidden on desktop)
│   └── SortByDropdown (mobile version - hidden on desktop)
│       └── button[aria-label="Sort photos"] (FIRST in DOM)
│
└── StickyActionBar (visible on desktop)
    └── SortByDropdown (desktop version - visible)
        └── button[aria-label="Sort photos"] (LAST in DOM)
```

---

## Solution Design

### Approach: Use `.last()` Selector

**Why This Works**:
- The desktop button is last in DOM order
- It's the visible one on desktop viewport
- No frontend code changes needed
- Works in both local and CI environments

### Files to Modify

1. `tests/e2e/gallery-sorting.spec.ts` - Fix test selectors

---

## Code Changes

### Before (Broken)

```typescript
const sortButton = page.locator('button[aria-label="Sort photos"]').first();
```

### After (Fixed)

```typescript
const sortButton = page.locator('button[aria-label="Sort photos"]').last();
```

### Styling Assertions Fix

```typescript
// Before (incorrect)
await expect(dropdown).toHaveClass(/shadow-2xl/);
await expect(dropdown).toHaveClass(/z-50/);

// After (correct)
await expect(dropdown).toHaveClass(/shadow-xl/);
await expect(dropdown).toHaveClass(/z-\[100\]/);
```

---

## Testing Strategy

### Test Environment
- Desktop viewport (1280x720) - default Playwright
- Chromium browser
- PostgreSQL + Spring Boot + Next.js running

### Test Execution

```bash
# Run gallery sorting tests
npx playwright test tests/e2e/gallery-sorting.spec.ts --project=chromium
```

### Expected Results
- All 24 tests pass
- No visual regressions
- No breaking changes to existing functionality

---

**Technical Design Version**: 1.0
**Last Updated**: February 28, 2026
**Ready for Implementation**: Yes (Completed)
