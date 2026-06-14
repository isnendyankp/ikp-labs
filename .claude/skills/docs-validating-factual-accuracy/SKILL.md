# Skill: Validating Factual Accuracy

**Category**: Documentation
**Purpose**: Standards for verifying that technical claims in documentation are accurate, version-pinned, and traceable to a source
**Used By**: documentation-writer, docs-validator, docs-fixer

---

## Overview

Documentation becomes a liability when it contains outdated versions, incorrect commands, or unverifiable claims. This skill defines how to detect and prevent factual inaccuracy in `docs/`.

**Core principle**: Every technical claim must be traceable to a primary source — source code, config file, or official spec. If it cannot be verified, it must not be stated as fact.

---

## What Counts as a Factual Claim

| Claim type | Example | Must verify against |
|---|---|---|
| Version number | "Next.js 15" | `apps/kameravue-fe/package.json` |
| Port number | "BE runs on port 8081" | `apps/kameravue-be/` config or README |
| Command | `npm run dev` | `package.json` scripts |
| File path | `apps/kameravue-fe/src/app/` | Actual directory |
| API endpoint | `GET /api/gallery/public` | Controller source code |
| Tech stack item | "Java 17" | `pom.xml` `<java.version>` |
| Test framework | "JUnit 5 + Mockito" | `pom.xml` dependencies |

---

## Verification Sources

Always read the primary source before stating a fact in docs.

### Frontend — `apps/kameravue-fe/`

| Fact type | Source file |
|---|---|
| Package versions | `package.json` → `dependencies` / `devDependencies` |
| Run commands | `package.json` → `scripts` |
| Port | `package.json` or `next.config.*` |
| TypeScript version | `package.json` → `devDependencies.typescript` |

**Current verified versions (as of last check):**

- Next.js: `15.5.0`
- React: `19.1.0`
- TypeScript: `^5`
- Dev port: `3002`

### Backend — `apps/kameravue-be/`

| Fact type | Source file |
|---|---|
| Spring Boot version | `pom.xml` → `<parent><version>` |
| Java version | `pom.xml` → `<java.version>` |
| Dependencies | `pom.xml` → `<dependencies>` |
| Run commands | `README.md` or `Makefile` |

**Current verified versions (as of last check):**

- Spring Boot: `3.3.6`
- Java: `17`
- BE port: `8081`

### E2E Tests — `apps/kameravue-fe-e2e/` and `apps/kameravue-be-e2e/`

| Fact type | Source file |
|---|---|
| Playwright version | `package.json` |
| Test commands | `package.json` → `scripts` |
| Base URL | `playwright.config.*` |

> **Warning**: Versions in "Current verified versions" sections above are snapshots. Always re-read the source file before publishing docs — do not rely on these cached values.

---

## Accuracy Rules

### Rule 1 — Version pins must be exact

Docs must state the exact version, not a range or approximation.

**Bad**: "Spring Boot 3+" or "the latest Next.js"

**Good**: "Spring Boot 3.3.6" (read from `pom.xml`)

**Exception**: When documenting a minimum requirement, state it explicitly as a minimum — `"Requires Java 17 or higher"`.

### Rule 2 — Commands must be tested or sourced

Every shell command in docs must exist in `package.json` scripts, a `Makefile`, or be a standard tool command.

**Bad**: Document `npm run start:dev` without verifying it exists in `package.json`.

**Good**: Verify `npm run dev` exists in `apps/kameravue-fe/package.json` → `scripts.dev` before writing it.

### Rule 3 — File paths must exist

Every file path referenced in docs must be verifiable with `ls` or `find`.

**Bad**: `apps/kameravue-fe/src/components/Gallery/`

**Good**: Verify the path exists before writing it.

### Rule 4 — API endpoints must match source

Every API endpoint documented must match a `@GetMapping`, `@PostMapping`, etc. annotation in the controller source code.

### Rule 5 — No fabricated metrics

Do not state performance numbers, test coverage percentages, or timing claims unless they come from an actual test run or CI report.

**Bad**: "Tests run in under 30 seconds."

**Good**: "Tests typically complete in 25–35 seconds on the CI runner." (only if measured)

---

## Staleness Detection

A doc is stale when it references a version, path, or command that no longer matches the source.

**Signals to check during validation:**

- Version in docs does not match `package.json` or `pom.xml`
- Command in docs does not exist in `package.json` → `scripts`
- File path in docs does not exist on disk
- API endpoint in docs does not exist in any controller
- Doc references a feature that was removed or renamed

**When validating**, run these checks:

```bash
# Verify a package version
cat apps/kameravue-fe/package.json | grep '"next"'

# Verify a script exists
cat apps/kameravue-fe/package.json | grep '"dev"'

# Verify a file path exists
ls apps/kameravue-fe/src/app/

# Verify an API endpoint exists
grep -r "GetMapping\|PostMapping\|DeleteMapping\|PutMapping" apps/kameravue-be/ | grep "gallery"
```

---

## Severity Classification

Use these levels when reporting factual accuracy issues:

| Severity | Condition | Example |
|---|---|---|
| CRITICAL | Wrong command that breaks the dev workflow | `npm run start` instead of `npm run dev` |
| HIGH | Wrong version that causes compatibility confusion | Docs say Java 11, code requires Java 17 |
| MEDIUM | Outdated path that still partially works | Old file path that was moved but not deleted |
| LOW | Minor wording imprecision with no functional impact | "around 8080" instead of "8081" |

---

## Validation Checklist

Before publishing or approving any doc change:

- [ ] All version numbers verified against `package.json` or `pom.xml`
- [ ] All shell commands verified against `package.json` scripts or tool docs
- [ ] All file paths verified to exist on disk
- [ ] All API endpoints verified against controller source
- [ ] No performance or metric claims without a measured source
- [ ] No ranges or approximations where exact values are available

---

## Related Skills

- **docs-applying-content-quality** — Overall documentation quality standards
- **docs-applying-diataxis-framework** — Categorization framework
- **docs-creating-accessible-diagrams** — Accuracy standards for diagram alt text

---

**Last Updated**: 2026-06-14
