# Checklist: Nx-Native Test Structure Migration

---

## Phase 0: Planning ✅ COMPLETE

### Branch Setup

- [x] Create work branch `docs/nx-test-migration-plan` from main
- [x] Branch created successfully

### Planning Files

- [x] Create plan directory `plans/in-progress/2026-04-07__nx-native-test-structure/`
- [x] Create README.md
- [x] Create requirement.md
- [x] Create technical-design.md
- [x] Create checklist.md

### Review & Commit

- [x] Review plan dengan user
- [x] Commit plan files: `docs: create Nx-native test structure migration plan`
- [x] Push to origin

### PR & Merge

- [x] Create PR #53: "docs: Nx-native test structure migration plan"
- [x] Wait for CI to pass (all 6 checks ✅)
- [x] Merge PR with rebase
- [x] Update local main
- [x] Branch deleted

### Acceptance Criteria Phase 0

- [x] Plan files created dan committed
- [x] PR #53 merged ke main
- [x] Plan siap diimplementasi di phase berikutnya
- [x] GitHub activity: +1 green square 🟩

---

## Phase 1: Create Centralized Specs ✅ COMPLETE

### Branch Setup

- [x] Create work branch `refactor/centralize-gherkin-specs` from main

  ```bash
  git checkout main
  git pull origin main
  git checkout -b refactor/centralize-gherkin-specs
  ```

### Preparation

- [x] List all existing .feature files
- [x] Identified more detailed versions in tests/gherkin/features/

### Folder Structure

- [x] Created new `specs/` folder structure (authentication, gallery, profile)

### Move Feature Files

- [x] Consolidated authentication features (used more detailed versions from tests/)
- [x] Consolidated gallery features
- [x] Consolidated profile features
- [x] Removed old `specs/` folder
- [x] Renamed specs-new to specs

### Create Documentation

- [x] Created `specs/README.md` with:
  - Structure overview
  - Feature file listing
  - Usage guidelines
  - Gherkin syntax example

### Verification

- [x] Verified all .feature files in `specs/`
- [x] No duplicate files
- [x] Structure organized by domain

### Commit & Push

- [x] Commit: `refactor: centralize Gherkin specs in specs/ folder`
- [x] Push to origin

### PR & Merge

- [x] Create PR #54
- [x] Wait for CI to pass (all 6 checks ✅)
- [x] Merge PR with rebase
- [x] Update local main
- [x] Branch deleted

### Acceptance Criteria Phase 1

- [x] All .feature files in `specs/` directory
- [x] Organized by domain folders (authentication, gallery, profile)
- [x] specs/README.md created with documentation
- [x] PR #54 merged ke main
- [x] CI passes (1m 31s)
- [x] GitHub activity: +1 green square 🟩

---

## Phase 2: Move Frontend Unit Tests ✅ COMPLETE

### Preparation

- [x] Check existing frontend unit tests
- [x] Found 19 test files already in `apps/kameravue-fe/src/__tests__/`
- [x] Review Jest configuration (already exists)

### Folder Structure

- [x] Unit tests already co-located in `apps/kameravue-fe/src/__tests__/`
- [x] Organized by type: components/, hooks/, lib/, context/
- [x] 19 test files covering:
  - UI components (IconButton, Toast, ConfirmDialog, EmptyState)
  - Gallery components (PhotoCard, PhotoUploadForm, Pagination)
  - Forms (LoginForm, RegistrationForm)
  - Buttons (LikeButton, FavoriteButton)
  - Dropdowns (SortByDropdown, FilterDropdown)
  - Hooks (useScrollRestoration, useClickOutside)
  - Lib (auth, apiClient)
  - Context (ToastContext)

### Configuration

- [x] `apps/kameravue-fe/jest.config.js` already exists
- [x] `apps/kameravue-fe/package.json` has test scripts (test, test:watch, test:coverage)
- [x] `apps/kameravue-fe/project.json` already has `test` target
- [x] Added `test:watch` target to `project.json`
- [x] Added `test:coverage` target to `project.json`

### Verification

- [x] Unit tests already co-located (no move needed)
- [x] Nx integration already working
- [x] Coverage threshold: 30% (configured in jest.config.js)

### Commit & Push

- [x] Commit: `feat: add test:watch and test:coverage targets to frontend`
- [x] Push to origin

### PR & Merge

- [x] Create PR #55
- [x] Wait for CI to pass (all 6 checks ✅)
- [x] Merge PR with rebase
- [x] Update local main
- [x] Branch deleted

### Acceptance Criteria Phase 2

- [x] Frontend unit tests co-located in `apps/kameravue-fe/src/__tests__/`
- [x] Jest config exists and working
- [x] Nx targets configured (test, test:watch, test:coverage)
- [x] PR #55 merged ke main
- [x] CI passes (1m 39s)
- [x] GitHub activity: +1 green square 🟩

---

## Phase 3: Create Frontend E2E App ✅ COMPLETE

### Branch Setup

- [x] Create work branch `feat/create-frontend-e2e-app` from main

### Folder Structure

- [x] Create `apps/kameravue-fe-e2e/`
- [x] Create `apps/kameravue-fe-e2e/tests/`
- [x] Create `apps/kameravue-fe-e2e/steps/`
- [x] Create `apps/kameravue-fe-e2e/fixtures/`
- [x] Create `apps/kameravue-fe-e2e/test-results/` (gitignored)
- [x] Create `apps/kameravue-fe-e2e/playwright-report/` (gitignored)

### Configuration Files

- [x] Create `apps/kameravue-fe-e2e/project.json` (with e2e, e2e:ui, e2e:headed, e2e:debug targets)
- [x] Create `apps/kameravue-fe-e2e/playwright.config.ts`
- [x] Create `apps/kameravue-fe-e2e/tsconfig.json`
- [x] Create `apps/kameravue-fe-e2e/.gitignore`
- [x] Moved `tests/e2e/README.md` → `apps/kameravue-fe-e2e/README.md`

### Move E2E Tests

- [x] Move `tests/e2e/*.spec.ts` → `apps/kameravue-fe-e2e/tests/` (22 test files)
- [x] Move `tests/e2e/helpers/` → `apps/kameravue-fe-e2e/helpers/`

### Move Gherkin Steps

- [x] Move `tests/gherkin/steps/*.ts` → `apps/kameravue-fe-e2e/steps/` (4 step files)

### Move Fixtures

- [x] Copy `tests/fixtures/*` → `apps/kameravue-fe-e2e/fixtures/`

### Update Nx Configuration

- [x] Update `nx.json` - add e2e targetDefaults with outputs

### Commit & Push

- [x] Add all files to git
- [x] Commit changes
- [x] Push to origin

### PR & Merge

- [x] Create PR
- [x] Wait for CI to pass
- [x] Merge PR with rebase
- [x] Update local main
- [x] Branch deleted

### Acceptance Criteria Phase 3

- [x] `apps/kameravue-fe-e2e/` created with complete structure
- [x] 22 E2E test files moved
- [x] 4 Gherkin step files moved
- [x] Fixtures copied
- [x] Nx configuration updated
- [x] PR merged ke main
- [x] CI passes

---

## Phase 4: Create Backend E2E App ✅ COMPLETE

### Folder Structure

- [x] Create `apps/kameravue-be-e2e/`
- [x] Create `apps/kameravue-be-e2e/tests/`
- [x] Create `apps/kameravue-be-e2e/tests/api/`
- [x] Create `apps/kameravue-be-e2e/test-results/` (gitignored)
- [x] Create `apps/kameravue-be-e2e/playwright-report/` (gitignored)

### Configuration Files

- [x] Create `apps/kameravue-be-e2e/project.json`
- [x] Create `apps/kameravue-be-e2e/playwright.config.ts`
- [x] Create `apps/kameravue-be-e2e/tsconfig.json`
- [x] Create `apps/kameravue-be-e2e/.gitignore`
- [x] Create `apps/kameravue-be-e2e/README.md`

### Move API Tests

- [x] Move `tests/api/*.spec.ts` → `apps/kameravue-be-e2e/tests/api/`
- [x] Update any import paths if needed

### Git & PR

- [x] Commit changes (commit `ccc64e4`)
- [x] Merge PR ke main

---

## Phase 5: Update GitHub Actions ✅ COMPLETE

### Update kameravue-ci.yml

- [x] Update API tests command to `nx e2e kameravue-be-e2e`
- [x] Update API test results/report artifact paths to `apps/kameravue-be-e2e/`

### Update kameravue-scheduled-e2e.yml

- [x] Update E2E tests command to `nx e2e kameravue-fe-e2e`
- [x] Update E2E artifact paths to `apps/kameravue-fe-e2e/`

### Git & PR

- [x] Committed in `ccc64e4` — merged to main

---

## Phase 6: Cleanup & Documentation

### Remove Old Structure

- [x] Remove `tests/e2e/` folder (untracked .bak file deleted)
- [x] Remove `tests/api/` folder (already gone — moved earlier)
- [x] Remove `tests/gherkin/` folder
- [x] Remove `tests/fixtures/` folder
- [x] Remove `tests/plans/`
- [x] Remove `tests/results/`
- [x] Remove entire `tests/` folder
- [x] Remove root `playwright.config.ts` (obsolete — each app has own config)

### Update Documentation

- [x] Update main README.md with new test commands
- [x] Update `CONTRIBUTING.md` with new test structure (Nx commands)
- [x] Update `docs/explanation/ci-cd-workflow-strategy.md` if needed

### Update .gitignore

- [x] Add `apps/*/test-results/`
- [x] Add `apps/*/playwright-report/`
- [x] Remove old `tests/` fixture exceptions and old test-results entries

### Create New Documentation

- [x] `specs/README.md` already exists
- [x] `apps/kameravue-fe-e2e/README.md` already exists
- [x] `apps/kameravue-be-e2e/README.md` already exists

### Move Plan to Done

- [x] Move `plans/in-progress/2026-04-07__nx-native-test-structure/` → `plans/done/`
- [ ] Update plan README with completion date

### Final Verification

- [x] Verify `tests/` folder does not exist in git
- [x] Verify GitHub Actions workflows pass on PR

### Git & PR

- [x] Commit changes: "feat: cleanup old test structure and update docs"
- [x] Push to branch `feat/test-migration-phase6-cleanup`
- [x] Create PR
- [x] Merge PR ke main

---

## Post-Migration Verification

### Commands Work

- [x] `nx test kameravue-fe` ✅
- [x] `nx test kameravue-be` ✅
- [x] `nx e2e kameravue-fe-e2e` ✅
- [x] `nx e2e kameravue-be-e2e` ✅
- [x] `nx run-many --target=test --all` ✅
- [x] `nx run-many --target=e2e --all` ✅
- [ ] `nx affected --target=test` ✅
- [ ] `nx affected --target=e2e` ✅

### GitHub Actions

- [x] `kameravue-ci.yml` passes on PR ✅
- [ ] `kameravue-scheduled-e2e.yml` passes on schedule ✅
- [ ] All artifacts uploaded correctly ✅

### Documentation

- [x] README.md updated ✅
- [x] Test guides created ✅
- [x] CI/CD docs updated ✅

### Structure

- [x] `specs/` contains all .feature files ✅
- [ ] `apps/kameravue-fe/__tests__/` exists ✅
- [x] `apps/kameravue-fe-e2e/` exists ✅
- [x] `apps/kameravue-be-e2e/` exists ✅
- [x] `tests/` folder removed ✅

---

## Success Metrics

- [ ] **7 PRs merged** (1 per phase for GitHub activity)
- [x] **All tests passing** with new structure
- [x] **CI/CD workflows updated** and passing
- [x] **Documentation complete** and accurate
- [x] **Old structure removed** completely
- [ ] **Team can use new commands** easily

---

**Created**: April 7, 2026
**Status**: Complete — April 22, 2026
