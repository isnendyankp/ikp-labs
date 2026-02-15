# How to Use CI/CD Pipeline

This guide explains how to use the CI/CD pipeline for the IKP Labs project, including GitHub Actions workflows and pre-commit hooks.

## Overview

The CI/CD pipeline automatically runs quality checks on every push and pull request:

```
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
                │
                ▼
         All Pass = ✅
         Any Fail = ❌
```

## GitHub Actions CI Workflow

### What Gets Checked

The CI workflow (`.github/workflows/ci.yml`) runs these checks:

| Job | Description | Tools |
|-----|-------------|-------|
| **frontend-lint** | ESLint + Prettier checks | ESLint, Prettier |
| **frontend-tests** | Unit tests with coverage | Jest |
| **frontend-build** | TypeScript + Next.js build | Next.js |
| **backend-tests** | Integration tests with coverage | JUnit, JaCoCo |

### Viewing CI Results

1. **On GitHub**: Go to your repository → Actions tab
2. **On VS Code**: Use the GitHub Actions extension
3. **Badge**: Check the CI badge in README.md

### CI Status Indicators

| Status | Meaning |
|--------|---------|
| ✅ Green | All checks passed |
| 🔴 Red | One or more checks failed |
| 🟡 Yellow | Checks in progress |
| ⚪ Gray | Checks not run yet |

## Pre-commit Hooks

### What Are Pre-commit Hooks?

Pre-commit hooks run automatically before each commit to catch issues early:

```
git commit → Pre-commit Hook → lint-staged → Commit
                    ↓
              If lint fails:
              Commit blocked ❌
```

### What Gets Checked

The pre-commit hook runs `lint-staged` which checks:

| File Type | Checks |
|-----------|--------|
| `.js`, `.jsx`, `.ts`, `.tsx` | ESLint (auto-fix) + Prettier format |
| `.json`, `.md`, `.css` | Prettier format |

### How It Works

```bash
# When you commit:
git commit -m "feat: add new feature"

# Pre-commit hook automatically:
# 1. Finds staged files
# 2. Runs ESLint with auto-fix
# 3. Formats with Prettier
# 4. If all pass: commit proceeds
# 5. If any fail: commit blocked
```

### Bypassing Pre-commit Hooks (Not Recommended)

```bash
# Emergency bypass (use sparingly)
git commit --no-verify -m "emergency fix"
```

## Running Checks Locally

Before pushing, you can run the same checks locally:

### Frontend Checks

```bash
# From project root

# Run ESLint
npm run lint:frontend

# Run Prettier check
cd frontend && npm run format:check

# Run unit tests
npm run test:frontend

# Run all frontend checks
npm run lint:frontend && npm run test:frontend
```

### Backend Checks

```bash
# From project root
cd backend/ikp-labs-api

# Run tests with coverage
./mvnw test

# Run tests only (skip coverage)
./mvnw test -Djacoco.skip=true
```

## Coverage Reports

### Frontend Coverage (Jest)

After running tests, coverage is in:
```
frontend/coverage/
├── lcov-report/    # HTML report
├── coverage-final.json
└── clover.xml
```

View HTML report:
```bash
open frontend/coverage/lcov-report/index.html
```

### Backend Coverage (JaCoCo)

After running tests, coverage is in:
```
backend/ikp-labs-api/target/site/jacoco/
└── index.html      # HTML report
```

View HTML report:
```bash
open backend/ikp-labs-api/target/site/jacoco/index.html
```

## Troubleshooting

### CI Fails: ESLint Errors

**Error**: ESLint found issues in CI but not locally

**Solution**: Your local ESLint might be outdated or configured differently
```bash
# Update dependencies
npm install

# Run ESLint locally
npm run lint:frontend
```

### CI Fails: Prettier Format

**Error**: Prettier check failed in CI

**Solution**: Format files locally before pushing
```bash
cd frontend
npm run format
git add .
git commit -m "style: format code"
```

### CI Fails: Backend Tests

**Error**: Backend tests fail with database errors

**Solution**: Check test configuration
```bash
cd backend/ikp-labs-api
# Tests use H2 in-memory database by default
./mvnw test -Dspring.profiles.active=test
```

### Pre-commit Hook Not Running

**Error**: Hook doesn't run on commit

**Solution**: Ensure Husky is installed
```bash
# Reinstall Husky
npm run prepare

# Verify hook exists
cat .husky/pre-commit
```

### CI Takes Too Long

**Problem**: CI workflow takes > 10 minutes

**Solutions**:
1. Check if caching is working (Maven, npm)
2. Reduce test scope if needed
3. Check for slow tests

## CI/CD Architecture

### Workflow File Structure

```
.github/
└── workflows/
    └── ci.yml          # Main CI workflow
```

### Key Configuration

**Environment Variables** (in `ci.yml`):
```yaml
env:
  NODE_VERSION: '20'
  JAVA_VERSION: '21'
```

**Concurrency** (cancel in-progress runs):
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Caching**:
- npm cache for frontend dependencies
- Maven cache for backend dependencies

### Dependencies Between Jobs

```
frontend-lint ──┐
                ├──→ frontend-build
frontend-tests ─┘

backend-tests (independent)
```

The `frontend-build` job only runs if both `frontend-lint` and `frontend-tests` pass.

## Best Practices

### 1. Run Checks Locally First

```bash
# Before pushing, always run:
npm run lint:frontend
npm run test:frontend
cd ../backend/ikp-labs-api && ./mvnw test
```

### 2. Fix Issues Immediately

When CI fails:
1. Click the failed job in GitHub Actions
2. Read the error message
3. Fix locally
4. Push again

### 3. Don't Bypass Hooks

Avoid `--no-verify` unless absolutely necessary. It bypasses quality checks.

### 4. Keep Dependencies Updated

```bash
# Update npm packages
npm update

# Update Maven dependencies
cd backend/ikp-labs-api && ./mvnw versions:display-dependency-updates
```

## Related Documentation

- [Run E2E Tests](./run-e2e-tests.md) - End-to-end testing guide
- [API Testing](./api-testing.md) - API testing guide
- [Testing Guide](../tutorials/testing-guide.md) - Overall testing documentation

## Next Steps

- [View CI on GitHub](https://github.com/isnendyankp/ikp-labs/actions)
- [Check Coverage Reports](../tutorials/testing-guide.md#coverage-reports)
- [Learn About Testing](../tutorials/testing-guide.md)
