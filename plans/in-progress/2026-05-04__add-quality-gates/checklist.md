# Implementation Checklist

## Phase 1: Markdown Linting Setup

### Config Files
- [ ] Create `.markdownlint-cli2.jsonc` with config rules
- [ ] Create `.markdownlintignore` with ignore patterns
- [ ] Verify config syntax is valid JSON

### Package Dependencies
- [ ] Add `markdownlint-cli2` to `devDependencies` in package.json
- [ ] Run `npm install` to install new package
- [ ] Verify package installed correctly

### Scripts & Integration
- [ ] Add `lint:md` script to package.json
- [ ] Update `lint-staged` config to include markdown files
- [ ] Test `npm run lint:md` command works

### Testing & Validation
- [ ] Run markdown linting on all existing markdown files
- [ ] Fix critical markdown violations (if any)
- [ ] Document acceptable violations (if any)
- [ ] Test pre-commit hook with markdown file change
- [ ] Verify markdown linting runs automatically on commit

### PR #1: Markdown Linting
- [ ] Create branch `chore/add-markdown-linting`
- [ ] Commit config files
- [ ] Commit package.json changes
- [ ] Update this checklist
- [ ] Push branch
- [ ] Create PR with title: `chore: add markdown linting`
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main branch

---

## Phase 2: Pre-push Hook Setup

### Pre-push Hook Script
- [ ] Create `.husky/pre-push` file
- [ ] Add typecheck command to pre-push hook
- [ ] Add lint command to pre-push hook
- [ ] Add test command to pre-push hook
- [ ] Make pre-push hook executable (`chmod +x`)

### Package Scripts
- [ ] Add `typecheck` script to package.json (if not exists)
- [ ] Add `test:quick` script to package.json (or use existing `test`)
- [ ] Verify scripts work: `npm run typecheck`
- [ ] Verify scripts work: `npm run test:quick`

### Testing & Validation
- [ ] Make a test change to frontend code
- [ ] Commit the change
- [ ] Attempt to push (should trigger pre-push hook)
- [ ] Verify typecheck runs for affected projects
- [ ] Verify lint runs for affected projects
- [ ] Verify test runs for affected projects
- [ ] Test hook blocks push on failure (introduce intentional error)
- [ ] Test `--no-verify` bypass works
- [ ] Remove test changes

### PR #2: Pre-push Hook
- [ ] Create branch `chore/add-pre-push-hook`
- [ ] Commit `.husky/pre-push` file
- [ ] Commit package.json changes (if any)
- [ ] Update this checklist
- [ ] Push branch
- [ ] Create PR with title: `chore: add pre-push hook`
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main branch

---

## Phase 3: Plan Closure

### Documentation
- [ ] Verify all acceptance criteria met in requirements.md
- [ ] Update README.md status to "Completed"
- [ ] Add completion date to README.md

### Plan Archival
- [ ] Move plan folder to `plans/done/`
- [ ] Commit plan move: `docs(plan): move add-quality-gates to done`
- [ ] Push to main

---

## Notes

- Each phase should be a separate PR for clean git history
- Update this checklist after each commit
- Test thoroughly before merging each PR
- Follow governance workflow: branch → commit → PR → merge → update main
