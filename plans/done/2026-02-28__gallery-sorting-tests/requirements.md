# Fix Gallery Sorting E2E Tests - Detailed Requirements

**Plan**: Fix Gallery Sorting E2E Tests
**Version**: 1.0
**Last Updated**: February 28, 2026

---

## Table of Contents

1. [Test Requirements](#test-requirements)
2. [Affected Tests](#affected-tests)
3. [Acceptance Criteria](#acceptance-criteria)

---

## Test Requirements

### REQ-1: Sort Dropdown Display

**Requirement**: Sort dropdown must be visible and accessible on gallery page

**Acceptance Criteria**:
- [x] Sort dropdown displays on main gallery page
- [x] Dropdown is visible on desktop viewport (1280x720)
- [x] Correct button is targeted (desktop, not mobile)

---

### REQ-2: Dropdown Interaction

**Requirement**: Dropdown must open and close correctly

**Acceptance Criteria**:
- [x] Open dropdown menu when clicked
- [x] Display all 4 sort options
- [x] Highlight selected option
- [x] Close dropdown when clicking outside
- [x] Close dropdown after selection
- [x] Maintain dropdown state across pages

---

### REQ-3: Dropdown Styling

**Requirement**: Dropdown must have correct visual styling

**Acceptance Criteria**:
- [x] Display dropdown with correct styling
- [x] Show hover effects
- [x] Proper z-index for dropdown layering

---

### REQ-4: Accessibility

**Requirement**: Dropdown must be accessible via keyboard

**Acceptance Criteria**:
- [x] Keyboard navigation accessibility

---

### REQ-5: Sorting Functionality

**Requirement**: Sorting must work correctly

**Acceptance Criteria**:
- [x] Sort photos by oldest first
- [x] Sort photos by most liked
- [x] Sort photos by most favorited
- [x] Update URL when sort selected
- [x] Load correct sort from direct URL

---

## Affected Tests

### 15 Tests (Previously Skipped)

| # | Test ID | Test Name | Status |
|---|---------|-----------|--------|
| 1 | SORT-001 | Display sort dropdown on main gallery page | Fixed |
| 2 | SORT-004 | Open dropdown menu when clicked | Fixed |
| 3 | SORT-005 | Display all 4 sort options | Fixed |
| 4 | SORT-006 | Highlight selected option | Fixed |
| 5 | SORT-007 | Close dropdown when clicking outside | Fixed |
| 6 | SORT-008 | Close dropdown after selection | Fixed |
| 7 | SORT-009 | Maintain dropdown state across pages | Fixed |
| 8 | SORT-010 | Display dropdown with correct styling | Fixed |
| 9 | SORT-011 | Show hover effects | Fixed |
| 10 | SORT-012 | Keyboard navigation accessibility | Fixed |
| 11 | SORT-014 | Sort photos by oldest first | Fixed |
| 12 | SORT-015 | Sort photos by most liked | Fixed |
| 13 | SORT-016 | Sort photos by most favorited | Fixed |
| 14 | SORT-017 | Update URL when sort selected | Fixed |
| 15 | SORT-019 | Load correct sort from direct URL | Fixed |

### 9 Tests (Already Passing)

These tests were already passing before the fix.

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [x] All 24 gallery-sorting tests pass locally
- [x] No visual regressions in UI
- [x] Good user experience maintained
- [x] Solution works in both local and CI environments

---

**Requirements Version**: 1.0
**Last Updated**: February 28, 2026
**Total Tests**: 24 (15 fixed + 9 already passing)
