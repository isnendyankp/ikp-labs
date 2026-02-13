# Checklist - Frontend Unit Tests

**Project**: Frontend Unit Tests with Jest, React Testing Library
**Status**: 🚧 In Progress
**Created**: February 11, 2026

---

## Table of Contents

1. [Phase 1: Setup & Infrastructure](#phase-1-setup--infrastructure)
2. [Phase 2: Utility Tests](#phase-2-utility-tests)
3. [Phase 3: Core Component Tests](#phase-3-core-component-tests)
4. [Phase 4: UI Element Tests](#phase-4-ui-element-tests)
5. [Phase 5: Hook Tests](#phase-5-hook-tests)
6. [Phase 6: Context/Provider Tests](#phase-6-contextprovider-tests)
7. [Phase 7: Documentation](#phase-7-documentation)

---

## Phase 1: Setup & Infrastructure

**Estimated Time**: 1-2 hours
**Impact**: HIGH (Foundation for all tests)

### 1.1 Install Dependencies
- [x] Install @testing-library/user-event: `npm install --save-dev @testing-library/user-event`
- [x] Verify installations in package.json

### 1.2 Configure Jest
- [x] Update `jest.config.js` with coverage thresholds
- [x] Configure moduleNameMapper for @/* aliases
- [x] Set coverage collection paths
- [x] Set up swc/jest transform
- [x] Configure testPathIgnorePatterns

### 1.3 Create Test Setup File
- [x] Create `src/__tests__/setup.ts`
- [x] Import @testing-library/jest-dom
- [x] Add TextEncoder/TextDecoder polyfill
- [x] Mock IntersectionObserver
- [x] Mock window.matchMedia
- [x] Mock next/router
- [x] Mock next/navigation
- [x] Update jest.config.js to use setup file

### 1.4 Create Test Utilities
- [x] Create `src/lib/test-helpers.tsx` (renamed from test-utils.tsx)
- [x] Create TestProviders wrapper component
- [x] Implement renderWithProviders() function
- [x] Re-export RTL utilities
- [x] Export userEvent

### 1.7 Update Package.json Scripts
- [x] Add `test` script
- [x] Add `test:watch` script
- [x] Add `test:coverage` script
- [x] Add `test:ci` script

### 1.8 Testing & Verification
- [x] Run `npm test` - should pass with existing tests
- [x] Run `npm run test:coverage` - check coverage report
- [x] Verify LikeButton/FavoriteButton tests still pass
- [x] Check test execution time

### 1.6 Commit
- [x] Stage all changes
- [x] Commit: "test(frontend): fix failing unit tests and complete Phase 1 setup"

**Total Estimated Time**: 1-2 hours

---

## Phase 2: Utility Tests ✅ COMPLETED

**Estimated Time**: 1-2 hours
**Impact**: HIGH (Fastest wins, 100% coverage target)

### 2.1 Identify Utility Files
- [x] Find all utility files in src/lib/
- [x] Find apiClient utilities
- [x] Find auth utilities
- [x] ~~Find validation utilities~~ - N/A (no validation utilities exist)
- [x] ~~Find formatting utilities~~ - N/A (no formatting utilities exist)

### 2.2 Test apiClient.ts ✅ COMPLETED
- [x] Create `src/__tests__/lib/apiClient.test.ts`
- [x] Test getToken() - retrieve token from localStorage
- [x] Test saveToken() - store token to localStorage
- [x] Test removeToken() - clear token from localStorage
- [x] Test createHeaders() - build headers with/without auth
- [x] Test createAuthHeaders() - build headers with auth
- [x] Test createAuthHeaders() without token - return headers without auth
- [x] Test createFormDataHeaders() - build FormData headers
- [x] Test createFormDataHeaders() with token - include auth
- [x] Test token + headers integration scenarios
- [x] 19 test cases, all passing
- [x] Commit: `f8a7285` - test(frontend): add apiClient utility unit tests

### 2.3 Test auth.ts ✅ COMPLETED
- [x] Create `src/__tests__/lib/auth.test.ts`
- [x] Test saveToken(), getToken(), logout()
- [x] Test isAuthenticated() - return true for valid token
- [x] Test isAuthenticated() - return false for expired token
- [x] Test isAuthenticated() - return false for invalid token
- [x] Test getUserFromToken() - decode and return user info
- [x] Test getUserFromToken() - return null for invalid token
- [x] Test decodeToken() - throw error for invalid JWT format
- [x] 27 test cases, all passing
- [x] Commit: `9868167` - test(frontend): add auth.test.ts for auth utilities

### 2.4 Test Validation Utilities - N/A
- [x] ~~Test email validation~~ - No validation utilities exist
- [x] ~~Test password strength validation~~ - N/A
- [x] ~~Test URL validation~~ - N/A
- [x] ~~Test file type validation~~ - N/A

### 2.5 Test Format Utilities - N/A
- [x] ~~Test date formatting~~ - No formatting utilities exist
- [x] ~~Test file size formatting~~ - N/A
- [x] ~~Test number formatting~~ - N/A

### 2.6 Coverage Verification ✅ COMPLETED
- [x] Run coverage report for apiClient.ts
- [x] Verify coverage for apiClient utilities
- [x] Verify 100% coverage for all utilities (apiClient + auth)

### 2.7 Additional Improvements ✅ COMPLETED
- [x] Consolidate test folders to `src/__tests__/`
- [x] Add README.md to test folder
- [x] Fix import paths after restructure
- [x] All 209 tests passing

### 2.8 Commit
- [x] Stage utility test files
- [x] Commit: "test(frontend): add apiClient utility unit tests"
- [x] Commit: "refactor(test): consolidate frontend unit tests to centralized __tests__ folder"
- [x] Commit: "fix(test): update import paths after test folder restructure"
- [x] Commit: `9868167` - "test(frontend): add auth.test.ts for auth utilities"

**Total Estimated Time**: 1-2 hours ✅ COMPLETED

---

## Phase 3: Core Component Tests

**Estimated Time**: 4-6 hours
**Impact**: HIGH (Most critical components)

### 3.1 PhotoCard Component Tests ✅ COMPLETED
- [x] Create `src/__tests__/components/gallery/PhotoCard.test.tsx`
- [x] Test: Render photo image correctly
- [x] Test: Display photo title
- [x] Test: Display photo description
- [x] Test: Display like/favorite counts
- [x] Test: Display Public/Private badge
- [x] Test: Navigate to photo detail on click
- [x] Test: Disable like button for own photo
- [x] Test: Accessibility (ARIA labels)
- [x] Test: Image attributes (lazy loading, async decoding)
- [x] 24 test cases, all passing
- [x] Commit: `eb3adcf` - test(frontend): add PhotoCard component unit tests

### 3.2 LoginForm Component Tests ✅ EXISTING
- [x] Create `src/__tests__/components/LoginForm.test.tsx`
- [x] Test: Render all form fields
- [x] Test: Form state updates
- [x] Test: Google OAuth button
- [x] Test: Password field toggle visibility
- [x] Test: Navigation to registration
- [x] 11 tests existing

### 3.3 RegistrationForm Component Tests ✅ EXISTING
- [x] Create `src/__tests__/components/RegistrationForm.test.tsx`
- [x] Test: Render all form fields
- [x] Test: Form state updates
- [x] Test: Google OAuth button
- [x] 6 tests existing

### 3.4 ProfileForm Component Tests - N/A
- [x] ~~Create ProfileForm.test.tsx~~ - No standalone ProfileForm component exists
- Note: ProfilePicture and ProfilePictureUpload exist as separate components

### 3.5 PhotoUploadForm Component Tests ✅ COMPLETED
- [x] Create `src/__tests__/components/gallery/PhotoUploadForm.test.tsx`
- [x] Test: Render file input
- [x] Test: Validate file type (images only)
- [x] Test: Validate file size (5MB limit)
- [x] Test: Show file info when selected
- [x] Test: Title/description input with character count
- [x] Test: Privacy toggle
- [x] Test: Clear form button
- [x] Test: Cancel button navigation
- [x] Test: Submit button state (disabled without file)
- [x] Test: Drag & drop events
- [x] 32 test cases, all passing
- [x] Commit: `f46c45c` - test(frontend): add PhotoUploadForm component unit tests

### 3.6 Coverage Verification
- [ ] Run coverage report for components
- [ ] Verify 80%+ coverage for core components
- [ ] Fix any uncovered lines

### 3.7 Commit
- [ ] Stage component test files
- [ ] Commit: "test(frontend): add core component unit tests"

**Total Estimated Time**: 4-6 hours

---

## Phase 4: UI Element Tests

**Estimated Time**: 2-3 hours
**Impact**: MEDIUM (Supporting components)

### 4.1 ActionButton Component Tests (Extend Existing)
- [ ] Review existing ActionButton tests
- [ ] Test: Toggle between active/inactive states
- [ ] Test: Display count when enabled
- [ ] Test: Hide count when disabled
- [ ] Test: Show correct aria-label
- [ ] Test: Optimistic update behavior
- [ ] Test: Rollback on error (with MSW error handler)

### 4.2 FilterDropdown Component Tests ✅ COMPLETED
- [x] Create `src/__tests__/components/FilterDropdown.test.tsx`
- [x] Test: Render dropdown button
- [x] Test: Open/close dropdown
- [x] Test: Display all filter options
- [x] Test: Select filter option
- [x] Test: Display selected filter
- [x] Test: Keyboard navigation (Escape key)
- [x] Test: Close on click outside
- [x] Test: Controlled mode
- [x] 20 test cases, all passing
- [x] Commit: `73c4c9f` - test(frontend): add FilterDropdown component unit tests

### 4.3 SortByDropdown Component Tests
- [ ] Create `src/components/SortByDropdown.test.tsx`
- [ ] Test: Render dropdown button
- [ ] Test: Open/close dropdown
- [ ] Test: Display all sort options
- [ ] Test: Select sort option
- [ ] Test: Display selected option
- [ ] Test: Keyboard navigation
- [ ] Test: Close on click outside

### 4.4 Pagination Component Tests ✅ COMPLETED
- [x] Create `src/__tests__/components/gallery/Pagination.test.tsx`
- [x] Test: Display current page
- [x] Test: Display total pages
- [x] Test: Enable/disable previous button
- [x] Test: Enable/disable next button
- [x] Test: Navigate to previous page
- [x] Test: Navigate to next page
- [x] Test: Handle edge cases (first page, last page, single page)
- [x] Test: Loading state
- [x] 18 test cases, all passing
- [x] Commit: `fc39cbc` - test(frontend): add Pagination component unit tests

### 4.5 ConfirmDialog Component Tests
- [ ] Create `src/components/ConfirmDialog.test.tsx`
- [ ] Test: Render dialog with title and message
- [ ] Test: Show confirm button
- [ ] Test: Show cancel button
- [ ] Test: Call onConfirm when confirmed
- [ ] Test: Call onCancel when cancelled
- [ ] Test: Close dialog on action
- [ ] Test: Keyboard shortcuts (Esc, Enter)

### 4.6 Toast Component Tests
- [ ] Create `src/components/Toast.test.tsx`
- [ ] Test: Render toast message
- [ ] Test: Display correct icon by type (success, error, info)
- [ ] Test: Auto-dismiss after timeout
- [ ] Test: Manual dismiss on close button click
- [ ] Test: Support multiple toasts
- [ ] Test: Animation on enter/exit

### 4.7 EmptyState Component Tests ✅ COMPLETED
- [x] Create `src/__tests__/components/ui/EmptyState.test.tsx`
- [x] Test: Render icon (string and React node)
- [x] Test: Display title
- [x] Test: Display message
- [x] Test: Display action button (optional)
- [x] Test: Handle action button click
- [x] 19 test cases, all passing
- [x] Commit: `bdf0fac` - test(frontend): add EmptyState component unit tests

### 4.8 FormField Component Tests
- [ ] Create `src/components/FormField.test.tsx`
- [ ] Test: Render label
- [ ] Test: Render input element
- [ ] Test: Display error message
- [ ] Test: Display helper text
- [ ] Test: Support different input types
- [ ] Test: Handle input changes
- [ ] Test: Show required indicator

### 4.9 Coverage Verification
- [ ] Run coverage report for UI elements
- [ ] Verify 75%+ coverage (lower priority)

### 4.10 Commit
- [ ] Stage UI element test files
- [ ] Commit: "test(frontend): add UI element component unit tests"

**Total Estimated Time**: 2-3 hours

---

## Phase 5: Hook Tests

**Estimated Time**: 2-3 hours
**Impact**: HIGH (Custom hook logic)

### 5.1 Identify Custom Hooks
- [ ] Find all custom hooks in src/hooks/
- [ ] Document hook purposes and APIs

### 5.2 useAuth Hook Tests
- [ ] Create `src/hooks/useAuth.test.ts`
- [ ] Test: Return null user when not authenticated
- [ ] Test: Return user when authenticated
- [ ] Test: login() function stores token (with MSW)
- [ ] Test: login() function sets user (with MSW)
- [ ] Test: logout() function clears token
- [ ] Test: logout() function clears user
- [ ] Test: Persist state across re-renders
- [ ] Test: Handle login errors (with MSW error handler)
- [ ] Test: isLoading state during login

### 5.3 useToast Hook Tests
- [ ] Create `src/hooks/useToast.test.ts`
- [ ] Test: Show toast with message
- [ ] Test: Show toast with specific type (success, error, info)
- [ ] Test: Dismiss toast after duration
- [ ] Test: Manual dismiss
- [ ] Test: Clear all toasts
- [ ] Test: Support multiple toasts
- [ ] Test: Toast auto-removal from list

### 5.4 Custom API Hooks Tests
- [ ] Identify custom API hooks (usePhotos, useProfile, etc.)
- [ ] Test: Fetch data on mount
- [ ] Test: Show loading state
- [ ] Test: Handle successful response (with MSW)
- [ ] Test: Handle error state (with MSW error handler)
- [ ] Test: Refetch function
- [ ] Test: Cache invalidation

### 5.5 Coverage Verification
- [ ] Run coverage report for hooks
- [ ] Verify 85%+ coverage for hooks

### 5.6 Commit
- [ ] Stage hook test files
- [ ] Commit: "test(frontend): add custom hook unit tests"

**Total Estimated Time**: 2-3 hours

---

## Phase 6: Context/Provider Tests

**Estimated Time**: 1-2 hours
**Impact**: MEDIUM (State management)

### 6.1 Identify Contexts
- [ ] Find all context files in src/contexts/
- [ ] Document context purposes and APIs

### 6.2 ToastContext Tests
- [ ] Create `src/contexts/ToastContext.test.tsx`
- [ ] Test: Provide toast context to children
- [ ] Test: Add toast via context
- [ ] Test: Remove toast via context
- [ ] Test: Auto-remove toast after duration
- [ ] Test: Update toasts when context changes
- [ ] Test: Multiple toasts management

### 6.3 AuthContext Tests
- [ ] Create `src/contexts/AuthContext.test.tsx`
- [ ] Test: Provide auth context to children
- [ ] Test: Login via context (state only)
- [ ] Test: Logout via context
- [ ] Test: Update user when auth state changes
- [ ] Test: Protected route behavior
- [ ] Test: Redirect to login when unauthorized

### 6.4 Coverage Verification
- [ ] Run coverage report for contexts
- [ ] Verify 80%+ coverage

### 6.5 Commit
- [ ] Stage context test files
- [ ] Commit: "test(frontend): add context provider unit tests"

**Total Estimated Time**: 1-2 hours

---

## Phase 7: Documentation

**Estimated Time**: 1 hour
**Impact**: LOW (Documentation)

### 7.1 Update README
- [ ] Add testing section to frontend/README.md
- [ ] Document how to run tests
- [ ] Document coverage thresholds
- [ ] Add coverage badge
- [ ] Document testing patterns

### 7.2 Create Testing Guide
- [ ] Create TESTING.md in frontend/
- [ ] Document testing philosophy
- [ ] Document common patterns
- [ ] Document test utilities
- [ ] Add examples

### 7.3 Update Main README
- [ ] Add test coverage badge to main README.md
- [ ] Link to testing guide
- [ ] Update tech stack with testing tools

### 7.4 Final Verification
- [ ] Run all tests: `npm test`
- [ ] Run coverage: `npm run test:coverage`
- [ ] Verify overall coverage > 80%
- [ ] Check test execution time < 30 seconds
- [ ] Verify no flaky tests

### 7.5 Commit
- [ ] Stage documentation files
- [ ] Commit: "docs(frontend): add testing documentation and coverage badge"

**Total Estimated Time**: 1 hour

---

## Final Verification

### Overall Progress
- [x] Phase 1: Setup & Infrastructure (1-2 hours) ✅
- [x] Phase 2: Utility Tests (1-2 hours) ✅
- [x] Phase 3: Core Component Tests (4-6 hours) ✅
- [ ] Phase 4: UI Element Tests (2-3 hours)
- [ ] Phase 5: Hook Tests (2-3 hours)
- [ ] Phase 6: Context/Provider Tests (1-2 hours)
- [ ] Phase 7: Documentation (1 hour)

### Code Quality Checks
- [ ] All tests pass (100%)
- [ ] Overall coverage > 80%
- [ ] Test execution time < 30 seconds
- [ ] No flaky tests
- [ ] No console errors in tests
- [ ] No console warnings in tests

### Success Criteria
- [x] All critical components tested ✅
- [ ] All custom hooks tested
- [x] All utility functions tested (100% coverage) ✅
- [ ] Context providers tested
- [ ] Documentation updated
- [ ] Coverage badge added

**Note**: Service layer tested in `/tests/api` (Playwright API tests)
**Total Estimated Time**: 12-18 hours (reduced from 14-22 hours)

---

## Notes

### Testing Best Practices
- Follow Arrange-Act-Assert pattern
- Test behavior, not implementation
- Use userEvent for realistic interactions
- Avoid testing implementation details
- Keep tests simple and readable
- One assertion per test ideal
- Use descriptive test names
- **NO API mocking** - Test UI/component logic only
- **NO external dependencies** - Keep tests isolated

### Common Pitfalls to Avoid
- Don't test third-party libraries
- Don't use hardcoded delays (use waitFor)
- Don't test CSS/styles
- Don't test implementation details
- Don't forget cleanup
- Don't write brittle selectors

### Related Plans
- ✅ **DRY Violations Fix** (Completed) - ActionButton already has tests
- 📋 **CI/CD Pipeline** (Backlog) - Will integrate these tests

---

**Checklist Version**: 1.0
**Last Updated**: February 11, 2026
