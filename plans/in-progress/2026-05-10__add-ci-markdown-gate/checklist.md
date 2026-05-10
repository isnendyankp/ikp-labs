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

- [x] Create branch `config/fix-lint-staged-markdown` from `main`
- [x] Change `"apps/kameravue-fe/**/*.{json,md,css}"` → `"apps/kameravue-fe/**/*.{json,css}"`
- [x] Update `"**/*.md"` to run prettier then markdownlint
- [x] Verify no duplicate/conflicting globs

### Validation

- [x] `package.json` valid JSON ✅
- [ ] Verify lint-staged runs both tools on staged `.md` outside `apps/kameravue-fe/` (verified via CI)

### Git and PR

- [x] Stage `package.json` + checklist
- [ ] Commit: `fix(lint-staged): run prettier and markdownlint on all staged md files`
- [ ] Push branch: `git push -u origin config/fix-lint-staged-markdown`
- [ ] Open PR targeting `main`
- [ ] Verify CI passes on the PR
- [ ] Merge PR

---

## Phase 3 — CI Markdown Job (observe)

**Branch:** `ci/add-markdown-lint-job`
**File:** `.github/workflows/kameravue-ci.yml`

### Implementation

- [x] Create branch `ci/add-markdown-lint-job` from `main`
- [x] Insert section comment header + add `markdown-lint` job (checkout → setup-node → npm ci → lint:md)
- [x] Confirm job placed between `api-tests` and `ci-summary`
- [x] Confirm `ci-summary` `needs` NOT modified (observe mode)

### Validation

- [x] `markdown-lint` job exists at line 359 ✅
- [x] `ci-summary` `needs` still lists original 5 jobs ✅
- [x] YAML 2-space indentation ✅

### Git and PR

- [x] Stage `kameravue-ci.yml` + checklist
- [ ] Commit: `ci(markdown): add markdown-lint job in observe mode`
- [ ] Push branch: `git push -u origin ci/add-markdown-lint-job`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` job appears in GitHub Actions check list
- [ ] Verify `ci-summary` passes regardless of `markdown-lint` result
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
