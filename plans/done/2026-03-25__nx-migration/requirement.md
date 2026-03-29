# Requirements: Nx Monorepo Migration

---

## Functional Requirements

### FR-01: Nx Workspace Setup
- System harus memiliki Nx terinstall di root project
- System harus memiliki `nx.json` dengan konfigurasi yang valid
- System harus memiliki `workspace.json` atau `project.json` per app

### FR-02: Apps Migration
- Frontend harus dapat diakses di `apps/frontend/`
- Backend harus dapat diakses di `apps/backend/`
- Semua fitur yang ada harus tetap berfungsi setelah migrasi

### FR-03: Build Commands
- Developer harus dapat run `nx build frontend`
- Developer harus dapat run `nx build backend`
- Developer harus dapat run `nx serve frontend`
- Developer harus dapat run `nx test frontend`

### FR-04: CI/CD Integration
- CI pipeline harus berjalan dengan struktur folder baru
- Semua test harus pass di CI dengan struktur baru

### FR-05: Deployment
- Deployment ke production harus berhasil dengan path baru
- Tidak ada downtime saat deployment

### FR-06: Shared Library (Optional)
- System harus memiliki `libs/shared-types/` untuk TypeScript types
- Frontend harus dapat import dari shared library

---

## Non-Functional Requirements

### NFR-01: Backward Compatibility
- Semua existing scripts harus tetap berfungsi atau diupdate
- Environment variables tidak berubah

### NFR-02: Performance
- Build time tidak boleh lebih lambat dari sebelumnya
- Nx caching harus aktif untuk mempercepat build

### NFR-03: Developer Experience
- Commands harus intuitif dan mudah diingat
- Dependency graph harus dapat di-visualisasi dengan `nx graph`

---

## Acceptance Criteria

### Phase 0: Planning
- [ ] Plan directory created di `plans/in-progress/2026-03-25__nx-migration/`
- [ ] README.md, requirement.md, technical-design.md, checklist.md created
- [ ] PR merged ke main

### Phase 1: Setup Nx Workspace
- [ ] Nx terinstall di root package.json
- [ ] `nx.json` created dengan konfigurasi dasar
- [ ] `apps/` folder created
- [ ] `libs/` folder created
- [ ] `npx nx graph` menampilkan struktur project
- [ ] PR merged ke main

### Phase 2: Migrate Frontend
- [ ] `frontend/` moved ke `apps/frontend/`
- [ ] `apps/frontend/project.json` created
- [ ] `nx serve frontend` berjalan
- [ ] `nx build frontend` berjalan
- [ ] `nx test frontend` berjalan
- [ ] Frontend berfungsi normal di browser
- [ ] PR merged ke main

### Phase 3: Migrate Backend
- [ ] `backend/` moved ke `apps/backend/`
- [ ] `apps/backend/project.json` created
- [ ] `nx build backend` berjalan (wrapper untuk mvn)
- [ ] Backend berfungsi normal (API accessible)
- [ ] PR merged ke main

### Phase 4: Update CI/CD & Deploy
- [ ] `.github/workflows/ci.yml` updated dengan path baru
- [ ] `scripts/deploy-frontend.sh` updated
- [ ] `scripts/deploy-backend.sh` updated
- [ ] PM2 ecosystem config updated (jika ada)
- [ ] CI pipeline pass
- [ ] Deployment ke production berhasil
- [ ] PR merged ke main

### Phase 5: Shared Library (Optional)
- [ ] `libs/shared-types/` created
- [ ] TypeScript types untuk API response defined
- [ ] Frontend dapat import dari shared-types
- [ ] PR merged ke main

---

## Definition of Done

Migrasi dianggap selesai jika:

1. Semua 6 phase selesai dan merged ke main
2. `nx graph` menampilkan dependency graph yang valid
3. CI pipeline berjalan normal dengan semua tests pass
4. Deployment ke production berhasil tanpa error
5. Developer dapat develop dengan commands:
   - `nx serve frontend`
   - `nx serve backend`
   - `nx build frontend`
   - `nx build backend`
   - `nx test frontend`

---

**Created**: March 25, 2026
