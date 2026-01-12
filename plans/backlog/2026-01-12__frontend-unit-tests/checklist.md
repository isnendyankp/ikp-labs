# Frontend Unit Tests - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: Jest Setup (1-2 hours)

### Task 1.1: Install Dependencies (15 min)
**Estimated Time**: 15 minutes

**Packages to Install**:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @swc/jest
npm install --save-dev msw @mswjs/http-middleware
npm install --save-dev identity-obj-proxy
```

**Steps**:
1. [ ] Install all dependencies
2. [ ] Verify package.json updated
3. [ ] **COMMIT**: "test(fe): install Jest and testing dependencies"

**Acceptance Criteria**:
- [ ] All packages installed
- [ ] No installation errors
- [ ] package.json contains new dependencies

---

### Task 1.2: Create Jest Configuration (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `jest.config.js`
- `jest.setup.js`

**Steps**:
1. [ ] Create jest.config.js
2. [ ] Configure module aliases
3. [ ] Configure coverage thresholds
4. [ ] Create jest.setup.js
5. [ ] Add Next.js mocks
6. [ ] Add jest-dom import
7. [ ] **COMMIT**: "test(fe): configure Jest for Next.js + TypeScript"

**Acceptance Criteria**:
- [ ] Jest runs without errors
- [ ] Module aliases work
- [ ] Coverage thresholds set
- [ ] Next.js properly mocked

---

### Task 1.3: Create Test Utilities (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/test-utils.tsx`
- `__mocks__/fileMock.js`

**Steps**:
1. [ ] Create test-utils.tsx with custom render
2. [ ] Add provider wrappers
3. [ ] Re-export RTL utilities
4. [ ] Create fileMock.js for assets
5. [ ] **COMMIT**: "test(fe): create test utilities and mocks"

**Acceptance Criteria**:
- [ ] Custom render works
- [ ] Providers wrap components
- [ ] Assets are mocked correctly

---

### Task 1.4: Add Test Scripts (15 min)
**Estimated Time**: 15 minutes

**Files to Modify**:
- `package.json`

**Steps**:
1. [ ] Add "test" script
2. [ ] Add "test:watch" script
3. [ ] Add "test:coverage" script
4. [ ] Verify scripts work
5. [ ] **COMMIT**: "test(fe): add test scripts to package.json"

**Acceptance Criteria**:
- [ ] npm test works
- [ ] npm run test:watch works
- [ ] npm run test:coverage works

---

### Task 1.5: Verify Jest Setup (30 min)
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Create sample test file
2. [ ] Run Jest to verify
3. [ ] Check coverage report
4. [ ] Fix any issues
5. [ ] **COMMIT**: "test(fe): add sample test and verify setup"

**Acceptance Criteria**:
- [ ] Sample test passes
- [ ] Coverage report generates
- [ ] No configuration errors

---

## Phase 2: MSW Setup (1-2 hours)

### Task 2.1: Install MSW (15 min)
**Estimated Time**: 15 minutes

**Steps**:
1. [ ] Install MSW dependencies
2. [ ] **COMMIT**: "test(fe): install MSW for API mocking"

**Acceptance Criteria**:
- [ ] MSW installed
- [ ] No installation errors

---

### Task 2.2: Create MSW Handlers (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/mocks/handlers.ts`

**Steps**:
1. [ ] Create handlers for auth endpoints
2. [ ] Create handlers for gallery endpoints
3. [ ] Create handlers for profile endpoints
4. [ ] Create handlers for photo interactions
5. [ ] **COMMIT**: "test(fe): create MSW handlers for API mocking"

**Acceptance Criteria**:
- [ ] All endpoints have handlers
- [ ] Handlers return realistic data
- [ ] Error scenarios covered

---

### Task 2.3: Create MSW Server (15 min)
**Estimated Time**: 15 minutes

**Files to Create**:
- `src/mocks/server.ts`

**Steps**:
1. [ ] Create server with handlers
2. [ ] Export server instance
3. [ ] **COMMIT**: "test(fe): create MSW server instance"

**Acceptance Criteria**:
- [ ] Server exports correctly
- [ ] Can be started/stopped

---

### Task 2.4: Verify MSW Setup (30 min)
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Create test using MSW
2. [ ] Verify mock responses work
3. [ ] Verify error handling
4. [ ] **COMMIT**: "test(fe): verify MSW setup with sample test"

**Acceptance Criteria**:
- [ ] MSW mocks API calls
- [ ] Error scenarios work
- [ ] Tests pass reliably

---

## Phase 3: Utility Tests (1-2 hours)

### Task 3.1: Test Validation Utilities (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/utils/__tests__/validation.test.ts`

**Steps**:
1. [ ] Test validateEmail
2. [ ] Test validatePassword
3. [ ] Test validateRequired
4. [ ] Test edge cases
5. [ ] **COMMIT**: "test(fe): add validation utility tests"

**Acceptance Criteria**:
- [ ] All validation functions tested
- [ ] Edge cases covered
- [ ] 100% coverage

---

### Task 3.2: Test Formatting Utilities (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/utils/__tests__/formatting.test.ts`

**Steps**:
1. [ ] Test formatFileSize
2. [ ] Test formatDate
3. [ ] Test formatNumber
4. [ ] Test edge cases
5. [ ] **COMMIT**: "test(fe): add formatting utility tests"

**Acceptance Criteria**:
- [ ] All formatting functions tested
- [ ] Edge cases covered
- [ ] 100% coverage

---

### Task 3.3: Test URL Utilities (15 min)
**Estimated Time**: 15 minutes

**Files to Create**:
- `src/utils/__tests__/url.test.ts`

**Steps**:
1. [ ] Test URL building functions
2. [ ] Test query string functions
3. [ ] **COMMIT**: "test(fe): add URL utility tests"

**Acceptance Criteria**:
- [ ] All URL functions tested
- [ ] 100% coverage

---

## Phase 4: Component Tests (4-6 hours)

### Task 4.1: Test PhotoCard (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/components/__tests__/PhotoCard.test.tsx`

**Steps**:
1. [ ] Test renders correctly
2. [ ] Test shows photo info
3. [ ] Test like button click
4. [ ] Test favorite button click
5. [ ] Test delete button click
6. [ ] Test loading state
7. [ ] Test empty state
8. [ ] **COMMIT**: "test(fe): add PhotoCard component tests"

**Acceptance Criteria**:
- [ ] All interactions tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 4.2: Test LoginForm (60 min)
**Estimated Time**: 60 minutes

**Files to Create**:
- `src/app/login/__tests__/page.test.tsx`

**Steps**:
1. [ ] Test renders form fields
2. [ ] Test validation errors
3. [ ] Test email validation
4. [ ] Test password validation
5. [ ] Test form submission
6. [ ] Test loading state
7. [ ] Test success state
8. [ ] Test error state
9. [ ] Test show/hide password
10. [ ] **COMMIT**: "test(fe): add LoginForm component tests"

**Acceptance Criteria**:
- [ ] All form scenarios tested
- [ ] 85%+ coverage
- [ ] All tests pass

---

### Task 4.3: Test RegistrationForm (60 min)
**Estimated Time**: 60 minutes

**Files to Create**:
- `src/app/register/__tests__/page.test.tsx`

**Steps**:
1. [ ] Test renders form fields
2. [ ] Test validation errors
3. [ ] Test password matching
4. [ ] Test email validation
5. [ ] Test form submission
6. [ ] Test loading state
7. [ ] Test error handling
8. [ ] **COMMIT**: "test(fe): add RegistrationForm component tests"

**Acceptance Criteria**:
- [ ] All form scenarios tested
- [ ] 85%+ coverage
- [ ] All tests pass

---

### Task 4.4: Test ProfileForm (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/app/myprofile/__tests__/page.test.tsx`

**Steps**:
1. [ ] Test renders with user data
2. [ ] Test field updates
3. [ ] Test profile picture upload
4. [ ] Test form submission
5. [ ] Test validation
6. [ ] Test error handling
7. [ ] **COMMIT**: "test(fe): add ProfileForm component tests"

**Acceptance Criteria**:
- [ ] All form scenarios tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 4.5: Test FilterDropdown (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/components/__tests__/FilterDropdown.test.tsx`

**Steps**:
1. [ ] Test renders correctly
2. [ ] Test opens dropdown
3. [ ] Test selects option
4. [ ] Test closes on click outside
5. [ ] Test closes with ESC
6. [ ] **COMMIT**: "test(fe): add FilterDropdown component tests"

**Acceptance Criteria**:
- [ ] All interactions tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 4.6: Test SortByDropdown (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/components/__tests__/SortByDropdown.test.tsx`

**Steps**:
1. [ ] Test renders correctly
2. [ ] Test opens dropdown
3. [ ] Test selects option
4. [ ] Test closes on click outside
5. [ ] Test closes with ESC
6. [ ] **COMMIT**: "test(fe): add SortByDropdown component tests"

**Acceptance Criteria**:
- [ ] All interactions tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 4.7: Test Toast (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/components/__tests__/Toast.test.tsx`

**Steps**:
1. [ ] Test renders correctly
2. [ ] Test shows icon based on type
3. [ ] Test dismisses on click
4. [ ] Test auto-dismisses
5. [ ] Test pauses on hover
6. [ ] **COMMIT**: "test(fe): add Toast component tests"

**Acceptance Criteria**:
- [ ] All toast behaviors tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 4.8: Test ConfirmDialog (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/components/__tests__/ConfirmDialog.test.tsx`

**Steps**:
1. [ ] Test renders correctly
2. [ ] Test shows when isOpen
3. [ ] Test calls onConfirm
4. [ ] Test calls onCancel
5. [ ] Test closes with ESC
6. [ ] Test closes on click outside
7. [ ] **COMMIT**: "test(fe): add ConfirmDialog component tests"

**Acceptance Criteria**:
- [ ] All dialog behaviors tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

## Phase 5: Hook Tests (2-3 hours)

### Task 5.1: Test useToast (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/hooks/__tests__/useToast.test.ts`

**Steps**:
1. [ ] Test initializes with empty toasts
2. [ ] Test success adds toast
3. [ ] Test error adds toast
4. [ ] Test warning adds toast
5. [ ] Test info adds toast
6. [ ] Test removeToast works
7. [ ] Test auto-dismiss
8. [ ] **COMMIT**: "test(fe): add useToast hook tests"

**Acceptance Criteria**:
- [ ] All toast functions tested
- [ ] 90%+ coverage
- [ ] All tests pass

---

### Task 5.2: Test useAuth (60 min)
**Estimated Time**: 60 minutes

**Files to Create**:
- `src/hooks/__tests__/useAuth.test.ts`

**Steps**:
1. [ ] Test initializes with no user
2. [ ] Test login sets user
3. [ ] Test logout clears user
4. [ ] Test token storage
5. [ ] Test auto-login on mount
6. [ ] Test error handling
7. [ ] **COMMIT**: "test(fe): add useAuth hook tests"

**Acceptance Criteria**:
- [ ] All auth scenarios tested
- [ ] 90%+ coverage
- [ ] All tests pass

---

## Phase 6: Service Tests (2-3 hours)

### Task 6.1: Test authService (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/services/__tests__/authService.test.ts`

**Steps**:
1. [ ] Test login success
2. [ ] Test login failure
3. [ ] Test register success
4. [ ] Test register failure
5. [ ] Test logout
6. [ ] Test network errors
7. [ ] **COMMIT**: "test(fe): add authService tests"

**Acceptance Criteria**:
- [ ] All auth scenarios tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 6.2: Test galleryService (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/services/__tests__/galleryService.test.ts`

**Steps**:
1. [ ] Test getPublicPhotos
2. [ ] Test getUserPhotos
3. [ ] Test getLikedPhotos
4. [ ] Test getFavoritedPhotos
5. [ ] Test uploadPhoto
6. [ ] Test deletePhoto
7. [ ] Test error handling
8. [ ] **COMMIT**: "test(fe): add galleryService tests"

**Acceptance Criteria**:
- [ ] All service methods tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

### Task 6.3: Test profileService (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/services/__tests__/profileService.test.ts`

**Steps**:
1. [ ] Test getProfile
2. [ ] Test updateProfile
3. [ ] Test uploadProfilePicture
4. [ ] Test error handling
5. [ ] **COMMIT**: "test(fe): add profileService tests"

**Acceptance Criteria**:
- [ ] All service methods tested
- [ ] 80%+ coverage
- [ ] All tests pass

---

## Phase 7: Context Tests (1-2 hours)

### Task 7.1: Test ToastContext (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `src/context/__tests__/ToastContext.test.tsx`

**Steps**:
1. [ ] Test provides default values
2. [ ] Test adds toast
3. [ ] Test removes toast
4. [ ] Test multiple consumers
5. [ ] **COMMIT**: "test(fe): add ToastContext tests"

**Acceptance Criteria**:
- [ ] All context behaviors tested
- [ ] 85%+ coverage
- [ ] All tests pass

---

### Task 7.2: Test AuthContext (45 min)
**Estimated Time**: 45 minutes

**Files to Create**:
- `src/context/__tests__/AuthContext.test.tsx`

**Steps**:
1. [ ] Test provides default values
2. [ ] Test login updates context
3. [ ] Test logout clears context
4. [ ] Test persists to localStorage
5. [ ] **COMMIT**: "test(fe): add AuthContext tests"

**Acceptance Criteria**:
- [ ] All context behaviors tested
- [ ] 85%+ coverage
- [ ] All tests pass

---

## Phase 8: Documentation (1 hour)

### Task 8.1: Update README (30 min)
**Estimated Time**: 30 minutes

**Files to Modify**:
- `README.md` (frontend or root)

**Steps**:
1. [ ] Add testing section to README
2. [ ] Document how to run tests
3. [ ] Add coverage badge
4. [ ] Add testing best practices
5. [ ] **COMMIT**: "docs: add testing documentation to README"

**Acceptance Criteria**:
- [ ] Testing section is clear
- [ ] Coverage badge added
- [ ] Examples provided

---

### Task 8.2: Create Testing Guide (30 min)
**Estimated Time**: 30 minutes

**Files to Create**:
- `docs/how-to/frontend-testing.md`

**Steps**:
1. [ ] Document testing setup
2. [ ] Document testing patterns
3. [ ] Add example tests
4. [ ] Document best practices
5. [ ] **COMMIT**: "docs: create frontend testing guide"

**Acceptance Criteria**:
- [ ] Guide is comprehensive
- [ ] Examples are clear
- [ ] Best practices documented

---

## Phase 9: Final Verification (1 hour)

### Task 9.1: Run All Tests (30 min)
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Run all unit tests: `npm test`
2. [ ] Verify 100% pass rate
3. [ ] Run coverage: `npm run test:coverage`
4. [ ] Verify coverage thresholds met
5. [ ] Fix any issues

**Acceptance Criteria**:
- [ ] 100% of tests pass
- [ ] Coverage > 80% globally
- [ ] No test warnings

---

### Task 9.2: Integration Check (30 min)
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Run tests alongside E2E tests
2. [ ] Verify no conflicts
3. [ ] Check test execution time
4. [ ] Document any issues

**Acceptance Criteria**:
- [ ] Unit tests run independently
- [ ] No conflicts with E2E tests
- [ ] Execution time is acceptable

---

## Atomic Commit Summary

**Expected Commits (40+ total)**:
1. [ ] test(fe): install Jest and testing dependencies
2. [ ] test(fe): configure Jest for Next.js + TypeScript
3. [ ] test(fe): create test utilities and mocks
4. [ ] test(fe): add test scripts to package.json
5. [ ] test(fe): add sample test and verify setup
6. [ ] test(fe): install MSW for API mocking
7. [ ] test(fe): create MSW handlers for API mocking
8. [ ] test(fe): create MSW server instance
9. [ ] test(fe): verify MSW setup with sample test
10. [ ] test(fe): add validation utility tests
11. [ ] test(fe): add formatting utility tests
12. [ ] test(fe): add URL utility tests
13. [ ] test(fe): add PhotoCard component tests
14. [ ] test(fe): add LoginForm component tests
15. [ ] test(fe): add RegistrationForm component tests
16. [ ] test(fe): add ProfileForm component tests
17. [ ] test(fe): add FilterDropdown component tests
18. [ ] test(fe): add SortByDropdown component tests
19. [ ] test(fe): add Toast component tests
20. [ ] test(fe): add ConfirmDialog component tests
21. [ ] test(fe): add useToast hook tests
22. [ ] test(fe): add useAuth hook tests
23. [ ] test(fe): add authService tests
24. [ ] test(fe): add galleryService tests
25. [ ] test(fe): add profileService tests
26. [ ] test(fe): add ToastContext tests
27. [ ] test(fe): add AuthContext tests
28. [ ] docs: add testing documentation to README
29. [ ] docs: create frontend testing guide

---

## Success Criteria Summary

### Must Have (P0)
- [ ] Jest configured and running
- [ ] All components have tests
- [ ] All hooks have tests
- [ ] All utilities have tests
- [ ] All services have tests
- [ ] Coverage > 80% globally
- [ ] All tests pass (100%)

### Should Have (P1)
- [ ] MSW configured for API mocking
- [ ] Context providers have tests
- [ ] Snapshot tests for critical components
- [ ] Coverage badge in README

### Nice to Have (P2)
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests
- [ ] Coverage > 90%

---

**Checklist Version**: 1.0
**Created**: January 12, 2026
**Total Estimated Time**: 12-19 hours
**Next Step**: Task 1.1 - Install Dependencies
