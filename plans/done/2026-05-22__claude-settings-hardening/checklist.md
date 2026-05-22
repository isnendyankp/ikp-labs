# Checklist: Claude Settings Hardening

---

## Implementation

### Branch Setup

- [ ] `git checkout main && git pull origin main`
- [ ] `git checkout -b chore/claude-settings-hardening`

### Update settings.json

- [ ] Add `permissions.allow` section
- [ ] Add `enabledPlugins` section (5 plugins)
- [ ] Add `extraKnownMarketplaces` section

### Verify

- [ ] `permissions`, `enabledPlugins`, `extraKnownMarketplaces` all present
- [ ] Existing `hooks` section unchanged

### Commit & PR

- [ ] `git add -f .claude/settings.json`
- [ ] `git commit -m "chore(settings): add permissions, enabledPlugins, marketplaces"`
- [ ] `git push -u origin chore/claude-settings-hardening`
- [ ] `gh pr create --title "chore(settings): add permissions and plugins"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`

---

## Close Plan

- [ ] `git checkout -b docs/close-claude-settings-hardening-plan`
- [ ] `git mv plans/in-progress/2026-05-22__claude-settings-hardening plans/done/`
- [ ] `git commit -m "docs(plan): move claude-settings-hardening to done"`
- [ ] PR + merge

---

**Created**: 2026-05-22
**Status**: In Progress
