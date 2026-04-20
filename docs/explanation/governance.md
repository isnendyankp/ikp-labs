# Governance Model

Understanding-oriented explanation of how IKP-Labs governs itself — why governance exists, how the 6-layer model works, and how layers interact.

---

## Why Governance?

Without governance, a project drifts. Each contributor makes local decisions that seem reasonable in isolation but accumulate into inconsistency: different naming styles, different PR formats, different standards per app.

In a monorepo with multiple apps, this problem compounds. App 2 inherits nothing from App 1. A new contributor reads one app and assumes its patterns apply everywhere — but they might not.

Governance solves this by making decisions **explicit and durable**:
- Why does this project exist? (Vision)
- What values guide decisions when there's no clear answer? (Principles)
- What standards apply everywhere? (Conventions)
- How do we execute work day-to-day? (Development + Workflows)
- How do we track individual tasks? (Plans)

---

## The 6-Layer Model

```
┌─────────────────────────────────────────────────┐
│  Layer 1  governance/vision.md                  │
│           Purpose — why this project exists     │
├─────────────────────────────────────────────────┤
│  Layer 2  governance/principles.md              │
│           Values — what guides decisions        │
├─────────────────────────────────────────────────┤
│  Layer 3  governance/conventions.md             │
│           Standards — naming, format, structure │
├─────────────────────────────────────────────────┤
│  Layer 4  .workflow-template.md                 │
│           Development — task types, commit      │
│           strategy, branch hygiene              │
├─────────────────────────────────────────────────┤
│  Layer 5  .workflow-template.md                 │
│           Workflows — step-by-step procedures   │
│           for each task type                    │
├─────────────────────────────────────────────────┤
│  Layer 6  plans/                                │
│           Plans — individual work tracking      │
└─────────────────────────────────────────────────┘
```

Higher layers are more stable and rarely change. Lower layers are more operational and change frequently. When a lower layer is ambiguous, look up to the next layer for guidance.

---

## Layer 1: Vision

**File:** `governance/vision.md`

Answers the most fundamental question: **why does IKP-Labs exist?**

Contains:
- Project purpose — the problem it solves and what it demonstrates
- Target users — who uses the system and who reads the codebase
- What success looks like — concrete, observable outcomes
- Long-term goals — where the project is headed

Vision is the highest authority. If a proposed feature or decision conflicts with the vision, the vision wins. Change the vision deliberately and rarely.

---

## Layer 2: Principles

**File:** `governance/principles.md`

Answers: **what values guide decisions when there's no obvious right answer?**

IKP-Labs has 7 core principles:
1. Test-First Confidence
2. Explicit Over Implicit
3. Incremental Change
4. Documentation as Code
5. DX Consistency
6. Separation of Concerns
7. Security by Default

Each principle has a statement, rationale, and concrete examples from the codebase. When facing an architectural choice, check which principle applies and let it guide the decision.

---

## Layer 3: Conventions

**File:** `governance/conventions.md`

Answers: **what standards apply across every app in the monorepo?**

Covers:
- Commit message format (types, rules, examples)
- Branch naming (pattern and all allowed types)
- Pull request format (title, body template)
- TypeScript naming conventions
- Java naming conventions
- File and folder naming

Conventions are the most referenced layer day-to-day. They apply uniformly — a new app added to the monorepo inherits all conventions automatically.

---

## Layer 4 & 5: Development & Workflows

**File:** `.workflow-template.md`

Answers: **how do we execute work?**

Layer 4 covers task types (Code, Config, Meta, Infra) and the decision of which workflow to follow. Layer 5 covers the step-by-step procedures: branching, committing, PR creation, merging, deployment, and branch cleanup.

These two layers are combined in `.workflow-template.md` because in practice they are inseparable — knowing the task type immediately determines the workflow.

---

## Layer 6: Plans

**Directory:** `plans/`

Answers: **what are we building right now, and how?**

Plans are ephemeral — they track active work and are archived when complete. Each plan lives in `plans/in-progress/` during development and moves to `plans/done/` when finished.

Every plan follows the 4-document structure:
- `README.md` — overview and scope
- `requirements.md` — user stories and acceptance criteria
- `technical-design.md` — architecture and file specifications
- `checklist.md` — atomic tasks with checkboxes

Plans are the most volatile layer. They change daily and are discarded after use.

---

## How Layers Interact

**Escalation**: When a lower layer doesn't provide enough guidance, escalate upward. Example: a naming question not answered in Conventions → check Principles for the value that should guide the decision.

**Override order**: Higher layers override lower ones. If a plan specifies an approach that conflicts with a Principle, the Principle wins and the plan should be revised.

**Stability gradient**: Vision and Principles change rarely (months to years). Conventions change occasionally (weeks to months). Workflows change sometimes. Plans change daily.

---

## For AI Agents

AI agents (Claude) working in this repository should consult governance in this order:

1. `governance/vision.md` — does this change serve the project's purpose?
2. `governance/principles.md` — does this approach align with project values?
3. `governance/conventions.md` — does this follow naming and format standards?
4. `.workflow-template.md` — does this follow the development workflow?
5. `plans/README.md` — does this plan follow the plan structure?

For detailed AI agent protocols, see `governance/ai-agent-guidelines.md` (Phase 3).
