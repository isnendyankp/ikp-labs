# Technical Design

## Agent Specifications

### swe-typescript-dev

| Field  | Value                                                              |
| ------ | ------------------------------------------------------------------ |
| Model  | `sonnet`                                                           |
| Color  | `purple`                                                           |
| Skills | `swe-programming-typescript`, `swe-developing-applications-common` |

Implements Next.js 15.5 + React 19 + TypeScript frontend code. References
`apps/kameravue-fe/` structure. Uses Jest + React Testing Library (not Vitest).

---

### swe-java-dev

| Field  | Value                                                        |
| ------ | ------------------------------------------------------------ |
| Model  | `sonnet`                                                     |
| Color  | `purple`                                                     |
| Skills | `swe-programming-java`, `swe-developing-applications-common` |

Implements Spring Boot 3.2 + Java 17 backend code. References `apps/kameravue-be/`
structure. Uses JUnit 5 + Mockito + H2 for tests.

---

### swe-ui-maker

| Field  | Value                        |
| ------ | ---------------------------- |
| Model  | `sonnet`                     |
| Color  | `blue`                       |
| Skills | `swe-developing-frontend-ui` |

Creates React + Tailwind 4 UI components. No Storybook, no Radix/CVA (IKP-Labs
uses standard Tailwind components).

---

### swe-ui-checker

| Field  | Value                                                      |
| ------ | ---------------------------------------------------------- |
| Model  | `sonnet`                                                   |
| Color  | `green`                                                    |
| Skills | `swe-developing-frontend-ui`, `wow-criticality-assessment` |

Validates UI components against IKP-Labs Tailwind + accessibility standards.

---

### swe-ui-fixer

| Field  | Value                                                      |
| ------ | ---------------------------------------------------------- |
| Model  | `sonnet`                                                   |
| Color  | `yellow`                                                   |
| Skills | `swe-developing-frontend-ui`, `wow-criticality-assessment` |

Fixes UI issues from checker reports.

---

### swe-e2e-dev

| Field  | Value                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                        |
| Color  | `purple`                                                                        |
| Skills | `swe-developing-e2e-test-with-playwright`, `swe-developing-applications-common` |

Writes Playwright tests. References `tests/e2e/`, `tests/api/`, `specs/` directories.
FE: `http://localhost:3002`, BE: `http://localhost:8081`.

---

### swe-code-checker

| Field  | Value                                                              |
| ------ | ------------------------------------------------------------------ |
| Model  | `sonnet`                                                           |
| Color  | `green`                                                            |
| Skills | `swe-developing-applications-common`, `wow-criticality-assessment` |

Validates TypeScript and Java code quality. Coverage: ≥70% FE, ≥80% BE.

---

### agent-maker

| Field  | Value                                                      |
| ------ | ---------------------------------------------------------- |
| Model  | `sonnet`                                                   |
| Color  | `blue`                                                     |
| Skills | `agent-developing-agents`, `docs-applying-content-quality` |

Creates new agent files following IKP-Labs agent conventions in `.claude/agents/`.

---

## Skill Specifications

| Skill                                     | Content                                       |
| ----------------------------------------- | --------------------------------------------- |
| `swe-programming-typescript`              | TypeScript/Next.js/React coding standards     |
| `swe-programming-java`                    | Java 17/Spring Boot 3.2 coding standards      |
| `swe-developing-frontend-ui`              | Tailwind 4 + React component patterns         |
| `swe-developing-e2e-test-with-playwright` | Playwright patterns for IKP-Labs              |
| `swe-developing-applications-common`      | Common workflow: commits, branches, testing   |
| `agent-developing-agents`                 | Agent frontmatter, model selection, structure |

## IKP-Labs Context (embedded in all agents)

```text
Frontend:  Next.js 15.5.0 + React 19.1.0 + TypeScript + Tailwind CSS 4
           Dev server: http://localhost:3002
           Tests: Jest + React Testing Library, coverage ≥70%

Backend:   Spring Boot 3.2+ + Java 17+ + PostgreSQL + Maven
           REST API: http://localhost:8081
           Tests: JUnit 5 + Mockito + H2, coverage ≥80%

E2E:       Playwright — tests/e2e/, tests/api/, specs/
Commits:   Conventional Commits (feat/fix/docs/test/chore/config)
Branches:  Feature branches → PR → merge to main
```
