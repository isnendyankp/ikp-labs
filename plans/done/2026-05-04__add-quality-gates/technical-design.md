# Technical Design

## Architecture Overview

This plan adds two independent quality gates:

1. **Markdown linting** — Runs on pre-commit (via lint-staged)
2. **Pre-push hook** — Runs typecheck, lint, test before push

Both integrate with existing Husky + Nx infrastructure.

---

## File Structure

### New Files

```text
/.markdownlint-cli2.jsonc       # Markdown linting config
/.markdownlintignore            # Ignore patterns for markdown linting
/.husky/pre-push                # Pre-push git hook script
```

### Modified Files

```text
/package.json                   # Add scripts and dependencies
```

---

## Implementation Details

### 1. Markdown Linting Config

**File: `.markdownlint-cli2.jsonc`**

```jsonc
{
  "config": {
    "default": true,
    "MD013": false,
    "MD033": false,
    "MD041": false,
  },
  "globs": ["**/*.md"],
  "ignores": ["node_modules", "**/node_modules", "apps/**/node_modules"],
}
```

**Rules disabled:**

- `MD013` — Line length (too restrictive for docs)
- `MD033` — Inline HTML (needed for advanced formatting)
- `MD041` — First line heading (not always applicable)

**File: `.markdownlintignore`**

```text
node_modules/
**/node_modules/
.nx/
apps/**/dist/
apps/**/build/
```

---

### 2. Package.json Changes

**Add to `devDependencies`:**

```json
{
  "markdownlint-cli2": "^0.14.0"
}
```

**Add to `scripts`:**

```json
{
  "lint:md": "markdownlint-cli2 \"**/*.md\"",
  "typecheck": "nx run-many -t typecheck",
  "test:quick": "nx run-many -t test"
}
```

**Update `lint-staged`:**

```json
{
  "lint-staged": {
    "apps/kameravue-fe/**/*.{js,jsx,ts,tsx}": [
      "npx eslint --fix",
      "npx prettier --write"
    ],
    "apps/kameravue-fe/**/*.{json,md,css}": ["npx prettier --write"],
    "**/*.md": ["markdownlint-cli2 --fix"]
  }
}
```

---

### 3. Pre-push Hook

**File: `.husky/pre-push`**

```bash
#!/bin/sh
# Pre-push hook
# Run typecheck, lint, and test:quick for affected projects
# This prevents pushing broken code to remote

echo "🔍 Running pre-push checks..."

# Typecheck
echo "📝 Typechecking affected projects..."
npx nx affected -t typecheck --base=origin/main || exit 1

# Lint
echo "🧹 Linting affected projects..."
npx nx affected -t lint --base=origin/main || exit 1

# Test (quick)
echo "🧪 Running tests for affected projects..."
npx nx affected -t test --base=origin/main || exit 1

echo "✅ Pre-push checks passed!"
```

**Note:** Uses `nx affected` to only check changed projects, not entire monorepo.

---

## Integration Points

### Existing Infrastructure

| Component   | Status        | Integration                    |
| ----------- | ------------- | ------------------------------ |
| Husky       | ✅ Installed  | Add new pre-push hook          |
| lint-staged | ✅ Configured | Add markdown linting           |
| Nx          | ✅ Installed  | Use `nx affected` for pre-push |
| commitlint  | ✅ Active     | No changes needed              |

### Workflow Integration

```text
Developer workflow:
1. Make changes
2. git add .
3. git commit -m "..."
   └─> pre-commit hook runs (lint-staged + markdown linting)
4. git push
   └─> pre-push hook runs (typecheck + lint + test for affected)
```

---

## Testing Strategy

### Markdown Linting

1. Run `npm run lint:md` on existing markdown files
2. Fix any violations or document exceptions
3. Test pre-commit integration with sample markdown change

### Pre-push Hook

1. Make a change to frontend code
2. Attempt to push
3. Verify typecheck, lint, and test run
4. Test with intentional error to verify hook blocks push
5. Test `--no-verify` bypass

---

## Rollback Plan

If issues arise:

1. Remove `.husky/pre-push` to disable pre-push checks
2. Remove markdown linting from `lint-staged` in package.json
3. Revert package.json changes
4. Remove config files

All changes are additive and can be safely removed.

---

## Reference Implementation

Based on `wahidyankf/ose-public` repo:

- `.markdownlint-cli2.jsonc` — Similar config
- `.husky/` hooks — Similar pattern
- `package.json` scripts — Similar naming

---

## Future Enhancements

- Add markdown linting to CI/CD pipeline
- Add test coverage threshold enforcement (≥90%)
- Add commit message length check to pre-push
- Add branch name validation
