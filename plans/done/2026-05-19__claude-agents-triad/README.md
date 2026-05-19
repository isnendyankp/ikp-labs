# Plan: Claude Agents Maker/Checker/Fixer Triad

## Overview

Refactor `.claude/agents/` to adopt the consistent `{domain}-maker`, `{domain}-checker`,
`{domain}-fixer` naming pattern used by `wahidyankf/ose-public`. This involves renaming
existing agents and creating missing ones across 4 domains.

**Motivation**: Current agents have inconsistent naming (`plan-writer`, `documentation-writer`,
`docs-validator`, etc.) and incomplete triads. Senior repo uses a systematic maker/checker/fixer
pattern that makes agent roles self-evident and coverage complete.

## Scope

### In Scope

- Rename 5 existing agents to match triad naming convention
- Create 7 new agents (missing maker/checker/fixer roles per domain)
- Each of the 4 domains gets a complete triad: maker + checker + fixer

### Out of Scope

- Changing agent behavior/content (only metadata: name, description, frontmatter)
- Skills restructuring (separate gap item)
- Hooks or settings.json changes (separate gap items)
- Adding new domains beyond the 4 existing ones

## 4 Phases

| Phase   | Domain  | Work                                                                                                 |
| ------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Phase 1 | `plan`  | Rename `plan-writer` → `plan-maker`; create `plan-fixer`                                             |
| Phase 2 | `docs`  | Rename `documentation-writer` → `docs-maker`, `docs-validator` → `docs-checker`; create `docs-fixer` |
| Phase 3 | `test`  | Rename `test-validator` → `test-checker`; create `test-maker`, `test-fixer`                          |
| Phase 4 | `specs` | Rename `gherkin-spec-writer` → `specs-maker`; create `specs-checker`, `specs-fixer`                  |

Each phase = 1 PR. Independent. Safe to rollback without affecting other phases.

## Status

**Phase**: In Progress
**Created**: 2026-05-19
**Target**: 4 PRs, one per domain

## Related

- Gap source: `plans/ideas.md` — 2026-05-18 entry
- Senior reference: `wahidyankf/ose-public` `.claude/agents/`
- Agent files: `.claude/agents/`
