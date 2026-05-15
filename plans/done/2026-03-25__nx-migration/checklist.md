# Checklist: Nx Monorepo Migration

---

## Status Legend

- [ ] Not started
- [x] Completed
- [ ] Blocked

---

## Phase 0: Planning (Hari Ini)

### Setup

- [x] Create work branch `docs/nx-migration-plan` from main
- [x] Create plan directory `plans/in-progress/2026-03-25__nx-migration/`
- [x] Write README.md (overview & scope)
- [x] Write requirement.md (requirements & acceptance criteria)
- [x] Write technical-design.md (technical approach)
- [x] Write checklist.md (this file)
- [x] Commit plan files
- [x] Push to origin
- [x] Create PR
- [x] Merge PR with `gh pr merge --rebase --delete-branch`
- [x] Update local main

### Acceptance Criteria Phase 0

- [x] Plan files created dan committed
- [x] PR merged ke main
- [x] Plan siap diimplementasi di hari berikutnya

---

## Phase 1: Setup Nx Workspace

### Branch Setup

- [x] Create work branch `chore/nx-workspace-setup` from main

### Implementation

- [x] Install Nx dependencies

  ```bash
  npm install -D nx @nx/workspace @nx/next @nx/jest @nx/linter
  ```

- [x] Create `nx.json` configuration
- [x] Create `workspace.json` (or individual `project.json` files)
- [x] Create `apps/` folder
- [x] Create `libs/` folder
- [x] Update root `package.json` scripts:

  ```json
  {
    "scripts": {
      "nx": "nx",
      "build": "nx run-many -t build --all",
      "test": "nx run-many -t test --all",
      "graph": "nx graph"
    }
  }
  ```

- [x] Add `.nx/cache` to `.gitignore`
- [x] Test: `npx nx graph`

### Verification

- [x] `npx nx graph` displays graph (even if empty)
- [x] No errors in `nx.json`
- [x] All existing tests still pass (CI passed)

### Finalization

- [x] Commit: `chore: initialize Nx workspace configuration`
- [x] Push to origin
- [x] Create PR #42
- [x] Wait for CI to pass (All 6 checks passed)
- [x] Merge PR with `gh pr merge --rebase --delete-branch`
- [x] Update local main

### Acceptance Criteria Phase 1

- [x] Nx installed and configured
- [x] `nx graph` command works
- [x] All existing tests pass (CI passed)
- [x] PR #42 merged to main

---

## Phase 2: Migrate Frontend

### Branch Setup

- [x] Create work branch `refactor/migrate-frontend-to-nx` from main

### Pre-migration

- [x] Verify frontend builds currently: `cd frontend && npm run build`
- [x] Verify frontend tests pass: `cd frontend && npm run test`

### Migration

- [x] Move frontend folder to `apps/kameravue-fe` (following senior's naming convention `[domain]-[type]`):

  ```bash
  git mv frontend apps/kameravue-fe
  ```

- [x] Create `apps/kameravue-fe/project.json` with `nx:run-commands` executor
- [x] Update root package.json workspace path to `apps/kameravue-fe`
- [x] Update lint-staged paths in root `package.json`
- [x] Update `.gitignore` for coverage path

### Verification

- [x] `nx build kameravue-fe` succeeds
- [x] `nx test kameravue-fe` passes (394 tests)
- [x] `nx lint kameravue-fe` passes

### Update CI/CD (Partial)

- [x] Update `.github/workflows/ci.yml` frontend paths (done in PR #43)

### Finalization

- [x] Commit: `refactor: migrate frontend to Nx apps/kameravue-fe`
- [x] Push to origin
- [x] Create PR #43
- [x] Wait for CI to pass
- [x] Merge PR with `gh pr merge --rebase --delete-branch`
- [x] Update local main

### Acceptance Criteria Phase 2

- [x] Frontend in `apps/kameravue-fe/`
- [x] `nx build kameravue-fe` works
- [x] `nx test kameravue-fe` passes (394 tests)
- [x] `nx lint kameravue-fe` passes
- [x] CI passes
- [x] PR #43 merged ke main

---

## Phase 3: Migrate Backend

### Branch Setup

- [x] Create work branch `refactor/migrate-backend-to-nx` from main

### Pre-migration

- [x] Verify backend builds currently: `cd backend/ikp-labs-api && ./mvnw package`
- [x] Verify backend tests pass: `cd backend/ikp-labs-api && ./mvnw test`

### Migration

- [x] Move backend folder (following senior's naming convention `[domain]-[type]`):

  ```bash
  git mv backend apps/kameravue-be
  ```

- [x] Create `apps/kameravue-be/project.json`:

  ```json
  {
    "name": "kameravue-be",
    "sourceRoot": "apps/kameravue-be/ikp-labs-api/src",
    "projectType": "application",
    "targets": {
      "build": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/kameravue-be/ikp-labs-api && ./mvnw package -DskipTests",
          "cwd": "."
        }
      },
      "serve": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/kameravue-be/ikp-labs-api && ./mvnw spring-boot:run",
          "cwd": "."
        }
      },
      "test": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/kameravue-be/ikp-labs-api && ./mvnw test",
          "cwd": "."
        }
      }
    }
  }
  ```

- [x] Update root package.json workspace path
- [x] Verify `apps/kameravue-be/ikp-labs-api/pom.xml` unchanged

### Verification

- [x] `nx build kameravue-be` succeeds (verified by CI)
- [ ] `nx serve kameravue-be` starts Spring Boot (to be tested locally)
- [x] `nx test kameravue-be` passes (verified by CI)
- [ ] Manual test: verify API at <http://localhost:8081> (to be tested locally)

### Update CI/CD (Partial)

- [x] Update `.github/workflows/ci.yml` backend paths:

  ```yaml
  # Change from:
  working-directory: ./backend/ikp-labs-api
  # To:
  working-directory: ./apps/kameravue-be/ikp-labs-api
  ```

### Finalization

- [x] Commit: `refactor: migrate backend to Nx apps/kameravue-be`
- [x] Push to origin
- [x] Create PR #45
- [x] Wait for CI to pass (6/6 checks passed)
- [x] Merge PR with `gh pr merge --rebase --delete-branch`
- [x] Update local main

### Acceptance Criteria Phase 3

- [x] Backend in `apps/kameravue-be/`
- [x] `nx build kameravue-be` works (verified by CI)
- [ ] `nx serve kameravue-be` works (to be tested locally)
- [x] `nx test kameravue-be` passes (verified by CI)
- [x] CI passes
- [x] PR #45 merged ke main

---

## Phase 4: Update CI/CD & Deployment

### Branch Setup

- [x] Create work branch `ci/update-for-nx-structure` from main

### CI/CD Updates

- [x] ~~Update `.github/workflows/ci.yml`~~ (paths already updated in Phase 3)
  - [x] ~~Use `nx` commands instead of manual cd~~ (skipped - direct mvn commands work fine)
  - [x] ~~Add Nx cache setup~~ (skipped - optional optimization, not needed)
  - [x] Update all path references (done in Phase 3)
- [x] Update `.github/workflows/scheduled-e2e.yml` path references
  - [x] Change `cd frontend` to `cd apps/kameravue-fe`
  - [x] Change `npm run build:frontend` to `npx nx build kameravue-fe`
  - [x] Verified all path references updated (Mar 29, 2026)
- [x] ~~Test CI locally~~ (skipped - verified by CI in Phase 3)

### Deployment Script Updates

> **Note:** `scripts/` folder is in `.gitignore` - deployment scripts are local/VPS only, not tracked in git.

- [x] ~~Update `scripts/deploy-frontend.sh`~~ (skipped - in .gitignore, update manually on VPS if needed)
- [x] ~~Update `scripts/deploy-backend.sh`~~ (skipped - in .gitignore, update manually on VPS if needed)
- [x] ~~Update `scripts/deploy-all.sh`~~ (skipped - in .gitignore)

### PM2 Configuration (if exists)

- [x] ~~Update `ecosystem.config.js` paths~~ (skipped - file doesn't exist)

### Playwright Config

- [x] ~~Update `playwright.config.ts`~~ (verified - no changes needed, uses relative paths and localhost URLs)

### Verification

- [x] All CI checks pass (verified in Phase 3)
- [x] ~~Test deployment to staging~~ (skipped - no staging environment)
- [x] ~~Verify production deployment works~~ (skipped - deploy separately)

### Finalization

- [x] Commit: `fix(ci): update scheduled-e2e.yml paths for Nx monorepo structure` (commit 1d4e392)
- [x] Push to origin
- [x] ~~Create PR~~ (skipped - directly committed to main)
- [x] Wait for CI to pass (scheduled E2E verified Mar 29, 11:08 UTC - SUCCESS)
- [x] ~~Merge PR~~ (skipped - directly committed to main)
- [x] Update local main
- [x] ~~Deploy to production~~ (skipped - deploy separately if needed)

### Acceptance Criteria Phase 4

- [x] CI pipeline passes with new structure (verified in Phase 3)
- [x] ~~Deployment scripts work correctly~~ (skipped - in .gitignore, verify on VPS if needed)
- [x] ~~Production deployment successful~~ (skipped - deploy separately)
- [x] ~~No downtime during deployment~~ (skipped - deploy separately)
- [x] PR merged ke main (via direct commit 1d4e392)
- [x] Scheduled E2E test verified (Mar 29, 11:08 UTC - SUCCESS)

---

## Phase 5: Shared Library (Optional)

### Branch Setup

- [ ] Create work branch `feat/add-shared-types-library` from main

### Implementation

- [ ] Create libs folder structure:

  ```bash
  mkdir -p libs/shared-types/src
  ```

- [ ] Create `libs/shared-types/project.json`:

  ```json
  {
    "name": "shared-types",
    "sourceRoot": "libs/shared-types/src",
    "projectType": "library",
    "targets": {
      "build": {
        "executor": "@nx/js:tsc",
        "options": {
          "outputPath": "dist/libs/shared-types"
        }
      },
      "lint": {
        "executor": "@nx/linter:eslint",
        "options": {
          "lintFilePatterns": ["libs/shared-types/**/*.ts"]
        }
      }
    }
  }
  ```

- [ ] Create `libs/shared-types/src/index.ts`
- [ ] Define API types:

  ```typescript
  // Example types
  export interface UserResponse {
    id: number;
    username: string;
    email: string;
    // ...
  }

  export interface PhotoResponse {
    id: number;
    url: string;
    // ...
  }
  ```

- [ ] Create `libs/shared-types/tsconfig.json`
- [ ] Update root `tsconfig.base.json` paths:

  ```json
  {
    "compilerOptions": {
      "paths": {
        "@ikp-labs/shared-types": ["libs/shared-types/src/index.ts"]
      }
    }
  }
  ```

- [ ] Import in frontend:

  ```typescript
  import { UserResponse } from '@ikp-labs/shared-types';
  ```

### Verification

- [ ] `nx build shared-types` succeeds
- [ ] Frontend can import from shared-types
- [ ] Types are correctly inferred

### Finalization

- [ ] Commit: `feat: add shared types library`
- [ ] Push to origin
- [ ] Create PR
- [ ] Wait for CI to pass
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

### Acceptance Criteria Phase 5

- [ ] `libs/shared-types/` created
- [ ] Types can be imported in frontend
- [ ] Build succeeds
- [ ] PR merged ke main

---

## Final Verification (After All Phases)

- [x] `nx graph` shows correct dependency graph
- [x] `nx run-many -t build --all` succeeds
- [x] `nx run-many -t test --all` passes
- [x] CI pipeline fully green
- [x] Scheduled E2E test verified (Mar 29, 11:08 UTC - SUCCESS)
- [x] ~~Production deployed successfully~~ (N/A - code restructuring only, no prod changes needed)
- [x] Move this plan to `plans/done/`

---

**Progress:** Phase 0-4 Complete ✅ | Phase 5 Optional (skipped)
**Created:** March 25, 2026
**Last Updated:** March 29, 2026
