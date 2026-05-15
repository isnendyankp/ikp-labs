# Nx-Native Test Structure Migration

> Migrasi test structure IKP-Labs dari centralized `tests/` ke Nx-native pattern (co-located tests + E2E apps)

---

## Overview

Project ini bertujuan untuk migrasi struktur testing IKP-Labs mengikuti pattern Nx monorepo seperti repo senior (open-sharia-enterprise). Migrasi dilakukan secara bertahap dalam 6 phase untuk memastikan setiap langkah terkontrol dan dapat di-rollback jika terjadi masalah.

**Key Changes:**

- Unit tests pindah ke dalam apps (`apps/kameravue-fe/__tests__/`)
- E2E tests menjadi Nx apps terpisah (`apps/kameravue-fe-e2e/`, `apps/kameravue-be-e2e/`)
- Gherkin specs terpusat di `specs/` folder
- GitHub Actions workflows updated untuk Nx commands

## Goals

1. **Adopt Nx-native test structure** - Tests co-located dengan apps, E2E sebagai apps terpisah
2. **Improve test organization** - Separation of concerns antara specs dan implementation
3. **Enable Nx test features** - Caching, affected tests, dependency graph
4. **Follow senior's pattern** - Belajar dari best practices repo senior

## Scope

### In Scope

- Create centralized `specs/` folder untuk Gherkin features
- Move unit tests ke dalam apps
- Create `apps/kameravue-fe-e2e/` untuk frontend E2E tests
- Create `apps/kameravue-be-e2e/` untuk backend API tests
- Update GitHub Actions workflows
- Update `nx.json` dan `project.json` configs

### Out of Scope

- Menulis test cases baru
- Mengubah test logic yang sudah ada
- Mengubah Playwright configuration (kecuali path)
- Menambah test coverage

## Timeline

| Phase   | Deskripsi                | Estimasi | PR   |
| ------- | ------------------------ | -------- | ---- |
| Phase 0 | Planning (Hari ini)      | 1 hari   | 1 PR |
| Phase 1 | Create Centralized Specs | 1 hari   | 1 PR |
| Phase 2 | Move Frontend Unit Tests | 1 hari   | 1 PR |
| Phase 3 | Create Frontend E2E App  | 1-2 hari | 1 PR |
| Phase 4 | Create Backend E2E App   | 1 hari   | 1 PR |
| Phase 5 | Update GitHub Actions    | 1 hari   | 1 PR |
| Phase 6 | Cleanup & Documentation  | 1 hari   | 1 PR |

**Total**: 7-8 hari (7 PRs, 1 per phase untuk GitHub activity)

## Success Criteria

- [ ] Semua phase selesai dengan PR merged ke main
- [ ] `nx test kameravue-fe` runs frontend unit tests
- [ ] `nx test kameravue-be` runs backend unit tests
- [ ] `nx e2e kameravue-fe-e2e` runs frontend E2E tests
- [ ] `nx e2e kameravue-be-e2e` runs backend API tests
- [ ] GitHub Actions workflows berjalan normal
- [ ] Semua tests pass dengan struktur baru
- [ ] Old `tests/` folder removed

## Risks

| Risiko                    | Mitigasi                           |
| ------------------------- | ---------------------------------- |
| Import paths broken       | Test di setiap phase sebelum merge |
| GitHub Actions timeout    | Update paths incrementally         |
| Test failures             | Keep old structure until verified  |
| Gherkin step imports fail | Use relative paths carefully       |

## References

- [Senior's Repo - OSE](https://github.com/wahidyankf/open-sharia-enterprise)
- [OSE organiclever-fe](https://github.com/wahidyankf/open-sharia-enterprise/tree/main/apps/organiclever-fe)
- [OSE organiclever-fe-e2e](https://github.com/wahidyankf/open-sharia-enterprise/tree/main/apps/organiclever-fe-e2e)
- [OSE specs](https://github.com/wahidyankf/open-sharia-enterprise/tree/main/specs)
- [Nx Documentation](https://nx.dev/)

---

**Created**: April 7, 2026
**Status**: Planning Phase
**Estimated Completion**: April 14-15, 2026
