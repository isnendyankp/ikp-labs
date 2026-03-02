# Task: Fix E2E page.blur() API Issue (Part 2 - 5 Tests)

**Branch**: `fix/e2e-page-blur-api`
**Status**: In Progress
**Started**: 2026-03-02
**Priority**: High
**Estimated Time**: 30 minutes

## Objective

Fix 5 E2E tests that use invalid `page.blur()` API - should use `locator.blur()` instead.

## Problem Analysis

### Root Cause

`page.blur()` is NOT a valid Playwright API. The correct way is to call `.blur()` on a locator:

```typescript
// WRONG (invalid API)
await page.blur('input[name="email"]');

// CORRECT
await page.locator('input[name="email"]').blur();
```

### Affected Tests (5 total)

| # | Test Name | Line | Current Code |
|---|-----------|------|--------------|
| 1 | should show email validation error on blur | 23 | `page.blur('input[name="email"]')` |
| 2 | should show valid message for correct email | 60 | `page.blur('input[name="email"]')` |
| 3 | should clear error when user starts typing | 94 | `page.blur('input[name="email"]')` |
| 4 | should show error icon with error message | 233 | `page.blur('input[name="email"]')` |
| 5 | should show success icon with valid message | 249 | `page.blur('input[name="email"]')` |

### File to Modify

- `tests/e2e/ux-validation.spec.ts`

## Solution Plan

### Phase 1: Fix Tests ✅
- [ ] Replace all `page.blur('input[name="email"]')` with `page.locator('input[name="email"]').blur()`
- [ ] Remove `test.fixme()` from all 5 tests
- [ ] Remove FIXME comments

### Phase 2: Test Locally
- [ ] Ensure PostgreSQL running (port 5432)
- [ ] Ensure Backend running (port 8081)
- [ ] Ensure Frontend running (port 3002)
- [ ] Run: `npx playwright test tests/e2e/ux-validation.spec.ts --project=chromium`
- [ ] Verify all 5 previously fixme tests now pass

### Phase 3: Documentation & Commit
- [ ] Update this plan with test results
- [ ] Create multiple commits for GitHub activity

### Phase 4: Push & PR
- [ ] Push to branch
- [ ] Create PR to main
- [ ] Wait for CI checks
- [ ] Merge with Rebase and Merge

## Expected Code Changes

### Before
```typescript
test("should show email validation error on blur", async ({ page }) => {
  test.fixme();
  // ...
  await page.blur('input[name="email"]');
  // ...
});
```

### After
```typescript
test("should show email validation error on blur", async ({ page }) => {
  // ...
  await page.locator('input[name="email"]').blur();
  // ...
});
```

## Success Criteria
- [ ] All 5 tests no longer have `test.fixme()`
- [ ] All 5 tests use correct `locator.blur()` API
- [ ] All tests pass locally
- [ ] CI checks pass after PR

## Test Results

### Local Test Execution
**Date**: 2026-03-02
**Command**: `npx playwright test tests/e2e/ux-validation.spec.ts --project=chromium`
**Result**: ✅ **All 5 Part 2 tests PASSED**

| # | Test Name | Result |
|---|----------|--------|
| 1 | should show email validation error on blur | ✅ PASSED |
| 2 | should show valid message for correct email | ✅ PASSED |
| 3 | should clear error when user starts typing | ✅ PASSED |
| 4 | should show error icon with error message | ✅ PASSED |
| 5 | should show success icon with valid message | ✅ PASSED |

**Note**: Other tests in the file still have `test.fixme()` from Part 3 (selector mismatch issue) - those will be addressed in a separate PR.

## Commits Created
_Pending implementation_

## Notes
- This is Part 2 of 6 parts for fixing 58 skipped E2E tests
- Difficulty: Easy (simple API replacement)
- No frontend code changes needed
