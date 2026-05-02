# How to Set Up the Development Environment

Step-by-step guide to get IKP-Labs running locally from scratch.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Frontend + Nx |
| Java | 21 | Spring Boot backend |
| Maven | 3.9+ | Backend build tool |
| PostgreSQL | 16 | Database |
| Git | Any | Version control |

---

## 1. Clone the Repository

```bash
git clone https://github.com/isnendyankp/ikp-labs.git
cd ikp-labs
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all root-level tools including:
- **Nx** — monorepo task runner
- **Husky** — git hooks (commitlint + lint-staged)
- **commitlint** — commit message validation
- **Prettier** — code formatter

Husky hooks are set up automatically via the `prepare` script.

---

## 3. Set Up the Database

```bash
# Create PostgreSQL database
createdb registration_form_db
```

The database schema is created automatically by Spring Boot on first run.

---

## 4. Configure Environment Variables

```bash
# Backend
cp apps/kameravue-be/ikp-labs-api/src/main/resources/application.properties \
   apps/kameravue-be/ikp-labs-api/src/main/resources/application-local.properties
```

Update `application-local.properties` with your local database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/registration_form_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

```bash
# Frontend
cp apps/kameravue-fe/.env.example apps/kameravue-fe/.env.local
```

---

## 5. Start Services

```bash
# Start backend (terminal 1)
nx serve kameravue-be
# Backend runs on http://localhost:8081

# Start frontend (terminal 2)
nx serve kameravue-fe
# Frontend runs on http://localhost:3002
```

Or start both simultaneously:
```bash
nx run-many -t dev
```

---

## 6. Verify Setup

```bash
# Check all apps build
nx run-many -t build

# Run all tests
nx run-many -t test

# View dependency graph
nx graph
```

**Expected URLs:**
- Frontend: http://localhost:3002
- Backend API: http://localhost:8081
- API Docs: http://localhost:8081/swagger-ui.html

---

## Tooling Overview

### Commitlint (commit message validation)

Every commit is validated automatically by commitlint via Husky's `commit-msg` hook.

**Allowed types:** `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `config`

```bash
# ✅ Accepted
git commit -m "feat: add photo sorting"
git commit -m "fix: resolve login redirect"

# ❌ Rejected
git commit -m "update stuff"        # no type
git commit -m "Fix: broken button"  # uppercase type
```

See [`governance/conventions/development.md`](../../governance/conventions/development.md) for full commit rules.

### Prettier (code formatting)

Prettier runs automatically on staged files before every commit. Config is in `.prettierrc.json` at repo root:

| Rule | Value |
|------|-------|
| Quotes | Single (`'`) |
| Semicolons | Yes |
| Tab width | 2 spaces |
| Trailing commas | ES5 |
| Print width | 80 |
| Line endings | LF |

To format manually:
```bash
cd apps/kameravue-fe
npm run format        # format all files
npm run format:check  # check without writing
```

### Nx Commands Reference

```bash
nx serve kameravue-fe          # Start frontend dev server
nx serve kameravue-be          # Start backend
nx test kameravue-fe           # Frontend unit tests
nx test kameravue-be           # Backend tests
nx e2e kameravue-fe-e2e        # Frontend E2E tests
nx e2e kameravue-be-e2e        # Backend API tests
nx run-many -t test            # All tests
nx run-many -t build           # All builds
nx affected -t test            # Tests for changed projects only
nx graph                       # Dependency graph
```

---

## Governance

This project uses a 6-layer governance model. Before making significant decisions, consult:

1. [`governance/vision/ikp-labs.md`](../../governance/vision/ikp-labs.md) — project purpose
2. [`governance/principles/general.md`](../../governance/principles/general.md) — decision values
3. [`governance/conventions/development.md`](../../governance/conventions/development.md) — naming standards
4. [`governance/development/workflow/implementation.md`](../../governance/development/workflow/implementation.md) — workflow steps

---

## Troubleshooting

**Port already in use:**
```bash
lsof -ti :8081 | xargs kill -9   # Kill backend port
lsof -ti :3002 | xargs kill -9   # Kill frontend port
```

**Husky hooks not running:**
```bash
npm run prepare   # Re-install husky hooks
```

**commitlint not found:**
```bash
npm install       # Re-install dependencies
```

---

## Related

- [CONTRIBUTING.md](../../CONTRIBUTING.md) — contribution guidelines
- [docs/how-to/cicd-setup.md](cicd-setup.md) — CI/CD pipeline setup
- [docs/tutorials/getting-started.md](../tutorials/getting-started.md) — app usage guide
