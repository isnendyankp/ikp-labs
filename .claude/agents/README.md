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

### PDF to Markdown

| File                   | Agent name          | Role    |
| ---------------------- | ------------------- | ------- |
| `pdf-to-md-maker.md`   | `pdf-to-md-maker`   | Maker   |
| `pdf-to-md-checker.md` | `pdf-to-md-checker` | Checker |
| `pdf-to-md-fixer.md`   | `pdf-to-md-fixer`   | Fixer   |

Skills used: `docs-applying-content-quality`, `repo-assessing-criticality-confidence`, `repo-applying-maker-checker-fixer`

### Readme

| File               | Agent name       | Role    |
| ------------------ | ---------------- | ------- |
| `readme-maker.md`  | `readme-maker`   | Maker   |
| `readme-checker.md`| `readme-checker` | Checker |
| `readme-fixer.md`  | `readme-fixer`   | Fixer   |

Skills used: `readme-writing-readme-files`, `wow-criticality-assessment`

### CI

| File             | Agent name   | Role    |
| ---------------- | ------------ | ------- |
| `ci-checker.md`  | `ci-checker` | Checker |
| `ci-fixer.md`    | `ci-fixer`   | Fixer   |

Skills used: `ci-standards`, `wow-criticality-assessment`

> No Maker in this domain — CI workflows are authored manually; agents only validate and fix.

### Repo Rules

| File                    | Agent name          | Role    |
| ----------------------- | ------------------- | ------- |
| `repo-rules-maker.md`   | `repo-rules-maker`  | Maker   |
| `repo-rules-checker.md` | `repo-rules-checker`| Checker |
| `repo-rules-fixer.md`   | `repo-rules-fixer`  | Fixer   |

Skills used: `repo-understanding-repository-architecture`, `repo-generating-validation-reports`, `wow-criticality-assessment`

### Repo Workflow

| File                       | Agent name             | Role    |
| -------------------------- | ---------------------- | ------- |
| `repo-workflow-maker.md`   | `repo-workflow-maker`  | Maker   |
| `repo-workflow-checker.md` | `repo-workflow-checker`| Checker |
| `repo-workflow-fixer.md`   | `repo-workflow-fixer`  | Fixer   |

Skills used: `repo-defining-workflows`, `repo-practicing-trunk-based-development`, `repo-understanding-repository-architecture`, `wow-criticality-assessment`

### Repo Harness Compatibility

| File                                  | Agent name                       | Role    |
| ------------------------------------- | -------------------------------- | ------- |
| `repo-harness-compatibility-checker.md` | `repo-harness-compatibility-checker` | Checker |
| `repo-harness-compatibility-fixer.md`  | `repo-harness-compatibility-fixer`   | Fixer   |

Skills used: `repo-understanding-repository-architecture`, `wow-criticality-assessment`

> No Maker in this domain — harness config is authored manually; agents only validate and fix.

### SWE UI

| File                 | Agent name      | Role    |
| -------------------- | --------------- | ------- |
| `swe-ui-maker.md`    | `swe-ui-maker`  | Maker   |
| `swe-ui-checker.md`  | `swe-ui-checker`| Checker |
| `swe-ui-fixer.md`    | `swe-ui-fixer`  | Fixer   |

Skills used: `swe-developing-frontend-ui`, `swe-programming-typescript`, `wow-criticality-assessment`

### SWE Dev (Standalone)

Specialised developer agents — not a triad; each targets a specific stack layer.

| File                    | Agent name          | Role / Stack              |
| ----------------------- | ------------------- | ------------------------- |
| `swe-typescript-dev.md` | `swe-typescript-dev`| Next.js / TypeScript      |
| `swe-java-dev.md`       | `swe-java-dev`      | Spring Boot / Java        |
| `swe-e2e-dev.md`        | `swe-e2e-dev`       | Playwright E2E / API      |
| `swe-code-checker.md`   | `swe-code-checker`  | Cross-stack code quality  |

Skills used: `swe-programming-typescript`, `swe-programming-java`, `swe-developing-e2e-test-with-playwright`, `swe-developing-applications-common`, `wow-criticality-assessment`

### Standalone Utility Agents

Single-purpose agents that do not belong to a triad.

| File                             | Agent name                   | Purpose                                        |
| -------------------------------- | ---------------------------- | ---------------------------------------------- |
| `agent-maker.md`                 | `agent-maker`                | Create new Claude Code agent files             |
| `docs-file-manager.md`           | `docs-file-manager`          | Safe file management inside `docs/`            |
| `plan-execution-checker.md`      | `plan-execution-checker`     | Final quality gate before archiving plans      |
| `repo-setup-manager.md`          | `repo-setup-manager`         | Set up fresh repo clone for local development  |
| `social-linkedin-post-maker.md`  | `social-linkedin-post-maker` | Generate LinkedIn posts from PRs or progress   |
| `web-research-maker.md`          | `web-research-maker`         | Isolated web research with confidence tagging  |

Skills used: `agent-developing-agents`, `docs-applying-content-quality`, `plan-creating-project-plans`, `repo-understanding-repository-architecture`, `repo-applying-maker-checker-fixer`, `wow-criticality-assessment`

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
