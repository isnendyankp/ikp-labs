# Checklist: Governance Restructuring

---

## Phase 1: Branch Setup

- [ ] Create work branch `docs/governance-restructuring` from main
  ```bash
  git checkout main && git pull origin main
  git checkout -b docs/governance-restructuring
  ```

---

## Phase 2: Create Folder Structure

- [ ] Create `governance/vision/` directory
- [ ] Create `governance/principles/` directory
- [ ] Create `governance/conventions/` directory
- [ ] Create `governance/development/` directory
- [ ] Create `governance/development/workflow/` directory
- [ ] Create `governance/development/agents/` directory
- [ ] Create `governance/workflows/` directory

---

## Phase 3: Move Existing Files

- [ ] `git mv governance/vision.md governance/vision/ikp-labs.md`
- [ ] `git mv governance/principles.md governance/principles/general.md`
- [ ] `git mv governance/conventions.md governance/conventions/development.md`
- [ ] `git mv governance/ai-agent-guidelines.md governance/development/agents/ai-agent-guidelines.md`

---

## Phase 4: Create Index README Files

- [ ] Create `governance/vision/README.md` — list `ikp-labs.md` with one-line desc
- [ ] Create `governance/principles/README.md` — list `general.md` with one-line desc
- [ ] Create `governance/conventions/README.md` — list `development.md` with one-line desc
- [ ] Create `governance/development/README.md` — list `workflow/` and `agents/` subfolders
- [ ] Create `governance/development/workflow/README.md` — list `implementation.md`
- [ ] Create `governance/development/agents/README.md` — list `ai-agent-guidelines.md`
- [ ] Create `governance/workflows/README.md` — placeholder with note "future workflow docs"

---

## Phase 5: Create New Files

- [ ] Create `governance/development/workflow/implementation.md`
  - Copy content from `.workflow-template.md`
  - Add header note: "Canonical path. See also `.workflow-template.md` at repo root."
- [ ] Create `governance/repository-governance-architecture.md`
  - Copy content from `docs/explanation/governance.md`
  - Add header note: "Canonical path. See also `docs/explanation/governance.md`."

---

## Phase 6: Update Cross-References

- [ ] Update `governance/README.md` — rewrite to reflect new folder structure
- [ ] Update `governance/development/agents/ai-agent-guidelines.md`
  - Governance consultation order table: update any self-referencing paths
- [ ] Update `AGENTS.md`
  - `governance/ai-agent-guidelines.md` → `governance/development/agents/ai-agent-guidelines.md`
- [ ] Update `docs/explanation/governance.md`
  - Add note at top: "Content also available at `governance/repository-governance-architecture.md`"
- [ ] Update `docs/explanation/README.md`
  - Verify link to governance.md still valid (file stays, just gets a note)
- [ ] Update `.workflow-template.md`
  - Add note at top: "Canonical path: `governance/development/workflow/implementation.md`"

---

## Phase 7: Verify

- [ ] All 5 original flat files no longer exist at old paths
- [ ] All 5 files exist at new paths with identical content
- [ ] All 7 new folder `README.md` files exist
- [ ] `governance/repository-governance-architecture.md` exists
- [ ] `governance/development/workflow/implementation.md` exists
- [ ] `AGENTS.md` references correct new paths
- [ ] `governance/README.md` lists new structure correctly
- [ ] No broken paths in `docs/explanation/governance.md`

---

## Phase 8: Commit, Push, PR

- [ ] Stage all changes: `git add governance/ AGENTS.md docs/ .workflow-template.md`
- [ ] Commit: `docs: restructure governance into hierarchical folders`
- [ ] Push: `git push -u origin docs/governance-restructuring`
- [ ] Create PR with title `docs: restructure governance into hierarchical folders`
- [ ] Wait for CI to pass
- [ ] Merge PR: `gh pr merge --rebase --delete-branch`
- [ ] Update local main: `git checkout main && git pull origin main`

---

## Phase 9: Move Plan to Done

- [ ] Move plan:
  ```bash
  git checkout -b docs/close-governance-restructuring-plan
  git mv plans/in-progress/2026-04-25__governance-restructuring plans/done/2026-04-25__governance-restructuring
  git commit -m "docs(plan): move governance-restructuring to done"
  git push -u origin docs/close-governance-restructuring-plan
  gh pr merge --rebase --delete-branch
  git checkout main && git pull origin main
  ```

---

## Acceptance Criteria

- [ ] All 5 existing governance files at new paths, content unchanged
- [ ] 7 folder `README.md` index files exist
- [ ] `governance/repository-governance-architecture.md` exists
- [ ] All cross-references updated — no stale paths
- [ ] CI passes
- [ ] No app source code modified

---

**Created**: 2026-04-25
**Status**: Planning
