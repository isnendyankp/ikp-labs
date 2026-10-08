# Requirements: Fix Claude Agents Catalog Doc

## Problem Statement

`docs/reference/claude-agents.md` (984 lines) documents a fictional 6-agent
model: 3 "Maker" agents (`plan-writer`, `documentation-writer`,
`gherkin-spec-writer`) and 3 unnamed "Validator" agents (`test-validator`,
`docs-validator`, `plan-checker`), with an ASCII "Agent Architecture" diagram
and a "Quick Reference" table built around those names. None of the 5
maker/validator names match a real file in `.claude/agents/` — they were
renamed by `plans/done/2026-05-19__claude-agents-triad/` to `plan-maker`,
`docs-maker`, `docs-checker`, `specs-maker`, `test-checker` respectively
(`plan-checker` was already correctly named and untouched by that rename).
The real repository has 53 agent files, not 6.

Grepping the repo for the 5 pre-rename names (excluding `plans/done/`, which
is historical and correctly left alone) found the same staleness in 6 more
living files beyond the original target, because the 2026-05-19 rename only
touched `.claude/agents/*.md` and never propagated to docs or governance.

## Scope

### In Scope

1. **`docs/reference/claude-agents.md`** — full rewrite. Replace the
   fictional 6-agent model with a complete, accurate catalog of the real 53
   agents in `.claude/agents/*.md`, grouped by family (see
   `technical-design.md` for the full family breakdown). Remove the ASCII
   "Agent Architecture" diagram and "Quick Reference" table built around the
   fictional names; replace with accurate content. Every agent's name,
   purpose, model, color, and skills must be read directly from its real
   frontmatter and body — no name, capability, or skill list may be invented
   or carried over from the old fictional entries.

2. **`docs/how-to/use-claude-validators.md`** — rewrite in place at the same
   path. Update terminology from "validator" to "checker" and correct the 3
   agents it covers to their real current names: `test-checker`,
   `docs-checker`, `plan-checker`. Scope stays narrow — a checker-usage
   workflow guide, not a second copy of the full 53-agent catalog.

3. **`docs/how-to/create-implementation-plans.md`** — fix the 8 occurrences
   of `@plan-writer` / `plan-writer` to `@plan-maker` / `plan-maker`. No
   other content changes.

4. **`AGENTS.md`** (repo root) — correct the agent names inside its existing
   3 family tables (Documentation, Planning, Testing & Specs) and the Skills
   Catalog / Generated Reports tables that reference them:
   - `documentation-writer` → `docs-maker`
   - `docs-validator` → `docs-checker`
   - `plan-writer` → `plan-maker`
   - `gherkin-spec-writer` → `specs-maker`
   - `test-validator` → `test-checker`
     Do not add new family rows (see Non-Scope #3).

5. **`README.md`** (repo root) — in the "Claude Validators" section: fix the
   broken agent handles `@test-validator` → `@test-checker`,
   `@docs-validator` → `@docs-checker` (table and usage-example rows); add
   one short pointer line to the full catalog at
   `docs/reference/claude-agents.md`.

6. **`generated-reports/README.md`** — fix the 5 occurrences of
   `test-validator` / `docs-validator` to `test-checker` / `docs-checker`.

7. **`docs/reference/README.md`** — fix the one-line blurb describing
   `claude-agents.md`'s contents (currently names `plan-writer`,
   `documentation-writer`, `gherkin-spec-writer` as its maker agents) to
   describe the corrected catalog accurately (53 agents across families, not
   a maker/validator list).

### Non-Scope

1. **The 4-agent frontmatter `name:` mismatch is not fixed here.**
   Investigation found that `docs-checker.md`, `docs-maker.md`,
   `specs-maker.md`, and `test-checker.md` still carry their _pre-rename_
   name inside the frontmatter `name:` field (e.g. `docs-checker.md`'s
   frontmatter reads `name: docs-validator`), even though the filename was
   already renamed by the 2026-05-19 triad plan. `plan-maker.md` is the
   control case — its filename and frontmatter `name:` both correctly read
   `plan-maker`, proving the other 4 were simply missed.
   This is an agent-definition correctness bug inside `.claude/agents/`,
   owned by `agent-maker`'s domain (editing agent frontmatter), not a
   documentation bug. Fixing it is a different kind of change (editing agent
   definitions, not docs) and is deferred to a follow-up plan. **However**,
   the new `claude-agents.md` catalog must document this discrepancy
   explicitly (see `technical-design.md` Agent Roster) rather than silently
   assert the frontmatter already matches the filename — documenting a
   known inconsistency accurately is in scope; fixing the inconsistency is
   not.

2. **No `.claude/agents/*.md` file is renamed, created, or deleted.** All 53
   agent files already exist with their current (mostly correct) filenames;
   this plan only corrects documentation that describes them.

3. **`AGENTS.md`'s family table is not expanded** beyond correcting the
   existing 3 families' agent names. It stays a deliberately partial
   "flagship families" sample; `docs/reference/claude-agents.md` becomes the
   single complete 53-agent source of truth.

4. **`docs/how-to/use-claude-validators.md` is not renamed or retired.** It
   keeps its current path and narrow checker-focused scope.

5. **No historical/point-in-time record is touched**: `docs/reference/implementation-summary.md`,
   `VERIFICATION_SUMMARY.md` (repo root), `plans/done/**` (all prior plans,
   including `2026-05-19__claude-agents-triad` and `2025-01-05__claude-agents-infrastructure`),
   `plans/ideas.md`'s archived (struck-through) entries, and
   `docs/linkedin/History/**`. These describe what was true or published at
   a point in time and are not living reference documentation.

6. **No interaction with `wahidyankf/ose-public`.** That repository is
   read-only reference material consulted via `repo-syncing-with-ose-primer`
   (one-directional: IKP-Labs reads from it, never writes to it). This plan
   is a 100% internal IKP-Labs documentation fix with zero write-back to the
   senior reference repo.

7. **No CI/CD, build, or test-runner changes.** This is a documentation-only
   plan; no `apps/`, `.github/workflows/`, or `specs/` files are touched.

## User Stories

### User Story 1: Accurate agent catalog

As a developer looking up what Claude agents exist in this repository
I want `docs/reference/claude-agents.md` to list the real 53 agents by their
real names
So that I can find and invoke the correct agent for my task without guessing

**Acceptance Criteria:**

```gherkin
Scenario: Developer looks up an agent by family
  Given docs/reference/claude-agents.md has been rewritten
  When the developer opens the Documentation family section
  Then they see docs-maker, docs-checker, docs-fixer, docs-file-manager,
    docs-link-checker, and docs-link-fixer listed with real descriptions
    read from their actual .claude/agents/*.md frontmatter

Scenario: Developer searches for a fictional agent name
  Given docs/reference/claude-agents.md has been rewritten
  When the developer searches the file for "plan-writer"
  Then zero matches are found, because plan-writer was renamed to plan-maker
    and the catalog reflects the current name only
```

### User Story 2: Working invocation handles in the root README

As a developer reading the root README's "Claude Validators" section
I want the `@agent-name` handles shown to be agents that actually exist
So that copy-pasting the handle into a Claude Code session invokes a real agent

**Acceptance Criteria:**

```gherkin
Scenario: Developer copies a validator handle from the README
  Given README.md's "Claude Validators" section has been corrected
  When the developer copies "@test-checker" from the table
  Then .claude/agents/test-checker.md exists and can be invoked

Scenario: Developer wants the full agent roster, not just 3
  Given README.md's "Claude Validators" section has been corrected
  When the developer reads the section
  Then they find a pointer line to docs/reference/claude-agents.md for the
    complete 53-agent catalog
```

### User Story 3: Checker-usage guide uses correct terminology

As a developer following the how-to guide for running quality checks
I want docs/how-to/use-claude-validators.md to reference real agent names
So that the documented `@test-checker`, `@docs-checker`, `@plan-checker`
invocations actually work

**Acceptance Criteria:**

```gherkin
Scenario: Developer follows the checker-usage how-to guide
  Given docs/how-to/use-claude-validators.md has been rewritten in place
  When the developer invokes one of the 3 documented agents
  Then the agent name matches a real file in .claude/agents/
    (test-checker.md, docs-checker.md, or plan-checker.md)
```

### User Story 4: Plan-creation guide references the real planning agent

As a developer following docs/how-to/create-implementation-plans.md
I want the guide to tell me to invoke `@plan-maker`
So that I don't try to invoke a nonexistent `@plan-writer` agent

**Acceptance Criteria:**

```gherkin
Scenario: Developer follows the plan-creation guide
  Given docs/how-to/create-implementation-plans.md has been corrected
  When the developer searches the file for "plan-writer"
  Then zero matches are found and all 8 prior occurrences now read
    "plan-maker"
```

### User Story 5: AGENTS.md's family tables are internally consistent

As a developer reading AGENTS.md to understand the agent family structure
I want the 3 documented families (Documentation, Planning, Testing & Specs)
to name agents that actually exist
So that AGENTS.md remains a trustworthy quick-reference, consistent with the
full catalog it points to

**Acceptance Criteria:**

```gherkin
Scenario: Developer reads the Documentation family row in AGENTS.md
  Given AGENTS.md's family tables have been corrected
  When the developer reads the Documentation row
  Then it names docs-maker (Maker) and docs-checker (Checker), not
    documentation-writer and docs-validator
```

## Success Criteria

- `grep -rE "plan-writer|documentation-writer|gherkin-spec-writer|docs-validator|test-validator"`
  (the 5 pre-rename names) run across the repo, excluding `plans/done/**`,
  `docs/reference/implementation-summary.md`, `VERIFICATION_SUMMARY.md`, and
  `docs/linkedin/History/**`, returns zero matches.
- `docs/reference/claude-agents.md` documents all 53 agents from
  `.claude/agents/*.md` (excluding `README.md`), grouped by family, each with
  a name, purpose summary, model, and the skills it references — every value
  sourced from the real file, not invented.
- `docs/reference/claude-agents.md` explicitly documents the 4-agent
  frontmatter `name:` mismatch (`docs-checker.md`, `docs-maker.md`,
  `specs-maker.md`, `test-checker.md`) as a known, flagged inconsistency with
  a pointer to a follow-up fix — it does not silently assume the mismatch is
  resolved.
- `README.md`'s "Claude Validators" section lists working agent handles and
  links to the full catalog.
- `docs-checker` run against all 7 corrected files reports zero CRITICAL and
  zero HIGH findings related to this plan's changes.
- `docs-link-checker` reports zero broken internal links introduced or left
  unfixed by this plan's changes.
- `markdownlint` passes on all 7 modified files.
- No `.claude/agents/*.md` file is modified by this plan.
- No file under `plans/done/`, `docs/reference/implementation-summary.md`,
  `VERIFICATION_SUMMARY.md`, or `docs/linkedin/History/**` is modified.
