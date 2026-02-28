# Task: Fix Gallery Sorting E2E Tests (15 Tests)

**Branch**: `fix/gallery-sorting-tests`  
**Status**: In Progress  
**Started**: 2026-02-28  
**Priority**: High

## Objective
Fix 15 skipped E2E tests in `gallery-sorting.spec.ts` by resolving UI selector issues and ensuring good user experience.

## Problem Analysis

### Root Cause
Tests are failing because they're looking for `button[aria-label="Sort photos"]` but:
- **Desktop (1280x720)**: Sort dropdown is in `StickyActionBar` component (visible)
- **Mobile (<640px)**: Sort dropdown is in `MobileHeaderControls` component (hidden on desktop with `sm:hidden`)
- Tests run on desktop viewport but selectors may not be finding the correct element

### Affected Tests (15 total)
1. SORT-001: Display sort dropdown on main gallery page
2. SORT-004: Open dropdown menu when clicked
3. SORT-005: Display all 4 sort options
4. SORT-006: Highlight selected option
5. SORT-007: Close dropdown when clicking outside
6. SORT-008: Close dropdown after selection
7. SORT-009: Maintain dropdown state across pages
8. SORT-010: Display dropdown with correct styling
9. SORT-011: Show hover effects
10. SORT-012: Keyboard navigation accessibility
11. SORT-014: Sort photos by oldest first
12. SORT-015: Sort photos by most liked
13. SORT-016: Sort photos by most favorited
14. SORT-017: Update URL when sort selected
15. SORT-019: Load correct sort from direct URL

## Solution Plan

### Phase 1: Fix Test Selectors ✅
- [ ] Update test selectors to work with desktop viewport
- [ ] Ensure tests find the correct SortByDropdown component
- [ ] Add proper wait conditions for dropdown rendering

### Phase 2: Verify UI/UX
- [ ] Test on desktop viewport (1280x720)
- [ ] Test on mobile viewport (375x667)
- [ ] Ensure dropdown is accessible and functional
- [ ] Verify no visual regressions

### Phase 3: Run All Tests Locally
- [ ] Start PostgreSQL database
- [ ] Start Spring Boot backend
- [ ] Start Next.js frontend
- [ ] Run `npx playwright test tests/e2e/gallery-sorting.spec.ts --project=chromium`
- [ ] Verify all 15 tests pass

### Phase 4: Documentation & Commit
- [ ] Update this plan with results
- [ ] Create multiple commits for GitHub activity
- [ ] Push to branch and create PR

## Implementation Details

### Files to Modify
1. `tests/e2e/gallery-sorting.spec.ts` - Fix test selectors
2. Possibly `frontend/src/components/SortByDropdown.tsx` - Add data-testid if needed
3. Possibly `frontend/src/components/gallery/StickyActionBar.tsx` - Ensure visibility

### Testing Strategy
- Run tests on desktop viewport (default Playwright)
- Ensure no breaking changes to existing functionality
- Verify UI remains user-friendly

## Success Criteria
- ✅ All 15 gallery-sorting tests pass locally
- ✅ No visual regressions in UI
- ✅ Good user experience maintained
- ✅ CI checks pass after merge

## Notes
- Tests were skipped with `test.fixme()` due to "Sort dropdown not found on /gallery page in CI"
- Need to ensure selectors work in both local and CI environments
- Must preserve existing UI/UX quality
