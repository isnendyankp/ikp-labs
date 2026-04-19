# Checklist: Project Governance

---

## Phase 1: Foundation (Layer 1-3)

### Branch Setup
- [x] Create work branch `docs/project-governance-foundation` from main

### Create Governance Folder
- [x] Create `governance/` directory at repo root

### governance/README.md
- [x] Create `governance/README.md`
- [x] Include one-sentence project governance summary
- [x] List all governance documents with one-line descriptions
- [x] Include brief 6-layer model overview (3-5 lines)
- [x] Add pointer to `docs/explanation/governance.md` for full explanation

### governance/vision.md
- [x] Create `governance/vision.md`
- [x] Write "Project Purpose" section — why IKP-Labs exists
- [x] Write "Target Users" section — who uses the system specifically
- [x] Write "What Success Looks Like" section — observable outcomes
- [x] Write "Long-Term Goals" section — mature project vision

### governance/principles.md
- [x] Create `governance/principles.md`
- [x] Write Principle 1: Test-First Confidence (statement, rationale, examples)
- [x] Write Principle 2: Explicit Over Implicit (statement, rationale, examples)
- [x] Write Principle 3: Incremental Change (statement, rationale, examples)
- [x] Write Principle 4: Documentation as Code (statement, rationale, examples)
- [x] Write Principle 5: DX Consistency (statement, rationale, examples)
- [x] Write Principle 6: Separation of Concerns (statement, rationale, examples)
- [x] Write Principle 7: Security by Default (statement, rationale, examples)

### governance/conventions.md
- [x] Create `governance/conventions.md`
- [x] Write commit message format section (types, rules, examples)
- [x] Write branch naming section (pattern, all allowed types, examples)
- [x] Write PR format section (title max length, body template)
- [x] Write TypeScript conventions section (file naming, component naming, hook naming, type naming, constant naming, API function naming)
- [x] Write Java conventions section (class, method, package, DTO, annotation patterns)
- [x] Write file and folder naming section (app folders, spec files, plan folders, doc files)

### Commit Phase 1
- [x] Stage and commit governance folder
- [x] Push to branch

### PR Phase 1
- [x] Create PR with title `docs: add governance foundation (Layer 1-3)`
- [x] PR body lists all 4 governance files created
- [ ] Wait for CI to pass
- [ ] Merge PR with rebase: `gh pr merge --rebase --delete-branch`
- [ ] Update local main: `git checkout main && git pull origin main`

---

## Phase 2: Integration

### Branch Setup
- [ ] Create work branch `docs/project-governance-integration` from main
  ```bash
  git checkout main
  git pull origin main
  git checkout -b docs/project-governance-integration
  ```

### Update .workflow-template.md
- [ ] Open `.workflow-template.md` and read current content
- [ ] Add "Governance Reference" table section after the Quick Reference table and before the Full Workflow section
- [ ] Table maps decision questions to governance document file paths
- [ ] Update step "2. Check/Create Plan" to reference `governance/conventions.md` for plan naming
- [ ] Verify no existing content was modified beyond the two additions

### Create docs/explanation/governance.md
- [ ] Create `docs/explanation/governance.md`
- [ ] Write "Why Governance?" section — problems governance solves
- [ ] Write "The 6-Layer Model" section with ASCII diagram showing layer hierarchy
- [ ] Write individual section for each layer (1-6) explaining what it contains and why
- [ ] Write "How Layers Interact" section — escalation and override rules
- [ ] Write "For AI Agents" section — brief pointer to `governance/ai-agent-guidelines.md`

### Update docs/explanation/README.md
- [ ] Open `docs/explanation/README.md` and read current content
- [ ] Add entry for `governance.md` under a "Governance" heading or in an appropriate existing section
- [ ] Entry includes link and one-line description

### Commit Phase 2
- [ ] Stage and commit all Phase 2 changes:
  ```
  docs: integrate governance into workflow and explanation docs
  ```
- [ ] Push to branch

### PR Phase 2
- [ ] Create PR with title `docs: integrate governance into workflow and explanation docs`
- [ ] PR body lists `.workflow-template.md`, `docs/explanation/governance.md`, `docs/explanation/README.md`
- [ ] Wait for CI to pass
- [ ] Merge PR with rebase: `gh pr merge --rebase --delete-branch`
- [ ] Update local main: `git checkout main && git pull origin main`

---

## Phase 3: AI Agent Governance

### Branch Setup
- [ ] Create work branch `docs/project-governance-ai-agent` from main
  ```bash
  git checkout main
  git pull origin main
  git checkout -b docs/project-governance-ai-agent
  ```

### governance/ai-agent-guidelines.md
- [ ] Create `governance/ai-agent-guidelines.md`
- [ ] Write "Purpose" section — why these guidelines exist
- [ ] Write "Governance Consultation Order" section — layers 1-6 priority list
- [ ] Write "Decision Types and Which Layer Applies" section — mapping of decision categories to layers
- [ ] Write "Handling Ambiguity" section — what to do when governance is unclear
- [ ] Write "What AI Agents Should NOT Do" section — explicit prohibitions
- [ ] Write "Plan Creation Protocol" section — all rules for creating plans
- [ ] Write "Code Change Protocol" section — conventions to follow when writing code
- [ ] Write "Documentation Protocol" section — conventions for creating docs

### Update governance/README.md
- [ ] Open `governance/README.md` and read current content
- [ ] Add entry for `ai-agent-guidelines.md` to the document list

### Commit Phase 3
- [ ] Stage and commit all Phase 3 changes:
  ```
  docs: add AI agent governance guidelines
  ```
- [ ] Push to branch

### PR Phase 3
- [ ] Create PR with title `docs: add AI agent governance guidelines`
- [ ] PR body describes the new `ai-agent-guidelines.md` and the `governance/README.md` update
- [ ] Wait for CI to pass
- [ ] Merge PR with rebase: `gh pr merge --rebase --delete-branch`
- [ ] Update local main: `git checkout main && git pull origin main`

---

## Completion

### Move Plan to Done
- [ ] All 3 phases merged to main
- [ ] Move plan folder:
  ```bash
  git checkout -b docs/close-governance-plan
  git mv plans/in-progress/2026-04-18__project-governance plans/done/2026-04-18__project-governance
  git commit -m "docs(plan): move project-governance to done"
  git push -u origin docs/close-governance-plan
  gh pr merge --rebase --delete-branch
  git checkout main && git pull origin main
  ```

### Final Verification
- [ ] `governance/` folder exists at repo root with 5 files
- [ ] `governance/vision.md` answers why the project exists
- [ ] `governance/principles.md` has at least 5 principles with examples
- [ ] `governance/conventions.md` covers commits, branches, PRs, TypeScript, Java, file naming
- [ ] `governance/ai-agent-guidelines.md` specifies consultation order and decision protocols
- [ ] `.workflow-template.md` has governance reference table
- [ ] `docs/explanation/governance.md` exists and explains all 6 layers
- [ ] `docs/explanation/README.md` links to `governance.md`
- [ ] No app source code was modified
- [ ] CI passes on all 3 merged PRs

---

**Created**: April 18, 2026
**Status**: Not Started
