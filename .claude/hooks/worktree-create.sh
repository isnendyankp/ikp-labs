#!/bin/bash
# WorktreeCreate hook — routes worktrees to <repo-root>/worktrees/<name>/
# instead of the default .claude/worktrees/ location.
#
# Protocol:
#   Input:  JSON via stdin with fields { hook_event_name, cwd, name }
#   Output: absolute path of the created worktree on stdout (last line)
#   Exit:   0 on success; non-zero fails worktree creation

set -e

INPUT=$(cat)
if [[ -z "$INPUT" ]]; then
  INPUT='{}'
fi

NAME=$(printf '%s' "$INPUT" | jq -r '.name // empty' 2>/dev/null || true)
CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)

# Auto-generate name when missing
if [[ -z "$NAME" || "$NAME" == "null" ]]; then
  NAME="auto-$(date +%Y%m%d-%H%M%S)"
fi

# Default cwd to current shell pwd
if [[ -z "$CWD" || "$CWD" == "null" ]]; then
  CWD="$(pwd)"
fi

# Resolve repo root from common git dir
GIT_COMMON_DIR=$(cd "$CWD" 2>/dev/null && git rev-parse --git-common-dir 2>/dev/null) || {
  echo "worktree-create: not a git repo: $CWD" >&2
  exit 1
}
GIT_COMMON_DIR=$(cd "$CWD" && cd "$GIT_COMMON_DIR" && pwd)
REPO_ROOT=$(dirname "$GIT_COMMON_DIR")

WORKTREE_PATH="$REPO_ROOT/worktrees/$NAME"
mkdir -p "$(dirname "$WORKTREE_PATH")"

# Create worktree if it doesn't already exist
if ! git -C "$REPO_ROOT" worktree list --porcelain | grep -qF "worktree $WORKTREE_PATH"; then
  if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/worktree/$NAME"; then
    git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" "worktree/$NAME" >&2 2>/dev/null || true
  else
    git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" -b "worktree/$NAME" >&2 2>/dev/null || true
  fi
fi

printf '%s\n' "$WORKTREE_PATH"
exit 0
