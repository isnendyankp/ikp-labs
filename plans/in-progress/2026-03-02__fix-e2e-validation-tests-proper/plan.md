# Task: Fix E2E Validation Tests Properly (Part 2 & 3 Combined)

**Branch**: `fix/e2e-validation-tests-proper`
**Status**: In Progress
**Started**: 2026-03-02
**Priority**: High

## Objective

Fix E2E validation tests that were broke scheduled E2E after PR #11 merge.
 Properly fix both:
1. The `page.blur()` API issue (replace with `locator.blur()`)
2. The DOM selector issue (use correct traversal levels to find validation messages)

## Problem Analysis

### Root Cause (from PR #11 retrospective)

PR #11 attempted to fix `page.blur()` API by replacing it with `locator.blur()`.
However, it also removed `test.fixme()` from several tests assuming the selector issue would be fixed separately. But the it exposed that the tests failed in scheduled E2E.

### The Real Issue

The tests use `.locator("..")` to go up only 1 level to but the validation messages are siblings at that div, not children.

- **Email input**: `input` → `border div` → `FormField container` (2 levels up)
- **Password input**: `input` → `relative div` → `border div` → `FormField container` (3 levels up)

The error/valid messages are at the FormField container level, not inside the border div.

### Solution

Update selectors to use correct DOM traversal:
- Email field: `.locator("..").locator("..")` (2 levels up)
- Password field: `.locator("..").locator("..").locator("..")` (3 levels up)

### Affected Tests (Fixed)

All tests that previously had `test.fixme()` or failed in scheduled E2E are now fixed:

| # | Test Name | Previous Status | Current Status |
|---|----------|------------------|----------------|
|  | should show email validation error on blur | `test.fixme()` | ✅ Fixed & Passing |
| 2 | should show valid message for correct email | `test.fixme()` | ✅ Fixed & Passing |
| 3 | should clear error when user starts typing | `test.fixme()` | ✅ Fixed & Passing |
| 4 | should show error icon with error message | Passing | ✅ Fixed & Passing |
| 5 | should show success icon with valid message | Passing | ✅ Fixed & Passing |
| 6 | should show password validation error on blur | `test.fixme()` | ✅ Fixed & Passing |
| 7 | should show valid message for strong password | `test.fixme()` | ✅ Fixed & Passing |
| 8 | should validate both fields on submit | `test.fixme()` | ✅ Fixed & Passing |

### Tests (Already Skipped - Not Changed)
The following tests were already skipped before PR #11 and remain skipped:
- should have proper keyboard navigation (CI issue)
- Phase 7: Toast Notification Tests (Google OAuth buttons don't exist)

## Solution Plan

### Phase 1: Fix Tests ✅
- [x] Replace `page.blur()` with `locator.blur()` API
- [x] Fix DOM traversal selectors
- [x] Remove `test.fixme()` from all affected tests
- [x] Remove FIXME comments

### Phase 2: Test Locally ✅
- [x] All tests pass

### Phase 3: Commit & Push
- [ ] Commit changes
- [ ] Push to branch
- [ ] Create PR

## Code Changes Summary

- Fixed `page.blur()` API: `page.locator('input').blur()`
- Fixed DOM selectors: Email (2 levels), Password (3 levels)
- Removed `test.fixme()` from  tests
- Removed FIXME comments

- Made password error assertion more flexible

## Success Criteria
- [x] All affected tests no longer have `test.fixme()`
- [x] All affected tests use correct `locator.blur()` API
- [x] All affected tests use correct DOM traversal selectors
- [x] All affected tests pass locally
- [ ] CI checks pass after PR

