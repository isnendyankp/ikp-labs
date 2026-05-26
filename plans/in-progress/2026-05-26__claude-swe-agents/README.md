# Claude SWE Agents — High Priority

## Overview

Add High Priority Software Engineering (SWE) agents and skills identified in Governance Gap
Round 2 (2026-05-24). These are per-language and per-layer agents that give Claude pre-configured
context for IKP-Labs stack without needing manual briefing each session.

## Objectives

- Add `swe-typescript-dev` — Next.js 15 + TypeScript frontend developer
- Add `swe-java-dev` — Spring Boot 3.2 + Java 17 backend developer
- Add `swe-ui-maker/checker/fixer` — UI component lifecycle triad
- Add `swe-e2e-dev` — Playwright E2E test developer
- Add `swe-code-checker` — cross-language code quality checker
- Add `agent-maker` — meta-agent for creating new agents
- Add 6 corresponding skill files

## Scope

**In-scope:**

- `.claude/agents/swe-typescript-dev.md`
- `.claude/agents/swe-java-dev.md`
- `.claude/agents/swe-ui-maker.md`
- `.claude/agents/swe-ui-checker.md`
- `.claude/agents/swe-ui-fixer.md`
- `.claude/agents/swe-e2e-dev.md`
- `.claude/agents/swe-code-checker.md`
- `.claude/agents/agent-maker.md`
- `.claude/skills/swe-programming-typescript/SKILL.md`
- `.claude/skills/swe-programming-java/SKILL.md`
- `.claude/skills/swe-developing-frontend-ui/SKILL.md`
- `.claude/skills/swe-developing-e2e-test-with-playwright/SKILL.md`
- `.claude/skills/swe-developing-applications-common/SKILL.md`
- `.claude/skills/agent-developing-agents/SKILL.md`
- Update `ideas.md` high-priority section as implemented

**Out-of-scope:**

- Medium/Low priority items from Gap Round 2
- Golang agents (not in IKP-Labs stack)
- OSE-specific patterns not relevant to IKP-Labs

## Key Deliverables

14 files: 8 agents + 6 skills, all adapted to IKP-Labs tech stack.

## Timeline

- Start: 2026-05-26
- Target: 2026-05-26 (single session, meta change)

## Success Criteria

- All 8 agent files created in `.claude/agents/`
- All 6 skill directories created in `.claude/skills/`
- All files adapted to IKP-Labs context (not OSE-specific)
- `ideas.md` high-priority section archived
- PR merged to main
