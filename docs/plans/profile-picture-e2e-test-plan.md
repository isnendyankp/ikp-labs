# Profile Picture E2E Test Implementation Plan

## Overview
Create comprehensive E2E tests for the complete profile picture feature flow using Playwright.

## Test Coverage Scope

### Full User Journey Flow
```
Register → Login → Home → Upload Profile Picture → Delete Profile Picture → Logout
```

## Test Scenarios to Implement

### 1. Profile Picture Upload Flow
**Test:** `Should register, login, and upload profile picture`
- Register new user
- Login with credentials
- Navigate to home page
- Upload valid image file (JPEG/PNG)
- Verify image appears on page
- Verify success message
- Verify profile picture URL updated

### 2. Profile Picture Delete Flow
**Test:** `Should delete profile picture successfully`
- Use existing authenticated user with uploaded picture
- Click "Delete Picture" button
- Confirm deletion in dialog
- Verify picture removed from UI
- Verify fallback avatar appears (initials)
- Verify success message

### 3. Complete End-to-End Flow
**Test:** `Complete flow: Register → Login → Upload → Delete → Logout`
- Register new unique user
- Auto-redirect to home after registration
- Verify user info displayed
- Upload profile picture (valid image)
- Verify upload success
- Delete profile picture
- Verify delete success
- Logout successfully
- Verify redirected to login

### 4. Upload Validation Tests
**Test:** `Should reject invalid file uploads`
- Try to upload file > 5MB (should fail)
- Try to upload non-image file (should fail)
- Try to upload unsupported format (should fail)
- Verify error messages displayed

### 5. Profile Picture Persistence
**Test:** `Should persist profile picture after page refresh`
- Upload profile picture
- Refresh page
- Verify picture still displayed
- Verify no re-upload required

### 6. Multiple Upload/Delete Cycles
**Test:** `Should handle multiple upload and delete operations`
- Upload picture #1
- Delete picture #1
- Upload picture #2 (different image)
- Verify picture #2 displayed
- Delete picture #2
- Verify fallback avatar

## Technical Implementation Details

### Test File Structure
```
tests/e2e/profile-picture.spec.ts
```

### Helper Functions Needed
1. `createAuthenticatedUser()` - Register + Login helper
2. `uploadTestImage()` - Upload image helper with test fixtures
3. `deleteProfilePicture()` - Delete picture helper
4. `verifyImageDisplayed()` - Assertion helper
5. `verifyAvatarFallback()` - Check initials avatar

### Test Fixtures
Create test image files in `tests/fixtures/`:
- `valid-profile.jpg` (small, < 1MB)
- `valid-profile.png` (small, < 1MB)
- `large-image.jpg` (> 5MB, for validation test)
- `invalid-file.txt` (non-image, for validation test)

### Playwright Selectors
```typescript
// Upload button
'input[type="file"]'

// Upload submit button
'button:has-text("Upload")'

// Delete button
'button:has-text("Delete Picture")'

// Profile picture image
'img[alt*="profile picture"]'

// Avatar fallback
'div:has-text("initials")' // Contains user initials

// Success messages
'text=/uploaded successfully/i'
'text=/deleted successfully/i'
```

## Expected Behavior

### Upload Success Flow
1. User selects valid image file
2. Preview appears (optional)
3. Click "Upload" button
4. Loading state shows
5. Success message appears
6. Image displays on page
7. Old avatar hidden

### Delete Success Flow
1. User clicks "Delete Picture"
2. Confirmation dialog appears
3. User confirms
4. Loading state shows
5. Success message appears
6. Image removed
7. Avatar with initials appears

## Error Handling Tests

### Upload Errors
- File too large → Show "File size exceeds 5MB"
- Invalid format → Show "Only JPEG, PNG, GIF allowed"
- Network error → Show "Upload failed, try again"
- No file selected → Button disabled or warning

### Delete Errors
- Network error → Show "Delete failed, try again"
- User cancels → No action taken

## API Endpoints Tested
- `POST /api/profile/upload-picture` (multipart/form-data)
- `DELETE /api/profile/picture`
- `GET /api/profile/picture` (get current picture)

## Success Criteria
✅ All test scenarios pass
✅ Tests run independently (no dependencies)
✅ Tests clean up after themselves
✅ Tests use unique user data (no conflicts)
✅ Tests run in headless mode
✅ Tests complete in < 60 seconds total

## Implementation Steps

### Step 1: Create Test Fixtures
- Create `tests/fixtures/` directory
- Add test image files
- Add invalid file for validation tests

### Step 2: Create Helper Functions
- Extract common patterns into reusable helpers
- Add authentication helpers
- Add upload/delete helpers

### Step 3: Write Basic Upload Test
- Test file selection
- Test upload button click
- Test success verification

### Step 4: Write Basic Delete Test
- Test delete button click
- Test confirmation dialog
- Test success verification

### Step 5: Write Complete Flow Test
- Combine all steps into one flow
- Test full user journey
- Verify each step

### Step 6: Write Validation Tests
- Test file size validation
- Test file type validation
- Test error messages

### Step 7: Run and Debug
- Run tests locally
- Fix any flaky tests
- Optimize selectors
- Add proper waits

### Step 8: Document and Commit
- Update README with test instructions
- Commit test files
- Push to repository

## Timeline
- **Planning:** ✅ Complete (this document)
- **Implementation:** 1-2 hours
- **Testing & Debug:** 30 minutes
- **Documentation:** 15 minutes
- **Total:** ~2-3 hours

## Notes
- Use unique email per test run (timestamp-based)
- Clean up localStorage before each test
- Use proper waits (avoid arbitrary timeouts)
- Test both happy path and error cases
- Ensure tests are idempotent (can run multiple times)

## Future Enhancements
- Test profile picture on user profile page
- Test profile picture in navigation bar
- Test cropping/resizing (if added)
- Test profile picture visibility to other users
- Performance testing (large files)
