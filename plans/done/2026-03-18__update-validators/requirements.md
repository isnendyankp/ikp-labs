# Requirements: Update Validator Agents

---

## Functional Requirements

### FR-1: Test Path Updates

- **FR-1.1:** Update test file location from `frontend/tests/*.spec.ts` to `tests/e2e/*.spec.ts`
- **FR-1.2:** Add reference to `tests/api/*.spec.ts` for API tests
- **FR-1.3:** Update test count examples to reflect actual structure (22 E2E tests, 6 API tests)

### FR-2: Spec Path Updates

- **FR-2.1:** Update Gherkin spec location from `specs/*.feature` to `specs/**/*.feature`
- **FR-2.2:** Add reference to `tests/gherkin/features/*.feature` for gherkin tests
- **FR-2.3:** Document nested spec structure (authentication/, gallery/, profile/)

### FR-3: Project Structure Documentation

- **FR-3.1:** Update project tree diagram in all validators
- **FR-3.2:** Reflect actual directory structure with `tests/` at root level
- **FR-3.3:** Keep tech stack versions (Next.js 15.5.0, React 19.1.0) - still accurate

### FR-4: Metadata Updates

- **FR-4.1:** Update "Last Updated" date to 2026-03-18
- **FR-4.2:** Bump version from 1.0 to 1.1

---

## Non-Functional Requirements

### NFR-1: Backward Compatibility

- Validators should continue to work with existing skills
- No breaking changes to agent descriptions

### NFR-2: Documentation Quality

- Follow existing markdown formatting
- Maintain consistency across all 3 validators

---

## Acceptance Criteria

### AC-1: test-validator.md

- [ ] Test path changed to `tests/e2e/` and `tests/api/`
- [ ] Spec path updated to `specs/**/*.feature`
- [ ] Project structure diagram accurate
- [ ] Last updated date = 2026-03-18

### AC-2: docs-validator.md

- [ ] Project structure diagram accurate
- [ ] Path references corrected if any
- [ ] Last updated date = 2026-03-18

### AC-3: plan-checker.md

- [ ] Project structure diagram accurate
- [ ] Path references corrected if any
- [ ] Last updated date = 2026-03-18

---

## Constraints & Assumptions

### Constraints

- Must follow existing agent markdown structure
- Must not break agent invocation

### Assumptions

- Current project structure is stable and won't change soon
- Skills files referenced by validators are still accurate
