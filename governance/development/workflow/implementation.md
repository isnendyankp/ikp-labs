# Implementation Workflow Template

> **Canonical path**: `governance/development/workflow/implementation.md`
> See also: `.workflow-template.md` at repo root (alias, kept for quick access)
> Template alur implementasi untuk IKP Labs project

---

## Governance Reference

Before starting any work, consult the governance layer relevant to your decision:

| Question | Document |
|----------|----------|
| Why does this project exist? | `governance/vision/ikp-labs.md` |
| Which approach aligns with project values? | `governance/principles/general.md` |
| What naming/format should I use? | `governance/conventions/development.md` |
| How should I structure this workflow? | `governance/development/workflow/implementation.md` (this file) |
| How should I structure a plan? | `plans/README.md` |

See `governance/repository-governance-architecture.md` for the full 6-layer governance model.

---

## Quick Reference: Task Types

| Task Type | Test Local? | Deploy? | Examples |
|-----------|-------------|---------|----------|
| 🔴 **Code Changes** | ✅ Ya | ✅ Ya | Feature, bugfix, refactor |
| 🟡 **Config Changes** | ⚠️ Partial | ✅ Ya | CORS, environment, API endpoints |
| 🟢 **Meta Changes** | ❌ Tidak | ❌ Tidak | .gitignore, docs, comments |
| 🔵 **Infra Changes** | ❌ Tidak | ⚠️ Manual | Nginx, SSL, database setup |

---

## Full Workflow (Code Changes)

### 0. Review & Overview

- [ ] Pastikan memahami project structure
- [ ] Cek file terkait untuk hindari DRY violation
- [ ] Review existing code patterns

### 1. Work Branch Setup

```bash
# Jika ada work branch existing yang relevan
git checkout existing-work-branch

# Jika belum ada, buat baru dari main
git checkout main
git pull origin main
git checkout -b feature/deskripsi-fitur
```

### 2. Check/Create Plan

- [ ] Cek folder `plans/in-progress/`
- [ ] Jika belum ada plan, buat dengan struktur:

  ```text
  plans/in-progress/YYYY-MM-DD__nama-fitur/
  ├── README.md           # Overview & scope
  ├── requirement.md      # Requirements & acceptance criteria
  ├── technical-design.md # Technical approach
  └── checklist.md        # Task checklist
  ```

### 3. Implementation

- [ ] Implementasi sesuai plan
- [ ] Follow existing code patterns
- [ ] Keep commits small & focused

### 4. Local Testing

**Prerequisite:**

- [ ] Pastikan PostgreSQL sudah running di port 5432

**Cek & Bersihkan Port (jika ada service yang nyangkut):**

```bash
# Cek apakah port BE (8081) atau FE (3002) sudah digunakan
lsof -i :8081
lsof -i :3002

# Kill process di port 8081 (BE) jika ada
lsof -ti :8081 | xargs kill -9

# Kill process di port 3002 (FE) jika ada
lsof -ti :3002 | xargs kill -9

# Atau kill semua sekaligus
lsof -ti :8081 | xargs kill -9 2>/dev/null; lsof -ti :3002 | xargs kill -9 2>/dev/null
```

**Start Services (fresh state):**

```bash
# Start backend
cd backend/ikp-labs-api && ./mvnw spring-boot:run

# Start frontend (new terminal)
cd frontend && npm run dev
```

**Verify Services Ready:**

- [ ] BE accessible di <http://localhost:8081>
- [ ] FE accessible di <http://localhost:3002>

**Run Tests:**

```bash
npm run test           # Frontend unit tests
./mvnw test           # Backend tests
npm run test:e2e      # E2E tests (optional)
```

- [ ] All tests pass
- [ ] Manual testing sesuai acceptance criteria

### 5. Update Plan

- [ ] Update `checklist.md` dengan progress
- [ ] Tambah notes di `technical-design.md` jika ada perubahan
- [ ] **Commit plan files bersama code changes** (lihat step 6)
- [ ] Jika selesai (100% checklist done):

  ```bash
  # Pindahkan folder ke done
  mv plans/in-progress/YYYY-MM-DD__nama-fitur plans/done/

  # Commit perubahan folder
  git add plans/
  git commit -m "docs(plan): move nama-fitur to done"
  ```

> **Important:** Plan files HARUS di-commit bersama code changes. Jangan menunggu plan 100% selesai baru commit. Setiap PR harus menyertakan update plan yang sesuai.
>
> **Setelah implementasi selesai dan di-merge:** Jangan lupa pindahkan plan ke `plans/done/` dan commit. Ini sering terlupa!

### 6. Commit Strategy
>
> Lebih banyak commit = lebih baik untuk GitHub activity
>
> **Plan files = bagian dari commit!** Setiap code change harus disertai update plan.

```bash
# Commit code + plan together (BEST PRACTICE)
git add src/components/NewFeature.tsx
git add plans/in-progress/2026-03-10__nama-fitur/checklist.md
git commit -m "feat: add NewFeature component"

git add src/hooks/useNewFeature.ts
git add plans/in-progress/2026-03-10__nama-fitur/checklist.md
git commit -m "feat: add useNewFeature hook"

git add src/api/newFeature.ts
git add plans/in-progress/2026-03-10__nama-fitur/checklist.md
git commit -m "feat: add NewFeature API integration"
```

**Contoh Partial Progress di checklist.md:**

```markdown
## Checklist
- [x] Create NewFeature component      ← baru selesai
- [x] Add useNewFeature hook           ← baru selesai
- [ ] Integrate with API               ← belum
- [ ] Write unit tests                 ← belum
```

**Commit Message Format:**

```text
<type>: <description>

Types:
- feat:     New feature
- fix:      Bug fix
- refactor: Code refactoring
- style:    Formatting, missing semicolons
- docs:     Documentation
- test:     Adding tests
- chore:    Maintenance, dependencies
```

### 7. Push to Work Branch

```bash
git push -u origin feature/deskripsi-fitur
```

### 8. Create Pull Request

```bash
gh pr create --title "feat: deskripsi singkat" --body "$(cat <<'EOF'
## Summary
- Bullet point perubahan utama
- Maksimal 3-5 points

## Test Plan
- [ ] Test case 1
- [ ] Test case 2
EOF
)"
```

### 9. Merge PR & Delete Branch

> ⚠️ **RECOMMENDED: Gunakan CLI (`gh`) untuk merge**
>
> Alasan:
>
> - `--delete-branch` otomatis hapus remote branch
> - Konsisten dengan workflow
> - Ada log history di terminal
>
> ❌ **Hindari merge via GitHub Web UI** karena:
>
> - Remote branch tidak otomatis terhapus
> - Perlu hapus manual setelah merge

```bash
# CLI merge (recommended) - auto delete remote branch
gh pr merge <PR_NUMBER> --rebase --delete-branch

# Jika lupa --delete-branch atau merge via Web UI, hapus manual:
git push origin --delete feature/deskripsi-fitur
```

### 10. Update Local Main & Cleanup

```bash
# Switch ke main dan update
git checkout main
git pull origin main

# Cleanup: Hapus local work branch jika sudah selesai
git branch -d feature/deskripsi-fitur

# Jika branch belum ter-merge (force delete)
git branch -D feature/deskripsi-fitur
```

> **Note:** Remote branch sudah otomatis terhapus saat `gh pr merge --delete-branch` di step 9.

### 11. Deploy to Production

```bash
# Option A: Deploy all
./scripts/deploy-all.sh

# Option B: Deploy specific
./scripts/deploy-backend.sh   # Backend only
./scripts/deploy-frontend.sh  # Frontend only

# Option C: Ask Claude
# "deploy ke production"
```

---

## Simplified Workflow (Meta Changes)

> Untuk: .gitignore, docs, comments, non-code files

### Steps (Abbreviated)

1. **Branch**: `git checkout -b chore/deskripsi`
2. **Changes**: Make minimal, focused changes
3. **Commit**: `git commit -m "chore: deskripsi"`
4. **Push**: `git push -u origin chore/deskripsi`
5. **PR**: Create with simple description
6. **Merge**: `gh pr merge --rebase --delete-branch`
7. **Update**: `git checkout main && git pull`
8. ~~Deploy~~: Skip (not needed)

---

## Config Changes Workflow

> Untuk: CORS, environment variables, API configs

### Steps

1. **Branch**: `git checkout -b config/deskripsi`
2. **Changes**: Update config files
3. **Test Local**: ✅ Required - verify config works
4. **Commit**: `git commit -m "config: update CORS settings"`
5. **PR → Merge → Update Main**
6. **Deploy**: ✅ Required - config changes need deployment

---

## Infrastructure Changes

> Untuk: Nginx, SSL, database, PM2 configs

### Steps (Infrastructure)

1. **No Branch Needed**: Usually done directly on VPS
2. **SSH to VPS**: `ssh nendy@170.64.130.3`
3. **Backup First**: Always backup config files
4. **Apply Changes**: Update server configs
5. **Test**: Verify changes work
6. **Document**: Update `deployment/deployment-guide.md`

---

## Emergency Hotfix

> Untuk: Critical bugs in production

### Steps (Fast Track)

```bash
# 1. Create hotfix branch from main
git checkout main && git pull
git checkout -b hotfix/critical-bug

# 2. Fix & test quickly
# ... implementasi ...

# 3. Fast commit & push
git add . && git commit -m "fix: critical bug description"
git push -u origin hotfix/critical-bug

# 4. PR with priority
gh pr create --title "🔥 HOTFIX: description"

# 5. Merge immediately after CI passes
gh pr merge --rebase --delete-branch

# 6. Deploy immediately
./scripts/deploy-all.sh
```

---

## Checklist Summary

### Code Changes (Full)

- [ ] 0. Review project context
- [ ] 1. Setup work branch
- [ ] 2. Check/create plan
- [ ] 3. Implementation
- [ ] 4. Local tests pass
- [ ] 5. Update plan (+ commit plan bersama code!)
- [ ] 6. Multiple commits (code + plan together)
- [ ] 7. Push to branch
- [ ] 8. Create PR
- [ ] 9. Rebase merge
- [ ] 10. Update local main
- [ ] 11. Move plan to done & commit ← **JANGAN LEWATKAN!**
- [ ] 12. Deploy to production

### Meta Changes (Simple)

- [ ] 1. Branch
- [ ] 2. Changes
- [ ] 3. Commit
- [ ] 4. Push
- [ ] 5. PR
- [ ] 6. Merge
- [ ] 7. Update main
- ~~[ ] 8. Deploy~~ ❌ Skip

---

## Quick Commands Reference

```bash
# Start new feature
git checkout main && git pull && git checkout -b feature/nama

# Create PR
gh pr create --title "type: description"

# Check PR status
gh pr view <NUMBER>

# Merge PR
gh pr merge <NUMBER> --rebase --delete-branch

# Deploy
./scripts/deploy-all.sh

# Check VPS status
ssh nendy@170.64.130.3 "pm2 list"
```

---

## Branch Hygiene (Maintenance Berkala)

> Cleanup branch yang sudah tidak diperlukan. Lakukan secara berkala (weekly/monthly).

### Cek Branch Remote yang Sudah Merged

```bash
# Lihat semua branch remote yang sudah merged ke main
git fetch --all
git branch -r --merged origin/main | grep -v main
```

### Hapus Branch Obsolete Satu-satu

```bash
# Hapus branch remote spesifik
git push origin --delete feature/nama-branch
```

### Bulk Cleanup (Hapus Semua Merged Branch)

```bash
# ⚠️ Hati-hati! Pastikan semua branch sudah merged sebelum run
git branch -r --merged origin/main | grep -v main | grep -v HEAD | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```

### Cek Local Branches yang Sudah Tidak Ada di Remote

```bash
# Lihat local branches
git branch

# Hapus local branch yang sudah tidak ada di remote
git fetch --prune
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```

---

Last updated: March 2026
