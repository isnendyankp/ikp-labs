# Plan: Governance Restructuring

## Overview

Restructure `governance/` from flat files to hierarchical folder structure, aligned with senior's `open-sharia-enterprise` pattern. No new content — existing content is reorganized.

**Motivation**: Senior's explicit advice to build scalable governance now, before IKP-Labs adds more apps. Migrating with 1 app is 10x easier than with 3+ apps.

## Scope

### In Scope

- Move all existing governance files into hierarchical folders
- Create `README.md` per folder (index files, not new content)
- Create `governance/repository-governance-architecture.md` (consolidates `docs/explanation/governance.md`)
- Update all cross-references to moved files
- Move `.workflow-template.md` content into `governance/development/workflow/`

### Out of Scope

- Adding new governance content beyond what already exists
- Restructuring `docs/` folder
- Changing any app source code

## Status

**Phase**: Planning
**Created**: 2026-04-25
**Target**: 1 implementation PR

## Related

- Senior reference: `https://github.com/wahidyankf/open-sharia-enterprise/tree/main/governance`
- Current governance: `governance/` (5 flat files)
