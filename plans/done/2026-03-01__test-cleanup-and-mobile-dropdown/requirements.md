# Fix Test Cleanup & Mobile Dropdown - Detailed Requirements

**Plan**: Fix Test Cleanup & Mobile Dropdown Toggle Bugs
**Version**: 1.0
**Last Updated**: March 1, 2026

---

## Table of Contents

1. [Test Cleanup Requirements](#test-cleanup-requirements)
2. [Mobile Dropdown Requirements](#mobile-dropdown-requirements)
3. [Acceptance Criteria](#acceptance-criteria)

---

## Test Cleanup Requirements

### TC-1: Cleanup Hook Implementation

**Requirement**: Test files that create users must clean up after tests

**Acceptance Criteria**:
- [x] `login.spec.ts` has `afterAll` cleanup hook
- [x] `cleanupTestUser` helper imported
- [x] Created users tracked in array
- [x] Cleanup runs after all tests complete

---

### TC-2: Database Cleanup

**Requirement**: No test users/photos left in database after tests

**Acceptance Criteria**:
- [x] Test users deleted successfully
- [x] Test photos deleted successfully
- [x] No "sampah" (garbage) photos in gallery
- [x] Database remains clean

---

## Mobile Dropdown Requirements

### MD-1: Filter Dropdown Toggle

**Requirement**: Filter dropdown must close on second button click

**Acceptance Criteria**:
- [x] Click filter icon -> opens dropdown
- [x] Click filter icon again -> closes dropdown
- [x] Click outside -> closes dropdown
- [x] No race condition with `handleClickOutside`

---

### MD-2: Sort Dropdown Toggle

**Requirement**: Sort dropdown must close on second button click

**Acceptance Criteria**:
- [x] Click sort icon -> opens dropdown
- [x] Click sort icon again -> closes dropdown
- [x] Click outside -> closes dropdown
- [x] No race condition with `handleClickOutside`

---

### MD-3: Desktop Compatibility

**Requirement**: Desktop dropdowns must remain unaffected

**Acceptance Criteria**:
- [x] Desktop filter dropdown works correctly
- [x] Desktop sort dropdown works correctly
- [x] No regressions in desktop UI

---

## Acceptance Criteria Summary

### Test Cleanup (P0)
- [x] All test files that create users have cleanup hooks
- [x] No test users/photos left in database after tests
- [x] Cleanup verified locally

### Mobile Dropdown (P0)
- [x] Mobile dropdowns close on second click
- [x] Desktop dropdowns still work correctly
- [x] No regressions in UI/UX

### Test Execution (P0)
- [x] All E2E tests still pass (login tests: 4/4 passed)
- [x] No new test failures

---

**Requirements Version**: 1.0
**Last Updated**: March 1, 2026
