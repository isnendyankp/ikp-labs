# Checklist: Claude Hooks as Shell Scripts

---

## Phase 1 — Create Hook Scripts

### Branch Setup

- [ ] `git checkout main && git pull origin main`
- [ ] `git checkout -b chore/claude-hooks-create-scripts`
- [ ] `mkdir -p .claude/hooks/`

### Create Scripts

- [ ] Create `.claude/hooks/format-lint-markdown.sh`
  - Handles `.md`: prettier + markdownlint-cli2
  - Handles `.js|jsx|ts|tsx|json|yml|yaml`: prettier only
  - `chmod +x`
- [ ] Create `.claude/hooks/warm-cache-before-push.sh`
  - Only activates on `git push` commands
  - Runs `npx nx affected -t typecheck lint test`
  - `chmod +x`
- [ ] Create `.claude/hooks/worktree-create.sh`
  - Routes to `<repo-root>/worktrees/<name>/`
  - `chmod +x`

### Commit & PR

- [ ] `git add -f .claude/hooks/`
- [ ] `git commit -m "chore(hooks): add format-lint-markdown, warm-cache, worktree-create scripts"`
- [ ] `git push -u origin chore/claude-hooks-create-scripts`
- [ ] `gh pr create --title "chore(hooks): add hook shell scripts"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update checklist: mark Phase 1 done

---

## Phase 2 — Update settings.json

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-hooks-update-settings`

### Update settings.json

- [x] Replace inline bash PostToolUse → script path
- [x] Add `PreToolUse` section for `warm-cache-before-push.sh`
- [x] Add `WorktreeCreate` section for `worktree-create.sh`

### Verify

- [x] No inline `bash -c` remains in hooks section
- [x] All 3 hook script paths present

### Commit & PR

- [ ] `git add .claude/settings.json`
- [ ] `git commit -m "chore(settings): replace inline hooks with script references"`
- [ ] PR + merge

---

## Close Plan

- [x] `git checkout -b docs/close-claude-hooks-plan`
- [x] `git mv plans/in-progress/2026-05-21__claude-hooks-as-scripts plans/done/`
- [x] `git commit -m "docs(plan): move claude-hooks-as-scripts to done"`
- [x] PR + merge

---

**Created**: 2026-05-21
**Completed**: 2026-05-21
**Status**: Done
