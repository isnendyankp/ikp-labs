# E2E Gallery Test Scenarios - Complete Reference

## 📋 Overview

**Total Scenarios:** 20 E2E tests
**Priority Breakdown:**
- **P0 (Critical):** 8 tests - Core functionality, must work
- **P1 (High):** 7 tests - Important features, should work
- **P2 (Medium):** 5 tests - Nice to have, can defer

**Test Format:** Given/When/Then (Gherkin-style)
**Implementation Order:** By day (Monday-Saturday)

---

## 📁 Test Scenario Categories

1. **Upload Flow (4 tests):** E2E-001, E2E-002, E2E-003, E2E-011
2. **View/Navigation (3 tests):** E2E-004, E2E-005, E2E-006
3. **Edit/Update (2 tests):** E2E-007, E2E-008
4. **Delete (2 tests):** E2E-009, E2E-010
5. **Validation (2 tests):** E2E-012, E2E-013
6. **Pagination (2 tests):** E2E-014, E2E-015
7. **Authorization (2 tests):** E2E-016, E2E-017
8. **Persistence (2 tests):** E2E-018, E2E-019
9. **Complete Journey (1 test):** E2E-020

---

## 🧪 Detailed Test Scenarios

### E2E-001: Upload Single Photo Successfully [P0]
**Category:** Upload Flow
**Day:** Day 1 (Monday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** None (first test!)

**Scenario:**
```gherkin
Given: User is registered and logged in
When: User navigates to /gallery/upload
And: User selects valid photo file (test-photo.jpg)
And: User enters title "Sunset Beach"
And: User enters description "Beautiful sunset view"
And: User keeps isPublic unchecked (default: private)
And: User clicks "Upload Photo" button
Then: Success message appears
And: User is automatically redirected to /gallery
And: Photo appears in "My Photos" tab
And: Photo shows "Private" privacy badge
And: Photo displays title "Sunset Beach"
And: Photo displays description "Beautiful sunset view"
```

**Test Implementation:**
```typescript
test('should upload single photo successfully', async ({ page }) => {
  // GIVEN: User is registered and logged in
  const { user } = await createAuthenticatedGalleryUser(page);

  // WHEN: User uploads photo
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Sunset Beach',
    description: 'Beautiful sunset view',
    isPublic: false
  });

  // THEN: Photo appears in My Photos with correct data
  await viewMyPhotos(page);
  await verifyPhotoInGrid(page, 'Sunset Beach');
  await verifyPhotoPrivacy(page, 'Sunset Beach', false);
});
```

**Selectors:**
- File input: `input[type="file"]`
- Title input: `input[type="text"]`
- Description textarea: `textarea`
- Public checkbox: `input#isPublic`
- Upload button: `button[type="submit"]:has-text("Upload Photo")`

**Assertions:**
- Photo card visible in grid
- Privacy badge shows "Private"
- Title matches input
- Redirect to `/gallery` successful

---

### E2E-002: Upload Photo as Public [P0]
**Category:** Upload Flow
**Day:** Day 2 (Tuesday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-001

**Scenario:**
```gherkin
Given: User is logged in
When: User navigates to /gallery/upload
And: User selects photo file (test-photo.jpg)
And: User enters title "Public Sunset"
And: User checks "Make this photo public" checkbox
And: User clicks "Upload Photo"
Then: Photo appears in "My Photos" tab
And: Photo shows "Public" privacy badge
When: User clicks "Public Photos" tab
Then: Photo also appears in "Public Photos" gallery
And: Photo accessible to all users (not owner-restricted)
```

**Test Implementation:**
```typescript
test('should upload photo as public', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Public Sunset',
    isPublic: true
  });

  // Verify in My Photos
  await viewMyPhotos(page);
  await verifyPhotoInGrid(page, 'Public Sunset');
  await verifyPhotoPrivacy(page, 'Public Sunset', true);

  // Verify in Public Photos
  await viewPublicPhotos(page);
  await verifyPhotoInGrid(page, 'Public Sunset');
});
```

**Key Difference from E2E-001:**
- Checkbox `input#isPublic` is checked
- Photo appears in both My Photos AND Public Photos
- Privacy badge shows "Public" instead of "Private"

---

### E2E-003: Upload Multiple Photos Sequentially [P1]
**Category:** Upload Flow
**Day:** Day 2 (Tuesday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** E2E-001

**Scenario:**
```gherkin
Given: User is logged in
When: User uploads photo #1 with title "First Photo"
And: User uploads photo #2 with title "Second Photo"
And: User uploads photo #3 with title "Third Photo"
And: User navigates to /gallery
Then: All 3 photos displayed in "My Photos" tab
And: Photos ordered by upload date (newest first)
And: All photos have correct titles
And: Photo count shows 3 photos
```

**Test Implementation:**
```typescript
test('should upload multiple photos sequentially', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload 3 photos
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'First Photo' });
  await uploadGalleryPhoto(page, 'test-photo.png', { title: 'Second Photo' });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Third Photo' });

  // Verify all appear in My Photos
  await viewMyPhotos(page);
  await verifyPhotoInGrid(page, 'First Photo');
  await verifyPhotoInGrid(page, 'Second Photo');
  await verifyPhotoInGrid(page, 'Third Photo');

  // Verify order (newest first)
  const titles = await page.locator('h3').allTextContents();
  expect(titles[0]).toBe('Third Photo'); // Most recent
});
```

**Purpose:**
- Test multiple upload flow
- Verify no data overlap/corruption
- Test chronological ordering

---

### E2E-004: View My Photos Shows All Owned Photos [P0]
**Category:** View/Navigation
**Day:** Day 3 (Wednesday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-001, E2E-002

**Scenario:**
```gherkin
Given: User has uploaded 2 public photos and 3 private photos
When: User navigates to /gallery
And: User clicks "My Photos" tab
Then: All 5 photos are displayed (both public and private)
And: Each photo shows correct privacy badge
And: Photos displayed in grid layout (3-4 columns)
And: Each photo card shows: image, title, description, privacy badge, date
```

**Test Implementation:**
```typescript
test('should view My Photos shows all owned photos', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload 2 public + 3 private
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Public 1', isPublic: true });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Public 2', isPublic: true });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Private 1', isPublic: false });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Private 2', isPublic: false });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Private 3', isPublic: false });

  // View My Photos
  await viewMyPhotos(page);

  // Verify all 5 photos
  const photoCards = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(photoCards).toHaveCount(5);

  // Verify privacy badges
  await expect(page.locator('span:has-text("Public")')).toHaveCount(2);
  await expect(page.locator('span:has-text("Private")')).toHaveCount(3);
});
```

---

### E2E-005: View Public Photos Shows Only Public [P0]
**Category:** View/Navigation
**Day:** Day 3 (Wednesday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-002

**Scenario:**
```gherkin
Given: User A has 2 public photos and 1 private photo
And: User B has 3 public photos
When: User A clicks "Public Photos" tab
Then: 5 public photos are displayed (2 from A + 3 from B)
And: All photos show "Public" privacy badge
And: Private photo is NOT displayed
And: Photos from multiple users are aggregated
And: No ownership restriction (all public photos visible)
```

**Test Implementation:**
```typescript
test('should view Public Photos shows only public', async ({ page, context }) => {
  // User A uploads 2 public + 1 private
  const { user: userA } = await createAuthenticatedGalleryUser(page);
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'A Public 1', isPublic: true });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'A Public 2', isPublic: true });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'A Private 1', isPublic: false });

  // User B uploads 3 public
  const page2 = await context.newPage();
  const { user: userB } = await createAuthenticatedGalleryUser(page2);
  await uploadGalleryPhoto(page2, 'test-photo.jpg', { title: 'B Public 1', isPublic: true });
  await uploadGalleryPhoto(page2, 'test-photo.jpg', { title: 'B Public 2', isPublic: true });
  await uploadGalleryPhoto(page2, 'test-photo.jpg', { title: 'B Public 3', isPublic: true });

  // User A views Public Photos
  await viewPublicPhotos(page);

  // Verify 5 public photos (not 6)
  const photoCards = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(photoCards).toHaveCount(5);

  // Verify private photo NOT shown
  await expect(page.locator('h3:has-text("A Private 1")')).toHaveCount(0);

  // Verify all badges are "Public"
  await expect(page.locator('span:has-text("Private")')).toHaveCount(0);
});
```

**Key Learning:**
- Public gallery aggregates from all users
- Privacy filtering works correctly
- Multi-user scenario testing

---

### E2E-006: View Photo Detail Shows Complete Info [P0]
**Category:** View/Navigation
**Day:** Day 3 (Wednesday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-001

**Scenario:**
```gherkin
Given: User has uploaded photo with complete metadata
When: User clicks on photo card in gallery
Then: Photo detail page opens (/gallery/[id])
And: Full-size photo is displayed
And: Photo title is displayed
And: Photo description is displayed
And: Upload date is displayed
And: Privacy badge is displayed (Public or Private)
And: "Edit" button is visible (owner only)
And: "Delete" button is visible (owner only)
And: "← Back to Gallery" button is visible
```

**Test Implementation:**
```typescript
test('should view photo detail shows complete info', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Detailed Photo',
    description: 'This is a detailed description',
    isPublic: false
  });

  await viewMyPhotos(page);

  // Click photo to open detail
  await page.click('h3:has-text("Detailed Photo")');
  await expect(page).toHaveURL(/\/gallery\/\d+/);

  // Verify all elements present
  await expect(page.locator('img[alt*="photo"]')).toBeVisible();
  await expect(page.locator('text=Detailed Photo')).toBeVisible();
  await expect(page.locator('text=This is a detailed description')).toBeVisible();
  await expect(page.locator('span:has-text("Private")')).toBeVisible();
  await expect(page.locator('button:has-text("Edit")')).toBeVisible();
  await expect(page.locator('button:has-text("Delete")')).toBeVisible();
  await expect(page.locator('button:has-text("← Back to Gallery")')).toBeVisible();
});
```

---

### E2E-007: Edit Photo Title and Description [P0]
**Category:** Edit/Update
**Day:** Day 4 (Thursday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-006

**Scenario:**
```gherkin
Given: User is viewing photo detail page
When: User clicks "Edit" button
Then: Title input appears with current value pre-filled
And: Description textarea appears with current value pre-filled
And: Privacy checkbox shows current state
When: User changes title to "Updated Title"
And: User changes description to "New description text"
And: User clicks "Save Changes"
Then: Success message appears
And: Title displays "Updated Title"
And: Description displays "New description text"
And: Edit mode closes (Edit button reappears)
And: Changes persist on page refresh
```

**Test Implementation:**
```typescript
test('should edit photo title and description', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Original Title',
    description: 'Original description'
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("Original Title")');

  // Enter edit mode
  await page.click('button:has-text("Edit")');

  // Verify fields pre-filled
  await expect(page.locator('input[type="text"]')).toHaveValue('Original Title');
  await expect(page.locator('textarea')).toHaveValue('Original description');

  // Update fields
  await page.fill('input[type="text"]', 'Updated Title');
  await page.fill('textarea', 'New description text');

  // Save changes
  await page.click('button:has-text("Save Changes")');
  await page.waitForTimeout(1000);

  // Verify updates displayed
  await expect(page.locator('text=Updated Title')).toBeVisible();
  await expect(page.locator('text=New description text')).toBeVisible();
  await expect(page.locator('button:has-text("Edit")')).toBeVisible();
});
```

---

### E2E-008: Toggle Privacy from Private to Public [P1]
**Category:** Edit/Update
**Day:** Day 4 (Thursday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** E2E-007

**Scenario:**
```gherkin
Given: User has uploaded a private photo
When: User opens photo detail page
And: User clicks "Edit"
And: User checks "Make this photo public" checkbox
And: User clicks "Save Changes"
Then: Privacy badge changes from "Private" to "Public"
When: User navigates to /gallery
And: User clicks "Public Photos" tab
Then: Photo now appears in public gallery
And: Photo is accessible to all users (not just owner)
```

**Test Implementation:**
```typescript
test('should toggle privacy from private to public', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload private photo
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Privacy Toggle Test',
    isPublic: false
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("Privacy Toggle Test")');

  // Verify initially private
  await expect(page.locator('span:has-text("Private")')).toBeVisible();

  // Toggle to public
  await page.click('button:has-text("Edit")');
  await page.check('input#isPublic');
  await page.click('button:has-text("Save Changes")');
  await page.waitForTimeout(1000);

  // Verify now public
  await expect(page.locator('span:has-text("Public")')).toBeVisible();

  // Verify appears in Public Photos
  await viewPublicPhotos(page);
  await verifyPhotoInGrid(page, 'Privacy Toggle Test');
});
```

---

### E2E-009: Delete Photo with Confirmation [P0]
**Category:** Delete
**Day:** Day 4 (Thursday)
**Estimated Time:** 1 hour
**Priority:** P0 - Critical
**Dependencies:** E2E-006

**Scenario:**
```gherkin
Given: User is viewing photo detail page
When: User clicks "Delete" button
Then: Browser confirmation dialog appears
And: Dialog message asks "Are you sure you want to delete this photo?"
When: User clicks "OK" in confirmation dialog
Then: Success message "Photo deleted successfully" appears
And: User is automatically redirected to /gallery
And: Photo no longer appears in "My Photos"
When: User tries to access deleted photo URL directly
Then: 404 Not Found page appears
```

**Test Implementation:**
```typescript
test('should delete photo with confirmation', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Photo to Delete'
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("Photo to Delete")');

  const photoUrl = page.url();

  // Delete photo with dialog handling
  await deleteGalleryPhoto(page);

  // Verify redirected to gallery
  await expect(page).toHaveURL('/gallery');

  // Verify photo no longer in My Photos
  await viewMyPhotos(page);
  await expect(page.locator('h3:has-text("Photo to Delete")')).toHaveCount(0);

  // Verify direct URL returns 404
  await page.goto(photoUrl);
  await expect(page.locator('text=/404|Not Found/i')).toBeVisible();
});
```

**Helper Function:**
```typescript
async function deleteGalleryPhoto(page: Page) {
  page.once('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  await page.click('button:has-text("Delete")');
  await page.waitForURL('/gallery', { timeout: 5000 });
  await page.waitForTimeout(1000);
}
```

---

### E2E-010: Cancel Delete Keeps Photo [P1]
**Category:** Delete
**Day:** Day 4 (Thursday)
**Estimated Time:** 0.5 hour
**Priority:** P1 - High
**Dependencies:** E2E-009

**Scenario:**
```gherkin
Given: User is viewing photo detail page
When: User clicks "Delete" button
And: Confirmation dialog appears
When: User clicks "Cancel" in dialog
Then: Dialog closes
And: Photo detail page is still displayed
And: Photo is NOT deleted
And: Photo still appears in "My Photos" gallery
```

**Test Implementation:**
```typescript
test('should cancel delete keeps photo', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Photo to Keep'
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("Photo to Keep")');

  const photoUrl = page.url();

  // Cancel delete
  page.once('dialog', async dialog => {
    await dialog.dismiss(); // Cancel instead of accept
  });

  await page.click('button:has-text("Delete")');
  await page.waitForTimeout(1000);

  // Verify still on detail page
  await expect(page).toHaveURL(photoUrl);

  // Verify still in My Photos
  await viewMyPhotos(page);
  await verifyPhotoInGrid(page, 'Photo to Keep');
});
```

---

### E2E-011: Reject File Larger than 5MB [P1]
**Category:** Validation
**Day:** Day 2 (Tuesday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** None

**Scenario:**
```gherkin
Given: User is on /gallery/upload page
When: User selects a file larger than 5MB (large-image.jpg)
Then: Error message "File too large. Maximum size is 5MB." appears
And: Upload button is disabled OR submission prevented
And: No photo is created in database
And: User remains on upload page
```

**Test Implementation:**
```typescript
test('should reject file larger than 5MB', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await page.goto('/gallery/upload');

  // Try to upload large file
  const fixturePath = path.join(__dirname, '../fixtures', 'large-image.jpg');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  // Wait for validation
  await page.waitForTimeout(1000);

  // Verify error message
  await expect(page.locator('text=/File too large|Maximum size is 5MB/i')).toBeVisible();

  // Verify upload button disabled or submission fails
  const uploadButton = page.locator('button[type="submit"]:has-text("Upload Photo")');
  await expect(uploadButton).toBeDisabled();

  // Verify no photo created (check My Photos)
  await page.goto('/gallery');
  await viewMyPhotos(page);
  const photoCards = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(photoCards).toHaveCount(0);
});
```

**Test Fixture Required:**
- `tests/fixtures/large-image.jpg` (>5MB file)

---

### E2E-012: Reject Non-Image File [P1]
**Category:** Validation
**Day:** Day 5 (Friday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** None

**Scenario:**
```gherkin
Given: User is on /gallery/upload page
When: User selects a non-image file (.txt file)
Then: Error message "File type not allowed. Please use JPG, PNG, GIF, or WebP." appears
And: Upload is prevented
And: No photo is created
```

**Test Implementation:**
```typescript
test('should reject non-image file', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await page.goto('/gallery/upload');

  // Try to upload .txt file
  const fixturePath = path.join(__dirname, '../fixtures', 'invalid-file.txt');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  await page.waitForTimeout(1000);

  // Verify error message
  await expect(page.locator('text=/File type not allowed|Please use JPG, PNG/i')).toBeVisible();
});
```

---

### E2E-013: Reject Invalid File Format (PDF) [P2]
**Category:** Validation
**Day:** Day 5 (Friday)
**Estimated Time:** 0.5 hour
**Priority:** P2 - Medium
**Dependencies:** E2E-012

**Scenario:**
```gherkin
Given: User is on /gallery/upload page
When: User selects a PDF file
Then: Error message about invalid file type appears
And: Upload is prevented
```

**Test Implementation:**
```typescript
test('should reject invalid file format (PDF)', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await page.goto('/gallery/upload');

  const fixturePath = path.join(__dirname, '../fixtures', 'invalid-file.pdf');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  await page.waitForTimeout(1000);

  await expect(page.locator('text=/File type not allowed|invalid/i')).toBeVisible();
});
```

**Test Fixture Required:**
- `tests/fixtures/invalid-file.pdf` (create a small PDF)

---

### E2E-014: Pagination in My Photos [P1]
**Category:** Pagination
**Day:** Day 6 (Saturday)
**Estimated Time:** 1.5 hour
**Priority:** P1 - High
**Dependencies:** E2E-003

**Scenario:**
```gherkin
Given: User has uploaded 15 photos (page size = 12)
When: User views "My Photos" tab
Then: Page indicator shows "Page 1 of 2"
And: 12 photos are displayed on page 1
And: "Previous" button is disabled
And: "Next" button is enabled
When: User clicks "Next →" button
Then: Page indicator shows "Page 2 of 2"
And: 3 photos are displayed on page 2
And: "Previous" button is enabled
And: "Next" button is disabled
When: User clicks "← Previous" button
Then: User returns to page 1
```

**Test Implementation:**
```typescript
test('should paginate correctly in My Photos', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload 15 photos via bulk helper
  await bulkUploadPhotos(page, 15);

  await viewMyPhotos(page);

  // Page 1 verification
  await expect(page.locator('text=/Page 1 of 2/')).toBeVisible();
  const page1Photos = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(page1Photos).toHaveCount(12);

  const prevButton = page.locator('button:has-text("← Previous")');
  const nextButton = page.locator('button:has-text("Next →")');
  await expect(prevButton).toBeDisabled();
  await expect(nextButton).toBeEnabled();

  // Navigate to page 2
  await nextButton.click();
  await page.waitForTimeout(1000);

  // Page 2 verification
  await expect(page.locator('text=/Page 2 of 2/')).toBeVisible();
  const page2Photos = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(page2Photos).toHaveCount(3);
  await expect(prevButton).toBeEnabled();
  await expect(nextButton).toBeDisabled();

  // Navigate back to page 1
  await prevButton.click();
  await page.waitForTimeout(1000);
  await expect(page.locator('text=/Page 1 of 2/')).toBeVisible();
});
```

**Helper Function Required:**
```typescript
async function bulkUploadPhotos(page: Page, count: number) {
  for (let i = 1; i <= count; i++) {
    await uploadGalleryPhoto(page, 'test-photo.jpg', {
      title: `Photo ${i}`
    });
  }
}
```

---

### E2E-015: Pagination in Public Photos [P2]
**Category:** Pagination
**Day:** Day 6 (Saturday)
**Estimated Time:** 1.5 hour
**Priority:** P2 - Medium
**Dependencies:** E2E-014

**Scenario:**
```gherkin
Given: Public gallery has 25 public photos from multiple users (page size = 12)
When: User views "Public Photos" tab
Then: First page shows 12 photos
And: Page indicator shows "Page 1 of 3"
When: User clicks "Next →" twice
Then: Page 3 shows 1 photo
And: Page indicator shows "Page 3 of 3"
```

**Test Implementation:**
Similar to E2E-014 but uses Public Photos tab and multiple users.

---

### E2E-016: Cannot Edit Other User's Photo [P1]
**Category:** Authorization
**Day:** Day 6 (Saturday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** E2E-006

**Scenario:**
```gherkin
Given: User A has uploaded a photo with id=100
When: User B navigates to /gallery/100
Then: Photo is displayed (if public) OR 403 error (if private)
But: "Edit" button is NOT visible
And: "Delete" button is NOT visible
And: Only owner (User A) sees action buttons
```

**Test Implementation:**
```typescript
test('cannot edit other user\'s photo', async ({ page, context }) => {
  // User A uploads photo
  const { user: userA } = await createAuthenticatedGalleryUser(page);
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'User A Photo',
    isPublic: true
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("User A Photo")');
  const photoUrl = page.url();

  // User B tries to access
  const page2 = await context.newPage();
  const { user: userB } = await createAuthenticatedGalleryUser(page2);

  await page2.goto(photoUrl);

  // Verify photo visible but no edit/delete buttons
  await expect(page2.locator('text=User A Photo')).toBeVisible();
  await expect(page2.locator('button:has-text("Edit")')).toHaveCount(0);
  await expect(page2.locator('button:has-text("Delete")')).toHaveCount(0);
});
```

---

### E2E-017: Cannot Delete Other User's Photo [P2]
**Category:** Authorization
**Day:** Day 6 (Saturday)
**Estimated Time:** 1 hour
**Priority:** P2 - Medium
**Dependencies:** E2E-016

**Scenario:**
Same as E2E-016 but explicitly tests that delete action is not available.

---

### E2E-018: Photos Persist After Page Refresh [P1]
**Category:** Persistence
**Day:** Day 5 (Friday)
**Estimated Time:** 1 hour
**Priority:** P1 - High
**Dependencies:** E2E-001

**Scenario:**
```gherkin
Given: User has uploaded 3 photos
When: User refreshes the browser page (F5)
Then: User remains logged in (token persists in localStorage)
And: All 3 photos still appear in "My Photos"
And: Photo details (title, description, privacy) are retained
And: No data loss occurs
```

**Test Implementation:**
```typescript
test('photos persist after page refresh', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Persist Test 1' });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Persist Test 2' });
  await uploadGalleryPhoto(page, 'test-photo.jpg', { title: 'Persist Test 3' });

  await viewMyPhotos(page);

  // Refresh page
  await page.reload();
  await page.waitForTimeout(1000);

  // Verify still on /gallery
  await expect(page).toHaveURL('/gallery');

  // Verify all photos still present
  await verifyPhotoInGrid(page, 'Persist Test 1');
  await verifyPhotoInGrid(page, 'Persist Test 2');
  await verifyPhotoInGrid(page, 'Persist Test 3');
});
```

---

### E2E-019: Privacy Setting Persists After Refresh [P2]
**Category:** Persistence
**Day:** Day 5 (Friday)
**Estimated Time:** 0.5 hour
**Priority:** P2 - Medium
**Dependencies:** E2E-008, E2E-018

**Scenario:**
```gherkin
Given: User has toggled photo privacy from private to public
When: User refreshes the page
Then: Photo still shows "Public" privacy badge
And: Photo still appears in Public Photos gallery
And: Privacy setting is not reverted
```

**Test Implementation:**
```typescript
test('privacy setting persists after refresh', async ({ page }) => {
  const { user } = await createAuthenticatedGalleryUser(page);

  // Upload private, toggle to public
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Privacy Persist',
    isPublic: false
  });

  await viewMyPhotos(page);
  await page.click('h3:has-text("Privacy Persist")');
  await page.click('button:has-text("Edit")');
  await page.check('input#isPublic');
  await page.click('button:has-text("Save Changes")');

  // Refresh
  await page.reload();

  // Verify still public
  await expect(page.locator('span:has-text("Public")')).toBeVisible();
});
```

---

### E2E-020: Complete Gallery Flow [P0]
**Category:** Complete Journey
**Day:** Day 6 (Saturday)
**Estimated Time:** 0.5 hour
**Priority:** P0 - Critical
**Dependencies:** All previous tests

**Scenario:**
```gherkin
Given: New user registers and logs in
When: User uploads a private photo
And: User views photo in "My Photos" tab
And: User edits photo to make it public
And: User verifies photo appears in "Public Photos" tab
And: User deletes the photo
Then: Photo is removed from all galleries (My Photos and Public Photos)
When: User logs out and logs back in
Then: Gallery is empty (fresh state verified)
And: Complete user journey works end-to-end
```

**Test Implementation:**
```typescript
test('complete gallery flow - full user journey', async ({ page }) => {
  // 1. Register and login
  const { user } = await createAuthenticatedGalleryUser(page);

  // 2. Upload private photo
  await uploadGalleryPhoto(page, 'test-photo.jpg', {
    title: 'Journey Test',
    description: 'Complete flow test',
    isPublic: false
  });

  // 3. Verify in My Photos
  await viewMyPhotos(page);
  await verifyPhotoInGrid(page, 'Journey Test');
  await verifyPhotoPrivacy(page, 'Journey Test', false);

  // 4. Edit to public
  await page.click('h3:has-text("Journey Test")');
  await page.click('button:has-text("Edit")');
  await page.check('input#isPublic');
  await page.click('button:has-text("Save Changes")');

  // 5. Verify in Public Photos
  await viewPublicPhotos(page);
  await verifyPhotoInGrid(page, 'Journey Test');

  // 6. Delete photo
  await viewMyPhotos(page);
  await page.click('h3:has-text("Journey Test")');
  await deleteGalleryPhoto(page);

  // 7. Verify removed from all galleries
  await viewMyPhotos(page);
  await expect(page.locator('h3:has-text("Journey Test")')).toHaveCount(0);

  await viewPublicPhotos(page);
  await expect(page.locator('h3:has-text("Journey Test")')).toHaveCount(0);

  // 8. Logout and login
  await page.click('button:has-text("Logout")');
  await page.waitForURL('/login');

  await page.goto('/login');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/home');

  // 9. Verify empty gallery
  await page.goto('/gallery');
  const photoCards = page.locator('.group.cursor-pointer.bg-white.rounded-lg');
  await expect(photoCards).toHaveCount(0);

  console.log('✅ Complete Gallery journey test passed!');
});
```

**Purpose:**
- End-to-end validation of all features
- Smoke test for entire Gallery module
- Regression test for critical path

---

## 📊 Test Priority Summary

### P0 Tests (8 tests - Must Complete)
1. E2E-001: Upload single photo
2. E2E-002: Upload as public
3. E2E-004: View My Photos
4. E2E-005: View Public Photos
5. E2E-006: View photo detail
6. E2E-007: Edit title/description
7. E2E-009: Delete photo
8. E2E-020: Complete journey

### P1 Tests (7 tests - Should Complete)
1. E2E-003: Upload multiple
2. E2E-008: Toggle privacy
3. E2E-010: Cancel delete
4. E2E-011: Reject large file
5. E2E-012: Reject non-image
6. E2E-014: Pagination My Photos
7. E2E-016: Cannot edit others
8. E2E-018: Persist after refresh

### P2 Tests (5 tests - Nice to Have)
1. E2E-013: Reject PDF
2. E2E-015: Pagination Public
3. E2E-017: Cannot delete others
4. E2E-019: Privacy persists

---

## 🎯 Estimated Effort

**Total:** ~26-34 hours across 6 days
**Average:** ~4-5 hours per day

---

**Created:** Sunday, Week 3 Planning Day
**Ready for:** Monday-Saturday execution
**Goal:** 20/20 tests passing by Saturday! 🚀
