# Governance

IKP-Labs governance defines **why** this project exists, **what values** guide its decisions, and **what standards** all contributors must follow.

---

## Structure

```
governance/
├── repository-governance-architecture.md  — Full 6-layer model explanation
├── vision/
│   └── ikp-labs.md                        — Why IKP-Labs exists, target users, success criteria
├── principles/
│   └── general.md                         — 7 core principles that guide all decisions
├── conventions/
│   └── development.md                     — Commit, branch, PR, TypeScript, Java, file naming
├── development/
│   ├── workflow/
│   │   └── implementation.md              — Step-by-step development workflow (canonical)
│   └── agents/
│       └── ai-agent-guidelines.md         — AI agent decision protocols and consultation order
└── workflows/                             — Future: plan execution, CI, release workflows
```

---

## The 6-Layer Model

Governance in IKP-Labs follows a 6-layer hierarchy. Higher layers override lower ones.

```
Layer 1  governance/vision/ikp-labs.md              Purpose — why this project exists
Layer 2  governance/principles/general.md            Values — what guides decisions
Layer 3  governance/conventions/development.md       Standards — naming, format, structure
Layer 4  governance/development/workflow/            Development — task types, commit strategy
Layer 5  governance/development/agents/              Agent protocols — AI decision rules
Layer 6  plans/                                      Plans — individual work tracking
```

For a full explanation of the model and how layers interact, see [`repository-governance-architecture.md`](./repository-governance-architecture.md).
