# E2E Gallery Tests - Requirements Document

**Status:** ✅ COMPLETED
**Last Updated:** December 8, 2024
**Completion Date:** December 1-6, 2024

---

## Overview

This document defines the requirements and specifications for the E2E Gallery Tests implementation. The goal is to achieve **100% Gallery user flow coverage** through comprehensive end-to-end testing using Playwright.

**Back to:** [Main README](README.md) | **See also:** [Technical Docs](tech-docs.md) | [Delivery Timeline](delivery.md)

---

## Test Objectives

### Primary Goals

1. **✅ Complete Coverage**
   - Create 20 comprehensive E2E Gallery tests
   - Cover all user journeys: Upload → View → Edit → Delete
   - Test across 3 browsers (Chromium, Firefox, WebKit)

2. **✅ Quality Assurance**
   - Maintain daily commit streak (6 consecutive days)
   - Achieve 100% test pass rate
   - Stable, reliable tests (no flakiness)

3. **✅ Learning & Growth**
   - Learn Playwright E2E testing patterns deeply
   - Master file upload testing mechanisms
   - Understand authorization testing patterns
   - Practice pagination and multi-user scenarios

4. **✅ Portfolio Value**
   - Professional test architecture
   - Ready for LinkedIn Week 3 post
   - Showcase material for interviews
   - GitHub activity demonstration

---

## Context & Background

### Previous Testing Achievements

**Before Week 3:**
- **Week 1:** 40 Integration Tests (Spring Boot + MockMvc + @MockBean)
- **Week 2:** 31 API Tests (Playwright API + real HTTP + database)
- **Existing E2E:** 30 tests (Registration, Login, Auth Flow, Profile Picture)

### The Gap

**Missing:** Gallery E2E Tests (0 tests)

**Problem:** Backend tested (31 API tests), Frontend implemented, but **NO E2E user journey tests** for Gallery feature.

**Solution:** Implement 20 comprehensive E2E tests covering complete Gallery lifecycle.

---

## Test Specifications

### Upload Tests (4 tests)

#### E2E-001: Upload Single Photo Successfully [P0]
**Priority:** P0 (Critical)
**Description:** Verify user can upload a single photo with metadata
**Preconditions:**
- User is registered and logged in
- Valid image file available

**Test Steps:**
1. Navigate to Gallery upload page
2. Select image file (test-photo.jpg)
3. Fill in title: "Sunset Beach"
4. Fill in description: "Beautiful sunset"
5. Keep privacy as Private (unchecked)
6. Submit upload form

**Expected Results:**
- Photo appears in "My Photos" tab
- Photo title "Sunset Beach" is visible
- Privacy badge shows "Private"
- Photo not visible in "Public Photos" tab

---

#### E2E-002: Upload Photo as Public [P0]
**Priority:** P0 (Critical)
**Description:** Verify user can upload a photo with public visibility
**Preconditions:**
- User is registered and logged in

**Test Steps:**
1. Navigate to Gallery upload page
2. Select image file
3. Fill in title
4. **Check "Make this photo public" checkbox**
5. Submit form

**Expected Results:**
- Photo appears in "My Photos" tab
- Privacy badge shows "Public"
- **Photo is visible in "Public Photos" tab**

---

#### E2E-003: Upload Multiple Photos Sequentially [P1]
**Priority:** P1 (High)
**Description:** Verify user can upload multiple photos one after another
**Preconditions:**
- User is registered and logged in

**Test Steps:**
1. Upload first photo (test-photo.jpg) with title "Photo 1"
2. Navigate back to upload page
3. Upload second photo (test-photo.png) with title "Photo 2"
4. Navigate to "My Photos" tab

**Expected Results:**
- Both "Photo 1" and "Photo 2" visible in grid
- Photos maintain their order
- Both upload processes complete successfully

---

#### E2E-011: Reject File Larger than 5MB [P1]
**Priority:** P1 (High)
**Description:** Verify file size validation rejects oversized files
**Preconditions:**
- User is registered and logged in
- Test fixture `large-image.jpg` (6MB) available

**Test Steps:**
1. Navigate to Gallery upload page
2. Select large-image.jpg (6MB)
3. Attempt to submit form

**Expected Results:**
- Error message: "File size must not exceed 5 MB"
- User stays on upload page
- Photo is NOT uploaded
- Database has no new photo record

---

### View Tests (3 tests)

#### E2E-004: View My Photos Shows All Owned Photos [P0]
**Priority:** P0 (Critical)
**Description:** Verify "My Photos" tab displays all user's photos (private + public)
**Preconditions:**
- User has uploaded multiple photos (mix of private and public)

**Test Steps:**
1. Upload 2 private photos
2. Upload 2 public photos
3. Navigate to Gallery page
4. Click "My Photos" tab

**Expected Results:**
- All 4 photos visible in grid
- Both private and public photos shown
- Privacy badges display correctly
- Photos sorted by upload date (newest first)

---

#### E2E-005: View Public Photos Shows Only Public [P0]
**Priority:** P0 (Critical)
**Description:** Verify "Public Photos" tab only shows public photos from all users
**Preconditions:**
- User A has uploaded 1 private and 1 public photo
- User B has uploaded 1 public photo

**Test Steps:**
1. Login as User A
2. Upload "Private Photo A" (private)
3. Upload "Public Photo A" (public)
4. Logout and login as User B
5. Upload "Public Photo B" (public)
6. Click "Public Photos" tab

**Expected Results:**
- "Public Photo A" is visible (User A's public photo)
- "Public Photo B" is visible (User B's public photo)
- **"Private Photo A" is NOT visible**
- Only photos with "Public" badge shown

---

#### E2E-006: View Photo Detail Shows Complete Information [P0]
**Priority:** P0 (Critical)
**Description:** Verify photo detail page displays all metadata correctly
**Preconditions:**
- User has uploaded a photo with complete metadata

**Test Steps:**
1. Upload photo with:
   - Title: "Mountain Sunrise"
   - Description: "Beautiful view from summit"
   - Privacy: Private
2. Navigate to "My Photos" tab
3. Click on "Mountain Sunrise" photo card

**Expected Results:**
- Detail page opens
- Photo image is displayed
- Title shows: "Mountain Sunrise"
- Description shows: "Beautiful view from summit"
- Privacy badge shows: "Private"
- Edit and Delete buttons visible (owner)
- Back button navigates to Gallery

---

### Edit Tests (2 tests)

#### E2E-007: Edit Photo Title and Description [P0]
**Priority:** P0 (Critical)
**Description:** Verify user can edit photo metadata
**Preconditions:**
- User owns a photo

**Test Steps:**
1. Upload photo with title "Original Title"
2. Open photo detail page
3. Click "Edit" button
4. Change title to "Updated Title"
5. Change description to "New description"
6. Click "Save Changes"

**Expected Results:**
- Success alert: "Photo updated successfully"
- Edit mode exits
- Title displays: "Updated Title"
- Description displays: "New description"
- Changes persist after page refresh

---

#### E2E-008: Toggle Privacy from Private to Public [P1]
**Priority:** P1 (High)
**Description:** Verify user can change photo privacy setting
**Preconditions:**
- User has uploaded a private photo

**Test Steps:**
1. Upload private photo "Privacy Test Photo"
2. Open photo detail page
3. Click "Edit" button
4. **Check "Make this photo public" checkbox**
5. Click "Save Changes"
6. Navigate to "Public Photos" tab

**Expected Results:**
- Privacy badge changes to "Public"
- Photo appears in "Public Photos" tab
- Changes persist after page refresh
- Other users can now see the photo

---

### Delete Tests (2 tests)

#### E2E-009: Delete Photo with Confirmation [P0]
**Priority:** P0 (Critical)
**Description:** Verify user can delete their own photo
**Preconditions:**
- User owns a photo

**Test Steps:**
1. Upload photo "Photo to Delete"
2. Open photo detail page
3. Click "Delete" button
4. **Accept confirmation dialog**

**Expected Results:**
- Confirmation dialog: "Are you sure you want to delete this photo?"
- After confirmation, redirect to Gallery page
- Photo no longer visible in "My Photos" tab
- Photo removed from database
- Accessing old detail URL shows 404 or redirects

---

#### E2E-010: Cancel Delete Keeps Photo [P1]
**Priority:** P1 (High)
**Description:** Verify cancel button in delete dialog preserves photo
**Preconditions:**
- User owns a photo

**Test Steps:**
1. Upload photo "Photo to Keep"
2. Open photo detail page
3. Click "Delete" button
4. **Dismiss/Cancel confirmation dialog**

**Expected Results:**
- User stays on photo detail page
- Photo still displays
- Photo still visible in "My Photos" tab
- No changes to database

---

### Validation Tests (2 tests)

#### E2E-012: Reject Non-Image File (Text File) [P1]
**Priority:** P1 (High)
**Description:** Verify file type validation rejects non-image files
**Preconditions:**
- Test fixture `invalid-file.txt` available

**Test Steps:**
1. Navigate to Gallery upload page
2. Select invalid-file.txt (text/plain)
3. Attempt to submit form

**Expected Results:**
- Error message: "Only image files (JPEG, PNG, GIF, WebP) are allowed"
- User stays on upload page
- File is NOT uploaded

---

#### E2E-013: Reject PDF File [P2]
**Priority:** P2 (Medium)
**Description:** Verify PDF files are rejected (even though they're binary)
**Preconditions:**
- Test fixture `invalid-file.pdf` available

**Test Steps:**
1. Navigate to Gallery upload page
2. Select invalid-file.pdf (application/pdf)
3. Attempt to submit form

**Expected Results:**
- Error message: "Only image files (JPEG, PNG, GIF, WebP) are allowed"
- PDF file rejected
- User stays on upload page

---

### Pagination Tests (2 tests)

#### E2E-014: Pagination in My Photos [P1]
**Priority:** P1 (High)
**Description:** Verify pagination works correctly in My Photos tab
**Preconditions:**
- Page size is 12 photos
- User has more than 12 photos

**Test Steps:**
1. Bulk upload 15 photos (exceeds page size)
2. Navigate to "My Photos" tab
3. Verify page 1 shows max 12 photos
4. Verify pagination controls visible
5. Click "Next →" button
6. Verify page 2 shows remaining 3 photos

**Expected Results:**
- Page 1: 12 photos displayed
- "Next →" button visible
- Page indicator: "Page 1 of 2"
- Page 2: 3 photos displayed
- "← Previous" button visible
- "Next →" button disabled or hidden

---

#### E2E-015: Pagination in Public Photos [P2]
**Priority:** P2 (Medium)
**Description:** Verify pagination works in Public Photos tab
**Preconditions:**
- Multiple users have uploaded public photos
- Total public photos > 12

**Test Steps:**
1. Bulk upload 15 PUBLIC photos
2. Navigate to "Public Photos" tab
3. Verify page 1 shows max 12 photos
4. Navigate to page 2

**Expected Results:**
- Same pagination behavior as My Photos
- Only public photos counted toward pagination
- Private photos NOT included in page count

---

### Authorization Tests (2 tests)

#### E2E-016: Cannot Edit Another User's Photo [P1]
**Priority:** P1 (High)
**Description:** Verify users cannot edit photos they don't own
**Preconditions:**
- User A has uploaded a public photo
- User B is logged in (different account)

**Test Steps:**
1. Login as User A
2. Upload public photo "User A Photo"
3. Logout and login as User B
4. Navigate to "Public Photos" tab
5. Click on "User A Photo"

**Expected Results:**
- User B can VIEW the photo
- **Edit button is NOT visible** to User B
- **Delete button is NOT visible** to User B
- Only photo owner sees Edit/Delete buttons

---

#### E2E-017: Cannot Delete Another User's Photo [P2]
**Priority:** P2 (Medium)
**Description:** Verify delete authorization boundary
**Preconditions:**
- User A has uploaded a public photo
- User B is logged in

**Test Steps:**
1. Login as User A
2. Upload public photo "User A Photo"
3. Logout and login as User B
4. Navigate to "Public Photos" tab
5. Open "User A Photo" detail

**Expected Results:**
- User B can VIEW the photo
- **Delete button NOT visible** to User B
- Edit button also NOT visible
- No way for User B to delete User A's photo

---

### Persistence Tests (2 tests)

#### E2E-018: Photos Persist After Page Refresh [P1]
**Priority:** P1 (High)
**Description:** Verify photos are saved to database (not just frontend state)
**Preconditions:**
- User has uploaded photos

**Test Steps:**
1. Upload 2 photos (1 private, 1 public)
2. Navigate to "My Photos" tab
3. **Refresh browser (F5 / page.reload())**
4. Verify photos still visible

**Expected Results:**
- Both photos reappear after refresh
- Data loaded from database
- Photos not lost (proves database persistence)
- Privacy settings maintained

---

#### E2E-019: Privacy Setting Persists After Refresh [P2]
**Priority:** P2 (Medium)
**Description:** Verify privacy toggle is saved permanently
**Preconditions:**
- User has uploaded photos with different privacy settings

**Test Steps:**
1. Upload "Private Photo Persist" (private)
2. Upload "Public Photo Persist" (public)
3. Refresh browser
4. Navigate to "My Photos" tab

**Expected Results:**
- Privacy badges still display correctly
- Public photo still in "Public Photos" tab
- Private photo NOT in "Public Photos" tab
- Privacy settings loaded from database

---

### Complete Journey Test (1 test)

#### E2E-020: Complete Gallery Workflow [P0]
**Priority:** P0 (Critical)
**Description:** End-to-end test covering full lifecycle
**Preconditions:**
- None (fresh user)

**Test Steps:**
1. Register new user
2. Login
3. Upload photo (private) with title "Journey Photo"
4. View photo in "My Photos" tab
5. Open photo detail
6. Edit metadata and change to public
7. Verify photo in "Public Photos" tab
8. Delete photo
9. Verify photo removed from all tabs

**Expected Results:**
- Complete flow works without errors
- All state transitions work correctly
- Photo lifecycle: Upload → View → Edit → Delete
- Proper redirects and navigation

---

## Success Criteria

### Functional Requirements

✅ **All 20 tests implemented**
- Each test follows specification exactly
- Clear Given/When/Then structure
- Proper assertions for all expected results

✅ **100% test pass rate**
- All tests passing consistently (3+ runs)
- No flaky tests
- Cross-browser compatibility (Chromium, Firefox, WebKit)

✅ **Complete coverage**
- Upload, View, Edit, Delete operations ✅
- Validation (file size, file type) ✅
- Pagination (My Photos, Public Photos) ✅
- Authorization (multi-user scenarios) ✅
- Persistence (database verification) ✅

### Non-Functional Requirements

✅ **Performance**
- Test suite completes in < 10 minutes
- No hardcoded waits (use Playwright auto-wait)
- Bulk data creation via API for speed

✅ **Reliability**
- Tests run in isolation (no dependencies)
- Proper test data cleanup or acceptance
- Stable selectors (semantic or data-testid)

✅ **Maintainability**
- Reusable helper functions
- Clear function names and documentation
- TypeScript types throughout
- Code follows project conventions

✅ **Documentation**
- Test scenarios documented
- Helper functions documented
- Learning outcomes captured
- Known limitations documented

---

## Prerequisites

### Development Environment

**Before Starting:**
- [ ] Backend running on `localhost:8081`
- [ ] Frontend running on `localhost:3005`
- [ ] PostgreSQL database running
- [ ] Playwright installed (`npm install`)
- [ ] Test fixtures in place

**Environment Check:**
```bash
# Backend
cd backend/ikp-labs-api
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev

# Tests
npx playwright test --help
```

### Test Fixtures Required

**Image Files:**
- `tests/fixtures/images/test-photo.jpg` (385 bytes) - Valid JPEG
- `tests/fixtures/images/test-photo.png` (97 bytes) - Valid PNG
- `tests/fixtures/images/large-image.jpg` (6MB) - Size validation
- `tests/fixtures/images/invalid-file.txt` (88 bytes) - Type validation
- `tests/fixtures/images/invalid-file.pdf` (~300 bytes) - Type validation

---

## Out of Scope

The following are explicitly **NOT** included in this test plan:

❌ **Features Not Tested:**
- Photo albums/collections (not implemented)
- Photo comments (future feature)
- Photo sharing via URL (future feature)
- Photo download functionality
- Photo sorting options
- Photo search/filter
- Batch operations (multi-select delete)

❌ **Testing Types Not Included:**
- Performance/load testing (separate plan)
- Visual regression testing (future)
- Accessibility testing (future)
- Mobile/responsive testing (future)
- Cross-device testing

❌ **Infrastructure:**
- CI/CD integration (separate plan)
- Test parallelization optimization
- Test reporting dashboards
- Automated screenshot comparison

---

## Risk Assessment

### High Risk Areas

**1. File Upload Timing**
- **Risk:** File upload may have inconsistent timing across browsers
- **Mitigation:** Use `waitForURL()` and Playwright auto-wait instead of fixed timeouts

**2. Multi-User Scenarios**
- **Risk:** Complex test setup with multiple accounts
- **Mitigation:** Use helper functions to simplify user creation and switching

**3. Pagination Data Setup**
- **Risk:** Uploading 15+ photos via UI is slow (~60 seconds)
- **Mitigation:** Use `bulkUploadPhotosViaAPI()` helper (10x faster)

### Medium Risk Areas

**4. Dialog Handling**
- **Risk:** Confirmation dialogs may not be handled correctly
- **Mitigation:** Use `page.once('dialog')` pattern before clicking

**5. State Management**
- **Risk:** Frontend state may not update after API calls
- **Mitigation:** Test persistence with `page.reload()` to verify database state

---

## Acceptance Criteria

### Definition of Done

**Code:**
- ✅ All 20 tests implemented in `tests/e2e/gallery.spec.ts`
- ✅ Helper functions in `tests/e2e/helpers/gallery-helpers.ts`
- ✅ All tests passing on 3 browsers
- ✅ TypeScript types throughout
- ✅ Code follows project conventions

**Documentation:**
- ✅ All 4 plan documents complete (README, requirements, tech-docs, delivery)
- ✅ Journal entry with daily progress
- ✅ Helper functions documented
- ✅ Known issues documented

**Quality:**
- ✅ 100% test pass rate (all 20 tests)
- ✅ No flaky tests (3+ consistent runs)
- ✅ Code review completed
- ✅ Bug discovery documented (if any)

**Portfolio:**
- ✅ 6-day GitHub commit streak
- ✅ Atomic commits (2-5 commits per day)
- ✅ Professional commit messages
- ✅ Ready for LinkedIn post

---

## References

### Similar Test Plans
- [Profile Picture E2E Tests](../2024-11-04__profile-picture-e2e/) - 10 tests, file upload patterns
- [Gallery Feature Plan](../2024-11-24__photo-gallery-feature/) - Feature implementation reference

### Technical Documentation
- [Test Plan Checklist Strategy](../../docs/explanation/testing/test-plan-checklist-strategy.md)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [File Upload Testing](https://playwright.dev/docs/input#upload-files)

### Implementation Files
- [`tests/e2e/gallery.spec.ts`](../../tests/e2e/gallery.spec.ts) - Test implementation
- [`tests/e2e/helpers/gallery-helpers.ts`](../../tests/e2e/helpers/gallery-helpers.ts) - Helper functions

---

**Document Version:** 1.0
**Status:** ✅ COMPLETED
**Last Updated:** December 8, 2024

**Back to:** [Main README](README.md) | **Next:** [Technical Documentation](tech-docs.md)
