# Fix Stale Plan Path References

## Status

🏗️ **IN PROGRESS** — Created 2026-10-29

## Overview

Two living, non-plan files in the repository contain path references into
`plans/in-progress/` that point at plans which have since been archived to
`plans/done/`. Both references are stale because the archival `git mv` for
each source plan never triggered a follow-up pass to update files _outside_
the archived plan's own folder that had linked into its old
`plans/in-progress/<slug>/` path.

**File 1** — `docs/reference/claude-agents.md` has 5 occurrences (lines 62,
86, 94, 129, 137 as of 2026-10-29) of
`plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`.
That plan completed and archived on 2026-10-15; the real file now lives at
`plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`. All 5
occurrences sit inside "Known frontmatter/filename mismatch" explanatory
notes (one top-of-file summary note, plus one ⚠ callout each for
`docs-maker.md`, `docs-checker.md`, `specs-maker.md`, and `test-checker.md`)
that point a reader to that plan's Non-Scope #1 for why the agent
frontmatter `name:` mismatch isn't fixed in this catalog doc.

**File 2** — `governance/workflows/pr/pr-review-quality-gate.md` has 1
occurrence (line 281) of
`plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows/`,
cited as a worked-example link ("...have run this exact cycle live (see
...'s own PR1 for a worked execution)"). That plan completed and archived
on 2026-10-28 (per its own checklist); the real folder now lives at
`plans/done/2026-10-16__repo-defining-multi-agent-workflows/`.

A repo-wide grep against all `plans/done/` directory names (confirmed:
`plans/in-progress/` is currently empty — there is no other active plan to
collide with) found no other stale `plans/in-progress/<archived-slug>`
references anywhere else in the project. Everything else that matches
`plans/in-progress/` text is either a generic placeholder example
(`YYYY-MM-DD__feature-name`, `nama-fitur`), a living plan's own historical
record of its own prior path (inside `plans/done/<same-plan>/`'s own
documents — expected, not a bug), or a gitignored/untracked
`generated-reports/*.md` snapshot (excluded from scope; those are
point-in-time artifacts, not living references).

This is a pure path-staleness bug. No content, scope, or meaning changes —
only the path prefix `plans/in-progress/` becomes `plans/done/` at each of
the 6 occurrences across the 2 files.

## Scope at a Glance

**In scope**: all 6 stale occurrences — 5 in
`docs/reference/claude-agents.md`, 1 in
`governance/workflows/pr/pr-review-quality-gate.md` — corrected to point at
the real `plans/done/` path.

**Out of scope**: the underlying agent frontmatter `name:` mismatch that
`claude-agents.md`'s notes describe (still correctly tracked as a separate,
unfixed issue — only the _pointer_ to its tracking doc is being corrected,
not the issue itself); any prevention/tooling work (e.g., a link-checker
rule or CI grep step) to catch this class of staleness in the future; any
other content in either file unrelated to these 6 lines.

Full detail in [`requirements.md`](./requirements.md).

## Documents

- [`requirements.md`](./requirements.md) — Scope, non-scope, user stories, success criteria
- [`technical-design.md`](./technical-design.md) — Exact before/after text for all 6 occurrences, verification method
- [`checklist.md`](./checklist.md) — Atomic tasks across 2 PRs

## PR Plan (2 PRs)

| PR    | Content                                                                       |
| ----- | ----------------------------------------------------------------------------- |
| Setup | Plan setup commit (this plan) — not counted in the 2-PR total below           |
| 1     | Fix 5 stale occurrences in `docs/reference/claude-agents.md`                  |
| 2     | Fix 1 stale occurrence in `governance/workflows/pr/pr-review-quality-gate.md` |

Two implementation PRs, split by file per explicit decision (see
`requirements.md` for the resolved-decision record): PR 1 touches only
`docs/reference/claude-agents.md`; PR 2 touches only
`governance/workflows/pr/pr-review-quality-gate.md`. No prevention/tooling
PR — this plan is a pure fix with no process additions.

## Knowledge Capture

Deferred until all checklist tasks are complete and the plan is archived —
see `checklist.md`'s final phase.
