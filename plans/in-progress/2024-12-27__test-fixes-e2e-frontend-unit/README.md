# Test Fixes - E2E & Frontend Unit Tests

**Feature ID**: 2024-12-27__test-fixes-e2e-frontend-unit
**Status**: ⏳ In Progress
**Created**: December 27, 2024
**Type**: Testing / Quality Assurance

## Overview

This plan focuses on fixing pre-existing test failures in the **E2E (Cucumber/Playwright)** and **Frontend Unit Tests (Jest)** to achieve 100% pass rate for user-facing test suites. These fixes address technical debt accumulated during rapid feature development.

## Context

After implementing the gallery-centric navigation feature, comprehensive test analysis revealed:
- **Backend Unit Tests**: ✅ 100% PASS (87 tests - GalleryService, AuthService, etc.)
- **E2E Tests**: ❌ 33% pass (7/21 scenarios - 14 pre-existing failures)
- **Frontend Unit Tests**: ⚠️ Not verified yet (Jest tests exist but not run recently)
- **Backend Integration/API Tests**: ❌ 92% pass (23 pre-existing failures - deferred to next week)

**Key Finding**: Navigation changes introduced **ZERO test regressions** - all failures are pre-existing issues.

## Goals

### Primary Objectives
1. **Fix E2E Tests**: Achieve 100% E2E scenario pass rate (21/21 scenarios)
2. **Verify Frontend Unit Tests**: Run Jest tests and fix any failures
3. **Maintain Test Quality**: Ensure tests validate real user behavior, not implementation details

### Success Metrics
- E2E Tests: 7/21 → **21/21 PASS** (100%)
- Frontend Unit Tests: Unknown → **All PASS**
- Execution Time: < 2 hours total
- Zero new regressions introduced

## Scope

### In Scope (This Week - Option A)
✅ **E2E Tests** (Priority 1 - 1.5 hours):
- Port configuration fixes (3000 → 3002)
- Validation display expectation updates
- Google OAuth mock setup
- Password visibility timing fixes

✅ **Frontend Unit Tests** (Priority 2 - 15 min):
- Run `npm test` (Jest)
- Fix any failures
- Verify LoginForm.test.tsx passes

### Out of Scope (Deferred to Next Week - Option B)
⏸️ **Backend Integration Tests**:
- UserRepositoryTest (17 NoClassDefFound errors)
- Other repository test class loading issues

⏸️ **Backend API Tests** (Controller Mocks):
- GalleryControllerTest (6 NullPointer errors)
- UserControllerTest mock setup
- ProfileControllerTest mock setup

## Pre-existing Issues to Fix

### E2E Test Failures (14 scenarios)

#### 1. Port Configuration (2 failures)
**Issue**: Tests hardcoded to port 3000, but frontend runs on 3002
**Error**: `net::ERR_CONNECTION_REFUSED at http://localhost:3000/login`
**Fix**: Update test configuration to use port 3002
**Time**: 2 minutes

#### 2. Validation Display (5 failures)
**Issue**: Tests expect validation errors to appear immediately, but frontend triggers on submit
**Error**: `expect(locator).toBeVisible() failed - Locator: text=Please enter a valid email`
**Fix**: Update test expectations to submit form before checking validation
**Time**: 30 minutes

#### 3. Google OAuth Mock (2 failures)
**Issue**: Mock Google OAuth button not detected in tests
**Error**: Test expects Google button but can't find it
**Fix**: Update mock setup or test selectors
**Time**: 30 minutes

#### 4. Password Visibility Toggle (1 failure)
**Issue**: UI timing issue when toggling password visibility
**Error**: Test clicks too fast before React state updates
**Fix**: Add proper wait conditions
**Time**: 15 minutes

### Frontend Unit Test Status
**Status**: Unknown - needs verification
**Action**: Run `npm test` and address failures
**Estimated Time**: 15 minutes

## Features

### 1. E2E Test Fixes
- Fix port configuration in Playwright config
- Update validation test expectations
- Fix Google OAuth mock detection
- Add proper wait conditions for UI state changes

### 2. Frontend Unit Test Verification
- Run Jest test suite
- Fix any component test failures
- Verify LoginForm tests pass
- Add missing tests if coverage low

### 3. Test Documentation
- Document test patterns for future developers
- Add comments explaining wait conditions
- Update test README if needed

## Technical Approach

### E2E Tests (Cucumber/Playwright)
**Test Location**: `frontend/tests/gherkin/features/`
**Command**: `npm run test:cucumber`

**Fix Strategy**:
1. Port config: Update Playwright config or env vars
2. Validation: Update step definitions to submit form first
3. OAuth: Fix mock button selector or visibility
4. Timing: Add `await page.waitForSelector()` where needed

### Frontend Unit Tests (Jest)
**Test Location**: `frontend/src/components/__tests__/`
**Command**: `npm test`

**Fix Strategy**:
1. Run tests to identify failures
2. Fix any outdated snapshot tests
3. Update component mocks if needed
4. Verify coverage remains > 80%

## Success Criteria

### Functional
- [ ] All 21 E2E scenarios pass
- [ ] All frontend unit tests pass
- [ ] No test flakiness (consistent pass/fail)
- [ ] Tests run in reasonable time (< 5 min total)

### Code Quality
- [ ] Tests validate user behavior, not implementation
- [ ] Proper wait conditions (no arbitrary sleeps)
- [ ] Clear test descriptions
- [ ] No hardcoded values (use config/env)

### Documentation
- [ ] Test patterns documented
- [ ] Common issues noted in README
- [ ] Team knows how to run tests locally

## Dependencies

### Internal
- Gallery-centric navigation feature (completed)
- Existing E2E test framework
- Existing Jest test setup

### External
- Playwright (E2E testing)
- Cucumber (BDD framework)
- Jest (unit testing)
- React Testing Library

## Timeline

**Estimated Duration**: 1 development session (~2 hours)

**Phases**:
1. ✅ Planning & Documentation (Completed)
2. ⏳ E2E Test Fixes (1.5 hours)
3. ⏳ Frontend Unit Test Verification (15 min)
4. ⏳ Final Validation (15 min)

## Documentation

- [Requirements](./requirements.md) - Detailed test fix requirements
- [Technical Design](./technical-design.md) - Test architecture and patterns
- [Checklist](./checklist.md) - Step-by-step fix tasks

## Related Plans

- Gallery-Centric Navigation (2024-12-22) - Feature that triggered test verification
- E2E Gallery Tests (2024-12-08) - Original E2E test setup
- Unit Testing (2024-11-04) - Initial unit test framework

## Notes

### Why Skip Backend Tests This Week?
**ROI Analysis**:
- Backend unit tests already 100% PASS ✅
- E2E tests validate full stack (including backend)
- Integration/API test failures are mock setup issues (low user impact)
- Fixing E2E = higher user value per hour invested

**Backend tests deferred to next week** as separate technical debt cleanup plan.

### Test Philosophy
- **E2E Tests**: Validate real user workflows (login, navigation, interactions)
- **Unit Tests**: Validate component logic in isolation
- **Integration Tests**: Validate database + service layer (already covered by E2E)

### Atomic Commit Strategy
Each fix type = 1 atomic commit:
- E2E port config fix
- E2E validation fix
- E2E OAuth fix
- E2E timing fix
- Frontend unit test fixes
- Plan completion

---

**Last Updated**: December 27, 2024
**Status**: Ready to Execute
**Next Step**: Begin E2E test fixes (Phase 2)
