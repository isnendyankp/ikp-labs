# .claude/agents/

Custom Claude Code agents for this repository.

---

## Triad Model

Each domain follows a **maker → checker → fixer** triad:

| Role    | Responsibility                          | Color  |
| ------- | --------------------------------------- | ------ |
| Maker   | Create or update artifacts from scratch | Purple |
| Checker | Validate quality and completeness       | Blue   |
| Fixer   | Repair issues reported by the checker   | Orange |

---

## Agent Inventory

### Docs

| File             | Agent name            | Role    |
| ---------------- | --------------------- | ------- |
| `docs-maker.md`  | `documentation-writer`| Maker   |
| `docs-checker.md`| `docs-validator`      | Checker |
| `docs-fixer.md`  | `docs-fixer`          | Fixer   |

Skills used: `docs-applying-content-quality`, `docs-applying-diataxis-framework`, `wow-criticality-assessment`

### Plan

| File             | Agent name   | Role    |
| ---------------- | ------------ | ------- |
| `plan-maker.md`  | `plan-maker` | Maker   |
| `plan-checker.md`| `plan-checker`| Checker |
| `plan-fixer.md`  | `plan-fixer` | Fixer   |

Skills used: `plan-creating-project-plans`, `wow-criticality-assessment`

### Specs

| File              | Agent name          | Role    |
| ----------------- | ------------------- | ------- |
| `specs-maker.md`  | `gherkin-spec-writer`| Maker  |
| `specs-checker.md`| `specs-checker`     | Checker |
| `specs-fixer.md`  | `specs-fixer`       | Fixer   |

Skills used: `test-coverage-rules`, `test-playwright-patterns`, `wow-criticality-assessment`

### Test

| File              | Agent name      | Role    |
| ----------------- | --------------- | ------- |
| `test-maker.md`   | `test-maker`    | Maker   |
| `test-checker.md` | `test-validator`| Checker |
| `test-fixer.md`   | `test-fixer`    | Fixer   |

Skills used: `test-coverage-rules`, `test-playwright-patterns`, `wow-criticality-assessment`

### Docs Link

| File                    | Agent name          | Role    |
| ----------------------- | ------------------- | ------- |
| `docs-link-checker.md`  | `docs-link-checker` | Checker |
| `docs-link-fixer.md`    | `docs-link-fixer`   | Fixer   |

Skills used: `docs-validating-links`, `wow-criticality-assessment`

> No Maker in this domain — links are created as part of writing docs, not as a standalone artifact.

### Readme

| File               | Agent name       | Role    |
| ------------------ | ---------------- | ------- |
| `readme-maker.md`  | `readme-maker`   | Maker   |
| `readme-checker.md`| `readme-checker` | Checker |
| `readme-fixer.md`  | `readme-fixer`   | Fixer   |

Skills used: `readme-writing-readme-files`, `wow-criticality-assessment`

---

## Usage

Claude Code picks the right agent automatically based on the task. You can also invoke an agent explicitly:

```text
Use the plan-checker agent to validate my plan.
```

---

## Maintenance

- **File name** follows `<domain>-<role>.md` (e.g., `docs-maker.md`).
- **Agent `name:`** in frontmatter is the identifier Claude Code uses — keep it unique.
- When adding a new domain, add all three triad members at once.
- Skills are declared in the frontmatter under `permission.skill:` — keep them in sync with `../skills/`.

See [AGENTS.md](../../AGENTS.md) for full governance guidelines.
