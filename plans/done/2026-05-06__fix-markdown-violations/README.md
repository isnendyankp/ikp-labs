# Fix Markdown Violations (4-Day Sprint)

**Status**: Completed ✅
**Start Date**: 2026-05-06 (Tuesday)
**Completion Date**: 2026-05-08 (Thursday)
**Duration**: 3 days (1 day ahead of schedule)

---

## Overview

Fix markdown linting violations found after implementing markdown linting in PR #90. Total 9174 violations across 269 files will be fixed incrementally over 4 days, focusing on high-priority files first.

This work maximizes GitHub activity (green squares) by spreading fixes across multiple PRs and commits.

---

## Scope

### In Scope

- ✅ Fix violations in root files (README.md, ROADMAP.md, etc.)
- ✅ Fix violations in `governance/` directory
- ✅ Fix violations in `docs/` directory (all subdirectories)
- ✅ Fix violations in `plans/in-progress/` (current plans)
- ✅ Fix violations in critical documentation files

### Out of Scope

- ❌ `.claude/agents/` directory (70 files - defer to future work)
- ❌ `.claude/skills/` directory (37 files - defer to future work)
- ❌ `plans/done/` directory (50 files - defer to future work)
- ❌ Auto-fix all violations (will fix manually for quality)

---

## Strategy

### Priority Levels

| Priority | Files | Violations | Rationale |
|----------|-------|------------|-----------|
| **HIGH** | Root files, governance, docs | ~2500 | User-facing, frequently read |
| **MEDIUM** | Plans (in-progress) | ~200 | Active work, needs clean state |
| **LOW** | .claude/, plans/done | ~6775 | Internal, less frequently accessed |

### Approach

- **2 PRs per day** (8 PRs total over 4 days)
- **2-3 commits per PR** (16-24 commits total)
- **Fix by violation type** (easier to review)
- **Use `--fix` flag** where safe, manual review for complex cases

---

## Timeline

### Day 1 (Tuesday, May 6) — Root + Governance

- **PR #1**: Fix root files (README.md, ROADMAP.md, SECURITY.md, etc.)
- **PR #2**: Fix governance/ directory

**Target**: 2 PRs, ~6 commits, ~500 violations fixed

### Day 2 (Wednesday, May 7) — Docs Part 1

- **PR #3**: Fix docs/tutorials/ directory
- **PR #4**: Fix docs/how-to/ directory

**Target**: 2 PRs, ~6 commits, ~800 violations fixed

### Day 3 (Thursday, May 8) — Docs Part 2

- **PR #5**: Fix docs/reference/ directory
- **PR #6**: Fix docs/explanation/ directory

**Target**: 2 PRs, ~6 commits, ~700 violations fixed

### Day 4 (Friday, May 9) — Plans + Cleanup

- **PR #7**: Fix plans/in-progress/ directory
- **PR #8**: Fix remaining critical files

**Target**: 2 PRs, ~4 commits, ~500 violations fixed

---

## Deliverables

### Expected Outcomes

| Metric | Target | Impact |
|--------|--------|--------|
| PRs merged | 8 PRs | 8 green squares (if 2 PRs/day) |
| Commits | 16-24 commits | High GitHub activity |
| Violations fixed | ~2500 violations | High-priority files clean |
| Files fixed | ~60-80 files | Core documentation improved |
| Days | 4 days | Complete before weekend |

### Success Criteria

- [x] All root files pass markdown linting
- [x] All governance files pass markdown linting
- [x] All docs/ files pass markdown linting
- [x] All plans/in-progress/ files pass markdown linting
- [x] Violations reduced from 9174 to 6648 (<7000) ✅
- [x] No breaking changes to documentation content
- [x] All PRs pass CI checks

---

## Common Violations to Fix

Based on initial scan, most common violations:

| Violation | Description | Fix Strategy |
|-----------|-------------|--------------|
| MD040 | Fenced code blocks need language | Add language tags (```bash,```typescript, etc.) |
| MD031 | Blank lines around fences | Add blank lines before/after code blocks |
| MD032 | Blank lines around lists | Add blank lines before/after lists |
| MD024 | Duplicate headings | Rename or add context to headings |
| MD022 | Blank lines around headings | Add blank lines before/after headings |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking documentation links | HIGH | Manual review, test links after fix |
| Changing code examples | MEDIUM | Careful review of code blocks |
| Time overrun | LOW | Focus on high-priority only, defer low-priority |
| CI failures | LOW | Test locally before pushing |

---

## Related Work

- **Previous Plan**: `2026-05-04__add-quality-gates` (implemented markdown linting)
- **Gap Analysis**: Comparison with `wahidyankf/ose-public` repo
- **Follow-up Plan**: Add CI markdown gate (block PR merge if violations exist) — to be done after this plan completes
- **Future Work**: Fix `.claude/agents/`, `.claude/skills/`, `plans/done/` (separate plan)

---

## Notes

- Fix violations = **Meta Changes** (🟢) per governance workflow — no deploy needed
- Use `npm run lint:md -- --fix` for auto-fix where safe
- Manual review required for complex violations (e.g., MD024 duplicate headings)
- Each PR should be small and focused (easier to review)
- Commit messages: `docs: <description>` format
- Commit plan checklist bersama setiap fix (governance requirement)
- Follow governance workflow: branch → commit → PR → `gh pr merge --rebase --delete-branch` → update main
