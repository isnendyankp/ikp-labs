# Fix Claude Agents Catalog Doc

## Status

🚧 **IN PROGRESS** — Created 2026-10-08

## Summary

`docs/reference/claude-agents.md` documents a fictional **6-agent** model
(`plan-writer`, `docs-writer`, `spec-writer` as "Maker" agents; 3 unnamed
"Validator" agents) that has never matched the real agent roster. The real
repository has **53 real agents** in `.claude/agents/*.md`.

Investigation (not guesswork) traced the root cause: `plans/done/2026-05-19__claude-agents-triad/`
renamed 5 agents to a consistent `{domain}-maker` / `{domain}-checker` /
`{domain}-fixer` pattern (`plan-writer` → `plan-maker`, `documentation-writer` →
`docs-maker`, `docs-validator` → `docs-checker`, `gherkin-spec-writer` →
`specs-maker`, `test-validator` → `test-checker`) but never propagated the
rename to the documentation/governance layer. Grepping the repo for the five
old names turned up **7 living files** carrying the same staleness, not 1:

- `docs/reference/claude-agents.md` (the originally reported file)
- `docs/how-to/use-claude-validators.md`
- `docs/how-to/create-implementation-plans.md`
- `AGENTS.md` (repo root — itself cited as the "already documents 3 families"
  precedent, but its own tables are stale)
- `README.md` (repo root — "Claude Validators" section references
  `@test-validator` / `@docs-validator`, agent names that no longer resolve)
- `generated-reports/README.md`
- `docs/reference/README.md`

This plan corrects all 7 files, rewrites `docs/reference/claude-agents.md`
into a complete, family-grouped catalog of the real 53 agents, and does so
using the maker-checker pattern this repo already uses for every other
documentation change: **`docs-maker`** (not `documentation-writer` —
that name is itself one of the stale names this plan fixes) creates/edits,
**`docs-checker`** (not `docs-validator`) validates.

A second, narrower bug was found during investigation and is explicitly
**out of scope** for this plan (see `requirements.md` Non-Scope): 4 of the
renamed agent files (`docs-checker.md`, `docs-maker.md`, `specs-maker.md`,
`test-checker.md`) still carry their _old_ name inside the frontmatter
`name:` field, even though the filename was renamed. That is an agent-file
correctness bug (`.claude/agents/`, `agent-maker`'s domain), not a
documentation bug, and is flagged for a separate follow-up — but this plan's
new catalog must document the discrepancy accurately rather than silently
assume the frontmatter already matches the filename.

## Scope at a Glance

**In scope**: rewrite/correct the 7 living files above. Zero interaction with
`wahidyankf/ose-public` — that repo is read-only reference material consulted
via `repo-syncing-with-ose-primer`; nothing here writes back to it.

**Out of scope**: the 4-agent frontmatter `name:` mismatch (flagged, not
fixed here), expanding `AGENTS.md`'s family table beyond correcting existing
names, renaming/retiring `use-claude-validators.md`'s file path, and any
historical/point-in-time record (`docs/reference/implementation-summary.md`,
`VERIFICATION_SUMMARY.md`, `plans/done/**`, `docs/linkedin/History/**`,
`plans/ideas.md`'s archived entries).

Full detail in `requirements.md`.

## Documents

- [`requirements.md`](./requirements.md) — Scope, non-scope, user stories, success criteria
- [`technical-design.md`](./technical-design.md) — Real 53-agent family roster, per-file change spec, PR architecture
- [`checklist.md`](./checklist.md) — Atomic tasks across 5 PRs

## PR Plan (5 PRs)

| PR  | Content                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Plan setup commit (this plan)                                                                                  |
| 2   | `docs/reference/claude-agents.md` full rewrite — `docs-maker` → `docs-checker` cycle                           |
| 3   | `docs/how-to/use-claude-validators.md` rewrite + `docs/how-to/create-implementation-plans.md` agent-name fixes |
| 4   | `AGENTS.md` + `README.md` + `generated-reports/README.md` + `docs/reference/README.md` stale-reference fixes   |
| 5   | Final validation (`docs-checker`, `docs-link-checker`) + move plan to `plans/done/`                            |
