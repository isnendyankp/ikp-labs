# Workflows

Reusable, multi-agent orchestration specifications for recurring processes in IKP-Labs. Every
document here follows the standard defined in
`.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`.

## Current Workflows

| Workflow                    | Path                                                             | Summary                                                                                                             |
| --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| PR-Review Maker→Fixer Cycle | [`pr/pr-review-quality-gate.md`](./pr/pr-review-quality-gate.md) | Sequential, CI-gated N-cycle review loop between `pr-review-maker` and `pr-review-fixer`, run before every PR merge |

More workflow documents will be added here as new multi-agent orchestrations are defined.
