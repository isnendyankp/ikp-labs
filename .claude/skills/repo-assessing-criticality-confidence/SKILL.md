---
name: repo-assessing-criticality-confidence
description: Universal classification system for checker and fixer agents using orthogonal criticality (CRITICAL/HIGH/MEDIUM/LOW importance) and confidence (HIGH/MEDIUM/FALSE_POSITIVE certainty) dimensions. Covers priority matrix (P0-P4), execution order, dual-label pattern for verification status, standardized report format, and domain-specific examples. Essential for implementing checker/fixer agents and processing audit reports
---

# Skill: Assessing Criticality and Confidence

**Category**: Quality Assurance
**Purpose**: Universal classification system for checker and fixer agents — orthogonal criticality and confidence dimensions, P0–P4 priority matrix, execution order, dual-label pattern, and standardized report format.
**Used By**: All checker and fixer agents

---

## Overview

This skill defines the **criticality-confidence classification system** used by all checker and fixer agents in IKP-Labs. It ensures consistent severity assessment, predictable fix execution order, and auditable reports.

---

## Two Orthogonal Dimensions

**Criticality** (CRITICAL / HIGH / MEDIUM / LOW):

- Measures **importance and urgency**
- Answers: "How soon must this be fixed?"
- Set by **checker agents** during validation
- Objective criteria based on impact

**Confidence** (HIGH / MEDIUM / FALSE_POSITIVE):

- Measures **certainty and fixability**
- Answers: "How certain are we this needs fixing?"
- Assessed by **fixer agents** during re-validation
- Based on re-validation results

These dimensions are **orthogonal** — they measure different things and combine to determine priority.

---

## Criticality Levels

**🔴 CRITICAL** — breaks functionality, blocks users, violates mandatory requirements

- Missing required fields that cause parse/runtime errors
- Broken internal links causing 404s
- Security vulnerabilities
- Syntax errors preventing execution
- MUST requirement violations

**🟠 HIGH** — significant quality degradation, convention violations

- Wrong format (system functions but non-compliant)
- Missing required sections in governance/plan docs
- SHOULD requirement violations

**🟡 MEDIUM** — minor quality issues, style inconsistencies

- Missing optional fields (minimal impact)
- Formatting inconsistencies
- Suboptimal structure (still functional)
- MAY/OPTIONAL requirement deviations

**🟢 LOW** — suggestions, optimizations, enhancements

- Performance optimizations
- Alternative implementation suggestions
- Best practice suggestions (not requirements)

---

## Confidence Levels

**HIGH** — objectively correct, safe to auto-fix

- Re-validation confirms issue exists
- Issue is objective and verifiable
- Fix is straightforward and safe
- No ambiguity, low risk

**MEDIUM** — uncertain, requires manual review

- Re-validation is unclear or ambiguous
- Issue is subjective (human judgment needed)
- Multiple valid interpretations
- Context-dependent decision

**FALSE_POSITIVE** — checker was wrong

- Re-validation clearly disproves issue
- Content is actually compliant
- Checker's detection logic was flawed
- Report to improve checker

---

## Criticality × Confidence Priority Matrix

| Criticality | HIGH Confidence | MEDIUM Confidence | FALSE_POSITIVE |
|-------------|-----------------|-------------------|----------------|
| 🔴 **CRITICAL** | **P0** — auto-fix immediately | **P1** — urgent manual review | Report with CRITICAL context |
| 🟠 **HIGH** | **P1** — auto-fix after P0 | **P2** — standard manual review | Report with HIGH context |
| 🟡 **MEDIUM** | **P2** — auto-fix after P1 (user approval) | **P3** — optional review | Report with MEDIUM context |
| 🟢 **LOW** | **P3** — batch fixes | **P4** — suggestions only | Report with LOW context (informational) |

### Priority Levels

| Priority | Meaning |
|----------|---------|
| P0 | Blocker — MUST fix before any merge/deploy |
| P1 | Urgent — SHOULD fix before merge, can proceed with approval |
| P2 | Normal — fix in current sprint when convenient |
| P3 | Low — fix in future sprint or batch |
| P4 | Optional — suggestion only, no action required |

---

## Execution Order for Fixer Agents

Fixer agents MUST process findings in strict priority order:

```text
1. P0 (CRITICAL + HIGH)      → auto-fix; block if fix fails
2. P1 (HIGH + HIGH,
       CRITICAL + MEDIUM)    → auto-fix HIGH+HIGH; flag CRITICAL+MEDIUM for urgent review
3. P2 (MEDIUM + HIGH,
       HIGH + MEDIUM)        → auto-fix MEDIUM+HIGH if approved; flag HIGH+MEDIUM for review
4. P3–P4 (LOW priority)      → include in summary only
```

---

## Checker Agent Responsibilities

### Criticality Decision Tree

```text
1. Does it BREAK functionality or BLOCK users?
   YES → CRITICAL
   NO  → continue

2. Does it cause SIGNIFICANT quality degradation or violate DOCUMENTED conventions?
   YES → HIGH
   NO  → continue

3. Is it a MINOR quality issue or style inconsistency?
   YES → MEDIUM
   NO  → continue

4. Is it a suggestion or optimization?
   YES → LOW
```

### Standardized Report Header

```markdown
# [Agent Name] Audit Report

**Audit ID**: {slug}__{timestamp}
**Scope**: {scope-description}
**Files Checked**: N
**Generated**: YYYY-MM-DDTHH:MM

---

## Executive Summary

- 🔴 **CRITICAL**: X
- 🟠 **HIGH**: Y
- 🟡 **MEDIUM**: Z
- 🟢 **LOW**: W

**Total Issues**: X + Y + Z + W
**Overall Status**: PASS | PASS WITH WARNINGS | FAIL
```

### Finding Format

```markdown
### 1. [Issue Title]

**File**: `path/to/file.md:line`
**Criticality**: CRITICAL — [why critical]
**Category**: [category name]

**Finding**: [what's wrong]
**Impact**: [what breaks if not fixed]
**Recommendation**: [how to fix]

**Confidence**: [assessed by fixer]
```

---

## Dual-Label Pattern

Some agents assign BOTH a verification/status label AND a criticality level:

- `docs-link-checker` — `[OK]` / `[BROKEN]` / `[REDIRECT]` + criticality
- `docs-validator` — `[Verified]` / `[Error]` / `[Outdated]` / `[Unverified]` + criticality

**Format:**

```markdown
### 1. [BROKEN] - Dead link in API reference

**File**: `docs/reference/api.md:42`
**Verification**: [BROKEN] — file does not exist at target path
**Criticality**: HIGH — broken reference in published docs
**Category**: Broken Internal Link

**Finding**: Link points to `docs/how-to/auth.md` which has been deleted.
**Recommendation**: Update link to `docs/how-to/authentication.md`

**Confidence**: [assessed by fixer]
```

**Why dual labels?**

- **Verification** describes factual state (`[BROKEN]`, `[Verified]`)
- **Criticality** describes urgency/importance (CRITICAL, HIGH)
- Both provide complementary information — neither replaces the other

---

## Fixer Agent Responsibilities

### Re-Validation Process

Fixer agents MUST re-validate ALL findings before applying fixes. Never trust checker output blindly.

```text
Checker Report → Read Finding → Re-execute Validation → Assess Confidence → Apply / Skip / Flag
```

### Confidence Assessment Steps

1. **Classify issue type**
   - Objective (missing field, wrong format) → potentially HIGH confidence
   - Subjective (narrative quality, tone) → MEDIUM confidence

2. **Re-validate finding**
   - Confirms issue → continue to step 3
   - Disproves issue → FALSE_POSITIVE

3. **Assess fix safety**
   - Safe and unambiguous → HIGH confidence (auto-fix)
   - Unsafe or ambiguous → MEDIUM confidence (flag for review)

### Fix Report Format

```markdown
# [Agent Name] Fix Report

**Source Audit**: {audit-filename}
**Fix Date**: YYYY-MM-DDTHH:MM

---

## Execution Summary

- **P0 Applied**: X
- **P1 Applied**: Y | **P1 Flagged**: Z
- **P2 Applied**: W | **P2 Flagged**: V
- **P3–P4 Suggestions**: U
- **False Positives**: T

---

## P0 Fixes Applied

### 1. [Issue Title]

**File**: `path/to/file.md`
**Criticality**: CRITICAL | **Confidence**: HIGH
**Fix Applied**: [what changed]

Before: [broken state]
After:  [fixed state]
```

---

## IKP-Labs Domain Examples

### CI Workflows (`ci-checker` / `ci-fixer`)

**CRITICAL:** Missing `ci-summary` job — pipeline gate broken
**HIGH:** Action pinned to `@main` — non-deterministic builds
**MEDIUM:** Missing `cache: npm` on setup-node step
**LOW:** Scheduled workflow missing optional `workflow_dispatch`

### Documentation (`docs-validator` / `docs-fixer`)

**CRITICAL:** `[BROKEN]` — internal link points to deleted file (404)
**HIGH:** `[Outdated]` — API endpoint changed in last release
**MEDIUM:** `[Unverified]` — external claim needs source citation
**LOW:** Missing optional code fence language tag

### Plans (`plan-checker` / `plan-fixer`)

**CRITICAL:** `checklist.md` missing — plan cannot be tracked
**HIGH:** Task estimated >4 hours — not atomic enough
**MEDIUM:** Acceptance criteria written in prose, not testable
**LOW:** Missing last-updated footer in README

### Harness Config (`repo-harness-compatibility-checker` / `repo-harness-compatibility-fixer`)

**CRITICAL:** `permission.skill` references non-existent skill directory
**HIGH:** Hook script listed in CLAUDE.md but not wired in `settings.json`
**MEDIUM:** Agent `name` frontmatter does not match filename
**LOW:** Skill directory exists but no agent references it

### Gherkin Specs (`specs-checker` / `specs-fixer`)

**CRITICAL:** Feature file references step definitions that don't exist
**HIGH:** Scenario violates 1-1-1 rule (multiple When steps)
**MEDIUM:** Duplicate scenario names in same feature file
**LOW:** Scenario missing tags for filtering

---

## Common Mistakes

### Conflating verification with criticality

`[BROKEN]` is not automatically CRITICAL — a broken link in a draft doc may be LOW. Assess independently.

### File-level instead of per-finding confidence

Each finding gets its own confidence assessment. Never assign one confidence level to all findings in a file.

### Skipping re-validation

Trust no checker finding without re-reading the actual file. Checkers have false positive rates.

### Ignoring priority order

Fixer agents that fix in discovery order instead of P0→P1→P2→P3 risk applying LOW fixes while CRITICAL issues remain.

---

## Relationship to `wow-criticality-assessment`

`wow-criticality-assessment` is the existing IKP-Labs skill covering the same domain. It remains valid and is referenced by many agents. This skill (`repo-assessing-criticality-confidence`) is the **extended version** — it adds:

- P0–P4 priority matrix
- Strict execution order for fixers
- Dual-label pattern
- IKP-Labs domain-specific examples
- Fix report format

New agents should reference this skill. Existing agents referencing `wow-criticality-assessment` need not be updated.

---

## Related Skills

- `wow-criticality-assessment` — original criticality/confidence skill (backward-compatible)
- `repo-applying-maker-checker-fixer` — MCF pattern that uses this classification system
- `repo-generating-validation-reports` — report format reference

---

**Last Updated:** June 2026
