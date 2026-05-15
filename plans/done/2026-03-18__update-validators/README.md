# Update Claude Validator Agents

> Fix outdated path references in test-validator, docs-validator, and plan-checker agents

---

## Overview

The three Claude validator agents (`test-validator`, `docs-validator`, `plan-checker`) contain outdated project structure references that no longer match the actual codebase. This causes incorrect path assumptions when the agents analyze the project.

## Objectives

1. Update project structure references in all 3 validators
2. Fix test file paths (`frontend/tests/` → `tests/e2e/` and `tests/api/`)
3. Fix spec file paths (`specs/*.feature` → `specs/**/*.feature`)
4. Update documentation to reflect current project state

## Scope

### In-Scope

- Update `test-validator.md` path references
- Update `docs-validator.md` path references
- Update `plan-checker.md` path references
- Update last modified dates

### Out-of-Scope

- Major refactoring of validator logic
- Adding new validation features
- Changes to related skills files

## Key Deliverables

- [ ] Updated `.claude/agents/test-validator.md`
- [ ] Updated `.claude/agents/docs-validator.md`
- [ ] Updated `.claude/agents/plan-checker.md`

## Success Criteria

- All validators reference correct project paths
- Validators can be invoked without errors
- Documentation is accurate and up-to-date

---

**Created:** 2026-03-18
**Status:** In Progress
