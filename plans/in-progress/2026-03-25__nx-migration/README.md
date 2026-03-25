# Nx Monorepo Migration Plan

> Migrasi IKP-Labs dari manual monorepo ke Nx monorepo

---

## Overview

Project ini bertujuan untuk migrasi struktur IKP-Labs dari manual monorepo (npm workspaces) ke Nx monorepo. Migrasi dilakukan secara bertahap dalam 6 phase (Phase 0-5) untuk memastikan setiap langkah terkontrol dan dapat di-rollback jika terjadi masalah.

## Goals

1. **Adopt Nx monorepo structure** - Struktur yang lebih terorganisir untuk multiple apps
2. **Prepare for future apps** - Memudahkan penambahan apps baru (mobile, admin panel, dll)
3. **Improve developer experience** - Command yang lebih baik, dependency graph, code generators
4. **Learning opportunity** - Memahami monorepo tools seperti senior (OSE)

## Scope

### In Scope
- Setup Nx workspace configuration
- Migrate `frontend/` to `apps/frontend/`
- Migrate `backend/` to `apps/backend/`
- Update CI/CD pipelines
- Update deployment scripts
- Create shared types library (optional)

### Out of Scope
- Menambah apps baru
- Mengubah business logic
- Mengubah database schema
- Mengubah API endpoints

## Timeline

| Phase | Deskripsi | Estimasi |
|-------|-----------|----------|
| Phase 0 | Planning (Hari ini) | 1 hari |
| Phase 1 | Setup Nx Workspace | 1 hari |
| Phase 2 | Migrate Frontend | 1 hari |
| Phase 3 | Migrate Backend | 1 hari |
| Phase 4 | Update CI/CD & Deploy | 1 hari |
| Phase 5 | Shared Library (Optional) | 1 hari |

**Total**: 6 hari (1 PR per phase)

## Success Criteria

- [ ] Semua phase selesai dengan PR merged ke main
- [ ] CI pipeline berjalan normal dengan struktur baru
- [ ] Deployment ke production berhasil tanpa downtime
- [ ] Developer bisa run `nx build`, `nx serve`, `nx test`
- [ ] Dependency graph dapat di-generate dengan `nx graph`

## Risks

| Risiko | Mitigasi |
|--------|----------|
| Build failure set | Test thorough di setiap phase |
| CI timeout | Update paths sebelum merge |
| Deploy gagal | Rollback ke previous commit |
| Import paths broken | Use IDE "Find and Replace" |

## References

- [Nx Documentation](https://nx.dev/)
- [Senior's Repo - OSE](https://github.com/wahidyankf/open-sharia-enterprise)
- [Workflow Template](/.workflow-template.md)

---

**Created**: March 25, 2026
**Status**: Planning Phase
