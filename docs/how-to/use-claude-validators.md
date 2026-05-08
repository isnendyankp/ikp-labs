# Use Claude Validator Agents

Learn how to use Claude validator agents to automatically check your tests, documentation, and implementation plans for quality and completeness.

## What are Validator Agents?

Validator agents are specialized Claude agents that automatically review your work and generate audit reports. They check for:

- **Missing coverage** (tests, documentation, plan sections)
- **Quality issues** (best practices violations, non-atomic tasks)
- **Criticality assessment** (classify issues by severity)
- **Actionable recommendations** (specific fixes with priority)

### Available Validators

| Validator | Purpose | Report File |
|-----------|---------|-------------|
| **test-validator** | Validate E2E test coverage and quality | `test-audit-*.md` |
| **docs-validator** | Validate documentation completeness and quality | `docs-audit-*.md` |
| **plan-checker** | Validate implementation plan readiness | `plan-audit-*.md` |

---

## Quick Start

### Using Validators

Simply tag the validator agent in your conversation:

```bash
# Validate E2E tests
@test-validator

# Validate documentation
@docs-validator

# Validate implementation plan
@plan-checker
```

The agent will:

1. Scan relevant files
2. Identify issues
3. Generate a detailed report in `generated-reports/`
4. Display a summary

### Example Output

```markdown
🔍 Starting validation...

✅ Scanning test files...
✅ Analyzing coverage...
✅ Checking best practices...

📊 Audit complete!

Summary:
- Total Issues: 8
- Critical: 1 🔴
- High: 3 🟠
- Medium: 3 🟡
- Low: 1 🟢

Report: generated-reports/test-audit-2026-01-09-1430.md
```

---

## test-validator

### Purpose

Validate E2E test coverage and quality using Playwright testing best practices.

### When to Use

- ✅ After implementing new features
- ✅ Before creating pull requests
- ✅ During code reviews
- ✅ Regular quality audits (weekly/monthly)

### What It Checks

1. **E2E Test Coverage**
   - Compares Gherkin specs to Playwright tests
   - Identifies missing test scenarios
   - Validates coverage against requirements

2. **Spec ↔ Test Synchronization**
   - Checks if Gherkin scenarios have corresponding tests
   - Detects outdated specs
   - Finds orphaned tests (no matching spec)

3. **Playwright Best Practices**
   - Validates selector priority (role > text > CSS > XPath)
   - Checks for hardcoded waits (`waitForTimeout`)
   - Verifies proper assertions

4. **Flaky Test Detection**
   - Identifies unreliable selectors
   - Detects timing-dependent tests
   - Finds brittle test patterns

### Example Usage

```bash
@test-validator
```

### Example Findings

```markdown
## 🟠 HIGH - Missing Test Scenario

**Spec:** specs/gallery-sorting.feature
**Scenario:** Scenario: User can sort photos by most favorited
**Status:** ❌ No corresponding test found

**Impact:**
Feature not tested, potential for undetected bugs

**Suggested Fix:**
Create test in frontend/tests/gallery-sorting.spec.ts:
```typescript
test('sort photos by most favorited', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('mostFavorited');
  await expect(page.locator('.photo-card').first()).toContainText('Likes: 999');
});
```

**Priority:** HIGH - Add within 1-2 days

```text

### Report Location

```

generated-reports/test-audit-YYYY-MM-DD-HHMM.md

```text

### Skills Used

- `test__coverage-rules` - Coverage thresholds and requirements
- `test__playwright-patterns` - Best practices for Playwright
- `wow__criticality-assessment` - Issue classification

---

## docs-validator

### Purpose

Validate documentation completeness, quality, and adherence to the Diátaxis framework.

### When to Use

- ✅ After adding new features or APIs
- ✅ Before documentation releases
- ✅ During technical writing reviews
- ✅ Regular documentation audits (monthly)

### What It Checks

1. **API Documentation**
   - Scans backend controllers for endpoints
   - Verifies all endpoints are documented
   - Validates request/response formats

2. **JSDoc/JavaDoc Coverage**
   - Calculates function/method documentation coverage
   - Target: ≥80% for public functions
   - Identifies undocumented code

3. **Diátaxis Framework**
   - Verifies docs are in correct categories
   - Checks proper categorization:
     - `tutorials/` → Learning-oriented
     - `how-to/` → Problem-solving
     - `reference/` → Information
     - `explanation/` → Understanding

4. **Quality Standards**
   - Validates writing style (active voice, present tense)
   - Detects placeholders (TODO, TBD, Lorem ipsum)
   - Verifies code examples are accurate

5. **Broken Links**
   - Scans internal links
   - Checks external links
   - Reports broken references

### Example Usage

```bash
@docs-validator
```

### Example Findings

```markdown
## 🟠 HIGH - Undocumented API Endpoint

**Component:** Backend API
**Endpoint:** GET /api/photos/{id}/favorite
**Status:** ❌ Not documented

**Evidence:**
Found in: backend/ikp-labs-api/src/main/java/com/ikplabs/controller/PhotoController.java:142

**Impact:**
Developers don't know how to use this endpoint

**Suggested Fix:**
Add to docs/reference/api-endpoints.md:
```markdown
### Get Photo Favorite Status

Get the favorite status of a specific photo.

**Endpoint:** `GET /api/photos/{id}/favorite`

**Authentication:** Required

**Response:**
```json
{
  "id": 123,
  "isFavorited": true
}
```

```text

**Priority:** HIGH - Add within 1-2 days
```

### Report Location

```text
generated-reports/docs-audit-YYYY-MM-DD-HHMM.md
```

### Skills Used

- `docs__quality-standards` - Writing style and quality rules
- `docs__diataxis-framework` - Documentation categorization
- `wow__criticality-assessment` - Issue classification

---

## plan-checker

### Purpose

Validate implementation plan completeness, task atomicity, and readiness for execution.

### When to Use

- ✅ Before starting implementation
- ✅ After updating plans
- ✅ During plan reviews
- ✅ When plans are stalled or at-risk

### What It Checks

1. **4-Document System**
   - Verifies all 4 documents exist:
     - `README.md` (overview, objectives)
     - `requirements.md` (functional/non-functional requirements)
     - `technical-design.md` (architecture, API specs)
     - `checklist.md` (atomic tasks)
   - Validates required sections in each document

2. **Task Atomicity**
   - Checks task sizes (15-60 min per task)
   - Identifies tasks that are too large (>60 min)
   - Finds tasks that are too small (<10 min)

3. **Acceptance Criteria Quality**
   - Validates criteria are testable (INVEST principles)
   - Detects vague criteria ("should be fast")
   - Checks for implementation details in requirements

4. **Checklist Completion Status**
   - Calculates completion percentage
   - Identifies stalled plans (>7 days no progress)
   - Tracks in-progress tasks

5. **Cross-References**
   - Validates links between documents
   - Detects broken references

6. **Placeholders**
   - Scans for incomplete content (TODO, TBD)
   - Reports placeholder sections

### Example Usage

```bash
@plan-checker

# Or validate specific plan
@plan-checker validate plans/in-progress/authentication/
```

### Example Findings

```markdown
## 🔴 CRITICAL - Missing Required Document

**Plan:** plans/in-progress/user-authentication/
**Missing:** technical-design.md

**Evidence:**
- ✅ README.md exists
- ✅ requirements.md exists
- ❌ technical-design.md NOT FOUND
- ✅ checklist.md exists

**Impact:**
- No architecture design documented
- Developers don't know how to implement
- Risk of inconsistent implementation

**Suggested Fix:**
Create technical-design.md with sections:
1. Architecture Overview
2. Data Models (User, Session, Token tables)
3. API Specifications (POST /api/auth/login, etc.)
4. Component Design (AuthProvider, LoginForm, etc.)
5. Security Considerations (JWT, password hashing)
6. Error Handling Strategy

**Priority:** CRITICAL - Add immediately (cannot start implementation)
```

### Report Location

```text
generated-reports/plan-audit-YYYY-MM-DD-HHMM.md
```

### Skills Used

- `plan__four-doc-system` - 4-document structure and standards
- `wow__criticality-assessment` - Issue classification

---

## Understanding Criticality Levels

All validators use the same criticality assessment system:

### 🔴 CRITICAL

**Response Time:** Immediate (fix before proceeding)

**Examples:**

- Missing required document or section
- No acceptance criteria defined
- Critical path not tested (100% coverage required)
- Security vulnerabilities

**Action:** BLOCKER - Cannot proceed without fixing

---

### 🟠 HIGH

**Response Time:** Urgent (1-2 days)

**Examples:**

- Untestable acceptance criteria
- Missing test for important feature
- Undocumented API endpoint
- Plan stalled >7 days

**Action:** ESCALATE - Address ASAP, may need help

---

### 🟡 MEDIUM

**Response Time:** Normal (1 week)

**Examples:**

- Non-atomic tasks (need breakdown)
- Placeholder content in docs
- Suboptimal test selectors
- Broken cross-references

**Action:** REVIEW - Fix during next iteration

---

### 🟢 LOW

**Response Time:** Low priority (or ignore)

**Examples:**

- Minor formatting issues
- Inconsistent terminology
- Missing optional sections
- Typos

**Action:** IGNORE - Fix if time permits

---

## Understanding Confidence Levels

Validators also assess confidence in their findings:

- **HIGH Confidence** - Clear issue, definite fix needed
- **MEDIUM Confidence** - Likely issue, needs review
- **LOW Confidence** - Possible issue, investigate further

### Decision Matrix

```text
                 HIGH Confidence    MEDIUM Confidence   LOW Confidence
CRITICAL (🔴)     AUTO-FIX           ESCALATE            ESCALATE
HIGH (🟠)        AUTO-FIX           ESCALATE            REVIEW
MEDIUM (🟡)      AUTO-FIX           REVIEW              IGNORE
LOW (🟢)         AUTO-FIX           REVIEW              IGNORE
```

---

## Common Workflows

### Workflow 1: Before Starting Implementation

```bash
# 1. Validate your plan is complete
@plan-checker

# 2. If plan has issues, fix them
# 3. Re-validate until no CRITICAL/HIGH issues
# 4. Start implementation
```

**Goal:** Ensure plan is ready before coding

---

### Workflow 2: After Implementing Feature

```bash
# 1. Validate test coverage
@test-validator

# 2. Validate documentation
@docs-validator

# 3. Fix any CRITICAL/HIGH issues found
# 4. Create pull request
```

**Goal:** Ensure quality before merging

---

### Workflow 3: Regular Quality Audits

```bash
# Run all validators monthly
@test-validator
@docs-validator
@plan-checker
```

**Goal:** Maintain long-term code quality

---

### Workflow 4: Fixing Issues Found

```bash
# 1. Run validator
@test-validator

# 2. Review report
cat generated-reports/test-audit-2026-01-09-1430.md

# 3. Fix CRITICAL issues first
# 4. Fix HIGH issues second
# 5. Consider MEDIUM issues
# 6. Decide on LOW issues

# 7. Re-run validator to verify fixes
@test-validator
```

**Goal:** Systematic issue resolution

---

## Best Practices

### DO ✅

- **Run validators before major milestones** (releases, reviews)
- **Fix CRITICAL and HIGH issues immediately**
- **Review MEDIUM issues** during next iteration
- **Re-run validators after fixes** to verify
- **Track metrics over time** (coverage trends)
- **Use validator reports** in code reviews

### DON'T ❌

- **Don't start implementation** with CRITICAL plan issues
- **Don't merge code** with HIGH priority test issues
- **Don't release** with undocumented APIs
- **Don't ignore validators** for extended periods
- **Don't fix issues blindly** - review the report first

---

## Integrating with Development Workflow

### Pre-Commit Hook (Optional)

Create a script to run validators before commits:

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running validators..."

# Run relevant validators based on changed files
# (This is a simplified example)

if git diff --name-only | grep -q "tests/"; then
  echo "Running test-validator..."
  # Trigger test-validator
fi

if git diff --name-only | grep -q "docs/"; then
  echo "Running docs-validator..."
  # Trigger docs-validator
fi

echo "Validators passed!"
```

### Pre-Pull Request Checklist

```markdown
## PR Checklist

### Code Quality
- [ ] Run `test-validator` and fixed HIGH+ issues
- [ ] Run `docs-validator` and fixed HIGH+ issues
- [ ] Tests pass locally
- [ ] No console errors

### Documentation
- [ ] API changes documented
- [ ] JSDoc added for new functions
- [ ] Diátaxis category correct

### Testing
- [ ] E2E tests added for new features
- [ ] Coverage thresholds met
- [ ] No flaky tests
```

---

## Troubleshooting

### Validator Reports Not Generated

**Issue:** No report file created

**Possible Causes:**

1. `generated-reports/` directory doesn't exist
2. File permission issues
3. Validator crashed mid-execution

**Solution:**

```bash
# Ensure directory exists
mkdir -p generated-reports

# Check permissions
ls -la generated-reports/

# Re-run validator
@test-validator
```

---

### Too Many Issues Reported

**Issue:** Validator finds overwhelming number of issues

**Solution:**

1. Focus on **CRITICAL** issues first
2. Filter report by criticality: `grep "CRITICAL" report.md`
3. Create follow-up issues for MEDIUM/LOW
4. Don't try to fix everything at once

---

### False Positives

**Issue:** Validator reports something that's actually correct

**Solution:**

1. Review the finding carefully
2. Check if it's a confidence issue (LOW/MEDIUM)
3. Verify against the relevant skill file
4. If truly a false positive, note it and move on
5. Consider updating the skill file for edge cases

---

## Metrics Tracking

Validators provide metrics over time:

### Test Coverage Trends

```text
Last Month:  65% coverage
This Month:  78% coverage (+13%)
Target:      90% coverage
Gap:         -12%
```

### Documentation Completeness

```text
API Endpoints:      45/50 (90%)
JSDoc Coverage:     82% (target: 80%)
Broken Links:       3 (down from 12)
Placeholders:       0 (down from 7)
```

### Plan Readiness

```text
Plans Ready:        3/5 (60%)
Plans At Risk:      1/5 (20%)
Plans Stalled:      1/5 (20%)
Avg Task Atomicity: 88%
```

---

## Related Documentation

- [Diátaxis Framework](../explanation/diataxis-framework.md) - Understanding documentation categories
- [Test Coverage Rules](.claude/skills/test__coverage-rules.md) - Coverage requirements
- [Plan System](.claude/skills/plan__four-doc-system.md) - 4-document plan structure

---

## Summary

| Validator | Use When | Report Format |
|-----------|----------|---------------|
| **test-validator** | After implementing features | `test-audit-*.md` |
| **docs-validator** | After adding docs/APIs | `docs-audit-*.md` |
| **plan-checker** | Before starting implementation | `plan-audit-*.md` |

**Key Takeaways:**

- ✅ Run validators before major milestones
- ✅ Fix CRITICAL issues immediately
- ✅ Fix HIGH issues urgently (1-2 days)
- ✅ Review MEDIUM issues (1 week)
- ✅ Track metrics over time
- ✅ Use reports in code reviews

**Validators are your automated quality gatekeepers!** 🚀
