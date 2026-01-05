# Claude Agents Infrastructure - Detailed Requirements

**Plan**: Claude Agents Infrastructure Implementation
**Version**: 1.0
**Last Updated**: January 5, 2025

---

## Table of Contents

1. [Functional Requirements](#functional-requirements)
2. [Technical Requirements](#technical-requirements)
3. [Skills System Requirements](#skills-system-requirements)
4. [Validation Agent Requirements](#validation-agent-requirements)
5. [Documentation Requirements](#documentation-requirements)
6. [Quality Requirements](#quality-requirements)

---

## Functional Requirements

### FR-1: Skills System

**Requirement**: Create centralized knowledge modules for agent best practices

**Skills to Create** (6 total):

| Skill Name | Purpose | Content |
|------------|---------|---------|
| `docs__quality-standards.md` | Documentation quality rules | Diátaxis framework, writing standards, factual accuracy |
| `docs__diataxis-framework.md` | Diátaxis categories | Tutorials, How-To, Reference, Explanation |
| `test__coverage-rules.md` | Test coverage requirements | E2E, API, Unit test expectations |
| `test__playwright-patterns.md` | E2E test patterns | Best practices for Playwright tests |
| `plan__four-doc-system.md` | Plan structure rules | README, requirements, technical-design, checklist |
| `wow__criticality-assessment.md` | Issue severity levels | CRITICAL, HIGH, MEDIUM, LOW classification |

**Acceptance Criteria:**
- ✅ All 6 skills created in `.claude/skills/` directory
- ✅ Each skill is self-contained and reusable
- ✅ Skills use consistent markdown format
- ✅ Skills can be loaded via `permission.skill` in agent frontmatter
- ✅ Skills contain actionable guidance, not just theory

---

### FR-2: Test Validator Agent

**Requirement**: Automated validation of test coverage and synchronization

**Responsibilities:**
1. Check that every Gherkin spec has corresponding Playwright E2E test
2. Check that every feature has sufficient test coverage
3. Identify skipped/disabled tests
4. Verify test file naming conventions
5. Report gaps with criticality levels

**Validation Checks:**

| Check | Description | Criticality |
|-------|-------------|-------------|
| Missing E2E test for spec | Gherkin spec exists but no E2E test | CRITICAL |
| Skipped test | Test marked as `.skip()` or commented out | HIGH |
| Incomplete test coverage | Feature has < 80% scenario coverage | MEDIUM |
| Test naming mismatch | Spec and test names don't align | MEDIUM |
| No API test for endpoint | Backend endpoint has no API test | HIGH |

**Output Format:**
```markdown
# Test Coverage Audit Report
**Generated**: 2025-01-05 10:30:00
**Agent**: test-validator

## Issues Found: 5

### CRITICAL (1)
- [ ] **Missing E2E Test**: specs/gallery/photo-sorting.feature has NO Playwright test
  - **Confidence**: HIGH
  - **Action**: Create tests/e2e/gallery-sorting.spec.ts
  - **Effort**: Medium (2-3 hours)

### HIGH (2)
- [ ] **Skipped Test**: registration.spec.ts:42 - Password mismatch validation
  - **Confidence**: MEDIUM
  - **Action**: Re-enable and fix test
  - **Effort**: Low (30 min)
```

**Acceptance Criteria:**
- ✅ Agent scans `specs/` and `tests/e2e/` directories
- ✅ Generates accurate coverage report
- ✅ Uses criticality levels (CRITICAL/HIGH/MEDIUM/LOW)
- ✅ Uses confidence scoring (HIGH/MEDIUM/FALSE_POSITIVE)
- ✅ Report saved to `generated-reports/test-audit-YYYY-MM-DD.md`

---

### FR-3: Documentation Validator Agent

**Requirement**: Automated validation of documentation completeness

**Responsibilities:**
1. Check that new API endpoints are documented
2. Check that components have JSDoc comments
3. Verify documentation follows Diátaxis framework
4. Check for broken links in documentation
5. Report missing/outdated documentation

**Validation Checks:**

| Check | Description | Criticality |
|-------|-------------|-------------|
| Undocumented API endpoint | Controller endpoint not in API reference | CRITICAL |
| Missing component JSDoc | React component has no JSDoc header | HIGH |
| Wrong Diátaxis category | Tutorial content in Reference section | MEDIUM |
| Broken internal link | Link to non-existent doc file | HIGH |
| Outdated example | Code example doesn't match actual code | MEDIUM |

**Output Format:**
```markdown
# Documentation Audit Report
**Generated**: 2025-01-05 11:00:00
**Agent**: docs-validator

## Issues Found: 4

### CRITICAL (1)
- [ ] **Undocumented Endpoint**: POST /api/photos/sort NOT in docs/reference/api-endpoints.md
  - **Confidence**: HIGH
  - **Action**: Add endpoint documentation with examples
  - **File**: docs/reference/api-endpoints.md
  - **Effort**: Low (15 min)

### HIGH (2)
- [ ] **Missing JSDoc**: GallerySortingComponent has no component documentation
  - **Confidence**: HIGH
  - **Action**: Add JSDoc header with @component, @example
  - **File**: frontend/src/components/GallerySorting.tsx
  - **Effort**: Low (10 min)
```

**Acceptance Criteria:**
- ✅ Agent scans backend controllers for endpoints
- ✅ Agent scans frontend components for JSDoc
- ✅ Verifies Diátaxis categorization
- ✅ Report saved to `generated-reports/docs-audit-YYYY-MM-DD.md`

---

### FR-4: Plan Checker Agent

**Requirement**: Automated validation of implementation plan structure

**Responsibilities:**
1. Verify 4-document system is complete
2. Check checklist completion before plan moved to done/
3. Validate plan follows project conventions
4. Check for missing sections in plan documents
5. Report plan quality issues

**Validation Checks:**

| Check | Description | Criticality |
|-------|-------------|-------------|
| Missing plan document | One of 4 required docs not present | CRITICAL |
| Incomplete checklist | Unchecked items but plan marked done | CRITICAL |
| Missing scope section | requirements.md has no scope definition | HIGH |
| No technical design | technical-design.md missing architecture | HIGH |
| Empty checklist | No tasks defined in checklist.md | MEDIUM |

**Output Format:**
```markdown
# Plan Quality Audit Report
**Generated**: 2025-01-05 12:00:00
**Agent**: plan-checker
**Plan**: 2025-01-05__claude-agents-infrastructure

## Issues Found: 2

### CRITICAL (1)
- [ ] **Incomplete Checklist**: 5 tasks unchecked in checklist.md
  - **Confidence**: HIGH
  - **Action**: Complete tasks OR move unchecked items to future plan
  - **File**: plans/in-progress/.../checklist.md
  - **Tasks**: [List of unchecked items]

### HIGH (1)
- [ ] **Missing Technical Design**: No architecture diagram in technical-design.md
  - **Confidence**: MEDIUM
  - **Action**: Add ASCII art architecture diagram
  - **File**: plans/in-progress/.../technical-design.md
```

**Acceptance Criteria:**
- ✅ Agent validates plan directory structure
- ✅ Checks all 4 required documents exist
- ✅ Validates checklist completion
- ✅ Report saved to `generated-reports/plan-audit-YYYY-MM-DD.md`

---

## Technical Requirements

### TR-1: Agent File Structure

**Requirement**: All agents must follow repository reference frontmatter format

**Frontmatter Template:**
```yaml
---
name: "agent-name"
description: "Multi-line description with examples in \\n format"
tools: ["Read", "Write", "Bash", "Grep", "Glob"]
model: "sonnet"  # or "haiku" for simple agents
color: "purple"  # visual identifier
permission:
  skill:
    docs__quality-standards: allow
    wow__criticality-assessment: allow
---
```

**Required Fields:**
- `name`: Kebab-case agent identifier
- `description`: Clear description with usage examples
- `tools`: Array of Claude Code tools the agent can use
- `model`: AI model to use (sonnet/haiku/opus)
- `color`: Visual identifier color
- `permission.skill`: Skills this agent can access

**Acceptance Criteria:**
- ✅ All new agents have complete frontmatter
- ✅ Existing agents updated with permission.skill
- ✅ Frontmatter validates without errors
- ✅ Skills referenced in permissions exist

---

### TR-2: Skills Loading Mechanism

**Requirement**: Agents can load and use skills on-demand

**Implementation:**
```markdown
## Skills Available

This agent has access to:
- `docs__quality-standards` - Documentation quality rules
- `wow__criticality-assessment` - Issue severity classification

Use these skills to:
1. Assess documentation quality
2. Classify issues by severity
```

**Skill File Format:**
```markdown
# Skill: Documentation Quality Standards

## Purpose
Define standards for high-quality documentation following Diátaxis framework.

## Rules
1. All docs must be in correct Diátaxis category
2. No placeholder content (TODO, Coming Soon)
3. All code examples must be real, not fictional
...

## Examples
### Good Documentation
[Example of well-structured doc]

### Bad Documentation
[Example of poor doc with issues]
```

**Acceptance Criteria:**
- ✅ Skills are markdown files in `.claude/skills/`
- ✅ Skills are self-contained (no external dependencies)
- ✅ Skills provide actionable guidance
- ✅ Agents reference skills in their instructions

---

### TR-3: Audit Report Format

**Requirement**: Consistent format for all validation reports

**Report Structure:**
```markdown
# [Report Type] Audit Report
**Generated**: YYYY-MM-DD HH:MM:SS
**Agent**: [agent-name]
**Target**: [what was validated]

## Summary
- Total Issues: X
- CRITICAL: X
- HIGH: X
- MEDIUM: X
- LOW: X

## Issues Found: X

### CRITICAL (count)
- [ ] **[Issue Type]**: [Description]
  - **Confidence**: HIGH/MEDIUM/FALSE_POSITIVE
  - **Action**: [What to do]
  - **File**: [Affected file]
  - **Effort**: [Estimated time]
  - **Context**: [Additional info]

### HIGH (count)
[Same format]

### MEDIUM (count)
[Same format]

### LOW (count)
[Same format]

## Recommendations
1. [Priority actions]
2. [Next steps]
```

**Acceptance Criteria:**
- ✅ All reports follow consistent format
- ✅ Reports use markdown for readability
- ✅ Reports include actionable recommendations
- ✅ Reports saved with timestamp in filename

---

### TR-4: Criticality Assessment System

**Requirement**: Standardized severity classification for all issues

**Criticality Levels:**

| Level | Definition | Examples | Response Time |
|-------|------------|----------|---------------|
| **CRITICAL** | Blocks functionality, must fix immediately | Missing tests for new feature, undocumented API | Fix before commit |
| **HIGH** | Important but not blocking | Skipped tests, missing JSDoc | Fix within 1 day |
| **MEDIUM** | Should fix but not urgent | Incomplete coverage, outdated examples | Fix within 1 week |
| **LOW** | Nice to have, cosmetic | Style improvements, minor optimizations | Fix when convenient |

**Confidence Levels:**

| Confidence | Definition | Action |
|------------|------------|--------|
| **HIGH** | Definite issue, auto-fix safe | Can be fixed automatically by fixer agent |
| **MEDIUM** | Likely issue, needs review | Human should review before fixing |
| **FALSE_POSITIVE** | Not actually an issue | Skip this item |

**Acceptance Criteria:**
- ✅ All issues classified with criticality level
- ✅ All issues have confidence score
- ✅ Classification is consistent across agents
- ✅ Follows skill: `wow__criticality-assessment.md`

---

## Skills System Requirements

### SKL-1: docs__quality-standards.md

**Content:**
- Diátaxis framework overview
- Writing style guidelines (clear, concise, present tense)
- Code example standards (real code, no placeholders)
- Cross-referencing best practices
- Accessibility requirements

**Acceptance Criteria:**
- ✅ Covers all documentation quality rules
- ✅ Provides good/bad examples
- ✅ Actionable guidance for documentation-writer agent

---

### SKL-2: docs__diataxis-framework.md

**Content:**
- 4 categories: Tutorials, How-To, Reference, Explanation
- When to use each category
- Category characteristics
- Examples from project

**Acceptance Criteria:**
- ✅ Clear category definitions
- ✅ Decision tree for categorization
- ✅ Project-specific examples

---

### SKL-3: test__coverage-rules.md

**Content:**
- Minimum coverage requirements (80% for new code)
- Test types: E2E, API, Unit, Integration
- Gherkin ↔ Playwright alignment rules
- Test naming conventions
- Skip/TODO test policies

**Acceptance Criteria:**
- ✅ Defines coverage expectations
- ✅ Explains test pyramid
- ✅ Provides test quality standards

---

### SKL-4: test__playwright-patterns.md

**Content:**
- Playwright best practices
- Page object patterns
- Proper wait strategies (NO arbitrary sleeps)
- Authentication helpers
- Test data management
- Common pitfalls

**Acceptance Criteria:**
- ✅ Covers E2E testing patterns
- ✅ Includes code examples
- ✅ Addresses flakiness prevention

---

### SKL-5: plan__four-doc-system.md

**Content:**
- 4-document structure (README, requirements, technical-design, checklist)
- Required sections for each document
- Plan lifecycle (in-progress → done)
- Checklist format and conventions
- Atomic commit strategy

**Acceptance Criteria:**
- ✅ Defines plan structure
- ✅ Explains each document purpose
- ✅ Provides templates

---

### SKL-6: wow__criticality-assessment.md

**Content:**
- CRITICAL/HIGH/MEDIUM/LOW definitions
- Confidence scoring (HIGH/MEDIUM/FALSE_POSITIVE)
- Examples of each level
- Decision criteria for classification

**Acceptance Criteria:**
- ✅ Clear severity definitions
- ✅ Confidence scoring guide
- ✅ Examples for each level

---

## Validation Agent Requirements

### VAL-1: test-validator.md Agent

**Tools Required:**
```yaml
tools: ["Read", "Bash", "Grep", "Glob", "Write"]
model: "sonnet"
```

**Validation Process:**
1. Use `Glob` to list all `.feature` files in `specs/`
2. For each spec, use `Glob` to check if corresponding `.spec.ts` exists
3. Use `Grep` to find skipped tests (`.skip()`, `test.skip`, `xdescribe`)
4. Use `Read` to check test file structure
5. Use `Write` to generate audit report

**Acceptance Criteria:**
- ✅ Accurately detects missing tests
- ✅ Identifies skipped/disabled tests
- ✅ Reports coverage gaps
- ✅ Generates actionable report

---

### VAL-2: docs-validator.md Agent

**Tools Required:**
```yaml
tools: ["Read", "Bash", "Grep", "Glob", "Write"]
model: "sonnet"
```

**Validation Process:**
1. Use `Grep` to find all `@GetMapping`, `@PostMapping`, etc in backend
2. Check if endpoints exist in `docs/reference/api-endpoints.md`
3. Use `Glob` to find all React components (`*.tsx`)
4. Use `Read` to check for JSDoc comments
5. Verify Diátaxis categorization in `docs/`
6. Use `Write` to generate audit report

**Acceptance Criteria:**
- ✅ Detects undocumented endpoints
- ✅ Finds components without JSDoc
- ✅ Verifies Diátaxis placement
- ✅ Generates actionable report

---

### VAL-3: plan-checker.md Agent

**Tools Required:**
```yaml
tools: ["Read", "Bash", "Glob", "Write"]
model: "sonnet"
```

**Validation Process:**
1. Use `Glob` to list plan directories in `plans/in-progress/`
2. For each plan, verify 4 files exist
3. Use `Read` to parse checklist.md for unchecked items
4. Check for required sections (scope, timeline, etc)
5. Use `Write` to generate audit report

**Acceptance Criteria:**
- ✅ Validates plan structure
- ✅ Checks checklist completion
- ✅ Identifies missing sections
- ✅ Generates actionable report

---

## Documentation Requirements

### DOC-1: Agent Usage Guide

**File**: `docs/how-to/use-claude-agents.md`

**Content:**
- How to run validators manually
- When to run each agent
- How to interpret audit reports
- How to fix issues found by validators

**Acceptance Criteria:**
- ✅ Step-by-step instructions
- ✅ Examples for each agent
- ✅ Troubleshooting section

---

### DOC-2: Skills System Guide

**File**: `docs/explanation/skills-system.md`

**Content:**
- What are skills and why use them
- How skills are loaded by agents
- How to create new skills
- Skills architecture diagram

**Acceptance Criteria:**
- ✅ Explains skills concept
- ✅ Provides development guide
- ✅ Includes examples

---

### DOC-3: Agent Catalog

**File**: `.claude/README.md`

**Content:**
```markdown
# Claude Agents

## Makers (3)
- **plan-writer** - Create implementation plans
- **documentation-writer** - Write Diátaxis docs
- **gherkin-spec-writer** - Create BDD specs

## Checkers (3)
- **test-validator** - Validate test coverage
- **docs-validator** - Validate documentation
- **plan-checker** - Validate plan structure

## Skills (6)
- docs__quality-standards
- docs__diataxis-framework
- test__coverage-rules
- test__playwright-patterns
- plan__four-doc-system
- wow__criticality-assessment
```

**Acceptance Criteria:**
- ✅ Lists all agents with descriptions
- ✅ Lists all skills
- ✅ Explains agent workflow

---

## Quality Requirements

### QA-1: Agent Testing

**Requirement**: All validators must be tested against real project data

**Test Cases:**
- Run test-validator on current codebase
- Verify it finds known missing tests
- Run docs-validator on current docs
- Verify it finds known gaps
- Run plan-checker on existing plans
- Verify accuracy of reports

**Acceptance Criteria:**
- ✅ Validators tested with real data
- ✅ Reports are accurate (no false positives)
- ✅ All criticality levels used appropriately

---

### QA-2: Skills Quality

**Requirement**: Skills must be clear, actionable, and accurate

**Quality Checks:**
- Skills provide actionable guidance
- Skills include examples
- Skills are up-to-date with project standards
- Skills are self-contained

**Acceptance Criteria:**
- ✅ All skills reviewed for quality
- ✅ Examples are realistic
- ✅ No outdated information

---

### QA-3: Report Accuracy

**Requirement**: Audit reports must be trustworthy

**Validation:**
- Cross-check report findings manually
- Verify criticality levels are appropriate
- Confirm recommended actions are correct
- Test confidence scoring accuracy

**Acceptance Criteria:**
- ✅ < 5% false positive rate
- ✅ All CRITICAL issues are truly critical
- ✅ Recommendations are actionable

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [ ] All 6 skills created and accurate
- [ ] All 3 validation agents implemented
- [ ] Audit reports generate correctly
- [ ] Existing agents updated with skill permissions
- [ ] Documentation complete (how-to + explanation)
- [ ] Manual testing confirms accuracy
- [ ] Follow repo senior structure exactly

### Should Pass (P1)
- [ ] Reports use confidence scoring
- [ ] Skills are reusable across agents
- [ ] Agent catalog updated
- [ ] All validators tested with real data

### Nice to Have (P2)
- [ ] Visual workflow diagrams
- [ ] Example reports in documentation
- [ ] Before/after comparison

---

**Requirements Version**: 1.0
**Last Updated**: January 5, 2025
**Total Requirements**: 30+ detailed requirements across 6 categories
