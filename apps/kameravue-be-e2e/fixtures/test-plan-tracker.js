import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test Plan Tracker
 *
 * Manages test execution tracking with smart conditional cleanup.
 * - Tracks test progress in JSON plan files
 * - Auto-deletes test data on PASS
 * - Preserves test data on FAIL for debugging
 * - Provides progress reporting
 */
export class TestPlanTracker {
  constructor(planName) {
    this.planName = planName;
    this.planPath = path.join(__dirname, '../plans', `${planName}.plan.json`);
    this.testUsers = []; // Track created users for cleanup
    this.currentTestId = null;

    // Load or create plan
    if (fs.existsSync(this.planPath)) {
      this.plan = JSON.parse(fs.readFileSync(this.planPath, 'utf-8'));
    } else {
      throw new Error(`Test plan '${planName}' not found at ${this.planPath}`);
    }
  }

  /**
   * Start tracking a test case
   * @param {string} testId - Test case ID (e.g., "REG-001")
   * @returns {object} Test case object
   */
  startTest(testId) {
    this.currentTestId = testId;
    const testCase = this.plan.testCases.find(tc => tc.id === testId);

    if (!testCase) {
      throw new Error(`Test case ${testId} not found in plan ${this.planName}`);
    }

    console.log(`📋 [${testId}] Starting: ${testCase.description}`);
    return testCase;
  }

  /**
   * Track user created during test
   * @param {string} email - User email
   * @param {string} testId - Test case ID
   */
  trackUser(email, testId) {
    this.testUsers.push({
      email,
      testId,
      createdAt: new Date().toISOString()
    });
    console.log(`📝 [${testId}] Tracking user: ${email}`);
  }

  /**
   * Mark test as completed (PASS)
   * @param {string} testId - Test case ID
   */
  markCompleted(testId) {
    const testCase = this.plan.testCases.find(tc => tc.id === testId);

    if (testCase) {
      testCase.status = 'completed';
      testCase.completedAt = new Date().toISOString();

      // Update stats
      if (testCase.status !== 'completed') {
        this.plan.stats.completed++;
        this.plan.stats.pending = Math.max(0, this.plan.stats.pending - 1);
      }

      this.savePlan();
      console.log(`✅ [${testId}] Test PASSED - marked as completed`);
    }
  }

  /**
   * Mark test as failed (FAIL)
   * @param {string} testId - Test case ID
   * @param {Error} error - Error object
   */
  markFailed(testId, error) {
    const testCase = this.plan.testCases.find(tc => tc.id === testId);

    if (testCase) {
      testCase.status = 'failed';
      testCase.failedAt = new Date().toISOString();
      testCase.error = error.message;

      // Update stats
      if (testCase.status !== 'failed') {
        this.plan.stats.failed++;
        this.plan.stats.pending = Math.max(0, this.plan.stats.pending - 1);
      }

      this.savePlan();
      console.log(`❌ [${testId}] Test FAILED - marked as failed`);
    }
  }

  /**
   * Smart cleanup based on test status
   * @param {object} request - Playwright request context
   * @param {string} testId - Test case ID
   * @param {boolean} testPassed - Whether test passed
   */
  async cleanup(request, testId, testPassed) {
    const usersToCleanup = this.testUsers.filter(u => u.testId === testId);

    if (testPassed) {
      // ✅ Test passed → Delete all users
      console.log(`🧹 [${testId}] Test passed - cleaning up ${usersToCleanup.length} user(s)`);

      for (const { email } of usersToCleanup) {
        try {
          await request.delete(`http://localhost:8081/api/test-admin/users/${email}`, {
            params: { confirmEmail: email }
          });
          console.log(`   ✅ Deleted: ${email}`);
        } catch (error) {
          console.warn(`   ⚠️  Failed to delete ${email}: ${error.message}`);
        }
      }

      // Remove from tracking
      this.testUsers = this.testUsers.filter(u => u.testId !== testId);

    } else {
      // ❌ Test failed → KEEP users for debugging
      console.log(`🔍 [${testId}] Test failed - KEEPING ${usersToCleanup.length} user(s) for debugging:`);

      for (const { email } of usersToCleanup) {
        console.log(`   🔍 ${email} - Available for debugging`);
      }

      // Save failed test data info
      this.saveFailedTestData(testId, usersToCleanup);
    }
  }

  /**
   * Save plan to file
   */
  savePlan() {
    fs.writeFileSync(this.planPath, JSON.stringify(this.plan, null, 2));
  }

  /**
   * Save failed test data for debugging reference
   * @param {string} testId - Test case ID
   * @param {Array} users - Array of user objects
   */
  saveFailedTestData(testId, users) {
    const resultsDir = path.join(__dirname, '../results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const failedDataPath = path.join(resultsDir, `failed-${testId}.json`);

    const failedData = {
      testId,
      failedAt: new Date().toISOString(),
      usersForDebugging: users,
      instructions: users.length > 0
        ? `These users are kept in database for debugging. Delete manually when done: ${users.map(u => u.email).join(', ')}`
        : 'No users were created for this test.'
    };

    fs.writeFileSync(failedDataPath, JSON.stringify(failedData, null, 2));
    console.log(`💾 [${testId}] Saved debugging info to: ${failedDataPath}`);
  }

  /**
   * Get overall progress
   * @returns {object} Progress statistics
   */
  getProgress() {
    const { total, completed, pending, failed } = this.plan.stats;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      failed,
      percentage,
      summary: `${completed}/${total} tests passed (${percentage}%)`
    };
  }

  /**
   * Print progress report to console
   */
  printProgress() {
    const progress = this.getProgress();

    console.log('\n📊 Test Progress Report:');
    console.log(`   Total Tests: ${progress.total}`);
    console.log(`   ✅ Completed: ${progress.completed}`);
    console.log(`   ⏳ Pending: ${progress.pending}`);
    console.log(`   ❌ Failed: ${progress.failed}`);
    console.log(`   Progress: ${progress.percentage}%`);
    console.log('');
  }
}
