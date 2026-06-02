# Technical Design

## Architecture Overview

All deliverables are meta files in `.claude/agents/` and `.claude/skills/`, plus
additions to `.claude/settings.json`. No application code is changed.

```text
.claude/
├── agents/                              # New agent files
│   ├── repo-harness-compatibility-checker.md   [HIGH]
│   ├── repo-harness-compatibility-fixer.md     [HIGH]
│   ├── repo-setup-manager.md                   [HIGH]
│   ├── docs-software-engineering-separation-checker.md  [HIGH]
│   ├── docs-software-engineering-separation-fixer.md   [HIGH]
│   ├── pdf-to-md-maker.md                      [MEDIUM]
│   ├── pdf-to-md-checker.md                    [MEDIUM]
│   ├── pdf-to-md-fixer.md                      [MEDIUM]
│   ├── docs-tutorial-maker.md                  [MEDIUM]
│   ├── docs-tutorial-checker.md                [MEDIUM]
│   ├── docs-tutorial-fixer.md                  [MEDIUM]
│   ├── social-linkedin-post-maker.md           [MEDIUM]
│   ├── swe-golang-dev.md                       [LOW]
│   ├── swe-rust-dev.md                         [LOW]
│   ├── swe-csharp-dev.md                       [LOW]
│   └── swe-fsharp-dev.md                       [LOW]
├── skills/                              # New skill directories
│   ├── grill-me/SKILL.md                       [HIGH]
│   ├── plan-writing-gherkin-criteria/SKILL.md  [HIGH]
│   ├── repo-applying-maker-checker-fixer/SKILL.md  [HIGH]
│   ├── repo-assessing-criticality-confidence/SKILL.md  [HIGH, evaluate first]
│   ├── docs-validating-software-engineering-separation/SKILL.md  [HIGH]
│   ├── docs-creating-accessible-diagrams/SKILL.md  [MEDIUM]
│   ├── docs-creating-by-example-tutorials/SKILL.md  [MEDIUM]
│   ├── docs-creating-in-the-field-tutorials/SKILL.md  [MEDIUM]
│   ├── docs-validating-factual-accuracy/SKILL.md  [MEDIUM]
│   ├── repo-syncing-with-ose-primer/SKILL.md   [MEDIUM]
│   ├── swe-programming-golang/SKILL.md         [LOW]
│   ├── swe-programming-rust/SKILL.md           [LOW]
│   ├── swe-programming-csharp/SKILL.md         [LOW]
│   └── swe-programming-fsharp/SKILL.md         [LOW]
└── settings.json                        # LSP plugins + opencode permissions [LOW]
```

---

## Agent Frontmatter Pattern

All agents follow the IKP-Labs frontmatter convention established in Round 2:

```yaml
---
name: agent-name
description: >-
  Use this agent to [action]. [1-sentence purpose].

  Key responsibilities:
  - [responsibility 1]
  - [responsibility 2]

  Examples:
  - <example>User: "[trigger phrase]"
    Assistant: "I'll use agent-name to [what it does]."</example>
model: sonnet
color: [purple|blue|green|yellow|red|orange|cyan]
permission.skill:
  - skill-name-1
  - skill-name-2
---
```

**Color conventions used in IKP-Labs:**

| Color    | Role                      |
| -------- | ------------------------- |
| `purple` | Developer / maker agent   |
| `blue`   | Setup / management agent  |
| `green`  | Checker / validator agent |
| `yellow` | Fixer / corrector agent   |
| `orange` | Creative / content agent  |

---

## High Priority Agent Specifications

### repo-harness-compatibility-checker

| Field  | Value                                                                      |
| ------ | -------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                   |
| Color  | `green`                                                                    |
| Skills | `repo-understanding-repository-architecture`, `wow-criticality-assessment` |

Validates Claude harness compatibility: agent frontmatter keys, skill directory structure
(`skill-name/SKILL.md`), hook script existence and wiring in `settings.json`, and
`permission.skill` references pointing to existing skill directories.

---

### repo-harness-compatibility-fixer

| Field  | Value                                                                      |
| ------ | -------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                   |
| Color  | `yellow`                                                                   |
| Skills | `repo-understanding-repository-architecture`, `wow-criticality-assessment` |

Resolves issues reported by `repo-harness-compatibility-checker`. Fixes frontmatter key
mismatches, creates missing skill directory stubs, and updates `settings.json` wiring.
Always reads the checker report before making changes.

---

### repo-setup-manager

| Field  | Value                                                                             |
| ------ | --------------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                          |
| Color  | `blue`                                                                            |
| Skills | `repo-understanding-repository-architecture`, `repo-applying-maker-checker-fixer` |

Manages initial repo setup for IKP-Labs. Covers: `npm install` for frontend
(Next.js 15 + Tailwind 4), Maven `mvn install` for backend (Spring Boot 3.2 + Java 17),
PostgreSQL database creation, `.claude/` hook permission setup (`chmod +x`),
and environment file configuration from `.env.example`.

---

### docs-software-engineering-separation-checker

| Field  | Value                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                        |
| Color  | `green`                                                                         |
| Skills | `docs-validating-software-engineering-separation`, `wow-criticality-assessment` |

Scans `docs/` for content that violates SE-separation rules: API reference mixed with
business narrative, tutorials mixing procedural steps with conceptual explanation, etc.

---

### docs-software-engineering-separation-fixer

| Field  | Value                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| Model  | `sonnet`                                                                        |
| Color  | `yellow`                                                                        |
| Skills | `docs-validating-software-engineering-separation`, `wow-criticality-assessment` |

Resolves violations found by `docs-software-engineering-separation-checker` by
splitting mixed content into the appropriate Diátaxis category files.

---

## Medium Priority Agent Specifications

### PDF-to-MD Triad

| Agent               | Model    | Color    | Skills                                                        |
| ------------------- | -------- | -------- | ------------------------------------------------------------- |
| `pdf-to-md-maker`   | `sonnet` | `purple` | (none — uses built-in file tools)                             |
| `pdf-to-md-checker` | `sonnet` | `green`  | `docs-applying-content-quality`, `wow-criticality-assessment` |
| `pdf-to-md-fixer`   | `sonnet` | `yellow` | `docs-applying-content-quality`, `wow-criticality-assessment` |

Maker converts a PDF to Markdown, preserving heading hierarchy, tables, and links.
Checker validates output for formatting completeness. Fixer corrects checker findings.

---

### Docs Tutorial Triad

| Agent                   | Model    | Color    | Skills                                                              |
| ----------------------- | -------- | -------- | ------------------------------------------------------------------- |
| `docs-tutorial-maker`   | `sonnet` | `purple` | `docs-applying-diataxis-framework`, `docs-applying-content-quality` |
| `docs-tutorial-checker` | `sonnet` | `green`  | `docs-applying-diataxis-framework`, `wow-criticality-assessment`    |
| `docs-tutorial-fixer`   | `sonnet` | `yellow` | `docs-applying-diataxis-framework`, `wow-criticality-assessment`    |

Follows the Diátaxis tutorial format. Maker creates a tutorial draft. Checker validates
prerequisites, ordered steps, expected outcomes, and Diátaxis compliance. Fixer corrects
identified violations without altering correctly structured sections.

---

### social-linkedin-post-maker

| Field  | Value                           |
| ------ | ------------------------------- |
| Model  | `sonnet`                        |
| Color  | `orange`                        |
| Skills | `docs-applying-content-quality` |

Accepts a source (PR description, changelog, or brief prompt) and produces a LinkedIn
post in professional developer tone. Does not fabricate metrics not present in source.

---

## Low Priority Agent Specifications

Language extension agents follow the `swe-java-dev` pattern — each is a generic
language developer agent without IKP-Labs-specific stack assumptions.

| Agent            | Model    | Color    | Skills                                                         |
| ---------------- | -------- | -------- | -------------------------------------------------------------- |
| `swe-golang-dev` | `sonnet` | `purple` | `swe-programming-golang`, `swe-developing-applications-common` |
| `swe-rust-dev`   | `sonnet` | `purple` | `swe-programming-rust`, `swe-developing-applications-common`   |
| `swe-csharp-dev` | `sonnet` | `purple` | `swe-programming-csharp`, `swe-developing-applications-common` |
| `swe-fsharp-dev` | `sonnet` | `purple` | `swe-programming-fsharp`, `swe-developing-applications-common` |

---

## Skill File Pattern

Each skill lives at `.claude/skills/<skill-name>/SKILL.md`. The file contains:

1. A `# Skill: [Name]` H1 heading
2. **Category** and **Purpose** metadata block
3. **Overview** section explaining what the skill provides
4. The substantive content (rules, patterns, examples, decision guides)
5. A **Related Skills** section (optional)
6. **Last Updated** footer

Example structure:

```markdown
# Skill: Repo Applying Maker-Checker-Fixer

**Category**: Repository Governance
**Purpose**: Define the MCF agent pattern and when to use it

---

## Overview

[What this skill provides and who uses it]

## When to Create a Triad

[Decision guide]

## MCF Role Definitions

[Maker / Checker / Fixer responsibilities]

## IKP-Labs Naming Conventions

[Naming rules and examples]

## Related Skills

- repo-understanding-repository-architecture

---

**Last Updated**: 2026-06-02
**Version**: 1.0
```

---

## Settings.json Additions

### LSP Plugins

Add entries to the `plugins` array in `.claude/settings.json` (or equivalent key).
Follows the pattern `@claude-plugins-official` used for existing entries.

Entries to add:

- `gopls-lsp@claude-plugins-official`
- `rust-analyzer-lsp@claude-plugins-official`
- `pyright-lsp@claude-plugins-official`
- `kotlin-lsp@claude-plugins-official`
- `lua-lsp@claude-plugins-official`
- `swift-lsp@claude-plugins-official`
- `frontend-design@claude-plugins-official`

### Opencode Sync Permissions

Add to `permissions.allow` array:

```json
"Read(.opencode/**)",
"Write(.opencode/**)",
"Edit(.opencode/**)",
"Bash(npm run sync:claude-to-opencode:*)"
```

---

## Overlap Evaluation: repo-assessing-criticality-confidence vs wow-criticality-assessment

Before implementing `repo-assessing-criticality-confidence`, evaluate:

- Read `.claude/skills/wow-criticality-assessment/SKILL.md`
- If `wow-criticality-assessment` already covers confidence scoring alongside criticality:
  the new skill is redundant — skip it, document rationale in checklist
- If `wow-criticality-assessment` covers only criticality without confidence:
  implement `repo-assessing-criticality-confidence` as an additive skill

This evaluation is the first step in the High Priority Skills phase.

---

## Commit Strategy

```text
chore(security): mark env-file guard done in ideas.md     [already done via PR #154]
docs(plan): add claude-governance-gap-round-3 plan
chore(agents): add repo-harness-compatibility agents + repo-setup-manager
chore(skills): add grill-me, plan-writing-gherkin-criteria, repo-mcf skills
chore(agents): add docs-software-engineering-separation checker/fixer
chore(skills): add docs-validating-software-engineering-separation skill
chore(agents): add pdf-to-md and docs-tutorial triads + linkedin maker
chore(skills): add medium-priority docs skills + repo-syncing-with-ose-primer
chore(agents): add swe language extension agents (golang, rust, csharp, fsharp)
chore(skills): add swe language extension skills
chore(config): add lsp plugins and opencode permissions to settings.json
chore(ideas): mark round-3 items as implemented in plans/ideas.md
docs(plan): move claude-governance-gap-round-3 to done
```
