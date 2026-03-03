# Fix Mobile Dropdown Toggle Bug - Implementation Checklist

## Status Legend
- [ ] Not started
- [x] Completed

---

## Phase 1: Update FilterDropdown Component

### Task 1.1: Add triggerRef to FilterDropdown
**Estimated Time**: 15 minutes

**Steps**:
1. [x] Add optional `triggerRef` prop to FilterDropdown
2. [x] Update `handleClickOutside` to check if click is on trigger button
3. [x] If click on trigger, return early (don't close)
4. [x] Keep existing behavior for other outside clicks
5. [x] Fix TypeScript types for nullable ref

**Acceptance Criteria**:
- [x] Component accepts triggerRef prop
- [x] handleClickOutside ignores clicks on trigger button

---

## Phase 2: Update SortByDropdown Component

### Task 2.1: Add triggerRef to SortByDropdown
**Estimated Time**: 15 minutes

**Steps**:
1. [x] Same changes as FilterDropdown
2. [x] Add `triggerRef` prop
3. [x] Update `handleClickOutside` logic
4. [x] Fix TypeScript types for nullable ref

**Acceptance Criteria**:
- [x] Component accepts triggerRef prop
- [x] handleClickOutside ignores clicks on trigger button

---

## Phase 3: Update MobileHeaderControls

### Task 3.1: Create and Pass Refs
**Estimated Time**: 15 minutes

**Steps**:
1. [x] Create refs for filter and sort buttons
2. [x] Pass refs to FilterDropdown and SortByDropdown
3. [x] Remove `stopPropagation()` (not needed anymore)
4. [x] Keep simple toggle logic
5. [x] Import useRef from React

**Acceptance Criteria**:
- [x] Refs created and passed to dropdowns
- [x] stopPropagation removed
- [x] Simple toggle logic preserved

---

## Phase 4: Test Locally

### Task 4.1: Manual Testing
**Estimated Time**: 15 minutes

**Steps**:
1. [x] Frontend dev server running
2. [x] Opened http://localhost:3002/gallery
3. [x] Tested on mobile viewport (390x844)
4. [x] Filter dropdown:
   - Click icon -> opens
   - Click icon again -> **closes** (FIXED!)
   - Click outside -> closes
5. [x] Sort dropdown:
   - Click icon -> opens
   - Click icon again -> **closes** (FIXED!)
   - Click outside -> closes
6. [x] Desktop version still works correctly

**Acceptance Criteria**:
- [x] Filter dropdown toggles correctly
- [x] Sort dropdown toggles correctly
- [x] Desktop version unaffected

---

## Phase 5: Documentation & Commit

### Task 5.1: Create Commits
**Estimated Time**: 15 minutes

**Steps**:
1. [x] Update this plan with results
2. [x] Create multiple commits:
   - `fix(dropdown): add triggerRef to FilterDropdown`
   - `fix(dropdown): add triggerRef to SortByDropdown`
   - `fix(mobile): use refs to fix dropdown toggle`
   - `docs: update plan with test results`

**Acceptance Criteria**:
- [x] Multiple commits for GitHub activity
- [x] Documentation updated

---

## Success Criteria Summary

### Must Have (P0)
- [x] Mobile filter dropdown closes on second click
- [x] Mobile sort dropdown closes on second click
- [x] Click outside still closes dropdown
- [x] Desktop version unaffected
- [x] No console errors
- [x] All existing tests pass
- [x] Clean, maintainable code

---

## Final Results

### Manual Test Execution Summary
**Manual Testing** (Mobile viewport 390x844):
- **Filter Dropdown**: Opens and closes correctly on button click
- **Sort Dropdown**: Opens and closes correctly on button click
- **Click Outside**: Both dropdowns close when clicking outside
- **Desktop Version**: No regressions, works normally
- **Status**: **ALL TESTS PASSED**

### Root Cause Confirmed
Previous fix (PR #9) failed because:
- Used `stopPropagation()` on `onClick` event
- `handleClickOutside` listens to `mousedown` event
- Different event types = stopPropagation doesn't work

### Solution Implemented
- Added `triggerRef` prop to both dropdown components
- Button ref passed from `MobileHeaderControls`
- `handleClickOutside` checks if click is on trigger button
- If yes, ignores the click (lets button handle toggle)
- Works because check happens in same event type (`mousedown`)

### Files Modified
1. `frontend/src/components/FilterDropdown.tsx` - Added triggerRef prop + logic
2. `frontend/src/components/SortByDropdown.tsx` - Added triggerRef prop + logic
3. `frontend/src/components/gallery/MobileHeaderControls.tsx` - Created refs + passed to dropdowns

### Commits Created
1. `fix(dropdown): add triggerRef to FilterDropdown`
2. `fix(dropdown): add triggerRef to SortByDropdown`
3. `fix(mobile): use refs to fix dropdown toggle`
4. `docs: update plan with test results`

---

**Checklist Version**: 1.0
**Created**: March 1, 2026
**Last Updated**: March 1, 2026
**Status**: Completed
