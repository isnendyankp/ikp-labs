# Tooling: Nx Workspace Work — Implementation Plan

**Status**: 🚧 In Progress
**Created**: October 28, 2026
**Type**: Infrastructure (Claude Code harness — new skill)
**Priority**: P3-Low

---

## Overview

IKP-Labs syncs harness improvements from the senior reference repo (`wahidyankf/ose-public`) via
the workflow in `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`. A lightweight
file-existence scan of OSE's current `.claude/skills/` listing against IKP-Labs's surfaced a new,
previously-unevaluated item: `tooling-nx` — a skill that guides day-to-day Nx workspace work
(selecting projects via the dependency graph, adding targets only where real capability exists,
diagnosing a stale cache hit, resolving a module-boundary lint finding).

Unlike the two most recently completed sync items, this one carries **no name collision** (IKP-Labs
has zero skill directory named `tooling-nx` or anything Nx-specific) and **no DEFER record** to
resolve. The adoption is correspondingly smaller: one new skill file, plus bookkeeping updates to
two existing catalog/inventory documents that this plan's research discovered were already stale
before `tooling-nx` was ever in the picture.

---

## What Research Confirmed

- IKP-Labs already has Nx-adjacent _static config auditing_ in `.claude/agents/ci-checker.md`'s
  "Nx Conformance Checks (project.json)" section (mandatory targets, coverage-threshold gating,
  four-dimension tag scheme, `specs:coverage` target) and matching fix categories in
  `.claude/agents/ci-fixer.md`. Neither covers the _runtime judgment_ layer `tooling-nx` is about:
  diagnosing a bad cache hit, deciding what to do when `nx affected` selects an unexpected project,
  or resolving a module-boundary lint finding while actively working the graph.
- `grep -rl "nx affected\|nx show project\|module.boundary\|stale.*cache" .claude/skills/*/SKILL.md`
  returns zero matches — confirmed genuine gap, not a guess.
- No `governance/` document defines Nx workspace conventions beyond a few one-line command
  mentions in `governance/principles/general.md` (`npx nx test/e2e/build <app>`). OSE's own
  cross-referenced standards docs (`nx-standards.md`, `nx-targets.md`, `meaningful-coverage.md`)
  have no IKP-Labs equivalent as standalone governance files — the closest real equivalent is
  `ci-checker.md`'s Nx Conformance Checks section (for target-capability and tag-vocabulary rules)
  and `.claude/skills/test-coverage-rules/SKILL.md` (for coverage thresholds).
- IKP-Labs has **no active `@nx/enforce-module-boundaries` ESLint rule** wired anywhere (confirmed:
  no `@nx/eslint-plugin` dependency in `package.json`, no root ESLint config, `apps/kameravue-fe`'s
  own `eslint.config.mjs` only extends `next/core-web-vitals`/`next/typescript`). The four-dimension
  tag scheme (`type:`/`platform:`/`lang:`/`domain:`) exists and is audited _statically_ by
  `ci-checker`, but no live boundary lint currently fires on a violation. The skill's module-boundary
  section is written to apply once/if that lint is ever wired in, grounded honestly in this gap.
- IKP-Labs's CI (`.github/workflows/*.yml`) does not use `nx affected` or `nx run-many` anywhere —
  every job hand-lists its app. This is real, useful grounding for the skill's "Select by the
  Project Graph, Not by Hand" section, and is explicitly **not** something this plan changes (that
  would be a CI-workflow change, out of scope here).
- `docs/reference/claude-agents.md`'s "Skills Reference" table was already stale before this plan
  started: it says "The 30 skill directories" and lists 30 rows, but the real count (confirmed via
  `ls .claude/skills/`) is 31 — missing `repo-defining-multi-agent-workflows`, added by the plan
  immediately prior to this one. This plan backfills that row in the same pass it adds `tooling-nx`,
  bringing the table to 32.

---

## Scope Summary

See [requirements.md](./requirements.md) for the full scope/non-scope breakdown. In short:

- **In scope**: a new skill (`.claude/skills/tooling-nx/SKILL.md`), adapted from OSE's content with
  every worked example grounded in real `apps/*/project.json` content; a backfill of the missing
  `repo-defining-multi-agent-workflows` row plus the new `tooling-nx` row in
  `docs/reference/claude-agents.md`'s Skills Reference table (count 30 → 32); a Harness Inventory
  bump in `repo-syncing-with-ose-primer/SKILL.md` (Skills 31 → 32).
- **Out of scope**: creating or modifying any agent to declare `tooling-nx` in `permission.skill:`;
  adding `tooling-nx` to `AGENTS.md`'s "Skills Catalog" table; wiring an actual
  `@nx/enforce-module-boundaries` lint rule into the workspace; changing CI to use `nx affected`.

---

## Key Decisions (resolved via grill-me before writing)

| #   | Decision                                                              | Resolution                                                                                                                                                                                                                                                                                       |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Agent `permission.skill:` ownership                                   | None — documentation-only, applied ad hoc. Confirmed via OSE's own 77 canonical `agents/*.md` files: zero agents (including `ci-checker`) declare `tooling-nx`, even in the source repo.                                                                                                         |
| 2   | List `tooling-nx` in `AGENTS.md`'s "Skills Catalog" table?            | No. That table only covers the three flagship Maker-Checker families; OSE itself has no equivalent curated table (just points to the full skill directory). Precedent (`repo-syncing-with-ose-primer`, `repo-practicing-trunk-based-development`) already excludes cross-cutting skills from it. |
| 3   | Fix the pre-existing stale `claude-agents.md` Skills Reference table? | Yes — backfill the missing `repo-defining-multi-agent-workflows` row **and** add `tooling-nx` in the same pass; count goes 30 → 32, not 30 → 31.                                                                                                                                                 |
| 4   | PR granularity                                                        | 2 PRs (see below) — smaller than the 3-PR precedent plan since there is no real-example retrofit and no DEFER record to close.                                                                                                                                                                   |

---

## PR Breakdown

| PR  | Scope                                                                                                                                                                                                                                                              | Commit type |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| PR1 | Create `.claude/skills/tooling-nx/SKILL.md`                                                                                                                                                                                                                        | `docs`      |
| PR2 | Backfill `repo-defining-multi-agent-workflows` and add `tooling-nx` to `docs/reference/claude-agents.md`'s Skills Reference table (count → 32); bump `repo-syncing-with-ose-primer/SKILL.md`'s Harness Inventory (Skills → 32); archive this plan to `plans/done/` | `docs`      |

This plan-creation itself is not counted as one of the two PRs above — it lands in its own
setup commit/PR before PR1 begins, per the task that produced this plan.

---

## Documents

- [requirements.md](./requirements.md) — Scope, non-scope, user stories, success criteria
- [technical-design.md](./technical-design.md) — Skill content design, adaptation mapping, full drafted `SKILL.md` text
- [checklist.md](./checklist.md) — Per-PR tasks, phase gates, validation steps

---

## Related

- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — the sync workflow this plan is executing one item of
- `.claude/agents/ci-checker.md` — the existing static Nx-conformance audit this skill's "what the rule is" layer links to, where no closer governance equivalent exists
- `.claude/agents/ci-fixer.md` — matching fix categories for the same static checks, source of two real "add a target only where a capability exists" examples (`kameravue-be` missing `lint`, `taskly-be` missing `test`)
- `docs/reference/claude-agents.md` — the Skills Reference catalog this plan backfills
- `plans/done/2026-10-16__repo-defining-multi-agent-workflows/` — the immediately prior sync-item plan, whose own `AGENTS.md`-table Non-Scope decision and PR-granularity precedent this plan follows
