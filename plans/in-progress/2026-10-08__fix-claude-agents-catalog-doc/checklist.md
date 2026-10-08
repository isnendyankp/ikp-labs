# Checklist: Fix Claude Agents Catalog Doc

## PR 1 — Plan Setup

- [x] Investigate actual blast radius (grep for 5 pre-rename agent names
      across the repo, excluding `plans/done/**`)
- [x] Confirm real 53-agent roster from `.claude/agents/*.md` frontmatter
      (name, model, color) via direct file reads, not assumption
- [x] Discover and document the 4-agent frontmatter `name:` mismatch bug
      (`docs-checker.md`, `docs-maker.md`, `specs-maker.md`,
      `test-checker.md`) as a flagged non-scope item
- [x] Run pre-write grill-me (6 questions, all resolved)
- [x] Write `README.md`, `requirements.md`, `technical-design.md`,
      `checklist.md` in `plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc/`
- [x] Run post-write grill-me validation against the 6 resolved decisions
- [x] `git add -f` not required (plan files are not under `.claude/`)
- [x] Commit plan files: `docs(plan): add plan for fixing claude-agents catalog doc`
- [x] Open PR 1, merge

## PR 2 — `docs/reference/claude-agents.md` Full Rewrite

- [ ] Invoke `docs-maker` to rewrite `docs/reference/claude-agents.md`
      following the structure in `technical-design.md` Per-File Change
      Specification #1
- [ ] Verify all 15 families and 53 agents are present, each sourced from
      the real frontmatter (cross-check against the Real Agent Roster table
      in `technical-design.md`)
- [ ] Verify the 4 flagged (⚠) agents (`docs-maker`, `docs-checker`,
      `specs-maker`, `test-checker`) each carry the frontmatter-mismatch note
- [ ] Verify the fictional ASCII "Agent Architecture" diagram, old "Quick
      Reference" table, and fabricated example metrics are fully removed
- [ ] Verify the new Maker-Checker-Fixer diagram follows
      `docs-creating-accessible-diagrams` (text labels, not color-only,
      accessible palette)
- [ ] Invoke `docs-checker` to audit the rewritten file
- [ ] If `docs-checker` reports CRITICAL/HIGH findings, invoke `docs-fixer`
      and re-run `docs-checker` until clean
- [ ] Run `docs-link-checker` against the file; fix any broken links
- [ ] Run `markdownlint` on the file; fix any violations
- [ ] Commit: `docs: rewrite claude-agents catalog with real 53-agent roster`
- [ ] Open PR 2, merge

## PR 3 — How-To Guides Bundle

- [ ] Invoke `docs-maker` to rewrite `docs/how-to/use-claude-validators.md`
      in place per `technical-design.md` Per-File Change Specification #2
- [ ] Verify "validator" → "checker" terminology change is complete and the
      3 agents documented are `test-checker`, `docs-checker`, `plan-checker`
- [ ] Invoke `docs-maker` to fix the 8 `plan-writer` → `plan-maker`
      occurrences in `docs/how-to/create-implementation-plans.md`
- [ ] Verify no other content in either file changed beyond the specified
      agent-name/terminology fixes
- [ ] Invoke `docs-checker` to audit both files
- [ ] If `docs-checker` reports CRITICAL/HIGH findings, invoke `docs-fixer`
      and re-run `docs-checker` until clean
- [ ] Run `docs-link-checker` against both files
- [ ] Run `markdownlint` on both files
- [ ] Commit: `docs: fix stale agent names in checker how-to guides`
- [ ] Open PR 3, merge

## PR 4 — Root/Index Files Bundle

- [ ] Fix `AGENTS.md`'s 3 family tables + Skills Catalog table + Generated
      Reports table per `technical-design.md` Per-File Change
      Specification #4 (5 name substitutions, no new rows added)
- [ ] Fix `README.md`'s "Claude Validators" section: correct `@test-checker`
      / `@docs-checker` handles, add pointer line to the full catalog
- [ ] Fix `generated-reports/README.md`'s 5 stale name occurrences
- [ ] Fix `docs/reference/README.md`'s "Claude Agents" blurb to describe
      the rewritten catalog's actual scope (53 agents, 15 families)
- [ ] Verify zero remaining matches for the 5 pre-rename names across all 4
      files: `grep -rE "plan-writer|documentation-writer|gherkin-spec-writer|docs-validator|test-validator" AGENTS.md README.md generated-reports/README.md docs/reference/README.md`
- [ ] Invoke `docs-checker` to audit all 4 files
- [ ] If `docs-checker` reports CRITICAL/HIGH findings, invoke `docs-fixer`
      and re-run `docs-checker` until clean
- [ ] Run `docs-link-checker` against all 4 files
- [ ] Run `markdownlint` on all 4 files
- [ ] Commit: `docs: fix stale agent names in AGENTS.md and root index files`
- [ ] Open PR 4, merge

## PR 5 — Final Validation & Close

- [ ] Run repo-wide grep for the 5 pre-rename names, confirm zero matches
      outside the documented historical exclusions (`plans/done/**`,
      `docs/reference/implementation-summary.md`, `VERIFICATION_SUMMARY.md`,
      `docs/linkedin/History/**`, `plans/ideas.md` archived entries)
- [ ] Run `docs-checker` against the full `docs/` tree, confirm zero new
      CRITICAL/HIGH findings attributable to this plan's changes
- [ ] Run `docs-link-checker` against the full repo, confirm zero broken
      links introduced by this plan
- [ ] Confirm no `.claude/agents/*.md` file was modified by any PR in this
      plan (`git log --name-only` across PRs 2-4 touches zero files under
      `.claude/agents/`)
- [ ] Verify all `requirements.md` Success Criteria are met
- [ ] Update `plans/README.md` index: move entry from "In Progress" to
      "Done (Archived)", update "Quick Stats" count
- [ ] `git mv plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc/`
      → `plans/done/2026-10-08__fix-claude-agents-catalog-doc/`
- [ ] Update this plan's `README.md` status to "✅ COMPLETED" with
      completion date
- [ ] Commit: `docs(plan): mark fix-claude-agents-catalog-doc plan complete`
- [ ] Open PR 5, merge

## Testing Requirements

- [ ] No automated test suite applies (documentation-only change, no
      `apps/`, `specs/`, or `.github/workflows/` files touched)
- [ ] Manual verification: every `@agent-name` handle mentioned in any of
      the 7 corrected files resolves to an existing `.claude/agents/*.md`
      filename
- [ ] Manual verification: `docs/reference/claude-agents.md`'s family-table
      agent count sums to 53, matching
      `ls .claude/agents/*.md | grep -v README.md | wc -l`

## Documentation Tasks

- [ ] `docs/reference/claude-agents.md` — full rewrite (PR 2)
- [ ] `docs/how-to/use-claude-validators.md` — rewrite in place (PR 3)
- [ ] `docs/how-to/create-implementation-plans.md` — targeted fix (PR 3)
- [ ] `AGENTS.md` — targeted fix (PR 4)
- [ ] `README.md` — targeted fix (PR 4)
- [ ] `generated-reports/README.md` — targeted fix (PR 4)
- [ ] `docs/reference/README.md` — targeted fix (PR 4)

## Validation Steps

- [ ] `grep -rE "plan-writer|documentation-writer|gherkin-spec-writer|docs-validator|test-validator" --include="*.md" .` returns zero matches outside the documented historical exclusions
- [ ] `docs-checker` reports zero CRITICAL/HIGH findings on all 7 changed files
- [ ] `docs-link-checker` reports zero broken links
- [ ] `markdownlint` passes on all 7 changed files
- [ ] `git diff --stat` across PRs 2-4 shows zero changes under `.claude/agents/`

## Quality Gates

- [ ] No `TODO`/`TBD`/placeholder content in any rewritten section
- [ ] No fabricated metrics or example numbers (the old catalog's "Last
      Month: 65% coverage" style content is not carried over)
- [ ] Every agent name, model, and color in the new catalog is sourced from
      a real `.claude/agents/*.md` frontmatter read, not inferred
- [ ] The 4-agent frontmatter mismatch is documented, not silently fixed or
      silently ignored
- [ ] Zero interaction with `wahidyankf/ose-public` anywhere in the diff
