# Claude Low Priority Agents

## Overview

Add three low-priority Claude agents identified in the Governance Gap Round 2 analysis
(2026-05-24): `plan-execution-checker`, `web-research-maker`, and `docs-file-manager`.
These complete the gap analysis items not yet present in IKP-Labs compared to OSE-public.

Note: `frontend-design@claude-plugins-official` is an external plugin — not buildable
internally, skipped.

## Objectives

- Add `plan-execution-checker` agent: final quality gate before marking plans complete
- Add `web-research-maker` agent: isolated web research with cited findings
- Add `docs-file-manager` agent: safe file/directory management inside `docs/`

## Scope

**In-scope:**

- `.claude/agents/plan-execution-checker.md`
- `.claude/agents/web-research-maker.md`
- `.claude/agents/docs-file-manager.md`
- Update `ideas.md` to archive implemented items

**Out-of-scope:**

- Plugin `frontend-design@claude-plugins-official` (external dependency)
- Any High/Medium priority agents from Gap Round 2

## Key Deliverables

1. `plan-execution-checker.md` — validates execution matches plan
2. `web-research-maker.md` — read-only web research agent
3. `docs-file-manager.md` — safe docs file management agent

## Timeline

- Start: 2026-05-25
- Target: 2026-05-25 (single session, meta change)

## Success Criteria

- All 3 agent files created in `.claude/agents/`
- Agents adapted to IKP-Labs tech stack context
- `ideas.md` low-priority items archived
- PR merged to main
