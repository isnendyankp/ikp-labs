import { test, expect } from '@playwright/test';
import { TestPlanTracker } from '../fixtures/test-plan-tracker.js';

/**
 * Registration Flow Tests with Test Plan Tracker
 *
 * ✨ Smart Test Execution dengan Auto Cleanup
 *
 * Fitur:
 * 1. Track progress test di JSON plan
 * 2. Auto-cleanup user setelah test PASS
 * 3. Preserve user jika test FAIL (untuk debugging)
 * 4. Historical record semua test execution
 * 5. Progress statistics (pass rate, duration, dll)
 *
 * Pattern Email:
 * - autotest-* : Auto-cleanup jika PASS, preserve jika FAIL
 *
 * Backend Integration:
 * - DELETE /api/test-admin/users/{email} : Delete specific user
 * - DELETE /api/test-admin/cleanup/automated : Bulk cleanup
 * - GET /api/test-admin/users?automated=true : List test users
 */

// Initialize Test Plan Tracker
let tracker: TestPlanTracker;

test.describe('Registration Flow - With Test Plan Tracker', () => {

  // Before all tests: Load test plan
  test.beforeAll(async () => {
    tracker = new TestPlanTracker('registration');
    console.log('📋 Test Plan Loaded: registration.plan.json');
    tracker.printProgress();
  });

  // After all tests: Save plan and print final statistics
  test.afterAll(async () => {
    tracker.savePlan();
    console.log('\n📊 Final Test Statistics:');
    tracker.printProgress();
  });

  // Before each test: Navigate to registration page
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * Test REG-001: Successful Registration with Valid Data
   *
   * Scenario:
   * - User fills valid data
   * - Backend creates user successfully
   * - JWT token is returned
   * - User is redirected
   *
   * Cleanup Strategy:
   * - Test PASSED → Auto-delete user from database
   * - Test FAILED → Keep user for debugging
   */
  test('REG-001: Successful Registration with Valid Data', async ({ page, request }) => {
    const testId = 'REG-001';
    tracker.startTest(testId);

    try {
      console.log('\n🧪 Test REG-001: Successful Registration');

      // Generate unique email with autotest pattern
      const timestamp = Date.now();
      const testEmail = `autotest-reg-001-${timestamp}@example.com`;

      const testData = {
        fullName: 'Auto Test User 001',
        email: testEmail,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };

      // Track user for cleanup
      tracker.trackUser(testEmail, testId);

      // Fill registration form
      await page.fill('input[name="name"]', testData.fullName);
      await page.fill('input[name="email"]', testData.email);
      await page.fill('input[name="password"]', testData.password);
      await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

      // Setup network listener
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/auth/register') && response.status() === 201
      );

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for response
      const response = await responsePromise;
      const responseData = await response.json();

      // Assertions
      expect(responseData.success).toBe(true);
      expect(responseData.token).toBeTruthy();
      expect(responseData.email).toBe(testData.email);
      expect(responseData.fullName).toBe(testData.fullName);

      // Verify JWT token in localStorage
      const token = await page.evaluate(() => localStorage.getItem('authToken'));
      expect(token).toBeTruthy();

      // Verify redirect
      await page.waitForURL(/\/(login|dashboard|profile)/, { timeout: 5000 });

      console.log('✅ Test REG-001: PASSED');
      console.log(`   User created: ${testEmail}`);

      // Mark test as completed (PASSED)
      tracker.markCompleted(testId);

      // Smart Cleanup: Delete user karena test PASS
      await tracker.cleanup(request, testId, true);

    } catch (error) {
      console.error('❌ Test REG-001: FAILED');
      console.error(`   Error: ${error.message}`);

      // Mark test as failed
      tracker.markFailed(testId, error.message);

      // Smart Cleanup: TIDAK delete user, simpan untuk debugging
      await tracker.cleanup(request, testId, false);

      throw error; // Re-throw agar Playwright tahu test failed
    }
  });

  /**
   * Test REG-002: Registration Fails with Empty Full Name
   *
   * Scenario:
   * - User submits form without full name
   * - Frontend shows validation error
   * - Backend rejects request (400)
   *
   * Cleanup Strategy:
   * - No user created, no cleanup needed
   */
  test('REG-002: Registration Fails with Empty Full Name', async ({ page, request }) => {
    const testId = 'REG-002';
    tracker.startTest(testId);

    try {
      console.log('\n🧪 Test REG-002: Empty Full Name Validation');

      const timestamp = Date.now();
      const testEmail = `autotest-reg-002-${timestamp}@example.com`;

      const testData = {
        fullName: '', // Empty name
        email: testEmail,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };

      // Fill registration form (empty name)
      await page.fill('input[name="name"]', testData.fullName);
      await page.fill('input[name="email"]', testData.email);
      await page.fill('input[name="password"]', testData.password);
      await page.fill('input[name="confirmPassword"]', testData.confirmPassword);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for error message to appear
      await page.waitForSelector('.error-message, .invalid-feedback', { timeout: 3000 });

      // Verify error message is displayed
      const errorMessage = await page.textContent('.error-message, .invalid-feedback');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.toLowerCase()).toContain('name');

      // Verify user stays on registration page (no redirect)
      expect(page.url()).toContain('/register');

      console.log('✅ Test REG-002: PASSED');
      console.log('   Validation error shown correctly');

      // Mark test as completed (PASSED)
      tracker.markCompleted(testId);

      // No cleanup needed (no user created)

    } catch (error) {
      console.error('❌ Test REG-002: FAILED');
      console.error(`   Error: ${error.message}`);

      tracker.markFailed(testId, error.message);
      throw error;
    }
  });

  /**
   * Test REG-006: Registration Fails with Duplicate Email
   *
   * Scenario:
   * 1. Create user pertama dengan email tertentu
   * 2. Coba registrasi lagi dengan email yang sama
   * 3. Backend reject dengan error "Email already exists"
   *
   * Cleanup Strategy:
   * - Test PASSED → Delete first user (yang berhasil dibuat)
   * - Test FAILED → Keep both users untuk debugging
   */
  test('REG-006: Registration Fails with Duplicate Email', async ({ page, request }) => {
    const testId = 'REG-006';
    tracker.startTest(testId);

    try {
      console.log('\n🧪 Test REG-006: Duplicate Email Validation');

      const timestamp = Date.now();
      const testEmail = `autotest-reg-006-${timestamp}@example.com`;

      // Track user for cleanup
      tracker.trackUser(testEmail, testId);

      // STEP 1: Create first user via API (berhasil)
      console.log('   Step 1: Creating first user via API...');
      const firstUserResponse = await request.post('http://localhost:8081/api/auth/register', {
        data: {
          fullName: 'First User REG-006',
          email: testEmail,
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        }
      });

      expect(firstUserResponse.status()).toBe(201);
      const firstUserData = await firstUserResponse.json();
      expect(firstUserData.success).toBe(true);
      console.log(`   ✅ First user created: ${testEmail}`);

      // STEP 2: Try to register with same email via UI (harus gagal)
      console.log('   Step 2: Attempting duplicate registration via UI...');

      await page.fill('input[name="name"]', 'Duplicate User REG-006');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', 'SecurePass123!');
      await page.fill('input[name="confirmPassword"]', 'SecurePass123!');

      // Setup network listener for error response
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/auth/register')
      );

      await page.click('button[type="submit"]');
      const response = await responsePromise;

      // Verify duplicate error
      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message.toLowerCase()).toContain('already exists');

      console.log('   ✅ Duplicate registration correctly rejected');

      // Verify error message shown in UI
      await page.waitForSelector('.error-message, .invalid-feedback', { timeout: 3000 });
      const errorMessage = await page.textContent('.error-message, .invalid-feedback');
      expect(errorMessage.toLowerCase()).toContain('email');

      console.log('✅ Test REG-006: PASSED');

      // Mark test as completed (PASSED)
      tracker.markCompleted(testId);

      // Smart Cleanup: Delete first user karena test PASS
      await tracker.cleanup(request, testId, true);

    } catch (error) {
      console.error('❌ Test REG-006: FAILED');
      console.error(`   Error: ${error.message}`);

      tracker.markFailed(testId, error.message);

      // Smart Cleanup: Keep users untuk debugging
      await tracker.cleanup(request, testId, false);

      throw error;
    }
  });
});
