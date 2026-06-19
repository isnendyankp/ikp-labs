# Requirements

## Scope Definition

### In-Scope

**Critical Security — DONE (PR #154, 2026-06-02):**

- `block-env-file-access.sh` PreToolUse hook blocking `.env*` reads/writes
- `.env*` deny rules in `.claude/settings.json`

**High Priority — 3 agents, 5 skills (+ 2 agents for docs SE separation):**

- `repo-harness-compatibility-checker` agent
- `repo-harness-compatibility-fixer` agent
- `repo-setup-manager` agent
- `grill-me` skill
- `plan-writing-gherkin-criteria` skill
- `repo-applying-maker-checker-fixer` skill
- `repo-assessing-criticality-confidence` skill (adopt from senior repo, adapt to IKP-Labs — evaluated ADDITIVE)
- `docs-validating-software-engineering-separation` skill
- `docs-software-engineering-separation-checker` agent
- `docs-software-engineering-separation-fixer` agent

**Medium Priority — 7 agents, 5 skills:**

- `pdf-to-md-maker`, `pdf-to-md-checker`, `pdf-to-md-fixer` agent triad
- `docs-tutorial-maker`, `docs-tutorial-checker`, `docs-tutorial-fixer` agent triad
- `social-linkedin-post-maker` agent
- `docs-creating-accessible-diagrams` skill
- `docs-creating-by-example-tutorials` skill
- `docs-creating-in-the-field-tutorials` skill
- `docs-validating-factual-accuracy` skill
- `repo-syncing-with-ose-primer` skill

**Low Priority — 4 agents, 4 skills, settings entries:**

- `swe-golang-dev`, `swe-rust-dev`, `swe-csharp-dev`, `swe-fsharp-dev` agents
- `swe-programming-golang`, `swe-programming-rust`, `swe-programming-csharp`, `swe-programming-fsharp` skills
- LSP plugin entries: `gopls-lsp`, `rust-analyzer-lsp`, `pyright-lsp`, `kotlin-lsp`, `lua-lsp`, `swift-lsp`, `frontend-design`
- opencode sync permission entries

### Non-Scope

- Editing or refactoring any agent/skill created in Round 1 or Round 2
- Application code changes (frontend, backend, database)
- New Gherkin specs or Playwright tests
- Docs content in `docs/` directory
- ose-public items tied to Nx, Gradle, or OSE-specific domain
- Deployment or CI pipeline changes
- Risk assessment frameworks or business metrics
- Anything not explicitly listed in the in-scope section above

---

## Functional Requirements

### FR-1: Harness Compatibility Agents (High Priority)

**Description**: Two agents that validate and fix Claude harness compatibility issues.
The checker identifies mismatches in agent frontmatter, skill references, hook wiring,
and settings.json configuration. The fixer resolves issues the checker reports.

**Acceptance Criteria:**

- Given a `.claude/` directory, when `repo-harness-compatibility-checker` runs,
  then it produces a structured report of incompatibilities
- Given a checker report, when `repo-harness-compatibility-fixer` runs,
  then it corrects the identified incompatibilities without altering correct files
- Both agents reference IKP-Labs `.claude/` conventions (not OSE/Nx patterns)

---

### FR-2: Repo Setup Manager Agent (High Priority)

**Description**: An agent that manages initial repo setup workflow — cloning,
installing dependencies, configuring `.claude/` hooks, and verifying the environment.

**Acceptance Criteria:**

- Given a fresh clone of IKP-Labs, when `repo-setup-manager` is invoked,
  then it produces a step-by-step setup checklist covering frontend, backend, and Claude config
- Agent references `npm install` (not pnpm/yarn), Maven, and PostgreSQL setup steps
- Agent does not assume any prior state is configured

---

### FR-3: Grill-Me Skill (High Priority)

**Description**: An interactive knowledge testing skill that quizzes the developer
on a topic using structured question-answer rounds with feedback.

**Acceptance Criteria:**

- Given a topic, when the skill is loaded, then it generates targeted questions
- Responses include correctness feedback and explanation
- Skill is self-contained within `.claude/skills/grill-me/SKILL.md`

---

### FR-4: Plan Writing Gherkin Criteria Skill (High Priority)

**Description**: A skill that defines the standard for writing Gherkin acceptance
criteria within IKP-Labs plan documents (requirements.md sections).

**Acceptance Criteria:**

- Skill defines Given/When/Then format with IKP-Labs examples
- Covers Scenario, Scenario Outline, and Background blocks
- References `specs/` directory as the canonical home for Gherkin files
- Skill is self-contained within `.claude/skills/plan-writing-gherkin-criteria/SKILL.md`

---

### FR-5: Repo Applying Maker-Checker-Fixer Skill (High Priority)

**Description**: A skill documenting the Maker-Checker-Fixer (MCF) agent pattern —
when to create a triad, how to wire maker/checker/fixer responsibilities, and how to
validate MCF compliance.

**Acceptance Criteria:**

- Skill defines MCF roles with IKP-Labs naming conventions
- Provides a decision guide for when a triad is needed vs. a single agent
- References existing triads as examples (e.g., `readme-maker/checker/fixer`)

---

### FR-6: Repo Assessing Criticality Confidence Skill (High Priority)

**Description**: Adopt `repo-assessing-criticality-confidence` from senior repo
(`wahidyankf/ose-public`), adapted to IKP-Labs context. Evaluated as **ADDITIVE** —
senior repo does not have `wow-criticality-assessment`; their version is significantly
richer with P0–P4 priority matrix, execution order for fixers, dual-label pattern,
and domain-specific examples framework.

**Adaptation rules:**

- Remove OSE/ayokoding domain examples
- Replace with IKP-Labs domains: CI, docs, plans, specs, agents
- Update `repo-governance/` path references to `governance/`
- Keep `wow-criticality-assessment` for backward compatibility (already referenced by many agents)

**Acceptance Criteria:**

- Skill created at `.claude/skills/repo-assessing-criticality-confidence/SKILL.md`
- No OSE/ayokoding references in content
- Covers P0–P4 matrix, execution order, dual-label pattern, domain examples framework

---

### FR-7: Docs SE Separation Validation (High Priority)

**Description**: A skill defining when documentation mixes software engineering
concerns with non-SE content (e.g., mixing API reference with business narrative).
Two agents enforce this: a checker that flags violations, and a fixer that corrects them.

**Acceptance Criteria:**

- Skill defines SE-separation rules with examples of compliant and non-compliant docs
- Checker agent produces line-level findings referencing the skill rules
- Fixer agent resolves checker findings without altering compliant content

---

### FR-8: PDF-to-MD Triad (Medium Priority)

**Description**: Three agents handling PDF-to-Markdown conversion — the maker
converts a PDF, the checker validates formatting and completeness, and the fixer
resolves checker findings.

**Acceptance Criteria:**

- Maker agent accepts a PDF file path and produces a `.md` output
- Checker validates heading hierarchy, table formatting, and link integrity
- Fixer corrects the issues the checker identifies

---

### FR-9: Docs Tutorial Triad (Medium Priority)

**Description**: Three agents for tutorial document creation and validation,
following the Diátaxis tutorial format (`docs-applying-diataxis-framework` skill).

**Acceptance Criteria:**

- Maker creates a tutorial draft following Diátaxis conventions
- Checker validates structure, prerequisites, step ordering, and learning outcomes
- Fixer corrects violations without altering correctly structured sections

---

### FR-10: Social LinkedIn Post Maker (Medium Priority)

**Description**: An agent that creates LinkedIn posts from project content
(commits, PRs, changelogs, or feature descriptions).

**Acceptance Criteria:**

- Agent accepts a source (PR description, changelog entry, or brief prompt)
- Produces a LinkedIn post with appropriate length, tone, and formatting
- Does not fabricate metrics or claims not present in the source

---

### FR-11: Medium Priority Skills (Medium Priority)

Five documentation-focused skills:

| Skill                                  | Description                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `docs-creating-accessible-diagrams`    | Diagram accessibility standards (alt text, color contrast, text equivalents) |
| `docs-creating-by-example-tutorials`   | "By example" tutorial format guide — short, code-first explanations          |
| `docs-creating-in-the-field-tutorials` | "In the field" tutorials — scenario-driven, real-world context               |
| `docs-validating-factual-accuracy`     | Fact-checking standards for documentation                                    |
| `repo-syncing-with-ose-primer`         | Workflow for syncing IKP-Labs `.claude/` with ose-public primer              |

**Acceptance Criteria:**

- Each skill is self-contained in its own directory with a `SKILL.md` file
- Content is IKP-Labs-specific (not OSE/Nx references)
- No placeholder content or TODO sections

---

### FR-12: Language Extension Agents and Skills (Low Priority)

Four language developer agents and four corresponding skills for Go, Rust, C#, and F#.
These follow the same pattern as `swe-java-dev` and `swe-typescript-dev`.

**Acceptance Criteria:**

- Each agent has correct frontmatter (`model`, `color`, `tools`, `skills`)
- Each skill provides language-specific coding standards
- Agents do not reference IKP-Labs-specific stack (these are generic language agents)

---

### FR-13: LSP Plugin Settings (Low Priority)

Add LSP plugin entries to `.claude/settings.json` for: `gopls-lsp`, `rust-analyzer-lsp`,
`pyright-lsp`, `kotlin-lsp`, `lua-lsp`, `swift-lsp`, `frontend-design`.

**Acceptance Criteria:**

- Entries added under `plugins` or equivalent `settings.json` key
- Existing settings entries are not modified
- JSON remains valid after additions

---

### FR-14: Opencode Sync Permissions (Low Priority)

Add opencode sync permission entries to `settings.json`:
`Read(.opencode/**)`, `Write(.opencode/**)`, `Edit(.opencode/**)`,
`Bash(npm run sync:claude-to-opencode:*)`.

**Acceptance Criteria:**

- Entries added under `permissions.allow`
- Existing allow/deny lists are not modified
- JSON remains valid after additions

---

## Non-Functional Requirements

- NFR-1: All agent files follow IKP-Labs frontmatter format (model, color, tools, skills keys)
- NFR-2: All skill files are self-contained SKILL.md files — no external runtime dependencies
- NFR-3: No OSE-specific content (Nx, Open Sharia, Gradle, Bun) in any new file
- NFR-4: Markdown lint passes on all new files
- NFR-5: `settings.json` remains valid JSON after all additions
