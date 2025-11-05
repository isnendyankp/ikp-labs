# Video Recording & Screenshot Guide for Playwright Tests

## Overview
This guide explains how to use video recording and screenshot capture features in Playwright for testing, debugging, and documentation purposes.

## Table of Contents
1. [Video Recording](#video-recording)
2. [Screenshot Capture](#screenshot-capture)
3. [Configuration](#configuration)
4. [Demo Test Suites](#demo-test-suites)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Video Recording

### What is Video Recording?
Video recording captures the entire browser session during test execution, creating a `.webm` file that shows:
- All user interactions (clicks, typing, scrolling)
- Page transitions and redirects
- Animations and loading states
- Error messages and validation

### Recording Modes

#### 1. `'on'` - Always Record
Records video for every test, regardless of pass/fail status.

```typescript
// In test file
test.use({ video: 'on' });
```

**Use Cases:**
- Demo videos for portfolio
- Tutorial content
- Feature showcases
- Documentation videos

#### 2. `'retain-on-failure'` - Default Mode
Only keeps videos when tests fail (deletes videos of passing tests).

```typescript
// In playwright.config.ts (default)
video: {
  mode: 'retain-on-failure',
  size: { width: 1280, height: 720 }
}
```

**Use Cases:**
- Debugging failed tests
- CI/CD pipelines (save space)
- Bug reports with video evidence

#### 3. `'off'` - No Recording
Disables video recording completely.

```typescript
test.use({ video: 'off' });
```

**Use Cases:**
- Performance testing (reduce overhead)
- Quick local test runs

### Video Output Location
```
test-results/artifacts/
└── [test-name]-[browser]-[retry]/
    └── video.webm
```

### Running Tests with Video

#### Example: Complete User Journey
```bash
# Run demo test with video recording
npx playwright test demo-video-recording --project=chromium

# Videos saved to: test-results/artifacts/
```

#### View Videos in HTML Report
```bash
# Generate and open HTML report
npx playwright show-report

# Videos are embedded in the report!
```

### What Gets Recorded?

#### Registration → Login → Upload Flow
1. **Registration** (0:00 - 0:15)
   - Navigate to `/registration`
   - Fill form fields
   - Upload profile picture
   - Submit form
   - Success redirect

2. **Login** (0:15 - 0:25)
   - Navigate to `/login`
   - Enter credentials
   - Submit login
   - Dashboard redirect

3. **Profile Update** (0:25 - 0:35)
   - Navigate to profile
   - Upload new photo
   - Verify success

**Total Duration:** ~35 seconds
**File Size:** ~2-5 MB (depends on activity)

---

## Screenshot Capture

### What is Screenshot Capture?
Screenshots capture static images of the browser state at specific moments during test execution.

### Screenshot Modes

#### 1. Automatic (on-failure)
Configured globally in `playwright.config.ts`:

```typescript
screenshot: {
  mode: 'only-on-failure',
  fullPage: true
}
```

**When it captures:**
- Test assertion fails
- Test throws an error
- Timeout occurs

#### 2. Manual (in test code)
Explicitly capture screenshots in your test:

```typescript
// Full page screenshot
await page.screenshot({
  path: 'screenshots/registration-page.png',
  fullPage: true
});

// Viewport only (visible area)
await page.screenshot({
  path: 'screenshots/above-fold.png',
  fullPage: false
});

// Element screenshot
await page.locator('form').screenshot({
  path: 'screenshots/form-only.png'
});
```

### Screenshot Types

#### 1. Full Page
Captures entire scrollable page content:
```typescript
await page.screenshot({
  path: 'full-page.png',
  fullPage: true
});
```

#### 2. Viewport Only
Captures only visible area (above the fold):
```typescript
await page.screenshot({
  path: 'viewport.png',
  fullPage: false
});
```

#### 3. Element Screenshot
Captures specific element only:
```typescript
const element = page.locator('.error-message');
await element.screenshot({
  path: 'error-message.png'
});
```

#### 4. Custom Clip Area
Captures specific coordinates:
```typescript
await page.screenshot({
  path: 'custom-area.png',
  clip: {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  }
});
```

### Screenshot Output Location
```
test-results/artifacts/screenshots/
├── 1-registration-empty-[timestamp].png
├── 2-registration-partial-[timestamp].png
├── 3-registration-errors-[timestamp].png
└── element-form-[timestamp].png
```

### Running Screenshot Tests

```bash
# Run all screenshot examples
npx playwright test demo-screenshot-capture --project=chromium

# Run specific example
npx playwright test demo-screenshot-capture -g "Manual Screenshot"

# View in UI mode
npx playwright test demo-screenshot-capture --ui
```

---

## Configuration

### Current Playwright Configuration

Location: [`playwright.config.ts`](../../playwright.config.ts)

```typescript
export default defineConfig({
  // Output directory for all artifacts
  outputDir: 'test-results/artifacts',

  use: {
    // Screenshot settings
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    // Video settings
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },

    // Viewport size (matches video)
    viewport: { width: 1280, height: 720 },
  },
});
```

### Override in Test File

```typescript
test.describe('My Tests', {
  use: {
    video: 'on',           // Force video for this suite
    screenshot: 'on',      // Always capture screenshots
  }
}, () => {
  // Your tests here
});
```

---

## Demo Test Suites

### 1. Video Recording Demo
File: [`tests/e2e/demo-video-recording.spec.ts`](../../tests/e2e/demo-video-recording.spec.ts)

**Scenarios:**
- ✅ Happy Path: Register → Login → Upload Photo
- ⚠️ Error Path: Validation errors

**Run:**
```bash
npx playwright test demo-video-recording --project=chromium
```

### 2. Screenshot Capture Demo
File: [`tests/e2e/demo-screenshot-capture.spec.ts`](../../tests/e2e/demo-screenshot-capture.spec.ts)

**Examples:**
1. Manual screenshots of page states
2. Element-specific screenshots
3. Viewport vs full page comparison
4. Before/after comparison screenshots
5. Mobile responsive screenshots
6. Automatic screenshots on failure
7. Custom screenshot options

**Run:**
```bash
npx playwright test demo-screenshot-capture --project=chromium
```

---

## Best Practices

### Video Recording

#### ✅ DO:
- Use `'retain-on-failure'` for CI/CD (saves space)
- Use `'on'` for demo and documentation videos
- Keep videos under 2 minutes (split long tests)
- Use descriptive test names (becomes video filename)
- Review failed test videos before debugging code

#### ❌ DON'T:
- Record all tests with `'on'` in CI (wastes storage)
- Ignore video evidence when debugging
- Delete videos before reviewing them
- Use very long tests (videos get too large)

### Screenshot Capture

#### ✅ DO:
- Use full-page screenshots for documentation
- Capture before/after states for comparisons
- Screenshot error messages for bug reports
- Use element screenshots for focused testing
- Add timestamps to screenshot filenames
- Organize screenshots in logical folders

#### ❌ DON'T:
- Take too many screenshots (clutters output)
- Use only viewport screenshots (might miss content)
- Forget to clean up old screenshots
- Hardcode paths without timestamps

### File Naming Conventions

```typescript
// Good naming (descriptive + timestamp)
`1-registration-empty-${timestamp}.png`
`compare-before-${timestamp}.png`
`element-error-message-${timestamp}.png`
`mobile-view-${timestamp}.png`

// Bad naming (not descriptive)
`screenshot1.png`
`test.png`
`image.png`
```

---

## Storage and Cleanup

### Automatic Cleanup
Playwright automatically:
- Deletes passing test videos (with `retain-on-failure`)
- Keeps only latest test run artifacts
- Organizes by test name and browser

### Manual Cleanup
```bash
# Remove all artifacts
rm -rf test-results/artifacts/*

# Remove only videos
rm -rf test-results/artifacts/*/video.webm

# Remove screenshots older than 7 days
find test-results/artifacts/screenshots/ -name "*.png" -mtime +7 -delete
```

### .gitignore Configuration
```gitignore
# Ignore actual artifacts
test-results/artifacts/*/*.webm
test-results/artifacts/screenshots/*.png

# Keep directory structure
!test-results/artifacts/**/.gitkeep
```

---

## Troubleshooting

### Videos Not Recording

**Check:**
1. Video mode is not `'off'`
2. Test is actually failing (if using `retain-on-failure`)
3. Output directory exists and is writable
4. Browser has necessary codecs

**Solution:**
```typescript
// Force video for debugging
test.use({ video: 'on' });
```

### Screenshots Not Captured

**Check:**
1. Screenshot mode is enabled
2. Test is failing (if using `only-on-failure`)
3. Path is correct and directory exists
4. Page is loaded before screenshot

**Solution:**
```typescript
// Add explicit wait before screenshot
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'debug.png' });
```

### Large File Sizes

**Videos too large?**
- Reduce viewport size
- Shorten test duration
- Use `retain-on-failure` instead of `'on'`
- Compress videos post-recording

**Screenshots too large?**
- Use JPEG instead of PNG for smaller size
- Reduce quality (JPEG only)
- Use viewport screenshots instead of full page
- Use element screenshots instead of full page

```typescript
// Smaller file size
await page.screenshot({
  path: 'screenshot.jpg',
  type: 'jpeg',
  quality: 80, // 0-100
  fullPage: false
});
```

### Can't Find Videos/Screenshots

**Location:**
```
test-results/
└── artifacts/
    ├── [test-name-browser-retry]/
    │   └── video.webm
    └── screenshots/
        └── [custom-screenshots].png
```

**HTML Report:**
```bash
npx playwright show-report
# Videos and screenshots are embedded!
```

---

## Use Cases

### For Testing
- ✅ Debug failed tests
- ✅ Verify UI behavior
- ✅ Regression testing
- ✅ Visual comparison testing

### For Documentation
- ✅ User journey demos
- ✅ Feature showcases
- ✅ Tutorial videos
- ✅ Before/after comparisons

### For Bug Reports
- ✅ Reproduce issues with video
- ✅ Screenshot error states
- ✅ Show expected vs actual behavior
- ✅ Evidence for issue tracking

### For Portfolio
- ✅ Showcase test coverage
- ✅ Demonstrate QA skills
- ✅ Show working application
- ✅ Professional test documentation

---

## Additional Resources

- [Playwright Screenshots Docs](https://playwright.dev/docs/screenshots)
- [Playwright Videos Docs](https://playwright.dev/docs/videos)
- [Playwright Reporter Docs](https://playwright.dev/docs/test-reporters)

## Related Documentation
- [E2E Testing Guide](./e2e-testing-guide.md)
- [MCP Playwright Setup](../setup/mcp-playwright-setup.md)

## Last Updated
2025-11-06
