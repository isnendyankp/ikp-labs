#!/bin/bash
# PreToolUse hook — warm Nx cache before git push.
# Mirrors .husky/pre-push (typecheck + lint + test) so the actual
# pre-push hook hits cached results and completes in seconds.
# Always exits 0 — cache warming only, not a quality gate.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only intercept git push commands
if ! echo "$COMMAND" | grep -qE '^\s*git\s+push\b'; then
  exit 0
fi

echo "Warming Nx cache before push (mirrors .husky/pre-push)..." >&2

PARALLEL=$(( $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4) - 1 ))

npx nx affected -t typecheck --base=origin/main --parallel="$PARALLEL" 2>&1 || true
npx nx affected -t lint --base=origin/main --parallel="$PARALLEL" 2>&1 || true
npx nx affected -t test --base=origin/main --parallel="$PARALLEL" 2>&1 || true

echo "Cache warming complete. Pre-push hook should now hit cache." >&2

exit 0
