# Claude Agents Infrastructure - Technical Design

**Plan**: Claude Agents Infrastructure Implementation
**Version**: 1.0
**Last Updated**: January 5, 2025

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Skills System Design](#skills-system-design)
3. [Validation Agent Specifications](#validation-agent-specifications)
4. [File Structure](#file-structure)
5. [Agent Workflow Patterns](#agent-workflow-patterns)
6. [Report Generation](#report-generation)

---

## Architecture Overview

### System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                   User (Developer)                      │
│                                                         │
│  "Saya baru selesai implement fitur X"                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│            Claude Main Agent (You)                      │
│                                                         │
│  1. Detect: User completed feature                      │
│  2. Suggest: "Run validators?"                          │
│  3. Execute: Launch specialized agents                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Specialized Agents                         │
│                                                         │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │test-validator│  │docs-validator │  │plan-checker │  │
│  └──────┬───────┘  └───────┬───────┘  └──────┬──────┘  │
│         │                  │                  │         │
│         │ Load Skills      │ Load Skills      │ Load   │
│         ▼                  ▼                  ▼         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Skills Knowledge System                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │test__      │  │docs__      │  │wow__       │  │  │
│  │  │coverage    │  │quality     │  │criticality │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│         │                  │                  │         │
│         │ Scan Codebase    │ Scan Docs        │ Scan   │
│         ▼                  ▼                  ▼         │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │tests/ specs/ │  │docs/          │  │plans/       │  │
│  └──────┬───────┘  └───────┬───────┘  └──────┬──────┘  │
│         │                  │                  │         │
│         │ Generate Report  │ Generate Report  │ Generate│
│         ▼                  ▼                  ▼         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         generated-reports/                        │  │
│  │  - test-audit-2025-01-05.md                       │  │
│  │  - docs-audit-2025-01-05.md                       │  │
│  │  - plan-audit-2025-01-05.md                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Maker-Checker-Fixer Pattern

```text
┌─────────────────────────────────────────────────────────┐
│                    PHASE 1: MAKER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │plan-writer   │  │docs-writer   │  │gherkin-writer│  │
│  │(Existing ✅) │  │(Existing ✅) │  │(Existing ✅) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │         │
│         │ Creates Plan     │ Creates Docs     │ Creates │
│         ▼                  ▼                  ▼  Specs  │
│       plans/             docs/              specs/      │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   PHASE 2: CHECKER                      │
│                       (THIS PLAN 🆕)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │test-validator│  │docs-validator│  │plan-checker  │  │
│  │(NEW)         │  │(NEW)         │  │(NEW)         │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │         │
│         │ Validate Quality │ Validate Quality │ Validate│
│         ▼                  ▼                  ▼  Quality│
│  ┌──────────────────────────────────────────────────┐  │
│  │           Audit Reports (Markdown)                │  │
│  │  - Criticality: CRITICAL/HIGH/MEDIUM/LOW          │  │
│  │  - Confidence: HIGH/MEDIUM/FALSE_POSITIVE         │  │
│  │  - Actionable recommendations                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   PHASE 3: FIXER                        │
│                       (FUTURE 📋)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │test-fixer    │  │docs-fixer    │  │plan-fixer    │  │
│  │(Future)      │  │(Future)      │  │(Future)      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │         │
│         │ Auto-Fix HIGH    │ Auto-Fix HIGH    │ Auto-Fix│
│         │ Confidence Issues│ Confidence Issues│ Issues  │
│         ▼                  ▼                  ▼         │
│    Updated Tests       Updated Docs       Updated Plans │
└─────────────────────────────────────────────────────────┘
```

---

## Skills System Design

### Skills Directory Structure

```text
.claude/
├── agents/
│   ├── plan-writer.md (✅ existing - will update)
│   ├── documentation-writer.md (✅ existing - will update)
│   ├── gherkin-spec-writer.md (✅ existing - will update)
│   ├── test-validator.md (🆕 new)
│   ├── docs-validator.md (🆕 new)
│   └── plan-checker.md (🆕 new)
├── skills/ (🆕 new directory)
│   ├── docs__quality-standards.md
│   ├── docs__diataxis-framework.md
│   ├── test__coverage-rules.md
│   ├── test__playwright-patterns.md
│   ├── plan__four-doc-system.md
│   └── wow__criticality-assessment.md
└── settings.json (✅ existing)
```

### Skill File Template

```markdown
# Skill: [Skill Name]

**Category**: [docs/test/plan/wow]
**Purpose**: [One-line purpose]
**Used By**: [List of agents]

---

## Overview

[What this skill provides]

## Rules

1. [Rule 1 with examples]
2. [Rule 2 with examples]
3. [Rule 3 with examples]

## Guidelines

### [Guideline Category 1]

- **Do**: [Best practice]
```

[Example]

```text

- **Don't**: [Anti-pattern]
```

[Bad example]

```text

## Examples

### Good Example

```

[Full example of following the skill]

```text

### Bad Example

```

[Example of violating the skill]

```text

## Decision Criteria

When to apply this skill:
- [Scenario 1]
- [Scenario 2]

When NOT to apply:
- [Exception 1]
- [Exception 2]

## Related Skills

- [Link to related skill]
```

### Skill Loading in Agent Frontmatter

```yaml
---
name: "test-validator"
description: "Validates test coverage and synchronization"
tools: ["Read", "Bash", "Grep", "Glob", "Write"]
model: "sonnet"
color: "green"
permission:
  skill:
    test__coverage-rules: allow
    test__playwright-patterns: allow
    wow__criticality-assessment: allow
---

# Test Validator Agent

## Skills Available

This agent has access to:

- **test__coverage-rules** - Defines minimum coverage expectations
- **test__playwright-patterns** - Best practices for E2E tests
- **wow__criticality-assessment** - How to classify issue severity

Use these skills to assess test quality and generate reports.

[Rest of agent instructions...]
```

---

## Validation Agent Specifications

### Agent 1: test-validator.md

**File**: `.claude/agents/test-validator.md`

#### Frontmatter

```yaml
---
name: 'test-validator'
description: 'Validates test coverage and Gherkin-Playwright synchronization. Checks for missing tests, skipped tests, and coverage gaps. Generates audit reports with criticality levels.'
tools: ['Read', 'Bash', 'Grep', 'Glob', 'Write']
model: 'sonnet'
color: 'green'
permission:
  skill:
    test__coverage-rules: allow
    test__playwright-patterns: allow
    wow__criticality-assessment: allow
---
```

#### Validation Algorithm

```text
1. SCAN GHERKIN SPECS
   - Use Glob to list specs/**/*.feature
   - Extract feature names
   - Store in specs_list[]

2. SCAN PLAYWRIGHT E2E TESTS
   - Use Glob to list tests/e2e/**/*.spec.ts
   - Extract test file names
   - Store in tests_list[]

3. CHECK SYNCHRONIZATION
   For each spec in specs_list:
     - Check if corresponding test exists
     - If NOT found:
       → Add to report: CRITICAL - Missing E2E test
       → Confidence: HIGH
       → Recommended file path

4. CHECK FOR SKIPPED TESTS
   - Use Grep to find: test.skip, .skip(), xdescribe, xit
   - For each match:
     → Add to report: HIGH - Skipped test
     → Confidence: MEDIUM
     → File and line number

5. CHECK TEST COVERAGE
   - Read E2E test files
   - Count test cases per feature
   - Compare with Gherkin scenario count
   - If coverage < 80%:
     → Add to report: MEDIUM - Incomplete coverage

6. GENERATE REPORT
   - Sort issues by criticality (CRITICAL → HIGH → MEDIUM → LOW)
   - Format as markdown
   - Save to generated-reports/test-audit-YYYY-MM-DD.md
```

#### Output Example

```markdown
# Test Coverage Audit Report

**Generated**: 2025-01-05 14:30:00
**Agent**: test-validator
**Scanned**: 9 Gherkin specs, 13 E2E tests

## Summary

- Total Issues: 3
- CRITICAL: 1
- HIGH: 1
- MEDIUM: 1
- LOW: 0

## Issues Found: 3

### CRITICAL (1)

- [ ] **Missing E2E Test**: specs/gallery/photo-sorting.feature has NO Playwright test
  - **Confidence**: HIGH
  - **Action**: Create tests/e2e/gallery-sorting.spec.ts
  - **Expected File**: tests/e2e/gallery-sorting.spec.ts
  - **Effort**: Medium (2-3 hours)
  - **Context**: Feature has 12 scenarios but no automated E2E tests

### HIGH (1)

- [ ] **Skipped Test**: tests/e2e/registration.spec.ts:42
  - **Confidence**: MEDIUM
  - **Action**: Re-enable and fix "should validate password mismatch" test
  - **File**: tests/e2e/registration.spec.ts
  - **Line**: 42
  - **Effort**: Low (30 min)
  - **Context**: Test skipped with test.skip() - needs investigation

### MEDIUM (1)

- [ ] **Incomplete Coverage**: Login feature has 60% scenario coverage
  - **Confidence**: MEDIUM
  - **Action**: Add tests for edge cases (expired token, invalid credentials)
  - **File**: tests/e2e/login.spec.ts
  - **Current**: 3/5 scenarios tested
  - **Effort**: Medium (1-2 hours)

## Recommendations

1. **Immediate Action (CRITICAL)**: Create E2E test for photo-sorting feature
2. **This Week (HIGH)**: Investigate and fix skipped registration test
3. **This Sprint (MEDIUM)**: Improve login test coverage to 100%

## Coverage Summary

| Feature       | Gherkin Specs | E2E Tests | Coverage |
| ------------- | ------------- | --------- | -------- |
| Registration  | 9 scenarios   | 9 tests   | 100% ✅  |
| Login         | 5 scenarios   | 3 tests   | 60% ⚠️   |
| Gallery       | 12 scenarios  | 12 tests  | 100% ✅  |
| Photo Sorting | 12 scenarios  | 0 tests   | 0% ❌    |

**Overall Coverage**: 75% (24/32 scenarios tested)
```

---

### Agent 2: docs-validator.md

**File**: `.claude/agents/docs-validator.md`

#### Frontmatter

```yaml
---
name: 'docs-validator'
description: 'Validates documentation completeness and quality. Checks for undocumented API endpoints, missing JSDoc, Diátaxis compliance, and broken links.'
tools: ['Read', 'Bash', 'Grep', 'Glob', 'Write']
model: 'sonnet'
color: 'blue'
permission:
  skill:
    docs__quality-standards: allow
    docs__diataxis-framework: allow
    wow__criticality-assessment: allow
---
```

#### Validation Algorithm

```text
1. SCAN BACKEND API ENDPOINTS
   - Use Grep to find @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
   - Extract endpoint paths and HTTP methods
   - Store in endpoints_list[]

2. CHECK API DOCUMENTATION
   - Read docs/reference/api-endpoints.md
   - Extract documented endpoints
   - Compare with endpoints_list[]
   - For each undocumented endpoint:
     → Add to report: CRITICAL - Undocumented API endpoint
     → Confidence: HIGH

3. SCAN FRONTEND COMPONENTS
   - Use Glob to find frontend/src/components/**/*.tsx
   - For each component:
     → Read file
     → Check for JSDoc comment (/** ... */)
     → If missing:
       → Add to report: HIGH - Missing JSDoc
       → Confidence: HIGH

4. CHECK DIÁTAXIS COMPLIANCE
   - Use Glob to list docs/**/*.md
   - For each doc:
     → Read file
     → Determine expected category from path
     → Check if content matches category
     → If mismatch:
       → Add to report: MEDIUM - Wrong Diátaxis category

5. CHECK FOR BROKEN LINKS
   - Use Grep to find markdown links [text](path)
   - For each internal link:
     → Check if target file exists
     → If NOT:
       → Add to report: HIGH - Broken link

6. GENERATE REPORT
   - Sort by criticality
   - Format as markdown
   - Save to generated-reports/docs-audit-YYYY-MM-DD.md
```

#### Output Example

````markdown
# Documentation Audit Report

**Generated**: 2025-01-05 15:00:00
**Agent**: docs-validator
**Scanned**: 4 API controllers, 15 components, 12 doc files

## Summary

- Total Issues: 4
- CRITICAL: 1
- HIGH: 2
- MEDIUM: 1
- LOW: 0

## Issues Found: 4

### CRITICAL (1)

- [ ] **Undocumented API Endpoint**: POST /api/gallery/sort NOT documented
  - **Confidence**: HIGH
  - **Action**: Add endpoint documentation to docs/reference/api-endpoints.md
  - **Controller**: GalleryController.java
  - **Method**: sortPhotos(@RequestParam String sortBy)
  - **File**: docs/reference/api-endpoints.md
  - **Effort**: Low (15 min)
  - **Template**:
    ```markdown
    ### POST /api/gallery/sort

    **Description**: Sort gallery photos by criteria
    **Query Parameters**:

    - sortBy (string): newest|oldest|mostLiked
      **Response**: 200 OK with sorted photos array
    ```

### HIGH (2)

- [ ] **Missing JSDoc**: GallerySortingDropdown.tsx has no component documentation
  - **Confidence**: HIGH
  - **Action**: Add JSDoc header with @component, @param, @example
  - **File**: frontend/src/components/GallerySortingDropdown.tsx
  - **Line**: 1 (before component definition)
  - **Effort**: Low (10 min)
  - **Template**:
    ```typescript
    /**
     * GallerySortingDropdown - Sort gallery photos component
     *
     * @component
     * @param {SortOption} currentSort - Current sort option
     * @param {Function} onSortChange - Callback when sort changes
     * @example
     * <GallerySortingDropdown currentSort="newest" onSortChange={...} />
     */
    ```

- [ ] **Broken Link**: docs/how-to/gallery.md links to non-existent file
  - **Confidence**: HIGH
  - **Action**: Fix or remove link to docs/reference/photo-api.md
  - **File**: docs/how-to/gallery.md
  - **Line**: 23
  - **Link**: [Photo API Reference](../reference/photo-api.md)
  - **Issue**: File docs/reference/photo-api.md does not exist
  - **Effort**: Low (5 min - update link)

### MEDIUM (1)

- [ ] **Wrong Diátaxis Category**: Tutorial content in Reference section
  - **Confidence**: MEDIUM
  - **Action**: Move docs/reference/getting-started.md to docs/tutorials/
  - **File**: docs/reference/getting-started.md
  - **Current Category**: Reference
  - **Expected Category**: Tutorial
  - **Reason**: File contains step-by-step learning content, not reference info
  - **Effort**: Low (5 min - move file, update links)

## Recommendations

1. **Immediate**: Document POST /api/gallery/sort endpoint
2. **This Week**: Add JSDoc to all new components
3. **This Sprint**: Audit all docs for Diátaxis compliance

## Documentation Coverage

| Category      | Files         | JSDoc Coverage         | Link Health        |
| ------------- | ------------- | ---------------------- | ------------------ |
| API Endpoints | 4 controllers | 75% (3/4 documented)   | ⚠️                 |
| Components    | 15 components | 87% (13/15 have JSDoc) | ✅                 |
| Tutorials     | 3 docs        | 100%                   | ✅                 |
| How-To Guides | 5 docs        | 80%                    | ⚠️ (1 broken link) |
| Reference     | 3 docs        | 67%                    | ✅                 |
| Explanation   | 1 doc         | 100%                   | ✅                 |
````

---

### Agent 3: plan-checker.md

**File**: `.claude/agents/plan-checker.md`

#### Frontmatter

```yaml
---
name: 'plan-checker'
description: 'Validates implementation plan structure and completeness. Checks for 4-document system, checklist completion, and plan quality before moving to done/.'
tools: ['Read', 'Bash', 'Glob', 'Write']
model: 'sonnet'
color: 'purple'
permission:
  skill:
    plan__four-doc-system: allow
    wow__criticality-assessment: allow
---
```

#### Validation Algorithm

```text
1. SCAN PLAN DIRECTORIES
   - Use Glob to list plans/in-progress/*/
   - For each plan directory:
     → Store in plans_list[]

2. CHECK 4-DOCUMENT SYSTEM
   For each plan in plans_list:
     - Check if README.md exists
     - Check if requirements.md exists
     - Check if technical-design.md exists
     - Check if checklist.md exists
     - If any missing:
       → Add to report: CRITICAL - Missing plan document

3. VALIDATE README.md
   - Read README.md
   - Check for required sections:
     → Overview
     → Problem Statement
     → Scope (In-Scope ✅ and Out-of-Scope ❌)
     → Timeline
   - If section missing:
     → Add to report: HIGH - Incomplete README

4. VALIDATE CHECKLIST.md
   - Read checklist.md
   - Count total tasks (lines with - [ ] or - [x])
   - Count completed tasks (lines with - [x] or - [✅])
   - If unchecked tasks exist:
     → Add to report: CRITICAL - Incomplete checklist
     → List unchecked tasks

5. VALIDATE requirements.md
   - Read requirements.md
   - Check for:
     → Functional Requirements section
     → Technical Requirements section
     → Acceptance Criteria
   - If missing:
     → Add to report: HIGH - Incomplete requirements

6. VALIDATE technical-design.md
   - Read technical-design.md
   - Check for:
     → Architecture diagram (ASCII art)
     → Component specifications
     → File structure
   - If missing:
     → Add to report: MEDIUM - Missing technical details

7. GENERATE REPORT
   - Sort by criticality
   - Save to generated-reports/plan-audit-YYYY-MM-DD.md
```

#### Output Example

````markdown
# Plan Quality Audit Report

**Generated**: 2025-01-05 16:00:00
**Agent**: plan-checker
**Plan**: 2025-01-05**claude-agents-infrastructure
**Location**: plans/in-progress/2025-01-05**claude-agents-infrastructure/

## Summary

- Total Issues: 2
- CRITICAL: 1
- HIGH: 0
- MEDIUM: 1
- LOW: 0

## Issues Found: 2

### CRITICAL (1)

- [ ] **Incomplete Checklist**: 5 tasks remain unchecked in checklist.md
  - **Confidence**: HIGH
  - **Action**: Complete tasks OR move to future plan OR mark as out-of-scope
  - **File**: plans/in-progress/2025-01-05\_\_claude-agents-infrastructure/checklist.md
  - **Unchecked Tasks**:
    1. [ ] Task 3.2: Update Gallery Page with Sort State
    2. [ ] Task 4.1: Create Gherkin BDD Scenarios
    3. [ ] Task 5.1: Update API Documentation
    4. [ ] Task 5.3: Update User Guide
    5. [ ] Task 6.1: Full Feature Manual Testing
  - **Total Progress**: 85% (34/40 tasks completed)
  - **Effort**: Varies (2-4 hours to complete all)
  - **Recommendation**: Complete remaining tasks before moving plan to done/

### MEDIUM (1)

- [ ] **Missing Architecture Diagram**: technical-design.md has no ASCII diagram
  - **Confidence**: MEDIUM
  - **Action**: Add architecture overview diagram showing system components
  - **File**: plans/in-progress/2025-01-05\_\_claude-agents-infrastructure/technical-design.md
  - **Expected Section**: "Architecture Overview" with ASCII art
  - **Effort**: Low (15 min)
  - **Example**:
    ```
    User → Claude Agent → Validators → Reports
    ```

## Plan Quality Score

| Document            | Completeness | Quality                             |
| ------------------- | ------------ | ----------------------------------- |
| README.md           | 100% ✅      | Excellent (all sections present)    |
| requirements.md     | 100% ✅      | Excellent (30+ requirements)        |
| technical-design.md | 90% ⚠️       | Good (missing architecture diagram) |
| checklist.md        | 85% ⚠️       | Good (5 tasks incomplete)           |

**Overall Score**: 94% (Very Good)

## Recommendations

1. **Before moving to done/**: Complete 5 remaining checklist tasks
2. **Optional improvement**: Add architecture diagram to technical-design.md
3. **Future**: Consider adding estimated completion date to README

## Plan Readiness

**Ready to Move to done/?** ❌ NO

**Blockers**:

- 5 unchecked tasks in checklist
- Plan marked as "In Progress" not "Completed"

**Action Required**:

1. Complete remaining tasks
2. Update README.md status to "✅ Completed"
3. Add completion date
4. Move directory: `git mv plans/in-progress/[plan]/ plans/done/`
````

---

## File Structure

### Complete Directory Tree

```text
IKP-Labs/
├── .claude/
│   ├── agents/
│   │   ├── plan-writer.md (✅ update with skills)
│   │   ├── documentation-writer.md (✅ update with skills)
│   │   ├── gherkin-spec-writer.md (✅ update with skills)
│   │   ├── test-validator.md (🆕 new)
│   │   ├── docs-validator.md (🆕 new)
│   │   └── plan-checker.md (🆕 new)
│   ├── skills/ (🆕 new directory)
│   │   ├── docs__quality-standards.md
│   │   ├── docs__diataxis-framework.md
│   │   ├── test__coverage-rules.md
│   │   ├── test__playwright-patterns.md
│   │   ├── plan__four-doc-system.md
│   │   └── wow__criticality-assessment.md
│   ├── settings.json (✅ existing)
│   └── README.md (✅ update with agent catalog)
├── generated-reports/ (🆕 new directory)
│   ├── .gitkeep
│   ├── test-audit-2025-01-05.md (generated by test-validator)
│   ├── docs-audit-2025-01-05.md (generated by docs-validator)
│   └── plan-audit-2025-01-05.md (generated by plan-checker)
├── docs/
│   ├── how-to/
│   │   ├── use-claude-agents.md (🆕 new)
│   │   └── ...
│   └── explanation/
│       ├── skills-system.md (🆕 new)
│       └── ...
├── plans/
│   ├── in-progress/
│   │   └── 2025-01-05__claude-agents-infrastructure/
│   │       ├── README.md
│   │       ├── requirements.md
│   │       ├── technical-design.md
│   │       └── checklist.md
│   └── done/
├── tests/
│   ├── e2e/
│   └── api/
└── specs/
```

---

## Agent Workflow Patterns

### Pattern 1: Manual Trigger (Current Implementation)

```text
User: "Saya baru selesai implement photo sorting feature"

Claude (Main Agent):
  Step 1: Acknowledge
  "Great! Feature photo sorting sudah selesai. Saya lihat ada perubahan di:
   - backend/GalleryController.java
   - frontend/components/SortingDropdown.tsx
   - tests/e2e/gallery-sorting.spec.ts"

  Step 2: Suggest Validators
  "Saya recommend run validators untuk quality check:
   ✅ test-validator - Check test coverage
   ✅ docs-validator - Check documentation

   Mau saya jalankan sekarang?"

User: "Ya, run validators"

Claude (Main Agent):
  Step 3: Execute Validators
  "Running test-validator..."
  [Invokes test-validator agent via Task tool]

  "Running docs-validator..."
  [Invokes docs-validator agent via Task tool]

  Step 4: Report Results
  "Validation complete! Hasil:

   test-validator: ✅ All tests passing, 100% coverage
   docs-validator: ⚠️ Found 2 issues:
     - CRITICAL: Endpoint POST /api/gallery/sort not documented
     - HIGH: SortingDropdown missing JSDoc

   Reports saved to:
   - generated-reports/test-audit-2025-01-05.md
   - generated-reports/docs-audit-2025-01-05.md

   Mau saya fix the CRITICAL issue sekarang?"
```

### Pattern 2: Proactive Suggestion (Future Enhancement)

```text
[User commits code]

Claude (Main Agent - Proactive):
  "Saya detect ada commit baru dengan 3 file changes:
   - backend/GalleryController.java (+50 lines)
   - frontend/SortingDropdown.tsx (new file)
   - tests/e2e/gallery-sorting.spec.ts (new file)

   Recommend:
   ✅ Run docs-validator (new API endpoint detected)
   ✅ Run test-validator (new test file added)

   Run validators? (yes/no/later)"
```

### Pattern 3: Batch Validation

```text
User: "Run all validators on current codebase"

Claude (Main Agent):
  "Running all validators in parallel..."

  [Launches 3 agents concurrently via Task tool]
  - test-validator
  - docs-validator
  - plan-checker

  "Validation complete! Summary:

   test-validator: ⚠️ 3 issues (1 CRITICAL, 2 HIGH)
   docs-validator: ⚠️ 4 issues (1 CRITICAL, 2 HIGH, 1 MEDIUM)
   plan-checker: ✅ No issues

   Total: 7 issues found

   View reports:
   - generated-reports/test-audit-2025-01-05.md
   - generated-reports/docs-audit-2025-01-05.md
   - generated-reports/plan-audit-2025-01-05.md

   Would you like me to:
   1. Show issue details
   2. Auto-fix HIGH confidence issues
   3. Create GitHub issues for tracking"
```

---

## Report Generation

### Report File Naming Convention

```text
generated-reports/
├── test-audit-YYYY-MM-DD.md
├── docs-audit-YYYY-MM-DD.md
└── plan-audit-YYYY-MM-DD.md
```

**Format**: `[agent-type]-audit-YYYY-MM-DD.md`

**Timestamp**: UTC date in ISO format (YYYY-MM-DD)

### Report Metadata Section

Every report starts with:

```markdown
# [Report Type] Audit Report

**Generated**: YYYY-MM-DD HH:MM:SS UTC
**Agent**: [agent-name]
**Agent Version**: 1.0
**Scanned**: [What was scanned]
**Duration**: [How long it took]

## Summary

- Total Issues: X
- CRITICAL: X (must fix before commit)
- HIGH: X (fix within 1 day)
- MEDIUM: X (fix within 1 week)
- LOW: X (fix when convenient)
```

### Issue Entry Format

```markdown
### [CRITICALITY] (count)

- [ ] **[Issue Type]**: [Brief description]
  - **Confidence**: HIGH/MEDIUM/FALSE_POSITIVE
  - **Action**: [What to do to fix]
  - **File**: [Affected file path]
  - **Line**: [Line number if applicable]
  - **Effort**: [Estimated time to fix]
  - **Context**: [Additional information]
  - **Template**: [Code template if applicable]
```

### Report Footer

```markdown
## Recommendations

1. [Priority 1 action]
2. [Priority 2 action]
3. [Priority 3 action]

## Next Steps

- [ ] Review CRITICAL issues immediately
- [ ] Create tasks for HIGH priority items
- [ ] Schedule MEDIUM items for this sprint

## Resources

- [Link to relevant documentation]
- [Link to similar examples]

---

**Report Generated by**: test-validator v1.0
**Contact**: Run `/help test-validator` for usage
```

---

## Implementation Patterns

### Pattern: Skill Loading

```markdown
# Test Validator Agent

You are an expert test validation specialist.

## Skills Available

This agent has access to these skills:

- **test\_\_coverage-rules** - Use this to understand minimum test coverage requirements
- **test\_\_playwright-patterns** - Use this to assess E2E test quality
- **wow\_\_criticality-assessment** - Use this to classify issue severity

## How to Use Skills

1. Load skill knowledge: Review the skill content
2. Apply rules: Use skill guidelines to assess code/tests
3. Classify issues: Use criticality skill to assign severity
4. Generate recommendations: Based on skill best practices

## Validation Process

[Agent-specific instructions using skills...]
```

### Pattern: Criticality Classification

```markdown
## Issue Classification Logic

Use `wow__criticality-assessment` skill:

**CRITICAL** - Assign when:

- Missing tests for new features
- Undocumented public APIs
- Incomplete plan checklist (blocking release)

**HIGH** - Assign when:

- Skipped/disabled tests
- Missing JSDoc on components
- Broken documentation links

**MEDIUM** - Assign when:

- < 80% test coverage
- Wrong Diátaxis category
- Minor documentation gaps

**LOW** - Assign when:

- Style improvements
- Nice-to-have documentation
- Optional enhancements
```

### Pattern: Confidence Scoring

```markdown
## Confidence Assessment

**HIGH** - Assign when:

- Issue is definite (e.g., file does not exist)
- Automated fix is safe
- No ambiguity in resolution

**MEDIUM** - Assign when:

- Issue needs human judgment
- Multiple valid solutions exist
- Context required for fix decision

**FALSE_POSITIVE** - Assign when:

- Apparent issue is actually intentional
- Special case that looks like violation
- Known exception to rules
```

---

**Technical Design Version**: 1.0
**Last Updated**: January 5, 2025
**Ready for Implementation**: Yes
