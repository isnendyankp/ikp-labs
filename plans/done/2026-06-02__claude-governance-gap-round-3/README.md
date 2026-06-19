# Claude Governance Gap Round 3

**Status**: 🏗️ In Progress
**Created**: 2026-06-02
**Priority**: P1-High (leading items), P2-Medium, P3-Low
**Type**: Infrastructure / Meta

---

## Overview

A third-pass gap analysis comparing IKP-Labs `.claude/` vs `wahidyankf/ose-public` was
performed on 2026-06-02. This plan captures the remaining gaps as actionable deliverables,
organized by priority.

One Critical (Security) item is already done: the env-file access guard implemented in
PR #154 (merged 2026-06-02). All remaining work spans agents, skills, and settings
additions across High, Medium, and Low priority tiers.

## Problem Statement

### Current Gaps

- No repo-harness compatibility checker/fixer agents
- No repo-setup-manager agent
- No `grill-me` interactive review skill
- No Gherkin criteria writing skill
- No Maker-Checker-Fixer pattern guide skill
- No criticality+confidence assessment skill (evaluate overlap with `wow-criticality-assessment`)
- No docs SE-separation validation skill + checker/fixer agents
- No PDF-to-Markdown conversion agent triad
- No tutorial creation agent triad
- No LinkedIn post maker agent
- Several specialized docs skills missing
- OSE primer sync skill missing
- Language extension agents (Go, Rust, C#, F#) missing
- Additional LSP plugins not wired in `settings.json`
- opencode sync permissions not configured

## Scope

### In-Scope

**Critical (Security) — ALREADY DONE:**

- `block-env-file-access.sh` hook + `settings.json` wiring (PR #154)
- `.env*` deny permissions in `settings.json` (PR #154)

**High Priority — Agents:**

- `.claude/agents/repo-harness-compatibility-checker.md`
- `.claude/agents/repo-harness-compatibility-fixer.md`
- `.claude/agents/repo-setup-manager.md`

**High Priority — Skills:**

- `.claude/skills/grill-me/SKILL.md`
- `.claude/skills/plan-writing-gherkin-criteria/SKILL.md`
- `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md`
- `.claude/skills/repo-assessing-criticality-confidence/SKILL.md` (after overlap evaluation)
- `.claude/skills/docs-validating-software-engineering-separation/SKILL.md`
- `.claude/agents/docs-software-engineering-separation-checker.md`
- `.claude/agents/docs-software-engineering-separation-fixer.md`

**Medium Priority — Agents:**

- `.claude/agents/pdf-to-md-maker.md`
- `.claude/agents/pdf-to-md-checker.md`
- `.claude/agents/pdf-to-md-fixer.md`
- `.claude/agents/docs-tutorial-maker.md`
- `.claude/agents/docs-tutorial-checker.md`
- `.claude/agents/docs-tutorial-fixer.md`
- `.claude/agents/social-linkedin-post-maker.md`

**Medium Priority — Skills:**

- `.claude/skills/docs-creating-accessible-diagrams/SKILL.md`
- `.claude/skills/docs-creating-by-example-tutorials/SKILL.md`
- `.claude/skills/docs-creating-in-the-field-tutorials/SKILL.md`
- `.claude/skills/docs-validating-factual-accuracy/SKILL.md`
- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`

**Low Priority — Agents + Skills:**

- `.claude/agents/swe-golang-dev.md`
- `.claude/agents/swe-rust-dev.md`
- `.claude/agents/swe-csharp-dev.md`
- `.claude/agents/swe-fsharp-dev.md`
- `.claude/skills/swe-programming-golang/SKILL.md`
- `.claude/skills/swe-programming-rust/SKILL.md`
- `.claude/skills/swe-programming-csharp/SKILL.md`
- `.claude/skills/swe-programming-fsharp/SKILL.md`

**Low Priority — Settings:**

- `settings.json` additions: `gopls-lsp`, `rust-analyzer-lsp`, `pyright-lsp`, `kotlin-lsp`,
  `lua-lsp`, `swift-lsp`, `frontend-design` LSP plugins
- `settings.json` opencode sync permissions

**Housekeeping:**

- Mark Critical items done in `plans/ideas.md`
- Update `plans/README.md` index

### Out-of-Scope

- Changes to existing agents or skills (no editing of Round 2 deliverables)
- Application feature work (KameraVue frontend/backend)
- CI/CD pipeline changes
- Documentation in `docs/` (only `.claude/` meta files)
- ose-public patterns not applicable to IKP-Labs stack (e.g., Nx-specific agents)
- Overlap resolution with `wow-criticality-assessment` beyond a simple evaluation note

## Dependencies

- PR #154 merged (env-file guard) — already satisfied

## Success Criteria

- All High Priority agents and skills created with correct frontmatter
- All Medium Priority agents and skills created
- All Low Priority agents, skills, and settings additions applied
- `plans/ideas.md` Round 3 section marked as implemented
- All new files pass markdown lint

## Documents

- [requirements.md](./requirements.md) — Functional requirements per priority tier
- [technical-design.md](./technical-design.md) — File specifications and patterns
- [checklist.md](./checklist.md) — Step-by-step tasks with acceptance criteria
