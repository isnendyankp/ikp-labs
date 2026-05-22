# Requirements: Claude Settings Hardening

## Problem Statement

`settings.json` has no `permissions` or `enabledPlugins`. Every `.claude/` file
access and Bash command triggers a permission prompt. No LSP integrations active.

## Goals

1. `permissions.allow` reduces prompts for common safe operations
2. `enabledPlugins` activates LSP and tools matching IKP-Labs stack
3. `extraKnownMarketplaces` enables Nx plugin marketplace

## Acceptance Criteria

- [ ] `permissions.allow` includes: `Read/Write/Edit(.claude/**)`, `Bash`,
      `Write/Read(/tmp/**)`, `Skill(update-config)`
- [ ] `enabledPlugins` includes: `typescript-lsp`, `jdtls-lsp`, `playwright`,
      `context7`, `nx` (all `@claude-plugins-official` or `@nx-claude-plugins`)
- [ ] `extraKnownMarketplaces` includes nx marketplace source
- [ ] Existing hooks section unchanged
- [ ] CI passes

## Plugin Justification

| Plugin           | Source            | Reason                              |
| ---------------- | ----------------- | ----------------------------------- |
| `typescript-lsp` | official          | Next.js 15 + TypeScript strict mode |
| `jdtls-lsp`      | official          | Spring Boot Java 17+                |
| `playwright`     | official          | E2E + API tests                     |
| `context7`       | official          | Up-to-date library docs in context  |
| `nx`             | nx-claude-plugins | Nx monorepo task runner             |

Excluded: `pyright-lsp`, `rust-analyzer-lsp`, `gopls-lsp`, `kotlin-lsp`,
`lua-lsp`, `swift-lsp`, `frontend-design` — no corresponding tech in IKP-Labs.
