# Requirements

## Functional Requirements
1. `ci.yml` renamed to `kameravue-ci.yml` with `name: Kameravue CI`
2. `scheduled-e2e.yml` renamed to `kameravue-scheduled-e2e.yml` with `name: Kameravue Scheduled E2E Tests`
3. All internal cross-references updated (comments mentioning other workflow files)
4. Workflow triggers (`paths:` filters) scoped to `apps/kameravue-*` folders

## Acceptance Criteria
- [ ] GitHub Actions tab shows "Kameravue CI" instead of generic "CI"
- [ ] GitHub Actions tab shows "Kameravue Scheduled E2E Tests" instead of "Scheduled E2E Tests"
- [ ] No broken cross-references between workflow files
- [ ] CI still triggers correctly on push/PR affecting kameravue files
