# Checklist

## Status Legend

- [ ] Not started
- [x] Completed

---

## Phase 0: Plan Setup

- [x] Create branch for plan work
- [x] Create plan directory `plans/in-progress/2026-06-02__claude-governance-gap-round-3/`
- [x] Write README.md, requirements.md, technical-design.md, checklist.md

---

## Phase 1: Critical Security — DONE

- [x] Create `.claude/hooks/block-env-file-access.sh` PreToolUse guard (PR #154)
- [x] Wire hook in `.claude/settings.json` under `PreToolUse` matcher `Read|Write|Edit|MultiEdit` (PR #154)
- [x] Add `.env*` deny rules to `.claude/settings.json` `permissions.deny` (PR #154)
- [x] Allow `.env.example` read/edit in `permissions.allow` (PR #154)

---

## Phase 2: High Priority — Agents

> Split into 3 sub-phases (1 agent per PR) for easier revert if needed.

---

## Phase 2a: repo-harness-compatibility-checker

- [x] Create `.claude/agents/repo-harness-compatibility-checker.md`
- [x] Frontmatter: `model: sonnet`, `color: green`, skills: `repo-understanding-repository-architecture`, `wow-criticality-assessment`
- [x] Body covers: agent frontmatter key validation, skill directory structure check, hook wiring verification, `permission.skill` reference resolution

**Acceptance Criteria — Phase 2a:**

- [x] Agent file created with valid frontmatter
- [x] No OSE/Nx/Gradle references
- [x] `permission.skill` values reference existing skill directories
- [x] Commit: `chore(agents): add repo-harness-compatibility-checker`

---

## Phase 2b: repo-harness-compatibility-fixer

- [x] Create `.claude/agents/repo-harness-compatibility-fixer.md`
- [x] Frontmatter: `model: sonnet`, `color: yellow`, skills: `repo-understanding-repository-architecture`, `wow-criticality-assessment`
- [x] Body: reads checker report before acting, fixes frontmatter, creates skill stubs, updates settings wiring

**Acceptance Criteria — Phase 2b:**

- [x] Agent file created with valid frontmatter
- [x] No OSE/Nx/Gradle references
- [x] `permission.skill` values reference existing skill directories
- [x] Commit: `chore(agents): add repo-harness-compatibility-fixer`

---

## Phase 2c: repo-setup-manager

- [x] Create `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` (bundled — dependency of agent)
- [x] Create `.claude/agents/repo-setup-manager.md`
- [x] Frontmatter: `model: sonnet`, `color: blue`, skills: `repo-understanding-repository-architecture`, `repo-applying-maker-checker-fixer`
- [x] Body covers: `npm install` (FE), `mvn install` (BE), PostgreSQL setup, `chmod +x` hooks, `.env.example` → `.env.local`

**Acceptance Criteria — Phase 2c:**

- [x] Agent file created with valid frontmatter
- [x] No OSE/Nx/Gradle references
- [x] `permission.skill` values reference existing skill directories
- [x] Commit: `chore(agents): add repo-setup-manager`

---

## Phase 3: High Priority — Skills (Part A: Repo Skills)

> Split into 4 sub-phases (1 PR each) for easier revert if needed.

---

## Phase 3a: Plan Update (this PR)

### Overlap evaluation — COMPLETED

- [x] Read `.claude/skills/wow-criticality-assessment/SKILL.md`
- [x] Read `repo-assessing-criticality-confidence/SKILL.md` from senior repo (`wahidyankf/ose-public`)
- [x] Decision: **ADDITIVE** — adopt from senior repo, adapt to IKP-Labs

**Rationale:** Senior repo does NOT have `wow-criticality-assessment` — they only use
`repo-assessing-criticality-confidence`. Our `wow-criticality-assessment` covers the basics
but the senior version is significantly richer: P0–P4 priority matrix, execution order for
fixers, dual-label pattern, domain-specific examples framework. The senior version is the
canonical reference; we adopt and adapt it to IKP-Labs context (remove OSE/ayokoding
domain examples, replace with IKP-Labs domains).

### repo-applying-maker-checker-fixer

- [x] Create `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md`
- [x] Defines MCF roles: maker (create), checker (validate), fixer (correct)
- [x] Decision guide: when a triad is needed vs. a single agent
- [x] References existing triads as examples
- [x] IKP-Labs naming convention: `<domain>-<maker|checker|fixer>.md`

> Completed in Phase 2c (bundled with repo-setup-manager, PR #159)

**Acceptance Criteria — Phase 3a:**

- [x] Overlap evaluation completed and documented
- [x] Decision rationale recorded in checklist
- [x] Commit: `docs(plan): update phase 3 — overlap decision and sub-phase split`

---

## Phase 3b: grill-me skill

- [x] Create `.claude/skills/grill-me/SKILL.md`
- [x] Defines relentless Q&A format: one question at a time, 2–4 options each, recommended option marked
- [x] Includes IKP-Labs context (plan scope, agent design, skill dependency, commit strategy)

**Acceptance Criteria — Phase 3b:**

- [x] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [x] No placeholder content
- [x] Commit: `chore(skills): add grill-me skill`

---

## Phase 3c: plan-writing-gherkin-criteria skill

- [x] Create `.claude/skills/plan-writing-gherkin-criteria/SKILL.md`
- [x] Covers Given/When/Then syntax, Scenario Outline, Background, 1-1-1 rule
- [x] References `specs/` as canonical home for `.feature` files
- [x] IKP-Labs-specific examples (auth, gallery, API, plan acceptance criteria)

**Acceptance Criteria — Phase 3c:**

- [x] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [x] No placeholder content
- [x] No OSE/repo-governance references
- [x] Commit: `chore(skills): add plan-writing-gherkin-criteria skill`

---

## Phase 3d: repo-assessing-criticality-confidence skill

- [x] Create `.claude/skills/repo-assessing-criticality-confidence/SKILL.md`
- [x] Adopted from senior repo — adapted to IKP-Labs context
- [x] OSE/ayokoding domain examples replaced with IKP-Labs domains (CI, docs, plans, specs, harness)
- [x] Covers: P0–P4 priority matrix, execution order, dual-label pattern, domain examples
- [x] No `repo-governance/` references
- [x] Documents relationship to `wow-criticality-assessment` for backward compatibility

**Acceptance Criteria — Phase 3d:**

- [x] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [x] No OSE/ayokoding references
- [x] No placeholder content
- [x] Commit: `chore(skills): add repo-assessing-criticality-confidence skill`

---

**Acceptance Criteria — Phase 3 (all):**

- [x] All 3 skill files created (3b, 3c, 3d)
- [x] Each SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [x] No placeholder content in any file

---

## Phase 4: High Priority — Skills (Part B: Docs SE Separation)

> **SKIPPED** — Not applicable to IKP-Labs.
>
> This phase validates separation between project docs (`docs/`) and an educational
> content app (e.g. `apps/ayokoding-web/`). IKP-Labs does not have an educational
> content app — only `kameravue-fe` and `kameravue-be`. Nothing to separate.
> Revisit if IKP-Labs ever adds a content/blog/learning app.

- [x] ~~Create docs-validating-software-engineering-separation skill~~ — SKIPPED (N/A)
- [x] ~~Create docs-software-engineering-separation-checker~~ — SKIPPED (N/A)
- [x] ~~Create docs-software-engineering-separation-fixer~~ — SKIPPED (N/A)

---

## Phase 5: Medium Priority — PDF-to-MD Triad

> Split into 3 sub-phases (1 PR each) for easier revert.
> Adapted from senior repo — `crane` CLI replaced with `pdftotext` + `tesseract` (standard tools).

---

## Phase 5a: pdf-to-md-maker

- [x] Create `.claude/agents/pdf-to-md-maker.md`
- [x] Frontmatter: `model: sonnet`, `color: purple`, skills: `repo-applying-maker-checker-fixer`
- [x] Body: accepts PDF path, detects text vs image PDF, extracts with `pdftotext` (text) or `tesseract` (OCR), produces `.md` preserving headings, tables, lists, figures

**Acceptance Criteria — Phase 5a:**

- [x] Agent file created with valid frontmatter
- [x] No `crane`/OSE references
- [x] Uses `pdftotext` as primary extraction tool
- [x] Commit: `chore(agents): add pdf-to-md-maker`

---

## Phase 5b: pdf-to-md-checker

- [x] Create `.claude/agents/pdf-to-md-checker.md`
- [x] Frontmatter: `model: sonnet`, `color: green`, skills: `docs-applying-content-quality`, `repo-assessing-criticality-confidence`, `repo-applying-maker-checker-fixer`
- [x] Body: validates heading hierarchy, table formatting, text completeness, figure coverage in maker output

**Acceptance Criteria — Phase 5b:**

- [x] Agent file created with valid frontmatter
- [x] No `crane`/OSE references
- [x] Commit: `chore(agents): add pdf-to-md-checker`

---

## Phase 5c: pdf-to-md-fixer

- [x] Create `.claude/agents/pdf-to-md-fixer.md`
- [x] Frontmatter: `model: sonnet`, `color: yellow`, skills: `docs-applying-content-quality`, `repo-assessing-criticality-confidence`, `repo-applying-maker-checker-fixer`
- [x] Body: reads checker report, re-validates findings, corrects formatting issues

**Acceptance Criteria — Phase 5c:**

- [x] Agent file created with valid frontmatter
- [x] No `crane`/OSE references
- [x] Explicitly states it re-validates before acting
- [x] Commit: `chore(agents): add pdf-to-md-fixer`

---

**Acceptance Criteria — Phase 5 (all):**

- [ ] All 3 agent files created
- [ ] Checker and fixer reference `docs-applying-content-quality` and `repo-assessing-criticality-confidence` skills

---

## Phase 6: Medium Priority — Docs Tutorial Triad

> **SKIPPED** — Not applicable to IKP-Labs.
>
> This phase assumes a dedicated educational content app (e.g. `apps/ayokoding-web/`) that
> consumes high-volume tutorial content. IKP-Labs does not have such an app — only
> `kameravue-fe` and `kameravue-be`. General tutorial docs in `docs/tutorials/` can be
> handled by the existing `documentation-writer` agent.
> Revisit if IKP-Labs ever adds an educational content app.

- [x] ~~Create `.claude/agents/docs-tutorial-maker.md`~~ — SKIPPED (N/A)
- [x] ~~Create `.claude/agents/docs-tutorial-checker.md`~~ — SKIPPED (N/A)
- [x] ~~Create `.claude/agents/docs-tutorial-fixer.md`~~ — SKIPPED (N/A)

**Acceptance Criteria — Phase 6:**

- [x] ~~All 3 agent files created~~ — SKIPPED

---

## Phase 7: Medium Priority — LinkedIn Post Maker

- [x] Create `.claude/agents/social-linkedin-post-maker.md`
  - Frontmatter: `model: sonnet`, `color: orange`, skills: `docs-applying-content-quality`
  - Body: accepts source (PR, changelog, or prompt), produces LinkedIn post in developer tone
  - Constraint: explicitly states it does not fabricate metrics

**Acceptance Criteria — Phase 7:**

- [x] Agent file created
- [x] No-fabrication constraint is explicit in agent body

---

## Phase 8: Medium Priority — Documentation Skills

> **PARTIAL** — 2 of 5 skills skipped (tutorial-writing skills depend on Phase 6 which is N/A).

- [x] Create `.claude/skills/docs-creating-accessible-diagrams/SKILL.md`
  - Covers: alt text, color contrast, text equivalents, screen-reader compatibility
- [x] ~~Create `.claude/skills/docs-creating-by-example-tutorials/SKILL.md`~~ — SKIPPED (supports Phase 6, N/A)
- [x] ~~Create `.claude/skills/docs-creating-in-the-field-tutorials/SKILL.md`~~ — SKIPPED (supports Phase 6, N/A)
- [x] Create `.claude/skills/docs-validating-factual-accuracy/SKILL.md`
  - Covers: claim verification standards, sourcing requirements, version-pinned references
- [x] Create `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`
  - Covers: diff workflow between IKP-Labs `.claude/` and ose-public primer, what to adopt vs. skip

**Acceptance Criteria — Phase 8:**

- [x] 3 remaining skill files created (`accessible-diagrams`, `factual-accuracy`, `ose-primer-sync`)
- [x] No placeholder content or TODO sections in any file
- [x] Each has H1 title, category/purpose metadata, overview, and last-updated footer

---

## Phase 9: Low Priority — Language Extension Agents

- [x] Create `.claude/agents/swe-golang-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-golang`, `swe-developing-applications-common`
- [x] Create `.claude/agents/swe-rust-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-rust`, `swe-developing-applications-common`
- [x] Create `.claude/agents/swe-csharp-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-csharp`, `swe-developing-applications-common`
- [x] Create `.claude/agents/swe-fsharp-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-fsharp`, `swe-developing-applications-common`

**Acceptance Criteria — Phase 9:**

- [x] All 4 agent files created with correct frontmatter
- [x] Agents are generic (no IKP-Labs-specific stack assumptions for non-IKP languages)

---

## Phase 10: Low Priority — Language Extension Skills

- [x] Create `.claude/skills/swe-programming-golang/SKILL.md`
  - Covers: Go idioms, module system, error handling, testing with `go test`
- [x] Create `.claude/skills/swe-programming-rust/SKILL.md`
  - Covers: ownership model, Cargo, error handling with `Result`/`Option`, testing
- [x] Create `.claude/skills/swe-programming-csharp/SKILL.md`
  - Covers: .NET conventions, NuGet, async/await, xUnit testing
- [x] Create `.claude/skills/swe-programming-fsharp/SKILL.md`
  - Covers: functional-first patterns, discriminated unions, Railway-oriented programming, xUnit testing

**Acceptance Criteria — Phase 10:**

- [x] All 4 skill files created with no placeholder content
- [x] Each follows the SKILL.md structure (H1, category/purpose, overview, content, footer)

---

## Phase 11: Low Priority — Settings.json Additions

### LSP Plugins

- [x] Read `.claude/settings.json` to locate the `plugins` array (or equivalent key)
- [x] Add 7 LSP plugin entries: `gopls-lsp`, `rust-analyzer-lsp`, `pyright-lsp`, `kotlin-lsp`, `lua-lsp`, `swift-lsp`, `frontend-design` (all `@claude-plugins-official`)
- [x] Verify JSON is valid after edit

### Opencode Sync Permissions

> **SKIPPED** — IKP-Labs has no `.opencode/` folder and no `sync:claude-to-opencode` scripts.
> Revisit if opencode is adopted as an alternative Claude Code client.

- [x] ~~Add to `permissions.allow`: `Read(.opencode/**)`, `Write(.opencode/**)`, `Edit(.opencode/**)`, `Bash(npm run sync:claude-to-opencode:*)`~~ — SKIPPED (N/A)

**Acceptance Criteria — Phase 11:**

- [x] `settings.json` parses as valid JSON
- [x] Existing allow/deny entries are unchanged
- [x] 7 LSP entries present
- [x] ~~4 opencode entries present~~ — SKIPPED (N/A)

---

## Phase 12: Housekeeping

- [x] Update `plans/ideas.md` — mark Round 3 Active Ideas section as implemented (strikethrough + archive note)
- [x] Update `plans/README.md` — add Round 3 plan to the In Progress section listing
- [x] Update `.claude/agents/README.md` — add `social-linkedin-post-maker` to Standalone Utility Agents
- [x] Verify markdown lint passes on all new files

---

## Phase 13: Ship

- [x] Commit all new agents (High, Medium, Low) with `chore(agents): ...` — done per individual PR
- [x] Commit all new skills (High, Medium, Low) with `chore(skills): ...` — done per individual PR
- [x] Commit settings.json additions with `chore(config): add lsp plugins` — PR #179
- [x] Commit ideas.md update with housekeeping PR
- [x] Push branch and create PR
- [x] Merge PR
- [ ] Move plan to `done/2026-06-02__claude-governance-gap-round-3/`
- [ ] Commit plan move with `docs(plan): move claude-governance-gap-round-3 to done`

---

## Commit Summary

| Commit | Type  | Scope  | Message                                                                          |
| ------ | ----- | ------ | -------------------------------------------------------------------------------- |
| 1      | docs  | plan   | add claude-governance-gap-round-3 plan                                           |
| 2      | chore | agents | add repo-harness-compatibility agents + repo-setup-manager                       |
| 3      | chore | skills | add grill-me, plan-writing-gherkin-criteria, repo-mcf, docs-se-separation skills |
| 4      | chore | agents | add docs-software-engineering-separation checker/fixer                           |
| 5      | chore | agents | add pdf-to-md and docs-tutorial triads + social-linkedin-post-maker              |
| 6      | chore | skills | add medium-priority docs skills + repo-syncing-with-ose-primer                   |
| 7      | chore | agents | add swe language extension agents (golang, rust, csharp, fsharp)                 |
| 8      | chore | skills | add swe language extension skills                                                |
| 9      | chore | config | add lsp plugins and opencode permissions to settings.json                        |
| 10     | chore | ideas  | mark round-3 items as implemented in plans/ideas.md                              |
| 11     | docs  | plan   | move claude-governance-gap-round-3 to done                                       |
