# Plan: Claude Settings Hardening

## Overview

Add `permissions.allow` allowlist and `enabledPlugins` to `.claude/settings.json`,
aligned with `wahidyankf/ose-public` pattern. Reduces permission prompts and enables
LSP + tool integrations relevant to IKP-Labs stack.

**Motivation**: Gap #4 from governance gap analysis (2026-05-18). Current `settings.json`
has hooks only — no permissions or plugins configured.

## Scope

### In Scope

- Add `permissions.allow` — explicit allowlist for `.claude/`, `Bash`, `/tmp/`
- Add `enabledPlugins` — TypeScript LSP, Java LSP, Playwright, Context7, Nx
- Add `extraKnownMarketplaces` — Nx plugin marketplace

### Out of Scope

- Changing hooks (done in Gap #3)
- Adding agents or skills
- Modifying app source code

## 1 Phase

Single PR — all changes to `settings.json` are atomic and low-risk.

## Status

**Phase**: In Progress
**Created**: 2026-05-22
**Target**: 1 PR

## Related

- Gap source: `plans/ideas.md` — 2026-05-18 entry (Gap #4)
- Senior reference: `wahidyankf/ose-public` `.claude/settings.json`
