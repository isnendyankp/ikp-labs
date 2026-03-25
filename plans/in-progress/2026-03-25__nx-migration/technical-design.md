# Technical Design: Nx Monorepo Migration

---

## Current Structure vs Target Structure

### Current (Manual Monorepo)

```
IKP-Labs/
├── backend/
│   └── ikp-labs-api/          # Spring Boot (Java)
├── frontend/                   # Next.js (React/TypeScript)
├── tests/                      # Playwright E2E & API tests
├── specs/                      # Gherkin specs
├── docs/                       # Documentation
├── deployment/                 # Deploy scripts
├── scripts/                    # Utility scripts
├── plans/                      # Project planning
├── package.json                # npm workspaces
└── playwright.config.ts
```

### Target (Nx Monorepo)

```
IKP-Labs/
├── apps/
│   ├── backend/               # Spring Boot (Java) - migrated from backend/
│   │   ├── ikp-labs-api/
│   │   ├── project.json       # Nx project config
│   │   └── README.md
│   ├── frontend/              # Next.js - migrated from frontend/
│   │   ├── src/
│   │   ├── project.json       # Nx project config
│   │   └── README.md
│   └── frontend-e2e/           # Playwright E2E (optional, from tests/)
│       ├── src/
│       ├── project.json
│       └── playwright.config.ts
├── libs/
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   └── project.json
│   └── test-helpers/           # Shared test utilities (optional)
│       └── src/
├── tests/                      # API tests, gherkin specs
├── specs/                      # Gherkin specs (existing)
├── docs/                       # Documentation (existing)
├── tools/                      # Nx generators & executors
├── nx.json                     # Nx workspace config
├── workspace.json              # Project definitions (or individual project.json)
├── package.json                # Root package
└── playwright.config.ts
```

---

## Migration Approach

### Strategy: Incremental Migration

Migrasi dilakukan secara bertahap dengan **1 PR per phase**. Setiap phase harus:
1. Dapat di-build dan di-test secara independen
2. Tidak break existing functionality
3. Mudah di-rollback jika ada masalah

### Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Backend location | `apps/backend/` | Follow Nx convention |
| Frontend location | `apps/frontend/` | Follow Nx convention |
| E2E tests | Keep in `tests/` for now | Minimize changes |
| Shared libs | `libs/shared-types/` | Enable type sharing |
| Config files | Individual `project.json` | Per-app configuration |

---

## Nx Configuration

### nx.json (Root Config)

```json
{
  "extends": "nx/presets/npm.json",
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
      "outputs": ["{projectRoot}/dist", "{projectRoot}/build"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

### apps/frontend/project.json

```json
{
  "name": "frontend",
  "sourceRoot": "apps/frontend/src",
  "projectType": "application",
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "options": {
        "buildTarget": "frontend:build",
        "dev": true,
        "port": 3002
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/frontend"
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/apps/frontend"],
      "options": {
        "jestConfig": "apps/frontend/jest.config.ts"
      }
    },
    "lint": {
      "executor": "@nx/linter:eslint",
      "options": {
        "lintFilePatterns": ["apps/frontend/**/*.{ts,tsx}"]
      }
    }
  }
}
```

### apps/backend/project.json

```json
{
  "name": "backend",
  "sourceRoot": "apps/backend/ikp-labs-api/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/ikp-labs-api/target"],
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
      "outputs": ["{projectRoot}/ikp-labs-api/target/surefire-reports"],
      "options": {
        "command": "cd apps/backend/ikp-labs-api && ./mvnw test",
        "cwd": "."
      }
    }
  }
}
```

---

## CI/CD Changes

### GitHub Actions Workflow Updates

```yaml
# Before
- name: Build Frontend
  run: cd frontend && npm run build

# After
- name: Build Frontend
  run: npx nx build frontend
```

### Deploy Script Updates

```bash
# Before (scripts/deploy-frontend.sh)
rsync -avz frontend/ user@server:/path/

# After
rsync -avz dist/apps/frontend/ user@server:/path/
# or
rsync -avz apps/frontend/ user@server:/path/
```

---

## Command Reference

### Before Migration

```bash
# Frontend
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run test

# Backend
cd backend/ikp-labs-api && ./mvnw spring-boot:run
cd backend/ikp-labs-api && ./mvnw package
cd backend/ikp-labs-api && ./mvnw test
```

### After Migration

```bash
# Frontend
nx serve frontend
nx build frontend
nx test frontend
nx lint frontend

# Backend
nx serve backend
nx build backend
nx test backend

# All apps
nx run-many -t build
nx run-many -t test
nx affected -t build    # Only affected projects
nx affected -t test     # Only affected projects

# Visualization
nx graph              # Show dependency graph
```

---

## Rollback Plan

Jika terjadi masalah di salah satu phase:

1. **Immediate**: `git revert <commit-hash>` atau close PR
2. **Branch**: Buat branch `rollback/nx-migration` dari state sebelum migration
3. **Deploy**: Re-deploy previous version dari git history

---

## Testing Strategy

### Per Phase Testing

| Phase | Test Command | Expected Result |
|-------|--------------|-----------------|
| Phase 1 | `npx nx graph` | Graph displayed |
| Phase 2 | `nx build frontend` | Build success |
| Phase 2 | `nx serve frontend` | Dev server running |
| Phase 3 | `nx build backend` | Build success |
| Phase 3 | `nx serve backend` | Backend running |
| Phase 4 | `gh pr checks` | All CI pass |
| Phase 5 | `nx build shared-types` | Lib build success |

### Integration Testing

```bash
# Full stack test
nx run-many -t build --all
nx run-many -t test --all

# E2E tests (manual)
./scripts/run-e2e-tests.sh
```

---

## Dependencies

### New Dependencies to Install

```json
{
  "devDependencies": {
    "nx": "^19.0.0",
    "@nx/next": "^19.0.0",
    "@nx/jest": "^19.0.0",
    "@nx/linter": "^19.0.0",
    "@nx/workspace": "^19.0.0"
  }
}
```

---

**Created**: March 25, 2026
**Last Updated**: March 25, 2026
