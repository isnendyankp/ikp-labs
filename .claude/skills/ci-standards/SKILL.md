# Skill: CI Standards

**Category**: Infrastructure
**Purpose**: Define standards for GitHub Actions CI/CD workflows in the IKP-Labs project
**Used By**: ci-checker, ci-fixer

---

## Overview

This skill defines what a correct, well-structured CI pipeline looks like for IKP-Labs. The project uses GitHub Actions with two workflows:

- **`kameravue-ci.yml`** — runs on every push/PR to `main`; must complete in ~3 minutes
- **`kameravue-scheduled-e2e.yml`** — runs E2E tests on a schedule (06:00 and 18:00 WIB); also manually triggerable

---

## Required Jobs

### Main CI (`kameravue-ci.yml`)

All of the following jobs must exist:

| Job ID | Name | Purpose |
|--------|------|---------|
| `frontend-lint` | Kameravue Frontend Lint | ESLint + Prettier check |
| `frontend-tests` | Kameravue Frontend Tests | Jest unit tests + coverage |
| `frontend-build` | Kameravue Frontend Build | TypeScript check + Next.js build |
| `backend-tests` | Kameravue Backend Tests | JUnit + JaCoCo coverage |
| `api-tests` | Kameravue API Tests | Playwright API tests against live backend + PostgreSQL |
| `markdown-lint` | Markdown Lint | markdownlint-cli2 |
| `ci-summary` | Kameravue CI Summary | Aggregates all jobs; fails if any fail |

`ci-summary` must declare `needs` for all other jobs and use `if: always()`.

### Scheduled E2E (`kameravue-scheduled-e2e.yml`)

Single job `e2e-tests` that runs the full frontend + backend + Playwright E2E stack.

---

## Trigger Standards

### Main CI

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Both `push` and `pull_request` triggers are required. Missing `pull_request` means PRs don't get CI checks.

### Scheduled E2E

```yaml
on:
  schedule:
    - cron: '0 23 * * *'   # 06:00 WIB
    - cron: '0 11 * * *'   # 18:00 WIB
  workflow_dispatch:         # REQUIRED — allows manual trigger
```

`workflow_dispatch` is required so engineers can manually trigger E2E without waiting for schedule.

---

## Concurrency

Main CI must cancel in-progress runs when a new commit arrives:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Missing this causes queue build-up and wasted CI minutes on stale runs.

---

## Action Pinning

All `uses:` entries must pin to a specific tag. Never use `@main`, `@master`, or unpinned.

**Required action versions (current):**

| Action | Required Version |
|--------|-----------------|
| `actions/checkout` | `@v4` |
| `actions/setup-node` | `@v4` |
| `actions/setup-java` | `@v4` |
| `actions/cache` | `@v4` |
| `actions/upload-artifact` | `@v4` |

Using `@main` or `@master` is a security and reproducibility risk — the action content can change at any time.

---

## Environment Variables

Global env vars must be defined at workflow level:

```yaml
env:
  NODE_VERSION: '20'
  JAVA_VERSION: '21'
```

Job steps reference these as `${{ env.NODE_VERSION }}`. Hardcoded version strings in individual steps are acceptable only in Linux binary install workarounds.

---

## Timeout Requirements

Jobs with external services or long compile times must set `timeout-minutes`:

| Job | Required Timeout |
|-----|-----------------|
| `api-tests` | ≤ 30 minutes |
| `e2e-tests` (scheduled) | ≤ 60 minutes |
| `backend-tests` | optional but recommended (15 min) |

Omitting timeout allows stuck jobs to consume CI minutes for up to 6 hours.

---

## Caching

Node.js and Maven jobs must use the built-in cache options:

**Node.js:**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
```

**Maven:**

```yaml
- uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: ${{ env.JAVA_VERSION }}
    cache: 'maven'

- uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: |
      ${{ runner.os }}-maven-
```

Both `setup-java cache` and explicit `actions/cache` are used for Maven — this provides faster restores.

---

## Service Containers

Jobs that depend on PostgreSQL must configure health checks:

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_DB: registrationform_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

Missing `options: --health-*` means the job may start before PostgreSQL is ready, causing flaky failures.

Note: Hardcoded `postgres`/`postgres` credentials in service containers are acceptable for test environments — these are not production secrets.

---

## Artifact Upload

Test jobs must upload coverage and test results as artifacts:

**Frontend tests:**

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: frontend-coverage
    path: |
      coverage/
      apps/kameravue-fe/coverage/
    retention-days: 7
    if-no-files-found: warn
```

**Backend tests:**

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: backend-test-results
    path: apps/kameravue-be/ikp-labs-api/target/surefire-reports/
    retention-days: 7
```

`if: always()` is required — artifacts must upload even when tests fail (that's when they're most needed).

`retention-days: 7` is the project standard. Do not set higher without justification.

---

## Backend Health Check Pattern

When starting the Spring Boot backend in CI, wait for it using curl:

```yaml
- name: Wait for backend health check
  run: |
    for i in $(seq 1 30); do
      if curl -s http://localhost:8081/api/auth/health | grep -q "UP"; then
        echo "✅ Backend is healthy!"
        exit 0
      fi
      echo "Attempt $i/30 - waiting 5s..."
      sleep 5
    done
    echo "❌ Backend failed to start within 150s"
    tail -50 /tmp/spring-boot.log || true
    exit 1
```

The health endpoint is `GET /api/auth/health` (returns `{"status":"UP",...}`). Backend starts on port 8081.

---

## Criticality Classification

| Severity | Trigger |
|----------|---------|
| CRITICAL | Missing required job from main CI; or `push` trigger missing (PRs get no CI) |
| HIGH | Unpinned action version (`@main`/`@master`); or missing `concurrency` config; or missing `workflow_dispatch` on scheduled workflow |
| MEDIUM | Missing `timeout-minutes` on long jobs; or missing cache config; or missing health check options on service |
| LOW | Missing artifact upload; or `retention-days` not set; or minor naming inconsistency |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Fix |
|-------------|---------|-----|
| `uses: actions/checkout@main` | Content changes unpredictably; security risk | Pin to `@v4` |
| No `concurrency` block | Parallel runs on same ref waste minutes | Add cancel-in-progress |
| No `timeout-minutes` on api-tests | Stuck job runs for 6 hours | Add `timeout-minutes: 30` |
| Missing `workflow_dispatch` on scheduled | Can't manually trigger E2E after incident | Add trigger |
| Hardcoded version strings per step | Inconsistency when updating Node/Java | Use `${{ env.NODE_VERSION }}` |
| Missing `if: always()` on artifact upload | Artifacts lost when tests fail | Add `if: always()` |

---

## Related Skills

- **wow-criticality-assessment** — Severity classification system
