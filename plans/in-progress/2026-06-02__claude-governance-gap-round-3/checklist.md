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
- [ ] Commit: `docs(plan): update phase 3 — overlap decision and sub-phase split`

---

## Phase 3b: grill-me skill

- [ ] Create `.claude/skills/grill-me/SKILL.md`
- [ ] Defines interactive Q&A format: topic intake → question generation → answer feedback loop
- [ ] Includes example question types (concept check, code review, scenario-based)

**Acceptance Criteria — Phase 3b:**

- [ ] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [ ] No placeholder content
- [ ] Commit: `chore(skills): add grill-me skill`

---

## Phase 3c: plan-writing-gherkin-criteria skill

- [ ] Create `.claude/skills/plan-writing-gherkin-criteria/SKILL.md`
- [ ] Covers Given/When/Then syntax, Scenario Outline, Background, tags
- [ ] References `specs/` as canonical home for `.feature` files
- [ ] Provides IKP-Labs-specific examples from existing specs

**Acceptance Criteria — Phase 3c:**

- [ ] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [ ] No placeholder content
- [ ] Commit: `chore(skills): add plan-writing-gherkin-criteria skill`

---

## Phase 3d: repo-assessing-criticality-confidence skill

- [ ] Create `.claude/skills/repo-assessing-criticality-confidence/SKILL.md`
- [ ] Adopt from senior repo (`wahidyankf/ose-public`) — adapt to IKP-Labs context
- [ ] Remove OSE/ayokoding domain examples — replace with IKP-Labs domains (CI, docs, plans, specs)
- [ ] Covers: P0–P4 priority matrix, execution order, dual-label pattern, domain examples framework
- [ ] Remove references to `repo-governance/` convention docs (IKP-Labs uses `governance/` path)

**Acceptance Criteria — Phase 3d:**

- [ ] SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [ ] No OSE/ayokoding references
- [ ] No placeholder content
- [ ] Commit: `chore(skills): add repo-assessing-criticality-confidence skill`

---

**Acceptance Criteria — Phase 3 (all):**

- [ ] All 3 skill files created (3b, 3c, 3d)
- [ ] Each SKILL.md has H1 title, category/purpose block, overview, substantive content, last-updated footer
- [ ] No placeholder content in any file

---

## Phase 4: High Priority — Skills (Part B: Docs SE Separation)

### docs-validating-software-engineering-separation skill

- [ ] Create `.claude/skills/docs-validating-software-engineering-separation/SKILL.md`
- [ ] Defines SE-separation rules: what constitutes mixing SE and non-SE content
- [ ] Provides compliant vs. non-compliant examples
- [ ] Maps violation types to Diátaxis categories (tutorial, how-to, reference, explanation)

### docs-software-engineering-separation-checker

- [ ] Create `.claude/agents/docs-software-engineering-separation-checker.md`
- [ ] Frontmatter: `model: sonnet`, `color: green`, skills: `docs-validating-software-engineering-separation`, `wow-criticality-assessment`
- [ ] Body: scans `docs/`, produces line-level findings referencing rule IDs from the skill

### docs-software-engineering-separation-fixer

- [ ] Create `.claude/agents/docs-software-engineering-separation-fixer.md`
- [ ] Frontmatter: `model: sonnet`, `color: yellow`, skills: `docs-validating-software-engineering-separation`, `wow-criticality-assessment`
- [ ] Body: reads checker report, splits mixed content into appropriate Diátaxis category files

**Acceptance Criteria — Phase 4:**

- [ ] Skill and 2 agent files created
- [ ] Checker references skill rule IDs in its output format description
- [ ] Fixer explicitly states it reads checker output before acting

---

## Phase 5: Medium Priority — PDF-to-MD Triad

- [ ] Create `.claude/agents/pdf-to-md-maker.md`
  - Frontmatter: `model: sonnet`, `color: purple`
  - Body: accepts PDF path, produces `.md` preserving headings, tables, links
- [ ] Create `.claude/agents/pdf-to-md-checker.md`
  - Frontmatter: `model: sonnet`, `color: green`, skills: `docs-applying-content-quality`, `wow-criticality-assessment`
  - Body: validates heading hierarchy, table formatting, link integrity in maker output
- [ ] Create `.claude/agents/pdf-to-md-fixer.md`
  - Frontmatter: `model: sonnet`, `color: yellow`, skills: `docs-applying-content-quality`, `wow-criticality-assessment`
  - Body: reads checker report, corrects formatting issues

**Acceptance Criteria — Phase 5:**

- [ ] All 3 agent files created
- [ ] Checker and fixer files reference `docs-applying-content-quality` skill (already exists)

---

## Phase 6: Medium Priority — Docs Tutorial Triad

- [ ] Create `.claude/agents/docs-tutorial-maker.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `docs-applying-diataxis-framework`, `docs-applying-content-quality`
  - Body: creates Diátaxis tutorial drafts with prerequisites, ordered steps, expected outcomes
- [ ] Create `.claude/agents/docs-tutorial-checker.md`
  - Frontmatter: `model: sonnet`, `color: green`, skills: `docs-applying-diataxis-framework`, `wow-criticality-assessment`
  - Body: validates tutorial against Diátaxis structure, checks step ordering and learning outcomes
- [ ] Create `.claude/agents/docs-tutorial-fixer.md`
  - Frontmatter: `model: sonnet`, `color: yellow`, skills: `docs-applying-diataxis-framework`, `wow-criticality-assessment`
  - Body: corrects violations without altering compliant sections

**Acceptance Criteria — Phase 6:**

- [ ] All 3 agent files created
- [ ] All reference `docs-applying-diataxis-framework` skill (already exists)

---

## Phase 7: Medium Priority — LinkedIn Post Maker

- [ ] Create `.claude/agents/social-linkedin-post-maker.md`
  - Frontmatter: `model: sonnet`, `color: orange`, skills: `docs-applying-content-quality`
  - Body: accepts source (PR, changelog, or prompt), produces LinkedIn post in developer tone
  - Constraint: explicitly states it does not fabricate metrics

**Acceptance Criteria — Phase 7:**

- [ ] Agent file created
- [ ] No-fabrication constraint is explicit in agent body

---

## Phase 8: Medium Priority — Documentation Skills

- [ ] Create `.claude/skills/docs-creating-accessible-diagrams/SKILL.md`
  - Covers: alt text, color contrast, text equivalents, screen-reader compatibility
- [ ] Create `.claude/skills/docs-creating-by-example-tutorials/SKILL.md`
  - Covers: code-first format, minimal narrative, runnable examples, progressive complexity
- [ ] Create `.claude/skills/docs-creating-in-the-field-tutorials/SKILL.md`
  - Covers: scenario-driven format, real-world context, user role framing
- [ ] Create `.claude/skills/docs-validating-factual-accuracy/SKILL.md`
  - Covers: claim verification standards, sourcing requirements, version-pinned references
- [ ] Create `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`
  - Covers: diff workflow between IKP-Labs `.claude/` and ose-public primer, what to adopt vs. skip

**Acceptance Criteria — Phase 8:**

- [ ] All 5 skill files created
- [ ] No placeholder content or TODO sections in any file
- [ ] Each has H1 title, category/purpose metadata, overview, and last-updated footer

---

## Phase 9: Low Priority — Language Extension Agents

- [ ] Create `.claude/agents/swe-golang-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-golang`, `swe-developing-applications-common`
- [ ] Create `.claude/agents/swe-rust-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-rust`, `swe-developing-applications-common`
- [ ] Create `.claude/agents/swe-csharp-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-csharp`, `swe-developing-applications-common`
- [ ] Create `.claude/agents/swe-fsharp-dev.md`
  - Frontmatter: `model: sonnet`, `color: purple`, skills: `swe-programming-fsharp`, `swe-developing-applications-common`

**Acceptance Criteria — Phase 9:**

- [ ] All 4 agent files created with correct frontmatter
- [ ] Agents are generic (no IKP-Labs-specific stack assumptions for non-IKP languages)

---

## Phase 10: Low Priority — Language Extension Skills

- [ ] Create `.claude/skills/swe-programming-golang/SKILL.md`
  - Covers: Go idioms, module system, error handling, testing with `go test`
- [ ] Create `.claude/skills/swe-programming-rust/SKILL.md`
  - Covers: ownership model, Cargo, error handling with `Result`/`Option`, testing
- [ ] Create `.claude/skills/swe-programming-csharp/SKILL.md`
  - Covers: .NET conventions, NuGet, async/await, xUnit testing
- [ ] Create `.claude/skills/swe-programming-fsharp/SKILL.md`
  - Covers: functional-first patterns, discriminated unions, Railway-oriented programming, xUnit testing

**Acceptance Criteria — Phase 10:**

- [ ] All 4 skill files created with no placeholder content
- [ ] Each follows the SKILL.md structure (H1, category/purpose, overview, content, footer)

---

## Phase 11: Low Priority — Settings.json Additions

### LSP Plugins

- [ ] Read `.claude/settings.json` to locate the `plugins` array (or equivalent key)
- [ ] Add 7 LSP plugin entries: `gopls-lsp`, `rust-analyzer-lsp`, `pyright-lsp`, `kotlin-lsp`, `lua-lsp`, `swift-lsp`, `frontend-design` (all `@claude-plugins-official`)
- [ ] Verify JSON is valid after edit

### Opencode Sync Permissions

- [ ] Add to `permissions.allow`: `Read(.opencode/**)`, `Write(.opencode/**)`, `Edit(.opencode/**)`, `Bash(npm run sync:claude-to-opencode:*)`
- [ ] Verify JSON is valid after edit

**Acceptance Criteria — Phase 11:**

- [ ] `settings.json` parses as valid JSON
- [ ] Existing allow/deny entries are unchanged
- [ ] 7 LSP entries and 4 opencode entries are present

---

## Phase 12: Housekeeping

- [ ] Update `plans/ideas.md` — mark Round 3 Active Ideas section as implemented (strikethrough + archive note)
- [ ] Update `plans/README.md` — add Round 3 plan to the In Progress section listing
- [ ] Verify markdown lint passes on all new files

---

## Phase 13: Ship

- [ ] Commit all new agents (High, Medium, Low) with `chore(agents): ...`
- [ ] Commit all new skills (High, Medium, Low) with `chore(skills): ...`
- [ ] Commit settings.json additions with `chore(config): add lsp plugins and opencode permissions`
- [ ] Commit ideas.md update with `chore(ideas): mark round-3 items as implemented`
- [ ] Push branch and create PR
- [ ] Merge PR
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
