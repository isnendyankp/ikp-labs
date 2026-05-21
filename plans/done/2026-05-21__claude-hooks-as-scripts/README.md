# Plan: Claude Hooks as Shell Scripts

## Overview

Replace inline bash in `settings.json` with dedicated shell scripts in `.claude/hooks/`,
and add two missing hooks (`warm-cache-before-push.sh`, `worktree-create.sh`) aligned
with `wahidyankf/ose-public` pattern.

**Motivation**: Gap #3 from governance gap analysis (2026-05-18). Inline bash is hard to
read, test, and maintain. Shell scripts are versioned, reusable, and follow conventions.

## Scope

### In Scope

- Create `.claude/hooks/` directory with 3 shell scripts
- `format-lint-markdown.sh` — replaces current inline PostToolUse bash
- `warm-cache-before-push.sh` — new PreToolUse hook (warm Nx cache before push)
- `worktree-create.sh` — new WorktreeCreate hook (route worktrees to `worktrees/`)
- Update `settings.json`: reference scripts, add PreToolUse + WorktreeCreate hooks

### Out of Scope

- `settings.json` permissions or plugins (Gap #4)
- Changing agent or skill files
- Modifying app source code

## 2 Phases

| Phase   | Work                                        |
| ------- | ------------------------------------------- |
| Phase 1 | Create `.claude/hooks/` + 3 shell scripts   |
| Phase 2 | Update `settings.json` to reference scripts |

Each phase = 1 PR. Phase 2 depends on Phase 1.

## Status

**Phase**: In Progress
**Created**: 2026-05-21
**Target**: 2 PRs

## Related

- Gap source: `plans/ideas.md` — 2026-05-18 entry (Gap #3)
- Senior reference: `wahidyankf/ose-public` `.claude/hooks/`
- Current pre-push: `.husky/pre-push` (typecheck + lint + test)
