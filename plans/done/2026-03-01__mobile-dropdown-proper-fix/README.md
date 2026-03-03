# Fix Mobile Dropdown Toggle Bug (Proper Solution)

**Status**: Completed
**Created**: March 1, 2026
**Priority**: P1 (High)
**Type**: Bug Fix

---

## Overview

Fix mobile filter/sort dropdowns not closing on second click with proper solution using button ref check in handleClickOutside.

## Problem Statement

### Bug: Mobile Dropdown Not Closing on Second Click

**Symptoms**:
- User clicks filter/sort icon -> dropdown opens
- User clicks same icon again -> dropdown stays open (BROKEN)
- Expected: dropdown should close on second click

### Previous Attempt Failed

PR #9 attempted fix with `stopPropagation()` on button `onClick`.
Fix did NOT work because:
- `stopPropagation()` on `onClick` doesn't block `mousedown` event
- `handleClickOutside` listens to `mousedown`, not `click`
- Button is outside `dropdownRef`, so always triggers close

### Root Cause

**Event Flow Problem**:
```
User clicks button (2nd time):
1. mousedown event -> handleClickOutside() -> set isOpen = false
2. click event -> handleFilterButtonClick() -> toggle isOpen = true
3. Result: Dropdown stays open (race condition)
```

**Why stopPropagation() Failed**:
- Button `onClick` = `click` event
- `handleClickOutside` = `mousedown` event
- Different event types = stopPropagation doesn't work across them

## Proposed Solution

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

## Scope

### In-Scope
- Update FilterDropdown component with triggerRef prop
- Update SortByDropdown component with triggerRef prop
- Update MobileHeaderControls to pass refs
- Remove `stopPropagation()` (not needed anymore)

### Out-of-Scope
- Desktop dropdown functionality (uses different component)
- Other dropdown components

## Success Criteria

- [x] Mobile filter dropdown closes on second click
- [x] Mobile sort dropdown closes on second click
- [x] Click outside still closes dropdown
- [x] Desktop version unaffected
- [x] No console errors
- [x] All existing tests pass
- [x] Clean, maintainable code

## Final Results

### Manual Test Execution Summary
**Manual Testing** (Mobile viewport 390x844):
- **Filter Dropdown**: Opens and closes correctly on button click
- **Sort Dropdown**: Opens and closes correctly on button click
- **Click Outside**: Both dropdowns close when clicking outside
- **Desktop Version**: No regressions, works normally
- **Status**: **ALL TESTS PASSED**

### Files Modified
1. `frontend/src/components/FilterDropdown.tsx` - Added triggerRef prop + logic
2. `frontend/src/components/SortByDropdown.tsx` - Added triggerRef prop + logic
3. `frontend/src/components/gallery/MobileHeaderControls.tsx` - Created refs + passed to dropdowns

## Files Overview

- [requirements.md](./requirements.md) - Detailed requirements
- [technical-design.md](./technical-design.md) - Technical implementation details
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

---

**Plan Version**: 1.0
**Last Updated**: March 1, 2026
**Status**: Completed
