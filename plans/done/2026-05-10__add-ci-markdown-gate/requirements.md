# Requirements — Add CI Markdown Gate

---

## Scope

### What IS Included

**Phase 1 — Markdown Scripts (`config/add-markdown-scripts`):**

- `lint:md:fix` script added to root `package.json`, running
  `markdownlint-cli2 --fix "**/*.md"`
- `format:md` script added to root `package.json`, running
  `prettier --write "**/*.md"`
- `format:md:check` script added to root `package.json`, running
  `prettier --check "**/*.md"`
- Verification that `prettier` is available at the repo root after `npm ci`

**Phase 2 — Fix lint-staged Coverage (`config/fix-lint-staged-markdown`):**

- The `"apps/kameravue-fe/**/*.{json,md,css}"` glob in `lint-staged` is changed
  to `"apps/kameravue-fe/**/*.{json,css}"` — `md` is removed from this pattern
- The `"**/*.md"` entry in `lint-staged` is updated to run both
  `npx prettier --write` and `markdownlint-cli2 --fix`, in that order
- The result is that ALL staged markdown files anywhere in the repository
  receive prettier formatting followed by markdownlint auto-fix at every commit

**Phase 3 — CI Markdown Job, observe (`ci/add-markdown-lint-job`):**

- A new `markdown-lint` job added to `.github/workflows/kameravue-ci.yml`
- The job runs `npm run lint:md` at the repository root
- The job uses `runs-on: ubuntu-latest` and steps: checkout, setup-node,
  `npm ci`, `npm run lint:md`
- The `ci-summary` job is NOT updated in this phase — the new job runs and
  produces a visible result but does not yet block PR merges
- The job is inserted between the `api-tests` job and the `ci-summary` job
  in the workflow file

**Phase 4 — Fix `.claude/skills/` Violations (`docs/fix-md-claude-skills`):**

- All 345 markdownlint violations in `.claude/skills/` are resolved
- Auto-fixable violations resolved via `npm run lint:md:fix` scoped to the
  directory
- Remaining violations (MD040 missing code block language, MD036
  emphasis-as-heading, MD024 duplicate headings) fixed manually
- `npm run lint:md` reports zero violations for `.claude/skills/` after the fix

**Phase 5 — Fix `.claude/agents/` Violations (`docs/fix-md-claude-agents`):**

- All 297 markdownlint violations in `.claude/agents/` are resolved
- Same auto-fix then manual-fix approach as Phase 4
- `npm run lint:md` reports zero violations for `.claude/agents/` after the fix

**Phase 6 — Fix `apps/` Markdown Violations (`docs/fix-md-apps`):**

- All 482 markdownlint violations in the `apps/` directory are resolved
- Same auto-fix then manual-fix approach as Phase 4
- `npm run lint:md` reports zero violations for `apps/` after the fix

**Phase 7 — Fix Misc Remaining Violations (`docs/fix-md-remaining`):**

- All 257 remaining markdownlint violations not covered by Phases 4-6 are
  resolved
- Directories include any markdown files in `docs/`, `specs/`, repo root, and
  any other location outside the areas covered by Phases 4-6 and 8-10
- `npm run lint:md` reports zero violations for these areas after the fix

**Phase 8 — Fix `plans/done/` 2024 Plans (`docs/fix-md-plans-done-2024`):**

- All markdownlint violations in 2024-dated subdirectories under `plans/done/`
  are resolved
- Same auto-fix then manual-fix approach as Phase 4
- `npm run lint:md` reports zero violations for the 2024 plan files after the
  fix

**Phase 9 — Fix `plans/done/` Early 2026 Plans (`docs/fix-md-plans-done-2026-early`):**

- All markdownlint violations in Jan-Mar 2026 subdirectories under `plans/done/`
  are resolved
- Same auto-fix then manual-fix approach as Phase 4
- `npm run lint:md` reports zero violations for the Jan-Mar 2026 plan files
  after the fix

**Phase 10 — Fix `plans/done/` Late 2026 Plans (`docs/fix-md-plans-done-2026-late`):**

- All markdownlint violations in Apr-May 2026 subdirectories under `plans/done/`
  are resolved
- Same auto-fix then manual-fix approach as Phase 4
- `npm run lint:md` reports zero violations for the Apr-May 2026 plan files
  after the fix
- After this phase, `npm run lint:md` run at the repo root reports zero
  violations across the entire repository

**Phase 11 — Activate CI Gate, hard gate (`ci/enforce-markdown-gate`):**

- The `ci-summary` job's `needs` list is updated to include `markdown-lint`
- The `ci-summary` failure-condition shell script is updated to check
  `needs.markdown-lint.result` and fail when the job did not succeed
- The `ci-summary` echo lines inside both the success block and the failure
  block gain a new line reporting the `markdown-lint` result
- The ASCII diagram in the top comment block of the workflow file is updated
  to show `markdown-lint` as a sixth parallel box

**Validation across all phases:**

- Verify each script resolves without error on a clean working tree
- Verify lint-staged invokes both tools on a staged markdown file outside
  `apps/kameravue-fe/`
- Verify YAML syntax is valid (manual inspection or `actionlint`)
- Verify CI passes on the PR for each phase before merging
- Verify `npm run lint:md` shows zero violations for the target area after
  each of Phases 4-10 before the PR is opened

---

### What is NOT Included

- Fixing violations that reappear after Phase 11 — those are blocked by the
  gate itself and are the responsibility of the PR author
- Adding `format:md:check` as a step inside any existing CI job — markdown
  enforcement is isolated to the dedicated `markdown-lint` job
- Prettier enforcement of markdown in CI (only `markdownlint-cli2` runs in CI;
  prettier runs locally via `lint-staged`)
- Changing `.markdownlint-cli2.jsonc` rules or thresholds to suppress
  violations rather than fix them
- Adding markdownlint to the `frontend-lint` job
- Changing the `kameravue-scheduled-e2e.yml` workflow
- Adding a markdown job to the scheduled E2E workflow
- E2E or unit test changes of any kind
- Backend changes of any kind
- Frontend source code changes of any kind
- Violation auto-fix tooling running as part of CI (CI is check-only)
- Adding Husky hooks (the pre-commit hook already exists)
- A `paths` filter on the `markdown-lint` job (it runs unconditionally on every
  push/PR; path-filter optimization is a future improvement)
- Adding a `commitlint` rule for markdown
- Suppressing or ignoring any violation category via inline `<!-- markdownlint-disable -->` comments as a blanket workaround
- Splitting Phases 4-10 into sub-phases beyond what is defined here

---

## User Stories

### User Story 1: Developer wants named markdown scripts

As a developer working with markdown files in the repository
I want `lint:md:fix`, `format:md`, and `format:md:check` scripts in `package.json`
So that I can fix violations and format markdown without remembering workaround syntax

**Acceptance Criteria:**

Scenario: Developer runs lint:md:fix on a file with violations
Given the developer has one or more markdown files with fixable violations
When the developer runs `npm run lint:md:fix` at the repo root
Then markdownlint-cli2 applies auto-fixes to all markdown files
And the command exits with code 0 when no unfixable violations remain

Scenario: Developer runs format:md on unformatted markdown files
Given one or more markdown files are not formatted by prettier
When the developer runs `npm run format:md` at the repo root
Then prettier rewrites the files to match its formatting rules
And the command exits with code 0

Scenario: Developer runs format:md:check on unformatted files
Given one or more markdown files are not formatted by prettier
When the developer runs `npm run format:md:check` at the repo root
Then prettier exits with a non-zero code
And lists the files that would be changed

---

### User Story 2: Developer wants all markdown files linted on commit

As a developer committing changes that include markdown files
I want lint-staged to run both prettier and markdownlint on ALL staged markdown files
So that both formatting and lint violations are fixed automatically before the commit is recorded
regardless of where in the repository the file lives

**Acceptance Criteria:**

Scenario: Developer stages a markdown file outside apps/kameravue-fe/
Given the developer stages a markdown file in `docs/`, `plans/`, or the repo root
When the developer runs `git commit`
Then lint-staged runs `npx prettier --write` on the file
And lint-staged runs `markdownlint-cli2 --fix` on the file after prettier
And the commit succeeds if no unfixable violations remain

Scenario: Developer stages a markdown file inside apps/kameravue-fe/
Given the developer stages a markdown file under `apps/kameravue-fe/`
When the developer runs `git commit`
Then lint-staged runs `npx prettier --write` on the file via the `**/*.md` entry
And lint-staged runs `markdownlint-cli2 --fix` on the file
And the `apps/kameravue-fe/**/*.{json,css}` entry does NOT also run prettier
on the same file (no duplicate prettier run)

---

### User Story 3: Team wants to observe the markdown CI job before enforcing it

As a team member reviewing the CI workflow
I want a `markdown-lint` job visible in the GitHub Actions check list
So that I can verify it runs correctly and see its results before it blocks any PRs

**Acceptance Criteria:**

Scenario: PR is opened after Phase 3 is merged
Given the `markdown-lint` job exists in the workflow file
And the `ci-summary` job does NOT yet include `markdown-lint` in its `needs`
When a PR is opened (with or without markdown violations)
Then the `markdown-lint` job appears in the GitHub Actions check list
And the `markdown-lint` job result (pass or fail) is visible
And the `ci-summary` job passes regardless of the `markdown-lint` result
And the PR is NOT blocked by markdown violations

---

### User Story 4: Developer wants zero markdown violations in .claude/skills/

As a developer working in the `.claude/skills/` directory
I want all markdown violations in that directory resolved
So that the repository moves closer to zero total violations and Phase 11 can be activated

**Acceptance Criteria:**

Scenario: Violations in .claude/skills/ are resolved
Given there are 345 violations across 37 files in `.claude/skills/`
When the developer runs `npm run lint:md:fix` scoped to `.claude/skills/` and
manually fixes remaining violations
Then `npm run lint:md` reports zero violations for `.claude/skills/`

---

### User Story 5: Developer wants zero markdown violations in .claude/agents/

As a developer working in the `.claude/agents/` directory
I want all markdown violations in that directory resolved
So that the repository moves closer to zero total violations and Phase 11 can be activated

**Acceptance Criteria:**

Scenario: Violations in .claude/agents/ are resolved
Given there are 297 violations across 70 files in `.claude/agents/`
When the developer runs `npm run lint:md:fix` scoped to `.claude/agents/` and
manually fixes remaining violations
Then `npm run lint:md` reports zero violations for `.claude/agents/`

---

### User Story 6: Developer wants zero markdown violations in apps/

As a developer working in the `apps/` directory
I want all markdown violations in that directory resolved
So that the repository moves closer to zero total violations and Phase 11 can be activated

**Acceptance Criteria:**

Scenario: Violations in apps/ are resolved
Given there are 482 violations in the `apps/` directory
When the developer runs `npm run lint:md:fix` scoped to `apps/` and manually
fixes remaining violations
Then `npm run lint:md` reports zero violations for `apps/`

---

### User Story 7: Developer wants zero misc remaining markdown violations

As a developer responsible for the remaining scattered violations
I want all 257 miscellaneous violations outside the main directories resolved
So that the repository violation count reaches zero outside of `plans/done/`

**Acceptance Criteria:**

Scenario: Misc remaining violations are resolved
Given there are 257 violations in areas outside `.claude/skills/`, `.claude/agents/`,
`apps/`, and `plans/done/`
When the developer applies auto-fix and manually fixes remaining violations
Then `npm run lint:md` reports zero violations for those areas

---

### User Story 8: Developer wants zero markdown violations in 2024 done plans

As a developer cleaning up historical plan documents
I want all markdown violations in 2024-dated `plans/done/` subdirectories resolved
So that the large `plans/done/` backlog is reduced in a manageable batch

**Acceptance Criteria:**

Scenario: 2024 done plan violations are resolved
Given there are violations in 2024-dated subdirectories under `plans/done/`
When the developer applies auto-fix and manually fixes remaining violations
Then `npm run lint:md` reports zero violations for those files

---

### User Story 9: Developer wants zero markdown violations in early 2026 done plans

As a developer cleaning up historical plan documents
I want all markdown violations in Jan-Mar 2026 `plans/done/` subdirectories resolved
So that the `plans/done/` backlog continues to shrink

**Acceptance Criteria:**

Scenario: Early 2026 done plan violations are resolved
Given there are violations in Jan-Mar 2026 subdirectories under `plans/done/`
When the developer applies auto-fix and manually fixes remaining violations
Then `npm run lint:md` reports zero violations for those files

---

### User Story 10: Developer wants zero markdown violations in late 2026 done plans

As a developer cleaning up historical plan documents
I want all markdown violations in Apr-May 2026 `plans/done/` subdirectories resolved
So that the entire `plans/done/` backlog is cleared and total violations reach zero

**Acceptance Criteria:**

Scenario: Late 2026 done plan violations are resolved
Given there are violations in Apr-May 2026 subdirectories under `plans/done/`
When the developer applies auto-fix and manually fixes remaining violations
Then `npm run lint:md` reports zero violations for those files
And `npm run lint:md` run at the repo root reports zero total violations

---

### User Story 11: Team wants markdown violations to block PR merge

As a team member maintaining code quality on `main`
I want the `ci-summary` job to include `markdown-lint` in its gate
So that any PR containing markdown violations cannot be merged into `main`

**Acceptance Criteria:**

Scenario: PR contains a markdown file with violations
Given the developer pushes a branch containing a markdown file with lint violations
When the GitHub Actions CI workflow runs
Then the `markdown-lint` job fails
And the `ci-summary` job fails because `needs.markdown-lint.result` is not `success`
And the PR cannot be merged via the branch protection rule

Scenario: PR contains no markdown violations
Given the developer pushes a branch with markdown files that have no violations
When the GitHub Actions CI workflow runs
Then the `markdown-lint` job succeeds
And the `ci-summary` job succeeds
And the PR can be merged

Scenario: PR changes only non-markdown files
Given the developer pushes a branch that changes only TypeScript files
When the GitHub Actions CI workflow runs
Then the `markdown-lint` job runs and succeeds (no violations in existing files)
And the `ci-summary` job succeeds

---

## Success Criteria

**Phase 1:**

- `npm run lint:md:fix` is a valid script in root `package.json`
- `npm run format:md` is a valid script in root `package.json`
- `npm run format:md:check` is a valid script in root `package.json`
- All three scripts execute without a command-not-found error

**Phase 2:**

- The `lint-staged` `"**/*.md"` entry runs both `npx prettier --write` and
  `markdownlint-cli2 --fix` in that order
- The `"apps/kameravue-fe/**/*.{json,md,css}"` glob no longer contains `md`
- A markdown file staged from `docs/` or `plans/` triggers both tools

**Phase 3:**

- The `markdown-lint` job exists in `.github/workflows/kameravue-ci.yml`
- The job appears in the GitHub Actions check list when a PR is opened
- The `ci-summary` `needs` list does NOT yet include `markdown-lint`
- A PR with markdown violations passes `ci-summary` (not blocked)

**Phase 4:**

- `npm run lint:md` reports zero violations scoped to `.claude/skills/`

**Phase 5:**

- `npm run lint:md` reports zero violations scoped to `.claude/agents/`

**Phase 6:**

- `npm run lint:md` reports zero violations scoped to `apps/`

**Phase 7:**

- `npm run lint:md` reports zero violations for all misc areas outside
  `.claude/skills/`, `.claude/agents/`, `apps/`, and `plans/done/`

**Phase 8:**

- `npm run lint:md` reports zero violations for 2024-dated plan files under
  `plans/done/`

**Phase 9:**

- `npm run lint:md` reports zero violations for Jan-Mar 2026 plan files under
  `plans/done/`

**Phase 10:**

- `npm run lint:md` reports zero violations for Apr-May 2026 plan files under
  `plans/done/`
- `npm run lint:md` run at the repo root reports zero total violations across
  the entire repository

**Phase 11:**

- The `ci-summary` `needs` list includes `markdown-lint`
- The `ci-summary` shell script checks `needs.markdown-lint.result`
- The ASCII diagram in the workflow file header shows `markdown-lint`
- A PR with markdown violations is blocked from merging
- All existing CI jobs continue to pass after the changes
- YAML syntax is valid (no GitHub Actions parse errors)
