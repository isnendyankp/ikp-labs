# Requirements

## User Stories

### Story 1: Markdown Linting
**As a** developer  
**I want** markdown files to be automatically linted  
**So that** documentation is consistent and professional across the repo

**Acceptance Criteria:**
- [ ] `.markdownlint-cli2.jsonc` config file exists with sensible rules
- [ ] `.markdownlintignore` file exists to exclude `node_modules`, etc.
- [ ] `markdownlint-cli2` package installed in `devDependencies`
- [ ] `npm run lint:md` command works and lints all markdown files
- [ ] Markdown linting runs automatically on pre-commit via `lint-staged`
- [ ] Existing markdown files either pass linting or violations are documented

---

### Story 2: Pre-push Quality Gate
**As a** developer  
**I want** code quality checks to run before pushing  
**So that** I don't push broken code to remote and fail CI

**Acceptance Criteria:**
- [ ] `.husky/pre-push` hook file exists and is executable
- [ ] Pre-push hook runs `nx affected -t typecheck --base=origin/main`
- [ ] Pre-push hook runs `nx affected -t lint --base=origin/main`
- [ ] Pre-push hook runs `nx affected -t test:quick --base=origin/main`
- [ ] Hook exits with error code if any check fails
- [ ] Hook can be bypassed with `git push --no-verify` if needed
- [ ] `package.json` has `typecheck` script defined
- [ ] `package.json` has `test:quick` script defined (or uses existing `test`)

---

## Non-Functional Requirements

### Performance
- Pre-push hook should only check **affected projects** (not all)
- Markdown linting should complete in <5 seconds for typical commits

### Compatibility
- Works on macOS (primary development environment)
- Compatible with existing husky setup
- Does not break existing pre-commit hook

### Maintainability
- Config files are well-commented
- Scripts are documented in package.json
- Follows conventions from senior repo (ose-public)

---

## Constraints

- Must not break existing workflow
- Must follow governance conventions
- Must use existing tools (Nx, Husky) where possible
- Config should match senior repo patterns
