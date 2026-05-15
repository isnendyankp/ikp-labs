# Technical Design

## Approach

Simple rename operation. No logic changes.

## Changes

### File Renames

| Old Path                              | New Path                                        |
| ------------------------------------- | ----------------------------------------------- |
| `.github/workflows/ci.yml`            | `.github/workflows/kameravue-ci.yml`            |
| `.github/workflows/scheduled-e2e.yml` | `.github/workflows/kameravue-scheduled-e2e.yml` |

### Internal Changes

#### kameravue-ci.yml

- `name: CI` -> `name: Kameravue CI`
- Job names: prefix with "Kameravue" (e.g., `Frontend Lint` -> `Kameravue Frontend Lint`)
- Comment references: `scheduled-e2e.yml` -> `kameravue-scheduled-e2e.yml`
- Header comment: update title to mention Kameravue

#### kameravue-scheduled-e2e.yml

- `name: Scheduled E2E Tests` -> `name: Kameravue Scheduled E2E Tests`
- Job names: prefix with "Kameravue" (e.g., `E2E Tests (Scheduled)` -> `Kameravue E2E Tests (Scheduled)`)
- Header comment: update title to mention Kameravue

### Concurrency Group

The concurrency group uses `${{ github.workflow }}` which auto-updates with the new filename, so no manual change needed.

### Branch Protection

Branch protection rules reference jobs by name. Updated job names need to match. However, since we're only adding "Kameravue" prefix, we may need to update branch protection on GitHub settings if they use exact job name matching.
