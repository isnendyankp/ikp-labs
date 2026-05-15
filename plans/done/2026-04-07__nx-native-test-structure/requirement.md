# Requirements: Nx-Native Test Structure Migration

---

## Functional Requirements

### FR-01: Centralized Gherkin Specs

- System harus memiliki folder `specs/` di root untuk Gherkin feature files
- Specs harus terorganisir per domain: `specs/authentication/`, `specs/gallery/`, `specs/profile/`
- Feature files harus dapat diakses dari multiple test implementations

### FR-02: Frontend Unit Tests Co-located

- Frontend unit tests harus berada di `apps/kameravue-fe/__tests__/`
- Jest configuration harus ada di `apps/kameravue-fe/jest.config.js`
- Developer harus dapat run `nx test kameravue-fe`
- Coverage reports harus di-generate di `apps/kameravue-fe/coverage/`

### FR-03: Backend Unit Tests (Already Exists)

- Backend unit tests sudah ada di `apps/kameravue-be/ikp-labs-api/src/test/` (Java standard)
- `nx test kameravue-be` harus tetap berfungsi
- JaCoCo coverage reports harus tetap di-generate

### FR-04: Frontend E2E as Nx App

- E2E tests harus menjadi Nx app di `apps/kameravue-fe-e2e/`
- App harus memiliki `project.json` dengan target `e2e`
- Playwright config harus ada di `apps/kameravue-fe-e2e/playwright.config.ts`
- Gherkin step definitions harus di `apps/kameravue-fe-e2e/steps/`
- Developer harus dapat run `nx e2e kameravue-fe-e2e`

### FR-05: Backend API E2E as Nx App

- API tests harus menjadi Nx app di `apps/kameravue-be-e2e/`
- App harus memiliki `project.json` dengan target `e2e`
- Playwright config harus ada di `apps/kameravue-be-e2e/playwright.config.ts`
- Developer harus dapat run `nx e2e kameravue-be-e2e`

### FR-06: GitHub Actions Integration

- CI workflow harus menggunakan Nx commands
- `kameravue-ci.yml` harus run `nx test kameravue-fe` dan `nx e2e kameravue-be-e2e`
- `kameravue-scheduled-e2e.yml` harus run `nx e2e kameravue-fe-e2e`
- Semua tests harus pass di CI dengan struktur baru

### FR-07: Nx Configuration

- `nx.json` harus include `e2e` di `cacheableOperations`
- Each E2E app harus memiliki `implicitDependencies` ke parent apps
- Test artifacts harus di-output ke folder yang benar

---

## Non-Functional Requirements

### NFR-01: Backward Compatibility

- Semua existing tests harus tetap berfungsi setelah migrasi
- Test coverage tidak boleh berkurang
- Test logic tidak boleh berubah

### NFR-02: Performance

- Test execution time tidak boleh lebih lambat
- Nx caching harus mempercepat re-runs
- CI pipeline duration harus tetap ~3 menit (PR) dan ~7-8 menit (E2E)

### NFR-03: Developer Experience

- Commands harus intuitif: `nx test <app>`, `nx e2e <app>`
- Test output harus jelas dan readable
- Error messages harus helpful

### NFR-04: Maintainability

- Test structure harus scalable untuk future apps
- Gherkin specs harus reusable
- Separation of concerns antara specs dan implementation

---

## Acceptance Criteria

### Phase 0: Planning

- [x] Plan directory created di `plans/in-progress/2026-04-07__nx-native-test-structure/`
- [ ] README.md, requirement.md, technical-design.md, checklist.md created
- [ ] PR created dan merged ke main

### Phase 1: Create Centralized Specs

- [ ] `specs/` folder created di root
- [ ] `specs/authentication/` created dengan login.feature, registration.feature, home-page.feature
- [ ] `specs/gallery/` created dengan photo-\*.feature files
- [ ] `specs/profile/` created dengan profile-picture.feature
- [ ] All .feature files moved dari `tests/gherkin/features/` dan `specs/` (old)
- [ ] PR merged ke main

### Phase 2: Move Frontend Unit Tests

- [ ] `apps/kameravue-fe/__tests__/` folder created
- [ ] Existing Jest tests moved (if any)
- [ ] `apps/kameravue-fe/jest.config.js` created/updated
- [ ] `apps/kameravue-fe/project.json` updated dengan `test` target
- [ ] `nx test kameravue-fe` berjalan dan pass
- [ ] Coverage report generated di `apps/kameravue-fe/coverage/`
- [ ] PR merged ke main

### Phase 3: Create Frontend E2E App

- [ ] `apps/kameravue-fe-e2e/` folder created
- [ ] `apps/kameravue-fe-e2e/project.json` created dengan targets: `e2e`, `e2e:ui`
- [ ] `apps/kameravue-fe-e2e/playwright.config.ts` created
- [ ] E2E tests moved dari `tests/e2e/` ke `apps/kameravue-fe-e2e/tests/`
- [ ] Gherkin steps moved dari `tests/gherkin/steps/` ke `apps/kameravue-fe-e2e/steps/`
- [ ] Fixtures moved dari `tests/fixtures/` ke `apps/kameravue-fe-e2e/fixtures/`
- [ ] Import paths updated untuk specs (dari `specs/`)
- [ ] `nx e2e kameravue-fe-e2e` berjalan dan pass
- [ ] PR merged ke main

### Phase 4: Create Backend E2E App

- [ ] `apps/kameravue-be-e2e/` folder created
- [ ] `apps/kameravue-be-e2e/project.json` created dengan target `e2e`
- [ ] `apps/kameravue-be-e2e/playwright.config.ts` created
- [ ] API tests moved dari `tests/api/` ke `apps/kameravue-be-e2e/tests/`
- [ ] `nx e2e kameravue-be-e2e` berjalan dan pass
- [ ] PR merged ke main

### Phase 5: Update GitHub Actions

- [ ] `kameravue-ci.yml` updated:
  - Frontend tests: `nx test kameravue-fe`
  - Backend tests: `nx test kameravue-be` (unchanged)
  - API tests: `nx e2e kameravue-be-e2e`
- [ ] `kameravue-scheduled-e2e.yml` updated:
  - E2E tests: `nx e2e kameravue-fe-e2e`
- [ ] Artifact upload paths updated
- [ ] CI pipeline pass dengan semua tests
- [ ] PR merged ke main

### Phase 6: Cleanup & Documentation

- [ ] Old `tests/` folder removed
- [ ] Root `playwright.config.ts` removed or updated
- [ ] README.md updated dengan new test commands
- [ ] `docs/` updated dengan new test structure
- [ ] Plan moved ke `plans/done/`
- [ ] PR merged ke main

---

## Definition of Done

Migrasi dianggap selesai jika:

1. Semua 7 phase selesai dan merged ke main (7 PRs untuk GitHub activity)
2. Commands berfungsi:
   - `nx test kameravue-fe` - Frontend unit tests
   - `nx test kameravue-be` - Backend unit tests
   - `nx e2e kameravue-fe-e2e` - Frontend E2E tests
   - `nx e2e kameravue-be-e2e` - Backend API tests
3. GitHub Actions workflows pass dengan struktur baru
4. Old `tests/` folder removed
5. Documentation updated
6. Semua tests pass dengan coverage yang sama atau lebih baik

---

**Created**: April 7, 2026
