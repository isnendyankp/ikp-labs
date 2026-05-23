# Technical Design

## Approach

Add lightweight directory-level Markdown documentation files directly inside the existing Claude directories:

```text
.claude/
├── agents/
│   └── README.md
└── skills/
    └── README.md
```

## `.claude/agents/README.md`

The agents README will document:

- Directory purpose.
- Maker, checker, and fixer role model.
- Current agent inventory grouped by domain.
- Usage guidance and maintenance rules.
- Links to `AGENTS.md` and governance agent guidelines.

## `.claude/skills/README.md`

The skills README will document:

- Directory purpose.
- Skill package structure using `SKILL.md`.
- Current skill inventory.
- Usage guidance and maintenance rules.
- Links to `AGENTS.md` and Claude agents reference documentation.

## Validation

Since this is documentation-only work, validation is limited to checking that the files exist and accurately reflect current directory contents.
