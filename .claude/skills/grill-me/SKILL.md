---
name: grill-me
description: >
  Interview the user relentlessly about a plan or design, presenting choices one at a time
  until shared understanding is reached. Resolves every branch of the decision tree. Use
  when the user wants to stress-test a plan, get grilled on their design, or mentions
  "grill me".
---

# Skill: Grill Me

**Category**: Planning & Design
**Purpose**: Stress-test plans and designs through relentless, structured questioning before implementation begins.
**Used By**: plan-maker, documentation-writer, agent-maker

---

## Overview

Stress-test plans and designs through relentless, structured questioning before implementation begins. Every decision branch is resolved one-by-one until shared understanding is reached.

---

## When to Activate

Activate when:

- User says "grill me", "challenge my plan", "stress-test this", "interrogate my design", or any close variant
- A new plan is being created and design decisions remain open
- A design review is requested before committing to implementation
- A checklist item or acceptance criteria needs clarification before work starts

---

## Process

Interview the user about every aspect of the plan until shared understanding is reached. Walk down each branch of the decision tree, resolving dependencies one-by-one.

**Rules (HARD — no exceptions):**

1. Ask questions **one at a time** — never bundle multiple questions in one message
2. **EVERY question MUST present 2–4 concrete options** with trade-off descriptions — open-ended questions without options are FORBIDDEN. If options cannot be enumerated, read the codebase first (Rule 4) and synthesize them before asking
3. **Mark the recommended option** clearly, e.g. `**(Recommended)**`
4. **Explore the codebase first** — if a question can be answered by reading existing files (plans, specs, governance docs), read them instead of asking
5. Continue until all branches are resolved

**Tool preference**: When operating in a Claude Code context, use the `AskUserQuestion` tool for each question. The interactive multi-choice UI shows the user exactly which options are available and lets them select with a single click. Fall back to the markdown format below only when `AskUserQuestion` is unavailable.

---

## Question Format (Markdown Fallback)

When `AskUserQuestion` is not available, structure each question like this:

> **[Question]**
>
> - **Option A**: [description] — [trade-off]
> - **Option B**: [description] — [trade-off] **(Recommended)**
> - **Option C**: [description] — [trade-off]
>
> **Recommendation**: Option B because [specific reason grounded in this context].

---

## IKP-Labs Context

When grilling about IKP-Labs plans, common decision branches include:

| Topic | Typical options to surface |
|-------|---------------------------|
| Plan scope | Single PR vs. multi-phase split |
| Agent design | Maker-only vs. full MCF triad |
| Skill dependency | Create stub now vs. bundle with consumer |
| Commit strategy | 1 commit per file vs. 1 commit per logical unit |
| Acceptance criteria | Gherkin Given/When/Then vs. prose checklist items |

Read `plans/in-progress/` before asking plan-related questions — the answer may already be documented.

---

## After the Grilling

When all decision tree branches are resolved:

1. Summarize every decision made and its rationale
2. Confirm shared understanding explicitly
3. Signal readiness to proceed to plan writing or implementation

---

## Related Skills

- `plan-creating-project-plans` — 4-document plan system structure
- `plan-writing-gherkin-criteria` — writing acceptance criteria in Gherkin format
- `repo-applying-maker-checker-fixer` — MCF pattern decisions

---

**Last Updated:** June 2026
