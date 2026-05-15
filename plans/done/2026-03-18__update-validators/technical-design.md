# Technical Design: Update Validator Agents

---

## Current vs Target Structure

### Test Files

| Aspect    | Current (Wrong)            | Target (Correct)      |
| --------- | -------------------------- | --------------------- |
| E2E Tests | `frontend/tests/*.spec.ts` | `tests/e2e/*.spec.ts` |
| API Tests | Not mentioned              | `tests/api/*.spec.ts` |
| Count     | Generic examples           | 22 E2E, 6 API tests   |

### Spec Files

| Aspect        | Current (Wrong)   | Target (Correct)                             |
| ------------- | ----------------- | -------------------------------------------- |
| Gherkin Specs | `specs/*.feature` | `specs/**/*.feature`                         |
| Gherkin Tests | Not mentioned     | `tests/gherkin/features/*.feature`           |
| Structure     | Flat              | Nested (authentication/, gallery/, profile/) |

---

## Changes by File

### 1. test-validator.md

### Lines to Update

1. **Line ~30-35:** Project Structure section

   ```markdown
   # BEFORE

   ├── frontend/
   │ ├── tests/
   │ │ ├── gallery-sorting.spec.ts
   │ │ ├── auth.spec.ts

   # AFTER

   ├── tests/
   │ ├── e2e/
   │ │ ├── gallery-sorting.spec.ts
   │ │ ├── auth-flow.spec.ts
   │ │ └── ... (22 files)
   │ ├── api/
   │ │ ├── auth.api.spec.ts
   │ │ └── ... (6 files)
   │ └── gherkin/features/
   ```

2. **Line ~70-71:** Analysis Steps

   ```markdown
   # BEFORE

   1. List all Playwright test files (`frontend/tests/*.spec.ts`)

   # AFTER

   1. List all Playwright test files (`tests/e2e/*.spec.ts`, `tests/api/*.spec.ts`)
   ```

3. **Line ~609-610:** Last Updated

   ```markdown
   # BEFORE

   **Last Updated:** January 8, 2026

   # AFTER

   **Last Updated:** March 18, 2026
   ```

### 2. docs-validator.md

### Lines to Update

1. **Line ~35-55:** Project Structure section
   - Update path references from `frontend/src/` to correct structure
   - Add `tests/` directory at root level

2. **Line ~848-849:** Last Updated

   ```markdown
   # BEFORE

   **Last Updated:** January 8, 2026

   # AFTER

   **Last Updated:** March 18, 2026
   ```

### 3. plan-checker.md

### Lines to Update

1. **Line ~35-55:** Project Structure section
   - Update to show correct `tests/` structure
   - Add `plans/` directory structure

2. **Line ~1114-1115:** Last Updated

   ```markdown
   # BEFORE

   **Last Updated:** January 9, 2026

   # AFTER

   **Last Updated:** March 18, 2026
   ```

---

## Implementation Approach

### Phase 1: test-validator.md

- Most affected file (test paths)
- Update project structure diagram
- Fix analysis step references
- Update metadata

### Phase 2: docs-validator.md

- Moderate changes
- Update project structure
- Fix any path references
- Update metadata

### Phase 3: plan-checker.md

- Similar to docs-validator
- Update project structure
- Update metadata

---

## Testing Strategy

### Verification Steps

1. Read each updated file to confirm changes
2. Verify no syntax errors in markdown
3. Confirm path references match actual structure

### Rollback Plan

- Git history allows easy rollback
- Each file committed separately for granular rollback
