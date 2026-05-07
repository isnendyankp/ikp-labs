# How to Run Automated Tests

**Category:** How-to Guide
**Audience:** Developers, QA Engineers
**Prerequisites:** Node.js installed, backend running (for API tests)

This guide shows you how to run automated tests with our Test Plan Checklist system.

---

## Quick Start

### Run All Tests

```bash
# Run all test suites
npx playwright test

# Run with UI (see tests in real-time)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

### Run Specific Test Suite

```bash
# Run only registration tests
npx playwright test tests/e2e/registration.spec.js

# Run only authentication tests
npx playwright test tests/e2e/authentication.spec.js

# Run only profile tests
npx playwright test tests/e2e/profile.spec.js
```

### Run with Test Plan Tracking

```bash
# Run tests with plan checklist tracking
npx playwright test --grep "@plan"

# This will:
# ✅ Track test progress in plan JSON files
# ✅ Auto-cleanup test data on success
# ✅ Keep test data on failure for debugging
# ✅ Generate progress reports
```

---

## Understanding Test Output

### Console Output

When running tests with plan tracking, you'll see:

```bash
📋 [REG-001] Starting: Should register new user successfully
📝 [REG-001] Tracking user: autotest-1731238845123@example.com
✅ [REG-001] Test PASSED - marked as completed
🧹 [REG-001] Test passed - cleaning up 1 users
   ✅ Deleted: autotest-1731238845123@example.com

📊 Test Progress Report:
   Total Tests: 4
   ✅ Completed: 1
   ⏳ Pending: 3
   ❌ Failed: 0
   Progress: 25%
```

**Key Symbols:**

- 📋 Test started
- 📝 User created and tracked
- ✅ Test passed / User deleted
- ❌ Test failed
- 🧹 Cleanup in progress
- 🔍 Debugging data preserved
- 📊 Progress report

---

## Test Results

### HTML Report

After test run, view detailed HTML report:

```bash
# Generate and open HTML report
npx playwright show-report
```

**Report includes:**

- ✅ Test pass/fail status
- ⏱️ Execution time per test
- 📸 Screenshots (for UI tests)
- 🔍 Detailed error messages
- 📊 Test statistics

### Test Plan Files

Test progress is saved in JSON files:

```bash
tests/plans/
├── registration.plan.json    # Registration test checklist
├── authentication.plan.json  # Auth test checklist
└── profile.plan.json         # Profile test checklist
```

**View plan status:**

```bash
cat tests/plans/registration.plan.json
```

**Example output:**

```json
{
  "planName": "User Registration Testing",
  "testCases": [
    {
      "id": "REG-001",
      "description": "Should register new user successfully",
      "status": "completed",
      "completedAt": "2025-11-10T10:30:15.123Z"
    }
  ],
  "stats": {
    "total": 4,
    "completed": 3,
    "pending": 0,
    "failed": 1
  }
}
```

---

## Test Data Cleanup

### Automatic Cleanup (Test Passed)

When tests pass, test data is automatically deleted:

```bash
✅ Test PASSED
🧹 Cleaning up test users...
   ✅ Deleted: autotest-123@example.com
```

**Database remains clean!** ✅

### Manual Cleanup (Test Failed)

When tests fail, data is preserved for debugging:

```bash
❌ Test FAILED
🔍 KEEPING user for debugging: autotest-123@example.com
💾 Saved debugging info to: tests/results/failed-REG-001.json
```

**To manually delete test user:**

```bash
# Using curl
curl -X DELETE "http://localhost:8081/api/test-admin/users/autotest-123@example.com?confirmEmail=autotest-123@example.com"

# Or create cleanup script
npm run cleanup:failed-tests
```

---

## Common Tasks

### Check Test Progress

```bash
# View progress for specific plan
cat tests/plans/registration.plan.json | grep -A 2 "stats"

# Output:
# "stats": {
#   "total": 4,
#   "completed": 3,
#   "pending": 0,
#   "failed": 1
# }
```

### Reset Test Plan

```bash
# Reset all tests to pending status
npm run test:reset-plan registration

# Or manually edit
vim tests/plans/registration.plan.json
```

### List Failed Tests

```bash
# Show all failed tests
ls tests/results/failed-*.json

# View specific failure details
cat tests/results/failed-REG-003.json
```

### Cleanup All Test Users

```bash
# Delete all automated test users
curl -X DELETE http://localhost:8081/api/test-admin/cleanup/automated

# Response:
# {
#   "message": "Cleaned up automated test users",
#   "deletedCount": 5
# }
```

---

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Automated Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Start backend
        run: |
          cd backend/ikp-labs-api
          mvn spring-boot:run &
          sleep 30

      - name: Run tests with plan tracking
        run: npx playwright test --grep "@plan"

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results/
            tests/plans/
```

---

## Troubleshooting

### Tests Hanging

**Problem:** Tests don't complete

**Solution:**

```bash
# Check if backend is running
curl http://localhost:8081/api/health

# Restart backend if needed
cd backend/ikp-labs-api
mvn spring-boot:run
```

### Cleanup Failing

**Problem:** "Failed to delete user"

**Possible causes:**

1. Backend not running
2. User doesn't exist
3. Network issues

**Solution:**

```bash
# List all test users
curl http://localhost:8081/api/test-admin/users

# Manual cleanup
curl -X DELETE http://localhost:8081/api/test-admin/cleanup/automated
```

### Plan File Corrupted

**Problem:** JSON parse error

**Solution:**

```bash
# Restore from git
git checkout tests/plans/registration.plan.json

# Or recreate from template
cp tests/plans/template.plan.json tests/plans/registration.plan.json
```

---

## Best Practices

### ✅ DO

- Run tests locally before pushing
- Check test progress in plan files
- Review failed test debugging data
- Clean up manual test users when done
- Use descriptive test IDs (REG-001, AUTH-002)

### ❌ DON'T

- Don't skip cleanup manually
- Don't delete plan files
- Don't modify plan files while tests running
- Don't run tests without backend running (for API tests)
- Don't use production database for testing

---

## Next Steps

- **Learn to write tests:** [How to Write New Tests](./write-new-tests.md)
- **Debug failures:** [How to Debug Failed Tests](./debug-failed-tests.md)
- **Understand strategy:** [Test Plan Strategy Explanation](../../explanation/testing/test-plan-strategy.md)
- **API Reference:** [Test Plan Tracker API](../../reference/testing/test-plan-tracker-api.md)

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests |
| `npx playwright test --ui` | Run with UI mode |
| `npx playwright test FILE` | Run specific file |
| `npx playwright show-report` | View HTML report |
| `cat tests/plans/*.json` | Check test progress |
| `ls tests/results/failed-*` | List failed tests |
| `npm run cleanup:failed-tests` | Clean up failed test data |

---

**Related:**

- [Test Plan Tracker API Reference](../../reference/testing/test-plan-tracker-api.md)
- [Test Strategy Explanation](../../explanation/testing/test-plan-strategy.md)
- [Project Testing Overview](../../../README.md#testing)
