# Requirements

## Functional Requirements

### FR-1: SWE Language Agents

- `swe-typescript-dev` — implements TypeScript/Next.js code following IKP-Labs standards
- `swe-java-dev` — implements Java/Spring Boot code following IKP-Labs standards

### FR-2: SWE UI Triad

- `swe-ui-maker` — creates React/Tailwind UI components following IKP-Labs conventions
- `swe-ui-checker` — validates UI components against IKP-Labs standards
- `swe-ui-fixer` — fixes UI issues found by checker

### FR-3: SWE Testing and Quality

- `swe-e2e-dev` — writes Playwright E2E and API tests for IKP-Labs
- `swe-code-checker` — validates code quality across TypeScript and Java

### FR-4: Meta Agent

- `agent-maker` — creates new agent files following IKP-Labs agent conventions

### FR-5: Supporting Skills

Each agent must have corresponding skill files providing coding standards and patterns.

## Non-Functional Requirements

- NFR-1: All agents adapted to IKP-Labs stack — no OSE/Golang/Nx references
- NFR-2: Model selection appropriate to task (sonnet for complex, haiku for simple)
- NFR-3: Skills reference IKP-Labs paths (apps/kameravue-fe, apps/kameravue-be, etc.)
- NFR-4: Test coverage thresholds: ≥70% frontend, ≥80% backend

## Acceptance Criteria

- [ ] 8 agent files in `.claude/agents/` with correct frontmatter
- [ ] 6 skill directories in `.claude/skills/` each with `SKILL.md`
- [ ] No OSE-specific content (Open Sharia, Nx, Golang) in IKP-Labs files
- [ ] All agents reference IKP-Labs tech stack
- [ ] `ideas.md` high-priority items archived
- [ ] Markdown lint passes on all files

## Constraints & Assumptions

- Meta change: no code compilation or testing needed
- Adapted from OSE-public, stripped to IKP-Labs context
- IKP-Labs uses Jest (not Vitest), Maven (not Gradle), H2 for test DB
- Branch-based workflow (not trunk-based like OSE)
