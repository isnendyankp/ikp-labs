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
- [x] Create work branch `docs/project-governance-integration` from main

### Update .workflow-template.md
- [x] Open `.workflow-template.md` and read current content
- [x] Add "Governance Reference" table section before Quick Reference table
- [x] Table maps decision questions to governance document file paths
- [x] Verify no existing content was modified beyond the addition

### Create docs/explanation/governance.md
- [x] Create `docs/explanation/governance.md`
- [x] Write "Why Governance?" section — problems governance solves
- [x] Write "The 6-Layer Model" section with ASCII diagram showing layer hierarchy
- [x] Write individual section for each layer (1-6) explaining what it contains and why
- [x] Write "How Layers Interact" section — escalation and override rules
- [x] Write "For AI Agents" section — brief pointer to `governance/ai-agent-guidelines.md`

### Update docs/explanation/README.md
- [x] Open `docs/explanation/README.md` and read current content
- [x] Add entry for `governance.md` under "Governance" heading
- [x] Entry includes link and one-line description

### Commit Phase 2
- [x] Stage and commit all Phase 2 changes
- [x] Push to branch

### PR Phase 2
- [x] Create PR with title `docs: integrate governance into workflow and explanation docs`
- [x] PR body lists all changed files
- [ ] Wait for CI to pass
- [ ] Merge PR with rebase: `gh pr merge --rebase --delete-branch`
- [ ] Update local main: `git checkout main && git pull origin main`

---

## Phase 3: AI Agent Governance

### Branch Setup
- [x] Create work branch `docs/project-governance-ai-agent` from main

### governance/ai-agent-guidelines.md
- [x] Create `governance/ai-agent-guidelines.md`
- [x] Write "Purpose" section — why these guidelines exist
- [x] Write "Governance Consultation Order" section — layers 1-6 priority list
- [x] Write "Decision Types and Which Layer Applies" section — mapping of decision categories to layers
- [x] Write "Handling Ambiguity" section — what to do when governance is unclear
- [x] Write "What AI Agents Should NOT Do" section — explicit prohibitions
- [x] Write "Plan Creation Protocol" section — all rules for creating plans
- [x] Write "Code Change Protocol" section — conventions to follow when writing code
- [x] Write "Documentation Protocol" section — conventions for creating docs

### Update governance/README.md
- [x] Open `governance/README.md` and read current content
- [x] Add entry for `ai-agent-guidelines.md` to the document list

### Commit Phase 3
- [x] Stage and commit all Phase 3 changes
- [x] Push to branch

### PR Phase 3
- [x] Create PR #71 with title `docs: add AI agent governance guidelines`
- [x] PR body describes the new `ai-agent-guidelines.md` and the `governance/README.md` update
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
