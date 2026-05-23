# .claude/skills/

Knowledge modules (skills) loaded by agents at runtime via `permission.skill:`.

---

## Structure

Each skill is a directory containing a single `SKILL.md`:

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

`SKILL.md` holds the domain knowledge injected into the agent's context when that skill is permitted.

---

## Skill Inventory

| Directory                      | Title                        | Used by                          |
| ------------------------------ | ---------------------------- | -------------------------------- |
| `docs-applying-content-quality/` | Documentation Quality Standards | docs triad                  |
| `docs-applying-diataxis-framework/` | Diátaxis Framework        | docs triad                       |
| `plan-creating-project-plans/` | Plan Four-Document System    | plan triad                       |
| `test-coverage-rules/`         | Test Coverage Rules          | specs triad, test triad          |
| `test-playwright-patterns/`    | Playwright Testing Patterns  | specs triad, test triad          |
| `wow-criticality-assessment/`  | Criticality Assessment       | docs triad, plan triad, test triad |

---

## Skill → Agent Mapping

| Skill                          | Agents that use it                                              |
| ------------------------------ | --------------------------------------------------------------- |
| `docs-applying-content-quality`   | `documentation-writer`, `docs-validator`, `docs-fixer`       |
| `docs-applying-diataxis-framework`| `documentation-writer`, `docs-validator`, `docs-fixer`       |
| `plan-creating-project-plans`     | `plan-maker`, `plan-checker`, `plan-fixer`                   |
| `test-coverage-rules`             | `gherkin-spec-writer`, `specs-checker`, `specs-fixer`, `test-maker`, `test-validator`, `test-fixer` |
| `test-playwright-patterns`        | `gherkin-spec-writer`, `specs-checker`, `specs-fixer`, `test-maker`, `test-validator`, `test-fixer` |
| `wow-criticality-assessment`      | `documentation-writer`, `docs-validator`, `docs-fixer`, `plan-maker`, `plan-checker`, `plan-fixer`, `test-maker`, `test-validator`, `test-fixer` |

---

## Maintenance

- **Directory name** uses kebab-case and should reflect domain and purpose.
- The only file inside each skill directory is `SKILL.md`.
- When adding a new skill, declare it under `permission.skill:` in every agent frontmatter that needs it.
- When renaming a skill directory, update all `permission.skill:` references in `../agents/`.

See [AGENTS.md](../../AGENTS.md) for full governance guidelines.
