# Technical Design

## Agent Specifications

### plan-execution-checker

| Field  | Value                                                       |
| ------ | ----------------------------------------------------------- |
| File   | `.claude/agents/plan-execution-checker.md`                  |
| Model  | `sonnet` (claude-sonnet-4-6)                                |
| Color  | `green`                                                     |
| Skills | `plan-creating-project-plans`, `wow-criticality-assessment` |

**Validation scope:**

1. Requirements coverage — user stories and acceptance criteria implemented
2. Technical alignment — implementation matches documented architecture
3. Delivery completion — all checklist items checked
4. Code quality — standards, tests, documentation maintained
5. Integration validation — end-to-end workflows functional

**Report format:** markdown in `generated-reports/`

---

### web-research-maker

| Field  | Value                                  |
| ------ | -------------------------------------- |
| File   | `.claude/agents/web-research-maker.md` |
| Model  | `sonnet` (claude-sonnet-4-6)           |
| Color  | `blue`                                 |
| Skills | none (read-only research)              |

**Allowed tools:** Read, Glob, Grep, WebFetch, WebSearch only (no Write/Edit/Bash)

**Confidence tags:** `[Verified]`, `[Unverified]`, `[Outdated]`, `[Needs Verification]`

**Output structure:** Summary → Detailed Findings → Resources → Gaps

---

### docs-file-manager

| Field  | Value                                 |
| ------ | ------------------------------------- |
| File   | `.claude/agents/docs-file-manager.md` |
| Model  | `haiku` (claude-haiku-4-5)            |
| Color  | `yellow`                              |
| Skills | none                                  |

**Scope:** `docs/` folder only. Never touches files outside this scope.

**4-phase process:**

1. Discovery & Analysis (Glob + Grep)
2. Planning & Confirmation (user approval for large ops)
3. Execution (git mv / git rm + link updates)
4. Validation (existence check + link spot-check)

**Safety rules:** always `git mv`/`git rm`, never `mv`/`rm`; read before edit; confirm before bulk ops.

## File Naming Convention

All agents follow existing convention:

```text
.claude/agents/<domain>-<role>.md
```

Examples: `plan-execution-checker.md`, `web-research-maker.md`, `docs-file-manager.md`

## IKP-Labs Context to Embed

All agents must reference:

- Frontend: Next.js 15.5.0 + React 19.1.0 + TypeScript + Tailwind CSS 4
- Backend: Spring Boot 3.2+ + Java 17+ + PostgreSQL + Maven
- Dev servers: FE `http://localhost:3002`, BE `http://localhost:8081`
- Plan structure: `plans/in-progress/`, `plans/done/`
- Reports: `generated-reports/`
