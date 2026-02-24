# CI/CD Workflow Strategy

This document explains the CI/CD workflow strategy for IKP Labs, including the rationale behind architectural decisions and trade-offs.

## Table of Contents

- [Overview](#overview)
- [Workflow Architecture](#workflow-architecture)
- [E2E Testing Strategy](#e2e-testing-strategy)
- [Trade-offs and Rationale](#trade-offs-and-rationale)
- [Workflow Comparison](#workflow-comparison)
- [When to Use Each Approach](#when-to-use-each-approach)

---

## Overview

IKP Labs uses a **dual-workflow CI/CD strategy**:

1. **PR Workflow** (`.github/workflows/ci.yml`) - Fast quality checks on every PR
2. **Scheduled E2E Workflow** (`.github/workflows/scheduled-e2e.yml`) - Comprehensive E2E tests twice daily

This approach balances **development velocity** with **quality assurance**.

---

## Workflow Architecture

### Workflow 1: CI Pipeline (PR/Push)

**File**: `.github/workflows/ci.yml`

**Triggers**:
- Every push to `main`
- Every pull request to `main`

**Jobs** (6 jobs, ~3 minutes):
```
┌─────────────────────────────────────────────────────────────────┐
│                     Push / PR Trigger                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
      ┌──────────────┬───────┼──────────────┬───────────────┐
      │              │       │              │               │
      ▼              ▼       ▼              ▼               ▼
┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Frontend │  │ Frontend │ │ Backend  │ │   API    │ │ Frontend │
│   Lint   │  │  Tests   │ │  Tests   │ │  Tests   │ │  Build   │
│(ESLint + │  │ (Jest +  │ │(JUnit +  │ │(Playwright│ │(TypeScript
│ Prettier)│  │ Coverage)│ │ JaCoCo)  │ │+Postgres)│ │  +Next.js)
└──────────┘  └──────────┘ └──────────┘ └──────────┘ └──────────┘
      │              │            │             │             │
      └──────────────┴────────────┴─────────────┴─────────────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │  CI Summary  │
                           │  All Pass=✅  │
                           └──────────────┘
```

**Coverage**:
- ✅ Code style and formatting
- ✅ Unit tests (393 frontend + 298 backend)
- ✅ Build verification
- ✅ API contract tests (100+ tests)
- ❌ E2E user flows (moved to scheduled)

---

### Workflow 2: Scheduled E2E Tests

**File**: `.github/workflows/scheduled-e2e.yml`

**Triggers**:
- Cron schedule: 6:00 AM WIB (23:00 UTC previous day)
- Cron schedule: 6:00 PM WIB (11:00 AM UTC)
- Manual trigger via GitHub UI (`workflow_dispatch`)

**Jobs** (1 job, ~7-8 minutes):
```
┌─────────────────────────────────────────────────────────────────┐
│              Scheduled Trigger (6 AM & 6 PM WIB)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │  E2E Tests   │
                      │ (Chromium)   │
                      │              │
                      │ Full Stack:  │
                      │ - PostgreSQL │
                      │ - Spring Boot│
                      │ - Next.js    │
                      │ - Browser    │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Results    │
                      │ Pass/Fail ✅❌│
                      └──────────────┘
```

**Coverage**:
- ✅ Critical user flows (login, registration, photo gallery)
- ✅ Full stack integration
- ✅ Browser compatibility (Chromium)
- ✅ Real-world user scenarios

---

## E2E Testing Strategy

### Why Scheduled E2E Instead of PR E2E?

**Problem**: E2E tests are slow and expensive
- Duration: 7-8 minutes per run
- Resources: PostgreSQL + Spring Boot + Next.js + Chromium
- Cost: High CI minutes usage on every PR

**Solution**: Move E2E to scheduled runs
- Frequency: 2x daily (6 AM & 6 PM WIB)
- Target: `main` branch health monitoring
- Benefit: Faster PR workflow (3 min vs 7-8 min)

### Schedule Rationale

**6:00 AM WIB**:
- Before work hours start
- Detect overnight regressions
- Fresh start for the day

**6:00 PM WIB**:
- After typical work hours
- Validate day's changes
- Prepare for next day

### Cron Schedule Details

```yaml
schedule:
  # 6:00 AM WIB = 23:00 UTC (previous day)
  - cron: '0 23 * * *'
  # 6:00 PM WIB = 11:00 AM UTC
  - cron: '0 11 * * *'
```

**Time Zone Conversion**:
- WIB (UTC+7) → UTC
- 6:00 AM WIB = 23:00 UTC (day before)
- 6:00 PM WIB = 11:00 AM UTC (same day)

---

## Trade-offs and Rationale

### Approach A: E2E on Every PR (Previous)

**Pros**:
- ✅ Bugs caught before merge
- ✅ High confidence in PR quality
- ✅ E2E acts as merge gate

**Cons**:
- ❌ Slow PR workflow (7-8 minutes)
- ❌ High CI minutes cost
- ❌ Blocks development velocity
- ❌ Overkill for small changes (docs, typos)

---

### Approach B: Scheduled E2E (Current)

**Pros**:
- ✅ Fast PR workflow (3 minutes)
- ✅ Cost-effective CI usage
- ✅ Better developer experience
- ✅ E2E still runs regularly (2x daily)
- ✅ Suitable for solo/small team projects

**Cons**:
- ❌ Bugs may reach `main` before E2E detects
- ❌ E2E failures discovered after merge
- ❌ Requires monitoring and quick response
- ❌ Not suitable for critical production apps

---

## Workflow Comparison

| Aspect | PR E2E (Approach A) | Scheduled E2E (Approach B) |
|--------|---------------------|----------------------------|
| **PR Duration** | 7-8 minutes | 3 minutes |
| **E2E Frequency** | Every PR | 2x daily |
| **Bug Detection** | Before merge | After merge |
| **CI Cost** | High (every PR) | Low (2x daily) |
| **Developer Experience** | Slower | Faster |
| **Risk Level** | Lower | Higher |
| **Best For** | Production apps, teams | Solo projects, rapid iteration |

---

## When to Use Each Approach

### Use Scheduled E2E (Current) When:

- ✅ Solo or small team project
- ✅ Portfolio/learning project
- ✅ Rapid iteration needed
- ✅ Cost-conscious CI usage
- ✅ Non-critical application
- ✅ Can tolerate occasional bugs in `main`

**Example**: IKP Labs (portfolio project)

---

### Use PR E2E When:

- ✅ Production application
- ✅ Large team collaboration
- ✅ Zero-tolerance for bugs in `main`
- ✅ Compliance/regulatory requirements
- ✅ High-stakes deployment
- ✅ CI cost is not a concern

**Example**: Banking apps, healthcare systems, e-commerce platforms

---

## Hybrid Approach (Optional)

For projects that need flexibility:

```yaml
# Run E2E on PR only for specific paths
on:
  pull_request:
    paths:
      - 'backend/**'
      - 'frontend/src/app/**'
      - '!**/*.md'  # Exclude docs
```

**Benefits**:
- E2E runs only for code changes
- Skips E2E for docs/config changes
- Balances speed and safety

---

## Monitoring and Response

### When Scheduled E2E Fails

1. **Receive notification** (GitHub Actions email)
2. **Check test report** (uploaded artifacts)
3. **Identify root cause** (regression, flaky test, infrastructure)
4. **Create hotfix PR** if needed
5. **Fix and verify** in next scheduled run

### Best Practices

- ✅ Monitor scheduled E2E results daily
- ✅ Fix failures promptly (same day)
- ✅ Investigate flaky tests
- ✅ Keep E2E tests stable and reliable
- ✅ Document known issues

---

## Future Considerations

### Potential Improvements

1. **Conditional E2E on PR**
   - Run E2E on PR for critical paths only
   - Use path filters to trigger selectively

2. **Notification Integration**
   - Slack/Discord alerts for E2E failures
   - Email summaries of daily E2E results

3. **Smoke Tests on PR**
   - Lightweight E2E subset on PR
   - Full E2E suite on schedule

4. **Parallel E2E Execution**
   - Split E2E tests across multiple runners
   - Reduce scheduled E2E duration

---

## Related Documentation

- [CI/CD Setup Guide](../how-to/cicd-setup.md) - How to run and configure CI/CD
- [Contributing Guidelines](../../CONTRIBUTING.md) - PR workflow and requirements
- [Branch Protection](../reference/branch-protection-status-checks.md) - Required status checks

---

## Summary

IKP Labs uses a **pragmatic CI/CD strategy** that prioritizes:

1. **Fast feedback** - 3-minute PR workflow
2. **Cost efficiency** - Scheduled E2E (2x daily)
3. **Quality assurance** - Comprehensive test coverage
4. **Developer experience** - Minimal friction in development

This approach is **ideal for portfolio projects** and **solo development**, where development velocity matters more than zero-bug tolerance in `main`.

For production applications, consider switching back to PR-triggered E2E tests.

---

**Last Updated**: February 24, 2026  
**Strategy**: Scheduled E2E (Approach B)  
**Workflows**: `ci.yml` + `scheduled-e2e.yml`
