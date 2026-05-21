# Requirements: Claude Hooks as Shell Scripts

## Problem Statement

`settings.json` contains inline bash for PostToolUse. It's unreadable, untestable,
and doesn't support warm-cache or worktree hooks. Senior repo uses dedicated shell scripts.

## Goals

1. Inline bash replaced by `format-lint-markdown.sh` script
2. `warm-cache-before-push.sh` added — speeds up Husky pre-push via Nx cache
3. `worktree-create.sh` added — routes worktrees to `worktrees/` at repo root
4. `settings.json` references scripts instead of inline bash

## Acceptance Criteria

### Phase 1 — Hook Scripts Created

- [ ] `.claude/hooks/format-lint-markdown.sh` exists and is executable
  - Handles `.md` files: runs `prettier --write` then `markdownlint-cli2 --fix`
  - Handles `.js|.jsx|.ts|.tsx|.json|.yml|.yaml` files: runs `prettier --write`
  - Exits 0 always (non-blocking)
- [ ] `.claude/hooks/warm-cache-before-push.sh` exists and is executable
  - Only activates on `git push` commands
  - Runs `npx nx affected -t typecheck lint test` to warm Nx cache
  - Mirrors commands from `.husky/pre-push`
  - Exits 0 always (non-blocking, cache-warming only)
- [ ] `.claude/hooks/worktree-create.sh` exists and is executable
  - Routes worktrees to `<repo-root>/worktrees/<name>/`
  - Outputs absolute worktree path on stdout
- [ ] CI passes

### Phase 2 — settings.json Updated

- [ ] `PostToolUse` hook uses script path instead of inline bash
- [ ] `PreToolUse` hook added for `warm-cache-before-push.sh` on `Bash` matcher
- [ ] `WorktreeCreate` hook added for `worktree-create.sh`
- [ ] No inline bash remains in hooks section
- [ ] CI passes

## Constraints

- Hook scripts must use `#!/bin/bash` shebang
- Scripts must be executable (`chmod +x`)
- `.claude/` is in `.gitignore` — all new files need `git add -f`
- No app source code modified
