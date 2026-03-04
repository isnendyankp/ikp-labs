# Profile Picture E2E Tests - Requirements Document

**Status:** COMPLETED
**Last Updated:** November 4, 2024

---

## Overview

This document defines the requirements and specifications for E2E tests covering the complete profile picture feature flow.

**Back to:** [Main README](README.md) | **See also:** [Technical Design](technical-design.md) | [Checklist](checklist.md)

---

## Test Objectives

### Primary Goals

1. **Complete Flow Coverage**
   - Test complete user journey: Register -> Login -> Home -> Upload -> Delete -> Logout
   - Verify all profile picture operations work end-to-end
   - Ensure data persistence across sessions

2. **Quality Assurance**
   - Validate file upload constraints (size, type)
   - Test error handling scenarios
   - Verify UI feedback and state updates

3. **Portfolio Value**
   - Professional E2E testing patterns
   - Reusable test infrastructure
   - Demonstrates testing best practices

---

## Test Specifications

### 1. Profile Picture Upload Flow

**Test:** `Should register, login, and upload profile picture`

**Priority:** P0 (Critical)

**Preconditions:**
- Fresh test environment
- Valid test fixtures available

**Test Steps:**
1. Register new user
2. Login with credentials
3. Navigate to home page
4. Upload valid image file (JPEG/PNG)
5. Verify image appears on page
6. Verify success message
7. Verify profile picture URL updated

**Expected Results:**
- Profile picture uploaded successfully
- Image visible in UI
- Success message displayed
- Profile picture URL reflects new upload

---

### 2. Profile Picture Delete Flow

**Test:** `Should delete profile picture successfully`

**Priority:** P0 (Critical)

**Preconditions:**
- User with uploaded profile picture

**Test Steps:**
1. Use existing authenticated user with uploaded picture
2. Click "Delete Picture" button
3. Confirm deletion in dialog
4. Verify picture removed from UI
5. Verify fallback avatar appears (initials)
6. Verify success message

**Expected Results:**
- Profile picture removed
- Fallback avatar displayed
- Success message shown

---

### 3. Complete End-to-End Flow

**Test:** `Complete flow: Register -> Login -> Upload -> Delete -> Logout`

**Priority:** P0 (Critical)

**Preconditions:**
- None (fresh user)

**Test Steps:**
1. Register new unique user
2. Auto-redirect to home after registration
3. Verify user info displayed
4. Upload profile picture (valid image)
5. Verify upload success
6. Delete profile picture
7. Verify delete success
8. Logout successfully
9. Verify redirected to login

**Expected Results:**
- Complete flow works without errors
- All state transitions correct
- User journey completed successfully

---

### 4. Upload Validation Tests

**Test:** `Should reject invalid file uploads`

**Priority:** P1 (High)

**Test Scenarios:**
- File > 5MB (should fail)
- Non-image file (should fail)
- Unsupported format (should fail)

**Expected Results:**
- Error messages displayed correctly
- Upload blocked for invalid files

---

### 5. Profile Picture Persistence

**Test:** `Should persist profile picture after page refresh`

**Priority:** P1 (High)

**Test Steps:**
1. Upload profile picture
2. Refresh page
3. Verify picture still displayed
4. Verify no re-upload required

**Expected Results:**
- Picture persists after refresh
- Data loaded from database

---

### 6. Multiple Upload/Delete Cycles

**Test:** `Should handle multiple upload and delete operations`

**Priority:** P2 (Medium)

**Test Steps:**
1. Upload picture #1
2. Delete picture #1
3. Upload picture #2 (different image)
4. Verify picture #2 displayed
5. Delete picture #2
6. Verify fallback avatar

**Expected Results:**
- Multiple cycles work correctly
- State managed properly

---

## Test Fixtures

### Required Files

Create test fixtures in `tests/fixtures/`:
- `valid-profile.jpg` - Small JPEG (< 1MB)
- `valid-profile.png` - Small PNG (< 1MB)
- `large-image.jpg` - Large image (> 5MB) for validation test
- `invalid-file.txt` - Non-image file for validation test

---

## Helper Functions

### Functions Needed

1. `createAuthenticatedUser()` - Register + Login helper
2. `uploadTestImage()` - Upload image helper with test fixtures
3. `deleteProfilePicture()` - Delete picture helper
4. `verifyImageDisplayed()` - Assertion helper
5. `verifyAvatarFallback()` - Check initials avatar

---

## Success Criteria

### Functional Requirements

- All test scenarios pass
- Tests run independently (no dependencies)
- Tests clean up after themselves
- Tests use unique user data (no conflicts)
- Tests run in headless mode
- Tests complete in < 60 seconds total

### Non-Functional Requirements

- Clear test names and structure
- Proper assertions
- Error handling covered
- Edge cases tested

---

## Out of Scope

- Performance testing
- Visual regression testing
- Accessibility testing
- Mobile/responsive testing
- Cross-browser testing (beyond default)

---

## Prerequisites

### Development Environment

**Before Starting:**
- Backend running on `localhost:8081`
- Frontend running on `localhost:3005`
- PostgreSQL database running
- Playwright installed
- Test fixtures in place

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 4, 2024

**Back to:** [Main README](README.md) | **Next:** [Technical Design](technical-design.md)
