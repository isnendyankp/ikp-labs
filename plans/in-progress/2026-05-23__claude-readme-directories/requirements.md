# Requirements

## Goal

Provide clear index documentation for Claude agent and skill directories.

## User Stories

- As a repository maintainer, I want `.claude/agents/README.md` to summarize available agents so I can choose the right agent quickly.
- As a repository maintainer, I want `.claude/skills/README.md` to summarize available skills so I can understand which knowledge modules support each agent family.
- As a new contributor, I want both README files to explain naming conventions so I can add future agents or skills consistently.

## Acceptance Criteria

- `.claude/agents/README.md` exists.
- `.claude/skills/README.md` exists.
- Agent README lists current maker, checker, and fixer agents by domain.
- Skill README lists current skill directories and their purpose.
- Both README files link to relevant repository documentation where applicable.
- No existing agent, skill, hook, or settings behavior changes.
