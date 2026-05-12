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
- [x] Verify `prettier` is available (v3.8.1)

### Validation

- [x] `npm run lint:md:fix` — runs, auto-fix violations
- [x] `npm run format:md:check` — runs, detect 147 files
- [x] `npm run format:md` — runs, exits 0
- [x] `package.json` valid JSON
- [x] Scripts lama (`lint:md`, `lint`, `build`, `test`) tidak berubah

### Git and PR

- [x] Stage only `package.json` + checklist
- [x] Commit: `feat(scripts): add lint:md:fix, format:md, format:md:check scripts`
- [x] Push branch: `git push -u origin config/add-markdown-scripts`
- [x] Open PR targeting `main`
- [x] Verify CI passes on the PR
- [x] Merge PR (PR #103)

---

## Phase 2 — Fix lint-staged Coverage

**Branch:** `config/fix-lint-staged-markdown`
**File:** `package.json` (root)

### Implementation

- [x] Create branch `config/fix-lint-staged-markdown` from `main`
- [x] Change `"apps/kameravue-fe/**/*.{json,md,css}"` to `"apps/kameravue-fe/**/*.{json,css}"`
- [x] Update `"**/*.md"` to run prettier then markdownlint
- [x] Verify no duplicate/conflicting globs

### Validation

- [x] `package.json` valid JSON
- [x] Verify lint-staged runs both tools on staged `.md` outside `apps/kameravue-fe/` (verified via CI)

### Git and PR

- [x] Stage `package.json` + checklist
- [x] Commit: `fix(lint-staged): run prettier and markdownlint on all staged md files`
- [x] Push branch: `git push -u origin config/fix-lint-staged-markdown`
- [x] Open PR targeting `main`
- [x] Verify CI passes on the PR
- [x] Merge PR (PR #104)

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

- [x] `markdown-lint` job exists in the workflow file
- [x] `ci-summary` `needs` still lists original 5 jobs
- [x] YAML 2-space indentation

### Git and PR

- [x] Stage `kameravue-ci.yml` + checklist
- [x] Commit: `ci(markdown): add markdown-lint job in observe mode`
- [x] Push branch: `git push -u origin ci/add-markdown-lint-job`
- [x] Open PR targeting `main`
- [x] Verify `markdown-lint` job appears in GitHub Actions check list
- [x] Verify `ci-summary` passes regardless of `markdown-lint` result
- [x] Merge PR (PR #105)

---

## Phase 4 — Fix `.claude/skills/` Violations

**Branch:** `docs/fix-md-claude-skills`
**Target:** `.claude/skills/` (345 violations, 37 files)

### Implementation

- [x] Create branch `docs/fix-md-claude-skills` from `main`
- [x] Auto-fix with `markdownlint-cli2 --fix` (296 violations fixed)
- [x] Manually fix 49 remaining: MD040 (add `text` language) + MD036 (bold→h4)
- [x] Verify 0 violations

### Validation

- [x] `markdownlint-cli2 ".claude/skills/**/*.md"` → 0 violations ✅
- [x] No files deleted or renamed

### Git and PR

- [x] Stage `.claude/skills/` + checklist
- [ ] Commit: `docs(markdown): fix all violations in .claude/skills/`
- [ ] Push branch: `git push -u origin docs/fix-md-claude-skills`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR
- [ ] Merge PR

---

## Phase 5 — Fix `.claude/agents/` Violations

**Branch:** `docs/fix-md-claude-agents`
**Target:** `.claude/agents/` (297 violations, 70 files)

### Implementation

- [x] Create branch `docs/fix-md-claude-agents` from `main`
- [x] Auto-fix (blank lines around fences/lists/headings)
- [x] Manually fix 45 remaining MD040 violations (add `text` language)
- [x] Verify 0 violations

### Validation

- [x] `markdownlint-cli2 ".claude/agents/**/*.md"` → 0 violations ✅
- [x] No files deleted or renamed

### Git and PR

- [x] Stage `.claude/agents/` + checklist
- [ ] Commit: `docs(markdown): fix all violations in .claude/agents/`
- [ ] Push branch: `git push -u origin docs/fix-md-claude-agents`
- [ ] Open PR targeting `main`
- [ ] Verify CI passes
- [ ] Merge PR

---

## Phase 6 — Fix `apps/` Markdown Violations

**Branch:** `docs/fix-md-apps`
**Target:** `apps/` (482 violations)

### Implementation

- [ ] Create branch `docs/fix-md-apps` from `main`
- [ ] Run `npx markdownlint-cli2 --fix "apps/**/*.md"` to apply auto-fixes
- [ ] Run `npx markdownlint-cli2 "apps/**/*.md"` and inspect remaining violations
- [ ] Manually fix MD040 violations: add language identifier to fenced code blocks
- [ ] Manually fix MD036 violations: convert emphasis-as-headings to ATX headings
- [ ] Manually fix MD024 violations: resolve duplicate heading text
- [ ] Re-run `npx markdownlint-cli2 "apps/**/*.md"` and confirm zero output

### Validation

- [ ] `npx markdownlint-cli2 "apps/**/*.md"` reports zero violations
- [ ] No markdown files deleted or renamed (content fixes only)

### Git and PR

- [ ] Stage all changed `.md` files under `apps/`
- [ ] Commit: `docs(markdown): fix all violations in apps/`
- [ ] Push branch: `git push -u origin docs/fix-md-apps`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR
- [ ] Merge PR

---

## Phase 7 — Fix Misc Remaining Violations

**Branch:** `docs/fix-md-remaining`
**Target:** All remaining areas outside `.claude/skills/`, `.claude/agents/`, `apps/`, and `plans/done/` (257 violations)

### Implementation

- [ ] Create branch `docs/fix-md-remaining` from `main`
- [ ] Run `npm run lint:md` at repo root and identify which files still have violations after Phases 4-6
- [ ] Run `npx markdownlint-cli2 --fix` on each remaining file or directory
- [ ] Run `npm run lint:md` again and inspect remaining violations outside `plans/done/`
- [ ] Manually fix MD040 violations: add language identifier to fenced code blocks
- [ ] Manually fix MD036 violations: convert emphasis-as-headings to ATX headings
- [ ] Manually fix MD024 violations: resolve duplicate heading text
- [ ] Re-run lint scoped to the affected files and confirm zero output

### Validation

- [ ] All violations outside `.claude/skills/`, `.claude/agents/`, `apps/`, and `plans/done/` are resolved
- [ ] No markdown files deleted or renamed (content fixes only)

### Git and PR

- [ ] Stage all changed `.md` files
- [ ] Commit: `docs(markdown): fix remaining misc violations outside major dirs`
- [ ] Push branch: `git push -u origin docs/fix-md-remaining`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR (only `plans/done/` violations should remain)
- [ ] Merge PR

---

## Phase 8 — Fix `plans/done/` Part 1 (2024 Plans)

**Branch:** `docs/fix-md-plans-done-2024`
**Target:** `plans/done/2024-**/` subdirectories

### Implementation

- [ ] Create branch `docs/fix-md-plans-done-2024` from `main`
- [ ] Run `npx markdownlint-cli2 --fix "plans/done/2024-**/*.md"` to apply auto-fixes
- [ ] Run `npx markdownlint-cli2 "plans/done/2024-**/*.md"` and inspect remaining violations
- [ ] Manually fix MD040 violations: add language identifier to fenced code blocks
- [ ] Manually fix MD036 violations: convert emphasis-as-headings to ATX headings
- [ ] Manually fix MD024 violations: resolve duplicate heading text
- [ ] Re-run `npx markdownlint-cli2 "plans/done/2024-**/*.md"` and confirm zero output

### Validation

- [ ] `npx markdownlint-cli2 "plans/done/2024-**/*.md"` reports zero violations
- [ ] No markdown files deleted or renamed (content fixes only)

### Git and PR

- [ ] Stage all changed `.md` files under `plans/done/2024-**/`
- [ ] Commit: `docs(markdown): fix violations in plans/done 2024 plans`
- [ ] Push branch: `git push -u origin docs/fix-md-plans-done-2024`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR
- [ ] Merge PR

---

## Phase 9 — Fix `plans/done/` Part 2 (Early 2026 Plans, Jan-Mar)

**Branch:** `docs/fix-md-plans-done-2026-early`
**Target:** `plans/done/2026-01**/`, `plans/done/2026-02**/`, `plans/done/2026-03**/`

### Implementation

- [ ] Create branch `docs/fix-md-plans-done-2026-early` from `main`
- [ ] Run `npx markdownlint-cli2 --fix` scoped to Jan-Mar 2026 subdirs under `plans/done/`
- [ ] Run lint scoped to those same subdirs and inspect remaining violations
- [ ] Manually fix MD040 violations: add language identifier to fenced code blocks
- [ ] Manually fix MD036 violations: convert emphasis-as-headings to ATX headings
- [ ] Manually fix MD024 violations: resolve duplicate heading text
- [ ] Re-run lint scoped to those subdirs and confirm zero output

### Validation

- [ ] Lint scoped to Jan-Mar 2026 plan files reports zero violations
- [ ] No markdown files deleted or renamed (content fixes only)

### Git and PR

- [ ] Stage all changed `.md` files under Jan-Mar 2026 `plans/done/` subdirs
- [ ] Commit: `docs(markdown): fix violations in plans/done early 2026 (Jan-Mar)`
- [ ] Push branch: `git push -u origin docs/fix-md-plans-done-2026-early`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR
- [ ] Merge PR

---

## Phase 10 — Fix `plans/done/` Part 3 (Late 2026 Plans, Apr-May)

**Branch:** `docs/fix-md-plans-done-2026-late`
**Target:** `plans/done/2026-04**/`, `plans/done/2026-05**/`

### Implementation

- [ ] Create branch `docs/fix-md-plans-done-2026-late` from `main`
- [ ] Run `npx markdownlint-cli2 --fix` scoped to Apr-May 2026 subdirs under `plans/done/`
- [ ] Run lint scoped to those same subdirs and inspect remaining violations
- [ ] Manually fix MD040 violations: add language identifier to fenced code blocks
- [ ] Manually fix MD036 violations: convert emphasis-as-headings to ATX headings
- [ ] Manually fix MD024 violations: resolve duplicate heading text
- [ ] Re-run lint scoped to those subdirs and confirm zero output
- [ ] Run `npm run lint:md` at the repo root and confirm zero total violations across
      the entire repository

### Validation

- [ ] Lint scoped to Apr-May 2026 plan files reports zero violations
- [ ] `npm run lint:md` at repo root reports zero total violations
- [ ] No markdown files deleted or renamed (content fixes only)

### Git and PR

- [ ] Stage all changed `.md` files under Apr-May 2026 `plans/done/` subdirs
- [ ] Commit: `docs(markdown): fix violations in plans/done late 2026 (Apr-May)`
- [ ] Push branch: `git push -u origin docs/fix-md-plans-done-2026-late`
- [ ] Open PR targeting `main`
- [ ] Verify `markdown-lint` CI job passes on the PR (expect full green)
- [ ] Merge PR

---

## Phase 11 — Activate CI Gate (hard gate)

**Branch:** `ci/enforce-markdown-gate`
**File:** `.github/workflows/kameravue-ci.yml`

### Implementation

- [ ] Create branch `ci/enforce-markdown-gate` from `main` (after Phase 10 is merged)
- [ ] Confirm `npm run lint:md` passes with zero violations on `main` before making
      any changes (prerequisite check)
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
- [ ] Commit: `ci(markdown): activate markdown-lint as hard CI gate`
- [ ] Push branch: `git push -u origin ci/enforce-markdown-gate`
- [ ] Open PR targeting `main`
- [ ] Verify all six CI jobs appear in the PR check list on GitHub
- [ ] Verify `ci-summary` shows green after all jobs pass
- [ ] Merge PR

---

## Quality Gates (all phases)

- [x] `package.json` is valid JSON (no trailing comma, no syntax error) — Phases 1 and 2
- [x] Existing scripts (`lint:md`, `lint`, `build`, `test`) are unchanged — Phase 1
- [x] `markdown-lint` CI job visible in GitHub Actions — Phase 3
- [ ] Each fix phase: `npx markdownlint-cli2` scoped to target dir reports zero violations
- [ ] `npm run lint:md` at repo root reports zero total violations before Phase 11
- [ ] YAML file has correct indentation (2-space, no tabs) — Phase 11
- [ ] No new ESLint errors introduced (`npm run lint:fe` passes) — Phase 11
- [ ] No new TypeScript errors introduced (`npm run typecheck` passes) — Phase 11
- [ ] All CI jobs continue to pass after each phase is merged
