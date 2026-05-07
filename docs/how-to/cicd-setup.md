# How to Use CI/CD Pipeline

This guide covers the **GitHub Actions CI workflow** and **pre-commit hooks** for code quality checks.

> **Note**: For E2E/API testing commands, see [Testing Commands Reference](../reference/testing-commands.md).

## What This Guide Covers

| Topic | This Guide | Other Docs |
|-------|------------|------------|
| GitHub Actions CI (lint, unit tests, build) | ✅ | - |
| Pre-commit hooks (Husky, lint-staged) | ✅ | - |
| Playwright E2E commands | - | [Testing Commands](../reference/testing-commands.md) |
| API Testing | - | [API Testing](./api-testing.md) |
| E2E Testing Guide | - | [Run E2E Tests](./run-e2e-tests.md) |

---

## CI Workflow Overview

The GitHub Actions CI workflow (`.github/workflows/ci.yml`) runs automatically on every push and pull request:

```text
┌─────────────────────────────────────────────────────────┐
│                    Push / PR Trigger                     │
└─────────────────────────┬───────────────────────────────┘
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Frontend │        │ Frontend │        │ Backend  │
│   Lint   │        │  Tests   │        │  Tests   │
│(ESLint + │        │ (Jest +  │        │(JUnit +  │
│ Prettier)│        │ Coverage)│        │ JaCoCo)  │
└──────────┘        └──────────┘        └──────────┘
      │                   │                   │
      └─────────┬─────────┴───────────────────┘
                │
                ▼
         ┌──────────┐
         │ Frontend │
         │  Build   │
         │(TypeScript)
         └──────────┘
```

### CI Jobs

| Job | Description | Tools |
|-----|-------------|-------|
| **frontend-lint** | ESLint + Prettier checks | ESLint, Prettier |
| **frontend-tests** | Unit tests with coverage | Jest |
| **frontend-build** | TypeScript + Next.js build | Next.js |
| **backend-tests** | Integration tests with coverage | JUnit, JaCoCo |

### Viewing CI Results

- **GitHub**: Repository → Actions tab
- **VS Code**: GitHub Actions extension
- **README**: Check the CI badge at the top

---

## Scheduled E2E Tests

E2E tests run on a **schedule** (twice daily) instead of on every PR to keep PR workflow fast.

### Schedule

- **6:00 AM WIB** (23:00 UTC previous day)
- **6:00 PM WIB** (11:00 AM UTC)

### Why Scheduled?

**Benefits**:

- ✅ Faster PR workflow (~3 min vs 7-8 min)
- ✅ Cost-effective CI minutes usage
- ✅ Regular health monitoring of `main` branch
- ✅ Better developer experience

**Trade-offs**:

- ⚠️ Bugs may reach `main` before E2E detects them
- ⚠️ E2E failures discovered after merge (not before)

### Viewing Scheduled E2E Results

1. Go to **Repository → Actions**
2. Select **"Scheduled E2E Tests"** workflow
3. View latest run results

### Manual Trigger

You can manually trigger E2E tests:

```bash
# Via GitHub CLI
gh workflow run scheduled-e2e.yml

# Or via GitHub UI:
# Actions → Scheduled E2E Tests → Run workflow
```

### Strategy Details

For a complete explanation of the E2E testing strategy, see:

- [CI/CD Workflow Strategy](../explanation/ci-cd-workflow-strategy.md)

---

## Pre-commit Hooks

Pre-commit hooks run automatically before each commit using Husky + lint-staged:

```text
git commit → Pre-commit Hook → lint-staged → Commit
                    ↓
              If lint fails:
              Commit blocked ❌
```

### What Gets Checked

| File Type | Checks |
|-----------|--------|
| `.js`, `.jsx`, `.ts`, `.tsx` | ESLint (auto-fix) + Prettier format |
| `.json`, `.md`, `.css` | Prettier format |

### Bypass (Not Recommended)

```bash
# Emergency bypass only
git commit --no-verify -m "emergency fix"
```

---

## Running Checks Locally

### Frontend

```bash
npm run lint:frontend      # ESLint check
npm run test:frontend      # Jest tests
cd frontend && npm run format:check  # Prettier check
```

### Backend

```bash
cd backend/ikp-labs-api
./mvnw test               # JUnit tests with JaCoCo
```

---

## Branch Protection Rules

Branch protection ensures code quality by requiring CI checks to pass before merging to `main`.

### Recommended Settings

Configure these rules in **GitHub Settings → Branches → Branch protection rules**:

| Rule | Recommended | Purpose |
|------|-------------|---------|
| **Require pull request before merging** | ✅ Yes | Prevents direct pushes to `main` |
| **Require status checks to pass** | ✅ Yes | CI must be green before merge |
| **Require branches to be up to date** | ✅ Yes | Ensures latest code is tested |
| **Require approvals** | ❌ Optional | For team projects only |
| **Dismiss stale reviews** | ❌ Optional | For team projects only |

### Required Status Checks

When enabling "Require status checks to pass", select these jobs:

```text
✅ frontend-lint
✅ frontend-tests
✅ frontend-build
✅ backend-tests
✅ api-tests
✅ e2e-tests (PR only)
✅ ci-summary
```

### Setup Steps

1. Go to **Repository Settings → Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
5. Search and select all required status checks listed above
6. Click **Create** or **Save changes**

### Testing Branch Protection

```bash
# This will be blocked if branch protection is enabled
git checkout main
git commit --allow-empty -m "test"
git push origin main
# ❌ Error: protected branch hook declined

# Correct workflow
git checkout -b feature/test-branch-protection
git commit --allow-empty -m "test: verify branch protection"
git push origin feature/test-branch-protection
# Create PR → CI runs → Merge when green ✅
```

### Benefits

- 🛡️ **Prevents broken code** from reaching `main`
- 🔍 **Forces code review** through PR process
- ✅ **Ensures CI passes** before merge
- 📊 **Maintains clean history** with PR-based workflow

---

## Troubleshooting

### CI Fails: ESLint/Prettier

```bash
# Fix locally before pushing
npm run lint:frontend
cd frontend && npm run format
git add . && git commit -m "fix: lint issues"
```

### Pre-commit Hook Not Running

```bash
# Reinstall Husky
npm run prepare
```

### Backend Tests Fail

```bash
cd backend/ikp-labs-api
./mvnw test -Dspring.profiles.active=test
```

---

## Related Documentation

- [Testing Commands Reference](../reference/testing-commands.md) - Complete Playwright commands
- [Run E2E Tests](./run-e2e-tests.md) - E2E testing guide
- [API Testing](./api-testing.md) - API testing guide
- [Testing Guide](../tutorials/testing-guide.md) - Overall testing documentation

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run lint:frontend` | ESLint check |
| `npm run test:frontend` | Jest unit tests |
| `cd frontend && npm run format:check` | Prettier check |
| `cd backend/ikp-labs-api && ./mvnw test` | Backend tests |
| `npm run prepare` | Reinstall Husky hooks |
