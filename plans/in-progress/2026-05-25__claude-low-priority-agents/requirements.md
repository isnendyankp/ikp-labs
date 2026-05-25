# Requirements

## Functional Requirements

### FR-1: plan-execution-checker Agent

- Validates completed plan work meets all requirements and acceptance criteria
- Checks requirements coverage, technical alignment, delivery completion, code quality
- Produces a markdown validation report
- Acts as final gate before moving plan from `in-progress/` to `done/`

### FR-2: web-research-maker Agent

- Performs isolated web research without polluting main conversation context
- Read-only: no file writes, edits, or shell execution
- Returns structured findings with confidence tagging
- Checks existing repo docs before hitting the web

### FR-3: docs-file-manager Agent

- Manages files/directories inside `docs/` folder only
- Enforces kebab-case naming convention
- Uses `git mv` / `git rm` to preserve history
- Updates internal links and README indices after operations
- Verifies deletion safety before removing content

## Non-Functional Requirements

- NFR-1: Each agent must follow IKP-Labs agent frontmatter format
- NFR-2: Agents must reference IKP-Labs tech stack (Next.js 15.5, Spring Boot 3.2+, Java 17+)
- NFR-3: Model selection appropriate to task complexity

## Acceptance Criteria

- [ ] `plan-execution-checker.md` exists in `.claude/agents/` with correct frontmatter
- [ ] `web-research-maker.md` exists in `.claude/agents/` with correct frontmatter
- [ ] `docs-file-manager.md` exists in `.claude/agents/` with correct frontmatter
- [ ] All agents have name, description, model, color fields in frontmatter
- [ ] Agents reference IKP-Labs project paths and tech stack
- [ ] Low-priority items in `ideas.md` moved to Archive section

## Constraints & Assumptions

- Plugin `frontend-design@claude-plugins-official` is external — cannot be created
- This is a meta change: no code compilation or test runs needed
- Adapted from OSE-public patterns, adjusted to IKP-Labs context
