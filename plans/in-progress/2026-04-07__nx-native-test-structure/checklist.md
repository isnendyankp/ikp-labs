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

## Phase 1: Create Centralized Specs

### Branch Setup
- [ ] Create work branch `refactor/centralize-gherkin-specs` from main
  ```bash
  git checkout main
  git pull origin main
  git checkout -b refactor/centralize-gherkin-specs
  ```

### Preparation
- [ ] Backup current `tests/` and `specs/` folders (optional, git has history)
- [ ] List all existing .feature files:
  ```bash
  find tests/gherkin/features specs -name "*.feature" -type f
  ```

### Folder Structure
- [ ] Create new `specs/` folder structure:
  ```bash
  mkdir -p specs/authentication
  mkdir -p specs/gallery
  mkdir -p specs/profile
  ```

### Move Feature Files
- [ ] Move authentication features:
  ```bash
  git mv tests/gherkin/features/login.feature specs/authentication/
  git mv tests/gherkin/features/registration.feature specs/authentication/
  # Consolidate old specs if exist
  ```
- [ ] Move gallery features:
  ```bash
  git mv tests/gherkin/features/photo-sorting.feature specs/gallery/
  # Move other gallery features from old specs/
  ```
- [ ] Move profile features:
  ```bash
  # Move profile features from old specs/
  ```
- [ ] Remove old `specs/` folder if it exists (after consolidation)

### Create Documentation
- [ ] Create `specs/README.md`:
  ```markdown
  # Gherkin Specifications
  
  Centralized Gherkin feature files (source of truth) for IKP-Labs.
  
  ## Structure
  - `authentication/` - Login, registration, auth flows
  - `gallery/` - Photo upload, management, likes, privacy
  - `profile/` - User profile features
  
  ## Usage
  These specs are imported by:
  - `apps/kameravue-fe-e2e/steps/` - Frontend E2E step definitions
  - Future test implementations
  ```

### Verification
- [ ] Verify all .feature files in new `specs/`:
  ```bash
  ls -R specs/
  ```
- [ ] Check no duplicate files
- [ ] Verify old locations are empty

### Commit & Push
- [ ] Commit changes:
  ```bash
  git add specs/
  git commit -m "refactor: centralize Gherkin specs in specs/ folder

  - Move all .feature files to centralized specs/ directory
  - Organize by domain: authentication, gallery, profile
  - Create specs/README.md documenting structure
  - Consolidate old specs/ with tests/gherkin/features/
  
  This prepares for Nx-native test structure where specs are
  separated from test implementations.
  "
  ```
- [ ] Push to origin:
  ```bash
  git push origin refactor/centralize-gherkin-specs
  ```

### PR & Merge
- [ ] Create PR:
  ```bash
  gh pr create --title "refactor: centralize Gherkin specs in specs/ folder" \
    --body "Phase 1: Centralize Gherkin specifications

  ## Changes
  - Moved all .feature files to \`specs/\` directory
  - Organized by domain: authentication, gallery, profile
  - Created specs/README.md
  - Consolidated old specs/ with tests/gherkin/features/

  ## Structure
  \`\`\`
  specs/
  ├── authentication/
  │   ├── login.feature
  │   ├── registration.feature
  │   └── home-page.feature
  ├── gallery/
  │   ├── photo-upload.feature
  │   ├── photo-management.feature
  │   ├── photo-likes.feature
  │   ├── photo-privacy.feature
  │   └── photo-sorting.feature
  └── profile/
      └── profile-picture.feature
  \`\`\`

  ## Next Steps
  - Phase 2: Move frontend unit tests to apps/kameravue-fe/__tests__/
  - Phase 3: Create apps/kameravue-fe-e2e/
  "
  ```
- [ ] Wait for CI to pass (all 6 checks)
- [ ] Merge PR with rebase:
  ```bash
  gh pr merge --rebase --delete-branch
  ```
- [ ] Update local main:
  ```bash
  git checkout main
  git pull origin main
  ```

### Acceptance Criteria Phase 1
- [ ] All .feature files in `specs/` directory
- [ ] Organized by domain folders
- [ ] specs/README.md created
- [ ] PR merged ke main
- [ ] CI passes

---

## Phase 2: Move Frontend Unit Tests

### Preparation
- [ ] Check existing frontend unit tests (if any)
- [ ] Review Jest configuration

### Folder Structure
- [ ] Create `apps/kameravue-fe/__tests__/`
- [ ] Create `apps/kameravue-fe/__tests__/components/`
- [ ] Create `apps/kameravue-fe/__tests__/utils/`

### Configuration
- [ ] Create/update `apps/kameravue-fe/jest.config.js`
- [ ] Update `apps/kameravue-fe/package.json` with test scripts
- [ ] Update `apps/kameravue-fe/project.json` with `test` target
- [ ] Update `apps/kameravue-fe/project.json` with `test:watch` target
- [ ] Update `apps/kameravue-fe/project.json` with `test:coverage` target

### Move Tests (if exist)
- [ ] Move existing unit tests to `__tests__/`
- [ ] Update import paths in test files

### Verification
- [ ] Run `nx test kameravue-fe`
- [ ] Verify tests pass
- [ ] Verify coverage report generated in `apps/kameravue-fe/coverage/`
- [ ] Check Jest output is readable

### Git & PR
- [ ] Commit changes: "feat: add frontend unit test structure with Nx integration"
- [ ] Push to branch `feat/test-migration-phase2-frontend-unit-tests`
- [ ] Create PR
- [ ] Merge PR ke main

---

## Phase 3: Create Frontend E2E App

### Folder Structure
- [ ] Create `apps/kameravue-fe-e2e/`
- [ ] Create `apps/kameravue-fe-e2e/tests/`
- [ ] Create `apps/kameravue-fe-e2e/steps/`
- [ ] Create `apps/kameravue-fe-e2e/fixtures/`
- [ ] Create `apps/kameravue-fe-e2e/test-results/` (gitignored)
- [ ] Create `apps/kameravue-fe-e2e/playwright-report/` (gitignored)

### Configuration Files
- [ ] Create `apps/kameravue-fe-e2e/project.json`
- [ ] Create `apps/kameravue-fe-e2e/playwright.config.ts`
- [ ] Create `apps/kameravue-fe-e2e/tsconfig.json`
- [ ] Create `apps/kameravue-fe-e2e/.gitignore`
- [ ] Create `apps/kameravue-fe-e2e/README.md`

### Move E2E Tests
- [ ] Move `tests/e2e/*.spec.ts` → `apps/kameravue-fe-e2e/tests/`
- [ ] Move `tests/e2e/demo-*` (if needed)
- [ ] Move `tests/e2e/helpers/` (if exists)

### Move Gherkin Steps
- [ ] Move `tests/gherkin/steps/login.steps.ts` → `apps/kameravue-fe-e2e/steps/`
- [ ] Move `tests/gherkin/steps/registration.steps.ts` → `apps/kameravue-fe-e2e/steps/`
- [ ] Move `tests/gherkin/steps/photo-sorting.steps.ts` → `apps/kameravue-fe-e2e/steps/`
- [ ] Move other step files

### Move Fixtures
- [ ] Move `tests/fixtures/*` → `apps/kameravue-fe-e2e/fixtures/`

### Update Import Paths
- [ ] Update step files to import from `../../../../specs/`
- [ ] Update test files if they reference fixtures
- [ ] Update any relative paths

### Verification
- [ ] Run `nx e2e kameravue-fe-e2e` (may fail if servers not running)
- [ ] Start backend: `nx serve kameravue-be`
- [ ] Start frontend: `nx dev kameravue-fe`
- [ ] Run `nx e2e kameravue-fe-e2e` again
- [ ] Verify all E2E tests pass
- [ ] Check test artifacts in `apps/kameravue-fe-e2e/test-results/`
- [ ] Check HTML report in `apps/kameravue-fe-e2e/playwright-report/`

### Git & PR
- [ ] Commit changes: "feat: create kameravue-fe-e2e app for frontend E2E tests"
- [ ] Push to branch `feat/test-migration-phase3-frontend-e2e-app`
- [ ] Create PR
- [ ] Merge PR ke main

---

## Phase 4: Create Backend E2E App

### Folder Structure
- [ ] Create `apps/kameravue-be-e2e/`
- [ ] Create `apps/kameravue-be-e2e/tests/`
- [ ] Create `apps/kameravue-be-e2e/tests/api/`
- [ ] Create `apps/kameravue-be-e2e/test-results/` (gitignored)
- [ ] Create `apps/kameravue-be-e2e/playwright-report/` (gitignored)

### Configuration Files
- [ ] Create `apps/kameravue-be-e2e/project.json`
- [ ] Create `apps/kameravue-be-e2e/playwright.config.ts`
- [ ] Create `apps/kameravue-be-e2e/tsconfig.json`
- [ ] Create `apps/kameravue-be-e2e/.gitignore`
- [ ] Create `apps/kameravue-be-e2e/README.md`

### Move API Tests
- [ ] Move `tests/api/*.spec.ts` → `apps/kameravue-be-e2e/tests/api/`
- [ ] Update any import paths if needed

### Verification
- [ ] Start backend: `nx serve kameravue-be`
- [ ] Run `nx e2e kameravue-be-e2e`
- [ ] Verify all API tests pass
- [ ] Check test artifacts in `apps/kameravue-be-e2e/test-results/`

### Git & PR
- [ ] Commit changes: "feat: create kameravue-be-e2e app for backend API tests"
- [ ] Push to branch `feat/test-migration-phase4-backend-e2e-app`
- [ ] Create PR
- [ ] Merge PR ke main

---

## Phase 5: Update GitHub Actions

### Update kameravue-ci.yml
- [ ] Update frontend unit tests command to `nx test kameravue-fe`
- [ ] Update backend unit tests command (keep as is: `nx test kameravue-be`)
- [ ] Update API tests command to `nx e2e kameravue-be-e2e`
- [ ] Update frontend coverage artifact path to `apps/kameravue-fe/coverage/`
- [ ] Update API test results artifact path to `apps/kameravue-be-e2e/test-results/`
- [ ] Update API test report artifact path to `apps/kameravue-be-e2e/playwright-report/`

### Update kameravue-scheduled-e2e.yml
- [ ] Update E2E tests command to `nx e2e kameravue-fe-e2e`
- [ ] Update E2E test results artifact path to `apps/kameravue-fe-e2e/test-results/`
- [ ] Update E2E report artifact path to `apps/kameravue-fe-e2e/playwright-report/`

### Update Documentation References
- [ ] Update workflow comments if needed
- [ ] Update CI/CD documentation

### Verification
- [ ] Create test PR to trigger CI
- [ ] Verify `kameravue-ci.yml` workflow passes
- [ ] Verify all jobs complete successfully
- [ ] Check artifacts are uploaded correctly
- [ ] Manually trigger `kameravue-scheduled-e2e.yml` (workflow_dispatch)
- [ ] Verify scheduled E2E workflow passes

### Git & PR
- [ ] Commit changes: "feat: update GitHub Actions to use Nx test commands"
- [ ] Push to branch `feat/test-migration-phase5-update-github-actions`
- [ ] Create PR
- [ ] Verify CI passes on PR
- [ ] Merge PR ke main

---

## Phase 6: Cleanup & Documentation

### Remove Old Structure
- [ ] Remove `tests/e2e/` folder
- [ ] Remove `tests/api/` folder
- [ ] Remove `tests/gherkin/` folder
- [ ] Remove `tests/fixtures/` folder
- [ ] Remove `tests/plans/` (if exists)
- [ ] Remove `tests/results/` (if exists)
- [ ] Remove entire `tests/` folder
- [ ] Remove or update root `playwright.config.ts`

### Update Documentation
- [ ] Update main README.md with new test commands
- [ ] Update `tests/README.md` → move to `apps/kameravue-fe-e2e/README.md`
- [ ] Update `tests/gherkin/README.md` → move to `specs/README.md`
- [ ] Update `docs/explanation/ci-cd-workflow-strategy.md` if needed
- [ ] Update `CONTRIBUTING.md` with new test structure

### Update .gitignore
- [ ] Add `apps/*/test-results/`
- [ ] Add `apps/*/playwright-report/`
- [ ] Add `apps/*/.features-gen/` (if using playwright-bdd)
- [ ] Remove old `test-results/` and `playwright-report/` entries

### Create New Documentation
- [ ] Create `specs/README.md` explaining Gherkin structure
- [ ] Create `apps/kameravue-fe-e2e/README.md` with E2E guide
- [ ] Create `apps/kameravue-be-e2e/README.md` with API test guide

### Move Plan to Done
- [ ] Move `plans/in-progress/2026-04-07__nx-native-test-structure/` → `plans/done/`
- [ ] Update plan README with completion date

### Final Verification
- [ ] Run `nx test kameravue-fe` - passes
- [ ] Run `nx test kameravue-be` - passes
- [ ] Run `nx e2e kameravue-fe-e2e` - passes
- [ ] Run `nx e2e kameravue-be-e2e` - passes
- [ ] Run `nx run-many --target=test --all` - all pass
- [ ] Run `nx run-many --target=e2e --all` - all pass
- [ ] Verify `tests/` folder does not exist
- [ ] Verify GitHub Actions workflows pass

### Git & PR
- [ ] Commit changes: "feat: cleanup old test structure and update documentation"
- [ ] Push to branch `feat/test-migration-phase6-cleanup-docs`
- [ ] Create PR
- [ ] Merge PR ke main

---

## Post-Migration Verification

### Commands Work
- [ ] `nx test kameravue-fe` ✅
- [ ] `nx test kameravue-be` ✅
- [ ] `nx e2e kameravue-fe-e2e` ✅
- [ ] `nx e2e kameravue-be-e2e` ✅
- [ ] `nx run-many --target=test --all` ✅
- [ ] `nx run-many --target=e2e --all` ✅
- [ ] `nx affected --target=test` ✅
- [ ] `nx affected --target=e2e` ✅

### GitHub Actions
- [ ] `kameravue-ci.yml` passes on PR ✅
- [ ] `kameravue-scheduled-e2e.yml` passes on schedule ✅
- [ ] All artifacts uploaded correctly ✅

### Documentation
- [ ] README.md updated ✅
- [ ] Test guides created ✅
- [ ] CI/CD docs updated ✅

### Structure
- [ ] `specs/` contains all .feature files ✅
- [ ] `apps/kameravue-fe/__tests__/` exists ✅
- [ ] `apps/kameravue-fe-e2e/` exists ✅
- [ ] `apps/kameravue-be-e2e/` exists ✅
- [ ] `tests/` folder removed ✅

---

## Success Metrics

- [ ] **7 PRs merged** (1 per phase for GitHub activity)
- [ ] **All tests passing** with new structure
- [ ] **CI/CD workflows updated** and passing
- [ ] **Documentation complete** and accurate
- [ ] **Old structure removed** completely
- [ ] **Team can use new commands** easily

---

**Created**: April 7, 2026
**Status**: Phase 0 - Planning
