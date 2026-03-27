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
- [ ] Update `.github/workflows/ci.yml` frontend paths (to be done in Phase 4)

### Finalization
- [x] Commit: `refactor: migrate frontend to Nx apps/kameravue-fe`
- [ ] Push to origin
- [ ] Create PR
- [ ] Wait for CI to pass
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

### Acceptance Criteria Phase 2
- [x] Frontend in `apps/kameravue-fe/`
- [x] `nx build kameravue-fe` works
- [x] `nx test kameravue-fe` passes (394 tests)
- [x] `nx lint kameravue-fe` passes
- [ ] CI passes
- [ ] PR merged ke main

---

## Phase 3: Migrate Backend

### Branch Setup
- [ ] Create work branch `refactor/migrate-backend-to-nx` from main

### Pre-migration
- [ ] Verify backend builds currently: `cd backend/ikp-labs-api && ./mvnw package`
- [ ] Verify backend tests pass: `cd backend/ikp-labs-api && ./mvnw test`

### Migration
- [ ] Move backend folder:
  ```bash
  git mv backend apps/backend
  ```
- [ ] Create `apps/backend/project.json`:
  ```json
  {
    "name": "backend",
    "sourceRoot": "apps/backend/ikp-labs-api/src",
    "projectType": "application",
    "targets": {
      "build": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/backend/ikp-labs-api && ./mvnw package -DskipTests",
          "cwd": "."
        }
      },
      "serve": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/backend/ikp-labs-api && ./mvnw spring-boot:run",
          "cwd": "."
        }
      },
      "test": {
        "executor": "nx:run-commands",
        "options": {
          "command": "cd apps/backend/ikp-labs-api && ./mvnw test",
          "cwd": "."
        }
      }
    }
  }
  ```
- [ ] Update root package.json workspace path
- [ ] Verify `apps/backend/ikp-labs-api/pom.xml` unchanged

### Verification
- [ ] `nx build backend` succeeds
- [ ] `nx serve backend` starts Spring Boot
- [ ] `nx test backend` passes
- [ ] Manual test: verify API at http://localhost:8081

### Update CI/CD (Partial)
- [ ] Update `.github/workflows/ci.yml` backend paths:
  ```yaml
  # Change from:
  working-directory: ./backend/ikp-labs-api
  # To:
  working-directory: ./apps/backend/ikp-labs-api
  ```

### Finalization
- [ ] Commit: `refactor: migrate backend to Nx apps folder`
- [ ] Push to origin
- [ ] Create PR
- [ ] Wait for CI to pass
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

### Acceptance Criteria Phase 3
- [ ] Backend in `apps/backend/`
- [ ] `nx build backend` works
- [ ] `nx serve backend` works
- [ ] `nx test backend` passes
- [ ] CI passes
- [ ] PR merged ke main

---

## Phase 4: Update CI/CD & Deployment

### Branch Setup
- [ ] Create work branch `ci/update-for-nx-structure` from main

### CI/CD Updates
- [ ] Update `.github/workflows/ci.yml`:
  - [ ] Use `nx` commands instead of manual cd
  - [ ] Add Nx cache setup
  - [ ] Update all path references
- [ ] Update `.github/workflows/scheduled-e2e.yml` if exists:
  - [ ] Update path references
- [ ] Test CI locally (optional with `act`)

### Deployment Script Updates
- [ ] Update `scripts/deploy-frontend.sh`:
  ```bash
  # Change path from:
  FRONTEND_PATH="frontend"
  # To:
  FRONTEND_PATH="apps/frontend"
  ```
- [ ] Update `scripts/deploy-backend.sh`:
  ```bash
  # Change path from:
  BACKEND_PATH="backend/ikp-labs-api"
  # To:
  BACKEND_PATH="apps/backend/ikp-labs-api"
  ```
- [ ] Update `scripts/deploy-all.sh` if exists

### PM2 Configuration (if exists)
- [ ] Update `ecosystem.config.js` paths:
  ```javascript
  cwd: './apps/frontend'  // instead of './frontend'
  ```

### Playwright Config
- [ ] Update `playwright.config.ts` baseURL if needed
- [ ] Update test file paths if needed

### Verification
- [ ] All CI checks pass
- [ ] Test deployment to staging (if available)
- [ ] Verify production deployment works

### Finalization
- [ ] Commit: `ci: update CI/CD and deployment for Nx structure`
- [ ] Push to origin
- [ ] Create PR
- [ ] Wait for CI to pass
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main
- [ ] Deploy to production

### Acceptance Criteria Phase 4
- [ ] CI pipeline passes with new structure
- [ ] Deployment scripts work correctly
- [ ] Production deployment successful
- [ ] No downtime during deployment
- [ ] PR merged ke main

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

- [ ] `nx graph` shows correct dependency graph
- [ ] `nx run-many -t build --all` succeeds
- [ ] `nx run-many -t test --all` passes
- [ ] CI pipeline fully green
- [ ] Production deployed successfully
- [ ] Move this plan to `plans/done/`

---

**Progress:** Phase 0 in progress
**Created:** March 25, 2026
**Last Updated:** March 25, 2026
