# Roadmap

IKP-Labs is a full-stack learning platform built around real applications. Each phase adds a new app to the Nx monorepo while inheriting all existing governance, conventions, and tooling.

---

## Phase 1 — KameraVue (Photo Gallery) ✅ Live

> **Status**: Production deployed at [kameravue.com](https://kameravue.com)

A full-stack photo gallery application demonstrating modern web development practices.

**Apps:**

- `kameravue-fe` — Next.js 15 frontend
- `kameravue-be` — Spring Boot 3 backend
- `kameravue-fe-e2e` — Playwright browser E2E tests
- `kameravue-be-e2e` — Playwright API tests

**Completed:**

- [x] Photo gallery with full CRUD, privacy controls, likes
- [x] JWT authentication with protected routes
- [x] User profile management with photo upload
- [x] 512 tests (unit, integration, API, E2E) — 100% pass rate
- [x] Production deployment on DigitalOcean VPS with SSL
- [x] CI/CD with GitHub Actions (scheduled E2E twice daily)
- [x] Nx monorepo structure
- [x] 6-layer governance model
- [x] Commitlint + Prettier for code consistency

---

## Phase 2 — App #2 📋 Planned

> **Status**: Planning

Second application to be added to the monorepo. Will inherit all Phase 1 governance, conventions, and CI/CD infrastructure automatically.

**Goals:**

- [ ] Define app concept and scope
- [ ] Add `apps/[app-name]-fe/` and `apps/[app-name]-be/` to monorepo
- [ ] Verify governance travels automatically to new app
- [ ] Shared libraries via `libs/` if overlap with KameraVue

---

## Phase 3 — Shared Libraries 📋 Planned

> **Status**: Idea

Extract reusable code shared between apps into `libs/`.

**Candidates:**

- Shared TypeScript types (API contracts)
- Common UI components
- Shared test utilities

---

## Phase 4 — Production Hardening 📋 Planned

> **Status**: Idea

- [ ] Single-command deploy with rollback capability
- [ ] Monitoring and alerting
- [ ] `SECURITY.md` and vulnerability reporting process
- [ ] `tsconfig.base.json` for shared TypeScript paths across apps

---

## Governance

All phases follow the 6-layer governance model. New apps inherit standards automatically.

See [`governance/README.md`](governance/README.md) for the full model.

---

**Last Updated**: April 2026
**Live**: [kameravue.com](https://kameravue.com) · **Repo**: [github.com/isnendyankp/ikp-labs](https://github.com/isnendyankp/ikp-labs)
