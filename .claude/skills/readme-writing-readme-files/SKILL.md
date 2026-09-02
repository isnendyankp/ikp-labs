# Skill: README Writing Standards

**Category**: Documentation
**Purpose**: Define standards for writing and maintaining README files across the IKP-Labs project
**Used By**: readme-maker, readme-checker, readme-fixer

---

## Overview

A README is the front door of a project, app, or directory. It must be accurate, scannable, and immediately useful. This skill defines what belongs in each type of README and how to write it.

**Core Principles:**

1. **Accuracy** — Every version number, command, and path must be verified from the actual source files
2. **No placeholders** — Never write TODO, TBD, Coming Soon, or fictional examples
3. **Scannability** — Readers skim; use headings, tables, and code blocks
4. **Minimal** — Include what a reader needs on their first day; link out for detail

---

## README Types and Required Sections

### 1. Root README (`README.md`)

The entry point for the entire project.

**Required sections:**

| Section | Purpose |
|---------|---------|
| Project name + one-line description | What this is |
| Tech stack table | Frontend, backend, testing at a glance |
| Prerequisites | Node version, Java version, tools |
| Quickstart | Clone → install → run FE + BE in < 5 commands |
| Project structure | Top-level directory tree (3 levels max) |
| Running tests | How to run unit + E2E tests |
| Contributing | Link to `CONTRIBUTING.md` |
| License | License name + link |

**Optional sections (include if relevant):**

- Badges (CI status, coverage, license)
- Screenshots / demo link
- Roadmap link

**Template:**

````markdown
# IKP-Labs

One-sentence description of the project.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js + React | 15.5.0 + 19.1.0 |
| Backend | Spring Boot + Java | 3.2+ + 17+ |
| E2E Tests | Playwright | [from package.json] |
| Monorepo | Nx | [from package.json] |

## Prerequisites

- Node.js 20+
- Java 17+
- PostgreSQL 15+

## Quickstart

```bash
git clone <repo>
npm install
# Start backend
cd apps/kameravue-be && ./mvnw spring-boot:run
# Start frontend (new terminal)
npx nx serve kameravue-fe
```

## Project Structure

```text
IKP-Labs/
├── apps/
│   ├── kameravue-fe/        # Next.js frontend
│   ├── kameravue-be/        # Spring Boot backend
│   ├── kameravue-fe-e2e/    # Playwright FE tests
│   └── kameravue-be-e2e/    # Playwright API tests
├── docs/                    # Project documentation
└── plans/                   # Implementation plans
```

## Running Tests

```bash
npx nx test kameravue-fe       # Unit tests
npx nx e2e kameravue-fe-e2e    # E2E tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

````

---

### 2. App README (`apps/<app>/README.md`)

Covers a single Nx application.

**Required sections:**

| Section | Purpose |
|---------|---------|
| App name + purpose | One-sentence role of this app |
| Tech stack | Framework, key libs, version |
| Prerequisites | What must be running before this app starts |
| Run instructions | `npx nx serve <app>` or `./mvnw spring-boot:run` |
| Environment variables | Table of env vars with description and example values |
| Test instructions | How to run unit tests and E2E tests for this app |
| Key directories | 2-level tree of `src/` with brief descriptions |

**Frontend app template (kameravue-fe):**

````markdown
# kameravue-fe

Next.js 15 frontend for the KameraVue photo gallery.

## Tech Stack

- Next.js 15.5.0 (App Router)
- React 19.1.0
- TypeScript (strict)
- Tailwind CSS 4

## Prerequisites

- Backend running on `http://localhost:8080`

## Run

```bash
npx nx serve kameravue-fe
# Available at http://localhost:3000
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:8080` |

## Tests

```bash
npx nx test kameravue-fe        # Jest unit tests
npx nx e2e kameravue-fe-e2e     # Playwright E2E
```

````

**Backend app template (kameravue-be):**

````markdown
# kameravue-be

Spring Boot 3.2 REST API for the KameraVue photo gallery.

## Tech Stack

- Spring Boot 3.2+
- Java 17+
- PostgreSQL 15+
- JPA / Hibernate

## Prerequisites

- PostgreSQL running on `localhost:5432`
- Database `kameravue` created

## Run

```bash
cd apps/kameravue-be
./mvnw spring-boot:run
# API available at http://localhost:8080
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database URL | `jdbc:postgresql://localhost:5432/kameravue` |
| `SPRING_DATASOURCE_USERNAME` | DB user | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `secret` |

## Tests

```bash
./mvnw test                     # JUnit unit + integration tests
npx nx e2e kameravue-be-e2e     # Playwright API tests
```

````

---

### 3. Directory README (`<dir>/README.md`)

Covers a non-app directory (`.claude/agents/`, `docs/`, `plans/`, etc.).

**Required sections:**

| Section | Purpose |
|---------|---------|
| Directory name + one-line purpose | What lives here |
| Inventory table | List of files/subdirs with descriptions |
| Maintenance notes | How to add/rename/remove items |

**Template:**

```markdown
# <directory>/

One-line purpose.

---

## Inventory

| File / Directory | Description |
|-----------------|-------------|
| `item-a.md` | What it does |
| `item-b/` | What it contains |

---

## Maintenance

- Rule for adding new items
- Rule for naming conventions
- Rule for removal
```

---

## Core Writing Principles

### Problem-Solution Hook

Start with WHY, not WHAT. The opening lines should show the problem the project solves
and how, before anything about tech stack or setup.

✅ **Good opening**:

```markdown
# KameraVue

**Problem**: Sharing event photos across a team means email attachments or shared
drives nobody keeps organized.
**Solution**: KameraVue gives every event a shared gallery anyone can upload to and
browse, no attachments required.
```

❌ **Weak opening**:

```markdown
# KameraVue

This is a photo gallery application built with Next.js and Spring Boot.
```

Applies to **Root and App READMEs only** — Directory READMEs (`.claude/agents/README.md`,
`docs/README.md`, etc.) are structural indexes, not product pitches; skip the hook there.

### Plain Language

Avoid unexplained jargon and buzzwords ("leverage", "synergy", "best-in-class"). Explain
technical terms on first use.

✅ **Good**: "Uses **Nx** (a monorepo build system) to manage multiple apps."
❌ **Bad**: "Uses Nx for the monorepo." — what's Nx? What's a monorepo?

**Acronym context** — define acronyms on first use: `WCAG (Web Content Accessibility
Guidelines)`, not a bare `WCAG compliance required`.

### Benefits-Focused Language

Emphasize outcomes over features — show what a reader gains, not just what the system
does.

✅ **Benefits-focused**:

```markdown
## Key Benefits

- **Faster reviews**: Shared galleries mean no more hunting through email threads for photos
- **No lost photos**: Every upload is backed up automatically
```

❌ **Feature-focused**:

```markdown
## Features

- Has photo upload
- Uses cloud storage
```

---

## Writing Standards

### Paragraph Length

Maximum 5 lines per paragraph — split longer explanations into multiple short
paragraphs, or convert to a list.

### Version Numbers

Always read from source files — never write from memory:

| What to document | Source file |
|-----------------|-------------|
| Next.js version | `apps/kameravue-fe/package.json` → `dependencies.next` |
| React version | `apps/kameravue-fe/package.json` → `dependencies.react` |
| Spring Boot version | `apps/kameravue-be/pom.xml` → `<parent><version>` |
| Java version | `apps/kameravue-be/pom.xml` → `<java.version>` |
| Playwright version | `apps/kameravue-fe-e2e/package.json` → `dependencies.@playwright/test` |
| Nx version | root `package.json` → `devDependencies.nx` |

### Commands

Always verify commands work before writing them. Use `npx nx` prefix for Nx targets. Never invent command flags.

### Code Blocks

- Always include the language tag: ` ```bash `, ` ```text `, ` ```json `
- Use `text` for directory trees, not `bash`
- Use `bash` for commands

### Style

- Active voice: "Run the backend" not "The backend should be run"
- Present tense: "The API returns" not "The API will return"
- Second person: "You need Node 20" not "We need Node 20"
- Short sentences: one idea per sentence

---

## Quality Checklist

Before completing README work, verify:

- ✅ All version numbers match source files (package.json / pom.xml)
- ✅ All commands tested and working
- ✅ No placeholder text (TODO, TBD, Coming Soon, FIXME)
- ✅ No fictional code or invented paths
- ✅ All internal links resolve to real files
- ✅ Required sections present for this README type
- ✅ File named `README.md` (uppercase, `.md` extension)
- ✅ **Root/App only**: Problem-Solution Hook present in the opening
- ✅ **Root/App only**: no unexplained jargon; acronyms defined on first use
- ✅ **Root/App only**: benefits emphasized over bare feature lists
- ✅ No paragraph exceeds 5 lines

---

## Anti-Patterns to Avoid

| Anti-pattern | Why bad | Fix |
|-------------|---------|-----|
| `TODO: add description` | Placeholder left in production | Write the actual description |
| `npm start` without verifying | Command may not exist in Nx monorepo | Verify against `package.json` scripts |
| Version from memory (`Spring Boot 3.x`) | Stale within weeks | Read from `pom.xml` |
| Giant wall of text | Not scannable | Break into sections with headings + tables |
| Starting with tech stack, not the problem | Reader doesn't know why the project exists | Open with a Problem-Solution Hook (Root/App only) |
| Unexplained jargon (`Uses Nx monorepo with affected builds`) | Assumes reader already knows the term | Define on first use: `Nx (a monorepo build system)` |
| Feature list with no benefit stated | Reader can't tell what they gain | Rewrite as outcomes: "Faster reviews", not "Has upload" |
| Duplicate info from docs/ | Maintenance burden | Link to docs instead |

---

## Related Skills

- **docs-applying-content-quality** — General documentation writing standards
- **wow-criticality-assessment** — Issue severity classification
