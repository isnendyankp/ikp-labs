# CI/CD Pipeline - Technical Design

**Plan**: CI/CD Pipeline
**Version**: 1.0
**Last Updated**: January 12, 2026

---

## Table of Contents

1. [GitHub Actions Workflows](#github-actions-workflows)
2. [Pre-commit Hooks](#pre-commit-hooks)
3. [Deployment Configuration](#deployment-configuration)
4. [Caching Strategy](#caching-strategy)

---

## GitHub Actions Workflows

### CI Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  JAVA_VERSION: '21'
  POSTGRES_VERSION: '16'

jobs:
  # ========================================
  # Backend Quality Checks & Tests
  # ========================================
  backend-checks:
    name: Backend Checks
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:${{ env.POSTGRES_VERSION }}
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: ikp_labs_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK ${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Cache Maven packages
        uses: actions/cache@v4
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
          restore-keys: ${{ runner.os }}-m2

      - name: Run backend tests
        working-directory: ./backend/ikp-labs-api
        run: mvn test

      - name: Run backend integration tests
        working-directory: ./backend/ikp-labs-api
        run: mvn verify
        env:
          DATABASE_URL: jdbc:postgresql://localhost:5432/ikp_labs_test

      - name: Generate test coverage report
        working-directory: ./backend/ikp-labs-api
        run: mvn jacoco:report

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        with:
          name: backend-coverage
          path: backend/ikp-labs-api/target/site/jacoco/

  # ========================================
  # Frontend Quality Checks & Tests
  # ========================================
  frontend-checks:
    name: Frontend Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run TypeScript type check
        working-directory: ./frontend
        run: npm run type-check

      - name: Run ESLint
        working-directory: ./frontend
        run: npm run lint

      - name: Check Prettier formatting
        working-directory: ./frontend
        run: npm run format:check

      - name: Run frontend unit tests
        working-directory: ./frontend
        run: npm run test:ci

      - name: Generate coverage report
        working-directory: ./frontend
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        with:
          name: frontend-coverage
          path: frontend/coverage/

  # ========================================
  # E2E Tests
  # ========================================
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [backend-checks, frontend-checks]

    services:
      postgres:
        image: postgres:${{ env.POSTGRES_VERSION }}
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: ikp_labs_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Install Playwright browsers
        working-directory: ./frontend
        run: npx playwright install --with-deps chromium

      - name: Set up JDK ${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Start backend
        working-directory: ./backend/ikp-labs-api
        run: mvn spring-boot:run &
        env:
          DATABASE_URL: jdbc:postgresql://localhost:5432/ikp_labs_test

      - name: Wait for backend
        run: npx wait-on http://localhost:8081/actuator/health -t 60000

      - name: Run Playwright E2E tests
        working-directory: ./frontend
        run: npx playwright test

      - name: Run Playwright API tests
        working-directory: ./frontend
        run: npx playwright test --project=api

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 30

  # ========================================
  # Status Check
  # ========================================
  status-check:
    name: Status Check
    runs-on: ubuntu-latest
    needs: [backend-checks, frontend-checks, e2e-tests]
    if: always()

    steps:
      - name: Check all jobs passed
        run: |
          if [ "${{ needs.backend-checks.result }}" != "success" ] || \
             [ "${{ needs.frontend-checks.result }}" != "success" ] || \
             [ "${{ needs.e2e-tests.result }}" != "success" ]; then
            echo "One or more jobs failed"
            exit 1
          fi
          echo "All jobs passed successfully"
```

---

### CD Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  JAVA_VERSION: '21'

jobs:
  # ========================================
  # Deploy Frontend
  # ========================================
  deploy-frontend:
    name: Deploy Frontend
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run tests
        working-directory: ./frontend
        run: npm run test:ci

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.PRODUCTION_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          working-directory: ./frontend
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  # ========================================
  # Deploy Backend
  # ========================================
  deploy-backend:
    name: Deploy Backend
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK ${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Run tests
        working-directory: ./backend/ikp-labs-api
        run: mvn test

      - name: Build backend
        working-directory: ./backend/ikp-labs-api
        run: mvn clean package -DskipTests

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service-id: ${{ secrets.RAILWAY_SERVICE_ID }}

  # ========================================
  # Smoke Tests
  # ========================================
  smoke-tests:
    name: Smoke Tests
    runs-on: ubuntu-latest
    needs: [deploy-frontend, deploy-backend]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Install Playwright
        working-directory: ./frontend
        run: npx playwright install --with-deps chromium

      - name: Run smoke tests
        working-directory: ./frontend
        run: npx playwright test --project=smoke
        env:
          BASE_URL: ${{ secrets.PRODUCTION_URL }}

      - name: Notify on failure
        if: failure()
        run: |
          echo "Deployment verification failed!"
          # Add Slack/Discord notification here
```

---

## Pre-commit Hooks

### Husky Setup

**Installation**:
```bash
npm install --save-dev husky lint-staged
npx husky init
```

### Pre-commit Hook

**File**: `.husky/pre-commit`

```bash
#!/usr/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged
npx lint-staged

# Run fast TypeScript check
echo "📝 Running TypeScript type check..."
cd frontend && npx tsc --noEmit
```

### Commit Message Hook

**File**: `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Invalid commit message format!"
  echo "Expected format: type(scope): description"
  echo "Types: feat, fix, docs, style, refactor, test, chore"
  echo "Example: feat(auth): add JWT token refresh"
  exit 1
fi
```

### lint-staged Configuration

**File**: `package.json` (root or frontend)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

---

## Deployment Configuration

### Vercel (Frontend)

**File**: `vercel.json` (in frontend folder)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@production-api-url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@production-api-url"
    }
  }
}
```

### Railway (Backend)

**File**: `railway.json` (in backend folder)

```json
{
  "build": {
    "commands": ["mvn clean package -DskipTests"],
    "watchPatterns": ["src/**/*.java"]
  },
  "deploy": {
    "startCommand": "java -jar target/ikp-labs-api.jar",
    "healthcheckPath": "/actuator/health"
  }
}
```

---

## Caching Strategy

### Maven Cache

```yaml
- name: Cache Maven packages
  uses: actions/cache@v4
  with:
    path: ~/.m2
    key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    restore-keys: ${{ runner.os }}-m2
```

### npm Cache

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
    cache-dependency-path: frontend/package-lock.json
```

### Playwright Cache

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('frontend/package-lock.json') }}
```

---

## Branch Protection Rules

**Settings**: GitHub Repository → Settings → Branches

**Rules for `main` branch**:
```yaml
Branch Protection Rules:
  - Require pull request before merging:
    ✅ Required
  - Require approvals:
    ✅ 1 approval required
  - Dismiss stale reviews:
    ✅ Enabled
  - Require status checks to pass:
    ✅ Require branches to be up to date
    ✅ Required status checks:
      - Backend Checks
      - Frontend Checks
      - E2E Tests
  - Require conversation resolution:
    ✅ Enabled
  - Do not allow bypassing the above settings:
    ✅ Enabled
```

---

## Status Badges

**File**: `README.md` (at the top)

```markdown
# IKP-Labs

[![CI/CD Pipeline](https://github.com/username/ikp-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/username/ikp-labs/actions/workflows/ci.yml)
[![Frontend Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)](./frontend/coverage/)
[![Backend Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](./backend/ikp-labs-api/target/site/jacoco/index.html)
[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://ikp-labs.vercel.app/)
```

---

## Notification Configuration

### Slack Notification

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI/CD Pipeline failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Discord Notification

```yaml
- name: Notify Discord on failure
  if: failure()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "CI/CD Pipeline"
```

---

**Technical Design Version**: 1.0
**Last Updated**: January 12, 2026
**Ready for Implementation**: Yes
