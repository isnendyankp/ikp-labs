# Deploy Frontend to Vercel (Decouple from Stuck Hostinger Domain)

## Status

🚧 **IN PROGRESS** — Created 2026-11-21

**Progress**: Phase 0 (plan setup, PR #353), Phase 1a (Next.js CVE patch,
PR #354), and Phase 1b (stale lockfile removal, PR #355) are merged to
`main`. Execution is **paused at Phase 2**, pending the user's own
interactive Vercel dashboard setup — see `checklist.md` for the exact
walkthrough.

## Overview

`kameravue.com`'s registrar/hosting account (Hostinger) flagged the site as
phishing and has not responded to 3 appeals. Confirmed live from this
environment on 2026-11-21: `nslookup kameravue.com` and `curl
https://api.kameravue.com` both return **NXDOMAIN** — the domain currently
has no DNS records at all, not merely a warning interstitial. (Sanity-checked
against `vercel.com` and `1.1.1.1`, which resolved fine, so this is specific
to `kameravue.com`, not a sandbox network restriction.)

This plan deploys **only the frontend** (`apps/kameravue-fe`, Next.js 15) to
Vercel, which gives it a free, instant `*.vercel.app` subdomain with zero
dependency on the stuck Hostinger account. The **backend**
(`apps/kameravue-be`, Spring Boot + PostgreSQL) keeps running exactly where
it already does today — the DigitalOcean Droplet (confirmed in `README.md`
lines 120-126, 184-191: Ubuntu 24.04, Nginx + Let's Encrypt, PM2, PostgreSQL
16). This plan does **not** touch the Hostinger dispute, domain purchase, or
any DigitalOcean infrastructure change.

### Confirmed facts that reshape this plan versus how it was first framed

- **The nested lockfile is dead weight.** `apps/kameravue-fe/package-lock.json`
  duplicates the root `package-lock.json` that the repo's npm workspaces
  (`package.json`'s `"workspaces": ["apps/kameravue-fe", "apps/kameravue-be"]`)
  rely on. Confirmed via `grep`: `.github/workflows/kameravue-ci.yml` runs
  `npm ci` at the repo root in every job (never inside
  `apps/kameravue-fe`); the only other hit for this path anywhere in the
  repo is `.nx/workspace-data/file-map.json`, which `.gitignore` lines 14-15
  explicitly exclude — local Nx cache, not a real reference. Deleting it is
  safe.
- **The Next.js CVE is NOT fixed anywhere — root or nested — contrary to
  what this plan might have assumed.** `apps/kameravue-fe/package.json`
  pins `"next": "15.5.0"` and `"eslint-config-next": "15.5.0"` exactly (no
  caret); the root `package-lock.json` also resolves `next` to `15.5.0`.
  Git history shows the one PR touching dependency versions recently
  (`e970971`, PR #349) only bumped Playwright to `1.65.1` for CI — it never
  touched Next.js. Current research (2026-11-21) confirms Next.js
  `10.0.0`–`15.5.27` carry CVE-2026-96889, two unauthenticated RCEs (CVSS
  9.5) in the caching layer and SVG image pipeline, fixed in `15.5.28`, with
  `15.5.29` as the latest safe patch on the 15.x line. `15.5.0` sits
  squarely in the affected range. Deploying this version to a brand-new
  public Vercel URL would be new public exposure of a known critical RCE.
- **Vercel's root-directory-aware install genuinely would have preferred
  the stale nested lockfile** had it been left in place — this is standard
  npm/Vercel behavior: when Root Directory is set to a subfolder, Vercel's
  installer looks for a lockfile inside that folder first.
- **No backend CD pipeline exists.** `grep`-ing every `.github/workflows/*.yml`
  for `ssh`/`droplet`/`pm2`/`deploy` returns zero matches, and no
  `deploy.sh` or deployment runbook exists in the repo. A backend code
  change (the Phase 3 CORS addition) only reaches the Droplet via a manual
  SSH + Maven rebuild + PM2 restart.

## Scope at a Glance

**In scope**: patch the unpatched Next.js CVE in `apps/kameravue-fe`; delete
the stale duplicate `apps/kameravue-fe/package-lock.json`; the live,
interactive Vercel project setup and first deploy (walked through in
`checklist.md`, executed in conversation, not via git); add the new Vercel
origin to `CorsConfig.java`; the manual backend redeploy needed for that
CORS change to take effect.

**Out of scope**: the Hostinger phishing-flag dispute and its appeals; any
domain purchase or DNS re-pointing; any DigitalOcean Droplet infrastructure
change; building a new automated CD pipeline for the backend (the user
explicitly deferred this as a separate future idea on 2026-11-21 — see
`requirements.md`'s Non-Scope section); any change to `apps/kameravue-be`
beyond the one CORS origin addition.

Full detail in [`requirements.md`](./requirements.md).

## Documents

- [`requirements.md`](./requirements.md) — Scope, non-scope, resolved
  grill-me decisions, user stories, success criteria
- [`technical-design.md`](./technical-design.md) — Architecture, confirmed
  current state, exact files/versions touched, verification method
- [`checklist.md`](./checklist.md) — Atomic tasks per phase, including the
  non-git interactive phases

## Phase Plan (this plan has an unusual shape — not every phase is a PR)

| Phase    | Type                                         | Content                                                                                                                                                             |
| -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0        | PR (setup, **not counted**)                  | Create this plan's 4 documents                                                                                                                                      |
| 1a       | **PR**                                       | Bump `next` and `eslint-config-next` `15.5.0` → `15.5.29` (CVE-2026-96889 fix) in `apps/kameravue-fe/package.json`; regenerate root `package-lock.json`             |
| 1b       | **PR**                                       | Delete the stale duplicate `apps/kameravue-fe/package-lock.json`                                                                                                    |
| 2        | **NOT a PR** — external, interactive, manual | User creates/logs into a Vercel account, imports the GitHub repo, sets Root Directory to `apps/kameravue-fe`, sets `NEXT_PUBLIC_API_URL`, triggers the first deploy |
| 3a       | **PR**                                       | Add the Vercel-assigned origin to `CorsConfig.java`'s `setAllowedOrigins(...)`                                                                                      |
| 3b       | **NOT a PR** — manual, interactive           | SSH to the Droplet, `git pull`, rebuild the backend JAR, `pm2 restart` so the CORS change takes effect in production                                                |
| Archival | PR (**not counted**)                         | Move this plan folder to `plans/done/`, update `plans/README.md`                                                                                                    |

**Counted PRs: 3** (1a, 1b, 3a). Phases 2 and 3b cannot be executed via `git`/`gh`
by anyone — they require the user's own interactive action (an account
login, a dashboard click-through, an SSH session) and are written in
`checklist.md` as confirmation steps, not git diffs.

**Execution note**: Phase 0 and Phase 1 (1a, 1b) are executed straight
through to merge. Execution **pauses at Phase 2** and hands control back to
the live conversation — this is the one phase requiring the user's own
interactive action that cannot be performed via any available tool. Once
Phase 2 is confirmed complete (live `*.vercel.app` URL exists), Phase 3a
resumes as a normal PR, and Phase 3b pauses again for the same reason as
Phase 2.

## Knowledge Capture

This plan's novelty versus prior IKP-Labs plans is structural: it is the
first plan where two of its phases are deliberately **not** git/PR work.
Rather than forcing an external, credential-gated, click-through action
(Vercel dashboard login, Droplet SSH) into a fictional PR shape, the phase
table marks them explicitly as non-PR and the checklist phrases their tasks
as things to _confirm happened_ (e.g., "the project now shows a live
`*.vercel.app` URL") rather than things resolvable by `git diff`. Future
plans involving a third-party SaaS dashboard or infra SSH step should use
this same non-PR phase marking instead of pretending the step is scriptable.
