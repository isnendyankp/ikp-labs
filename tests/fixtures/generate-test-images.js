/**
 * Generate Test Images for E2E Testing
 *
 * This script creates test image files for profile picture E2E tests:
 * - valid-profile.jpg (small, < 1MB)
 * - valid-profile.png (small, < 1MB)
 * - valid-profile-2.jpg (alternative small image)
 * - large-image.jpg (> 5MB, for validation testing)
 * - invalid-file.txt (non-image file)
 */

const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel colored image in base64
// This is the smallest possible valid image
const createSmallJPEG = (color) => {
  // 1x1 pixel red JPEG in base64
  const redJPEG = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';
  const greenJPEG = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';
  const blueJPEG = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';

  const colorMap = {
    'red': redJPEG,
    'green': greenJPEG,
    'blue': blueJPEG
  };

  return Buffer.from(colorMap[color] || redJPEG, 'base64');
};

// Create a simple PNG (1x1 pixel)
const createSmallPNG = () => {
  // 1x1 pixel transparent PNG in base64
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(pngBase64, 'base64');
};

// Create a large image by repeating data
const createLargeJPEG = () => {
  const smallImage = createSmallJPEG('red');
  // Repeat the image data to create a file > 5MB
  const targetSize = 6 * 1024 * 1024; // 6MB
  const repetitions = Math.ceil(targetSize / smallImage.length);
  const buffers = Array(repetitions).fill(smallImage);
  return Buffer.concat(buffers);
};

// Create invalid text file
const createInvalidTextFile = () => {
  return Buffer.from('This is not an image file. This should fail validation.', 'utf-8');
};

// Main function to generate all test files
function generateTestImages() {
  const fixturesDir = __dirname;

  console.log('🎨 Generating test images...');

  try {
    // 1. Create valid small JPEG (red)
    const validJPEG = createSmallJPEG('red');
    fs.writeFileSync(path.join(fixturesDir, 'valid-profile.jpg'), validJPEG);
    console.log('✅ Created: valid-profile.jpg (' + validJPEG.length + ' bytes)');

    // 2. Create valid small PNG
    const validPNG = createSmallPNG();
    fs.writeFileSync(path.join(fixturesDir, 'valid-profile.png'), validPNG);
    console.log('✅ Created: valid-profile.png (' + validPNG.length + ' bytes)');

    // 3. Create alternative valid JPEG (blue)
    const validJPEG2 = createSmallJPEG('blue');
    fs.writeFileSync(path.join(fixturesDir, 'valid-profile-2.jpg'), validJPEG2);
    console.log('✅ Created: valid-profile-2.jpg (' + validJPEG2.length + ' bytes)');

    // 4. Create large JPEG (> 5MB)
    const largeJPEG = createLargeJPEG();
    fs.writeFileSync(path.join(fixturesDir, 'large-image.jpg'), largeJPEG);
    console.log('✅ Created: large-image.jpg (' + largeJPEG.length + ' bytes, ' + (largeJPEG.length / 1024 / 1024).toFixed(2) + ' MB)');

    // 5. Create invalid text file
    const invalidFile = createInvalidTextFile();
    fs.writeFileSync(path.join(fixturesDir, 'invalid-file.txt'), invalidFile);
    console.log('✅ Created: invalid-file.txt (' + invalidFile.length + ' bytes)');

    console.log('\n✨ All test images generated successfully!');
    console.log('📁 Location: ' + fixturesDir);

  } catch (error) {
    console.error('❌ Error generating test images:', error);
    process.exit(1);
  }
}

// Run the generator
generateTestImages();
