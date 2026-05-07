# Principles

These 7 principles guide every decision in IKP-Labs — from architecture to naming to workflow. When facing a choice, check which principle applies and let it break the tie.

---

## 1. Test-First Confidence

**Statement**: Write tests before or alongside features, never as an afterthought.

**Rationale**: Tests in IKP-Labs are not a formality — they are the proof that the application works. Without tests, refactors break silently and regressions reach production. The project enforces a 30% coverage threshold in `jest.config.js` as a floor, not a ceiling.

**In practice**:

- New features include Gherkin specs before implementation begins
- E2E tests cover the happy path and at least one edge case for every user-facing flow
- A PR that adds a feature without tests requires explicit justification

---

## 2. Explicit Over Implicit

**Statement**: Prefer clear, readable code over clever shortcuts.

**Rationale**: IKP-Labs is a learning reference. Code that is obvious to read teaches more than code that requires deep context to understand. This applies to types, naming, API paths, and configuration.

**In practice**:

- Named DTOs (`UploadPhotoRequest`, `PhotoResponse`) instead of raw Maps or generic objects
- Explicit TypeScript types instead of `any`
- Endpoint paths use full resource names (`/api/gallery/upload` not `/api/g/u`)
- Comments explain *why*, not *what* — the code says what

---

## 3. Incremental Change

**Statement**: Make one focused change per PR. Keep scope small and reviewable.

**Rationale**: Large PRs are hard to review, hard to revert, and hide bugs. Small PRs give a clear history of what changed and why. The workflow enforces this through branch-per-feature and rebase merges.

**In practice**:

- A single PR addresses one concern (one feature, one fix, one refactor)
- If a task requires multiple phases, each phase is a separate PR
- "While I'm here" changes go in a separate branch, not the current PR

---

## 4. Documentation as Code

**Statement**: Documentation lives in the repository and is updated in the same PR as the code it describes.

**Rationale**: Documentation that lives outside the repo drifts. Documentation that is updated in a separate PR gets skipped. When docs are part of the same commit as the code, they stay accurate by default.

**In practice**:

- `plans/` checklist files are committed alongside code changes (see `.workflow-template.md`)
- `docs/` files are updated in the same PR when behavior changes
- Governance documents are treated with the same discipline as source code — reviewed, versioned, and never deleted

---

## 5. DX Consistency

**Statement**: Developer experience commands must be uniform across all apps in the monorepo.

**Rationale**: A monorepo's value comes from a unified developer experience. If running tests requires a different command for each app, the monorepo becomes harder to work with than separate repos.

**In practice**:

- All apps use `npx nx test <app>` for unit tests
- All apps use `npx nx e2e <app>` for E2E tests
- All apps use `npx nx build <app>` for builds
- Local start/stop procedures follow the same pattern across frontend and backend

---

## 6. Separation of Concerns

**Statement**: Keep distinct things distinct — specs from implementations, plans from docs, frontend from backend.

**Rationale**: Mixed concerns create coupling. When tests live next to specs, and plans live next to permanent docs, it becomes unclear where to look for what. IKP-Labs uses clear top-level folders to enforce this separation.

**In practice**:

- `specs/` contains Gherkin feature files only — no implementation
- `plans/` contains work tracking only — no permanent knowledge
- `docs/` contains permanent documentation only — no ephemeral notes
- `apps/kameravue-fe` and `apps/kameravue-be` have no cross-dependencies beyond the API contract

---

## 7. Security by Default

**Statement**: Authentication and authorization must be correct from the start — not added later.

**Rationale**: Retrofitting security creates gaps. IKP-Labs handles real user data (photos, emails, passwords). The JWT authentication and protected routes architecture was built into the project foundation, not bolted on.

**In practice**:

- All endpoints that modify data require a valid JWT token
- Password hashing uses bcrypt — never plaintext or reversible encryption
- Environment variables store all secrets — never hardcoded in source
- Test cleanup endpoints (`/api/test-admin/...`) are never exposed in production profiles
