# Claude Governance Gap Round 5

**Status**: 🚧 In Progress
**Created**: 2026-08-05
**Priority**: P1 (Phase 1), P2 (Phases 2–8), P3 (Phase 9), Housekeeping (Phase 10)
**Type**: Infrastructure / Meta

---

## Overview

A fifth-pass gap analysis comparing IKP-Labs `.claude/` vs the senior reference repo
`wahidyankf/ose-public` was performed, following the workflow defined in
[`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`](../../../.claude/skills/repo-syncing-with-ose-primer/SKILL.md).

Rounds 1–4 (see `plans/ideas.md` Archive → Implemented, and
`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`) synced **file-level presence** —
which agents, skills, and hooks exist in IKP-Labs vs OSE. Round 5 is different: it is a
**content-level** diff. For every shared agent/skill file that already exists in both
repos, this round compares the actual body content to find upstream improvements that
file-existence diffing missed entirely. A file can pass every prior round's "does this
exist?" check while still carrying stale or thinner guidance than OSE's current version.

This plan captures the evaluation (Step 2), adaptation notes (Step 3), and decision
recording (Step 4) for all 52 findings across 44 shared files, then schedules their
implementation (Step 5) as 39 PRs across 10 phases.

**A P0 bug found during this analysis** — `plan-maker.md` itself had stale content left
over from an old "Registration Form Template" project predecessor of this repo — was
already fixed and merged standalone in **PR #228**, immediately before this plan. It is
**not** a plan item here; it is done.

**Why maximum PR granularity**: matching Round 4's precedent and this repo's own stated
preference for maximal PR granularity ("easier to fix/revert in isolation, and keeps
GitHub activity visibly incremental"), every item in Phases 1–8 ships as its own PR. The
sole exception is Phase 9 (P3 / minor items): the user explicitly agreed these are too
small individually to warrant separate PRs, so its 8 adopted items are bundled into 3 PRs
instead of 8.

## Problem Statement

### Current Gaps

- No sync round to date has compared file **content**, only file **existence** — an agent
  or skill that exists in both repos may still be missing capabilities OSE has since added
  to its version of the same file
- `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` — the pattern underlying
  ~14 existing checker/fixer pairs — has no convergence safeguards (false-positive skip
  list, scoped re-validation, post-edit self-verification, escalation after repeated
  disagreement, fixer severity-tier mode), so every one of those ~14 pairs inherits the
  same re-litigation and silent-no-op risks
- TDD ordering and automated accessibility testing are documented as checklist items, not
  enforced workflow steps, across the UI/E2E/C# development agents and skills
- Four language-standards skills (Go, Rust, F#, C#) lack sections OSE has since added:
  linting/security discipline, unsafe-code policy, formatter enforcement, and RFC 7807
  error handling
- Documentation checkers validate structure and completeness but never verify that
  documented _claims_ are factually true, and README agents check structure but never
  content quality or engagement
- The plan lifecycle agents never invoke the already-shipped `grill-me` or
  `docs-validating-factual-accuracy` skills, and `plan-checker` does not gate on the
  already-shipped (Round 4) PR-Review Maker→Fixer cycle
- `ci-checker`/`ci-fixer` audit only `.github/workflows/` YAML, with no Nx-specific
  conformance checks (`project.json` targets, coverage thresholds, tag scheme)
- The PDF pipeline, repo-setup, and several standalone agents/skills are missing
  targeted safety, verification, or scope-broadening improvements OSE has since added

## Scope

### In-Scope — 39 PRs across 10 phases, 52 findings across 44 files

| Phase | PRs       | Cluster                                       | Files                  | Decision         |
| ----- | --------- | --------------------------------------------- | ---------------------- | ---------------- |
| 1     | PR1       | Maker-Checker-Fixer convergence safeguards    | 1                      | ADOPT            |
| 2     | PR2–PR6   | Cluster A — TDD & accessibility testing       | 5                      | ADOPT            |
| 3     | PR7–PR10  | Cluster B — Language hardening                | 4                      | ADOPT            |
| 4     | PR11–PR19 | Cluster C — Docs quality & fact-checking      | 9                      | ADOPT            |
| 5     | PR20–PR25 | Cluster D — Plan lifecycle                    | 6                      | ADOPT            |
| 6     | PR26–PR27 | Cluster E — CI / Nx validation                | 2                      | ADOPT            |
| 7     | PR28–PR30 | Cluster F — PDF pipeline                      | 3                      | ADOPT            |
| 8     | PR31–PR35 | Cluster G — Repo & process governance         | 5                      | ADOPT            |
| 9     | PR36–PR38 | P3 — Minor items (bundled, 8 adopt + 1 defer) | 8 + 1                  | 8×ADOPT, 1×DEFER |
| 10    | PR39      | Sync record finalization (housekeeping)       | 2 (SKILL.md, ideas.md) | N/A              |

Phase 1 ships first because it is the single highest-leverage item: fixing
`repo-applying-maker-checker-fixer/SKILL.md` benefits all ~14 existing checker/fixer pairs
that already reference this skill, with zero changes to those 14 agent files themselves.
Phase 10 must run last, since it records final counts and the Round 5 sync-record entry
only after Phases 1–9 are merged — mirroring Round 4's Phase 5 / PR9 pattern (see
`plans/done/2026-07-10__claude-governance-gap-round-4/checklist.md` Phase 5).

Within Cluster D (Phase 5), `plan-writing-gherkin-criteria` (PR25) is sequenced after
`plan-creating-project-plans` (PR24) — its "Phase Gate Acceptance Checks" addition is only
meaningful once that skill's phase-gate concept lands. Within Cluster E (Phase 6),
`ci-checker` (PR26) ships before `ci-fixer` (PR27) — the fixer needs the checker's new
finding categories to exist before it can build matching fix recipes.

### Out-of-Scope

- The already-fixed `plan-maker.md` stale-content bug (PR #228) — done, not a plan item
- Everything in the existing "What IKP-Labs Intentionally Does NOT Adopt" table in
  `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — not re-evaluated by this round
- Creating brand-new agents or skills — every item in this round edits a file that
  **already exists** in both IKP-Labs and OSE; this round performs no Round-4-style
  file-presence adoption
- Application feature work (KameraVue or Taskly frontend/backend code)
- Fixing `docs-applying-diataxis-framework`'s templates, which the Phase 4 (Cluster C)
  `docs-applying-content-quality` PR will surface as self-contradicting a new "No Time
  Estimates" rule — noted for a follow-up, not fixed in this plan (see requirements.md
  Cluster C decision record)
- A product decision on whether IKP-Labs wants OSE's `repo-defining-workflows` capability
  (defining a checker→fixer→checker chain as a reusable orchestration document) — recorded
  as DEFER in this plan, not resolved
- Modifying `plans/README.md` — same exclusion Round 4 applied to its own Phase 5

## Dependencies

- `gh api repos/wahidyankf/ose-public/contents/<path>` (authenticated) for fetching exact
  OSE source content per item, same fetch pattern used in prior rounds
- Branch protection on `main` remains active — every PR in this plan goes through the
  standard branch → PR → CI → squash-merge cycle, never a direct push

## Success Criteria

- All 44 files (52 findings) have a recorded decision (ADOPT ×43 files / DEFER ×1 file) in
  requirements.md's Per-Item Decision Record, per `repo-syncing-with-ose-primer` Step 4
- Phase 1's `repo-applying-maker-checker-fixer/SKILL.md` fix is verified to actually flow
  through to the checker/fixer agents that inherit it — checklist Phase 1 requires spot-
  checking at least 2 of the ~14 inheriting agents (e.g., `plan-checker`, `swe-ui-checker`)
  to confirm they reference the skill rather than duplicate its logic inline, so the fix
  benefits them automatically without editing their files
- All 39 PRs pass `npm run lint:md` and CI before merge
- A final housekeeping phase (Phase 10) updates `plans/ideas.md` with a Round 5 archive
  entry and updates `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s "Last synced"
  tracking, once Phases 1–9 are fully merged — mirroring Round 4's Phase 5 / PR9 pattern

## Documents

- [requirements.md](./requirements.md) — Per-item OSE source / decision / reason /
  adaptation notes for all 44 files, functional requirements per phase/cluster
- [technical-design.md](./technical-design.md) — Adaptation convention table, per-PR fetch
  commands and target files, architecture of what's touched
- [checklist.md](./checklist.md) — 10 top-level phases, one atomic task-group per file in
  Phases 2–8, Phase 9's bundling explicitly called out

## References

- [`repo-syncing-with-ose-primer` SKILL.md](../../../.claude/skills/repo-syncing-with-ose-primer/SKILL.md) — the sync workflow this plan follows
- [`plans/done/2026-07-10__claude-governance-gap-round-4/`](../../done/2026-07-10__claude-governance-gap-round-4/) — precedent plan (format, tone, one-PR-per-item convention, Phase 5/PR9 housekeeping pattern)
- [`plans/ideas.md`](../../ideas.md) — running summary of all governance rounds
