# Fix: E2E Helper Import Paths After NX Migration

## Overview

Scheduled E2E CI ("Kameravue Scheduled E2E Tests") has been failing since NX monorepo migration. Root cause: broken relative import paths in 14 test files.

## Problem

After NX migration, test files moved into `apps/kameravue-fe-e2e/tests/` subdirectory but imports still use `./helpers/X` (resolves to `tests/helpers/X` — doesn't exist). Helpers actually live at `apps/kameravue-fe-e2e/helpers/`.

## Fix

Change all `./helpers/` → `../helpers/` in 14 affected test files.

## Scope

- 14 files in `apps/kameravue-fe-e2e/tests/`
- No logic changes, import paths only
- CI should pass after fix
