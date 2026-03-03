# Fix E2E Validation Tests Properly (Part 2 & 3 Combined)

**Status**: Completed
**Created**: March 2, 2026
**Priority**: High
**Type**: Bug Fix

---

## Overview
Fix E2E validation tests that were properly fixed for PR #12. Issues:
1. The `page.blur()` API issue (replace with `locator.blur()`)
2. The DOM selector issue (use correct traversal levels to find validation messages)

## Problem Statement
PR #11 attempted to fix `page.blur()` API but replacing it with `locator.blur()`. However, it also removed `test.fixme()` from several tests assuming the selector issue would be fixed separately. But it exposed that the tests failed in scheduled E2E.

## Proposed Solution
Update selectors to use correct DOM traversal:
- Email field: `.locator("..").locator("..")` (2 levels up)
- Password field: `.locator("..").locator("..").locator("..")` (3 levels up)

The error/valid messages are siblings at the FormField container level, not inside the border div.
## Scope
### In-Scope
- Fix `page.blur()` API: `page.locator('input').blur()`
- Fix DOM selectors: Email (2 levels), Password (3 levels)
- Remove `test.fixme()` from affected tests
- Remove FIXME comments

### Out-of-Scope
- Other test files
- Other E2E test suites

## Success Criteria
- [x] All affected tests no longer have `test.fixme()`
- [x] All affected tests use correct `locator.blur()` API
- [x] All affected tests use correct DOM traversal selectors
- [x] All affected tests pass locally
- [x] CI checks pass after PR (merged via PR #12)

## Final Results
### Test Execution Summary
**Local Tests**:
- **Total Tests**: 30
- **Passed**: 30
- **Failed**: 0
- **Status**: All tests passing
### Commits
This fix was merged as part of PR #12.

## Files Overview
- [requirements.md](./requirements.md) - Detailed test requirements
- [technical-design.md](./technical-design.md) - Technical implementation details
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

---

**Plan Version**: 1.0
**Last Updated**: March 2, 2026
**Status**: Completed (merged via PR #12)
