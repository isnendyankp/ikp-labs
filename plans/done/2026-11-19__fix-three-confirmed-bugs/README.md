# Fix Three Confirmed Small Bugs

## Status

✅ **COMPLETED** — Created 2026-11-19, Completed 2026-11-19

## Overview

A health-sweep conversation independently confirmed 3 small, unrelated bugs in
this repo. Each was verified directly against current repo state (not assumed
from an old report):

**Bug 1 — Broken CI badge link in root `README.md`.** Line 3 of `README.md`
points both its badge image and its click-through link at
`.github/workflows/ci.yml`, which does not exist. The real workflow file is
`.github/workflows/kameravue-ci.yml` (confirmed via `ls .github/workflows/`,
which also contains `kameravue-scheduled-e2e.yml`). `README.md` is the only
live file in the repo referencing the broken `workflows/ci.yml` path — every
other hit is historical `plans/done/**` content, `docs/**` prose narrating
the _old_ pre-rename workflow name, or the gitignored
`generated-reports/link-audit-2026-10-15-1943.md` (which still exists on
disk and independently flagged this exact path as its #1 CRITICAL finding).

**Bug 2 — 4 agent frontmatter `name:` fields still carry their pre-rename
value**, confirmed via direct `grep -n "^name:"` on each file:

| File                             | Current `name:`        | Should be      |
| -------------------------------- | ---------------------- | -------------- |
| `.claude/agents/docs-maker.md`   | `documentation-writer` | `docs-maker`   |
| `.claude/agents/docs-checker.md` | `docs-validator`       | `docs-checker` |
| `.claude/agents/specs-maker.md`  | `gherkin-spec-writer`  | `specs-maker`  |
| `.claude/agents/test-checker.md` | `test-validator`       | `test-checker` |

This is a functional bug, not cosmetic: the Agent tool resolves agents by
frontmatter `name:`, not filename. Today, invoking the catalog-documented
name (e.g. `docs-maker`) fails to resolve, while the stale pre-rename name
(e.g. `documentation-writer`) still works. Fixing the frontmatter flips
this — the documented name starts working, the stale name stops.

The old-name fan-out was checked with `grep -rln`. It appears only in: (a)
historical `plans/done/**` plan content, which must stay untouched because
it accurately describes what was true when those plans ran; (b)
`VERIFICATION_SUMMARY.md` and `docs/reference/implementation-summary.md`,
both confirmed (by reading their headers) to be dated, point-in-time
completion reports for `plans/done/2025-01-05__claude-agents-infrastructure`
— historical records, not live reference docs, so also untouched; and (c)
`docs/reference/claude-agents.md`, which **is** a live reference doc and
**is** in scope — see below.

**Mandatory accompanying fix**: `docs/reference/claude-agents.md` currently
documents this exact bug as a "Known frontmatter/filename mismatch" — an
explanatory paragraph (lines 49-63), a `⚠` marker on each of the 4 affected
agents' table rows (lines 74, 75, 117, 121), and an inline explanatory note
under each family table (lines 81-95 for the Documentation family, 124-138
for the Testing & Specs family). Once the frontmatter is fixed, all of this
becomes false and must be removed in the same PR — otherwise this plan
would introduce fresh staleness into a doc describing a bug that no longer
exists, the exact bug class `plans/done/2026-11-12__fix-plans-readme-stale-index/`
fixed.

**Bug 3 — Empty `model:` field in `.claude/agents/pr-review-maker.md`.**
Line 5 is `model:` with no value. Its maker-fixer sibling
`.claude/agents/pr-review-fixer.md` uses `model: sonnet`. Checked against
other reasoning-heavy agents in `.claude/agents/` — `plan-maker.md`,
`ci-checker.md`, `docs-checker.md` — all confirmed `model: sonnet`,
establishing it as the norm for this agent class. `pr-review-maker.md`'s own
frontmatter describes it as a "Planning-grade PR reviewer" doing full-diff
reading and evidence-cited findings — complex reasoning work, not a
mechanical task — so `sonnet` is the correct value, not a guess.

## Scope at a Glance

**In scope**: fix both `workflows/ci.yml` references in `README.md`; fix
the `name:` field in 4 agent files; remove the now-false mismatch paragraph,
4 `⚠` markers, and 4 inline notes from `docs/reference/claude-agents.md`;
set `model: sonnet` in `pr-review-maker.md`.

**Out of scope**: the agent files' description/example prose that still
narrates the old agent name in free text (e.g. "I'll use the
documentation-writer agent to..." inside `docs-maker.md`'s `description:`
field) — only the structural `name:` field is a confirmed functional bug;
rewriting description prose is a separate, more invasive content edit not
raised in the original bug report. Also out of scope: any other
`model:`/frontmatter field in any other agent file, the historical
`plans/done/**`, `VERIFICATION_SUMMARY.md`, and
`docs/reference/implementation-summary.md` old-name references (all
accurate history), and anything in the gitignored
`generated-reports/link-audit-2026-10-15-1943.md` beyond citing it as
corroborating evidence.

Full detail in [`requirements.md`](./requirements.md).

## Documents

- [`requirements.md`](./requirements.md) — Scope, non-scope, resolved
  grill-me decisions, user stories, success criteria
- [`technical-design.md`](./technical-design.md) — Exact before/after text
  for every file touched, verification method
- [`checklist.md`](./checklist.md) — Atomic tasks for the single PR

## PR Plan (1 PR)

| PR    | Content                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| Setup | Plan setup commit (this plan) — not counted in the 1-PR total below                                         |
| 1     | All 3 bugs: `README.md`, 4 agent frontmatter files, `docs/reference/claude-agents.md`, `pr-review-maker.md` |

One PR, per the resolved grill-me decision in `requirements.md`: all 3 bugs
are small, independently-confirmed, documentation/metadata-only fixes with
zero file overlap and zero shared root cause beyond being found together in
the same health-sweep — bundling-when-genuinely-low-risk beats
PR-count-maximization, matching the precedent set by
`plans/done/2026-11-12__fix-plans-readme-stale-index/`.

## Knowledge Capture

No generalizable learnings beyond existing precedent. This plan followed
the bundling and Phase 0/1/2 structure already established by
`plans/done/2026-11-12__fix-plans-readme-stale-index/` rather than
discovering a new pattern.

One implementation-time finding is worth noting for future similar plans,
though it doesn't rise to a new skill or governance change: when a doc
documents a "known bug" via more than one textual mechanism (here, Bug 2
used a dedicated paragraph + `⚠` markers + inline notes, while Bug 3's
same doc separately used a table cell value + footnote with no shared
keyword between the two), a single `grep` for an expected keyword (e.g.
"mismatch" or "⚠") will not surface every place the bug is documented.
Task 1.4 found the second mechanism only by reading the full file, not by
keyword search. This is already implicit in `docs-validating-factual-accuracy`
and standard code-review practice (read the whole file, don't just grep for
the obvious marker), so no new skill content is needed — recorded here only
as a concrete example for this plan's own record.
