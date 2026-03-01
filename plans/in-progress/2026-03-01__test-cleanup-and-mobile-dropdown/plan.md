# Task: Fix Test Cleanup & Mobile Dropdown Toggle Bugs

**Branch**: `fix/test-cleanup-and-mobile-dropdown`
**Status**: In Progress
**Started**: 2026-03-01
**Priority**: High

## Objective
Fix 2 critical bugs found during manual testing:
1. Test photos not being auto-deleted after E2E tests (database pollution)
2. Mobile filter/sort dropdowns not closing on second click

## Problem Analysis

### Bug 1: Test Photos Not Auto-Deleted
**Symptoms**: Gallery has many "sampah" (garbage) photos from E2E tests

**Root Cause**: 
- Cleanup mechanism exists in `gallery-helpers.ts` (`cleanupTestUser()`)
- Only **11 of 21 test files** implement `afterAll` cleanup hook
- Files without cleanup leave test users and photos in database

**Affected Files** (no cleanup):
- `landing-page.spec.ts`
- `desktop-viewport.spec.ts`
- `ux-validation.spec.ts`
- `ux-confirmations.spec.ts`
- `ux-empty-states.spec.ts`
- `ux-story-journey-existing-user.spec.ts`
- `demo-screenshot-capture.spec.ts`
- And others...

### Bug 2: Mobile Dropdown Toggle Not Working
**Symptoms**: On mobile, clicking filter/sort icon second time doesn't close dropdown

**Root Cause**: Race condition between button toggle and `handleClickOutside`
- Button click toggles state: `setIsOpen(!isOpen)`
- `handleClickOutside` in `FilterDropdown.tsx` also fires
- Button is NOT inside `dropdownRef`, so it's considered "outside"
- Both handlers compete, causing inconsistent state

**Affected Components**:
- `MobileHeaderControls.tsx` (lines 82, 104)
- `FilterDropdown.tsx` (lines 74-84)
- `SortByDropdown.tsx` (same pattern)

## Solution Plan

### Phase 1: Fix Test Cleanup ✅
- [ ] Identify all test files that create users/photos
- [ ] Add `afterAll` cleanup hook to missing files
- [ ] Import `cleanupTestUser` helper
- [ ] Track created users in array
- [ ] Verify cleanup works locally

### Phase 2: Fix Mobile Dropdown Toggle ✅
- [ ] Update `MobileHeaderControls.tsx` to include button in ref
- [ ] Or use `stopPropagation()` on button clicks
- [ ] Test on mobile viewport (375x667)
- [ ] Verify both filter and sort dropdowns work
- [ ] Ensure desktop version still works

### Phase 3: Test Locally ✅
- [ ] Run E2E tests and verify cleanup
- [ ] Check database - no leftover test users
- [ ] Test mobile dropdown on Chrome DevTools
- [ ] Test desktop dropdown still works
- [ ] Verify no regressions

### Phase 4: Documentation & Commit ✅
- [ ] Update this plan with results
- [ ] Create multiple commits:
  1. Add cleanup to test files (batch 1)
  2. Add cleanup to test files (batch 2)
  3. Fix mobile dropdown toggle bug
  4. Update plan documentation
- [ ] Push to branch and create PR

## Implementation Details

### Files to Modify

**Test Files** (add cleanup):
1. `tests/e2e/landing-page.spec.ts`
2. `tests/e2e/desktop-viewport.spec.ts`
3. `tests/e2e/ux-validation.spec.ts`
4. `tests/e2e/ux-confirmations.spec.ts`
5. `tests/e2e/ux-empty-states.spec.ts`
6. `tests/e2e/ux-story-journey-existing-user.spec.ts`
7. `tests/e2e/demo-screenshot-capture.spec.ts`
8. Others as needed

**Frontend Components** (fix dropdown):
1. `frontend/src/components/gallery/MobileHeaderControls.tsx`
2. Possibly `frontend/src/components/FilterDropdown.tsx`
3. Possibly `frontend/src/components/SortByDropdown.tsx`

### Testing Strategy
- Run full E2E test suite
- Check database for leftover users: `SELECT * FROM users WHERE email LIKE '%test%'`
- Test mobile viewport in Chrome DevTools (375x667)
- Test desktop viewport (1280x720)
- Verify no breaking changes

## Success Criteria
- ✅ All test files have cleanup hooks
- ✅ No test users/photos left in database after tests
- ✅ Mobile dropdowns close on second click
- ✅ Desktop dropdowns still work correctly
- ✅ All E2E tests still pass
- ✅ No regressions in UI/UX

## Notes
- Test cleanup is critical for CI/CD pipeline
- Mobile dropdown bug affects user experience
- Both bugs found during manual testing
- Fixes should be backward compatible
