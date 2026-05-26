# Skill: Developing AI Agents

**Category**: Meta
**Purpose**: Standards for creating new Claude agent files in IKP-Labs
**Used By**: agent-maker

---

## Agent File Structure

Every agent lives in `.claude/agents/<name>.md` with required frontmatter:

```yaml
---
name: agent-name              # kebab-case, matches filename
description: >                # when to use this agent (shown in FleetView)
  One sentence trigger condition. Key responsibilities:
  - Responsibility 1
  - Responsibility 2

  Examples:
  - <example>User: "..."
    Assistant: "I'll use agent-name to..."</example>
model: sonnet | haiku          # see model selection below
color: blue | green | yellow | purple | red | orange
permission.skill:              # optional: pre-loaded skills
  - skill-name-1
  - skill-name-2
---

Agent body — instructions to Claude when acting as this agent.
```

---

## Model Selection

| Use | Model |
|-----|-------|
| Complex reasoning, multi-step decisions, code generation | `sonnet` |
| Simple pattern matching, file ops, structured transforms | `haiku` |
| Omit field | Inherits parent (usually sonnet) |

Decision guide:

- Does it require judgment calls? → sonnet
- Is it following a clear checklist? → haiku
- Does it generate non-trivial code? → sonnet
- Does it rename/move/format files? → haiku

---

## Color Convention (Role)

| Color | Role | When |
|-------|------|------|
| `blue` | Maker | Creates new artifacts |
| `green` | Checker | Validates existing artifacts |
| `yellow` | Fixer | Fixes issues found by checker |
| `purple` | Developer | Implements features |
| `red` | Critic | Reviews for quality |
| `orange` | Orchestrator | Coordinates other agents |

---

## Naming Convention

Agent files follow `<domain>-<role>.md`:

```text
docs-maker.md         — creates docs
docs-checker.md       — validates docs
docs-fixer.md         — fixes docs
plan-maker.md         — creates plans
swe-typescript-dev.md — TypeScript developer
swe-ui-checker.md     — validates UI components
agent-maker.md        — creates new agents
```

---

## Description Field

The `description` field is critical — it determines when Claude auto-selects this agent.

Good description:

```yaml
description: >
  Use this agent to create new UI components following IKP-Labs Tailwind 4
  conventions. Creates component file, props interface, and unit tests.

  Key responsibilities:
  - Create React component with TypeScript props
  - Apply Tailwind 4 classes following design standards
  - Write Jest + React Testing Library tests
  - Ensure accessibility (ARIA, focus-visible)

  Examples:
  - <example>User: "Create a PhotoCard component"
    Assistant: "I'll use swe-ui-maker to create the PhotoCard component
    following IKP-Labs conventions."</example>
```

Bad description:

```yaml
description: Makes UI components.
```

---

## Body Structure

Use this order:

```markdown
You are a [role description] for IKP-Labs.

## Project Context

[Tech stack and paths relevant to this agent]

## Core Responsibilities

[What this agent does — numbered list]

## Workflow

[Step-by-step process]

## Reference Documentation

**Related Agents:**
- `agent-name` — brief role

**Skills:**
- `skill-name` — what it provides

---

**Agent Version:** 1.0
**Last Updated:** Month Year
```

---

## Skills Integration

Reference skills in frontmatter AND in the body:

```yaml
# frontmatter
permission.skill:
  - plan-creating-project-plans
  - wow-criticality-assessment
```

```markdown
# body
**See `plan-creating-project-plans` skill** for 4-document structure standards.
**See `wow-criticality-assessment` skill** for issue severity classification.
```

---

## IKP-Labs Specific Rules

1. No OSE-specific content (Open Sharia Enterprise, Nx, Golang)
2. Reference IKP-Labs paths: `apps/kameravue-fe/`, `apps/kameravue-be/`
3. Use IKP-Labs coverage: ≥70% FE, ≥80% BE
4. Use IKP-Labs test stack: Jest + RTL (FE), JUnit 5 + H2 (BE)
5. Use IKP-Labs dev servers: FE `http://localhost:3002`, BE `http://localhost:8081`
6. Commit type: `feat | fix | refactor | style | docs | test | chore | config`

---

## Creating a New Agent — Checklist

- [ ] File in `.claude/agents/<name>.md`
- [ ] Frontmatter: name, description, model, color
- [ ] Description has trigger condition, responsibilities, examples
- [ ] Body has project context, responsibilities, workflow
- [ ] Skills referenced in frontmatter and body
- [ ] No placeholder content
- [ ] Markdown lint passes
- [ ] Force-add with `git add -f` (`.claude/` is in `.gitignore`)
