# Requirements: Deploy Frontend to Vercel

## Problem Statement

`kameravue.com` is inaccessible — Hostinger flagged it as phishing and has
ignored 3 appeals. Confirmed live on 2026-11-21: `nslookup kameravue.com`
returns `NXDOMAIN`; `curl https://api.kameravue.com` fails to resolve the
host. The production frontend and backend are both unreachable by their
domain names today, even though the backend process itself is presumably
still running on the DigitalOcean Droplet behind that dead DNS.

The user wants the frontend back online on infrastructure that has zero
dependency on the stuck Hostinger account, while leaving the backend and its
database exactly where they are (DigitalOcean Droplet, PostgreSQL 16, PM2).

## Scope

**In scope:**

- Patch the confirmed-unpatched Next.js CVE in `apps/kameravue-fe`:
  bump `next` and `eslint-config-next` from `15.5.0` to `15.5.29` in
  `apps/kameravue-fe/package.json`, and regenerate the root
  `package-lock.json` to match (Phase 1a).
- Delete the stale, duplicate `apps/kameravue-fe/package-lock.json` so
  Vercel's root-directory-aware install cannot silently prefer a stale
  lockfile over the root one (Phase 1b).
- Walk through, in live conversation, the interactive Vercel project setup:
  account creation/login, GitHub repo import, Root Directory configuration
  (`apps/kameravue-fe`), environment variable configuration
  (`NEXT_PUBLIC_API_URL`), and triggering the first deploy (Phase 2).
- Confirm the Vercel deploy produces a live, reachable `*.vercel.app` URL
  serving the KameraVue frontend.
- Add the confirmed Vercel-assigned origin to
  `apps/kameravue-be/ikp-labs-api/src/main/java/com/ikplabs/api/config/CorsConfig.java`'s
  `setAllowedOrigins(...)` list (Phase 3a).
- Walk through, in live conversation, the manual backend redeploy needed
  for the CORS change to take effect on the Droplet: SSH, `git pull`,
  Maven rebuild, PM2 restart (Phase 3b).
- Archive this plan to `plans/done/` once all phases are confirmed
  complete, per `plans/README.md`'s lifecycle.

**Out of scope:**

- The Hostinger phishing-flag dispute itself, any further appeal, or any
  communication with Hostinger support.
- Purchasing a new domain, transferring `kameravue.com` to a different
  registrar, or any DNS re-pointing of `kameravue.com`/`api.kameravue.com`.
- Any change to the DigitalOcean Droplet's infrastructure, OS, Nginx
  config, SSL certificates, or PostgreSQL setup.
- Building a new automated CD pipeline (e.g., a GitHub Actions workflow
  that SSHes into the Droplet on merge to `main`) for the backend. **The
  user explicitly considered this (grill-me Question 5, Option C) and
  deliberately deferred it as a separate future idea on 2026-11-21** — it
  is a meaningfully larger scope than "add one CORS origin" and is not part
  of this plan. A future plan may pick this up.
- Any change to `apps/kameravue-be` beyond the single CORS origin addition
  in `CorsConfig.java` — no other CORS config field, no other backend
  feature or bugfix.
- A major-version Next.js upgrade (e.g., to the 16.x line). The CVE fix
  stays on the 15.x line (`15.5.0` → `15.5.29`) specifically to avoid
  bundling a breaking major upgrade into a security patch.
- A committed `vercel.json` (resolved via grill-me Question 3 — the
  dashboard's Root Directory setting is sufficient on its own).
- Any custom domain configuration on the Vercel project (e.g., eventually
  pointing a purchased domain at the `*.vercel.app` deployment) — this plan
  stops at the default `*.vercel.app` subdomain.
- Monitoring, analytics, or Vercel-specific features (Edge Config, Vercel
  Analytics, Preview Deployments review workflow) beyond what Vercel
  enables by default on import.

## Resolved Grill-Me Decisions (2026-11-21)

All 5 open decisions below were resolved via the mandatory pre-write
grill-me interview (markdown fallback — `AskUserQuestion` was not available
in this environment), then re-validated post-write per the same process.

1. **Stale nested lockfile** (`apps/kameravue-fe/package-lock.json`):
   **delete it outright** in Phase 1b. Confirmed safe — CI's `npm ci`
   always runs at repo root; no script, Nx target, or tracked file
   references the nested path. Rejected: regenerating it to stay in sync
   (leaves the duplicate-lockfile anti-pattern for someone to let drift
   again); forcing Vercel to ignore it via an install-command override
   (more moving parts, doesn't fix the underlying anti-pattern).

2. **Unpatched Next.js CVE**: **split into two PRs within Phase 1** — PR 1a
   bumps `next`/`eslint-config-next` to `15.5.29` (isolated, independently
   revertable security fix); PR 1b deletes the stale nested lockfile.
   Rejected: bundling both into one PR (couples an independently-revertable
   security fix to an unrelated cleanup); deferring the CVE fix to a future
   plan (would ship a known CVSS-9.5 RCE to a brand-new public URL).

3. **Committing a `vercel.json`**: **no committed config file** — Vercel's
   dashboard Root Directory setting alone is sufficient and is the
   standard, simplest path for a single-app-in-monorepo deploy. Rejected:
   committing a minimal `vercel.json` for documentation/reproducibility
   (one more file that must stay in sync with the dashboard, for a setting
   the dashboard already handles); committing one for defense-in-depth
   alongside the dashboard setting (redundant).

4. **`NEXT_PUBLIC_API_URL` value**: **the DigitalOcean Droplet's bare IP**,
   `http://<DROPLET_IP_FROM_USER>:8081` — confirmed `https://api.kameravue.com`
   currently returns NXDOMAIN (live `nslookup`/`curl` check from this
   environment, which has working general internet access, confirmed by
   `vercel.com` and `1.1.1.1` resolving fine), so the documented production
   backend URL will not work today. The actual numeric IP is not
   discoverable from the repo — `.env.local` exists
   (`apps/kameravue-fe/.env.local`, confirmed only via `ls`, never read —
   this repo's own `block-env-file-access.sh` hook blocks `Read`/`Edit` on
   it) and the user will supply the real IP at Phase 2 execution time.
   Rejected: a `sslip.io`-style hostname derived from the same IP
   (equivalent reachability, no concrete benefit over the bare IP for this
   case); keeping `https://api.kameravue.com` as a forward-looking
   placeholder (guarantees the first post-deploy smoke test fails today).

5. **Backend redeploy mechanism for the Phase 3 CORS change**: **split
   Phase 3 into Phase 3a (PR: add the origin to `CorsConfig.java`, merge to
   `main`) and Phase 3b (manual, interactive: SSH to the Droplet,
   `git pull`, Maven rebuild, PM2 restart)** — confirmed no CD pipeline
   exists (zero `ssh`/`droplet`/`pm2`/`deploy` hits across
   `.github/workflows/*.yml`, no deploy script or runbook in the repo), so
   this step genuinely cannot be automated via any tool available here.
   **The user explicitly deferred Option C (building a new automated SSH-based
   CD workflow for the backend) as a separate future idea, not part of this
   plan** — recorded in this document's Non-Scope section above. Rejected
   outright for this plan: treating the redeploy as out of scope entirely
   (would leave the CORS fix merged but never live in production, defeating
   the purpose of Phase 3).

## User Stories

### User Story 1: Patch the unpatched Next.js CVE before new public exposure

As the project maintainer
I want the Next.js critical-RCE CVE patched before the frontend gets a new public URL
So that the Vercel deploy does not expose a known CVSS-9.5 vulnerability to the internet

**Acceptance Criteria:**

```gherkin
Scenario: Next.js and eslint-config-next are bumped to the patched version
  Given apps/kameravue-fe/package.json currently pins "next": "15.5.0" exactly
  When PR 1a bumps "next" and "eslint-config-next" to "15.5.29" and regenerates package-lock.json
  Then npm ls next in apps/kameravue-fe resolves to 15.5.29 with no unresolved peer conflicts
```

### User Story 2: Remove the stale duplicate lockfile before Vercel import

As the project maintainer
I want the stale apps/kameravue-fe/package-lock.json deleted
So that Vercel's root-directory-aware install cannot silently use a stale, vulnerable dependency tree

**Acceptance Criteria:**

```gherkin
Scenario: The nested lockfile no longer exists after PR 1b
  Given apps/kameravue-fe/package-lock.json exists and duplicates the root lockfile
  When PR 1b deletes apps/kameravue-fe/package-lock.json and merges to main
  Then only one package-lock.json exists in the repository, at the repo root
```

### User Story 3: Deploy the frontend to Vercel, decoupled from Hostinger

As the project maintainer
I want the frontend live on a Vercel-assigned \*.vercel.app URL
So that the app is reachable again without depending on the stuck Hostinger domain

**Acceptance Criteria:**

```gherkin
Scenario: The Vercel project builds and serves the frontend successfully
  Given the Vercel project's Root Directory is set to apps/kameravue-fe and NEXT_PUBLIC_API_URL is set to the Droplet's reachable address
  When the user triggers the first deploy from the Vercel dashboard
  Then the deployment succeeds and the assigned *.vercel.app URL serves the KameraVue login page
```

### User Story 4: Backend accepts requests from the new Vercel origin

As a user of the deployed frontend
I want the backend to accept cross-origin requests from the Vercel URL
So that login, gallery, and upload features work end-to-end on the new deployment

**Acceptance Criteria:**

```gherkin
Scenario: The backend's CORS policy allows the Vercel origin after redeploy
  Given CorsConfig.java's setAllowedOrigins(...) now includes the confirmed *.vercel.app origin and the backend has been rebuilt and restarted on the Droplet
  When the Vercel-hosted frontend makes an authenticated API request to the backend
  Then the browser does not block the request with a CORS error
```

## Success Criteria

- `apps/kameravue-fe/package.json` and the root `package-lock.json` resolve
  `next` to `15.5.29` (or a later patched 15.x release available at
  execution time), with no stale nested lockfile remaining anywhere in the
  repo.
- A live, user-confirmed `*.vercel.app` URL serves the KameraVue frontend,
  built from `apps/kameravue-fe` with `NEXT_PUBLIC_API_URL` pointing at a
  reachable backend address.
- `CorsConfig.java`'s `setAllowedOrigins(...)` list includes the real,
  confirmed Vercel origin (no placeholder left in committed code), and the
  Droplet-hosted backend has been rebuilt and restarted so the change is
  live in production.
- A manual end-to-end check (login or any authenticated action) from the
  Vercel URL against the Droplet backend succeeds with no CORS error in the
  browser console.
- This plan's 3 counted PRs (1a, 1b, 3a) are merged to `main`; the plan
  folder is archived to `plans/done/2026-11-21__vercel-frontend-deploy/`
  with `plans/README.md` updated.
