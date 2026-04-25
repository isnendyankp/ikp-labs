# Requirements: Governance Restructuring

## Problem Statement

`governance/` currently uses flat files. As IKP-Labs scales to multiple apps, flat files become hard to maintain — agents can't be pointed to specific topics, and each file grows into a large monolith.

## Goals

1. Governance is organized into named subfolders matching the 6-layer model
2. Each subfolder has a `README.md` index
3. All existing content is preserved — zero information loss
4. All cross-references (in `AGENTS.md`, `docs/`, `CLAUDE.md`, etc.) are updated
5. Structure mirrors senior's pattern so future additions follow the same convention

## Target Structure

```
governance/
├── README.md                              (updated index)
├── repository-governance-architecture.md (new — from docs/explanation/governance.md)
├── vision/
│   ├── README.md
│   └── ikp-labs.md                        (from vision.md)
├── principles/
│   ├── README.md
│   └── general.md                         (from principles.md)
├── conventions/
│   ├── README.md
│   └── development.md                     (from conventions.md)
├── development/
│   ├── README.md
│   ├── workflow/
│   │   ├── README.md
│   │   └── implementation.md              (from .workflow-template.md)
│   └── agents/
│       ├── README.md
│       └── ai-agent-guidelines.md         (from ai-agent-guidelines.md)
└── workflows/
    └── README.md                          (placeholder for future plan/CI workflows)
```

## Acceptance Criteria

- [ ] All 5 existing governance files exist at new paths with identical content
- [ ] All folder `README.md` files exist and list their contents
- [ ] `governance/repository-governance-architecture.md` exists and explains the 6-layer model
- [ ] Old flat file paths no longer exist (e.g., `governance/vision.md` is gone)
- [ ] `AGENTS.md` references updated to new paths
- [ ] `docs/explanation/governance.md` updated or replaced by new architecture doc
- [ ] `docs/explanation/README.md` link updated
- [ ] `governance/README.md` updated to list new structure
- [ ] `governance/ai-agent-guidelines.md` consultation order table updated with new paths
- [ ] CI passes
