# Fix E2E page.blur() API Issue (Part 2 - 5 Tests)

**Status**: Completed
**Created**: March 2, 2026
**Priority**: High
**Type**: Bug Fix

---

## Overview

Fix 5 E2E tests that use invalid `page.blur()` API - should use `locator.blur()` instead.

## Problem Statement

`page.blur()` is NOT a valid Playwright API. The correct way is to call `.blur()` on a locator:

```typescript
// WRONG (invalid API)
await page.blur('input[name="email"]');

// CORRECT
await page.locator('input[name="email"]').blur();
```

## Proposed Solution

Replace all `page.blur('input[name="email"]')` with `page.locator('input[name="email"]').blur()` and remove `test.fixme()` from all 5 tests.

## Scope

### In-Scope
- Fix tests in `tests/e2e/ux-validation.spec.ts`
- Use correct `locator.blur()` API

### Out-of-Scope
- Other test files (no frontend code changes needed)

## Success Criteria

- [x] All 5 tests no longer have `test.fixme()`
- [x] All 5 tests use correct `locator.blur()` API
- [x] All tests pass locally
- [x] CI checks pass after PR

## Final Results

### Test Execution Summary
**Date**: 2026-03-02
**Command**: `npx playwright test tests/e2e/ux-validation.spec.ts --project=chromium`
**Result**: All 5 Part 2 tests PASSED

**Note**: Other tests in the file still have `test.fixme()` from Part 3 (selector mismatch issue) - those will be addressed in a separate PR.

## Files Overview

- [requirements.md](./requirements.md) - Detailed test requirements
- [technical-design.md](./technical-design.md) - Technical implementation details
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

---

**Plan Version**: 1.0
**Last Updated**: March 2, 2026
**Status**: Completed
