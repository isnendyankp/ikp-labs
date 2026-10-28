# Requirements: Tooling: Nx Workspace Work

---

## Scope

### In Scope

1. **New skill file**: `.claude/skills/tooling-nx/SKILL.md`, adapted from OSE's
   `.agents/skills/tooling-nx/SKILL.md` to IKP-Labs's markdown-header skill convention (no YAML
   frontmatter — see `technical-design.md` for the convention check), covering:
   - Reading a project's recorded tag vocabulary and dependency constraints before touching it,
     and preferring `nx show project <name>` over reading `project.json` alone.
   - Selecting change-scoped work through `nx affected`/`nx run-many` rather than hand-picking
     projects, and what an unexpected inclusion or omission in that selection means.
   - Adding a target only when the underlying capability genuinely exists (grounded in
     `kameravue-be`'s missing `lint` target and `taskly-be`'s missing `test` target — both real,
     currently-flagged gaps in this repo).
   - Diagnosing a stale cached result with `nx --skip-nx-cache`, grounded in this repo's real
     `nx.json` `cacheableOperations`/`targetDefaults`/`namedInputs` configuration.
   - Responding to a module-boundary finding at the dependency, grounded honestly in the fact that
     IKP-Labs's four-dimension tag scheme (`type:`/`platform:`/`lang:`/`domain:`) exists and is
     statically audited by `ci-checker`, but no `@nx/enforce-module-boundaries` ESLint rule is
     currently wired into the workspace to enforce it live.
   - A "Before Handing Off" checklist adapted from OSE's, with its cross-references to OSE
     governance docs IKP-Labs doesn't have replaced by links to `ci-checker.md`'s Nx Conformance
     Checks section and `test-coverage-rules/SKILL.md`.
2. **Every worked example in the new skill references real content** from an actual
   `apps/*/project.json`, `nx.json`, or `.github/workflows/*.yml` file in this repository — no
   invented project names, target names, or tag values.
3. **Backfill `docs/reference/claude-agents.md`'s Skills Reference table**:
   - Add the row for `repo-defining-multi-agent-workflows` (added by the immediately prior sync
     plan but never added to this table — a pre-existing staleness bug discovered during this
     plan's research, unrelated to `tooling-nx` itself but touching the exact table cell this plan
     needs to edit anyway).
   - Add the row for `tooling-nx`, following the exact style of the `docs-creating-accessible-diagrams`
     row (the precedent pattern for a skill declared by zero agents).
   - Update the table's stated count from "30" to "32" (two rows added in the same pass).
4. **Bump `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s Harness Inventory Reference
   table**: Skills count 31 → 32, with a dated note recording the addition of `tooling-nx` (matching
   the existing note style for `repo-defining-multi-agent-workflows`'s own entry).
5. **Archive this plan** to `plans/done/2026-10-28__tooling-nx/` via `git mv` once all checklist
   items are complete and merged.

### Non-Scope

1. **No agent declares `tooling-nx` in `permission.skill:`.** Confirmed via OSE's own 77 canonical
   `agents/*.md` files: zero agents reference `tooling-nx`, including `ci-checker` (the agent with
   the closest adjacent static-audit responsibility). This matches the precedent set by
   `repo-defining-multi-agent-workflows` ("None yet — documentation-only, applied ad hoc").
2. **No new agent is created** (e.g., no `nx-workspace-helper`) to own this skill. The skill is
   discoverable via the `.claude/skills/` directory listing and the `Skill` tool, same as every
   other ad hoc, non-agent-owned skill in this repo.
3. **`AGENTS.md`'s "Skills Catalog" table is not modified.** That table is a deliberately partial
   sample tied to the three flagship Maker-Checker families (Documentation, Planning, Testing &
   Specs); `tooling-nx` doesn't belong to any of them, and OSE itself has no equivalent curated
   table to model this addition on.
4. **No `@nx/enforce-module-boundaries` ESLint rule is added to the workspace.** The skill
   documents how to respond _if/when_ such a lint rule produces a finding; actually wiring that
   rule in is a separate, larger infrastructure change with its own trade-offs (which projects get
   which tags enforced, what the allowed dependency matrix is) that this plan does not make.
5. **CI is not changed to use `nx affected` or `nx run-many`.** The skill documents the convention
   for day-to-day developer/agent work; whether `.github/workflows/*.yml` itself should adopt
   `nx affected` is a separate CI-infrastructure decision, out of scope here.
6. **`ci-checker.md` and `ci-fixer.md` are not modified.** This plan links to their existing Nx
   Conformance Checks section as the closest real equivalent of OSE's "what the rule is" layer; it
   does not add, remove, or restate any of their check/fix categories.
7. **No existing `apps/*/project.json` file is modified.** The plan's worked examples _reference_
   real target/tag gaps already documented as findings in `ci-checker.md`/`ci-fixer.md` (e.g.
   `kameravue-be`'s missing `lint` target); it does not fix those gaps — that remains `ci-fixer`'s
   job, run separately.
8. **No OSE governance doc is ported verbatim or recreated as a new IKP-Labs governance file.**
   `nx-standards.md`, `nx-targets.md`, and `meaningful-coverage.md` have no IKP-Labs equivalent and
   none is created by this plan; the skill links to the closest existing real equivalents instead
   (see Scope item 1).

---

## User Stories

### User Story: Diagnosing a stale Nx cache hit

As a developer or agent working in this Nx monorepo
I want documented guidance for when a cached Nx target result looks wrong
So that I can find the missing input instead of guessing or disabling caching outright

**Acceptance Criteria:**

```gherkin
Scenario: A cached test run passes but a fresh run fails
  Given a developer suspects a cached `nx test kameravue-be` result replayed a stale pass
  When they consult `.claude/skills/tooling-nx/SKILL.md`'s "Cache Only Deterministic Targets" section
  Then they are directed to rerun with `--skip-nx-cache`, compare the fresh result, and if it
    differs, find and declare the missing input in the target's inputs or `nx.json` named inputs
    rather than disabling caching for the target
```

### User Story: Choosing what to add a target for

As a developer or agent adding a new Nx target to a project
I want documented guidance on when a target is safe to add
So that I don't create a target pointing at a capability that doesn't actually exist

**Acceptance Criteria:**

```gherkin
Scenario: Considering adding a lint target to kameravue-be
  Given `kameravue-be`'s `pom.xml` has no Checkstyle/PMD/Spotless plugin configured
  When a developer or agent consults `.claude/skills/tooling-nx/SKILL.md`'s "Add a Target Only
    Where a Capability Exists" section
  Then they are directed to add the linter plugin first, as a separate change, rather than adding
    a `lint` target that points at a command which doesn't exist
```

### User Story: Responding to an unexpected `nx affected` selection

As a developer or agent running change-scoped Nx work
I want documented guidance on what to do when `nx affected` selects an unexpected project
So that I treat the graph as the source of truth instead of overriding it by hand

**Acceptance Criteria:**

```gherkin
Scenario: nx affected omits a project the developer expected to see selected
  Given a developer expected `kameravue-fe-e2e` to be selected after changing `kameravue-fe`,
    but it was not
  When they consult `.claude/skills/tooling-nx/SKILL.md`'s "Select by the Project Graph, Not by
    Hand" section
  Then they are directed to look for the missing dependency or input Nx cannot see (e.g. a
    declared `implicitDependencies` entry) and declare it, rather than adding the project to the
    run by hand
```

### User Story: Discoverability of the new skill in the catalog

As a maintainer scanning `docs/reference/claude-agents.md` for the full skill inventory
I want the Skills Reference table to reflect every real skill directory, including `tooling-nx`
So that the catalog doesn't silently drift out of sync with `.claude/skills/`

**Acceptance Criteria:**

```gherkin
Scenario: Catalog table reflects the true skill count after this plan merges
  Given `.claude/skills/` contains 32 skill directories after `tooling-nx` is added
  When a maintainer reads `docs/reference/claude-agents.md`'s Skills Reference table
  Then the table states "32" skill directories, lists a row for `tooling-nx` with "not declared by
    any agent's `permission.skill:`" in its Declared By column, and also lists the previously
    missing row for `repo-defining-multi-agent-workflows`
```

---

## Success Criteria

- `.claude/skills/tooling-nx/SKILL.md` exists, follows the plain-markdown skill header convention
  used by every other skill in `.claude/skills/` (no YAML frontmatter), and every worked example
  cites a real file path and real content from this repository.
- `ls .claude/skills/ | grep -v README | wc -l` returns `32`.
- `docs/reference/claude-agents.md`'s Skills Reference table states "32" and contains rows for
  both `repo-defining-multi-agent-workflows` and `tooling-nx`.
- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s Harness Inventory Reference table states
  `32` for Skills with a dated note for the `tooling-nx` addition.
- No agent file under `.claude/agents/` is modified by this plan.
- `AGENTS.md` is not modified by this plan.
- No `apps/*/project.json`, `nx.json`, or ESLint config file is modified by this plan.
- `npm run lint:md` passes on every changed markdown file.
- This plan is archived to `plans/done/2026-10-28__tooling-nx/` after both PRs merge.
