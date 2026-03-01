# Task: Fix Mobile Dropdown Toggle Bug (Proper Solution)

**Branch**: `fix/mobile-dropdown-proper`
**Status**: In Progress
**Started**: 2026-03-01
**Priority**: High

## Objective
Fix mobile filter/sort dropdowns not closing on second click with proper solution using button ref check in handleClickOutside.

## Problem Analysis

### Bug: Mobile Dropdown Not Closing on Second Click

**Symptoms**: 
- User clicks filter/sort icon → dropdown opens ✅
- User clicks same icon again → dropdown stays open ❌
- Expected: dropdown should close on second click

**Previous Attempt Failed**:
- PR #9 attempted fix with `stopPropagation()` on button `onClick`
- Fix did NOT work because:
  - `stopPropagation()` on `onClick` doesn't block `mousedown` event
  - `handleClickOutside` listens to `mousedown`, not `click`
  - Button is outside `dropdownRef`, so always triggers close

### Root Cause

**Event Flow Problem**:
```
User clicks button (2nd time):
1. mousedown event → handleClickOutside() → set isOpen = false
2. click event → handleFilterButtonClick() → toggle isOpen = true
3. Result: Dropdown stays open (race condition)
```

**Why stopPropagation() Failed**:
- Button `onClick` = `click` event
- `handleClickOutside` = `mousedown` event  
- Different event types = stopPropagation doesn't work across them

### Affected Components
- `frontend/src/components/gallery/MobileHeaderControls.tsx` - Button triggers
- `frontend/src/components/FilterDropdown.tsx` - handleClickOutside logic
- `frontend/src/components/SortByDropdown.tsx` - Same pattern

## Solution Plan

### Proper Solution: Ignore Button Click in handleClickOutside

**Approach**:
1. Pass button ref from `MobileHeaderControls` to dropdown components
2. In `handleClickOutside`, check if click target is the button
3. If click is on button, ignore (don't close dropdown)
4. Button onClick handles toggle normally

**Why This Works**:
- Button ref check happens in `mousedown` handler (same event type)
- No race condition between different event types
- Clean separation: button controls open/close, outside click only closes
- Predictable behavior

### Phase 1: Update FilterDropdown Component ✅
- [x] Add optional `triggerRef` prop to FilterDropdown
- [x] Update `handleClickOutside` to check if click is on trigger button
- [x] If click on trigger, return early (don't close)
- [x] Keep existing behavior for other outside clicks
- [x] Fix TypeScript types for nullable ref

### Phase 2: Update SortByDropdown Component ✅
- [x] Same changes as FilterDropdown
- [x] Add `triggerRef` prop
- [x] Update `handleClickOutside` logic
- [x] Fix TypeScript types for nullable ref

### Phase 3: Update MobileHeaderControls ✅
- [x] Create refs for filter and sort buttons
- [x] Pass refs to FilterDropdown and SortByDropdown
- [x] Remove `stopPropagation()` (not needed anymore)
- [x] Keep simple toggle logic
- [x] Import useRef from React

### Phase 4: Test Locally ✅
- [x] Frontend dev server running
- [x] Opened http://localhost:3002/gallery
- [x] Tested on mobile viewport (390x844)
- [x] Filter dropdown:
  - Click icon → opens ✅
  - Click icon again → **closes ✅** (FIXED!)
  - Click outside → closes ✅
- [x] Sort dropdown:
  - Click icon → opens ✅
  - Click icon again → **closes ✅** (FIXED!)
  - Click outside → closes ✅
- [x] Desktop version still works correctly

### Phase 5: Documentation & Commit ✅
- [x] Update this plan with results
- [ ] Create multiple commits:
  1. Add triggerRef to FilterDropdown
  2. Add triggerRef to SortByDropdown
  3. Update MobileHeaderControls to use refs
  4. Update plan documentation
- [ ] Push to branch and create PR

## Implementation Details

### Files to Modify

**Frontend Components**:
1. `frontend/src/components/FilterDropdown.tsx`
   - Add `triggerRef?: React.RefObject<HTMLElement>` prop
   - Update handleClickOutside to check triggerRef

2. `frontend/src/components/SortByDropdown.tsx`
   - Same changes as FilterDropdown

3. `frontend/src/components/gallery/MobileHeaderControls.tsx`
   - Create `filterButtonRef` and `sortButtonRef`
   - Pass refs to dropdown components
   - Remove stopPropagation (clean up previous failed fix)

### Code Changes Preview

**FilterDropdown.tsx**:
```typescript
interface FilterDropdownProps {
  // ... existing props
  triggerRef?: React.RefObject<HTMLElement>;
}

// In handleClickOutside:
const handleClickOutside = (event: MouseEvent) => {
  // Check if click is on trigger button
  if (triggerRef?.current?.contains(event.target as Node)) {
    return; // Ignore clicks on trigger button
  }
  
  // Existing logic for outside clicks
  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    // Close dropdown
  }
};
```

**MobileHeaderControls.tsx**:
```typescript
const filterButtonRef = useRef<HTMLButtonElement>(null);
const sortButtonRef = useRef<HTMLButtonElement>(null);

<button ref={filterButtonRef} onClick={...}>
<FilterDropdown triggerRef={filterButtonRef} ... />

<button ref={sortButtonRef} onClick={...}>
<SortByDropdown triggerRef={sortButtonRef} ... />
```

## Testing Strategy

### Manual Testing
1. **Mobile viewport** (390x844 - iPhone 12 Pro):
   - Filter dropdown open/close toggle
   - Sort dropdown open/close toggle
   - Click outside to close
   - Keyboard Escape to close

2. **Desktop viewport** (1280x720):
   - Verify desktop dropdowns still work
   - No regressions

3. **Edge cases**:
   - Rapid clicking on button
   - Click button while other dropdown open
   - Tab navigation

### Automated Testing
- Existing E2E tests should still pass
- No new tests needed (behavior fix, not feature)

## Success Criteria
- ✅ Mobile filter dropdown closes on second click
- ✅ Mobile sort dropdown closes on second click
- ✅ Click outside still closes dropdown
- ✅ Desktop version unaffected
- ✅ No console errors
- ✅ All existing tests pass
- ✅ Clean, maintainable code

## Final Results

### Test Execution Summary
**Manual Testing** (Mobile viewport 390x844):
- **Filter Dropdown**: ✅ Opens and closes correctly on button click
- **Sort Dropdown**: ✅ Opens and closes correctly on button click
- **Click Outside**: ✅ Both dropdowns close when clicking outside
- **Desktop Version**: ✅ No regressions, works normally
- **Status**: **ALL TESTS PASSED** 🎉

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

### Commits to Create
1. `fix(dropdown): add triggerRef to FilterDropdown`
2. `fix(dropdown): add triggerRef to SortByDropdown`
3. `fix(mobile): use refs to fix dropdown toggle`
4. `docs: update plan with test results`

## Notes
- This is the PROPER fix (previous PR #9 used wrong approach)
- Solution is more robust and predictable
- No breaking changes to component API
- Backward compatible (triggerRef is optional)
- TypeScript types properly handled for nullable refs
