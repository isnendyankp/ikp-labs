# Technical Design: Claude Skills Subdirectory Restructure

## Approach

Two-phase pure restructure. No content changes. Phase 1 moves files; Phase 2 updates references.

## Target Structure

```text
.claude/skills/
├── docs-applying-diataxis-framework/
│   └── SKILL.md
├── docs-applying-content-quality/
│   └── SKILL.md
├── plan-creating-project-plans/
│   └── SKILL.md
├── test-coverage-rules/
│   └── SKILL.md
├── test-playwright-patterns/
│   └── SKILL.md
└── wow-criticality-assessment/
    └── SKILL.md
```

## Phase 1 — File Operations

`.claude` is in `.gitignore` — all new files need `git add -f`.

```bash
# Create subdirs and move content (git cannot track directory renames for .claude)
# For each skill: mkdir + copy content + git add -f + git rm old file

mkdir .claude/skills/docs-applying-diataxis-framework/
cp .claude/skills/docs__diataxis-framework.md \
   .claude/skills/docs-applying-diataxis-framework/SKILL.md

mkdir .claude/skills/docs-applying-content-quality/
cp .claude/skills/docs__quality-standards.md \
   .claude/skills/docs-applying-content-quality/SKILL.md

mkdir .claude/skills/plan-creating-project-plans/
cp .claude/skills/plan__four-doc-system.md \
   .claude/skills/plan-creating-project-plans/SKILL.md

mkdir .claude/skills/test-coverage-rules/
cp .claude/skills/test__coverage-rules.md \
   .claude/skills/test-coverage-rules/SKILL.md

mkdir .claude/skills/test-playwright-patterns/
cp .claude/skills/test__playwright-patterns.md \
   .claude/skills/test-playwright-patterns/SKILL.md

mkdir .claude/skills/wow-criticality-assessment/
cp .claude/skills/wow__criticality-assessment.md \
   .claude/skills/wow-criticality-assessment/SKILL.md
```

## Phase 2 — Agent Reference Updates

12 agents have `permission.skill:` frontmatter. All `__` references replaced with new names.

| Old Reference                 | New Reference                      |
| ----------------------------- | ---------------------------------- |
| `docs__diataxis-framework`    | `docs-applying-diataxis-framework` |
| `docs__quality-standards`     | `docs-applying-content-quality`    |
| `plan__four-doc-system`       | `plan-creating-project-plans`      |
| `test__coverage-rules`        | `test-coverage-rules`              |
| `test__playwright-patterns`   | `test-playwright-patterns`         |
| `wow__criticality-assessment` | `wow-criticality-assessment`       |

Agents to update (all 12):

```text
docs-maker, docs-checker, docs-fixer
plan-maker, plan-checker, plan-fixer
test-maker, test-checker, test-fixer
specs-maker, specs-checker, specs-fixer
```

## Git Strategy

```text
Phase 1 branch: chore/claude-skills-migrate-files
Phase 2 branch: chore/claude-skills-update-refs
```

Both use `chore` type. Phase 2 branch created from main after Phase 1 is merged.

## Risk

**Low** — only `.claude/` files modified, no app code touched.

One risk: `permission.skill:` references that still use old names after Phase 1 will silently
fail to load skills. Mitigated by Phase 2 immediately following Phase 1.
