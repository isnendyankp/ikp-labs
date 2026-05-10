# Technical Design — Add CI Markdown Gate

---

## Architecture Overview

```text
Current CI pipeline (kameravue-ci.yml):

  Push / PR Trigger
       |
  ┌────┴────────────────────────────────────────────┐
  |              (parallel)                         |
  ▼         ▼         ▼         ▼         ▼         |
frontend  frontend  backend   api-      frontend    |
-lint     -tests    -tests    tests     -build      |
  |         |         |         |         |         |
  └────┬────┴────────────────────┴─────────┘        |
       ▼                                            |
  ci-summary                                        |
  (needs: all 5 above)                              |
  if: always()                                      |
```

```text
After Phase 3 — markdown-lint job exists, ci-summary not yet updated:

  Push / PR Trigger
       |
  ┌────┴──────────────────────────────────────────────────┐
  |                      (parallel)                       |
  ▼         ▼         ▼         ▼         ▼         ▼     |
frontend  frontend  backend   api-      frontend  markdown|
-lint     -tests    -tests    tests     -build    -lint   |
  |         |         |         |         |         |     |
  |         |         |         |         |  (visible,    |
  |         |         |         |         |   not gating) |
  └────┬────┴──────────────────────┴─────────┘            |
       ▼                                                  |
  ci-summary                                             |
  (needs: original 5 only)                               |
  if: always()                                           |
```

```text
After Phase 11 — hard gate active:

  Push / PR Trigger
       |
  ┌────┴──────────────────────────────────────────────────┐
  |                      (parallel)                       |
  ▼         ▼         ▼         ▼         ▼         ▼     |
frontend  frontend  backend   api-      frontend  markdown|
-lint     -tests    -tests    tests     -build    -lint   |
  |         |         |         |         |         |     |
  └────┬────┴──────────────────────────────┴─────────┘    |
       ▼                                                  |
  ci-summary                                             |
  (needs: all 6 above)                                   |
  if: always()                                           |
```

---

## Full 11-Phase Flow

```text
Phase 1   Add npm scripts (lint:md:fix, format:md, format:md:check)
   |
Phase 2   Fix lint-staged: all **/*.md get prettier + markdownlint
   |
Phase 3   Add markdown-lint CI job (observe, no gate)
   |
   |  <-- Discover: 6,652 violations across 5 directories
   |
Phase 4   Fix .claude/skills/ — 345 violations
   |
Phase 5   Fix .claude/agents/ — 297 violations
   |
Phase 6   Fix apps/ — 482 violations
   |
Phase 7   Fix misc remaining — 257 violations
   |
Phase 8   Fix plans/done/ 2024 plans
   |
Phase 9   Fix plans/done/ early 2026 (Jan-Mar)
   |
Phase 10  Fix plans/done/ late 2026 (Apr-May)
   |        <-- total violations = 0 across entire repo
   |
Phase 11  Add markdown-lint to ci-summary needs (hard gate)
```

---

## Why plans/done/ is Split into Three Phases

The `plans/done/` directory contains approximately 5,271 violations across
roughly 50 files. This is the largest single source of violations and is
concentrated in historical plan documents that contain:

- MD040 (fenced code blocks without language specifier)
- MD024 (duplicate heading text within a file)
- MD036 (emphasis used as a heading)

These three rule violations cannot all be auto-fixed by `markdownlint-cli2`.
MD040 and MD036 require manual edits to add language identifiers to code blocks
and convert emphasis-as-headings to proper ATX headings. Applying this manually
across 50 files in one PR would produce an unreviably large diff and increase
the chance of introducing formatting errors.

Splitting by date range (2024 / early 2026 / late 2026) produces three PRs of
roughly equal size, each touching approximately 15-20 files, which is
reviewable in a single sitting.

---

## Files to Modify

**Phases 1-2:**

- `package.json` (root) — add scripts and update `lint-staged`

**Phases 3 and 11:**

- `.github/workflows/kameravue-ci.yml` — add job and update `ci-summary`

**Phases 4-10:**

- All markdown files (`*.md`) within the target directory for that phase —
  content changes only, no structural or config file changes

---

## Phase 1: Add npm Scripts

**Branch:** `config/add-markdown-scripts`

**File:** `package.json` (root)

### Current `scripts` block (relevant excerpt)

```json
"lint:md": "markdownlint-cli2 \"**/*.md\""
```

### Updated `scripts` block

```json
"lint:md": "markdownlint-cli2 \"**/*.md\"",
"lint:md:fix": "markdownlint-cli2 --fix \"**/*.md\"",
"format:md": "prettier --write \"**/*.md\"",
"format:md:check": "prettier --check \"**/*.md\""
```

The three new scripts are inserted immediately after `lint:md` so that all
markdown-related scripts are grouped together.

`lint:md:fix` uses `markdownlint-cli2 --fix` — the same tool that `lint-staged`
already invokes. This makes the fix command first-class so developers do not
have to remember `-- --fix` argument syntax.

`format:md` and `format:md:check` depend on `prettier`. `prettier` is already
installed as a transitive dependency of `apps/kameravue-fe`. Because the root
`package.json` uses npm workspaces, `prettier` is hoisted to `node_modules` at
the root and is available when running scripts at the root level. If it is not
available after `npm ci`, it must be added as a `devDependency` in the root
`package.json`. The checklist includes a verification step.

---

## Phase 2: Fix lint-staged Coverage

**Branch:** `config/fix-lint-staged-markdown`

**File:** `package.json` (root)

### Current `lint-staged` block

```json
"lint-staged": {
  "apps/kameravue-fe/**/*.{js,jsx,ts,tsx}": [
    "npx eslint --fix",
    "npx prettier --write"
  ],
  "apps/kameravue-fe/**/*.{json,md,css}": [
    "npx prettier --write"
  ],
  "**/*.md": [
    "markdownlint-cli2 --fix"
  ]
}
```

### Problem

The `"**/*.md"` entry runs `markdownlint-cli2 --fix` on all markdown files.
The `"apps/kameravue-fe/**/*.{json,md,css}"` entry runs `prettier --write`
only on markdown files inside the frontend app directory. Markdown files
in `docs/`, `plans/`, and the repo root do not get prettier formatting
applied at commit time.

### Updated `lint-staged` block

```json
"lint-staged": {
  "apps/kameravue-fe/**/*.{js,jsx,ts,tsx}": [
    "npx eslint --fix",
    "npx prettier --write"
  ],
  "apps/kameravue-fe/**/*.{json,css}": [
    "npx prettier --write"
  ],
  "**/*.md": [
    "npx prettier --write",
    "markdownlint-cli2 --fix"
  ]
}
```

### Key changes

- `apps/kameravue-fe/**/*.{json,md,css}` becomes `apps/kameravue-fe/**/*.{json,css}`
  — `md` is removed from this glob because the `**/*.md` entry now covers all
  markdown globally, including files inside the frontend directory.
- The `**/*.md` entry gains `npx prettier --write` as the first command.

### Ordering rationale

prettier reformats structure first, then markdownlint-cli2 fixes lint
violations. Running them in this order minimises the chance that
markdownlint-cli2's fixes interfere with prettier's output.

---

## Phase 3: Add CI Markdown Job (observe)

**Branch:** `ci/add-markdown-lint-job`

**File:** `.github/workflows/kameravue-ci.yml`

### Job Design

The job is structurally identical to `frontend-lint` but simpler: no native
binary installation, no Java, no separate working directory. It runs at the
monorepo root because `npm run lint:md` is defined at the root level and its
glob `"**/*.md"` is evaluated relative to the root.

The job runs unconditionally on every push and PR, like all other jobs in this
workflow. A path-filter optimisation (using `dorny/paths-filter` or a
workflow-level `paths` trigger) is explicitly out of scope for this plan.

### Job YAML

```yaml
# ===========================================
# Markdown Lint (markdownlint-cli2)
# ===========================================
markdown-lint:
  name: Markdown Lint
  runs-on: ubuntu-latest

  steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run markdown lint
      run: npm run lint:md
```

### Placement in the file

The job block is inserted between the `api-tests` job and the `ci-summary`
job, following the visual section pattern used by existing jobs (comment header
with separator lines). The `ci-summary` job is NOT modified in this phase.

---

## Phases 4-10: Fix Existing Violations

**Applies to:** `.claude/skills/`, `.claude/agents/`, `apps/`, misc remaining,
and `plans/done/` (split across Phases 8-10 by date range).

### Violation categories requiring manual fix

| Rule  | Description                        | Fix action                                      |
| ----- | ---------------------------------- | ----------------------------------------------- |
| MD040 | Fenced code block without language | Add language identifier after opening ` ``` `   |
| MD036 | Emphasis used as heading           | Convert `**heading**` to `## heading` ATX style |
| MD024 | Duplicate heading text             | Add distinguishing text or restructure headings |

### Fix pattern (same for each phase)

```text
1. Create branch from main
2. Run: npx markdownlint-cli2 --fix "<target-dir>/**/*.md"
   (or: npm run lint:md:fix with a scoped glob)
3. Run: npm run lint:md -- "<target-dir>/**/*.md"
   Inspect remaining violations
4. Manually fix MD040, MD036, MD024 violations file by file
5. Re-run: npm run lint:md -- "<target-dir>/**/*.md"
   Confirm output shows 0 violations
6. Commit all changed markdown files in one commit
7. Open PR, verify markdown-lint CI job passes on the PR
8. Merge PR
```

### plans/done/ split rationale

`plans/done/` contains 5,271 violations. Splitting by date range produces
three reviewable PRs:

| Phase | Target                                             | Approx violations |
| ----- | -------------------------------------------------- | ----------------- |
| 8     | `plans/done/2024-**/` (all 2024 subdirs)           | ~1,700            |
| 9     | `plans/done/2026-01**/` to `plans/done/2026-03**/` | ~1,800            |
| 10    | `plans/done/2026-04**/` to `plans/done/2026-05**/` | ~1,771            |

---

## Phase 11: Activate CI Gate

**Branch:** `ci/enforce-markdown-gate`

**File:** `.github/workflows/kameravue-ci.yml`

### Updated `needs` list

```yaml
ci-summary:
  name: Kameravue CI Summary
  runs-on: ubuntu-latest
  needs:
    [
      frontend-lint,
      frontend-tests,
      frontend-build,
      backend-tests,
      api-tests,
      markdown-lint,
    ]
  if: always()
```

### Updated failure-condition shell script

The `Check all jobs status` step currently ends with:

```bash
if [[ "${{ needs.frontend-lint.result }}" != "success" ]] || \
   [[ "${{ needs.frontend-tests.result }}" != "success" ]] || \
   [[ "${{ needs.frontend-build.result }}" != "success" ]] || \
   [[ "${{ needs.backend-tests.result }}" != "success" ]] || \
   [[ "${{ needs.api-tests.result }}" != "success" ]]; then
```

The updated condition adds the `markdown-lint` check:

```bash
if [[ "${{ needs.frontend-lint.result }}" != "success" ]] || \
   [[ "${{ needs.frontend-tests.result }}" != "success" ]] || \
   [[ "${{ needs.frontend-build.result }}" != "success" ]] || \
   [[ "${{ needs.backend-tests.result }}" != "success" ]] || \
   [[ "${{ needs.api-tests.result }}" != "success" ]] || \
   [[ "${{ needs.markdown-lint.result }}" != "success" ]]; then
```

Since the `markdown-lint` job runs unconditionally, its result will always be
`success` or `failure` — never `skipped`. The condition therefore uses `!=
"success"` (not `!= "success" && != "skipped"`).

### Echo lines

Both the failure block and the success block in the step gain a new line:

```bash
echo "- Markdown Lint: ${{ needs.markdown-lint.result }}"
```

### Updated ASCII diagram

The top comment block of the workflow file contains an ASCII diagram of the job
graph. It is updated to include `markdown-lint` as a sixth parallel box
alongside `frontend-lint`, `frontend-tests`, `backend-tests`, `api-tests`, and
`frontend-build`.

---

## Integration Points

```text
Developer workstation                    GitHub Actions
       |                                      |
  git commit                         push / PR trigger
       |                                      |
  lint-staged (Phase 2)              kameravue-ci.yml
       |                                      |
  [**/*.md]                          markdown-lint job (Phase 3)
  npx prettier --write                      |
  markdownlint-cli2 --fix            npm ci
       |                             npm run lint:md
  commit recorded                           |
  (or aborted if                     pass / fail
   unfixable violations)                    |
                                     ci-summary job (Phase 11)
                                     (needs: [..., markdown-lint])
                                           |
                                     PR can merge / blocked
```

---

## Verification Approach

### Script verification (Phase 1)

```bash
# Verify scripts resolve without error on a clean tree
npm run lint:md:fix
npm run format:md:check
npm run format:md
```

### lint-staged verification (Phase 2)

```bash
# Stage a markdown file outside apps/kameravue-fe/ and verify both tools run
echo "" >> docs/test-lint-staged.md
git add docs/test-lint-staged.md
git stash
```

Confirm that the lint-staged output shows both `prettier` and
`markdownlint-cli2` running on the staged file.

### Violation fix verification (Phases 4-10)

```bash
# After auto-fix and manual fixes, run lint scoped to the target directory
npx markdownlint-cli2 "<target-dir>/**/*.md"
# Expected: no output (zero violations)
```

### YAML syntax check (Phases 3 and 11)

GitHub Actions parses the YAML when a push triggers the workflow. The first
push on the feature branch verifies syntax. Optionally, `actionlint` can be
run locally:

```bash
# Optional local check — not a required step
brew install actionlint
actionlint .github/workflows/kameravue-ci.yml
```
