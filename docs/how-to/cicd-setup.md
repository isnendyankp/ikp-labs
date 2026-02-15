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

## Pre-commit Hooks

Pre-commit hooks run automatically before each commit using Husky + lint-staged:

```
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
