# Skill: Creating Accessible Diagrams

**Category**: Documentation
**Purpose**: Standards for creating diagrams that are accessible to all users, including those using screen readers or with visual impairments
**Used By**: documentation-writer, docs-validator

---

## Overview

Diagrams communicate system structure, data flow, and relationships visually. Without accessibility standards, users relying on screen readers or those with color vision deficiencies cannot access this information.

Every diagram in `docs/` must be **understandable without seeing the image**.

---

## Core Rules

### 1. Always Provide Alt Text

Every image must have a descriptive alt text that conveys the same information as the diagram.

**Format**: `![Brief description: key relationships conveyed](path/to/diagram.png)`

**Bad:**

```markdown
![diagram](architecture.png)
![Architecture diagram](architecture.png)
```

**Good:**

```markdown
![Architecture: Next.js FE on port 3002 connects to Spring Boot BE on port 8081 via REST API; BE connects to PostgreSQL on port 5432 via JDBC](architecture.png)
```

Alt text rule: if you removed the image, would a reader still understand the key point? If yes, alt text is sufficient.

---

### 2. Never Rely on Color Alone

Color must not be the only way to convey information. Always pair color with a label, pattern, or symbol.

**Bad** — color only:

```text
Green nodes = healthy services
Red nodes    = failed services
```

**Good** — color + label:

```text
● [OK] Next.js FE    (green)
● [FAIL] Spring Boot (red)
```

**IKP-Labs context**: CI pipeline diagrams, status dashboards, and flow diagrams must label states explicitly — not just use color.

---

### 3. Provide a Text Equivalent for Complex Diagrams

For diagrams with more than 3 components or non-trivial relationships, add a text equivalent below the image. Use a table or bullet list.

**Example — KameraVue architecture:**

```markdown
![Architecture: Browser → Next.js FE → Spring Boot BE → PostgreSQL](architecture.png)

**Components:**

| Component | Port | Connects To |
|-----------|------|-------------|
| Browser | — | Next.js FE (HTTP) |
| Next.js FE | 3002 | Spring Boot BE (REST) |
| Spring Boot BE | 8081 | PostgreSQL (JDBC) |
| PostgreSQL | 5432 | — |
```

---

### 4. Use Mermaid for Text-Based Diagrams

Prefer Mermaid diagrams over image files where possible. Mermaid source is readable as plain text and version-controlled.

````markdown
```mermaid
graph TD
    Browser -->|HTTP| FE[Next.js FE :3002]
    FE -->|REST API| BE[Spring Boot BE :8081]
    BE -->|JDBC| DB[(PostgreSQL :5432)]
```
````

Mermaid diagrams **still require** a text equivalent when relationships are complex (more than 4 nodes or conditional flows).

---

### 5. Accessible Caption Format

Add a caption below every diagram that summarizes the key insight — not just a title.

**Bad**: `*Figure 1: Architecture*`

**Good**: `*Figure 1: KameraVue uses a three-tier architecture — FE, BE, and database — each running as a separate process.*`

---

## Diagram Types in IKP-Labs

| Diagram type | Where used | Key accessibility requirement |
|---|---|---|
| Architecture overview | `docs/explanation/` | Text equivalent table required |
| CI/CD pipeline | `docs/how-to/` | Label each stage, not just color |
| Auth flow | `docs/explanation/` | Step numbers + alt text |
| Data flow | `docs/reference/` | Table equivalent required |
| E2E test flow | `docs/how-to/` | Mermaid preferred |

---

## Validation Checklist

Before publishing any diagram:

- [ ] Alt text present and descriptive (not "diagram" or filename)
- [ ] No information conveyed by color alone
- [ ] Text equivalent provided for diagrams with more than 3 components
- [ ] Mermaid used instead of image where feasible
- [ ] Caption summarizes key insight, not just title

---

## Related Skills

- **docs-applying-content-quality** — Overall documentation quality standards
- **docs-applying-diataxis-framework** — Where diagrams belong in the four categories

---

**Last Updated**: 2026-06-12
