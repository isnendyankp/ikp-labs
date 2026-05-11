# Skill: Criticality Assessment

**Category**: Quality Assurance
**Purpose**: Severity classification and confidence scoring guide
**Used By**: test-validator, docs-validator, plan-checker

---

## Overview

This skill defines how to **assess the criticality and confidence** of issues found during validation. All validator agents use this system to classify findings, prioritize fixes, and decide whether to auto-fix or escalate to developers.

**What is Criticality Assessment?**

Criticality assessment is a **two-dimensional classification system**:

1. **Criticality** (Severity) - How important is this issue?
2. **Confidence** (Certainty) - How confident are we this is a real issue?

**Why This Matters:**

- ✅ **Prioritization** - Focus on high-impact issues first
- ✅ **Automation** - Auto-fix high-confidence issues, escalate uncertain ones
- ✅ **Noise Reduction** - Filter out false positives
- ✅ **Communication** - Clear severity helps team triage
- ✅ **Metrics** - Track issue trends over time

**Classification Matrix:**

```text
         High Confidence    Medium Confidence   Low Confidence
CRITICAL  🔴 AUTO-FIX        🔴 ESCALATE         ⚠️  ESCALATE
HIGH      🟠 AUTO-FIX        🟠 ESCALATE         ⚠️  REVIEW
MEDIUM    🟡 AUTO-FIX        🟡 REVIEW           ℹ️  IGNORE
LOW       🟢 AUTO-FIX        🟢 REVIEW           ℹ️  IGNORE
```

**Action Codes:**

- 🔴 **AUTO-FIX** - Agent fixes automatically, commits with explanation
- 🟠 **ESCALATE** - Report to developer, requires manual decision
- 🟡 **REVIEW** - Flag for review, suggest fix
- 🟢 **IGNORE** - Log but don't report (likely false positive)

---

## Criticality Levels

### 🔴 CRITICAL

**Definition:** Issue that **blocks core functionality** or creates **security vulnerability**.

**Characteristics:**

- System is broken, unusable, or insecure
- Affects all users or critical user paths
- No workaround available
- Data loss or corruption possible
- Security breach risk

**Examples:**

**Testing:**

- ❌ E2E test for login fails (users can't log in)
- ❌ Critical API endpoint has 0% test coverage (auth, payment)
- ❌ Test suite fails to run (broken test infrastructure)

**Documentation:**

- ❌ API endpoint documented incorrectly (wrong request format)
- ❌ Security instructions are missing or wrong
- ❌ Breaking change not documented

**Planning:**

- ❌ Plan missing entirely for P0-Critical feature
- ❌ All tasks blocked, no path forward
- ❌ Plan conflicts with security requirements

**Impact:** Production incident, user trust loss, security breach

**Response Time:** Immediate (fix within hours)

---

### 🟠 HIGH

**Definition:** Issue that **degrades important functionality** or **blocks development**.

**Characteristics:**

- Important feature is broken or unusable
- Affects many users or common workflows
- Workaround exists but difficult
- Significantly impacts developer productivity
- May escalate to CRITICAL if not fixed

**Examples:**

**Testing:**

- ⚠️ E2E test for photo upload fails (core feature broken)
- ⚠️ High-priority feature has <50% test coverage
- ⚠️ Flaky test fails 30% of the time

**Documentation:**

- ⚠️ How-to guide missing for important feature
- ⚠️ API endpoint not documented (recent addition)
- ⚠️ Incorrect code example that doesn't work

**Planning:**

- ⚠️ Plan missing acceptance criteria (unclear when "done")
- ⚠️ Technical design has no architecture diagram
- ⚠️ Half of checklist tasks have no time estimates

**Impact:** Feature unusable, dev blocked, user frustration

**Response Time:** Urgent (fix within 1-2 days)

---

### 🟡 MEDIUM

**Definition:** Issue that **reduces quality** or **creates friction** but doesn't block.

**Characteristics:**

- Feature works but has quality issues
- Affects some users or edge cases
- Workaround is easy
- Impacts maintainability or code quality
- May escalate to HIGH if accumulates

**Examples:**

**Testing:**

- ℹ️ Test coverage at 72% (target: 80%)
- ℹ️ E2E test uses brittle CSS selector instead of data-testid
- ℹ️ Missing edge case test (null, empty, max values)

**Documentation:**

- ℹ️ JSDoc comment missing for public function
- ℹ️ Documentation uses passive voice (should be active)
- ℹ️ Missing cross-reference to related docs

**Planning:**

- ℹ️ Task estimated at 90 min (should be <60 min, break down)
- ℹ️ Plan has minor placeholder content (non-critical section)
- ℹ️ Checklist not updated in 2 days (should update daily)

**Impact:** Technical debt, maintenance friction, minor UX issue

**Response Time:** Normal (fix within 1 week)

---

### 🟢 LOW

**Definition:** Issue that is **cosmetic**, **nice-to-have**, or **subjective**.

**Characteristics:**

- No functional impact
- Purely stylistic or cosmetic
- Affects very few users or rare scenarios
- Easy workaround
- Doesn't impact code quality significantly

**Examples:**

**Testing:**

- 💡 Test description could be more descriptive
- 💡 Test file not sorted alphabetically
- 💡 Console.log left in test (non-production code)

**Documentation:**

- 💡 Typo in comment (doesn't affect understanding)
- 💡 Formatting inconsistency (extra space)
- 💡 Could use better wording (subjective)

**Planning:**

- 💡 Commit message uses "fix" instead of "feat" (still clear)
- 💡 Task name could be more specific
- 💡 Timeline could include more detail

**Impact:** Minimal, cosmetic only

**Response Time:** Low priority (fix when convenient, or ignore)

---

## Confidence Scoring

### ✅ HIGH Confidence

**Definition:** **100% certain** this is a real issue with clear evidence.

**Characteristics:**

- Objective, measurable violation
- No ambiguity in requirement
- Automated check confirms issue
- Reproducible 100% of the time
- Clear fix is obvious

**Examples:**

**Testing:**

```text
✅ HIGH: Test file missing for GalleryService.ts
   Evidence: File exists, no corresponding .test.ts found
   Fix: Create GalleryService.test.ts
```

**Documentation:**

```text
✅ HIGH: API endpoint POST /api/gallery/upload not documented
   Evidence: Endpoint exists in code, not in docs/reference/api-endpoints.md
   Fix: Add endpoint documentation
```

**Planning:**

```text
✅ HIGH: Task 1.3 missing acceptance criteria
   Evidence: Checklist shows task with no "Acceptance Criteria" section
   Fix: Add specific, measurable criteria
```

**Decision:** Safe to AUTO-FIX (if MEDIUM/LOW criticality)

---

### ⚠️ MEDIUM Confidence

**Definition:** **Likely** a real issue but requires **human judgment** to confirm.

**Characteristics:**

- Some ambiguity in requirement
- Context-dependent
- May have valid exceptions
- Heuristic-based detection
- Fix requires understanding intent

**Examples:**

**Testing:**

```text
⚠️ MEDIUM: GalleryService.ts has 68% coverage (target: 80%)
   Context: Overall project at 75%, this file new, acceptable temporarily
   Action: REVIEW - May be acceptable if high-risk paths covered
```

**Documentation:**

```text
⚠️ MEDIUM: Component lacks JSDoc comment
   Context: Simple component, self-explanatory props
   Action: REVIEW - May not need detailed docs if trivial
```

**Planning:**

```text
⚠️ MEDIUM: Task estimated at 65 min (guideline: <60 min)
   Context: Close to threshold, may be acceptable
   Action: REVIEW - Consider breaking down, but not critical
```

**Decision:** ESCALATE or REVIEW (require human decision)

---

### ❓ LOW Confidence (FALSE_POSITIVE Risk)

**Definition:** **Uncertain** if this is a real issue, high false positive risk.

**Characteristics:**

- Highly subjective
- Multiple interpretations valid
- Requires domain knowledge to assess
- May be intentional design choice
- Fix is unclear or debatable

**Examples:**

**Testing:**

```text
❓ LOW: Test name "should work" is too vague
   Context: May be placeholder, or developer preference
   Action: IGNORE - Subjective, no clear violation
```

**Documentation:**

```text
❓ LOW: Explanation could be clearer
   Context: "Clearer" is subjective, current version may be fine
   Action: IGNORE - No objective standard violated
```

**Planning:**

```text
❓ LOW: Plan uses "we" instead of passive voice
   Context: May be acceptable in certain sections (team context)
   Action: IGNORE - Stylistic preference, not wrong
```

**Decision:** IGNORE or LOG (don't report to developer)

---

## Decision Matrix

### How to Use the Matrix

1. **Assess Criticality** - Is this CRITICAL, HIGH, MEDIUM, or LOW?
2. **Assess Confidence** - Am I HIGH, MEDIUM, or LOW confidence?
3. **Lookup Action** - Use matrix to determine action
4. **Execute** - AUTO-FIX, ESCALATE, REVIEW, or IGNORE

### Matrix Table

| Criticality | High Confidence | Medium Confidence | Low Confidence |
|-------------|----------------|-------------------|----------------|
| **CRITICAL** | 🔴 AUTO-FIX (if simple)<br>🔴 ESCALATE (if complex) | 🔴 ESCALATE<br>(Don't auto-fix critical issues with uncertainty) | ⚠️ ESCALATE<br>(Better safe than sorry) |
| **HIGH** | 🟠 AUTO-FIX (if simple)<br>🟠 ESCALATE (if complex) | 🟠 ESCALATE<br>(Require human decision) | ⚠️ REVIEW<br>(May be false positive) |
| **MEDIUM** | 🟡 AUTO-FIX (if trivial)<br>🟡 REVIEW (if non-trivial) | 🟡 REVIEW<br>(Suggest fix, let dev decide) | ℹ️ IGNORE<br>(Likely noise) |
| **LOW** | 🟢 AUTO-FIX (cosmetic only) | 🟢 REVIEW<br>(Optional improvement) | ℹ️ IGNORE<br>(Don't report) |

### Action Definitions

**🔴 AUTO-FIX (High Priority):**

- Agent makes the fix automatically
- Commits with detailed explanation
- Requires high confidence + clear fix
- Example: Add missing test file

**🔴 ESCALATE (High Priority):**

- Report immediately to developer
- Requires manual decision/fix
- Block PR or deployment if needed
- Example: Critical test fails, security issue

**🟡 REVIEW (Medium Priority):**

- Flag in audit report
- Suggest fix with rationale
- Developer decides whether to fix
- Example: Coverage below threshold

**🟢 IGNORE (Low Priority):**

- Log in debug output (not in report)
- Track for metrics only
- Don't notify developer
- Example: Subjective style issue

---

## Auto-Fix Criteria

### When to AUTO-FIX ✅

An issue should be **auto-fixed** if it meets **ALL** of these criteria:

1. **High Confidence** - 100% certain it's a real issue
2. **Clear Fix** - Exactly one obvious solution
3. **Low Risk** - Fix won't break anything
4. **Non-Critical** - If wrong, easy to revert (not security/data)
5. **Deterministic** - Same fix every time (no judgment needed)

**Examples of Safe Auto-Fixes:**

```typescript
// ✅ Add missing test file (boilerplate)
// File: GalleryService.test.ts (created)
import { GalleryService } from './GalleryService';

describe('GalleryService', () => {
  it('should be defined', () => {
    expect(GalleryService).toBeDefined();
  });
});
```

```markdown
<!-- ✅ Fix documentation typo -->
<!-- Before: "Retreive photos from gallery" -->
<!-- After:  "Retrieve photos from gallery" -->
```

```markdown
<!-- ✅ Add missing JSDoc comment (template) -->
/**
 * Uploads a photo to the gallery
 * @param file - The file to upload
 * @returns Promise with upload result
 */
export async function uploadPhoto(file: File): Promise<UploadResult> {
  // ...
}
```

---

### When to ESCALATE ⚠️

An issue should be **escalated** if it has **ANY** of these characteristics:

1. **Critical Severity** - Blocks core functionality or security risk
2. **Medium/Low Confidence** - Uncertain if it's a real issue
3. **Multiple Solutions** - More than one valid fix
4. **High Risk** - Fix could break something
5. **Requires Context** - Need to understand business logic/intent
6. **Subjective** - Judgment call needed

**Examples of Issues to Escalate:**

```text
🔴 ESCALATE: Login E2E test fails
   Criticality: CRITICAL (users can't log in)
   Confidence: HIGH
   Reason: Critical issue requires immediate attention
   Fix: Unknown - needs investigation

🟠 ESCALATE: GalleryService has 45% coverage (target: 80%)
   Criticality: HIGH (far below threshold)
   Confidence: HIGH
   Reason: Requires significant test additions, need dev to write tests

⚠️ ESCALATE: API response format may be incorrect
   Criticality: HIGH (breaking change)
   Confidence: MEDIUM (need to verify with backend team)
   Reason: Uncertain, requires confirmation
```

---

## Domain-Specific Examples

### Testing Domain

#### Example 1: Missing Test Coverage

**Finding:**

```text
File: frontend/src/services/galleryService.ts
Coverage: 45% (target: 70%)
Missing: Error handling paths, edge cases
```

**Assessment:**

- **Criticality:** HIGH (far below threshold)
- **Confidence:** HIGH (measured by coverage tool)
- **Action:** 🟠 ESCALATE

**Rationale:**

- High confidence (objective measurement)
- But HIGH criticality + requires dev to write meaningful tests
- Auto-fix would create trivial tests (bad practice)

**Report:**

```markdown
## 🟠 HIGH - Test Coverage Below Threshold

**File:** `galleryService.ts`
**Current Coverage:** 45% (lines), 30% (branches)
**Target:** ≥70% (lines), ≥65% (branches)
**Gap:** -25% lines, -35% branches

**Missing Coverage:**
- Error handling for API failures (lines 42-56)
- Edge cases: null input, empty array (lines 78-82)
- Retry logic on network timeout (lines 120-135)

**Recommendation:**
Add tests for error scenarios and edge cases. See test__coverage-rules.md.

**Priority:** HIGH - Must fix before PR merge
```

---

#### Example 2: Flaky Test Detected

**Finding:**

```text
Test: "should sort photos by most liked"
Failure Rate: 15% (3 out of 20 runs)
Error: "Element not visible"
```

**Assessment:**

- **Criticality:** HIGH (flaky tests break CI/CD)
- **Confidence:** MEDIUM (intermittent, hard to reproduce)
- **Action:** 🟠 ESCALATE

**Rationale:**

- Medium confidence (flakiness suggests timing issue, but root cause unclear)
- Requires investigation to find root cause
- Auto-fix (add wait) may mask real issue

**Report:**

```markdown
## 🟠 HIGH - Flaky E2E Test Detected

**Test:** `gallery-sorting.spec.ts:42` - "should sort photos by most liked"
**Failure Rate:** 15% (3/20 runs)
**Error:** `TimeoutError: Element .photo-card not visible`

**Analysis:**
Likely race condition between photo load and sort action.

**Suggested Fix:**
Replace fixed timeout with explicit wait:
```typescript
// ❌ Current (flaky)
await page.selectOption('select[name="sortBy"]', 'mostLiked');
await page.waitForTimeout(1000);

// ✅ Recommended
await page.selectOption('select[name="sortBy"]', 'mostLiked');
await expect(page.locator('.photo-card')).toHaveCount(12);
```

**Reference:** test__playwright-patterns.md - Wait Strategies

**Priority:** HIGH - Flaky tests erode CI/CD confidence

```text

---

### Documentation Domain

#### Example 3: Missing API Documentation

**Finding:**
```

Endpoint: POST /api/gallery/upload (GalleryController.java:67)
Documentation: Not found in docs/reference/api-endpoints.md

```text

**Assessment:**
- **Criticality:** HIGH (undocumented public API)
- **Confidence:** HIGH (endpoint exists, not in docs)
- **Action:** 🟠 AUTO-FIX (generate template) or ESCALATE

**Rationale:**
- High confidence (objective check)
- Could auto-fix with API doc template
- But may need dev to fill in details (request/response examples)

**Decision:** AUTO-FIX template, flag for review

**Auto-Generated Documentation:**
```markdown
## POST /api/gallery/upload

**Description:** [TODO: Add description]

**Authentication:** Required (JWT token)

**Request:**
```http
POST /api/gallery/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: [binary data]
```

**Response (200 OK):**

```json
{
  "id": 123,
  "filename": "photo.jpg",
  "url": "https://..."
}
```

**Response (400 Bad Request):**

```json
{
  "error": "File too large",
  "maxSize": "5MB"
}
```

**Implementation:** [GalleryController.java:67](../../backend/ikp-labs-api/src/main/java/com/ikplabs/gallery/controller/GalleryController.java#L67)

---

⚠️ **Auto-generated documentation - Requires review**

- [ ] Add detailed description
- [ ] Verify request/response formats
- [ ] Add usage examples

```text

---

### Planning Domain

#### Example 4: Task Too Large

**Finding:**
```

Task 1.3: Implement Gallery Sorting Feature (4 hours)
Guideline: Tasks should be 15-60 min (atomic)

```text

**Assessment:**
- **Criticality:** MEDIUM (quality issue, not blocker)
- **Confidence:** HIGH (objective measurement: 4 hours > 60 min)
- **Action:** 🟡 REVIEW

**Rationale:**
- High confidence (clear violation of guideline)
- But MEDIUM criticality (plan still usable, just not optimal)
- Auto-fix would require understanding task details (can't automate breakdown)

**Report:**
```markdown
## 🟡 MEDIUM - Task Exceeds Recommended Duration

**Task:** `Task 1.3: Implement Gallery Sorting Feature`
**Estimated Duration:** 4 hours
**Recommended:** 15-60 min (atomic tasks)
**Violation:** 4× over guideline

**Impact:**
- Harder to track progress (all-or-nothing)
- Difficult to estimate accurately
- Single large commit instead of incremental progress

**Suggested Breakdown:**
```markdown
### Task 1.3.1: Add Sorting Dropdown UI (30 min)
- Create SortDropdown component
- Add to Gallery page

### Task 1.3.2: Implement Sort API Endpoint (45 min)
- Add sortBy parameter to controller
- Implement sorting logic in service
- Add unit tests

### Task 1.3.3: Connect Frontend to API (30 min)
- Update galleryService to send sortBy param
- Update Gallery component to handle sort

### Task 1.3.4: Add E2E Tests (30 min)
- Add sorting test scenarios
- Verify URL updates
```

**Reference:** plan__four-doc-system.md - Task Breakdown Guidelines

**Priority:** MEDIUM - Improve before starting implementation

```text

---

## Escalation Workflow

### When to Escalate vs Fix

```

┌─────────────────────────────────────┐
│ Issue Detected                      │
└──────────┬──────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Assess       │
    │ Criticality  │
    │ + Confidence │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ Criticality          │
    │ CRITICAL or HIGH?    │
    └──────┬───────────────┘
           │
      ┌────┴────┐
      │         │
     Yes       No (MEDIUM/LOW)
      │         │
      ▼         ▼
 ┌─────────┐ ┌──────────────┐
 │ESCALATE │ │ Confidence   │
 │         │ │ HIGH?        │
 └─────────┘ └──────┬───────┘
                    │
               ┌────┴────┐
               │         │
              Yes       No
               │         │
               ▼         ▼
          ┌─────────┐ ┌────────┐
          │AUTO-FIX │ │ REVIEW │
          │(if safe)│ │        │
          └─────────┘ └────────┘

```text

### Escalation Report Format

When escalating, include:

```markdown
## [Emoji] [CRITICALITY] - [Issue Title]

**Component:** [File/Module affected]
**Criticality:** CRITICAL/HIGH/MEDIUM/LOW
**Confidence:** HIGH/MEDIUM/LOW

**Description:**
[Clear description of the issue]

**Evidence:**
[Objective facts supporting the finding]

**Impact:**
[What happens if not fixed]

**Suggested Fix:**
[Specific recommendation with code examples]

**Reference:**
[Link to relevant skill or documentation]

**Priority:** [Response time expectation]
```

---

## Metrics & Tracking

### Issue Distribution (Ideal)

For a healthy codebase:

| Criticality | % of Issues | Trend |
|-------------|------------|-------|
| CRITICAL | <5% | ↓ Decreasing |
| HIGH | 10-15% | ↓ Decreasing |
| MEDIUM | 30-40% | → Stable |
| LOW | 40-50% | ↑ Increasing (normal) |

**Red Flags:**

- 🚨 CRITICAL issues >10% (system unstable)
- 🚨 HIGH issues >30% (significant quality debt)
- 🚨 Trend increasing over time (quality degrading)

---

### Confidence Distribution (Ideal)

For accurate validation:

| Confidence | % of Findings | Trend |
|------------|--------------|-------|
| HIGH | 70-80% | → Stable |
| MEDIUM | 15-25% | → Stable |
| LOW | <5% | ↓ Minimized |

**Red Flags:**

- 🚨 HIGH confidence <50% (validation too subjective)
- 🚨 LOW confidence >20% (too many false positives)
- 🚨 Many MEDIUM confidence escalations ignored (criteria too strict)

---

## Related Skills

- **test__coverage-rules** - For assessing test coverage criticality
- **docs__quality-standards** - For assessing documentation issues
- **plan__four-doc-system** - For assessing plan completeness

---

**Last Updated**: January 7, 2026
**Version**: 1.0
