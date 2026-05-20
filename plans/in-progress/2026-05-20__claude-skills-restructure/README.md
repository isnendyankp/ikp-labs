# Plan: Claude Skills Subdirectory Restructure

## Overview

Migrate `.claude/skills/` from flat `domain__topic.md` files to subdirectory structure
`{name}/SKILL.md`, aligned with `wahidyankf/ose-public` pattern. Also update all agent
`permission.skill:` frontmatter references to match new names.

**Motivation**: Gap #2 from governance gap analysis (2026-05-18). Flat files are not
discoverable and don't support future `reference/` subdirs per skill.

## Scope

### In Scope

- Move 6 skill files into subdirectory structure
- Rename skills from `domain__topic` → `domain-verb-noun` convention
- Update all 12 agent `permission.skill:` references to new names
- No skill content changes — pure restructure

### Out of Scope

- Adding new skills
- Adding `reference/` subdirs inside skill folders (future work)
- Changing agent body content
- hooks or settings.json changes (separate gap items)

## Naming Map

| Current File                     | New Path                                    |
| -------------------------------- | ------------------------------------------- |
| `docs__diataxis-framework.md`    | `docs-applying-diataxis-framework/SKILL.md` |
| `docs__quality-standards.md`     | `docs-applying-content-quality/SKILL.md`    |
| `plan__four-doc-system.md`       | `plan-creating-project-plans/SKILL.md`      |
| `test__coverage-rules.md`        | `test-coverage-rules/SKILL.md`              |
| `test__playwright-patterns.md`   | `test-playwright-patterns/SKILL.md`         |
| `wow__criticality-assessment.md` | `wow-criticality-assessment/SKILL.md`       |

## 2 Phases

| Phase   | Work                                            |
| ------- | ----------------------------------------------- |
| Phase 1 | Migrate 6 skill files to subdirectory structure |
| Phase 2 | Update 12 agent `permission.skill:` references  |

Each phase = 1 PR. Phase 2 depends on Phase 1 being merged first.

## Status

**Phase**: In Progress
**Created**: 2026-05-20
**Target**: 2 PRs

## Related

- Gap source: `plans/ideas.md` — 2026-05-18 entry (Gap #2)
- Senior reference: `wahidyankf/ose-public` `.claude/skills/`
