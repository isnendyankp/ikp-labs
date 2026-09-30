# Skill: Generating Validation Reports

**Category**: Repository Governance
**Purpose**: Define the standard format for repo-rules audit reports in IKP-Labs.
**Used By**: repo-rules-maker, repo-rules-checker, repo-rules-fixer

---

## Overview

All repo governance audits produce a structured markdown report saved to `generated-reports/`. Reports are gitignored — they are working artifacts, not committed code.

---

## Report Location

```text
generated-reports/repo-rules-audit-YYYY-MM-DD-HHMM.md
```

Use `date +%Y-%m-%d-%H%M` to generate the timestamp suffix.

---

## Collision-Free Execution Tracking

Minute-granularity timestamps collide when two runs of the same report family happen in
the same minute — e.g. a parent agent spawns a `repo-rules-checker` subagent while another
`repo-rules-checker` invocation is already in flight (parallel `Agent`/`Workflow` fan-out).
Both would write to the exact same filename, and the second write silently clobbers the
first. Append a short UUID chain to the filename to make every run's report path unique
and traceable to its execution lineage.

**Filename pattern with UUID chain:**

```text
generated-reports/repo-rules-audit-YYYY-MM-DD-HHMM-{uuid-chain}.md
```

**Generate the UUID:**

```bash
MY_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]' | head -c 6)
# Example: a1b2c3
```

**Scope-based chaining** — links a child run's report to the parent that spawned it, so a
checker→fixer pair (or nested subagent fan-out) leaves a traceable lineage instead of
unrelated one-off IDs:

```bash
SCOPE="repo-rules"  # the report family — matches this skill's filename prefix
CHAIN_FILE="generated-reports/.execution-chain-${SCOPE}"

if [ -f "$CHAIN_FILE" ]; then
  read PARENT_TIME PARENT_CHAIN < "$CHAIN_FILE"
  TIME_DIFF=$(( $(date +%s) - PARENT_TIME ))
  if [ "$TIME_DIFF" -lt 300 ]; then
    UUID_CHAIN="${PARENT_CHAIN}_${MY_UUID}"   # within 5 min of parent — append to chain
  else
    UUID_CHAIN="$MY_UUID"                      # parent stale — start a new chain
  fi
else
  UUID_CHAIN="$MY_UUID"                        # first execution — no parent
fi

echo "$(date +%s) $UUID_CHAIN" > "$CHAIN_FILE"
```

Chain examples: `a1b2c3` (root run), `a1b2c3_d4e5f6` (child of `a1b2c3`). The tracking
file lives in `generated-reports/` alongside the reports it chains — both are gitignored,
so no cleanup step is needed beyond what already applies to the reports themselves.

---

## Report Structure

### Required Sections

```markdown
# Repo Rules Audit — YYYY-MM-DD HH:MM

## Executive Summary

<!-- 1–3 sentences: overall health, critical count, recommendation -->

## Findings

| ID | Severity | File / Area | Issue | Action |
|----|----------|-------------|-------|--------|
| R01 | CRITICAL | ... | ... | ... |

## Details

<!-- One subsection per finding with reproduction steps and fix guidance -->

### R01 — [Issue Title]

**Severity**: CRITICAL / HIGH / MEDIUM / LOW
**File**: `path/to/file`
**Issue**: ...
**Fix**: ...

## Skipped Checks

<!-- Files that do not exist and were not expected — note why no action needed -->

## Summary

- **Total findings**: N
- **Critical**: N | **High**: N | **Medium**: N | **Low**: N
- **Recommendation**: fix all CRITICAL before merge
```

---

## Severity Classification

| Severity | Trigger |
|----------|---------|
| CRITICAL | No CODEOWNERS; no PR template; commitlint not enforcing required types |
| HIGH | Missing required commit type; Husky hook absent; CONTRIBUTING.md missing |
| MEDIUM | Missing issue templates; no SECURITY.md; .gitignore missing key patterns |
| LOW | Minor formatting issues; optional fields missing; stale content |

---

## Finding ID Format

- Prefix: `R` (repo-rules)
- Sequential: `R01`, `R02`, …
- Do not reuse IDs across runs

---

## Findings Table — Column Definitions

| Column | Content |
|--------|---------|
| ID | `R01` — sequential, unique |
| Severity | `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` |
| File / Area | File path or domain (e.g., `CODEOWNERS`, `commitlint.config.js`) |
| Issue | One sentence describing the problem |
| Action | `CREATE` / `UPDATE` / `REMOVE` / `REVIEW` |

---

## Example Report

```markdown
# Repo Rules Audit — 2026-05-31 14:00

## Executive Summary

Repository is missing 3 governance files: CODEOWNERS, PR template, and issue templates.
No critical commitlint violations. Recommend creating all 3 files before next PR.

## Findings

| ID | Severity | File / Area | Issue | Action |
|----|----------|-------------|-------|--------|
| R01 | HIGH | `.github/CODEOWNERS` | File does not exist — no ownership defined | CREATE |
| R02 | HIGH | `.github/pull_request_template.md` | File does not exist — contributors have no PR format guidance | CREATE |
| R03 | MEDIUM | `.github/ISSUE_TEMPLATE/` | Directory does not exist — no structured bug/feature templates | CREATE |

## Details

### R01 — Missing CODEOWNERS

**Severity**: HIGH
**File**: `.github/CODEOWNERS`
**Issue**: No CODEOWNERS file exists. GitHub cannot auto-assign reviewers or enforce ownership rules.
**Fix**: Create `.github/CODEOWNERS` with `* @isnendyankp` as catch-all plus per-app overrides.

...

## Summary

- **Total findings**: 3
- **Critical**: 0 | **High**: 2 | **Medium**: 1 | **Low**: 0
- **Recommendation**: Create all 3 files; no blocking issues.
```

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Fix |
|-------------|---------|-----|
| Saving report outside `generated-reports/` | Pollutes project root | Always use the standard path |
| Skipping the Summary table | Hard to scan findings at a glance | Always include the findings table |
| Vague issue descriptions | Fixer agent can't act on them | One specific sentence per issue |
| Reusing finding IDs across runs | Ambiguous references in follow-ups | Always restart from R01 per run |

---

## Related Skills

- **repo-understanding-repository-architecture** — context needed to assess what is missing
- **wow-criticality-assessment** — severity classification system
