#!/bin/bash
# PostToolUse hook — format and lint files after Edit/Write/MultiEdit.
# Markdown: prettier + markdownlint-cli2 (auto-fix)
# Other supported types: prettier only
# Always exits 0 — non-blocking.

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
