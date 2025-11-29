# IKP Labs - Documentation

## 📚 Documentation Structure

This directory contains comprehensive planning, testing, and implementation documentation for the IKP Labs project.

---

## 📂 Directory Overview

### `/plans/`
Implementation plans and roadmaps for features and testing initiatives.

**Available Plans:**
- **`week3-e2e-gallery-tests.md`** - E2E Gallery Testing Implementation (20 tests, 6-day plan)

### `/checklists/`
Daily progress trackers and completion checklists.

**Available Checklists:**
- **`week3-e2e-gallery-checklist.md`** - E2E Gallery daily progress tracker (Monday-Saturday)

### `/test-scenarios/`
Detailed test scenarios in Given/When/Then format.

**Available Scenarios:**
- **`e2e-gallery-scenarios.md`** - 20 E2E Gallery test scenarios with complete specifications

---

## 🗓️ Current Initiative: E2E Gallery Testing

**Duration:** 6 days (Monday - Saturday)
**Goal:** Implement 20 E2E Gallery tests with daily commits
**Strategy:** Step-by-step learning, consistent progress

### Quick Links
- 📋 [Implementation Plan](plans/week3-e2e-gallery-tests.md) - Complete 6-day roadmap
- ✅ [Daily Checklist](checklists/week3-e2e-gallery-checklist.md) - Track your progress
- 🧪 [Test Scenarios](test-scenarios/e2e-gallery-scenarios.md) - Detailed test specs

### Daily Breakdown
- **Day 1:** Setup + Upload test (1 test)
- **Day 2:** Upload variations + Validation (3 tests)
- **Day 3:** View & Navigation (3 tests)
- **Day 4:** Edit & Delete (4 tests)
- **Day 5:** Validation & Persistence (4 tests)
- **Day 6:** Pagination & Authorization (5 tests)

**Total Target:** 20 E2E tests ✅

---

## 🎯 Overall Test Coverage

### Integration Tests
- **Location:** `backend/registration-form-api/src/test/java/`
- **Count:** 40 tests
- **Tech Stack:** Spring Boot Test + MockMvc + @MockBean + JUnit 5 + Mockito
- **Coverage:** AuthController (12 tests), UserController (17 tests), UserProfileController (11 tests)
- **Focus:** Component interactions with mocked dependencies

### API Tests
- **Location:** `tests/api/`
- **Count:** 31 tests
- **Tech Stack:** Playwright API + TypeScript + Real HTTP + PostgreSQL
- **Coverage:** Gallery API endpoints (POST /upload, GET /my-photos, GET /public, GET /photo/:id, PUT /photo/:id, DELETE /photo/:id)
- **Focus:** Real backend testing with database integration

### E2E Tests
- **Location:** `tests/e2e/`
- **Current Count:** 30 tests (Registration, Login, Auth Flow, Profile Picture)
- **Planned Addition:** +20 Gallery E2E tests
- **Tech Stack:** Playwright E2E + Browser Automation + TypeScript
- **Coverage:** Complete user journeys from UI to database
- **Focus:** Real user experience testing

**Grand Total:** 91 tests (121 after Gallery E2E completion) 🚀

---

## 📖 How to Use This Documentation

### For Daily Execution
1. Open the **Daily Checklist** (`checklists/week3-e2e-gallery-checklist.md`)
2. Navigate to current day section
3. Follow tasks sequentially (morning → afternoon)
4. Check off completed items
5. Use provided commit message templates
6. Track progress with visual indicators

### For Implementation Details
1. Refer to **Implementation Plan** (`plans/week3-e2e-gallery-tests.md`) for:
   - Complete context and background
   - Code patterns and examples
   - Helper function templates
   - Technical references
2. Check **Test Scenarios** (`test-scenarios/e2e-gallery-scenarios.md`) for:
   - Given/When/Then specifications
   - Expected behavior
   - Assertions and selectors
   - Implementation code examples

### For Progress Tracking
- Update progress bars in checklist (⬜ → ✅)
- Mark daily tasks as completed
- Monitor cumulative test count
- Celebrate milestones! 🎉

---

## 🚀 Getting Started

### Prerequisites
Before starting Day 1, ensure you have:
- [ ] **Backend running:** Spring Boot on `localhost:8081`
- [ ] **Frontend running:** Next.js on `localhost:3005`
- [ ] **Database running:** PostgreSQL with proper schema
- [ ] **Playwright installed:** Run `npm install` in project root

### Environment Setup
```bash
# Terminal 1: Start Backend
cd backend/registration-form-api
./mvnw spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Terminal 3: Run Tests
npx playwright test tests/e2e/gallery.spec.ts
```

### Quick Test Commands
```bash
# Run all Gallery E2E tests
npx playwright test tests/e2e/gallery.spec.ts

# Run single test by name
npx playwright test gallery.spec.ts -g "upload single photo"

# Run with UI mode (interactive)
npx playwright test gallery.spec.ts --ui

# Run with debug mode
npx playwright test gallery.spec.ts --debug

# Show HTML test report
npx playwright show-report

# Run tests with verbose output
npx playwright test gallery.spec.ts --reporter=list
```

---

## 📞 Support & Resources

### Internal Project References
- **Existing E2E patterns:** `tests/e2e/profile-picture.spec.ts` (excellent reference for file upload + CRUD)
- **API helpers:** `tests/api/helpers/api-client.ts`, `tests/api/helpers/auth-helper.ts`
- **Test fixtures:** `tests/fixtures/images/` (test-photo.jpg, test-photo.png, large-image.jpg)
- **Playwright config:** `playwright.config.ts`

### External Resources
- [Playwright Official Documentation](https://playwright.dev/docs/intro)
- [Playwright Test Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright File Upload Guide](https://playwright.dev/docs/input#upload-files)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Troubleshooting
- **Tests timing out:** Increase timeout in `playwright.config.ts` or add `{ timeout: 10000 }` to specific tests
- **Elements not found:** Use Playwright Inspector (`--debug` flag) to verify selectors
- **File upload failing:** Check fixture paths are correct relative to test file
- **Database state issues:** Ensure backend is running and database is accessible

---

## 🎓 Testing Evolution Timeline

### Phase 1: Integration Testing
**Completed:** ✅
**Focus:** Component interactions with mocked dependencies
**Tech:** Spring Boot Test + MockMvc + @MockBean
**Output:** 40 integration tests covering Controllers and Services
**Learning:** AAA pattern, mocking strategies, Spring test context

### Phase 2: API Testing
**Completed:** ✅
**Focus:** Real backend API testing with database
**Tech:** Playwright API + TypeScript + Real HTTP
**Output:** 31 API tests covering all Gallery endpoints
**Learning:** HTTP request/response testing, multipart/form-data, authentication, validation

### Phase 3: E2E Testing (Current)
**Status:** 🟡 In Progress
**Focus:** Complete user journeys through browser
**Tech:** Playwright E2E + Browser Automation
**Output Target:** 20 Gallery E2E tests (upload, view, edit, delete, pagination, authorization)
**Learning:** User flow testing, browser automation, dialog handling, multi-user scenarios

### Phase 4: Future Enhancements
**Ideas:**
- CI/CD Integration (GitHub Actions)
- Performance Testing (k6, Lighthouse)
- Accessibility Testing (axe-core)
- Visual Regression (Percy, Playwright screenshots)
- Cross-browser Testing (already configured: Chromium, Firefox, WebKit)

---

## 🏆 Success Criteria

### Code Quality Standards
- ✅ All tests pass consistently (minimum 3 consecutive runs)
- ✅ Test execution time < 10 minutes for full suite
- ✅ Reusable helper functions (DRY principle)
- ✅ TypeScript types used correctly (no `any` types)
- ✅ Clear test names and descriptions
- ✅ Proper error messages for debugging
- ✅ Stable selectors (prefer semantic selectors over brittle ones)

### Documentation Standards
- ✅ Each test documented with Given/When/Then
- ✅ Helper functions have JSDoc comments
- ✅ README files explain purpose and usage
- ✅ Commit messages follow conventional commits format
- ✅ Known issues and limitations documented

### Portfolio & Career Impact
- ✅ Daily commit streak demonstrates consistency
- ✅ Professional test architecture showcases skills
- ✅ Comprehensive coverage (Integration + API + E2E)
- ✅ LinkedIn post material prepared
- ✅ Interview talking points documented
- ✅ Open source portfolio piece

### Learning Outcomes
- ✅ Deep understanding of Playwright framework
- ✅ E2E testing best practices mastered
- ✅ Test automation patterns internalized
- ✅ Quality assurance mindset developed
- ✅ TypeScript proficiency improved

---

## 📊 Metrics & Progress Tracking

### Test Count Progress
```
Integration Tests: ████████████████████ 40/40  (100%)
API Tests:         ████████████████████ 31/31  (100%)
E2E Existing:      ████████████████████ 30/30  (100%)
E2E Gallery:       ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/20   (0%)
```

**Total Current:** 101/121 tests (83%)
**Target:** 121/121 tests (100%)

### Daily Commit Streak
Track your consistency:
```
Day 1 (Mon): ⬜
Day 2 (Tue): ⬜
Day 3 (Wed): ⬜
Day 4 (Thu): ⬜
Day 5 (Fri): ⬜
Day 6 (Sat): ⬜
```
Goal: ✅✅✅✅✅✅ (6/6 consecutive days)

---

## 💡 Pro Tips

### Daily Workflow
1. **Morning:** Review plan for the day, set up environment
2. **Implementation:** Code 2-3 hours, take breaks
3. **Testing:** Run tests multiple times, ensure stability
4. **Commit:** Use provided templates, push daily
5. **Reflection:** Update checklist, celebrate progress

### Testing Best Practices
- **Test Isolation:** Each test should be independent (use `beforeEach` to reset state)
- **Unique Data:** Generate unique emails/data per test to avoid conflicts
- **Auto-waiting:** Trust Playwright's auto-wait, avoid fixed `setTimeout` when possible
- **Descriptive Names:** Test names should clearly state what they verify
- **Console Logging:** Add logs for debugging complex scenarios
- **Copy Patterns:** Learn from `profile-picture.spec.ts` - it has excellent patterns

### Debugging Strategies
1. **Use `--debug` flag:** Interactive stepping through tests
2. **Use `--ui` mode:** Visual test runner with timeline
3. **Add `page.pause()`:** Stop execution at specific points
4. **Screenshot on failure:** Already configured in `playwright.config.ts`
5. **Check network tab:** Use Playwright Inspector to see API calls

---

**Documentation Created:** Sunday Planning Session
**Status:** Ready for execution
**Next Step:** Begin Day 1 - Setup + First Upload Test! 🚀

Good luck! You got this! 💪
