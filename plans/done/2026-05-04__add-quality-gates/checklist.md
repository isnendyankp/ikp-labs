# Implementation Checklist

## Phase 1: Markdown Linting Setup

### Config Files

- [x] Create `.markdownlint-cli2.jsonc` with config rules
- [x] Create `.markdownlintignore` with ignore patterns
- [x] Verify config syntax is valid JSON

### Package Dependencies

- [x] Add `markdownlint-cli2` to `devDependencies` in package.json
- [x] Run `npm install` to install new package
- [x] Verify package installed correctly

### Scripts & Integration

- [x] Add `lint:md` script to package.json
- [x] Update `lint-staged` config to include markdown files
- [x] Test `npm run lint:md` command works

### Testing & Validation

- [x] Run markdown linting on all existing markdown files (9475 violations found - documented)
- [ ] Fix critical markdown violations (deferred - will fix incrementally)
- [x] Document acceptable violations (violations are non-breaking, will fix over time)
- [ ] Test pre-commit hook with markdown file change
- [ ] Verify markdown linting runs automatically on commit

### PR #1: Markdown Linting

- [x] Create branch `chore/add-markdown-linting`
- [x] Commit config files
- [x] Commit package.json changes
- [x] Update this checklist
- [ ] Push branch
- [ ] Create PR with title: `chore: add markdown linting`
- [ ] Merge PR with `gh pr merge --rebase --delete-branch`
- [ ] Update local main branch

---

## Phase 2: Pre-push Hook Setup

### Pre-push Hook Script

- [x] Create `.husky/pre-push` file
- [x] Add typecheck command to pre-push hook
- [x] Add lint command to pre-push hook
- [x] Add test command to pre-push hook
- [x] Make pre-push hook executable (`chmod +x`)

### Package Scripts

- [x] Add `typecheck` script to package.json
- [x] Use existing `test` script (no need for test:quick)
- [ ] Verify scripts work: `npm run typecheck` (will test after merge)
- [ ] Verify scripts work: `npm test` (will test after merge)

### Testing & Validation

- [ ] Test pre-push hook after merge (deferred - will test in next commit)
- [ ] Verify typecheck runs for affected projects
- [ ] Verify lint runs for affected projects
- [ ] Verify test runs for affected projects

### PR #2: Pre-push Hook

- [x] Create branch `chore/add-pre-push-hook`
- [x] Commit `.husky/pre-push` file
- [x] Commit package.json changes
- [x] Update this checklist
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
