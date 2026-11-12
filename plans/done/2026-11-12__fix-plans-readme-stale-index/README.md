# Fix Plans README Stale Index

## Status

✅ **COMPLETED** — Created 2026-11-12, Completed 2026-11-13

## Overview

`plans/README.md`'s "🗂️ Current Plans" index has two confirmed stale
sections, both caused by the same root issue: a prior archival `git mv`
moved a plan folder to `plans/done/` but never triggered a follow-up pass
to update `plans/README.md`'s own tree listings or Quick Stats counters.

**Bug 1 — stale "In Progress" section.** `plans/README.md` shows
`in-progress/` containing `2026-02-11__frontend-unit-tests/`, but that
directory does not exist on disk — `plans/in-progress/` has no subfolders
at all. The plan itself lives at
`plans/done/2026-02-11__frontend-unit-tests/`, whose own `README.md`
already correctly says `✅ COMPLETED`. Git history shows the move happened
via `956a5c5` (backlog → in-progress) and `fd97816` (in-progress → done),
neither of which touched `plans/README.md`'s index.

**Bug 2 — stale "Backlog" section.** `plans/README.md` shows `backlog/`
containing `2026-01-12__cicd-pipeline/`, but `plans/backlog/` has no
subfolders either — only its own `README.md`. That plan also lives at
`plans/done/2026-01-12__cicd-pipeline/`, moved by the same `fd97816` commit.

**Investigation also surfaced three adjacent, smaller staleness bugs in
directly related files**, folded into this plan because each is the
identical bug class (a fact asserted in a second place that never got
updated) and each is cheap to fix in the same pass:

- `plans/README.md`'s own "Quick Stats" section mirrors both bugs —
  `**In Progress**: 1` and `**Backlog**: 1`, each with a now-false bullet.
- `plans/backlog/README.md` independently lists CI/CD Pipeline as a
  "Planned Project" and tracks two "Completed/Moved Plans" entries, one of
  which (Frontend Unit Tests) is doubly stale — it points at
  `in-progress/`, but that plan has since moved a second time, to `done/`.
- `plans/done/2026-01-12__cicd-pipeline/README.md`'s own `**Status**` line
  still says `📋 Backlog` (and its footer still says `Status: Ready to
Start`), even though the plan's own `checklist.md` closing summary
  confirms it reached `FULL CI PIPELINE COMPLETE ✅` on 2026-02-23, with
  Phase 6 (Deployment) and Phase 9 (Final Verification) explicitly marked
  **skipped** (not abandoned) — cross-referenced against real repo state:
  `CONTRIBUTING.md`, `docs/reference/branch-protection-status-checks.md`,
  `docs/how-to/cicd-setup.md`, and a live CI badge in the root `README.md`
  all exist, confirming genuine completion rather than a mis-filed plan.

**Resolution approach (agreed via `grill-me`)**: rather than inventing
"(empty)" placeholder prose for the now-childless `in-progress/` and
`backlog/` directories, this plan recreates `plans/in-progress/` with a
real placeholder `README.md` (mirroring the pattern `plans/backlog/
README.md` already establishes — a tracked file that keeps the directory
alive in git even with zero plan subfolders). Both tree listings in
`plans/README.md` then show their literal, true contents
(`└── README.md`) instead of an invented empty-state sentence.

**Self-reference note**: this plan's own setup commit adds
`plans/in-progress/2026-11-12__fix-plans-readme-stale-index/` to disk. While
this plan is open, `plans/in-progress/` truly contains two things (the new
placeholder `README.md` _and_ this plan's own folder) — so the "In
Progress" tree/Quick Stats fix has two correct states, not one: an
**interim state** (during this plan's own PR, showing both entries,
because that is what is actually on disk at that moment) and a **final
state** (after this plan archives to `plans/done/`, showing `README.md`
only). `checklist.md` Phase 1 writes the interim state; Phase 2 (this
plan's own archival) writes the final state. This is the expected,
self-resolving irony the task brief flagged up front — not a bug.

## Scope at a Glance

**In scope**: create `plans/in-progress/README.md`; fix `plans/README.md`'s
"In Progress" and "Backlog" tree listings and Quick Stats counts; fix
`plans/backlog/README.md`'s stale "Planned Projects" entry and delete its
duplicate-tracking "Completed/Moved Plans" section; fix
`plans/done/2026-01-12__cicd-pipeline/README.md`'s two stale status lines;
strengthen `plans/README.md`'s own "Step 3: Move to In Progress" / "Step 4:
Move to Done" instructions so the next archival pass doesn't repeat this
bug.

**Out of scope**: the "Done (Archived)" tree's missing dozens of entries
and the `**Completed Projects**: 24` undercount — both already identified
and explicitly deferred in `plans/done/2026-10-28__tooling-nx/README.md`
and `plans/done/2026-10-08__fix-claude-agents-catalog-doc/README.md`. This
plan does not touch either.

Full detail in [`requirements.md`](./requirements.md).

## Documents

- [`requirements.md`](./requirements.md) — Scope, non-scope, resolved
  grill-me decisions, user stories, success criteria
- [`technical-design.md`](./technical-design.md) — Exact before/after text
  for every file touched, new file content, verification method
- [`checklist.md`](./checklist.md) — Atomic tasks for the single PR

## PR Plan (1 PR)

| PR    | Content                                                                                                                                      |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup | Plan setup commit (this plan) — not counted in the 1-PR total below                                                                          |
| 1     | All fixes: new `plans/in-progress/README.md`, `plans/README.md`, `plans/backlog/README.md`, `plans/done/2026-01-12__cicd-pipeline/README.md` |

One PR, per Resolved Decision 7 in `requirements.md`: everything in scope
is one coherent concern — making the plan-lifecycle index match reality —
on small, low-risk, mostly-documentation files with no independent risk
boundary.

## Knowledge Capture

No generalizable learnings beyond what was already routed to its permanent
home. The one durable artifact this plan produced — the explicit "after
the `git mv`, also..." checklist added to `plans/README.md`'s own "Step 3"
and "Step 4" instructions — was written directly into that file during
Task 1.3, which is already its correct, permanent location. There is no
separate pattern, convention, or gotcha to additionally write up elsewhere.
