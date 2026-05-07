# Vision

---

## Project Purpose

IKP-Labs exists as a **full-stack learning platform** built around a real photo gallery application. It demonstrates how modern web development practices — NX monorepo management, Spring Boot + Next.js integration, end-to-end testing, and CI/CD — work together in a production-grade project.

The project serves two goals simultaneously:

1. A **working application** — users can register, upload photos, manage a gallery, and interact with public content
2. A **reference codebase** — every architectural decision, testing strategy, and workflow convention is documented and reproducible

---

## Target Users

### Primary: The project owner (developer)

- Learning and demonstrating full-stack skills
- Building a portfolio reference for NX monorepo patterns
- Practicing real-world development workflows (PR reviews, CI/CD, governance)

### Secondary: Developers who read the codebase

- Engineers evaluating Spring Boot + Next.js integration patterns
- Developers learning Playwright E2E testing strategies
- Anyone studying NX monorepo conventions for multi-app projects

---

## What Success Looks Like

The project is working well when:

- All apps build cleanly in CI with zero warnings treated as errors
- E2E tests pass on every scheduled run (twice daily)
- A new developer can clone the repo and understand the structure within 30 minutes using the documentation
- Every PR follows the same workflow, commit format, and naming conventions — regardless of who writes it
- Governance documents are consulted before making architectural decisions, not after

---

## Long-Term Goals

A mature IKP-Labs will:

- Serve as a complete reference implementation for NX monorepo with Java backend and Next.js frontend
- Have full test coverage across unit (frontend + backend), integration (API), and E2E (browser) layers
- Be deployable to a VPS with a single command, with rollback capability
- Have governance documentation comprehensive enough for an AI agent to make correct architectural decisions without human guidance on conventions
- Demonstrate that a solo developer can maintain production-quality standards with the right tooling and governance
