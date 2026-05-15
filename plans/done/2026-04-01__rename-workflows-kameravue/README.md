# Rename Workflows - Kameravue Specific

## Overview

Rename GitHub Actions workflow files and their internal `name:` fields to be specific to the Kameravue app, so that when new apps are added to the monorepo, their workflows will be clearly separated.

## Scope

- Rename `ci.yml` -> `kameravue-ci.yml` + update internal `name:` field
- Rename `scheduled-e2e.yml` -> `kameravue-scheduled-e2e.yml` + update internal `name:` field
- Update cross-references between the two files
- Update any other references (docs, comments)

## Out of Scope

- Creating workflows for new apps
- Changing workflow logic/triggers
- Modifying branch protection rules
