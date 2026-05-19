# Requirements: Claude Agents Maker/Checker/Fixer Triad

## Problem Statement

`.claude/agents/` uses inconsistent naming and has incomplete role coverage per domain.
Agents cannot be discovered predictably, and some roles (fixer, maker) are missing entirely.

## Goals

1. All 4 domains have a complete triad: `{domain}-maker`, `{domain}-checker`, `{domain}-fixer`
2. Naming is consistent — no more `plan-writer`, `documentation-writer`, `gherkin-spec-writer`
3. Each phase is an independent, reversible PR
4. No agent behavior changes — only renaming and filling gaps

## Current State vs Target State

### `plan` Domain

| Role    | Current        | Target                     |
| ------- | -------------- | -------------------------- |
| maker   | `plan-writer`  | `plan-maker`               |
| checker | `plan-checker` | `plan-checker` (no change) |
| fixer   | ❌ missing     | `plan-fixer`               |

### `docs` Domain

| Role    | Current                | Target         |
| ------- | ---------------------- | -------------- |
| maker   | `documentation-writer` | `docs-maker`   |
| checker | `docs-validator`       | `docs-checker` |
| fixer   | ❌ missing             | `docs-fixer`   |

### `test` Domain

| Role    | Current          | Target         |
| ------- | ---------------- | -------------- |
| maker   | ❌ missing       | `test-maker`   |
| checker | `test-validator` | `test-checker` |
| fixer   | ❌ missing       | `test-fixer`   |

### `specs` Domain

| Role    | Current               | Target          |
| ------- | --------------------- | --------------- |
| maker   | `gherkin-spec-writer` | `specs-maker`   |
| checker | ❌ missing            | `specs-checker` |
| fixer   | ❌ missing            | `specs-fixer`   |

## Acceptance Criteria

### Phase 1 — `plan` Domain

- [ ] `.claude/agents/plan-maker.md` exists (renamed from `plan-writer.md`)
- [ ] `.claude/agents/plan-writer.md` no longer exists
- [ ] `.claude/agents/plan-checker.md` unchanged
- [ ] `.claude/agents/plan-fixer.md` exists (new)
- [ ] All 3 agent frontmatter `name:` fields match their filename (without `.md`)
- [ ] CI passes

### Phase 2 — `docs` Domain

- [ ] `.claude/agents/docs-maker.md` exists (renamed from `documentation-writer.md`)
- [ ] `.claude/agents/docs-checker.md` exists (renamed from `docs-validator.md`)
- [ ] `.claude/agents/documentation-writer.md` no longer exists
- [ ] `.claude/agents/docs-validator.md` no longer exists
- [ ] `.claude/agents/docs-fixer.md` exists (new)
- [ ] All 3 agent frontmatter `name:` fields match filename
- [ ] CI passes

### Phase 3 — `test` Domain

- [ ] `.claude/agents/test-checker.md` exists (renamed from `test-validator.md`)
- [ ] `.claude/agents/test-validator.md` no longer exists
- [ ] `.claude/agents/test-maker.md` exists (new)
- [ ] `.claude/agents/test-fixer.md` exists (new)
- [ ] All 3 agent frontmatter `name:` fields match filename
- [ ] CI passes

### Phase 4 — `specs` Domain

- [ ] `.claude/agents/specs-maker.md` exists (renamed from `gherkin-spec-writer.md`)
- [ ] `.claude/agents/gherkin-spec-writer.md` no longer exists
- [ ] `.claude/agents/specs-checker.md` exists (new)
- [ ] `.claude/agents/specs-fixer.md` exists (new)
- [ ] All 3 agent frontmatter `name:` fields match filename
- [ ] CI passes

## Constraints

- Each phase must be a separate PR — no combining phases
- Agent content (body/responsibilities) must be preserved on renames
- New agents must follow the same frontmatter schema as existing agents
- No app source code changes — meta/docs only
