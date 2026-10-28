# Checklist: Tooling: Nx Workspace Work

---

## Phase 0 — Pre-flight (no PR) — ✅ Done

- [x] Confirm `.claude/skills/tooling-nx/` does not exist (`ls .claude/skills/ | grep tooling-nx`
      returns nothing) — re-verify immediately before starting PR1, since time may have passed
      since this plan was written. Confirmed: no match.
- [x] Confirm current real skill-directory count is still 31 via
      `ls .claude/skills/ | grep -v README | wc -l` — re-verify before PR2's count edits, in case
      another plan added or removed a skill in the meantime. Confirmed: 31.

---

## PR1 — Create `.claude/skills/tooling-nx/SKILL.md` — ✅ Done

**Branch**: `docs/tooling-nx-skill`

- [x] Create `.claude/skills/tooling-nx/SKILL.md` with the exact content drafted in
      `technical-design.md`'s "Full Drafted Skill Content" section.
- [x] Verify every internal link in the new file resolves:
  - [x] `../../agents/ci-checker.md` (and its `#nx-conformance-checks-projectjson` anchor) —
        confirmed heading `## Nx Conformance Checks (project.json)` exists at line 117, GFM
        anchor matches
  - [x] `../test-coverage-rules/SKILL.md` — confirmed exists
  - [x] `../repo-understanding-repository-architecture/SKILL.md` — confirmed directory exists
- [x] Verify every file path and project name cited in the new skill is real:
  - [x] `apps/kameravue-fe/project.json` (`build`'s implicit `dependsOn: ["^build"]` from
        `nx.json` targetDefaults) — confirmed via `python3 -c "import json..."` parse of `nx.json`
  - [x] `apps/kameravue-fe-e2e/project.json` (`implicitDependencies`, `scope:kameravue` tag gap)
        — confirmed: `["kameravue-fe", "kameravue-be"]`, tags include `scope:kameravue` not
        `domain:kameravue`, no `lang:` tag
  - [x] `apps/taskly-be-e2e/project.json` (`implicitDependencies: ["taskly-be"]`) — confirmed
  - [x] `apps/kameravue-be/project.json` (missing `lint` target) — confirmed targets are
        `['build', 'serve', 'test']`, no `lint`
  - [x] `apps/taskly-be/project.json` (missing `test` target, confirmed safe-to-add per
        `ci-fixer.md`) — confirmed targets are `['serve', 'build', 'lint']`, no `test`; `ci-fixer.md`
        contains the exact `go test ./...` fix snippet
  - [x] `nx.json` (`cacheableOperations`, `targetDefaults.dev/serve.cache: false`,
        `targetDefaults.test.outputs`, `namedInputs`) — all confirmed via direct JSON parse
  - [x] `.github/workflows/kameravue-ci.yml` and `kameravue-scheduled-e2e.yml` — confirmed via
        `grep -n "nx affected" .github/workflows/*.yml` returning zero matches, still accurate at
        implementation time
  - [x] Additionally verified (beyond the checklist's own list): `@nx/eslint-plugin` absent from
        root `package.json`, `kameravue-fe/eslint.config.mjs` only extends Next.js presets — both
        claims in the "Answer a Boundary Finding" section confirmed accurate
- [x] Confirm the file follows the plain-markdown skill header convention (no YAML frontmatter) —
      compare against `.claude/skills/ci-standards/SKILL.md`'s structure. Confirmed match.
- [x] Run `npm run lint:md` and fix all markdown violations. 0 errors.
- [ ] Commit: `docs(skills): add tooling-nx skill for day-to-day nx workspace work`.
- [ ] Push branch, open PR, confirm CI passes, merge `--squash --delete-branch`, pull `main`.

---

## PR2 — Catalog Bookkeeping + Archive

**Branch**: `docs/tooling-nx-catalog-bookkeeping`

### `docs/reference/claude-agents.md`

- [ ] Update line 361 (`The 30 skill directories under`) to `The 32 skill directories under`.
- [ ] Insert the `repo-defining-multi-agent-workflows` row (alphabetically **after**
      `repo-assessing-criticality-confidence` and **before** `repo-defining-workflows` — `m` < `w`
      at the first differing character, so "multi-agent-workflows" sorts ahead of "workflows";
      do not place it after `repo-defining-workflows`) with "not declared by any agent's
      `permission.skill:`" in its Declared By column.
- [ ] Insert the `tooling-nx` row (alphabetically after `test-playwright-patterns`, before
      `wow-criticality-assessment`) following the `docs-creating-accessible-diagrams` row's style
      for a zero-agents-declared skill.
- [ ] Re-count the table's rows manually after editing and confirm it equals 32.

### `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`

- [ ] Update the Harness Inventory Reference table's Skills row: count `31` → `32`, with the note
      `2026-10-28 (added \`tooling-nx\`, guidance for day-to-day Nx workspace work — no name
      collision, no DEFER record)`.
- [ ] Update the `**Last Updated**:` footer date to match.

### Archive

- [ ] Update this plan's `README.md` status from "🚧 In Progress" to "✅ Completed", add a
      **Completed** date line.
- [ ] `git mv plans/in-progress/2026-10-28__tooling-nx plans/done/2026-10-28__tooling-nx`.
- [ ] Update `plans/README.md`'s index if it lists in-progress/done plans individually (verify
      whether it does before assuming a change is needed).

### Validation

- [ ] Run `npm run lint:md` and fix all markdown violations across all three changed files.
- [ ] `grep -c "^|.*\[\`" docs/reference/claude-agents.md` (or manual count) confirms 32 skill rows
      in the Skills Reference table.
- [ ] Commit: `docs(plan): backfill claude-agents skills catalog and archive tooling-nx plan`.
- [ ] Push branch, open PR, confirm CI passes, merge `--squash --delete-branch`, pull `main`.

---

## Quality Gates

- [ ] No file under `.claude/agents/` was modified by either PR.
- [ ] `AGENTS.md` was not modified by either PR.
- [ ] No file under `apps/` or `nx.json` was modified by either PR.
- [ ] Both PRs are `docs`-type commits per this repo's commitlint configuration.
- [ ] `npm run lint:md` passes with zero errors on every file touched across both PRs.

---

## Post-Write Grill-Me Validation (performed during plan creation, not an implementation task)

- [x] Decision 1 (no agent declares `tooling-nx`) — reflected in `requirements.md` Non-Scope #1
      and the skill's own "Adoption Note".
- [x] Decision 2 (`AGENTS.md` Skills Catalog untouched) — reflected in `requirements.md`
      Non-Scope #3 and confirmed absent from `checklist.md`'s task list.
- [x] Decision 3 (backfill both missing catalog rows, count → 32) — reflected in `requirements.md`
      Scope #3 and `technical-design.md`'s "Catalog Bookkeeping Edits" section.
