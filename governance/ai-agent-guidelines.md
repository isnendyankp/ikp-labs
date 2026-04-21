# AI Agent Guidelines

How AI agents (Claude) should use governance when working in IKP-Labs.

---

## Purpose

AI agents working in this repository make hundreds of small decisions per session: what to name a file, how to structure a commit, whether to create a new plan, when to ask vs. proceed. Without explicit guidance, those decisions are made from training data defaults — which may not match IKP-Labs conventions.

These guidelines exist so that every AI agent session produces work that is consistent with the project's values, conventions, and workflow — regardless of which model or session is active.

---

## Governance Consultation Order

Before making any significant decision, consult governance in this order:

| Priority | Document | Question it answers |
|----------|----------|---------------------|
| 1 | `governance/vision.md` | Does this change serve the project's purpose? |
| 2 | `governance/principles.md` | Does this approach align with project values? |
| 3 | `governance/conventions.md` | Does this follow naming and format standards? |
| 4 | `.workflow-template.md` | Does this follow the development workflow? |
| 5 | `plans/README.md` | Does this plan follow the plan structure? |
| 6 | Active plan `checklist.md` | What is the current task and its acceptance criteria? |

Higher layers override lower ones. If a plan step conflicts with a Principle, revise the plan — do not violate the Principle.

---

## Decision Types and Which Layer Applies

| Decision | Consult |
|----------|---------|
| Should this feature be built at all? | Layer 1 — Vision |
| Should I use approach A or B? | Layer 2 — Principles |
| What should I name this file/function/branch? | Layer 3 — Conventions |
| How do I structure this commit or PR? | Layer 3 — Conventions |
| What branch type should I use? | Layer 3 — Conventions |
| What workflow steps should I follow? | Layer 4/5 — Workflow Template |
| What is the scope of this task? | Layer 6 — Active plan |
| What counts as done? | Layer 6 — Checklist acceptance criteria |

---

## Handling Ambiguity

When governance does not clearly answer a question:

1. **Escalate upward** — if Conventions don't cover the case, check which Principle applies.
2. **Match existing patterns** — look for how similar decisions were made in the codebase or `plans/done/`.
3. **Apply the most relevant Principle** — "Explicit Over Implicit" is often the tiebreaker.
4. **Ask the user** — when the decision has lasting consequences (naming a top-level folder, changing a convention), pause and confirm before proceeding.

Do not invent new conventions to fill a gap. Surface the ambiguity and resolve it with the user.

---

## What AI Agents Should NOT Do

- **Do not skip plan creation** for non-trivial work. Any task with more than one commit or multiple files changed requires a plan in `plans/in-progress/`.
- **Do not modify governance files** (`vision.md`, `principles.md`, `conventions.md`) without explicit user instruction. These are stable layers.
- **Do not combine unrelated changes** in a single PR. Scope is enforced by Principle 3 (Incremental Change).
- **Do not use `any` types** in TypeScript. Enforce Principle 2 (Explicit Over Implicit).
- **Do not commit secrets** — API keys, passwords, tokens — to any file at any layer.
- **Do not force-push** to `main`. Never bypass branch protection.
- **Do not mark checklist items as done** unless the corresponding work is fully committed and verified.
- **Do not create documentation files** (`.md`) unless explicitly asked or required by the active plan.
- **Do not run destructive commands** (rm -rf, git reset --hard, drop table) without explicit user confirmation.
- **Do not skip the `--no-verify` flag silently** — if a pre-commit hook fails, fix the root cause.

---

## Plan Creation Protocol

Follow this protocol when creating a new plan:

### When to create a plan
- The task requires more than one commit, OR
- The task touches more than two files, OR
- The task has multiple phases or acceptance criteria

### Folder and file structure
```
plans/in-progress/YYYY-MM-DD__kebab-case-description/
├── README.md           # Overview, scope in/out, status
├── requirements.md     # User stories and acceptance criteria
├── technical-design.md # Architecture, file list, content specs
└── checklist.md        # Atomic tasks with checkboxes (15-60 min each)
```

### Checklist rules
- Each task is atomic: completable in 15-60 minutes
- Each task has a single checkbox (`- [ ]`)
- Tasks are ordered: setup → implementation → verification → PR
- Every phase ends with a commit, push, and PR step
- Acceptance criteria are testable — no vague statements like "works correctly"

### After completion
- Move the plan folder from `plans/in-progress/` to `plans/done/`
- Use a `docs(plan):` commit type for plan-only changes

---

## Code Change Protocol

When writing or modifying code:

### Before writing
1. Read the active plan's `checklist.md` — confirm which task is in scope
2. Read files that will be modified — never edit blindly
3. Check `governance/conventions.md` for naming rules that apply

### TypeScript
- File names: PascalCase for components, camelCase for hooks/utils
- No `any` types — use `unknown` with type guards if shape is truly unknown
- Prefer `interface` for object shapes, `type` for unions
- Explicit return types on all exported functions

### Java
- Controllers delegate to services — no business logic in controllers
- Services delegate to repositories — no raw SQL in services
- DTOs use `Request` and `Response` suffixes

### Commits
- Format: `<type>: <description>` (see `governance/conventions.md`)
- One concern per commit — do not bundle unrelated changes
- Max 72 characters on the first line
- Present tense, lowercase description

### Branches
- Format: `<type>/<short-description>` (see `governance/conventions.md`)
- Derived from the task, not the date
- One branch per concern

---

## Documentation Protocol

When creating or updating documentation:

### Diátaxis framework
IKP-Labs docs follow the Diátaxis framework. Place new docs in the correct folder:

| Folder | Type | Purpose |
|--------|------|---------|
| `docs/tutorials/` | Tutorial | Learning-oriented, step-by-step |
| `docs/how-to/` | How-to | Goal-oriented, solving a specific problem |
| `docs/reference/` | Reference | Information-oriented, lookup tables |
| `docs/explanation/` | Explanation | Understanding-oriented, concepts and rationale |

### Rules
- Update docs in the same PR as the code they describe (Principle 4: Documentation as Code)
- Do not create `README.md` files unless the plan explicitly requires one
- Use kebab-case for all doc file names
- No multi-paragraph comment blocks in code — one short line max, only when the *why* is non-obvious
- Governance documents live in `governance/` — never in `docs/`
