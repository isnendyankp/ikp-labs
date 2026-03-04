# Profile Picture E2E Tests - Technical Design

**Status:** COMPLETED
**Last Updated:** November 4, 2024

---

## Overview

This document provides technical implementation details for the Profile Picture E2E tests.

**Back to:** [Main README](README.md) | **See also:** [Requirements](requirements.md) | [Checklist](checklist.md)

---

## Test Architecture

### File Structure

```
tests/
├── e2e/
│   ├── profile-picture.spec.ts    # E2E test file
│   └── helpers/
│       └── auth-helpers.ts        # Authentication helpers
├── fixtures/
│   ├── valid-profile.jpg          # Valid JPEG (< 1MB)
│   ├── valid-profile.png          # Valid PNG (< 1MB)
│   ├── large-image.jpg            # Size validation (> 5MB)
│   └── invalid-file.txt           # Type validation
└── ...
```

---

## Playwright Selectors

### Upload Form

```typescript
// Upload button
'input[type="file"]'

// Upload submit button
'button:has-text("Upload")'

// File input
const fileInput = page.locator('input[type="file"]')
```

### Profile Picture Display

```typescript
// Delete button
'button:has-text("Delete Picture")'

// Profile picture image
'img[alt*="profile picture"]'

// Avatar fallback (initials)
'div:has-text("initials")'

// Success messages
'text=/uploaded successfully/i'
'text=/deleted successfully/i'
```

---

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

---

## API Endpoints Tested

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile/upload-picture` | Upload profile picture (multipart/form-data) |
| DELETE | `/api/profile/picture` | Delete profile picture |
| GET | `/api/profile/picture` | Get current picture |

---

## Error Handling Tests

### Upload Errors

| Error | Message |
|-------|---------|
| File too large | "File size exceeds 5MB" |
| Invalid format | "Only JPEG, PNG, GIF allowed" |
| Network error | "Upload failed, try again" |
| No file selected | Button disabled or warning |

### Delete Errors

| Error | Message |
|-------|---------|
| Network error | "Delete failed, try again" |
| User cancels | No action taken |

---

## Test Implementation Steps

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

---

## Timeline

| Task | Estimated Time |
|------|----------------|
| Planning | Complete (this document) |
| Implementation | 1-2 hours |
| Testing & Debug | 30 minutes |
| Documentation | 15 minutes |
| **Total** | ~2-3 hours |

---

## Notes

- Use unique email per test run (timestamp-based)
- Clean up localStorage before each test
- Use proper waits (avoid arbitrary timeouts)
- Test both happy path and error cases
- Ensure tests are idempotent (can run multiple times)

---

## Future Enhancements

- Test profile picture on user profile page
- Test profile picture in navigation bar
- Test cropping/resizing (if added)
- Test profile picture visibility to other users
- Performance testing (large files)

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 4, 2024

**Back to:** [Main README](README.md) | **Next:** [Checklist](checklist.md)
