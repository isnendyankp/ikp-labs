# Checklist — Add CI Markdown Gate

---

## Phase 1 — Markdown Scripts

**Branch:** `config/add-markdown-scripts`
**File:** `package.json` (root)

### Implementation

- [x] Create branch `config/add-markdown-scripts` from `main`
- [x] Add `lint:md:fix` script immediately after `lint:md`
- [x] Add `format:md` script
- [x] Add `format:md:check` script
- [x] Verify `prettier` is available (v3.8.1 ✅)

### Validation

- [x] `npm run lint:md:fix` — jalan, auto-fix violations ✅
- [x] `npm run format:md:check` — jalan, detect 147 files ✅
- [x] `npm run format:md` — jalan, exits 0 ✅
- [x] `package.json` valid JSON ✅
- [x] Scripts lama (`lint:md`, `lint`, `build`, `test`) tidak berubah ✅

### Git and PR

- [x] Stage only `package.json` + checklist
- [ ] Commit: `feat(scripts): add lint:md:fix, format:md, format:md:check scripts`
- [ ] Push branch: `git push -u origin config/add-markdown-scripts`
- [ ] Open PR targeting `main`
- [ ] Verify CI passes on the PR
- [ ] Merge PR

---

## Phase 2 — Fix lint-staged Coverage

**Branch:** `config/fix-lint-staged-markdown`
**File:** `package.json` (root)

### Implementation

- [ ] Create branch `config/fix-lint-staged-markdown` from `main` (after Phase 1
      is merged)
- [ ] Change the `"apps/kameravue-fe/**/*.{json,md,css}"` glob to
      `"apps/kameravue-fe/**/*.{json,css}"` — remove `md` from this pattern

- [ ] Update the `"**/*.md"` entry to run prettier before markdownlint:

  ```json
  "**/*.md": [
    "npx prettier --write",
    "markdownlint-cli2 --fix"
  ]
  ```

- [ ] Verify no duplicate or conflicting globs exist in `lint-staged` after the
      change

### Validation

- [ ] Stage a markdown file outside `apps/kameravue-fe/` (e.g., add a trailing
      space to any line in `docs/` or `plans/`) and run `git commit`
- [ ] Confirm lint-staged output shows both `prettier` and `markdownlint-cli2`
      running on the staged file
- [ ] Stage a markdown file inside `apps/kameravue-fe/` and run `git commit`
- [ ] Confirm lint-staged does NOT run prettier twice on the same file
- [ ] Confirm `package.json` is valid JSON (no trailing comma, no syntax error)

### Git and PR

- [ ] Stage only the changed file: `git add package.json`
- [ ] Commit with conventional commit message:

  ```text
  fix(lint-staged): run prettier and markdownlint on all staged md files
  ```

- [ ] Push branch: `git push -u origin config/fix-lint-staged-markdown`
- [ ] Open PR targeting `main`
- [ ] Verify CI passes on the PR
- [ ] Merge PR

---

## Phase 3 — CI Markdown Job (observe)

**Branch:** `ci/add-markdown-lint-job`
**File:** `.github/workflows/kameravue-ci.yml`

### Implementation

- [ ] Create branch `ci/add-markdown-lint-job` from `main` (after Phase 2 is
      merged)
- [ ] Insert the section comment header before `ci-summary`:

  ```yaml
  # ===========================================
  # Markdown Lint (markdownlint-cli2)
  # ===========================================
  ```

- [ ] Add the `markdown-lint` job with the following structure:
  - `name: Markdown Lint`
  - `runs-on: ubuntu-latest`
  - Step 1: `actions/checkout@v4` (name: "Checkout repository")
  - Step 2: `actions/setup-node@v4` with `node-version: ${{ env.NODE_VERSION }}`
    and `cache: 'npm'` (name: "Setup Node.js")
  - Step 3: `run: npm ci` (name: "Install dependencies")
  - Step 4: `run: npm run lint:md` (name: "Run markdown lint")

- [ ] Confirm the job is placed between the `api-tests` job and the `ci-summary`
      job in the file
- [ ] Confirm the `ci-summary` job `needs` list is NOT modified in this phase

### Validation

- [ ] Inspect the YAML file and confirm `markdown-lint` job exists with the
      correct steps
- [ ] Confirm `ci-summary` `needs` still lists only the original 5 jobs
- [ ] Verify YAML indentation is 2-space throughout the new block (no tabs)

### Git and PR

- [ ] Stage only the changed file:
      `git add .github/workflows/kameravue-ci.yml`
- [ ] Commit with conventional commit message:

  ```text
  ci(markdown): add markdown-lint job in observe mode
  ```

- [ ] Push branch: `git push -u origin ci/add-markdown-lint-job`
- [ ] Open PR targeting `main`
- [ ] Verify the `markdown-lint` job appears in the GitHub Actions check list
- [ ] Verify `ci-summary` passes regardless of the `markdown-lint` result
      (not yet gating)
- [ ] Merge PR

---

## Phase 4 — Activate CI Gate (hard gate)

**Branch:** `ci/enforce-markdown-gate`
**File:** `.github/workflows/kameravue-ci.yml`

### Implementation

- [ ] Create branch `ci/enforce-markdown-gate` from `main` (after Phase 3 is
      merged)
- [ ] Add `markdown-lint` to the `ci-summary` `needs` list:

  ```yaml
  needs:
    [
      frontend-lint,
      frontend-tests,
      frontend-build,
      backend-tests,
      api-tests,
      markdown-lint,
    ]
  ```

- [ ] Add `markdown-lint` result check to the failure condition in the
      `Check all jobs status` step:

  ```bash
  [[ "${{ needs.markdown-lint.result }}" != "success" ]]
  ```

- [ ] Add `markdown-lint` result echo line inside the failure block:

  ```bash
  echo "- Markdown Lint: ${{ needs.markdown-lint.result }}"
  ```

- [ ] Add `markdown-lint` result echo line inside the success block:

  ```bash
  echo "- Markdown Lint: ${{ needs.markdown-lint.result }}"
  ```

- [ ] Update the ASCII diagram in the top comment block of the workflow file to
      include `markdown-lint` as a sixth parallel box alongside `frontend-lint`,
      `frontend-tests`, `backend-tests`, `api-tests`, and `frontend-build`

### Validation

- [ ] Inspect the YAML file and confirm:
  - `ci-summary` `needs` includes `markdown-lint`
  - `ci-summary` shell script checks `needs.markdown-lint.result`
  - Both the success and failure echo blocks include the markdown-lint line
  - The ASCII diagram shows `markdown-lint`
- [ ] Verify YAML indentation is 2-space throughout the modified blocks (no tabs)
- [ ] Run `npm run lint:fe` — confirm no new ESLint errors introduced
- [ ] Run `npm run typecheck` — confirm no new TypeScript errors introduced

### Git and PR

- [ ] Stage only the changed file:
      `git add .github/workflows/kameravue-ci.yml`
- [ ] Commit with conventional commit message:

  ```text
  ci(markdown): activate markdown-lint as hard CI gate
  ```

- [ ] Push branch: `git push -u origin ci/enforce-markdown-gate`
- [ ] Open PR targeting `main`
- [ ] Verify all six CI jobs appear in the PR check list on GitHub
- [ ] Verify `ci-summary` shows green after all jobs pass
- [ ] Merge PR

---

## Quality Gates (all phases)

- [ ] YAML file has correct indentation (2-space, no tabs) — Phases 3 and 4
- [ ] `package.json` is valid JSON (no trailing comma, no syntax error) — Phases 1 and 2
- [ ] Existing scripts (`lint:md`, `lint`, `build`, `test`) are unchanged — Phase 1
- [ ] No new ESLint errors introduced (`npm run lint:fe` passes) — Phase 4
- [ ] No new TypeScript errors introduced (`npm run typecheck` passes) — Phase 4
- [ ] All CI jobs continue to pass after each phase is merged
