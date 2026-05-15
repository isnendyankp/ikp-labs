# Add CI Markdown Gate

**Status**: IN PROGRESS
**Created**: May 10, 2026
**Type**: Config Changes

---

## Overview

Add a dedicated `markdown-lint` job to the GitHub Actions CI workflow so that
markdown quality violations are caught at the PR merge gate, not just at
commit time. This closes the remaining gap between IKP-Labs and the reference
repo (`wahidyankf/ose-public`) in the area of markdown enforcement.

After the CI job was added in observe mode (Phase 3), it revealed 6,652
violations spread across deferred directories that were never covered by
previous fix passes. The plan is therefore extended from 4 phases to 11
phases: Phases 4-10 eliminate all existing violations area by area, and
Phase 11 activates the hard gate once the violation count is zero.

---

## Problem Statement

The project already has local markdown enforcement:

- `markdownlint-cli2` is installed and configured via `.markdownlint-cli2.jsonc`
- `npm run lint:md` scans all `**/*.md` files
- `lint-staged` runs `markdownlint-cli2 --fix` on staged `.md` files at commit time

However, local hooks can be bypassed (`--no-verify`). Once bypassed, there is
no CI check that catches markdown violations before they land on `main`. The
senior repo has a dedicated `markdown` CI job that prevents this.

Additionally, after adding the CI job in observe mode, the following existing
violation counts were discovered:

| Directory         | Violations | Files |
| ----------------- | ---------- | ----- |
| `.claude/skills/` | 345        | 37    |
| `.claude/agents/` | 297        | 70    |
| `apps/`           | 482        | misc  |
| Misc remaining    | 257        | misc  |
| `plans/done/`     | 5,271      | ~50   |
| **Total**         | **6,652**  |       |

The CI gate cannot be activated until all violations are zero across the entire
repository.

---

## What This Plan Implements

### Phase 1 — Markdown Scripts (DONE)

**Branch:** `config/add-markdown-scripts` | **PR:** #103

Add three named scripts to root `package.json`: `lint:md:fix`, `format:md`,
and `format:md:check`.

### Phase 2 — Fix lint-staged Coverage (DONE)

**Branch:** `config/fix-lint-staged-markdown` | **PR:** #104

Update `lint-staged` so ALL staged markdown files receive both prettier and
markdownlint processing at commit time.

### Phase 3 — CI Markdown Job, observe (DONE)

**Branch:** `ci/add-markdown-lint-job` | **PR:** #105

Add `markdown-lint` job to the CI workflow in observe mode — job runs and
reports results but `ci-summary` is NOT updated, so failures do not block PRs.

### Phase 4 — Fix `.claude/skills/` Violations

**Branch:** `docs/fix-md-claude-skills`

Auto-fix then manually fix all 345 violations across 37 files in `.claude/skills/`.

### Phase 5 — Fix `.claude/agents/` Violations

**Branch:** `docs/fix-md-claude-agents`

Auto-fix then manually fix all 297 violations across 70 files in `.claude/agents/`.

### Phase 6 — Fix `apps/` Markdown Violations

**Branch:** `docs/fix-md-apps`

Auto-fix then manually fix all 482 violations in the `apps/` directory.

### Phase 7 — Fix Misc Remaining Violations

**Branch:** `docs/fix-md-remaining`

Auto-fix then manually fix the remaining 257 violations not covered by Phases 4-6.

### Phase 8 — Fix `plans/done/` Part 1 (2024 plans)

**Branch:** `docs/fix-md-plans-done-2024`

Auto-fix then manually fix violations in 2024-dated plans under `plans/done/`.

### Phase 9 — Fix `plans/done/` Part 2 (early 2026 plans, Jan-Mar)

**Branch:** `docs/fix-md-plans-done-2026-early`

Auto-fix then manually fix violations in Jan-Mar 2026 plans under `plans/done/`.

### Phase 10 — Fix `plans/done/` Part 3 (late 2026 plans, Apr-May)

**Branch:** `docs/fix-md-plans-done-2026-late`

Auto-fix then manually fix violations in Apr-May 2026 plans under `plans/done/`.

### Phase 11 — Activate CI Gate (hard gate)

**Branch:** `ci/enforce-markdown-gate`

Update the `ci-summary` job to include `markdown-lint` in its `needs` list and
failure-condition checks. From this point forward, any PR with markdown
violations is blocked from merging.

---

## Phase Status

| Phase | Description                            | Status         | Branch                              |
| ----- | -------------------------------------- | -------------- | ----------------------------------- |
| 1     | Add markdown scripts                   | DONE (PR #103) | `config/add-markdown-scripts`       |
| 2     | Fix lint-staged coverage               | DONE (PR #104) | `config/fix-lint-staged-markdown`   |
| 3     | CI job in observe mode                 | DONE (PR #105) | `ci/add-markdown-lint-job`          |
| 4     | Fix `.claude/skills/` violations       | Pending        | `docs/fix-md-claude-skills`         |
| 5     | Fix `.claude/agents/` violations       | Pending        | `docs/fix-md-claude-agents`         |
| 6     | Fix `apps/` violations                 | Pending        | `docs/fix-md-apps`                  |
| 7     | Fix misc remaining violations          | Pending        | `docs/fix-md-remaining`             |
| 8     | Fix `plans/done/` 2024 plans           | Pending        | `docs/fix-md-plans-done-2024`       |
| 9     | Fix `plans/done/` early 2026 (Jan-Mar) | Pending        | `docs/fix-md-plans-done-2026-early` |
| 10    | Fix `plans/done/` late 2026 (Apr-May)  | Pending        | `docs/fix-md-plans-done-2026-late`  |
| 11    | Activate CI gate (hard gate)           | Pending        | `ci/enforce-markdown-gate`          |

---

## Scope Summary

What IS included: see [requirements.md](./requirements.md)

What is NOT included: see [requirements.md](./requirements.md)

---

## Quick Navigation

- [requirements.md](./requirements.md) — Scope, non-scope, user stories, acceptance criteria
- [technical-design.md](./technical-design.md) — Architecture, YAML design, script design
- [checklist.md](./checklist.md) — Atomic implementation tasks with checkboxes

---

## Document Status

| Document            | Status   |
| ------------------- | -------- |
| README.md           | Complete |
| requirements.md     | Complete |
| technical-design.md | Complete |
| checklist.md        | Complete |

---

**Last Updated**: May 6, 2026
