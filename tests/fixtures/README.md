# Test Fixtures

This directory contains test files used for E2E testing.

## Profile Picture Test Images

### Valid Test Images
- `valid-profile.jpg` - Small JPEG image (< 1MB) for successful upload tests
- `valid-profile.png` - Small PNG image (< 1MB) for successful upload tests
- `valid-profile-2.jpg` - Alternative JPEG for testing multiple uploads

### Invalid Test Files (for validation testing)
- `large-image.jpg` - Large image (> 5MB) to test size validation
- `invalid-file.txt` - Text file to test file type validation

## Usage in Tests

```typescript
import path from 'path';

// Upload valid image
const validImagePath = path.join(__dirname, '../fixtures/valid-profile.jpg');
await page.setInputFiles('input[type="file"]', validImagePath);

// Test size validation
const largeImagePath = path.join(__dirname, '../fixtures/large-image.jpg');
await page.setInputFiles('input[type="file"]', largeImagePath);
```

## Generating Test Images

If you need to regenerate or add test images:

### Using ImageMagick (recommended)
```bash
# Create small valid JPEG (100x100, ~10KB)
convert -size 100x100 xc:blue valid-profile.jpg

# Create small valid PNG (100x100, ~5KB)
convert -size 100x100 xc:green valid-profile.png

# Create large JPEG (> 5MB)
convert -size 3000x3000 xc:red large-image.jpg
```

### Using Node.js (canvas library)
```bash
npm install canvas
node generate-test-images.js
```

### Manual Creation
You can also manually add test images:
1. Take any small photo/image < 1MB
2. Save as `valid-profile.jpg` or `valid-profile.png`
3. For large image, use any photo > 5MB

## Notes
- Test images should be committed to git
- Keep valid images small (< 100KB) for fast test execution
- Ensure invalid files actually fail validation
- Don't use copyrighted or sensitive images
