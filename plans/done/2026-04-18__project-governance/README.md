# Project Governance

> Add a complete 6-layer governance model to IKP-Labs monorepo, covering Vision, Principles, and Conventions (Layers 1-3), integrating them with the existing workflow documentation (Layers 4-5), and adding AI agent guidance.

---

## Overview

IKP-Labs currently has governance at Layers 4-5 (`.workflow-template.md`) and Layer 6 (`plans/`), plus permanent documentation under `docs/`. What is missing are the foundational layers that answer _why_ this project exists, _what values_ guide decisions, and _what shared standards_ apply across all apps consistently.

This plan creates a `governance/` folder at the repo root containing three foundational documents, then wires them into the existing docs and workflow infrastructure.

**The 6-layer governance model being implemented:**

```text
Layer 1 - Vision       governance/vision.md          (NEW)
Layer 2 - Principles   governance/principles.md       (NEW)
Layer 3 - Conventions  governance/conventions.md      (NEW)
Layer 4 - Development  .workflow-template.md          (UPDATE: add references)
Layer 5 - Workflows    .workflow-template.md          (already exists)
Layer 6 - Plans        plans/                         (already exists)
```

---

## Scope

### In Scope

- Create `governance/` folder at repository root
- Create `governance/vision.md` — project purpose, target users, long-term goals
- Create `governance/principles.md` — 5-7 core principles with rationale and examples
- Create `governance/conventions.md` — coding standards, naming, commit format (formalize what is already practiced)
- Create `governance/README.md` — index and entry point for the governance folder
- Update `.workflow-template.md` to reference governance principles in relevant sections
- Create `docs/explanation/governance.md` explaining the 6-layer governance model
- Update `docs/explanation/README.md` to include the new governance explanation doc
- Create `governance/ai-agent-guidelines.md` — how Claude and AI agents should use governance when making decisions

### Out of Scope

- Changing the content of `.workflow-template.md` beyond adding governance references
- Modifying any `apps/` source code
- Creating new Playwright tests or Gherkin specs
- Updating `plans/README.md` index (plan is self-contained)
- Defining team processes, HR policies, or organizational structure
- Versioning or change-log system for governance documents
- Governance enforcement tooling (linters, bots, automated checks)
- Merging or replacing the existing `CONTRIBUTING.md`

---

## Phases

### Phase 1: Foundation (Layer 1-3)

Create the `governance/` folder and its three core documents.

Deliverables:

- `governance/README.md`
- `governance/vision.md`
- `governance/principles.md`
- `governance/conventions.md`

### Phase 2: Integration

Connect the new governance documents to existing infrastructure.

Deliverables:

- Updated `.workflow-template.md` (governance references added)
- New `docs/explanation/governance.md`
- Updated `docs/explanation/README.md`

### Phase 3: AI Agent Governance

Add guidance for AI agents operating within the project.

Deliverables:

- `governance/ai-agent-guidelines.md`

---

## Related Documents

- [Requirements](./requirements.md)
- [Technical Design](./technical-design.md)
- [Checklist](./checklist.md)

---

## References

- `.workflow-template.md` — existing Layer 4/5 governance
- `plans/` — existing Layer 6
- `docs/explanation/` — permanent explanation documentation
- Senior's governance model: `https://github.com/wahidyankf/ose-public/tree/main/governance`

---

**Created**: April 18, 2026
**Status**: In Progress
