# Skill: Applying the Maker-Checker-Fixer Pattern

**Category**: Repository Governance
**Purpose**: Define the Maker-Checker-Fixer (MCF) pattern used in IKP-Labs — what each role does, when to use a full triad vs. a single agent, and how to name and structure MCF agents.
**Used By**: repo-setup-manager, agent-maker

---

## Overview

IKP-Labs uses a **Maker-Checker-Fixer (MCF) triad** pattern for quality-sensitive workflows. Each role has a distinct responsibility and toolset. A triad produces reliable, auditable output because the checker is independent of the maker, and the fixer acts only on confirmed findings.

---

## Roles

| Role | Responsibility | Typical tools |
|------|---------------|---------------|
| **Maker** | Creates or updates content (docs, plans, agents, config) | Read, Write, Edit, Glob, Grep |
| **Checker** | Validates content against a standard; writes an audit report | Read, Glob, Grep, Write (reports only) |
| **Fixer** | Reads checker report, re-validates each finding, applies targeted corrections | Read, Write, Edit |

### Key constraints

- **Checker never fixes** — it only reports. This keeps audit output trustworthy.
- **Fixer always re-validates** — it reads the actual file before applying any change. A finding that is already resolved is skipped, not re-applied.
- **Maker does not read checker output** — the maker creates from source; the fixer is the bridge between checker and corrected state.

---

## When to Use a Full Triad

Use a full Maker-Checker-Fixer triad when:

- The output will be committed to the repository and reviewed by others
- Errors are hard to spot by eye (e.g., broken links, missing frontmatter keys, Diátaxis category violations)
- The domain has explicit, enumerable rules (a skill or standard document exists)
- The fix operation is mechanical and auditable (not a judgment call)

Use a **single agent** (maker only) when:

- The task is exploratory or conversational (no committed artifact)
- The output will be immediately reviewed by the user before any action
- There is no enumerable rule set to check against

---

## Existing Triads in IKP-Labs

| Domain | Maker | Checker | Fixer |
|--------|-------|---------|-------|
| README files | `readme-maker` | `readme-checker` | `readme-fixer` |
| CI workflows | `ci-checker` | — | `ci-fixer` |
| Documentation | `documentation-writer` | `docs-validator` | `docs-fixer` |
| Docs links | `docs-link-checker` | — | `docs-link-fixer` |
| Docs files | `docs-file-manager` | — | — |
| Plans | `plan-maker` | `plan-checker` | `plan-fixer` |
| Repo rules | `repo-rules-maker` | `repo-rules-checker` | `repo-rules-fixer` |
| Repo workflows | `repo-workflow-maker` | `repo-workflow-checker` | `repo-workflow-fixer` |
| Harness config | — | `repo-harness-compatibility-checker` | `repo-harness-compatibility-fixer` |
| PDF to Markdown | `pdf-to-md-maker` | `pdf-to-md-checker` | `pdf-to-md-fixer` |
| Gherkin specs | `gherkin-spec-writer` | `specs-checker` | `specs-fixer` |
| E2E tests | `test-maker` | `test-validator` | `test-fixer` |

---

## Naming Convention

```text
<domain>-maker.md
<domain>-checker.md
<domain>-fixer.md
```

Examples: `readme-maker`, `ci-checker`, `docs-fixer`

For domain compound names, use full kebab-case: `repo-harness-compatibility-checker`.

Agent files live in `.claude/agents/`. Skill files live in `.claude/skills/<skill-name>/SKILL.md`.

---

## Audit Report Convention

Checker agents write reports to `generated-reports/` using this filename pattern:

```text
<domain>-audit__YYYY-MM-DD-HHMM__audit.md
```

Reports are gitignored — they are local and CI artifacts only. Only `README.md` and `.gitkeep` are tracked in `generated-reports/`.

---

## Criticality Levels in Reports

Checker agents classify findings using `wow-criticality-assessment`:

| Level | Meaning |
|-------|---------|
| CRITICAL | Broken behavior — must fix before next commit |
| HIGH | Significant gap — fix this sprint |
| MEDIUM | Quality issue — fix next sprint |
| LOW | Minor — fix when convenient |

Fixer agents process findings in CRITICAL → HIGH → MEDIUM → LOW order.

---

## Preventing Iteration Loops

Without these safeguards, a checker-fixer cycle can re-litigate the same findings indefinitely. Four mechanisms keep cycles converging:

### 1. FALSE_POSITIVE skip list

Fixer appends every finding it re-validates as FALSE_POSITIVE to `generated-reports/.known-false-positives.md` (gitignored, per the Audit Report Convention above). Checker reads this file at the start of every run and skips matching findings — match on `[category] | [file] | [brief-description]`. A skipped match is logged as `[PREVIOUSLY ACCEPTED FALSE_POSITIVE — skipped]` and does not count toward the finding total.

### 2. Scoped re-validation

On a re-validation run, checker re-scans only the files the previous fixer pass actually touched (`git diff --name-only HEAD`), not the whole domain. Fixer records this list in its report under `## Changed Files (for Scoped Re-validation)`.

### 3. Post-edit self-verification

`sed -i` and similar in-place edits exit `0` even when the pattern didn't match — a silent no-op can get logged as "fixed," and the next checker run re-flags it, looping forever. Verify every `sed`/`awk` edit landed:

```bash
sed -i 's/old-pattern/new-pattern/' file.md
grep -q "new-pattern" file.md || echo "WARNING: sed pattern did not match — fix NOT applied"
```

Log as **FAILED (not applied)** if verification fails. For multi-line reformatting, prefer the `Edit` tool over `sed` — `sed` silently fails on multi-line patterns.

### 4. Escalation after repeated disagreement

If checker and fixer disagree on the same finding for 2+ consecutive cycles (checker re-flags what fixer already marked FALSE_POSITIVE), fixer marks it `ESCALATED` instead of re-applying the same verdict, and surfaces it to the user for a maker-level decision rather than looping indefinitely.

---

## Fixer Mode Parameter

Fixer agents accept an optional `mode` to control which criticality tiers get auto-applied:

| Mode | Applies |
|------|---------|
| `lax` | CRITICAL only |
| `normal` (default) | CRITICAL + HIGH |
| `strict` | CRITICAL + HIGH + MEDIUM |
| `ocd` | CRITICAL + HIGH + MEDIUM + LOW |

Findings below the mode threshold are reported but not applied — listed under `## Skipped Findings (Below Mode Threshold)` in the fix report, with a note on which mode would apply them.

---

## Related Skills

- `repo-understanding-repository-architecture` — IKP-Labs repo layout and agent catalog
- `wow-criticality-assessment` — severity classification system
- `repo-generating-validation-reports` — audit report format reference

---

**Last Updated:** 2026-08-06
