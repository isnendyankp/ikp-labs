# Programming Shell Skill — Implementation Plan

**Status**: 🚧 In Progress
**Created**: November 1, 2026
**Type**: Infrastructure (Claude Code harness — new skill + hook consistency + CI wiring)
**Priority**: P3-Low

---

## Overview

IKP-Labs syncs harness improvements from the senior reference repo (`wahidyankf/ose-public`) via
the workflow in `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`. A gap-discovery pass
surfaced `programming-shell` — OSE's skill for shell script work (checking the declared
interpreter/strict-mode first, deciding whether logic belongs in shell at all, tracing where
exit-on-error does not reach, quoting and checking arguments, testing a script as its callers
actually run it) — as a genuine, standalone, non-architecture-dependent candidate, unlike several
other OSE items that depend on OSE's newer dual-location-stub + Serena-MCP harness redesign (a
separate, larger, deliberately deferred consideration, out of scope here).

This mirrors the already-completed `plans/done/2026-10-28__tooling-nx/` precedent: a standalone
skill, declared by zero agents, adapted from OSE content, with every worked example grounded in
real files in this repository. Unlike `tooling-nx`, this plan's research turned up a shell script
surface (`.claude/hooks/*.sh`, 5 files) that the new skill's own guidance directly diagnoses as
inconsistent — so this plan's scope grew, by explicit user decision (see "Key Decisions" below),
beyond a pure documentation-only change to include fixing that inconsistency and closing one
related automation gap, as separate PRs scoped to their own risk boundaries.

---

## What Research Confirmed

- All 5 `.claude/hooks/*.sh` files (`block-env-file-access.sh`, `block-env-file-access.test.sh`,
  `format-lint-markdown.sh`, `warm-cache-before-push.sh`, `worktree-create.sh`) disagree on
  interpreter line and strict mode: `#!/usr/bin/env bash` + `set -euo pipefail` (2 files),
  `#!/bin/bash` + `set -e` only (`worktree-create.sh`), and `#!/bin/bash` with **no** `set`
  directive at all (`format-lint-markdown.sh`, which relies entirely on `|| true` on every risky
  line, by design — it must never block a `PostToolUse` edit).
- `format-lint-markdown.sh` line 7 (`file_path=$(jq -r '.tool_input.file_path // empty'
2>/dev/null)`) is a live example of the skill's own "declaration assigned from a substitution"
  exit-on-error blind spot: a failing `jq` sets `file_path` to an empty string rather than stopping
  the script, strict mode or not, because bash's `set -e` does not see through a command
  substitution on the right-hand side of a plain assignment. `block-env-file-access.sh` (lines 8, 19) and `warm-cache-before-push.sh` (line 10) have the exact same shape of gap, made safe only by
  an immediately-following emptiness check — this plan fixes the one example the user specifically
  scoped in (see Key Decisions #5), and documents the other two as the same shape of gap, not
  independently actioned.
- No `shellcheck` or `shfmt` is installed or referenced anywhere in this repo — confirmed via
  `which shellcheck shfmt` (neither found), and `grep` across `package.json` and
  `.github/workflows/*.yml` (no match). OSE's skill references "the repository's analyser and
  formatter," which does not exist here; the adapted skill says so plainly rather than inventing a
  tool.
- Only `block-env-file-access.test.sh` (84 lines, hand-rolled `assert_deny`/`assert_allow`
  functions) has a test, and it is confirmed **not** wired into `package.json`, `.husky/*`, or any
  `.github/workflows/*.yml` job — manual-only (`# Run: bash .claude/hooks/block-env-file-access.test.sh`
  in its own header comment is the only way it currently runs).
- IKP-Labs's `governance/` tree has no equivalent of the 5 OSE governance documents the source
  skill cross-references (`shell-scripts.md`, `shell-standards.md`,
  `behaviour-driven-development.md`, `test-driven-development.md`, `developing-applications/SKILL.md`)
  — confirmed via `find governance -maxdepth 3 -type d`, and via grep confirming
  `governance/development/workflow/implementation.md` and `governance/conventions/development.md`
  mention `bash` only inside example code fences, never as a standards topic.
- No agent's `permission.skill:` references shell work — confirmed via
  `grep -rn "permission.skill" .claude/agents/*.md` combined with a manual scan for any shell
  reference.
- No existing skill directory is named `programming-shell` or anything shell-specific (only
  `swe-programming-{csharp,fsharp,golang,java,rust,typescript}` exist) — no name collision.
- Current skill count is 32, confirmed via `ls .claude/skills/ | grep -v README | wc -l`, matching
  `docs/reference/claude-agents.md`'s stated "32" exactly — no drift since `tooling-nx` landed.

---

## Scope Summary

See [requirements.md](./requirements.md) for the full scope/non-scope breakdown. In short:

- **In scope**: a new skill (`.claude/skills/programming-shell/SKILL.md`), adapted from OSE's
  content with every worked example grounded in this repository's real `.claude/hooks/*.sh` files;
  a consistency fix across all 5 hooks (shebang → `#!/usr/bin/env bash`, strict mode →
  `set -euo pipefail`, plus the one specific `jq`-exit-check fix in `format-lint-markdown.sh`); a
  new CI job in `kameravue-ci.yml` that runs the previously-orphaned `block-env-file-access.test.sh`;
  catalog bookkeeping (`docs/reference/claude-agents.md`, `repo-syncing-with-ose-primer/SKILL.md`)
  and archival.
- **Out of scope**: writing new tests for the 3 hooks that have none today; installing
  `shellcheck`/`shfmt`; creating a shell-standards or TDD governance document; any change to a
  hook's actual decision logic (regex patterns, cache-warming commands, worktree-routing) beyond
  the specific items above; wiring the test into `.husky/pre-push` (CI is the chosen enforcement
  point — see technical-design.md).

---

## Key Decisions (resolved via grill-me before writing)

| #   | Decision                                              | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | PR scope — skill-only vs. also retrofitting the hooks | **Also retrofit** — user chose a 3-way split by risk boundary: skill creation, hook shebang/strict-mode consistency, and CI/Husky wiring of the orphaned test, as separate behavior-touching PRs, beyond skill creation and catalog bookkeeping. User explicitly asked for more PRs for visibility/rollback; this is reconciled with the risk-boundary principle by keeping each PR's file-touch-set internally coherent (see PR Breakdown). |
| 2   | Skill folder/file name                                | `.claude/skills/programming-shell/SKILL.md` — exact OSE name, no `swe-` prefix, since no collision exists and `repo-syncing-with-ose-primer` tracks items by their OSE name.                                                                                                                                                                                                                                                                 |
| 3   | Section structure/wording style                       | Adopt the `tooling-nx` header convention exactly (no YAML frontmatter; `# Skill:` + `**Category**`/`**Purpose**`/`**Used By**`); section content adapted/compressed from OSE's body, not copied verbatim.                                                                                                                                                                                                                                    |
| 4   | OSE's "coverage is not measured for shell" line       | Keep it generalized, with no reference to this repo's TS (≥70%)/Java (≥80%) coverage thresholds — those don't apply to shell and citing them risked implying shell could someday hit a numeric gate the same way.                                                                                                                                                                                                                            |
| 5   | `format-lint-markdown.sh` line-7 `jq` exit-check gap  | Fix it as part of the hook-consistency PR, since that PR already opens this exact file for its shebang/strict-mode change.                                                                                                                                                                                                                                                                                                                   |
| 6   | OSE's 5 broken governance cross-references            | Honest "no equivalent yet" statement, no invented links and no loose-analog mapping to a weak IKP-Labs stand-in.                                                                                                                                                                                                                                                                                                                             |
| 7   | Exact PR count/shape                                  | 4 PRs: skill creation; hook consistency fix (bundled with the `jq` fix, same files); CI wiring of the orphaned test (separate file-touch-set); catalog bookkeeping + archive bundled together, matching `tooling-nx`'s own PR2 precedent.                                                                                                                                                                                                    |

**Follow-up note recorded, not actioned by this plan**: during Decision 6, the user explicitly
flagged that the _absence_ of a shell-standards-equivalent and a test-driven-development-equivalent
governance document in `governance/` is itself a gap worth considering for future work — but that
gap is repo-wide (applies to every language this repo uses, not just shell) and is a separate,
larger scope decision. This plan does not create either document; it is recorded here as a
candidate for a future, separately-scoped plan.

---

## PR Breakdown

| PR  | Scope                                                                                                                                                                                          | Commit type |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| PR1 | Create `.claude/skills/programming-shell/SKILL.md`                                                                                                                                             | `docs`      |
| PR2 | Hook consistency fix across all 5 `.claude/hooks/*.sh`: normalize shebang to `#!/usr/bin/env bash` and strict mode to `set -euo pipefail`; fix `format-lint-markdown.sh`'s `jq` exit-check gap | `fix`       |
| PR3 | Wire `block-env-file-access.test.sh` into `.github/workflows/kameravue-ci.yml` as a new CI job, gated into `ci-summary`                                                                        | `chore`     |
| PR4 | Catalog bookkeeping (`docs/reference/claude-agents.md` Skills Reference row + count 32→33; `repo-syncing-with-ose-primer/SKILL.md` Harness Inventory Skills 32→33); archive this plan          | `docs`      |

This plan-creation itself is not counted as one of the four PRs above — it lands in its own
setup commit/PR before PR1 begins, per the task that produced this plan.

---

## Documents

- [requirements.md](./requirements.md) — Scope, non-scope, user stories, success criteria
- [technical-design.md](./technical-design.md) — Full drafted `SKILL.md` text, exact hook diffs, exact CI job YAML, exact catalog edits
- [checklist.md](./checklist.md) — Per-PR tasks, phase gates, validation steps

---

## Related

- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — the sync workflow this plan executes one item of
- `plans/done/2026-10-28__tooling-nx/` — the immediately prior standalone-skill adoption plan, whose structure, tone, and verification rigor this plan matches
- `.claude/hooks/*.sh` — the 5 files PR2 and PR3 touch
- `.github/workflows/kameravue-ci.yml` — the CI workflow PR3 adds a job to
- `docs/reference/claude-agents.md` — the Skills Reference catalog PR4 backfills
