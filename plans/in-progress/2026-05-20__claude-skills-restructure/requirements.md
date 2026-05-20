# Requirements: Claude Skills Subdirectory Restructure

## Problem Statement

`.claude/skills/` uses flat files with `domain__topic.md` naming. This is not discoverable,
inconsistent with senior repo conventions, and doesn't support future `reference/` subdirs.

## Goals

1. All 6 skill files live in `{name}/SKILL.md` subdirectory structure
2. Naming follows `domain-verb-noun` convention (no `__` separator)
3. All 12 agent `permission.skill:` references updated to new names
4. No skill content lost — pure restructure

## Acceptance Criteria

### Phase 1 — Skill File Migration

- [ ] `docs-applying-diataxis-framework/SKILL.md` exists (content from `docs__diataxis-framework.md`)
- [ ] `docs-applying-content-quality/SKILL.md` exists (content from `docs__quality-standards.md`)
- [ ] `plan-creating-project-plans/SKILL.md` exists (content from `plan__four-doc-system.md`)
- [ ] `test-coverage-rules/SKILL.md` exists (content from `test__coverage-rules.md`)
- [ ] `test-playwright-patterns/SKILL.md` exists (content from `test__playwright-patterns.md`)
- [ ] `wow-criticality-assessment/SKILL.md` exists (content from `wow__criticality-assessment.md`)
- [ ] All 6 old flat files no longer exist
- [ ] CI passes

### Phase 2 — Agent Reference Updates

- [ ] All 12 agents updated: `docs__diataxis-framework` → `docs-applying-diataxis-framework`
- [ ] All 12 agents updated: `docs__quality-standards` → `docs-applying-content-quality`
- [ ] All 12 agents updated: `plan__four-doc-system` → `plan-creating-project-plans`
- [ ] All 12 agents updated: `test__coverage-rules` → `test-coverage-rules`
- [ ] All 12 agents updated: `test__playwright-patterns` → `test-playwright-patterns`
- [ ] All 12 agents updated: `wow__criticality-assessment` → `wow-criticality-assessment`
- [ ] No agent frontmatter still references old `__` skill names
- [ ] CI passes

## Constraints

- Phase 2 must run after Phase 1 is merged
- No content changes — only filenames, paths, and frontmatter references
- No app source code modified
