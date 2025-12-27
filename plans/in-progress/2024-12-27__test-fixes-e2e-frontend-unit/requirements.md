# Test Fixes - Requirements Document

## 1. Problem Statement

### Current Situation
After implementing the gallery-centric navigation feature and running comprehensive test verification, we discovered:

**E2E Test Results** (Cucumber/Playwright):
- **Pass Rate**: 33% (7/21 scenarios)
- **Failed**: 14 scenarios
- **Status**: All failures are **pre-existing** (not caused by navigation changes)

**Frontend Unit Test Results** (Jest):
- **Status**: Not run recently
- **Known Tests**: `LoginForm.test.tsx` exists
- **Risk**: Unknown if tests still pass

**Backend Test Results**:
- **Unit Tests**: ✅ 100% PASS (87 tests - service layer)
- **Integration Tests**: ⏸️ Deferred (pre-existing mock issues)
- **API Tests**: ⏸️ Deferred (pre-existing controller mock issues)

### Impact
- **Development Velocity**: Slow - Can't trust failing tests to catch regressions
- **Code Confidence**: Low - Unclear if new changes break anything
- **Team Morale**: Medium - Frustrated by "boy who cried wolf" test failures
- **Production Risk**: Medium - No safety net for user-facing features

### Root Causes
1. **Rapid Feature Development**: Tests not kept in sync with UI changes
2. **Mock Configuration Drift**: Google OAuth mock setup outdated
3. **Hardcoded Values**: Port 3000 hardcoded, but dev server runs on 3002
4. **Timing Assumptions**: Tests assume instant React state updates
5. **Validation Patterns**: Tests expect validation before form submission

## 2. User Stories

### As a Developer
> "As a developer, I want all E2E tests to pass so that I can confidently ship features knowing user flows work correctly."

**Acceptance Criteria**:
- All 21 E2E scenarios pass consistently
- Test failures indicate real bugs, not test issues
- CI/CD pipeline shows green status

### As a QA Engineer
> "As a QA engineer, I want reliable automated tests so that I can focus on exploratory testing instead of debugging flaky tests."

**Acceptance Criteria**:
- Tests run without manual intervention
- Test results are deterministic (no flakiness)
- Test documentation explains common patterns

### As a Product Manager
> "As a product manager, I want high test coverage on user-facing features so that we can release with confidence and reduce production bugs."

**Acceptance Criteria**:
- Critical user flows (login, registration, gallery) have passing E2E tests
- Regression risk is minimized
- Team velocity increases due to test confidence

## 3. Functional Requirements

### FR-1: E2E Port Configuration Fix
**Priority**: P0 (Blocker)
**Scenarios Affected**: 2 failures

**Description**: Update test configuration to use correct frontend port

**Requirements**:
- [ ] Identify Playwright config file
- [ ] Update hardcoded port 3000 to 3002
- [ ] Or use environment variable for flexibility
- [ ] Verify all tests use updated configuration
- [ ] Document port configuration in test README

**Acceptance Criteria**:
- Tests connect to correct frontend server
- No more `ERR_CONNECTION_REFUSED` errors
- Port configurable via environment variable

---

### FR-2: Validation Display Expectation Fix
**Priority**: P0 (Blocker)
**Scenarios Affected**: 5 failures

**Description**: Update test expectations to match actual validation behavior

**Current Behavior**:
- Frontend: Validation triggers **on form submission**
- Tests: Expect validation **immediately after input**

**Requirements**:
- [ ] Identify failing validation test scenarios:
  - Empty field validation
  - Invalid email format validation
  - Password mismatch validation
  - Other field validation scenarios
- [ ] Update step definitions to submit form before checking validation
- [ ] Add proper wait conditions for error messages to appear
- [ ] Verify validation messages are actually user-visible

**Acceptance Criteria**:
- Validation tests submit form first
- Tests wait for validation messages to appear
- Tests verify correct validation messages
- No false negatives (missing real validation bugs)

---

### FR-3: Google OAuth Mock Fix
**Priority**: P1 (High)
**Scenarios Affected**: 2 failures

**Description**: Fix Google OAuth button mock detection in tests

**Current Issue**:
- Tests can't find Google OAuth login button
- Mock setup may be outdated
- Button selector may have changed

**Requirements**:
- [ ] Identify Google OAuth button in actual UI
- [ ] Verify button exists in test environment
- [ ] Update test selector if button markup changed
- [ ] Update mock setup if needed
- [ ] Add screenshot on failure for debugging

**Acceptance Criteria**:
- Tests can find Google OAuth button
- Mock click triggers expected behavior
- Tests document how to update mock in future

---

### FR-4: Password Visibility Timing Fix
**Priority**: P2 (Medium)
**Scenarios Affected**: 1 failure

**Description**: Fix timing issue when toggling password visibility

**Current Issue**:
- Test clicks visibility toggle button
- Test immediately checks password field type
- React state hasn't updated yet → Test fails

**Requirements**:
- [ ] Identify password visibility toggle tests
- [ ] Add proper wait condition after toggle click
- [ ] Wait for field type attribute to change
- [ ] Verify password text is actually visible/hidden

**Acceptance Criteria**:
- Test waits for React state update
- Test verifies correct field type (text vs password)
- No arbitrary `sleep()` calls - use proper waits
- Test is reliable and not flaky

---

### FR-5: Frontend Unit Test Verification
**Priority**: P1 (High)

**Description**: Run and fix frontend unit tests (Jest)

**Requirements**:
- [ ] Run `npm test` in frontend directory
- [ ] Identify all failing tests
- [ ] Fix component test failures:
  - Update snapshots if UI changed intentionally
  - Fix mock setup if APIs changed
  - Update test expectations if behavior changed
- [ ] Verify LoginForm.test.tsx passes
- [ ] Ensure test coverage remains > 80%

**Acceptance Criteria**:
- All Jest tests pass
- No outdated snapshots
- Test coverage maintained or improved
- Tests document component behavior clearly

---

## 4. Non-Functional Requirements

### NFR-1: Test Execution Speed
**Requirement**: Tests must run in reasonable time
**Target**: < 5 minutes for full E2E suite
**Rationale**: Long test runs reduce CI/CD velocity

**Acceptance Criteria**:
- E2E tests complete in < 5 minutes
- Unit tests complete in < 30 seconds
- No unnecessary waits or sleeps

---

### NFR-2: Test Reliability
**Requirement**: Tests must be deterministic (no flakiness)
**Target**: 100% pass rate on 3 consecutive runs
**Rationale**: Flaky tests erode trust and waste time

**Acceptance Criteria**:
- Tests pass 3 times in a row
- No random failures
- Proper wait conditions instead of arbitrary delays

---

### NFR-3: Test Maintainability
**Requirement**: Tests must be easy to update when features change
**Target**: Clear test structure, good documentation

**Acceptance Criteria**:
- Test selectors use data-testid attributes
- Step definitions are reusable
- Test documentation explains patterns
- Configuration centralized (ports, URLs, etc.)

---

### NFR-4: Test Documentation
**Requirement**: Tests must be documented for new team members

**Acceptance Criteria**:
- Test README explains how to run tests
- Common patterns documented (waits, mocks, selectors)
- Troubleshooting guide for common issues
- Examples of good test practices

---

## 5. Out of Scope

### Backend Integration Tests
**Reason**: Lower ROI - Backend unit tests already 100% PASS, E2E tests validate full stack

**Deferred to**: Next week (Option B plan)

**Issues**:
- UserRepositoryTest: 17 NoClassDefFound errors
- Class loading issues with test dependencies

---

### Backend API Tests (Controller Mocks)
**Reason**: Lower ROI - Real endpoints tested by E2E tests, mock setup tedious

**Deferred to**: Next week (Option B plan)

**Issues**:
- GalleryControllerTest: 6 NullPointer errors
- PhotoLikeService mock not configured
- UserControllerTest mock setup issues

---

### Performance Testing
**Reason**: Out of scope for this plan

**Note**: Performance covered by manual testing, not automated yet

---

### Accessibility Testing
**Reason**: Out of scope for this plan

**Note**: Basic accessibility covered by semantic HTML, not automated yet

---

## 6. Success Metrics

### Test Pass Rate
**Before**: 33% E2E, Unknown Unit
**After Target**: 100% E2E, 100% Unit

### Test Execution Time
**Before**: Unknown
**After Target**: < 5 min E2E, < 30 sec Unit

### Developer Confidence
**Before**: Low (can't trust failing tests)
**After Target**: High (tests catch real bugs)

### CI/CD Pipeline
**Before**: Red/Yellow (mixed results)
**After Target**: Green (all tests pass)

---

## 7. Risk Analysis

### Risk 1: Test Fixes Break Other Tests
**Probability**: Medium
**Impact**: Medium
**Mitigation**: Run full test suite after each fix, atomic commits

### Risk 2: Unforeseen Test Issues
**Probability**: Low
**Impact**: Medium
**Mitigation**: Time-boxed fixes (max 30 min per issue), defer if complex

### Risk 3: Environment Differences
**Probability**: Low
**Impact**: Low
**Mitigation**: Document environment requirements (Node version, browser version)

### Risk 4: Scope Creep
**Probability**: Medium
**Impact**: Low
**Mitigation**: Stick to Option A scope, defer backend tests to next week

---

## 8. Dependencies

### Internal Dependencies
- ✅ Gallery-centric navigation feature (completed)
- ✅ Existing test framework (Cucumber, Playwright, Jest)
- ✅ Frontend dev server running on port 3002

### External Dependencies
- Playwright (version: latest)
- Cucumber (version: latest)
- Jest (version: latest)
- Node.js (version: 18+)

### Team Dependencies
- Frontend developer (for test fixes)
- QA engineer (for test verification)

---

## 9. Timeline

### Phase 1: Planning (Completed)
**Duration**: 30 minutes
**Status**: ✅ Done

### Phase 2: E2E Test Fixes (This Week)
**Duration**: 1.5 hours
**Status**: ⏳ In Progress

**Breakdown**:
- Port config fix: 2 min
- Validation fixes: 30 min
- OAuth mock fix: 30 min
- Timing fix: 15 min
- Verification: 15 min

### Phase 3: Frontend Unit Tests (This Week)
**Duration**: 15 minutes
**Status**: ⏳ Pending

**Breakdown**:
- Run tests: 5 min
- Fix failures: 10 min

### Phase 4: Documentation & Cleanup (This Week)
**Duration**: 15 minutes
**Status**: ⏳ Pending

**Total**: ~2 hours

---

## 10. Approval & Sign-Off

**Plan Created By**: Claude (AI Assistant)
**Plan Reviewed By**: [Pending User Approval]
**Approved Date**: [Pending]

**Next Steps**:
1. Review and approve requirements
2. Proceed to technical design
3. Execute checklist tasks

---

**Document Version**: 1.0
**Last Updated**: December 27, 2024
**Status**: Ready for Review
