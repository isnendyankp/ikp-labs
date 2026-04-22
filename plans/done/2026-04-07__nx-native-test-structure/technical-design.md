# Technical Design: Nx-Native Test Structure Migration

---

## Current Structure vs Target Structure

### Current (Centralized Tests)

```
IKP-Labs/
├── apps/
│   ├── kameravue-fe/              # Frontend app (no tests inside)
│   └── kameravue-be/              # Backend app
│       └── ikp-labs-api/
│           └── src/test/          # ✅ Unit tests (Java standard)
├── tests/                         # ❌ Centralized (not Nx-native)
│   ├── e2e/                       # E2E browser tests
│   ├── api/                       # API tests
│   ├── gherkin/
│   │   ├── features/              # Gherkin .feature files
│   │   └── steps/                 # Step definitions
│   └── fixtures/                  # Test data
├── specs/                         # Old Gherkin specs (mixed)
│   ├── authentication/
│   └── gallery/
└── playwright.config.ts           # Root Playwright config
```

### Target (Nx-Native Pattern)

```
IKP-Labs/
├── specs/                         # ✅ NEW: Centralized Gherkin specs (source of truth)
│   ├── authentication/
│   │   ├── login.feature
│   │   ├── registration.feature
│   │   └── home-page.feature
│   ├── gallery/
│   │   ├── photo-upload.feature
│   │   ├── photo-management.feature
│   │   ├── photo-likes.feature
│   │   ├── photo-privacy.feature
│   │   └── photo-sorting.feature
│   └── profile/
│       └── profile-picture.feature
│
├── apps/
│   ├── kameravue-fe/
│   │   ├── src/                   # Source code
│   │   ├── __tests__/             # ✅ NEW: Unit tests co-located
│   │   │   ├── components/
│   │   │   └── utils/
│   │   ├── jest.config.js
│   │   └── project.json           # Updated with "test" target
│   │
│   ├── kameravue-be/
│   │   └── ikp-labs-api/
│   │       └── src/test/          # ✅ Already exists (Java standard)
│   │
│   ├── kameravue-fe-e2e/          # ✅ NEW: Frontend E2E app
│   │   ├── tests/                 # E2E test files
│   │   ├── steps/                 # Gherkin step definitions
│   │   ├── fixtures/              # Test data
│   │   ├── playwright.config.ts   # E2E-specific config
│   │   ├── project.json           # Nx config
│   │   └── README.md
│   │
│   └── kameravue-be-e2e/          # ✅ NEW: Backend API E2E app
│       ├── tests/api/             # API test files
│       ├── playwright.config.ts   # API-specific config
│       ├── project.json           # Nx config
│       └── README.md
│
└── tests/                         # ❌ REMOVE after migration
```

---

## Migration Approach

### Strategy: Incremental Migration (7 PRs)

Migrasi dilakukan secara bertahap dengan **1 PR per phase** untuk maximize GitHub activity (green squares).

### Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Gherkin specs location | `specs/` (root) | Centralized source of truth, reusable |
| Frontend unit tests | `apps/kameravue-fe/__tests__/` | Co-located with app code |
| Backend unit tests | Keep in `src/test/` | Java standard, already correct |
| Frontend E2E | `apps/kameravue-fe-e2e/` | Separate Nx app |
| Backend API E2E | `apps/kameravue-be-e2e/` | Separate Nx app |
| Old `tests/` folder | Remove after Phase 6 | Clean up after migration |

---

## Detailed Design

### Phase 1: Create Centralized Specs

**Goal**: Single source of truth untuk Gherkin feature files

**Actions**:
1. Create `specs/` folder structure
2. Move all `.feature` files dari:
   - `tests/gherkin/features/` → `specs/authentication/`, `specs/gallery/`
   - Old `specs/` → New `specs/` (consolidate)
3. Organize by domain

**File Mapping**:
```
# Before
tests/gherkin/features/login.feature
tests/gherkin/features/registration.feature
specs/authentication/login.feature (duplicate?)

# After
specs/authentication/login.feature
specs/authentication/registration.feature
specs/authentication/home-page.feature
```

**Verification**:
```bash
# Check all feature files exist
ls -R specs/
```

---

### Phase 2: Move Frontend Unit Tests

**Goal**: Co-locate unit tests dengan frontend app

**Actions**:
1. Create `apps/kameravue-fe/__tests__/` folder
2. Move existing Jest tests (if any)
3. Create/update `jest.config.js`
4. Update `project.json` dengan `test` target

**`apps/kameravue-fe/project.json`**:
```json
{
  "name": "kameravue-fe",
  "sourceRoot": "apps/kameravue-fe/src",
  "projectType": "application",
  "targets": {
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm run test",
        "cwd": "apps/kameravue-fe"
      },
      "outputs": ["{projectRoot}/coverage"]
    },
    "test:watch": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm run test:watch",
        "cwd": "apps/kameravue-fe"
      }
    },
    "test:coverage": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm run test:coverage",
        "cwd": "apps/kameravue-fe"
      }
    }
  }
}
```

**`apps/kameravue-fe/package.json`** (add scripts):
```json
{
  "scripts": {
    "test": "jest --watchAll=false",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Verification**:
```bash
nx test kameravue-fe
```

---

### Phase 3: Create Frontend E2E App

**Goal**: E2E tests sebagai Nx app terpisah

**Structure**:
```
apps/kameravue-fe-e2e/
├── tests/                         # E2E test files
│   ├── login.spec.ts
│   ├── registration.spec.ts
│   ├── photo-upload.spec.ts
│   └── ...
├── steps/                         # Gherkin step definitions
│   ├── login.steps.ts
│   ├── registration.steps.ts
│   └── photo-upload.steps.ts
├── fixtures/                      # Test data
│   ├── users.json
│   └── photos/
├── playwright.config.ts           # E2E-specific config
├── project.json                   # Nx config
├── tsconfig.json                  # TypeScript config
└── README.md
```

**`apps/kameravue-fe-e2e/project.json`**:
```json
{
  "name": "kameravue-fe-e2e",
  "sourceRoot": "apps/kameravue-fe-e2e",
  "projectType": "application",
  "targets": {
    "e2e": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test",
        "cwd": "apps/kameravue-fe-e2e"
      }
    },
    "e2e:ui": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --ui",
        "cwd": "apps/kameravue-fe-e2e"
      }
    },
    "e2e:headed": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --headed",
        "cwd": "apps/kameravue-fe-e2e"
      }
    }
  },
  "implicitDependencies": ["kameravue-fe", "kameravue-be"],
  "tags": ["type:e2e", "scope:kameravue"]
}
```

**`apps/kameravue-fe-e2e/playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 120 * 1000 : 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 3,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  
  outputDir: 'test-results/artifacts',
  
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

**Migration Steps**:
1. Create folder structure
2. Move files:
   - `tests/e2e/*.spec.ts` → `apps/kameravue-fe-e2e/tests/`
   - `tests/gherkin/steps/*.ts` → `apps/kameravue-fe-e2e/steps/`
   - `tests/fixtures/*` → `apps/kameravue-fe-e2e/fixtures/`
3. Update import paths untuk specs:
   ```typescript
   // Before
   import '../features/login.feature';
   
   // After
   import '../../../../specs/authentication/login.feature';
   ```

**Verification**:
```bash
nx e2e kameravue-fe-e2e
```

---

### Phase 4: Create Backend E2E App

**Goal**: API tests sebagai Nx app terpisah

**Structure**:
```
apps/kameravue-be-e2e/
├── tests/
│   └── api/
│       ├── auth.spec.ts
│       ├── photos.spec.ts
│       └── users.spec.ts
├── playwright.config.ts
├── project.json
├── tsconfig.json
└── README.md
```

**`apps/kameravue-be-e2e/project.json`**:
```json
{
  "name": "kameravue-be-e2e",
  "sourceRoot": "apps/kameravue-be-e2e",
  "projectType": "application",
  "targets": {
    "e2e": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test",
        "cwd": "apps/kameravue-be-e2e"
      }
    }
  },
  "implicitDependencies": ["kameravue-be"],
  "tags": ["type:e2e", "scope:kameravue"]
}
```

**`apps/kameravue-be-e2e/playwright.config.ts`**:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 120 * 1000 : 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 3,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  
  use: {
    baseURL: 'http://localhost:8081',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
```

**Migration Steps**:
1. Create folder structure
2. Move files: `tests/api/*.spec.ts` → `apps/kameravue-be-e2e/tests/api/`

**Verification**:
```bash
nx e2e kameravue-be-e2e
```

---

### Phase 5: Update GitHub Actions

**Goal**: CI/CD menggunakan Nx commands

**`kameravue-ci.yml` Changes**:

```yaml
# BEFORE
- name: Run frontend unit tests
  working-directory: apps/kameravue-fe
  run: npx jest --watchAll=false --coverage

# AFTER
- name: Run frontend unit tests
  run: npx nx test kameravue-fe

# BEFORE
- name: Run API tests
  run: npx playwright test --project=api-tests

# AFTER
- name: Run API tests
  run: npx nx e2e kameravue-be-e2e

# BEFORE (artifact upload)
- name: Upload coverage report
  with:
    name: frontend-coverage
    path: |
      coverage/
      apps/kameravue-fe/coverage/

# AFTER
- name: Upload coverage report
  with:
    name: frontend-coverage
    path: apps/kameravue-fe/coverage/
```

**`kameravue-scheduled-e2e.yml` Changes**:

```yaml
# BEFORE
- name: Run E2E tests
  env:
    CI: true
  run: npx playwright test --project=chromium

# AFTER
- name: Run E2E tests
  env:
    CI: true
  run: npx nx e2e kameravue-fe-e2e

# BEFORE (artifact upload)
- name: Upload E2E test results
  with:
    name: e2e-test-results-${{ github.run_number }}
    path: |
      test-results/
      playwright-report/

# AFTER
- name: Upload E2E test results
  with:
    name: e2e-test-results-${{ github.run_number }}
    path: |
      apps/kameravue-fe-e2e/test-results/
      apps/kameravue-fe-e2e/playwright-report/
```

---

### Phase 6: Cleanup & Documentation

**Actions**:
1. Remove old `tests/` folder
2. Remove or update root `playwright.config.ts`
3. Update README.md
4. Update documentation

**README.md Updates**:
```markdown
## Running Tests

### Unit Tests
```bash
# Frontend unit tests
nx test kameravue-fe

# Backend unit tests
nx test kameravue-be
```

### E2E Tests
```bash
# Frontend E2E tests
nx e2e kameravue-fe-e2e

# Backend API tests
nx e2e kameravue-be-e2e

# Run with UI
nx e2e kameravue-fe-e2e --ui
```

### All Tests
```bash
# Run all tests
nx run-many --target=test --all
nx run-many --target=e2e --all

# Run affected tests only
nx affected --target=test
nx affected --target=e2e
```
```

---

## Nx Configuration Updates

### `nx.json` (Root)

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "extends": "nx/presets/npm.json",
  "npmScope": "ikp-labs",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["{projectRoot}/dist", "{projectRoot}/build", "{projectRoot}/target"]
    },
    "test": {
      "outputs": ["{projectRoot}/coverage", "{projectRoot}/target/surefire-reports"]
    },
    "e2e": {
      "outputs": [
        "{projectRoot}/test-results",
        "{projectRoot}/playwright-report"
      ]
    }
  }
}
```

---

## Command Reference

### Before Migration

```bash
# Frontend tests
cd apps/kameravue-fe && npm run test

# Backend tests
cd apps/kameravue-be/ikp-labs-api && mvn test

# E2E tests
npx playwright test --project=chromium

# API tests
npx playwright test --project=api-tests
```

### After Migration

```bash
# Frontend tests
nx test kameravue-fe

# Backend tests
nx test kameravue-be

# Frontend E2E
nx e2e kameravue-fe-e2e

# Backend API E2E
nx e2e kameravue-be-e2e

# All tests
nx run-many --target=test --all
nx run-many --target=e2e --all

# Affected tests only
nx affected --target=test
nx affected --target=e2e
```

---

## Rollback Plan

Jika terjadi masalah di salah satu phase:

1. **Immediate**: `git revert <commit-hash>` atau close PR
2. **Branch**: Buat branch `rollback/test-migration` dari state sebelum migration
3. **CI**: Old workflow paths masih ada sampai Phase 5 selesai

---

## Testing Strategy

### Per Phase Testing

| Phase | Test Command | Expected Result |
|-------|--------------|-----------------|
| Phase 1 | `ls -R specs/` | All .feature files present |
| Phase 2 | `nx test kameravue-fe` | Tests pass |
| Phase 3 | `nx e2e kameravue-fe-e2e` | E2E tests pass |
| Phase 4 | `nx e2e kameravue-be-e2e` | API tests pass |
| Phase 5 | GitHub Actions | All workflows pass |
| Phase 6 | `ls tests/` | Folder not found (removed) |

---

**Created**: April 7, 2026
**Last Updated**: April 7, 2026
