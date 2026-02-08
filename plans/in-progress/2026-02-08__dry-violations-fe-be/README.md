# Fix Frontend & Backend DRY Violations

**Status**: 📋 In Progress
**Created**: February 8, 2026
**Priority**: Medium (Code Quality Improvement)

## Overview

This plan addresses DRY (Don't Repeat Yourself) violations found in the frontend and backend codebase. Duplicate code has been identified across multiple service files, controllers, and components. This work will improve code maintainability, reduce the risk of inconsistencies, and follow clean code principles.

## Motivation

### Why This Matters

- **Maintainability**: Single source of truth for common logic
- **Consistency**: Eliminate risk of inconsistencies from duplicate code
- **Code Quality**: Follow DRY principle - a fundamental clean code practice
- **Professionalism**: Shows attention to code quality for recruiters

### Context

This work was originally part of Phase 14 of the Bug Analysis & Testing Coverage plan (2026-02-02) but was extracted into a separate plan due to its size and scope.

## Scope

### Frontend (FE)
- FE-1: Authentication Token Handling (5 files, ~100 lines duplicate)
- FE-2: Like vs Favorite Button Logic (2 files, ~140 lines similar)
- FE-3: API Response Handling Pattern (5 files with similar patterns)

### Backend (BE)
- BE-1: Pagination Logic Repetition (3 controllers, ~30 lines duplicate)
- BE-2: SortBy Validation Logic (3 controllers, ~24 lines duplicate)
- BE-3: Controller Response Patterns (lower priority)

## Documents

- [Requirements](requirements.md) - Detailed requirements for each fix
- [Technical Design](technical-design.md) - Implementation approach and architecture
- [Checklist](checklist.md) - Step-by-step implementation checklist

## Priority

| Priority | Task | Impact | Est. Time |
|----------|------|--------|-----------|
| 1 | FE Auth Token Consolidation | HIGH | 30 min |
| 2 | BE Pagination Utility | MEDIUM | 20 min |
| 3 | BE SortBy Enum | MEDIUM | 15 min |
| 4 | ActionButton Component (Optional) | LOW | 30 min |

**Total Estimated Time**: 95 minutes (65 min without Priority 4)

## Related Plans

- **Parent Plan**: [Bug Analysis & Testing Coverage](../../done/2026-02-02__bug-analysis-testing-coverage/) (Phase 14)
