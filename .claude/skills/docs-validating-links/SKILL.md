# Skill: Link Validation Standards

**Category**: Documentation
**Purpose**: Define standards for discovering and validating links in markdown files
**Used By**: docs-link-checker, docs-link-fixer

---

## Overview

This skill covers how to find, classify, and fix broken links in markdown files across the IKP-Labs project. Links are the connective tissue of documentation — a broken link degrades trust and discoverability.

**Core Principles:**

1. **Coverage** — Scan all markdown, not just `docs/`
2. **Precision** — Distinguish internal vs external vs anchor link failures
3. **Safety** — Re-validate before fixing; never delete content
4. **Traceability** — Use `git log --follow` to find renamed files before declaring a link broken

---

## Link Types

### 1. Internal Relative Links

Links that point to another file in the same repo:

```markdown
[Setup Guide](../how-to/setup.md)
[Controller](../../apps/kameravue-be/src/main/java/com/ikplabs/controller/GalleryController.java)
```

**Validation:**

- Resolve the path relative to the file containing the link
- Check the target file exists on disk
- If the link includes an anchor (`setup.md#prerequisites`), verify the heading exists in the target file

**Failure modes:**

- File was deleted → CRITICAL if in root README, HIGH if in docs/, MEDIUM if in .claude/
- File was renamed/moved → check `git log --follow -- <old-path>` for new location
- Anchor no longer exists → MEDIUM (heading was renamed)

### 2. External Links

Links that start with `http://` or `https://`:

```markdown
[Playwright Docs](https://playwright.dev/docs/test-assertions)
[Spring Boot](https://spring.io/projects/spring-boot)
```

**Validation:**

- HTTP GET request with 10-second timeout
- Follow up to 3 redirects
- Classify by final HTTP status: 200 = OK, 301/302 = warn (update to canonical URL), 404/410 = broken, timeout = flaky

**Deduplication:** Only check each unique URL once per run.

**Failure modes:**

- 404/410 → HIGH (content gone)
- Timeout → LOW (network issue, may self-heal)
- 301/302 permanent redirect → MEDIUM (update to canonical URL)

### 3. Same-File Anchor Links

Links that reference a heading in the same file:

```markdown
[See Configuration](#configuration)
[Jump to Examples](#examples)
```

**Anchor normalization (GitHub-flavored Markdown):**

1. Lowercase the heading text
2. Replace spaces with `-`
3. Remove characters that are not alphanumeric, `-`, or `_`

Example: `## IKP-Labs Tech Stack` → `#ikp-labs-tech-stack`

**Failure modes:**

- Heading was renamed → MEDIUM
- Heading was deleted → HIGH

### 4. Internal Absolute Paths

Links using absolute paths from repo root (rare but possible):

```markdown
[Agent README](/Users/isnendyankp/.claude/agents/README.md)
```

These are almost always incorrect — absolute paths break in CI and on other machines. Classify as HIGH regardless of whether the file exists.

---

## Scan Locations

Scan these locations for `.md` files, excluding build artifacts:

| Location | Priority | Notes |
|----------|----------|-------|
| Project root (`*.md`) | HIGH | README, ROADMAP, CONTRIBUTING, etc. |
| `docs/` | HIGH | All documentation |
| `apps/kameravue-fe/docs/` | MEDIUM | Frontend docs |
| `apps/kameravue-be/docs/` | MEDIUM | Backend docs |
| `apps/kameravue-fe/README.md` | HIGH | App README |
| `apps/kameravue-be/README.md` | HIGH | App README |
| `apps/kameravue-fe-e2e/README.md` | LOW | E2E README |
| `apps/kameravue-be-e2e/README.md` | LOW | E2E README |
| `.claude/agents/README.md` | MEDIUM | Agents index |
| `.claude/skills/README.md` | MEDIUM | Skills index |
| `plans/` | LOW | Plan documents |

**Exclude:** `node_modules/`, `target/`, `.git/`, `generated-reports/`, `playwright-report/`

---

## Criticality Classification

Use `wow-criticality-assessment` for severity, with these link-specific defaults:

| Severity | Trigger |
|----------|---------|
| CRITICAL | Link in root `README.md` is broken; or security/auth doc link broken |
| HIGH | Link in `docs/` broken; or external link returns 404; or absolute path used |
| MEDIUM | Anchor not found; or permanent redirect (update URL); or link in `.claude/` broken |
| LOW | External link timeout (network flakiness); or link in `plans/` broken |

---

## Report Format

Save to `generated-reports/link-audit-YYYY-MM-DD-HHMM.md`.

````markdown
# Link Audit Report - YYYY-MM-DD HH:MM

**Generated:** YYYY-MM-DD HH:MM:SS
**Agent:** docs-link-checker
**Files Scanned:** N
**Links Checked:** N (N internal, N external, N anchors)
**Status:** ✅ PASS / ⚠️ WARNINGS / ❌ FAILED

---

## Executive Summary

- **Total Broken Links:** N
  - CRITICAL: N
  - HIGH: N
  - MEDIUM: N
  - LOW: N

---

## Findings

### 🔴 CRITICAL — Broken Link in Root README

**File:** README.md:23
**Link:** `[Setup Guide](docs/how-to/setup.md)`
**Target:** docs/how-to/setup.md
**Status:** ❌ File not found
**Confidence:** HIGH

**Fix:**
The file may have been renamed. `git log` shows: `docs/how-to/development-setup.md`

Update link to:
```markdown
[Setup Guide](docs/how-to/development-setup.md)
```

---

## Summary Table

| File | Total Links | Broken | Status |
|------|-------------|--------|--------|
| README.md | 12 | 1 | ❌ |
| docs/how-to/run-tests.md | 5 | 0 | ✅ |

````

---

## Fix Safety Rules

- **Never delete** content when fixing a link — only update the href
- **Re-validate** every finding before applying a fix (file system state may have changed)
- **Use relative paths** — never introduce absolute filesystem paths
- **Prefer `git mv` history** over guessing new file locations
- **Flag external 404s** — do not auto-remove external links without confirmation; the page may be temporarily down

---

## Related Skills

- **wow-criticality-assessment** — Severity classification system
- **docs-applying-content-quality** — Documentation quality standards
