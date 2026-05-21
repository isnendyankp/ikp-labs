# Technical Design: Claude Hooks as Shell Scripts

## Hook Scripts

### `format-lint-markdown.sh`

Replaces current inline PostToolUse bash. Extends to also run `markdownlint-cli2` on `.md`.

```bash
#!/bin/bash
file_path=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)

if [[ -z "$file_path" ]]; then
  exit 0
fi

if [[ "$file_path" =~ \.md$ ]]; then
  prettier --write "$file_path" 2>/dev/null || true
  markdownlint-cli2 --fix "$file_path" 2>/dev/null || true
elif [[ "$file_path" =~ \.(js|jsx|ts|tsx|json|yml|yaml)$ ]]; then
  prettier --write "$file_path" 2>/dev/null || true
fi

exit 0
```

### `warm-cache-before-push.sh`

Adapted from senior's version for IKP-Labs (simpler stack: no polyglot tooling).
Mirrors `.husky/pre-push` commands (typecheck + lint + test).

```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if ! echo "$COMMAND" | grep -qE '^\s*git\s+push\b'; then
  exit 0
fi

echo "Warming Nx cache before push..." >&2
PARALLEL=$(( $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4) - 1 ))
npx nx affected -t typecheck lint test --base=origin/main --parallel="$PARALLEL" 2>&1 || true
echo "Cache warming complete." >&2
exit 0
```

### `worktree-create.sh`

Routes worktrees to `<repo-root>/worktrees/<name>/` instead of default `.claude/worktrees/`.
Adapted from senior's version (generic git logic, works for any repo).

## Target `settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/warm-cache-before-push.sh",
            "timeout": 900,
            "statusMessage": "Warming Nx cache before push..."
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/format-lint-markdown.sh"
          }
        ]
      }
    ],
    "WorktreeCreate": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/worktree-create.sh"
          }
        ]
      }
    ]
  }
}
```

## Git Strategy

```text
Phase 1 branch: chore/claude-hooks-create-scripts
Phase 2 branch: chore/claude-hooks-update-settings
```

Both use `git add -f` for `.claude/` files. `settings.json` is already tracked.

## Risk

**Low** — only `.claude/` files modified. Hook scripts exit 0 always so they
cannot block Claude Code operations. `worktree-create.sh` only activates on
explicit worktree creation.
