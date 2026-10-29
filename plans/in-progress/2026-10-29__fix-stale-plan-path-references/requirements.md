# Fix Stale Plan Path References - Requirements

## Resolved Decisions (Grill-Me Outcomes)

These three decisions were grilled and explicitly resolved before writing
this plan. Recorded here so the plan is self-explanatory without needing
the original conversation.

1. **Scope boundary** — Resolved: **expand scope to all 6 occurrences**
   across both files (`docs/reference/claude-agents.md` and
   `governance/workflows/pr/pr-review-quality-gate.md`), not just the 5
   originally reported in `claude-agents.md`. Rationale: same bug class,
   trivially small additional diff (1 line in 1 more file), discovered via
   the explicitly requested repo-wide investigation.
2. **PR granularity** — Resolved: **2 PRs, split by file** — PR 1 for
   `claude-agents.md`'s 5 occurrences, PR 2 for
   `pr-review-quality-gate.md`'s 1 occurrence. This is a deliberate
   override of the stricter-vs-looser default recommendation (a single
   combined PR) in favor of one-logical-change-per-PR separation, since the
   two files belong to different documentation domains (agent catalog vs.
   PR-workflow governance).
3. **Prevention/follow-up** — Resolved: **pure fix only, no process
   additions**. The plan contains no lint rule, CI check, or `docs-link-checker`
   enhancement proposal for this class of staleness, and no explanatory
   note recommending one. Scope is exactly the 6 path corrections.

## Scope Definition

### In Scope

- Correct all 5 occurrences of the stale path
  `plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
  in `docs/reference/claude-agents.md` (current lines 62, 86, 94, 129, 137)
  to
  `plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`.
- Correct the 1 occurrence of the stale path
  `plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows/`
  in `governance/workflows/pr/pr-review-quality-gate.md` (current line 281)
  to `plans/done/2026-10-16__repo-defining-multi-agent-workflows/`.
- Verify, after editing, that both files resolve to real files/directories
  on disk at their new paths and that no stale occurrence of either pattern
  remains in either file.
- Re-run the repo-wide stale-reference grep (used during this plan's
  investigation) after the edits to confirm no new stale reference was
  introduced and no previously-found stale reference was missed.

### Non-Scope

- **The agent frontmatter `name:` mismatch itself** — `claude-agents.md`'s
  ⚠ notes describe 4 agents (`docs-maker.md`, `docs-checker.md`,
  `specs-maker.md`, `test-checker.md`) whose frontmatter `name:` field still
  carries a pre-rename name. This plan corrects only the _pointer_ to the
  tracking plan's archived location — it does not touch
  `.claude/agents/*.md` frontmatter. That remains tracked exactly as
  described in `plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
  Non-Scope #1, unchanged by this plan.
- **Prevention or tooling work** — no CI check, grep-based lint rule, or
  `docs-link-checker` enhancement to catch this class of staleness
  automatically in the future. Explicitly decided out of scope (see
  Resolved Decisions #3 above).
- **`generated-reports/*.md` files** — `generated-reports/docs-audit-2026-10-15-1935.md`
  and `generated-reports/docs-audit-2026-10-09-1818.md` both contain the
  same stale `2026-10-08__fix-claude-agents-catalog-doc` pattern, but these
  files are gitignored (`generated-reports/*.md` per `.gitignore` line 144)
  and untracked — they are point-in-time audit snapshots describing a
  past repo state, not living references that need to stay current. Not
  touched by this plan.
- **Any other content in either target file** unrelated to the 6 identified
  stale-path lines — no rewriting, no rewording, no re-formatting of
  surrounding prose, tables, or unrelated sections.
- **Any other archived plan's path references** — the repo-wide grep
  performed during investigation (matching every directory name currently
  under `plans/done/` against `plans/in-progress/<that-name>` elsewhere in
  the repo) found no additional stale references beyond the 6 in scope.
  Should a future audit find more, that is a new plan, not an amendment to
  this one.
- **The plans' own self-referencing historical text** — files under
  `plans/done/2026-10-08__fix-claude-agents-catalog-doc/**` and
  `plans/done/2026-10-16__repo-defining-multi-agent-workflows/**` contain
  their own historical mentions of their former `plans/in-progress/<self>/`
  path (e.g., `plans/done/2026-10-08__fix-claude-agents-catalog-doc/checklist.md:14`,
  `plans/done/2026-10-16__repo-defining-multi-agent-workflows/checklist.md:370`).
  These are expected archival records of a plan describing its own move at
  the time it happened and are explicitly not bugs — not touched by this
  plan.

## User Stories

### User Story 1: Reader follows the agent-catalog cross-reference

As a developer reading `docs/reference/claude-agents.md`'s ⚠ notes about
agent frontmatter mismatches
I want the `requirements.md` path cited for the full explanation to actually
resolve to a real file
So that I can read the non-scope rationale without hitting a dead path

**Acceptance Criteria:**

```gherkin
Scenario: Developer opens the cited requirements.md path from claude-agents.md
  Given docs/reference/claude-agents.md's ⚠ note cites a plan requirements.md path
  When the developer runs `test -f` against that exact cited path
  Then the file exists at that path
```

```gherkin
Scenario: No stale in-progress path remains in claude-agents.md
  Given docs/reference/claude-agents.md has been corrected
  When the developer greps the file for "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc"
  Then zero matches are found
```

### User Story 2: Reader follows the PR-review-gate worked-example link

As a developer reading `governance/workflows/pr/pr-review-quality-gate.md`'s
worked-example note about the maker/fixer cycle
I want the cited plan folder path to resolve to where that plan actually
lives
So that I can open the referenced PR1 execution record without hitting a
dead path

**Acceptance Criteria:**

```gherkin
Scenario: Developer opens the cited plan folder path from pr-review-quality-gate.md
  Given pr-review-quality-gate.md's worked-example note cites a plan folder path
  When the developer runs `test -d` against that exact cited path
  Then the directory exists at that path
```

```gherkin
Scenario: No stale in-progress path remains in pr-review-quality-gate.md
  Given governance/workflows/pr/pr-review-quality-gate.md has been corrected
  When the developer greps the file for "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows"
  Then zero matches are found
```

### User Story 3: No regression across the rest of the repo

As a maintainer who just fixed these 6 occurrences
I want confirmation that no other living file in the repo still references
either archived plan's old `plans/in-progress/` path
So that this fix doesn't leave a partial/missed occurrence behind

**Acceptance Criteria:**

```gherkin
Scenario: Repo-wide grep finds zero remaining stale occurrences for both archived plans
  Given both target files have been corrected and committed
  When the maintainer greps the full repo (excluding plans/done/** and generated-reports/**) for "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" and "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows"
  Then zero matches are found outside plans/done/** and generated-reports/**
```

## Success Criteria

- [ ] All 5 occurrences in `docs/reference/claude-agents.md` read
      `plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`.
- [ ] The 1 occurrence in `governance/workflows/pr/pr-review-quality-gate.md`
      reads `plans/done/2026-10-16__repo-defining-multi-agent-workflows/`.
- [ ] `test -f plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
      succeeds.
- [ ] `test -d plans/done/2026-10-16__repo-defining-multi-agent-workflows`
      succeeds.
- [ ] Repo-wide grep (excluding `plans/done/**` and `generated-reports/**`)
      for both old `plans/in-progress/<slug>` patterns returns zero matches.
- [ ] Both fixes are committed and merged via PR per this repo's branch
      protection on `main`.
