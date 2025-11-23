# API Tests - Implementation Plan

**Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED

**Created:** 2025-11-23

**Last Updated:** 2025-11-23

**Timeline:** November 26-29, 2025 (Day 3-6 of Backend Testing Week)

## Overview

This plan implements comprehensive API tests for the Gallery Photo feature using REST Assured with **REAL local PostgreSQL database**. API tests verify the complete backend stack with actual HTTP requests, real database persistence, and real file system operations.

## Scope Summary

**What IS Included:**
- Full backend testing with real local PostgreSQL
- REST Assured for real HTTP requests
- GalleryAPITest with all CRUD operations
- Real file upload to file system
- Real database persistence and transactions
- Authorization and authentication with real JWT
- Complete test flow: Register → Login → Upload → Gallery → Delete

**What is NOT Included:**
- Frontend testing (E2E with Playwright in Week 2)
- Performance or load testing
- Mocked database (we use REAL PostgreSQL)
- Unit or integration tests (covered in Day 1-2)

## Current State

**Existing API Tests:**
- ✅ AuthControllerAPITest (8 tests) - Real DB
- ✅ UserControllerAPITest (15 tests) - Real DB
- ✅ UserProfileControllerAPITest (8 tests) - Real DB

**Missing API Tests:**
- ❌ GalleryAPITest - Gallery CRUD with real DB + file system

**Total Existing:** ~31 API tests
**To Add:** ~35-40 API tests
**Final Total:** ~66-71 API tests

## Plan Documents

1. **[requirements.md](./requirements.md)** - Detailed scope and API test scenarios
2. **[technical-design.md](./technical-design.md)** - REST Assured setup, database config
3. **[checklist.md](./checklist.md)** - Day-by-day tasks for Days 3-6

## Key Deliverables

### Days 3-6: Gallery API Tests (35-40 tests)

**Day 3 (Wed):** Setup + Auth/User API tests refresh
**Day 4 (Thu):** Profile API tests + Gallery upload tests
**Day 5 (Fri):** Gallery retrieve and pagination tests
**Day 6 (Sat):** Gallery update, delete, privacy tests

**Test Pattern:**
- Real PostgreSQL running locally
- Server running: `mvn spring-boot:run`
- REST Assured for HTTP requests
- Test data pattern: `apitest*@test.com`
- Cleanup after each test (@AfterEach)

## Success Metrics

- ✅ 35-40 new Gallery API tests passing
- ✅ Real database persistence verified
- ✅ Real file uploads working
- ✅ All CRUD operations tested
- ✅ Authorization enforced
- ✅ Test cleanup working

## Timeline

**Day 3-6 (4 days total):** ~4-6 hours per day

## Dependencies

**Prerequisites:**
- ✅ Unit tests complete (Day 1)
- ✅ Integration tests complete (Day 2)
- ✅ PostgreSQL installed locally
- ✅ REST Assured configured
- ✅ Existing API tests as reference

**Blocks:** None (can start after Day 2)

## Notes

- API test = Full backend with REAL database
- Server must be running (`mvn spring-boot:run`)
- Database must be running locally
- Test cleanup critical (prevent pollution)
