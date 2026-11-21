# Checklist: Deploy Frontend to Vercel

Legend: `[PR]` = normal git/PR task, executable via tools. `[MANUAL]` = requires
the user's own interactive action (account login, dashboard click-through,
SSH session) — not resolvable by `git diff`, written as a confirmation step.

## Phase 0 — Plan Setup `[PR]` (not counted in the 3-PR total)

- [x] Create `plans/in-progress/2026-11-21__vercel-frontend-deploy/README.md`
- [x] Create `plans/in-progress/2026-11-21__vercel-frontend-deploy/requirements.md`
- [x] Create `plans/in-progress/2026-11-21__vercel-frontend-deploy/technical-design.md`
- [x] Create `plans/in-progress/2026-11-21__vercel-frontend-deploy/checklist.md` (this file)
- [x] Run the post-write grill-me validation pass against all 4 documents
- [x] Commit all 4 documents and open the Phase 0 PR (PR #353)
- [x] Merge the Phase 0 PR to `main`

## Phase 1a — Patch the Next.js CVE `[PR]` — ✅ Merged (PR #354)

- [x] Create branch `fix/deps-nextjs-cve-2026-96889` from `main`
- [x] Edit `apps/kameravue-fe/package.json`: `"next": "15.5.0"` → `"next": "15.5.29"`
- [x] Edit `apps/kameravue-fe/package.json`: `"eslint-config-next": "15.5.0"` → `"eslint-config-next": "15.5.29"`
- [x] From the repo root, run `npm install` to regenerate `package-lock.json` against the bumped versions
- [x] Verify the patched version resolved — the lockfile actually keys workspace-specific
      resolutions under `apps/kameravue-fe/node_modules/next`, not the top-level
      `node_modules/next` this item originally assumed: `node -e "console.log(require('./package-lock.json').packages['apps/kameravue-fe/node_modules/next'].version)"` printed `15.5.29`
- [x] Run `nx lint kameravue-fe` — no new lint errors introduced by the bump
- [x] Run `nx test kameravue-fe` — existing unit tests still pass (394/394)
- [x] Run `nx build kameravue-fe` — production build still succeeds on `15.5.29`
- [x] Commit with message `fix(deps): patch next.js critical rce (cve-2026-96889)`
- [x] Push branch, open PR 1a, verify `kameravue-ci.yml` passes
- [x] Merge PR 1a to `main`

## Phase 1b — Delete the Stale Nested Lockfile `[PR]` — ✅ Merged (PR #355)

- [x] Create branch `chore/remove-stale-fe-lockfile` from `main` (after Phase 1a is merged)
- [x] `git rm apps/kameravue-fe/package-lock.json`
- [x] Verify: `find . -name "package-lock.json" -not -path "*/node_modules/*"` returns only the repo-root `package-lock.json`
- [x] Run `npm ci` from the repo root — confirm it still succeeds with only the root lockfile present.
      This also surfaced a previously-missing set of optional platform packages
      (`@next/swc-*` for darwin/linux) that npm backfilled into the root lockfile —
      confirming the nested lockfile had been quietly interfering with root lockfile
      resolution, not just sitting unused
- [x] Run `nx lint kameravue-fe`, `nx test kameravue-fe`, `nx build kameravue-fe` individually
      (the `nx run-many -t lint test build` form originally planned here failed to parse
      its `-t` argument in this environment; running each target separately worked and
      confirmed nothing in CI depended on the nested lockfile)
- [x] Commit with message `chore(fe): remove stale duplicate package-lock.json`
- [x] Push branch, open PR 1b, verify `kameravue-ci.yml` passes
- [x] Merge PR 1b to `main`

**Phase 1 complete. Execution pauses here — Phase 2 requires the user's own
interactive action in the Vercel dashboard and cannot be performed via any
available tool.**

## Phase 2 — Vercel Project Setup `[MANUAL]` — interactive, not a PR

**Pause point.** Everything below this line requires the user's own action
in a browser (and optionally the Vercel CLI) — it cannot be performed via
`git`/`gh` or any available tool. Each item is phrased as something to
**confirm happened**, not a diff to review.

- [ ] Confirm the user has (or has created) a Vercel account, signed in at
      `https://vercel.com`
- [ ] Confirm the user has connected their GitHub account/organization to
      Vercel (Vercel dashboard → Add New → Project → "Continue with GitHub",
      granting access to the IKP-Labs repository)
- [ ] Confirm the IKP-Labs repository is selected for import in the Vercel
      "Import Git Repository" screen
- [ ] On the "Configure Project" screen, confirm these exact field values
      are set before the first deploy:
  - [ ] **Project Name**: user's choice (any value is fine — this is what
        shapes the resulting `*.vercel.app` subdomain)
  - [ ] **Framework Preset**: `Next.js` (should auto-detect once Root
        Directory below is set)
  - [ ] **Root Directory**: `apps/kameravue-fe` (click "Edit" next to Root
        Directory, select/type `apps/kameravue-fe`) — this is the setting
        that makes Vercel build only the frontend out of the monorepo
  - [ ] **Build Command**: leave as default (Vercel will run the `build`
        script from `apps/kameravue-fe/package.json`, i.e. `next build`)
  - [ ] **Install Command**: leave as default (now safely resolves against
        the repo-root `package-lock.json` only, since Phase 1b deleted the
        nested one)
  - [ ] **Output Directory**: leave as default (Next.js auto-detected)
- [ ] In the "Environment Variables" section of the same screen, add:
  - [ ] **Key**: `NEXT_PUBLIC_API_URL`
  - [ ] **Value**: `http://<DROPLET_IP_FROM_USER>:8081` — confirm the real
        Droplet IP with the user before entering it; do not guess a value
  - [ ] **Environment**: Production, Preview, and Development (all three,
        unless the user wants environment-specific backend targets)
- [ ] Click "Deploy" and confirm the build log shows a successful
      `next build` completion (not a build failure)
- [ ] Confirm the deploy finishes and Vercel shows a live
      **`https://<project-name>.vercel.app`** URL
- [ ] Open that URL in a browser and confirm the KameraVue login page
      renders (confirms the static/SSR build itself works, independent of
      backend connectivity — the CORS/API connection is validated later in
      Phase 3b)
- [ ] **Record the exact confirmed `*.vercel.app` URL** — it is needed
      verbatim for Phase 3a's `<VERCEL_URL_FROM_PHASE_2>` placeholder

## Phase 3a — Add the Vercel Origin to CORS `[PR]`

Blocked on Phase 2's confirmed URL being recorded above.

- [ ] Create branch `feat/cors-add-vercel-origin` from `main`
- [ ] Edit `apps/kameravue-be/ikp-labs-api/src/main/java/com/ikplabs/api/config/CorsConfig.java`
      lines 60-71: add the confirmed Vercel URL (replacing
      `<VERCEL_URL_FROM_PHASE_2>`) as a new entry in `setAllowedOrigins(...)`,
      after the existing `"https://www.kameravue.com"` line, with an
      inline comment identifying it (e.g. `// Vercel-hosted frontend`)
- [ ] Run the backend's existing unit tests (`./mvnw test` from
      `apps/kameravue-be/ikp-labs-api`) — confirm no test asserts an
      exact/exhaustive allowed-origins list that would need updating
- [ ] Commit with message `feat(cors): add vercel-hosted frontend origin`
- [ ] Push branch, open PR 3a, verify `kameravue-ci.yml` passes
- [ ] Merge PR 3a to `main`

## Phase 3b — Manual Backend Redeploy `[MANUAL]` — interactive, not a PR

**Pause point.** Blocked on PR 3a being merged. Requires SSH access to the
DigitalOcean Droplet — confirm these details with the user before running
anything (none of them are discoverable from the repo):

- [ ] Confirm `<DROPLET_SSH_HOST>` (hostname or IP + SSH user) with the user
- [ ] Confirm `<PATH_TO_REPO_ON_DROPLET>` (working directory of the cloned
      repo on the Droplet) with the user
- [ ] Confirm `<PM2_PROCESS_NAME>` (the name PM2 lists for the backend
      process — run `pm2 list` on the Droplet to see it) with the user
- [ ] SSH to the Droplet: `ssh <DROPLET_SSH_HOST>`
- [ ] `cd <PATH_TO_REPO_ON_DROPLET>`
- [ ] `git pull origin main` — confirm it pulls in the PR 3a commit
- [ ] `cd apps/kameravue-be/ikp-labs-api && ./mvnw clean install` — confirm
      the build succeeds (`BUILD SUCCESS` in Maven output)
- [ ] `pm2 restart <PM2_PROCESS_NAME>`
- [ ] `pm2 logs <PM2_PROCESS_NAME> --lines 50` — confirm a clean startup
      with no exceptions
- [ ] From the Vercel-hosted frontend (the URL confirmed in Phase 2), attempt
      a real authenticated action (e.g. log in) and confirm in the browser's
      DevTools Network tab that the request to the backend succeeds with no
      CORS error in the console

## Archival `[PR]` (not counted in the 3-PR total)

- [ ] Confirm every checklist item above is checked and every `[MANUAL]`
      item is confirmed complete by the user
- [ ] `git mv plans/in-progress/2026-11-21__vercel-frontend-deploy/ plans/done/`
- [ ] Update the moved plan's `README.md` status line to
      `✅ COMPLETED — Created 2026-11-21, Completed <actual completion date>`
- [ ] Update `plans/README.md`: move this plan's entry from "In Progress"
      to "Done (Archived)" tree listing, update Quick Stats counts
- [ ] Commit with message `docs(plan): archive vercel-frontend-deploy plan`
- [ ] Push branch, open the archival PR, merge to `main`

## Testing Requirements

- [ ] `nx lint kameravue-fe` passes after Phase 1a's version bump
- [ ] `nx test kameravue-fe` passes after Phase 1a's version bump
- [ ] `nx build kameravue-fe` succeeds locally after Phase 1a's version bump
      (confirms the patched Next.js version builds before ever reaching Vercel)
- [ ] `./mvnw test` passes in `apps/kameravue-be/ikp-labs-api` after Phase 3a's CORS edit
- [ ] Manual cross-origin smoke test from the live Vercel URL against the
      live Droplet backend, after Phase 3b (see last item above)

## Documentation Tasks

- [ ] No `docs/` changes are required by this plan — the production URLs
      documented in root `README.md` (`kameravue.com`, `api.kameravue.com`)
      describe the pre-existing Hostinger-hosted setup and are intentionally
      left as-is; updating them to reflect the new Vercel URL is explicitly out
      of scope for this plan (see `requirements.md` Non-Scope) since
      `kameravue.com`'s DNS status may change independently of this plan's
      timeline

## Validation Steps

- [ ] Verify only one `package-lock.json` exists in the repo after Phase 1b
- [ ] Verify `next`/`eslint-config-next` resolve to `15.5.29` (or later) in
      both `apps/kameravue-fe/package.json` and the root `package-lock.json`
- [ ] Verify the Vercel project's Root Directory is `apps/kameravue-fe`
      (visible in Vercel dashboard → Project Settings → General)
- [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel dashboard →
      Project Settings → Environment Variables
- [ ] Verify `CorsConfig.java`'s `setAllowedOrigins(...)` contains the real
      Vercel URL with no `<VERCEL_URL_FROM_PHASE_2>` placeholder left in
      committed code
- [ ] Verify the Droplet's running backend process reflects the merged PR
      3a commit (e.g. `git log -1` on the Droplet matches `main`'s latest CORS
      commit)

## Quality Gates

- [ ] All 3 counted PRs (1a, 1b, 3a) pass `kameravue-ci.yml` before merge
- [ ] No `--no-verify` or skipped hooks used in any commit
- [ ] No direct pushes to `main` — every PR phase goes through a branch + PR
- [ ] Both `[MANUAL]` phases (2, 3b) are explicitly confirmed by the user in
      conversation before the Archival PR is opened — neither is marked done
      based on assumption
