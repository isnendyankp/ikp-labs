# Fix Mobile Dropdown Toggle Bug - Detailed Requirements

**Plan**: Fix Mobile Dropdown Toggle Bug (Proper Solution)
**Version**: 1.0
**Last Updated**: March 1, 2026

---

## Table of Contents

1. [Component Requirements](#component-requirements)
2. [Behavior Requirements](#behavior-requirements)
3. [Acceptance Criteria](#acceptance-criteria)

---

## Component Requirements

### REQ-1: FilterDropdown Component

**Requirement**: FilterDropdown must accept triggerRef prop

**Acceptance Criteria**:
- [x] Add optional `triggerRef` prop to FilterDropdown
- [x] Update `handleClickOutside` to check if click is on trigger button
- [x] If click on trigger, return early (don't close)
- [x] Keep existing behavior for other outside clicks
- [x] Fix TypeScript types for nullable ref

---

### REQ-2: SortByDropdown Component

**Requirement**: SortByDropdown must accept triggerRef prop

**Acceptance Criteria**:
- [x] Add optional `triggerRef` prop to SortByDropdown
- [x] Update `handleClickOutside` to check if click is on trigger button
- [x] If click on trigger, return early (don't close)
- [x] Keep existing behavior for other outside clicks
- [x] Fix TypeScript types for nullable ref

---

### REQ-3: MobileHeaderControls Component

**Requirement**: MobileHeaderControls must pass refs to dropdowns

**Acceptance Criteria**:
- [x] Create refs for filter and sort buttons
- [x] Pass refs to FilterDropdown and SortByDropdown
- [x] Remove `stopPropagation()` (not needed anymore)
- [x] Keep simple toggle logic
- [x] Import useRef from React

---

## Behavior Requirements

### BEH-1: Filter Dropdown Toggle

**Requirement**: Filter dropdown must toggle correctly on button click

**Scenarios**:
| Scenario | Expected Result |
|----------|-----------------|
| Click filter icon (1st time) | Dropdown opens |
| Click filter icon (2nd time) | Dropdown closes |
| Click outside when open | Dropdown closes |
| Press Escape when open | Dropdown closes |

**Acceptance Criteria**:
- [x] Dropdown opens on first click
- [x] Dropdown closes on second click
- [x] Dropdown closes on outside click
- [x] Dropdown closes on Escape key

---

### BEH-2: Sort Dropdown Toggle

**Requirement**: Sort dropdown must toggle correctly on button click

**Scenarios**:
| Scenario | Expected Result |
|----------|-----------------|
| Click sort icon (1st time) | Dropdown opens |
| Click sort icon (2nd time) | Dropdown closes |
| Click outside when open | Dropdown closes |
| Press Escape when open | Dropdown closes |

**Acceptance Criteria**:
- [x] Dropdown opens on first click
- [x] Dropdown closes on second click
- [x] Dropdown closes on outside click
- [x] Dropdown closes on Escape key

---

### BEH-3: Desktop Compatibility

**Requirement**: Desktop version must continue to work correctly

**Acceptance Criteria**:
- [x] Desktop dropdowns unaffected
- [x] No regressions in desktop behavior

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [x] Mobile filter dropdown closes on second click
- [x] Mobile sort dropdown closes on second click
- [x] Click outside still closes dropdown
- [x] Desktop version unaffected
- [x] No console errors
- [x] All existing tests pass
- [x] Clean, maintainable code

---

**Requirements Version**: 1.0
**Last Updated**: March 1, 2026
