# Claude Governance Gap Round 4

**Status**: 🏗️ In Progress
**Created**: 2026-07-10
**Priority**: P1-High (Phase 1–2 testers), P1-High (Phase 3 PR quality gate), P3-Low (Phase 4 hook decision), Housekeeping (Phase 5)
**Type**: Infrastructure / Meta

---

## Overview

A fourth-pass gap analysis comparing IKP-Labs `.claude/` vs the senior reference repo
`wahidyankf/ose-public` was performed on 2026-07-10, following the workflow defined in
[`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`](../../../.claude/skills/repo-syncing-with-ose-primer/SKILL.md).
Gap discovery (Step 1) was already done outside this plan by diffing `.claude/agents/`,
`.claude/skills/`, and `.claude/hooks/` between the two repos via `gh api`. This plan
captures the evaluation (Step 2), adaptation (Step 3), and decision recording (Step 4) for
every item found, then executes them (Step 5) as 9 separate PRs.

This is the fourth governance round. Rounds 1–3 are archived in `plans/done/` — see
`plans/done/2026-06-02__claude-governance-gap-round-3/` for the most recent precedent on
scope, tone, and the one-PR-per-item convention this plan follows. `plans/ideas.md`
summarizes all prior rounds under Archive → Implemented.

**Why maximum PR granularity**: the user explicitly requested "semakin banyak PR semakin
baik karena gampang fixnya kalau terjadi apa2" (more, smaller PRs are better because each
one is easy to fix/revert in isolation). Every checklist phase in this plan maps to exactly
one PR — no bundling multiple agents into a single PR, even where OSE ships them as a
tight family (e.g., the web tester triad).

## Problem Statement

### Current Gaps

- No agent performs live, session-based exploratory testing against a running REST API
  (`kameravue-be` on `:8081`, `taskly-be` on `:8082`) — only static code checkers exist
  (`swe-code-checker`, `test-validator`)
- No agent drives a browser against the live rendered frontend (`kameravue-fe` on `:3002`)
  for exploratory functional testing, usability heuristics, or design-fidelity checking —
  Playwright MCP browser tools are already available in this environment but nothing
  orchestrates them into a structured testing methodology
- No documented PR review quality gate workflow — PRs are merged today with only CI +
  optional self-review (per `governance/development/workflow/implementation.md`), with no
  structured, evidence-cited, line-anchored review pass before merge
- No agent posts or resolves GitHub PR review comments programmatically
- One hook file present in OSE (`guard-pre-commit-env.test.sh`) has no counterpart in
  IKP-Labs and needs an adopt/skip decision
- `repo-syncing-with-ose-primer` SKILL.md's harness inventory table and `plans/ideas.md`
  are stale as of Round 3 and need a Round 4 entry once implementation lands

## Scope

### In-Scope — 9 PRs across 5 phases

| Phase | PR  | Item                                                | Type                 | Decision                                  |
| ----- | --- | --------------------------------------------------- | -------------------- | ----------------------------------------- |
| 1     | PR1 | `api-exploratory-tester` agent                      | New agent            | ADOPT                                     |
| 2     | PR2 | `web-exploratory-tester` agent                      | New agent            | ADOPT                                     |
| 2     | PR3 | `web-usability-tester` agent                        | New agent            | ADOPT                                     |
| 2     | PR4 | `web-design-tester` agent                           | New agent            | ADOPT                                     |
| 3     | PR5 | `governance/workflows/pr/pr-review-quality-gate.md` | New governance doc   | ADOPT                                     |
| 3     | PR6 | `pr-review-maker` agent                             | New agent            | ADOPT                                     |
| 3     | PR7 | `pr-review-fixer` agent                             | New agent            | ADOPT                                     |
| 4     | PR8 | `guard-pre-commit-env.test.sh` hook                 | Hook (adopt or skip) | SKIP (recorded, see requirements.md FR-8) |
| 5     | PR9 | Finalize sync record (SKILL.md + `plans/ideas.md`)  | Housekeeping         | N/A                                       |

Phase 3's three items (PR5 → PR6 → PR7) are **sequential-dependent**: the workflow doc
must exist before either agent's file can link to it. Phase 5 (PR9) **must run last**
since it records final agent/skill/hook counts after PR1–PR8 are merged.

### Out-of-Scope

Everything in the existing "What IKP-Labs Intentionally Does NOT Adopt" table in
`.claude/skills/repo-syncing-with-ose-primer/SKILL.md` remains permanently skipped and is
**not re-evaluated** by this plan: all `apps-ayokoding-*`, `apps-organiclever-*`,
`apps-ose-www-*`, `apps-wahidyankf-*` content agents, `apps-web-ui-storybook-deployer` (no
Storybook in IKP-Labs), `docs-tutorial-*` triad, `docs-software-engineering-separation-*`
triad.

Also out-of-scope for this round:

- Editing or refactoring any agent/skill created in Rounds 1–3
- Application feature work (KameraVue or Taskly frontend/backend code)
- Actually running a live PR review cycle against a real PR beyond the one manual dry-run
  smoke test called for in Phase 3's checklist
- Building the missing `governance/workflows/branching-strategy.md`,
  `pr-workflow.md`, `trunk-based-development.md` files described (but not yet created) by
  `repo-defining-workflows/SKILL.md` — that gap is pre-existing and unrelated to this round
- Any change to `plans/README.md` "Quick Stats" or "In Progress" listings — Phase 5's
  scope is limited to `SKILL.md` and `plans/ideas.md` only, per the sync skill's own
  Step 4/5 convention

## Dependencies

- `gh` CLI authenticated with PR read/write scope (already in use for the existing PR
  workflow per `CLAUDE.md` Merge Strategy)
- Branch protection on `main` remains active — every PR in this plan goes through the
  standard branch → PR → CI → squash-merge cycle, never a direct push

## Success Criteria

- 6 new agent files created (`api-exploratory-tester`, `web-exploratory-tester`,
  `web-usability-tester`, `web-design-tester`, `pr-review-maker`, `pr-review-fixer`), each
  with IKP-Labs-adapted frontmatter and body content (no OSE/ayokoding/organiclever/ose-www
  references, no dead `repo-governance/` links)
- 1 new governance workflow doc created (`governance/workflows/pr/pr-review-quality-gate.md`)
- PR8's hook decision is recorded with reasoning in
  `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s "does NOT adopt" table
- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` harness inventory table reflects
  the post-Round-4 counts and "Last synced" date
- `plans/ideas.md` has a Round 4 entry under Archive → Implemented, styled like the
  Round 3 entry
- All 9 PRs pass `npm run lint:md` and CI before merge
- Phase 3's manual dry-run test (PR6 + PR7 against one real, low-stakes PR) is documented
  with its outcome before Phase 3 is considered done

## Documents

- [requirements.md](./requirements.md) — Per-item OSE source / decision / reason /
  adaptation notes, functional requirements per phase
- [technical-design.md](./technical-design.md) — Agent frontmatter specifications, file
  paths, workflow doc structure, cross-reference updates
- [checklist.md](./checklist.md) — 9 top-level sections (one per PR) with atomic tasks

## References

- [`repo-syncing-with-ose-primer` SKILL.md](../../../.claude/skills/repo-syncing-with-ose-primer/SKILL.md) — the sync workflow this plan follows
- [`plans/done/2026-06-02__claude-governance-gap-round-3/`](../../done/2026-06-02__claude-governance-gap-round-3/) — precedent plan (format, tone, one-PR-per-item convention)
- [`plans/ideas.md`](../../ideas.md) — running summary of all governance rounds
