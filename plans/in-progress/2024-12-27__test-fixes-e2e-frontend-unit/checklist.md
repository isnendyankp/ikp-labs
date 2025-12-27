# Test Fixes - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: Planning & Documentation ✅

### Task 1.1: Create Plan Structure
- [✅] Create plan folder: `plans/in-progress/2024-12-27__test-fixes-e2e-frontend-unit/`
- [✅] Create README.md (overview)
- [✅] Create requirements.md (detailed requirements)
- [✅] Create technical-design.md (architecture & patterns)
- [✅] Create checklist.md (this file)
- [✅] **COMMIT 1**: "docs: add test fixes (E2E + Frontend Unit) plan"

**Acceptance Criteria**:
- [✅] All plan files created
- [✅] Plan follows same structure as gallery-centric-navigation plan
- [✅] Requirements and design are clear

---

## Phase 2: E2E Test Fixes (Priority 1)

### Task 2.1: Port Configuration Fix (2 min)
**Affected Tests**: 2 scenarios
**Files to Modify**:
- `frontend/playwright.config.ts` or similar
- Step definitions using hardcoded port

**Steps**:
1. [ ] Locate Playwright configuration file
2. [ ] Identify hardcoded `http://localhost:3000` references
3. [ ] Update to use environment variable or port 3002
4. [ ] Update step definitions to use relative URLs (e.g., `/login` instead of `http://localhost:3000/login`)
5. [ ] Test: Run affected scenarios
6. [ ] Verify: Both port-related failures now pass
7. [ ] **COMMIT 2**: "fix(e2e): update port configuration from 3000 to 3002"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] No more `ERR_CONNECTION_REFUSED` errors
- [ ] Tests connect to correct frontend server (port 3002)
- [ ] Port configurable via environment variable

---

### Task 2.2: Validation Display Fix (30 min)
**Affected Tests**: 5 scenarios (empty fields, invalid email, password mismatch, etc.)
**Files to Modify**:
- Step definitions for validation checks
- Possibly feature files (Gherkin scenarios)

**Steps**:
1. [ ] Identify failing validation scenarios:
   - Empty email validation
   - Invalid email format validation
   - Password mismatch validation
   - Other field validations
2. [ ] Update step definitions to submit form before checking validation:
   ```typescript
   // Add "When I submit the form" step before validation checks
   When('I submit the form', async function() {
     await this.page.click('button[type="submit"]');
   });
   ```
3. [ ] Update Gherkin scenarios to include form submission:
   ```gherkin
   When I enter email "invalid"
   And I submit the form  # <-- Add this line
   Then I should see validation error "Please enter a valid email"
   ```
4. [ ] Add proper wait conditions for validation messages to appear:
   ```typescript
   await expect(this.page.locator(`text=${errorMsg}`)).toBeVisible({ timeout: 5000 });
   ```
5. [ ] Test each validation scenario:
   - [ ] Empty email
   - [ ] Invalid email format
   - [ ] Password too short
   - [ ] Password mismatch
   - [ ] Empty required fields
6. [ ] Verify: All 5 validation scenarios now pass
7. [ ] **COMMIT 3**: "fix(e2e): update validation tests to submit form before checking errors"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Tests submit form before expecting validation
- [ ] Validation messages appear and are detected
- [ ] No false negatives (tests still catch real validation bugs)

---

### Task 2.3: Google OAuth Mock Fix (30 min)
**Affected Tests**: 2 scenarios
**Files to Modify**:
- Step definitions for Google OAuth
- Possibly test setup/fixtures

**Steps**:
1. [ ] Identify failing Google OAuth scenarios
2. [ ] Inspect actual UI for Google login button:
   - [ ] Open login page in browser
   - [ ] Check if Google button exists
   - [ ] Note current button selector (class, text, data-testid)
3. [ ] Check test step definition for Google OAuth:
   ```typescript
   When('I click the Google login button', async function() {
     // What selector is currently used?
   });
   ```
4. [ ] Update selector to match current UI:
   ```typescript
   // Option 1: Use data-testid (recommended)
   await this.page.click('[data-testid="google-login-btn"]');

   // Option 2: Use text content
   await this.page.click('button:has-text("Sign in with Google")');

   // Option 3: Use CSS class
   await this.page.click('.google-oauth-btn');
   ```
5. [ ] If button requires OAuth mock setup:
   ```typescript
   await this.page.route('**/auth/google/callback', async route => {
     await route.fulfill({
       status: 200,
       body: JSON.stringify({ token: 'mock-jwt-token' }),
     });
   });
   ```
6. [ ] Test: Run Google OAuth scenarios
7. [ ] Verify: Both scenarios now pass
8. [ ] Take screenshot on failure for debugging (if still failing)
9. [ ] **COMMIT 4**: "fix(e2e): update Google OAuth button selector and mock setup"
10. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Tests find Google OAuth button
- [ ] Mock OAuth flow works
- [ ] Tests document how to update mock in future

---

### Task 2.4: Password Visibility Timing Fix (15 min)
**Affected Tests**: 1 scenario
**Files to Modify**:
- Step definitions for password visibility toggle

**Steps**:
1. [ ] Identify failing password visibility scenario
2. [ ] Locate step definition for visibility toggle:
   ```typescript
   When('I click the password visibility toggle', async function() {
     await this.page.click('[data-testid="toggle-password-visibility"]');
   });
   ```
3. [ ] Add proper wait condition after toggle click:
   ```typescript
   When('I click the password visibility toggle', async function() {
     await this.page.click('[data-testid="toggle-password-visibility"]');

     // Wait for React state update
     await this.page.waitForFunction(() => {
       const field = document.querySelector<HTMLInputElement>('[name="password"]');
       return field?.type === 'text';  // Wait for type to change
     }, { timeout: 2000 });
   });
   ```
   Or use waitForSelector:
   ```typescript
   await this.page.click('[data-testid="toggle-password-visibility"]');
   await this.page.waitForSelector('[name="password"][type="text"]', { timeout: 2000 });
   ```
4. [ ] Update "Then" step to verify field type:
   ```typescript
   Then('the password should be visible', async function() {
     const fieldType = await this.page.getAttribute('[name="password"]', 'type');
     expect(fieldType).toBe('text');
   });
   ```
5. [ ] Test: Run password visibility scenario
6. [ ] Verify: Scenario now passes reliably (no flakiness)
7. [ ] **COMMIT 5**: "fix(e2e): add wait condition for password visibility toggle"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Test waits for React state update
- [ ] Test verifies correct field type
- [ ] No arbitrary sleeps used
- [ ] Test is reliable (not flaky)

---

### Task 2.5: E2E Test Verification (15 min)
**Goal**: Confirm all 21 scenarios pass

**Steps**:
1. [ ] Run full E2E test suite: `npm run test:cucumber`
2. [ ] Verify results:
   - [ ] 21 scenarios pass
   - [ ] 0 scenarios fail
   - [ ] Total steps: ~111 (all passing)
3. [ ] If any failures remain:
   - [ ] Investigate failure
   - [ ] Create fix task (follow atomic commit pattern)
   - [ ] Test again
4. [ ] Run tests 3 times to check for flakiness:
   - [ ] Run 1: All pass
   - [ ] Run 2: All pass
   - [ ] Run 3: All pass
5. [ ] Document test execution time (should be < 5 min)
6. [ ] **COMMIT 6** (if additional fixes needed): "fix(e2e): resolve remaining test failures"
7. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] 100% E2E pass rate (21/21 scenarios)
- [ ] No flaky tests
- [ ] Test execution time < 5 minutes

---

## Phase 3: Frontend Unit Test Fixes (Priority 2)

### Task 3.1: Run Frontend Unit Tests (5 min)
**Goal**: Identify current unit test status

**Steps**:
1. [ ] Navigate to frontend directory: `cd frontend`
2. [ ] Run Jest tests: `npm test` or `npm run test`
3. [ ] Observe results:
   - [ ] How many tests exist?
   - [ ] How many pass?
   - [ ] How many fail?
   - [ ] What are the failure messages?
4. [ ] Document failures:
   - [ ] Snapshot mismatches
   - [ ] Selector issues
   - [ ] Mock errors
   - [ ] Other errors
5. [ ] Take screenshot of test output for reference

**Acceptance Criteria**:
- [ ] Unit tests executed
- [ ] Failures documented
- [ ] Ready to fix issues

---

### Task 3.2: Fix Unit Test Failures (10 min)
**Files to Modify**: Depends on failures found in Task 3.1

**Common Fixes**:

**Fix 1: Update Snapshots** (if UI changed intentionally)
```bash
npm test -- -u  # Update all snapshots
```

**Fix 2: Update Selectors** (if component markup changed)
```typescript
// ❌ BEFORE (Fragile)
screen.getByText('Submit');

// ✅ AFTER (Robust)
screen.getByRole('button', { name: /submit/i });
```

**Fix 3: Update API Mocks** (if API interface changed)
```typescript
jest.mock('../services/api', () => ({
  loginUser: jest.fn(() => Promise.resolve({ data: { token: 'mock-token' } })),
}));
```

**Steps**:
1. [ ] Fix snapshot tests (if applicable):
   - [ ] Review snapshot changes
   - [ ] Update if intentional: `npm test -- -u`
2. [ ] Fix selector issues (if applicable):
   - [ ] Replace fragile selectors with role-based queries
   - [ ] Use `getByRole`, `getByLabelText` instead of `getByText`
3. [ ] Fix mock issues (if applicable):
   - [ ] Update mocks to match current API
   - [ ] Verify mock return values
4. [ ] Run tests again: `npm test`
5. [ ] Verify: All tests pass
6. [ ] **COMMIT 7**: "fix(unit): update frontend unit tests (snapshots/selectors/mocks)"
7. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All frontend unit tests pass
- [ ] No outdated snapshots
- [ ] Mocks reflect current API

---

### Task 3.3: Verify Test Coverage (Optional - 5 min)
**Goal**: Ensure test coverage remains high

**Steps**:
1. [ ] Run tests with coverage: `npm test -- --coverage`
2. [ ] Check coverage metrics:
   - [ ] Statements: > 80%
   - [ ] Branches: > 70%
   - [ ] Functions: > 80%
   - [ ] Lines: > 80%
3. [ ] If coverage dropped significantly:
   - [ ] Identify uncovered code
   - [ ] Add missing tests (create separate task)
4. [ ] Document coverage results

**Acceptance Criteria**:
- [ ] Coverage meets thresholds
- [ ] No critical paths uncovered

---

## Phase 4: Documentation & Cleanup

### Task 4.1: Add Test Documentation (10 min)
**Files to Create/Update**:
- `frontend/tests/README.md` (if doesn't exist)

**Steps**:
1. [ ] Create or update test README
2. [ ] Document how to run tests:
   ```markdown
   # Running Tests

   ## E2E Tests (Cucumber + Playwright)
   ```bash
   cd frontend
   npm run test:cucumber
   ```

   ## Unit Tests (Jest)
   ```bash
   cd frontend
   npm test
   ```

   ## Configuration
   - Frontend runs on port 3002
   - Backend runs on port 8081
   - Update `playwright.config.ts` for port changes
   ```
3. [ ] Document common patterns:
   - Wait conditions (no arbitrary sleeps)
   - Form submission before validation checks
   - Selector best practices (data-testid, roles)
4. [ ] Add troubleshooting section:
   - Port conflicts
   - Test flakiness
   - Mock setup issues
5. [ ] **COMMIT 8**: "docs: add test documentation and troubleshooting guide"
6. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Test README exists
- [ ] Running instructions clear
- [ ] Common patterns documented

---

### Task 4.2: Update Plan Status to Complete
**Files to Modify**:
- `plans/in-progress/2024-12-27__test-fixes-e2e-frontend-unit/README.md`
- `plans/in-progress/2024-12-27__test-fixes-e2e-frontend-unit/checklist.md`

**Steps**:
1. [ ] Update README.md:
   - [ ] Change status from "⏳ In Progress" to "✅ Completed"
   - [ ] Add completion date
2. [ ] Update checklist.md:
   - [ ] Mark all tasks as completed
   - [ ] Update status legend
3. [ ] Move plan folder to done:
   ```bash
   git mv plans/in-progress/2024-12-27__test-fixes-e2e-frontend-unit plans/done/
   ```
4. [ ] **COMMIT 9**: "docs: mark test fixes plan as completed"
5. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Plan marked as complete
- [ ] Plan moved to done folder
- [ ] All documentation updated

---

## Phase 5: Final Verification

### Task 5.1: Full Test Suite Run
**Goal**: Confirm all tests pass end-to-end

**Steps**:
1. [ ] Clean environment:
   - [ ] Stop all running servers
   - [ ] Clear browser cache
   - [ ] Clear test artifacts
2. [ ] Start fresh servers:
   ```bash
   # Terminal 1: Backend
   cd backend/ikp-labs-api && mvn spring-boot:run

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```
3. [ ] Run E2E tests: `cd frontend && npm run test:cucumber`
4. [ ] Run unit tests: `cd frontend && npm test`
5. [ ] Verify results:
   - [ ] E2E: 21/21 scenarios pass
   - [ ] Unit: All tests pass
6. [ ] Take screenshots of green test results
7. [ ] Celebrate! 🎉

**Acceptance Criteria**:
- [ ] 100% E2E pass rate
- [ ] 100% Unit test pass rate
- [ ] Tests run reliably

---

## Atomic Commit Summary

**Expected Commits (~9)**:
1. docs: add test fixes (E2E + Frontend Unit) plan
2. fix(e2e): update port configuration from 3000 to 3002
3. fix(e2e): update validation tests to submit form before checking errors
4. fix(e2e): update Google OAuth button selector and mock setup
5. fix(e2e): add wait condition for password visibility toggle
6. fix(e2e): resolve remaining test failures (if any)
7. fix(unit): update frontend unit tests (snapshots/selectors/mocks)
8. docs: add test documentation and troubleshooting guide
9. docs: mark test fixes plan as completed

**Commit Pattern**:
- Each task = 1 focused commit
- Push immediately after each commit (atomic push)
- Clear, descriptive commit messages
- Easy rollback if needed

---

## Success Criteria Summary

### Must Have (P0)
- [✅] E2E Tests: 21/21 pass (100%)
- [ ] Frontend Unit Tests: All pass (100%)
- [ ] No test flakiness (3 consecutive passes)
- [ ] Test execution time < 5 min total

### Should Have (P1)
- [ ] Test documentation complete
- [ ] Troubleshooting guide added
- [ ] Common patterns documented

### Nice to Have (P2)
- [ ] Test coverage > 80%
- [ ] Performance benchmarks
- [ ] CI/CD integration notes

---

## Notes

### Time Estimates
- **E2E Fixes**: ~1.5 hours
  - Port config: 2 min
  - Validation: 30 min
  - OAuth: 30 min
  - Timing: 15 min
  - Verification: 15 min
- **Unit Tests**: ~15 min
  - Run tests: 5 min
  - Fix failures: 10 min
- **Documentation**: ~15 min

**Total**: ~2 hours

### Atomic Commit Reminders
- ✅ 1 task = 1 commit + 1 push
- ✅ Explain each commit to user (as if beginner)
- ✅ Keep commits focused (single responsibility)
- ✅ Push immediately (GitHub activity visibility)

---

**Checklist Version**: 1.0
**Last Updated**: December 27, 2024
**Status**: Ready to Execute
