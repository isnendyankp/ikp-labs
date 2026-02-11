# Checklist - Frontend Unit Tests

**Project**: Frontend Unit Tests with Jest, React Testing Library & MSW
**Status**: 🚧 In Progress
**Created**: February 11, 2026

---

## Table of Contents

1. [Phase 1: Setup & Infrastructure](#phase-1-setup--infrastructure)
2. [Phase 2: Utility Tests](#phase-2-utility-tests)
3. [Phase 3: Core Component Tests](#phase-3-core-component-tests)
4. [Phase 4: UI Element Tests](#phase-4-ui-element-tests)
5. [Phase 5: Hook Tests](#phase-5-hook-tests)
6. [Phase 6: Service Tests](#phase-6-service-tests)
7. [Phase 7: Context/Provider Tests](#phase-7-contextprovider-tests)
8. [Phase 8: Documentation](#phase-8-documentation)

---

## Phase 1: Setup & Infrastructure

**Estimated Time**: 1-2 hours
**Impact**: HIGH (Foundation for all tests)

### 1.1 Install Dependencies
- [ ] Install MSW: `npm install --save-dev msw`
- [ ] Install @testing-library/user-event: `npm install --save-dev @testing-library/user-event`
- [ ] Verify installations in package.json

### 1.2 Configure Jest
- [ ] Update `jest.config.js` with coverage thresholds
- [ ] Configure moduleNameMapper for @/* aliases
- [ ] Set coverage collection paths
- [ ] Set up swc/jest transform
- [ ] Configure testPathIgnorePatterns

### 1.3 Create Test Setup File
- [ ] Create `src/__tests__/setup.ts`
- [ ] Import @testing-library/jest-dom
- [ ] Add TextEncoder/TextDecoder polyfill
- [ ] Mock IntersectionObserver
- [ ] Mock window.matchMedia
- [ ] Mock next/router
- [ ] Mock next/navigation
- [ ] Update jest.config.js to use setup file

### 1.4 Create MSW Configuration
- [ ] Create `src/__tests__/mocks/handlers.ts`
- [ ] Set up MSW server with setupServer()
- [ ] Create auth handlers (login, register, me)
- [ ] Create gallery handlers (get photos, upload)
- [ ] Create like handlers (like, unlike, get liked)
- [ ] Create favorite handlers (favorite, unfavorite, get favorites)
- [ ] Combine all handlers

### 1.5 Create Mock Data Generators
- [ ] Create `src/__tests__/mocks/data.ts`
- [ ] Implement createMockUser()
- [ ] Implement createMockPhoto()
- [ ] Implement createMockPhotos()
- [ ] Add override support for flexibility

### 1.6 Create Test Utilities
- [ ] Create `src/__tests__/test-utils.tsx`
- [ ] Create TestProviders wrapper component
- [ ] Implement renderWithProviders() function
- [ ] Re-export RTL utilities
- [ ] Export userEvent

### 1.7 Update Package.json Scripts
- [ ] Add `test` script
- [ ] Add `test:watch` script
- [ ] Add `test:coverage` script
- [ ] Add `test:ci` script

### 1.8 Testing & Verification
- [ ] Run `npm test` - should pass with existing tests
- [ ] Run `npm run test:coverage` - check coverage report
- [ ] Verify LikeButton/FavoriteButton tests still pass
- [ ] Check test execution time

### 1.9 Commit
- [ ] Stage all changes
- [ ] Commit: "feat(frontend): setup Jest, RTL, and MSW for unit testing"

**Total Estimated Time**: 1-2 hours

---

## Phase 2: Utility Tests

**Estimated Time**: 1-2 hours
**Impact**: HIGH (Fastest wins, 100% coverage target)

### 2.1 Identify Utility Files
- [ ] Find all utility files in src/lib/utils/
- [ ] Find validation utilities
- [ ] Find formatting utilities
- [ ] Find apiClient utilities

### 2.2 Test apiClient.ts
- [ ] Create `src/lib/apiClient.test.ts`
- [ ] Test getToken() - retrieve token from localStorage
- [ ] Test setToken() - store token to localStorage
- [ ] Test removeToken() - clear token from localStorage
- [ ] Test createAuthHeaders() - build headers with auth
- [ ] Test createAuthHeaders() without token - return empty object
- [ ] Test createFormDataHeaders() - build FormData headers
- [ ] Test createFormDataHeaders() with token - include auth

### 2.3 Test Validation Utilities
- [ ] Test email validation
- [ ] Test password strength validation
- [ ] Test URL validation
- [ ] Test file type validation
- [ ] Test image dimension validation

### 2.4 Test Format Utilities
- [ ] Test date formatting (relative time)
- [ ] Test date formatting (absolute time)
- [ ] Test file size formatting (bytes, KB, MB)
- [ ] Test number formatting
- [ ] Test truncation utilities

### 2.5 Coverage Verification
- [ ] Run coverage report
- [ ] Verify 100% coverage for utilities
- [ ] Fix any uncovered lines

### 2.6 Commit
- [ ] Stage utility test files
- [ ] Commit: "test(frontend): add utility function unit tests"

**Total Estimated Time**: 1-2 hours

---

## Phase 3: Core Component Tests

**Estimated Time**: 4-6 hours
**Impact**: HIGH (Most critical components)

### 3.1 PhotoCard Component Tests
- [ ] Create `src/components/PhotoCard.test.tsx`
- [ ] Test: Render photo image correctly
- [ ] Test: Display photo title
- [ ] Test: Display photo description
- [ ] Test: Display like/favorite counts
- [ ] Test: Show owner info
- [ ] Test: Handle like button click
- [ ] Test: Handle favorite button click
- [ ] Test: Navigate to photo detail on click
- [ ] Test: Display loading state
- [ ] Test: Display error state
- [ ] Test: Disable like button for own photo
- [ ] Test: Accessibility (ARIA labels, keyboard nav)

### 3.2 LoginForm Component Tests
- [ ] Create `src/components/LoginForm.test.tsx`
- [ ] Test: Render all form fields
- [ ] Test: Show validation errors for empty fields
- [ ] Test: Show validation errors for invalid email format
- [ ] Test: Disable submit button while loading
- [ ] Test: Show error message on failed login
- [ ] Test: Redirect to gallery on successful login (with MSW)
- [ ] Test: Store auth token on success
- [ ] Test: Clear form on successful login
- [ ] Test: Handle Enter key submission
- [ ] Test: Password field toggle visibility

### 3.3 RegistrationForm Component Tests
- [ ] Create `src/components/RegistrationForm.test.tsx`
- [ ] Test: Render all form fields
- [ ] Test: Show validation errors
- [ ] Test: Validate password confirmation matches
- [ ] Test: Show error if passwords don't match
- [ ] Test: Disable submit button while loading
- [ ] Test: Show error message on failed registration
- [ ] Test: Redirect to login on success
- [ ] Test: Clear form on successful registration
- [ ] Test: Handle Enter key submission

### 3.4 ProfileForm Component Tests
- [ ] Create `src/components/ProfileForm.test.tsx`
- [ ] Test: Pre-fill with existing user data
- [ ] Test: Validate name field
- [ ] Test: Validate email field
- [ ] Test: Handle profile picture upload
- [ ] Test: Show loading state
- [ ] Test: Show success message
- [ ] Test: Show error message
- [ ] Test: Update user context on success
- [ ] Test: Cancel button restores original values

### 3.5 PhotoUploadForm Component Tests
- [ ] Create `src/components/PhotoUploadForm.test.tsx`
- [ ] Test: Render file input
- [ ] Test: Validate file type (images only)
- [ ] Test: Validate file size
- [ ] Test: Show preview of selected image
- [ ] Test: Upload progress indicator
- [ ] Test: Clear form after successful upload
- [ ] Test: Handle upload errors
- [ ] Test: Redirect to gallery on success
- [ ] Test: Multiple file handling (if supported)

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

### 4.2 FilterDropdown Component Tests
- [ ] Create `src/components/FilterDropdown.test.tsx`
- [ ] Test: Render dropdown button
- [ ] Test: Open/close dropdown
- [ ] Test: Display all filter options
- [ ] Test: Select filter option
- [ ] Test: Display selected filter
- [ ] Test: Clear filter
- [ ] Test: Keyboard navigation
- [ ] Test: Close on click outside

### 4.3 SortByDropdown Component Tests
- [ ] Create `src/components/SortByDropdown.test.tsx`
- [ ] Test: Render dropdown button
- [ ] Test: Open/close dropdown
- [ ] Test: Display all sort options
- [ ] Test: Select sort option
- [ ] Test: Display selected option
- [ ] Test: Keyboard navigation
- [ ] Test: Close on click outside

### 4.4 Pagination Component Tests
- [ ] Create `src/components/Pagination.test.tsx`
- [ ] Test: Display current page
- [ ] Test: Display total pages
- [ ] Test: Enable/disable previous button
- [ ] Test: Enable/disable next button
- [ ] Test: Navigate to previous page
- [ ] Test: Navigate to next page
- [ ] Test: Navigate to specific page
- [ ] Test: Display page numbers
- [ ] Test: Handle edge cases (first page, last page)

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

### 4.7 EmptyState Component Tests
- [ ] Create `src/components/EmptyState.test.tsx`
- [ ] Test: Render empty state illustration
- [ ] Test: Display title
- [ ] Test: Display description
- [ ] Test: Display action button (optional)
- [ ] Test: Handle action button click

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

## Phase 6: Service Tests

**Estimated Time**: 2-3 hours
**Impact**: MEDIUM (API integration testing)

### 6.1 authService Tests
- [ ] Create `src/services/authService.test.ts`
- [ ] Test: Login with valid credentials (with MSW)
- [ ] Test: Handle login with invalid credentials (with MSW)
- [ ] Test: Handle network errors (with MSW)
- [ ] Test: Register with valid data (with MSW)
- [ ] Test: Handle registration errors (with MSW)
- [ ] Test: Logout function
- [ ] Test: Get current user (with MSW)
- [ ] Test: Handle unauthorized access (with MSW)

### 6.2 galleryService Tests
- [ ] Create `src/services/galleryService.test.ts`
- [ ] Test: Get public photos (with MSW)
- [ ] Test: Get my photos (with MSW)
- [ ] Test: Get user photos (with MSW)
- [ ] Test: Get photo by ID (with MSW)
- [ ] Test: Upload photo (with MSW)
- [ ] Test: Update photo (with MSW)
- [ ] Test: Delete photo (with MSW)
- [ ] Test: Handle pagination parameters
- [ ] Test: Handle sorting parameters

### 6.3 profileService Tests
- [ ] Create `src/services/profileService.test.ts`
- [ ] Test: Get my profile (with MSW)
- [ ] Test: Get user profile (with MSW)
- [ ] Test: Update profile (with MSW)
- [ ] Test: Upload profile picture (with MSW)
- [ ] Test: Update password (with MSW)
- [ ] Test: Handle various error responses (with MSW)

### 6.4 photoService Tests (Like & Favorite)
- [ ] Create `src/services/photoLikeService.test.ts`
- [ ] Test: Like photo (with MSW)
- [ ] Test: Unlike photo (with MSW)
- [ ] Test: Get liked photos (with MSW)

- [ ] Create `src/services/photoFavoriteService.test.ts`
- [ ] Test: Favorite photo (with MSW)
- [ ] Test: Unfavorite photo (with MSW)
- [ ] Test: Get favorited photos (with MSW)

### 6.5 Coverage Verification
- [ ] Run coverage report for services
- [ ] Verify 75%+ coverage for services

### 6.6 Commit
- [ ] Stage service test files
- [ ] Commit: "test(frontend): add service layer unit tests with MSW"

**Total Estimated Time**: 2-3 hours

---

## Phase 7: Context/Provider Tests

**Estimated Time**: 1-2 hours
**Impact**: MEDIUM (State management)

### 7.1 Identify Contexts
- [ ] Find all context files in src/contexts/
- [ ] Document context purposes and APIs

### 7.2 ToastContext Tests
- [ ] Create `src/contexts/ToastContext.test.tsx`
- [ ] Test: Provide toast context to children
- [ ] Test: Add toast via context
- [ ] Test: Remove toast via context
- [ ] Test: Auto-remove toast after duration
- [ ] Test: Update toasts when context changes
- [ ] Test: Multiple toasts management

### 7.3 AuthContext Tests
- [ ] Create `src/contexts/AuthContext.test.tsx`
- [ ] Test: Provide auth context to children
- [ ] Test: Login via context (with MSW)
- [ ] Test: Logout via context
- [ ] Test: Update user when auth state changes
- [ ] Test: Protected route behavior
- [ ] Test: Redirect to login when unauthorized

### 7.4 Coverage Verification
- [ ] Run coverage report for contexts
- [ ] Verify 80%+ coverage

### 7.5 Commit
- [ ] Stage context test files
- [ ] Commit: "test(frontend): add context provider unit tests"

**Total Estimated Time**: 1-2 hours

---

## Phase 8: Documentation

**Estimated Time**: 1 hour
**Impact**: LOW (Documentation)

### 8.1 Update README
- [ ] Add testing section to frontend/README.md
- [ ] Document how to run tests
- [ ] Document coverage thresholds
- [ ] Add coverage badge
- [ ] Document testing patterns

### 8.2 Create Testing Guide
- [ ] Create TESTING.md in frontend/
- [ ] Document testing philosophy
- [ ] Document common patterns
- [ ] Document MSW usage
- [ ] Document test utilities
- [ ] Add examples

### 8.3 Update Main README
- [ ] Add test coverage badge to main README.md
- [ ] Link to testing guide
- [ ] Update tech stack with testing tools

### 8.4 Final Verification
- [ ] Run all tests: `npm test`
- [ ] Run coverage: `npm run test:coverage`
- [ ] Verify overall coverage > 80%
- [ ] Check test execution time < 30 seconds
- [ ] Verify no flaky tests

### 8.5 Commit
- [ ] Stage documentation files
- [ ] Commit: "docs(frontend): add testing documentation and coverage badge"

**Total Estimated Time**: 1 hour

---

## Final Verification

### Overall Progress
- [ ] Phase 1: Setup & Infrastructure (1-2 hours)
- [ ] Phase 2: Utility Tests (1-2 hours)
- [ ] Phase 3: Core Component Tests (4-6 hours)
- [ ] Phase 4: UI Element Tests (2-3 hours)
- [ ] Phase 5: Hook Tests (2-3 hours)
- [ ] Phase 6: Service Tests (2-3 hours)
- [ ] Phase 7: Context/Provider Tests (1-2 hours)
- [ ] Phase 8: Documentation (1 hour)

### Code Quality Checks
- [ ] All tests pass (100%)
- [ ] Overall coverage > 80%
- [ ] Test execution time < 30 seconds
- [ ] No flaky tests
- [ ] No console errors in tests
- [ ] No console warnings in tests

### Success Criteria
- [ ] MSW configured and working
- [ ] All critical components tested
- [ ] All custom hooks tested
- [ ] All utility functions tested (100% coverage)
- [ ] Service layer tested with MSW
- [ ] Context providers tested
- [ ] Documentation updated
- [ ] Coverage badge added

**Total Estimated Time**: 14-22 hours

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

### MSW Tips
- Reset handlers after each test
- Close server after all tests
- Use consistent mock data
- Test both success and error cases
- Mock at the HTTP level, not function level

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
