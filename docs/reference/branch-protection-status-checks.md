# Required Status Checks for Branch Protection

This document lists all CI jobs that must pass before merging to `main`.

## Overview

When configuring branch protection rules in GitHub Settings, you need to select specific status checks that must pass before a Pull Request can be merged.

## Required Status Checks List

### Core CI Jobs (Always Run)

These jobs run on **every push** and **every PR**:

| Status Check Name | Job | Duration | Description |
|-------------------|-----|----------|-------------|
| `frontend-lint` | Frontend Lint | ~1m | ESLint + Prettier checks on TypeScript/React code |
| `frontend-tests` | Frontend Tests | ~1m 30s | Jest unit tests with coverage (393+ tests) |
| `frontend-build` | Frontend Build | ~1m 30s | Next.js production build with TypeScript compilation |
| `backend-tests` | Backend Tests | ~50s | JUnit integration tests with JaCoCo coverage (298+ tests) |
| `api-tests` | API Tests | ~2m | Playwright API testing (100+ tests) |
| `ci-summary` | CI Summary | ~5s | Final gate that checks all jobs passed |

### PR-Only Jobs

These jobs **only run on Pull Requests**, not on direct pushes:

| Status Check Name | Job | Duration | Description |
|-------------------|-----|----------|-------------|
| `e2e-tests` | E2E Tests | ~7m 45s | Playwright E2E tests with full stack (PostgreSQL + Spring Boot + Next.js + Chromium) |

## Configuration in GitHub

### Step-by-Step Setup

1. Navigate to **Repository Settings → Branches**
2. Click **Add branch protection rule** (or edit existing rule)
3. Enter branch name pattern: `main`
4. Enable **"Require status checks to pass before merging"**
5. Enable **"Require branches to be up to date before merging"**
6. In the search box, type and select each status check:
   - `frontend-lint`
   - `frontend-tests`
   - `frontend-build`
   - `backend-tests`
   - `api-tests`
   - `e2e-tests`
   - `ci-summary`
7. Click **Save changes**

### Visual Reference

```
Branch Protection Rule for 'main'
├─ ✅ Require a pull request before merging
├─ ✅ Require status checks to pass before merging
│  ├─ ✅ Require branches to be up to date before merging
│  └─ Status checks that are required:
│     ├─ ✅ frontend-lint
│     ├─ ✅ frontend-tests
│     ├─ ✅ frontend-build
│     ├─ ✅ backend-tests
│     ├─ ✅ api-tests
│     ├─ ✅ e2e-tests
│     └─ ✅ ci-summary
└─ ❌ Require approvals (optional for solo projects)
```

## Why These Checks?

| Check | Why Required |
|-------|--------------|
| **frontend-lint** | Ensures code style consistency and catches common errors |
| **frontend-tests** | Verifies component logic and utilities work correctly |
| **frontend-build** | Confirms TypeScript compiles and Next.js builds successfully |
| **backend-tests** | Validates API endpoints and business logic |
| **api-tests** | Ensures REST API contracts are maintained |
| **e2e-tests** | Verifies critical user flows work end-to-end |
| **ci-summary** | Final gate ensuring all jobs completed successfully |

## Workflow Behavior

### On Push to Feature Branch

```
git push origin feature/my-feature
↓
Triggers: frontend-lint, frontend-tests, frontend-build, backend-tests, api-tests, ci-summary
E2E tests: ⊘ Skipped (not a PR)
Duration: ~2m 55s
```

### On Pull Request

```
Create PR: feature/my-feature → main
↓
Triggers: ALL jobs including e2e-tests
Duration: ~7m 50s
```

### Merge Attempt

```
Attempt to merge PR
↓
GitHub checks: Are all required status checks green?
├─ ✅ Yes → Merge allowed
└─ ❌ No  → Merge blocked
```

## Troubleshooting

### Status Check Not Appearing

If a status check doesn't appear in the search box:

1. **Trigger a CI run first**: Push a commit or create a PR to run the workflow
2. **Wait for completion**: GitHub only shows checks that have run at least once
3. **Refresh the page**: Sometimes GitHub UI needs a refresh
4. **Check workflow file**: Ensure the job name in `.github/workflows/ci.yml` matches exactly

### Status Check Names Must Match

The status check names in GitHub Settings must **exactly match** the job names in `.github/workflows/ci.yml`:

```yaml
# .github/workflows/ci.yml
jobs:
  frontend-lint:    # ← This becomes "frontend-lint" status check
    name: Frontend Lint
    # ...
  
  e2e-tests:        # ← This becomes "e2e-tests" status check
    name: E2E Tests
    if: github.event_name == 'pull_request'
    # ...
```

### E2E Tests Skipped on Push

This is **expected behavior**. E2E tests only run on PRs to save CI time:

- ✅ **PR**: All checks including E2E run
- ⊘ **Push**: E2E skipped, other checks run

## Related Documentation

- [CI/CD Setup Guide](../how-to/cicd-setup.md) - Complete CI/CD documentation
- [Contributing Guidelines](../../CONTRIBUTING.md) - PR workflow and requirements
- [Testing Commands](./testing-commands.md) - How to run tests locally

---

**Last Updated**: February 23, 2026  
**CI Workflow**: `.github/workflows/ci.yml`
