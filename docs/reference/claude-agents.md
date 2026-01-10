# Claude Agents Catalog

Complete reference documentation for all Claude agents in the IKP-Labs project, including their capabilities, usage, and skills.

## Overview

The IKP-Labs project uses **6 specialized Claude agents** organized into two categories:

- **Maker Agents (3):** Create content (plans, documentation, specs)
- **Validator Agents (3):** Validate quality and completeness

### Agent Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Agents System                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  MAKER AGENTS              VALIDATOR AGENTS              │
│  ┌──────────────┐         ┌──────────────┐              │
│  │ plan-writer  │────────▶│ plan-checker │              │
│  │              │         │              │              │
│  │ docs-writer  │────────▶│ docs-validator│             │
│  │              │         │              │              │
│  │ spec-writer  │────────▶│ test-validator│             │
│  └──────────────┘         └──────────────┘              │
│         │                         │                      │
│         └────────▶  Skills ◀───────┘                     │
│                   (Knowledge Base)                       │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Reference

| Agent | Type | Purpose | Skills Used |
|-------|------|---------|-------------|
| **plan-writer** | Maker | Create implementation plans | plan__four-doc-system, wow__criticality-assessment |
| **documentation-writer** | Maker | Create/update documentation | docs__quality-standards, docs__diataxis-framework, wow__criticality-assessment |
| **gherkin-spec-writer** | Maker | Create Gherkin BDD specs | test__coverage-rules, test__playwright-patterns, wow__criticality-assessment |
| **test-validator** | Validator | Validate E2E test coverage | test__coverage-rules, test__playwright-patterns, wow__criticality-assessment |
| **docs-validator** | Validator | Validate documentation quality | docs__quality-standards, docs__diataxis-framework, wow__criticality-assessment |
| **plan-checker** | Validator | Validate plan readiness | plan__four-doc-system, wow__criticality-assessment |

---

## Maker Agents

### plan-writer

**File:** [`.claude/agents/plan-writer.md`](../../.claude/agents/plan-writer.md)

**Purpose:** Create and update implementation plans using the 4-document system

**Usage:**
```bash
@plan-writer create plan for [feature description]
```

**Capabilities:**

1. **Create New Plans**
   - Generate all 4 documents (README, requirements, technical-design, checklist)
   - Write clear objectives and success criteria
   - Define scope (in-scope/out-of-scope)
   - Create atomic tasks with time estimates

2. **Update Existing Plans**
   - Mark tasks as completed
   - Update timeline and milestones
   - Adjust scope as requirements change
   - Move plans between in-progress/done/archived

3. **Write Technical Specifications**
   - Architecture diagrams
   - Data models and API specs
   - Component design
   - Security considerations

4. **Create Task Breakdowns**
   - Atomic tasks (15-60 min each)
   - Time estimates
   - Phase organization
   - Commit strategy

**Skills Accessed:**
- `plan__four-doc-system` - 4-document structure standards
- `wow__criticality-assessment` - Issue severity classification

**Example Usage:**
```bash
User: "I need a plan for implementing password reset feature"

Assistant: @plan-writer

[Agent creates:]
- plans/in-progress/password-reset/README.md
- plans/in-progress/password-reset/requirements.md
- plans/in-progress/password-reset/technical-design.md
- plans/in-progress/password-reset/checklist.md
```

**Related Documentation:**
- [Create Implementation Plans](../how-to/create-implementation-plans.md)

---

### documentation-writer

**File:** [`.claude/agents/documentation-writer.md`](../../.claude/agents/documentation-writer.md)

**Purpose:** Create and update documentation following the Diátaxis framework

**Usage:**
```bash
@documentation-writer create [type] doc for [feature]
```

**Capabilities:**

1. **Create New Documentation**
   - Choose correct Diátaxis category
   - Write clear, concise content
   - Add code examples
   - Cross-reference related docs

2. **Update Existing Documentation**
   - Keep information accurate
   - Add new sections
   - Fix outdated content
   - Improve clarity

3. **Follow Diátaxis Framework**
   - **Tutorials** (`docs/tutorials/`) - Learning-oriented
   - **How-To** (`docs/how-to/`) - Problem-solving
   - **Reference** (`docs/reference/`) - Information
   - **Explanation** (`docs/explanation/`) - Understanding

4. **Maintain Quality Standards**
   - Use active voice
   - Write in present tense
   - Include real code examples
   - No placeholders (TODO, TBD)

**Skills Accessed:**
- `docs__quality-standards` - Writing style and quality rules
- `docs__diataxis-framework` - Documentation categorization
- `wow__criticality-assessment` - Issue severity classification

**Example Usage:**
```bash
User: "I've implemented JWT authentication. Can you document how to use it?"

Assistant: @documentation-writer

[Agent creates:]
- docs/how-to/use-jwt-authentication.md
  (how-to guide for using JWT)

Or if appropriate:
- docs/reference/jwt-api.md
  (reference documentation for JWT API)
```

**Diátaxis Categories:**

| Category | Purpose | Example |
|----------|---------|---------|
| **tutorials/** | Learning-oriented | "Getting Started with Development" |
| **how-to/** | Problem-solving | "Use Claude Validators" |
| **reference/** | Information | "API Endpoints" |
| **explanation/** | Understanding | "Authentication Architecture" |

**Related Documentation:**
- [Diátaxis Framework](../../.claude/skills/docs__diataxis-framework.md)

---

### gherkin-spec-writer

**File:** [`.claude/agents/gherkin-spec-writer.md`](../../.claude/agents/gherkin-spec-writer.md)

**Purpose:** Create and update Gherkin BDD specifications in the `specs/` folder

**Usage:**
```bash
@gherkin-spec-writer create scenarios for [feature]
```

**Capabilities:**

1. **Create Feature Files**
   - Write Gherkin syntax (Given-When-Then)
   - Follow 1-1-1 rule (1 Given, 1 When, 1 Then per scenario)
   - Align with Playwright E2E tests
   - Cover edge cases

2. **Update Existing Scenarios**
   - Reflect requirement changes
   - Add new scenarios
   - Fix outdated scenarios
   - Improve clarity

3. **Write Precise Scenarios**
   - Specific steps (not vague)
   - Testable outcomes
   - Realistic data
   - Business language

4. **Align with Tests**
   - Match Playwright test structure
   - Ensure test coverage
   - Verify test scenarios match specs

**Skills Accessed:**
- `test__coverage-rules` - Coverage requirements
- `test__playwright-patterns` - Best practices
- `wow__criticality-assessment` - Issue severity classification

**Example Usage:**
```bash
User: "I need to add authentication scenarios for the registration feature"

Assistant: @gherkin-spec-writer

[Agent creates:]
# specs/registration.feature

Feature: User Registration
  As a new user
  I want to register an account
  So that I can access the application

  Scenario: Successful registration with valid data
    Given I am on the registration page
    When I submit valid registration details
    Then I should be redirected to the dashboard
    And I should see a success message
```

**1-1-1 Rule:**
Each scenario should have:
- **1 Given** (Initial context)
- **1 When** (Action taken)
- **1 Then** (Expected outcome)

**Related Documentation:**
- [Test Coverage Rules](../../.claude/skills/test__coverage-rules.md)

---

## Validator Agents

### test-validator

**File:** [`.claude/agents/test-validator.md`](../../.claude/agents/test-validator.md)

**Purpose:** Validate E2E test coverage and quality using Playwright testing best practices

**Usage:**
```bash
@test-validator
```

**Capabilities:**

1. **E2E Test Coverage Validation**
   - Compare Gherkin specs to Playwright tests
   - Identify missing test scenarios
   - Validate coverage against requirements
   - Check critical path coverage (100% required)

2. **Spec ↔ Test Synchronization**
   - Find Gherkin scenarios without tests
   - Find tests without matching specs
   - Detect outdated specs
   - Identify orphaned tests

3. **Playwright Best Practices**
   - Validate selector priority (role > text > CSS > XPath)
   - Check for hardcoded waits (`waitForTimeout`)
   - Verify proper assertions
   - Detect flaky test patterns

4. **Flaky Test Detection**
   - Identify unreliable selectors
   - Detect timing-dependent tests
   - Find brittle test patterns
   - Suggest stabilizing improvements

5. **Report Generation**
   - Generate `test-audit-YYYY-MM-DD-HHMM.md`
   - Classify findings by criticality
   - Provide specific fixes
   - Track metrics over time

**Skills Accessed:**
- `test__coverage-rules` - Coverage thresholds
- `test__playwright-patterns` - Best practices
- `wow__criticality-assessment` - Issue classification

**Example Findings:**
```markdown
## 🟠 HIGH - Missing Test Scenario

**Spec:** specs/gallery-sorting.feature
**Scenario:** User can sort photos by most favorited
**Status:** ❌ No corresponding test found

**Suggested Fix:**
```typescript
test('sort photos by most favorited', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('combobox').selectOption('mostFavorited');
  await expect(page.locator('.photo-card').first())
    .toContainText('Likes: 999');
});
```

**Priority:** HIGH - Add within 1-2 days
```

**Report Location:**
```
generated-reports/test-audit-YYYY-MM-DD-HHMM.md
```

**Related Documentation:**
- [Use Claude Validators](../how-to/use-claude-validators.md)

---

### docs-validator

**File:** [`.claude/agents/docs-validator.md`](../../.claude/agents/docs-validator.md)

**Purpose:** Validate documentation completeness, quality, and adherence to the Diátaxis framework

**Usage:**
```bash
@docs-validator
```

**Capabilities:**

1. **API Documentation Validation**
   - Scan backend controllers for endpoints
   - Verify all endpoints are documented
   - Validate request/response formats
   - Check authentication requirements

2. **JSDoc/JavaDoc Coverage**
   - Calculate function/method documentation coverage
   - Target: ≥80% for public functions
   - Identify undocumented code
   - Check parameter documentation

3. **Diátaxis Framework Validation**
   - Verify docs are in correct categories
   - Check proper categorization:
     - `tutorials/` → Learning-oriented
     - `how-to/` → Problem-solving
     - `reference/` → Information
     - `explanation/` → Understanding
   - Detect misclassified docs

4. **Quality Standards Validation**
   - Validate writing style (active voice, present tense)
   - Detect placeholders (TODO, TBD, Lorem ipsum)
   - Verify code examples are accurate
   - Check for outdated content

5. **Broken Link Detection**
   - Scan internal links (`[link](../other-doc.md)`)
   - Check external links
   - Report broken references

6. **Report Generation**
   - Generate `docs-audit-YYYY-MM-DD-HHMM.md`
   - Classify findings by criticality
   - Provide specific fixes
   - Track metrics over time

**Skills Accessed:**
- `docs__quality-standards` - Writing style and quality
- `docs__diataxis-framework` - Categorization
- `wow__criticality-assessment` - Issue classification

**Example Findings:**
```markdown
## 🟠 HIGH - Undocumented API Endpoint

**Endpoint:** GET /api/photos/{id}/favorite
**Status:** ❌ Not documented

**Suggested Fix:**
Add to docs/reference/api-endpoints.md:
```markdown
### Get Photo Favorite Status

**Endpoint:** GET /api/photos/{id}/favorite
**Authentication:** Required

**Response:**
```json
{
  "id": 123,
  "isFavorited": true
}
```
```

**Priority:** HIGH - Add within 1-2 days
```

**Report Location:**
```
generated-reports/docs-audit-YYYY-MM-DD-HHMM.md
```

**Related Documentation:**
- [Use Claude Validators](../how-to/use-claude-validators.md)

---

### plan-checker

**File:** [`.claude/agents/plan-checker.md`](../../.claude/agents/plan-checker.md)

**Purpose:** Validate implementation plan completeness, task atomicity, and readiness for execution

**Usage:**
```bash
@plan-checker

# Or validate specific plan
@plan-checker validate plans/in-progress/authentication/
```

**Capabilities:**

1. **4-Document System Validation**
   - Verify all 4 documents exist:
     - README.md (overview, objectives)
     - requirements.md (requirements)
     - technical-design.md (architecture)
     - checklist.md (tasks)
   - Validate required sections in each document

2. **Task Atomicity Validation**
   - Check task sizes (15-60 min per task)
   - Identify tasks that are too large (>60 min)
   - Find tasks that are too small (<10 min)
   - Suggest task breakdown

3. **Acceptance Criteria Quality**
   - Validate criteria are testable (INVEST principles)
   - Detect vague criteria ("should be fast")
   - Check for implementation details in requirements
   - Suggest specific metrics

4. **Checklist Completion Status**
   - Calculate completion percentage
   - Identify stalled plans (>7 days no progress)
   - Track in-progress tasks
   - Detect abandoned plans

5. **Cross-Reference Validation**
   - Validate links between documents
   - Detect broken references
   - Check file paths

6. **Placeholder Detection**
   - Scan for incomplete content (TODO, TBD)
   - Report placeholder sections
   - Identify empty sections

7. **Report Generation**
   - Generate `plan-audit-YYYY-MM-DD-HHMM.md`
   - Classify findings by criticality
   - Provide specific fixes
   - Assess plan readiness

**Skills Accessed:**
- `plan__four-doc-system` - 4-document structure
- `wow__criticality-assessment` - Issue classification

**Example Findings:**
```markdown
## 🔴 CRITICAL - Missing Required Document

**Plan:** plans/in-progress/user-authentication/
**Missing:** technical-design.md

**Impact:**
- No architecture design documented
- Risk of inconsistent implementation
- **BLOCKER:** Cannot start implementation

**Suggested Fix:**
Create technical-design.md with sections:
1. Architecture Overview
2. Data Models
3. API Specifications
4. Security Considerations

**Priority:** CRITICAL - Add immediately
```

**Report Location:**
```
generated-reports/plan-audit-YYYY-MM-DD-HHMM.md
```

**Plan Readiness Criteria:**
- ✅ All 4 documents exist
- ✅ All required sections present
- ✅ ≥90% tasks atomic
- ✅ ≥80% acceptance criteria testable
- ✅ No CRITICAL issues
- ✅ <3 HIGH priority issues

**Related Documentation:**
- [Use Claude Validators](../how-to/use-claude-validators.md)
- [Create Implementation Plans](../how-to/create-implementation-plans.md)

---

## Skills (Knowledge Base)

Skills are centralized knowledge modules that agents access via `permission.skill` configuration.

### Available Skills

| Skill | Purpose | Used By |
|-------|---------|---------|
| **plan__four-doc-system** | 4-document plan structure | plan-writer, plan-checker |
| **docs__quality-standards** | Documentation quality rules | documentation-writer, docs-validator |
| **docs__diataxis-framework** | Diátaxis categorization | documentation-writer, docs-validator |
| **test__coverage-rules** | Test coverage requirements | gherkin-spec-writer, test-validator |
| **test__playwright-patterns** | Playwright best practices | gherkin-spec-writer, test-validator |
| **wow__criticality-assessment** | Issue severity classification | All agents |

### Skill Details

For detailed information about each skill, see:
- [`.claude/skills/`](../../.claude/skills/) directory

---

## Criticality Assessment System

All validators use the same criticality assessment system:

### Criticality Levels

| Level | Emoji | Response Time | Example |
|-------|-------|---------------|---------|
| **CRITICAL** | 🔴 | Immediate | Missing required document |
| **HIGH** | 🟠 | 1-2 days | Missing test for important feature |
| **MEDIUM** | 🟡 | 1 week | Non-atomic tasks |
| **LOW** | 🟢 | Low priority | Typos, minor formatting |

### Confidence Levels

- **HIGH Confidence** - Clear issue, definite fix needed
- **MEDIUM Confidence** - Likely issue, needs review
- **LOW Confidence** - Possible issue, investigate further

### Decision Matrix

```
                 HIGH Confidence    MEDIUM Confidence   LOW Confidence
CRITICAL (🔴)     AUTO-FIX           ESCALATE            ESCALATE
HIGH (🟠)        AUTO-FIX           ESCALATE            REVIEW
MEDIUM (🟡)      AUTO-FIX           REVIEW              IGNORE
LOW (🟢)         AUTO-FIX           REVIEW              IGNORE
```

---

## Maker-Checker-Fixer Pattern

The agents follow the Maker-Checker-Fixer workflow:

```
┌─────────────────────────────────────────────────────────┐
│              Maker-Checker-Fixer Pattern                │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. MAKER (Create)                                       │
│     ┌──────────────┐                                    │
│     │ plan-writer  │ ──► Create 4-document plan         │
│     │ docs-writer  │ ──► Create documentation           │
│     │ spec-writer  │ ──► Create Gherkin specs           │
│     └──────────────┘                                    │
│           │                                              │
│           ▼                                              │
│  2. CHECKER (Validate)                                   │
│     ┌──────────────┐                                    │
│     │ plan-checker │ ──► Validate plan completeness     │
│     │ docs-validator│ ──► Validate documentation        │
│     │ test-validator│ ──► Validate test coverage        │
│     └──────────────┘                                    │
│           │                                              │
│           ▼                                              │
│     [Issues Found?]                                     │
│           │                                              │
│     Yes │ │ No                                          │
│           ▼                                              │
│  3. FIXER (Fix)                                          │
│     ┌──────────────┐                                    │
│     │ plan-writer  │ ◄─ Fix plan issues                 │
│     │ docs-writer  │ ◄─ Fix documentation issues        │
│     │ spec-writer  │ ◄─ Fix spec issues                 │
│     └──────────────┘                                    │
│           │                                              │
│           ▼                                              │
│     [Return to CHECKER]                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Common Workflows

### Workflow 1: Creating a New Feature

```bash
# 1. Create plan
@plan-writer create plan for [feature]

# 2. Validate plan
@plan-checker

# 3. Fix any issues
# (edit plan files)

# 4. Re-validate
@plan-checker

# 5. Start implementation
# (follow checklist.md)
```

---

### Workflow 2: After Implementing Feature

```bash
# 1. Write Gherkin specs
@gherkin-spec-writer create scenarios for [feature]

# 2. Create documentation
@documentation-writer create how-to for [feature]

# 3. Validate tests
@test-validator

# 4. Validate documentation
@docs-validator

# 5. Fix any HIGH+ issues

# 6. Create pull request
```

---

### Workflow 3: Regular Quality Audits

```bash
# Run all validators monthly
@test-validator
@docs-validator
@plan-checker

# Review reports
cat generated-reports/test-audit-*.md
cat generated-reports/docs-audit-*.md
cat generated-reports/plan-audit-*.md

# Fix CRITICAL and HIGH issues
# Track metrics over time
```

---

## Agent Configuration

All agents use YAML frontmatter for configuration:

```yaml
---
name: agent-name
description: Agent description (shown in @ mentions)
model: sonnet  # or opus, haiku
color: purple  # or blue, green, etc.
permission.skill:
  - skill_name_1
  - skill_name_2
---
```

### Model Selection

- **sonnet** - Default for most agents (balanced quality/speed)
- **opus** - For complex reasoning tasks
- **haiku** - For quick, simple tasks

### Color Coding

- **purple** - Maker agents
- **blue** - Validator agents
- **green** - General purpose
- **orange** - Specialized tasks

---

## Report Formats

### test-validator Report

**File:** `generated-reports/test-audit-YYYY-MM-DD-HHMM.md`

**Sections:**
- Executive Summary
- E2E Test Coverage
- Spec ↔ Test Synchronization
- Playwright Best Practices
- Flaky Test Detection
- Findings (by criticality)

---

### docs-validator Report

**File:** `generated-reports/docs-audit-YYYY-MM-DD-HHMM.md`

**Sections:**
- Executive Summary
- API Documentation Coverage
- JSDoc/JavaDoc Coverage
- Diátaxis Framework Validation
- Quality Standards Check
- Broken Links
- Findings (by criticality)

---

### plan-checker Report

**File:** `generated-reports/plan-audit-YYYY-MM-DD-HHMM.md`

**Sections:**
- Executive Summary
- 4-Document System Validation
- Required Sections Check
- Task Atomicity Report
- Acceptance Criteria Quality
- Checklist Completion Status
- Cross-Reference Validation
- Placeholder Detection
- Plan Readiness Assessment

---

## Best Practices

### DO ✅

1. **Use agents for their intended purpose**
   - Makers for creating content
   - Validators for quality checks
   - Don't bypass validation

2. **Run validators before milestones**
   - Before starting implementation (@plan-checker)
   - Before pull requests (@test-validator, @docs-validator)
   - Before releases (all validators)

3. **Fix issues systematically**
   - CRITICAL → HIGH → MEDIUM → LOW
   - Re-run validators after fixes
   - Track metrics over time

4. **Keep skills up to date**
   - Skills are single source of truth
   - Update when standards change
   - All agents reference same skills

### DON'T ❌

1. **Don't skip validation**
   - Always validate plans before implementing
   - Always check test coverage before merging
   - Always verify documentation quality

2. **Don't ignore CRITICAL/HIGH issues**
   - CRITICAL = Blocker, fix immediately
   - HIGH = Urgent, fix within 1-2 days

3. **Don't use wrong agent for task**
   - Use plan-writer for plans, not plan-checker
   - Use documentation-writer for docs, not docs-validator

4. **Don't forget Maker-Checker-Fixer**
   - Makers create
   - Checkers validate
   - Fixers fix issues

---

## Troubleshooting

### Agent Not Responding

**Issue:** Agent doesn't start when tagged

**Possible Causes:**
1. Agent name misspelled
2. Agent file not found
3. Permission misconfiguration

**Solution:**
```bash
# Check agent exists
ls .claude/agents/

# Verify frontmatter
head -10 .claude/agents/agent-name.md

# Check permissions
grep "permission.skill" .claude/agents/agent-name.md
```

---

### Validator Reports Not Generated

**Issue:** No report file created

**Possible Causes:**
1. `generated-reports/` directory doesn't exist
2. File permission issues
3. Validator crashed mid-execution

**Solution:**
```bash
# Ensure directory exists
mkdir -p generated-reports/

# Check permissions
ls -la generated-reports/

# Re-run validator
@validator-name
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

## Metrics and Tracking

### Test Coverage Metrics

```
Last Month:  65% coverage
This Month:  78% coverage (+13%)
Target:      90% coverage
Gap:         -12%
```

### Documentation Metrics

```
API Endpoints:      45/50 (90%)
JSDoc Coverage:     82% (target: 80%)
Broken Links:       3 (down from 12)
Placeholders:       0 (down from 7)
```

### Plan Metrics

```
Plans Ready:        3/5 (60%)
Plans At Risk:      1/5 (20%)
Plans Stalled:      1/5 (20%)
Avg Task Atomicity: 88%
```

---

## Related Documentation

### How-To Guides
- [Use Claude Validators](../how-to/use-claude-validators.md)
- [Create Implementation Plans](../how-to/create-implementation-plans.md)

### Skills Reference
- [`.claude/skills/plan__four-doc-system.md`](../../.claude/skills/plan__four-doc-system.md)
- [`.claude/skills/docs__quality-standards.md`](../../.claude/skills/docs__quality-standards.md)
- [`.claude/skills/docs__diataxis-framework.md`](../../.claude/skills/docs__diataxis-framework.md)
- [`.claude/skills/test__coverage-rules.md`](../../.claude/skills/test__coverage-rules.md)
- [`.claude/skills/test__playwright-patterns.md`](../../.claude/skills/test__playwright-patterns.md)
- [`.claude/skills/wow__criticality-assessment.md`](../../.claude/skills/wow__criticality-assessment.md)

---

## Summary

| Agent | Type | Input | Output |
|-------|------|-------|--------|
| **plan-writer** | Maker | Feature description | 4-document plan |
| **documentation-writer** | Maker | Feature/topic | Documentation (Diátaxis) |
| **gherkin-spec-writer** | Maker | Feature requirements | Gherkin specs |
| **test-validator** | Validator | E2E tests | test-audit report |
| **docs-validator** | Validator | Documentation | docs-audit report |
| **plan-checker** | Validator | Implementation plan | plan-audit report |

**Key Takeaways:**
- ✅ Use **makers** to create content
- ✅ Use **validators** to check quality
- ✅ Fix **CRITICAL** issues immediately
- ✅ Fix **HIGH** issues urgently
- ✅ Track metrics over time
- ✅ Follow Maker-Checker-Fixer pattern

**Claude Agents are your automated quality assistants!** 🚀
