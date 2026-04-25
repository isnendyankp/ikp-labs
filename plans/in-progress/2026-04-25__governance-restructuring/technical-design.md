# Technical Design: Governance Restructuring

## Approach

Pure reorganization — `git mv` existing files, create index `README.md` files, update cross-references. No content changes to existing docs.

## File Movement Map

| From | To |
|------|----|
| `governance/vision.md` | `governance/vision/ikp-labs.md` |
| `governance/principles.md` | `governance/principles/general.md` |
| `governance/conventions.md` | `governance/conventions/development.md` |
| `governance/ai-agent-guidelines.md` | `governance/development/agents/ai-agent-guidelines.md` |
| `.workflow-template.md` (copy content) | `governance/development/workflow/implementation.md` |

> `.workflow-template.md` at root is **kept** as a symlink/alias doc pointing to the new path — many agents and humans reference it directly. Content lives in `governance/development/workflow/implementation.md`.

## New Files to Create

| File | Content |
|------|---------|
| `governance/vision/README.md` | Index listing `ikp-labs.md` with one-line desc |
| `governance/principles/README.md` | Index listing `general.md` |
| `governance/conventions/README.md` | Index listing `development.md` |
| `governance/development/README.md` | Index listing `workflow/` and `agents/` |
| `governance/development/workflow/README.md` | Index listing `implementation.md` |
| `governance/development/agents/README.md` | Index listing `ai-agent-guidelines.md` |
| `governance/workflows/README.md` | Placeholder — future plan/CI workflow docs |
| `governance/repository-governance-architecture.md` | 6-layer model explanation (from `docs/explanation/governance.md`) |

## Files to Update (Cross-References)

| File | What changes |
|------|-------------|
| `governance/README.md` | Rewrite to list new folder structure |
| `governance/development/agents/ai-agent-guidelines.md` | Update governance consultation order table — paths change |
| `AGENTS.md` | Update `governance/ai-agent-guidelines.md` → new path |
| `docs/explanation/governance.md` | Add note: content moved to `governance/repository-governance-architecture.md` |
| `docs/explanation/README.md` | Update link target |
| `.workflow-template.md` | Add header note pointing to new canonical path |

## Git Strategy

Single branch `docs/governance-restructuring`, single PR.

Use `git mv` for moved files so git tracks the rename (preserves history).

```bash
git mv governance/vision.md governance/vision/ikp-labs.md
git mv governance/principles.md governance/principles/general.md
git mv governance/conventions.md governance/conventions/development.md
git mv governance/ai-agent-guidelines.md governance/development/agents/ai-agent-guidelines.md
```

## Risk

**Low** — pure docs reorganization, zero app code touched, CI only checks app code.

One risk: agents or docs that hardcode old paths will 404. Mitigated by updating all cross-references in the same PR.
