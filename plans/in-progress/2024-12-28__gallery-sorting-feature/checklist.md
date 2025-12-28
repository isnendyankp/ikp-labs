# Gallery Sorting Feature - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: Planning & Documentation ✅

### Task 1.1: Create Plan Structure
- [✅] Create plan folder: `plans/in-progress/2024-12-28__gallery-sorting-feature/`
- [✅] Create README.md (overview, scope, timeline)
- [✅] Create requirements.md (40+ detailed requirements)
- [✅] Create technical-design.md (architecture, queries, components)
- [✅] Create checklist.md (this file)
- [ ] **COMMIT 1**: "docs: add gallery sorting feature implementation plan"

**Acceptance Criteria**:
- [✅] All plan files created
- [✅] Plan follows same structure as previous plans
- [✅] Requirements and technical design are clear
- [✅] User approved scope and approach (Option A: separate dropdowns)

---

## Phase 2: Backend Implementation (Priority 1)

### Task 2.1: Add SortBy Parameter to Controller (20 min)
**Affected Files**: `GalleryController.java`
**Estimated Time**: 20 minutes

**Files Modified**:
- `backend/ikp-labs-api/src/main/java/com/ikplabs/gallery/controller/GalleryController.java`

**Steps**:
1. [ ] Add sortBy parameter to 4 gallery endpoints:
   - [ ] `GET /api/gallery/public` - Public photos endpoint
   - [ ] `GET /api/gallery/my-photos` - User's own photos endpoint
   - [ ] `GET /api/gallery/liked` - Liked photos endpoint
   - [ ] `GET /api/gallery/favorited` - Favorited photos endpoint
2. [ ] Add validation for sortBy parameter:
   ```java
   @RequestParam(required = false, defaultValue = "newest") String sortBy
   ```
3. [ ] Validate sortBy values (whitelist: newest, oldest, mostLiked, mostFavorited)
4. [ ] Return 400 Bad Request for invalid sortBy values
5. [ ] Pass sortBy parameter to service layer
6. [ ] Test manually with Postman/curl:
   ```bash
   curl "http://localhost:8081/api/gallery/public?page=0&size=25&sortBy=mostLiked"
   ```
7. [ ] **COMMIT 2**: "feat(gallery): add sortBy parameter to 4 gallery endpoints"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All 4 endpoints accept sortBy parameter
- [ ] Invalid sortBy returns 400 with clear error message
- [ ] Default sortBy is 'newest' (backward compatible)
- [ ] No breaking changes to existing API consumers

---

### Task 2.2: Implement Service Layer Sorting Logic (30 min)
**Affected Files**: `GalleryService.java`
**Estimated Time**: 30 minutes

**Files Modified**:
- `backend/ikp-labs-api/src/main/java/com/ikplabs/gallery/service/GalleryService.java`

**Steps**:
1. [ ] Create helper method `getSortOrder(String sortBy)`:
   ```java
   private Sort getSortOrder(String sortBy) {
       return switch (sortBy) {
           case "newest" -> Sort.by("createdAt").descending();
           case "oldest" -> Sort.by("createdAt").ascending();
           case "mostLiked" -> Sort.by("likeCount").descending()
                                  .and(Sort.by("createdAt").descending());
           case "mostFavorited" -> Sort.by("favoriteCount").descending()
                                      .and(Sort.by("createdAt").descending());
           default -> Sort.by("createdAt").descending();
       };
   }
   ```
2. [ ] Update 4 service methods to use getSortOrder():
   - [ ] `getPublicPhotos(int page, int size, String sortBy, Long currentUserId)`
   - [ ] `getUserPhotos(int page, int size, String sortBy, Long currentUserId)`
   - [ ] `getLikedPhotos(int page, int size, String sortBy, Long currentUserId)`
   - [ ] `getFavoritedPhotos(int page, int size, String sortBy, Long currentUserId)`
3. [ ] Pass Sort object to repository layer
4. [ ] Test service methods with all 4 sort options
5. [ ] **COMMIT 3**: "feat(gallery): implement sorting logic in service layer"
6. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All 4 service methods support sorting
- [ ] Composite sorts work (mostLiked/mostFavorited use tiebreaker)
- [ ] Default to newest if sortBy is null/invalid
- [ ] No null pointer exceptions

---

### Task 2.3: Optimize Repository Queries (N+1 Problem Fix) (60 min)
**Affected Files**: `GalleryPhotoRepository.java`
**Estimated Time**: 60 minutes

**Files Modified**:
- `backend/ikp-labs-api/src/main/java/com/ikplabs/gallery/repository/GalleryPhotoRepository.java`

**Steps**:
1. [ ] Create optimized native query for public photos sorted by likes:
   - [ ] Add LEFT JOINs for like_counts and favorite_counts
   - [ ] Add LEFT JOINs for user-specific flags (is_liked, is_favorited)
   - [ ] Use subqueries with GROUP BY for counts
   - [ ] Support dynamic ORDER BY based on sortBy
2. [ ] Create optimized native query for my photos
3. [ ] Create optimized native query for liked photos
4. [ ] Create optimized native query for favorited photos
5. [ ] Add count queries for pagination
6. [ ] Map Object[] results to GalleryPhoto entities or DTOs
7. [ ] Test queries in database console:
   ```sql
   -- Verify query returns correct results
   -- Check execution plan (EXPLAIN ANALYZE)
   -- Confirm single query (no N+1)
   ```
8. [ ] Benchmark performance:
   - [ ] Before: Count total queries for 25 photos
   - [ ] After: Confirm single query per page
9. [ ] **COMMIT 4**: "perf(gallery): optimize queries to solve N+1 problem with JOINs"
10. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All 4 endpoints use optimized queries
- [ ] Single query per page (no N+1)
- [ ] Query execution time < 100ms
- [ ] Correct counts for likes/favorites
- [ ] User-specific flags (is_liked, is_favorited) accurate
- [ ] Pagination works correctly

**Performance Target**:
- Before: 25 queries per page (1 main + 12 COUNT + 12 EXISTS)
- After: 1 query per page
- Expected improvement: 96% query reduction

---

### Task 2.4: Backend Testing (60 min)
**Affected Files**: Backend test files
**Estimated Time**: 60 minutes

**Files Created/Modified**:
- `backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/controller/GalleryControllerTest.java`
- `backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/service/GalleryServiceTest.java`
- `backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/repository/GalleryPhotoRepositoryTest.java`

**Steps**:

**Unit Tests (Controller)**:
1. [ ] Test valid sortBy parameters (newest, oldest, mostLiked, mostFavorited)
2. [ ] Test invalid sortBy returns 400 Bad Request
3. [ ] Test default sortBy (omitted parameter)
4. [ ] Test pagination with sorting
5. [ ] Test authentication/authorization

**Unit Tests (Service)**:
6. [ ] Test getSortOrder() method for all sort options
7. [ ] Test service methods call repository with correct Sort object
8. [ ] Test null/invalid sortBy handling

**Integration Tests (Repository)**:
9. [ ] Create test data (photos with different like/favorite counts)
10. [ ] Test newest sort (createdAt DESC)
11. [ ] Test oldest sort (createdAt ASC)
12. [ ] Test mostLiked sort (verify order by like count)
13. [ ] Test mostFavorited sort (verify order by favorite count)
14. [ ] Test composite sorts (tiebreaker scenarios)
15. [ ] Test pagination maintains sort order
16. [ ] Test optimized query returns correct counts

**Run Tests**:
17. [ ] Run unit tests: `mvn test`
18. [ ] Run integration tests: `mvn verify`
19. [ ] Verify all tests pass
20. [ ] Check test coverage (aim for > 80%)
21. [ ] **COMMIT 5**: "test(gallery): add backend unit and integration tests for sorting"
22. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All backend unit tests pass
- [ ] All integration tests pass
- [ ] Test coverage > 80% for new code
- [ ] Tests cover edge cases (empty results, ties, pagination)
- [ ] No flaky tests

---

## Phase 3: Frontend Implementation (Priority 2)

### Task 3.1: Create SortingDropdown Component (45 min)
**Affected Files**: New component
**Estimated Time**: 45 minutes

**Files Created**:
- `frontend/src/components/SortingDropdown.tsx`

**Steps**:
1. [ ] Create component file with TypeScript interface:
   ```typescript
   export type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited';
   interface SortingDropdownProps {
     currentSort: SortOption;
     onSortChange: (sortBy: SortOption) => void;
   }
   ```
2. [ ] Define SORT_OPTIONS array with labels and icons:
   - Newest First ⬇️
   - Oldest First ⬆️
   - Most Liked 🔥
   - Most Favorited ⭐
3. [ ] Implement dropdown UI (matches FilterDropdown style):
   - [ ] Button with current selection
   - [ ] Dropdown menu with 4 options
   - [ ] Chevron icon (rotates when open)
   - [ ] Click outside to close
4. [ ] Add keyboard navigation (Arrow keys, Enter, Escape)
5. [ ] Add ARIA attributes for accessibility:
   - [ ] role="button"
   - [ ] aria-expanded
   - [ ] aria-label
6. [ ] Add data-testid attributes for testing:
   - [ ] `data-testid="sort-dropdown-button"`
   - [ ] `data-testid="sort-option-{value}"`
7. [ ] Add visual feedback (hover, active states)
8. [ ] Style with Tailwind CSS (consistent with FilterDropdown)
9. [ ] Test component in isolation (Storybook or manual)
10. [ ] **COMMIT 6**: "feat(gallery): create SortingDropdown component"
11. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Component renders correctly
- [ ] Dropdown opens/closes properly
- [ ] Visual style matches FilterDropdown
- [ ] Keyboard accessible
- [ ] Mobile responsive
- [ ] No console warnings/errors

---

### Task 3.2: Update Gallery Page with Sort State (30 min)
**Affected Files**: `frontend/src/app/gallery/page.tsx`
**Estimated Time**: 30 minutes

**Files Modified**:
- `frontend/src/app/gallery/page.tsx`

**Steps**:
1. [ ] Import SortingDropdown component and SortOption type
2. [ ] Add sortBy to URL query parameters:
   - [ ] Read sortBy from searchParams
   - [ ] Default to 'newest' if not present
3. [ ] Add state: `const [currentSortBy, setCurrentSortBy] = useState<SortOption>(sortByParam);`
4. [ ] Create handleSortChange function:
   ```typescript
   const handleSortChange = (newSortBy: SortOption) => {
     setCurrentSortBy(newSortBy);
     setCurrentPage(1); // Reset to page 1 when sort changes
     updateURL(currentFilter, newSortBy, 1);
   };
   ```
5. [ ] Update updateURL function to include sortBy parameter
6. [ ] Render SortingDropdown component in header (next to FilterDropdown):
   ```tsx
   <SortingDropdown
     currentSort={currentSortBy}
     onSortChange={handleSortChange}
   />
   ```
7. [ ] Pass sortBy to data fetching functions:
   - [ ] getPublicPhotos(page, size, sortBy)
   - [ ] getUserPhotos(page, size, sortBy)
   - [ ] getLikedPhotos(page, size, sortBy)
   - [ ] getFavoritedPhotos(page, size, sortBy)
8. [ ] Update useEffect dependencies (add currentSortBy)
9. [ ] Test manually in browser:
   - [ ] URL updates when sort changes
   - [ ] Page resets to 1
   - [ ] Photos re-fetch with new sort order
10. [ ] **COMMIT 7**: "feat(gallery): integrate SortingDropdown and sort state in Gallery page"
11. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] SortingDropdown appears in Gallery header
- [ ] Sort selection updates URL (?sortBy=mostLiked)
- [ ] Photos re-fetch when sort changes
- [ ] Page resets to 1 when sort changes
- [ ] State persists on page refresh (from URL)
- [ ] No infinite re-render loops

---

### Task 3.3: Update Gallery Service Functions (20 min)
**Affected Files**: `frontend/src/services/galleryService.ts`
**Estimated Time**: 20 minutes

**Files Modified**:
- `frontend/src/services/galleryService.ts`

**Steps**:
1. [ ] Add sortBy parameter to 4 service functions:
   ```typescript
   export async function getPublicPhotos(
     page: number = 0,
     size: number = 25,
     sortBy: string = 'newest'
   ): Promise<GalleryListResponse>
   ```
2. [ ] Update API URLs to include sortBy query parameter:
   ```typescript
   const response = await axios.get(`/api/gallery/public`, {
     params: { page, size, sortBy }
   });
   ```
3. [ ] Apply to all 4 functions:
   - [ ] getPublicPhotos
   - [ ] getUserPhotos
   - [ ] getLikedPhotos
   - [ ] getFavoritedPhotos
4. [ ] Update TypeScript types (if needed)
5. [ ] Test service functions:
   ```typescript
   // Manual test in browser console
   galleryService.getPublicPhotos(0, 25, 'mostLiked')
   ```
6. [ ] **COMMIT 8**: "feat(gallery): add sortBy parameter to all gallery service functions"
7. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All 4 service functions accept sortBy parameter
- [ ] sortBy defaults to 'newest' (backward compatible)
- [ ] API requests include sortBy query parameter
- [ ] TypeScript types are correct
- [ ] No breaking changes

---

### Task 3.4: Frontend Unit Tests (60 min)
**Affected Files**: Frontend test files
**Estimated Time**: 60 minutes

**Files Created**:
- `frontend/src/components/__tests__/SortingDropdown.test.tsx`

**Steps**:

**SortingDropdown Component Tests**:
1. [ ] Test component renders with all 4 sort options
2. [ ] Test dropdown opens when button clicked
3. [ ] Test dropdown closes when option selected
4. [ ] Test onSortChange callback called with correct value
5. [ ] Test keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
6. [ ] Test accessibility (ARIA attributes)
7. [ ] Test visual states (hover, active)
8. [ ] Test click outside closes dropdown

**Gallery Page Tests** (extend existing tests):
9. [ ] Test sortBy state updates when dropdown changes
10. [ ] Test URL updates with sortBy parameter
11. [ ] Test page resets to 1 when sort changes
12. [ ] Test data fetches with correct sortBy value

**Run Tests**:
13. [ ] Run Jest tests: `npm test`
14. [ ] Verify all tests pass
15. [ ] Check test coverage: `npm test -- --coverage`
16. [ ] Aim for > 80% coverage on new code
17. [ ] **COMMIT 9**: "test(gallery): add frontend unit tests for SortingDropdown"
18. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All unit tests pass
- [ ] SortingDropdown has > 80% coverage
- [ ] Gallery page sort logic tested
- [ ] No flaky tests
- [ ] Tests use best practices (data-testid, user events)

---

## Phase 4: End-to-End Testing (Priority 3)

### Task 4.1: Create Gherkin BDD Scenarios (45 min)
**Affected Files**: New Gherkin feature file
**Estimated Time**: 45 minutes

**Files Created**:
- `specs/gallery/photo-sorting.feature`

**Steps**:
1. [ ] Create feature file with Background:
   ```gherkin
   Feature: Gallery Photo Sorting

   Background:
     Given I am logged in as a test user
     And test photos exist with different like and favorite counts
   ```
2. [ ] Write scenarios for basic sorting (12-15 scenarios):
   - [ ] Scenario: User sorts photos by newest first
   - [ ] Scenario: User sorts photos by oldest first
   - [ ] Scenario: User sorts photos by most liked
   - [ ] Scenario: User sorts photos by most favorited
3. [ ] Write scenarios for filter + sort combinations:
   - [ ] Scenario: User views liked photos sorted by newest
   - [ ] Scenario: User views liked photos sorted by most liked
   - [ ] Scenario: User views favorited photos sorted by most favorited
   - [ ] Scenario: User views my photos sorted by oldest
4. [ ] Write scenarios for URL persistence:
   - [ ] Scenario: Sort selection persists in URL
   - [ ] Scenario: Sort selection persists after page refresh
   - [ ] Scenario: Direct URL with sortBy parameter works
5. [ ] Write scenarios for edge cases:
   - [ ] Scenario: Invalid sortBy parameter defaults to newest
   - [ ] Scenario: Empty results maintain sort dropdown
   - [ ] Scenario: Pagination maintains sort order
6. [ ] Write scenarios for accessibility:
   - [ ] Scenario: Sort dropdown is keyboard accessible
7. [ ] **COMMIT 10**: "test(gherkin): add BDD scenarios for gallery photo sorting"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] 12-15 comprehensive scenarios written
- [ ] Scenarios follow Given/When/Then pattern
- [ ] Scenarios cover happy path and edge cases
- [ ] Scenarios test all 16 filter+sort combinations (representative sample)

---

### Task 4.2: Implement Gherkin Step Definitions (60 min)
**Affected Files**: Cucumber step definition files
**Estimated Time**: 60 minutes

**Files Modified/Created**:
- `tests/gherkin/steps/gallery.steps.ts` (or create if not exists)

**Steps**:
1. [ ] Create step definitions file (if needed)
2. [ ] Implement Background steps:
   - [ ] Given("I am logged in as a test user")
   - [ ] Given("test photos exist with different like and favorite counts")
3. [ ] Implement sorting interaction steps:
   - [ ] When("I click the sort dropdown")
   - [ ] When("I select {string} from the sort dropdown")
   - [ ] When("I select {string} filter and {string} sort")
4. [ ] Implement verification steps:
   - [ ] Then("photos should be sorted by {string}")
   - [ ] Then("the first photo should have {int} likes")
   - [ ] Then("the URL should contain {string}")
   - [ ] Then("the sort dropdown should show {string}")
5. [ ] Implement keyboard navigation steps:
   - [ ] When("I press {string} key on sort dropdown")
   - [ ] Then("the sort dropdown should open")
6. [ ] Add helper functions:
   - [ ] `verifySortOrder(sortType: string, photos: any[])`
   - [ ] `seedTestPhotos()` - Create test data with known counts
7. [ ] Test step definitions:
   ```bash
   npm run test:cucumber -- --name "User sorts photos by newest"
   ```
8. [ ] **COMMIT 11**: "test(gherkin): implement step definitions for photo sorting scenarios"
9. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All step definitions implemented
- [ ] Steps reusable across scenarios
- [ ] Test data seeding works correctly
- [ ] Verification logic is robust
- [ ] No hardcoded waits (use proper Playwright waits)

---

### Task 4.3: Run Gherkin Tests and Fix Issues (30 min)
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Ensure servers are running:
   ```bash
   # Terminal 1: Backend
   cd backend/ikp-labs-api && mvn spring-boot:run

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```
2. [ ] Run all Gherkin tests:
   ```bash
   cd frontend
   npm run test:cucumber
   ```
3. [ ] Analyze results:
   - [ ] How many pass?
   - [ ] Which scenarios fail?
   - [ ] What are the error messages?
4. [ ] Fix failing scenarios:
   - [ ] Timing issues (add proper waits)
   - [ ] Selector issues (verify data-testid)
   - [ ] Test data issues (verify seeding)
   - [ ] Step definition bugs
5. [ ] Re-run tests until all pass
6. [ ] Document any known limitations
7. [ ] **COMMIT 12**: "fix(gherkin): resolve failing photo sorting test scenarios"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All Gherkin scenarios pass (12-15/12-15)
- [ ] Tests run reliably (no flakiness)
- [ ] Execution time < 2 minutes
- [ ] No arbitrary waits

---

### Task 4.4: Create Playwright E2E Tests (60 min)
**Affected Files**: New Playwright test file
**Estimated Time**: 60 minutes

**Files Created**:
- `tests/e2e/gallery-sorting.spec.ts`

**Steps**:
1. [ ] Create test file with describe block:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Gallery Photo Sorting', () => {
     test.beforeEach(async ({ page }) => {
       // Login and seed test data
     });
   });
   ```
2. [ ] Write E2E tests for basic sorting (15-20 tests):
   - [ ] Test: Newest first sort displays recent photos first
   - [ ] Test: Oldest first sort displays old photos first
   - [ ] Test: Most liked sort displays popular photos first
   - [ ] Test: Most favorited sort displays favorited photos first
3. [ ] Write E2E tests for filter + sort combinations:
   - [ ] Test: Liked filter + Most liked sort
   - [ ] Test: Favorited filter + Newest sort
   - [ ] Test: My photos + Oldest sort
4. [ ] Write E2E tests for UI interactions:
   - [ ] Test: Sort dropdown opens and closes
   - [ ] Test: Selected sort option is highlighted
   - [ ] Test: URL updates when sort changes
5. [ ] Write E2E tests for state persistence:
   - [ ] Test: Sort persists on page refresh
   - [ ] Test: Direct navigation with sortBy URL param
   - [ ] Test: Browser back/forward maintains sort
6. [ ] Write E2E tests for pagination:
   - [ ] Test: Pagination maintains sort order across pages
   - [ ] Test: Changing sort resets to page 1
7. [ ] Write E2E tests for edge cases:
   - [ ] Test: Empty results show appropriate message
   - [ ] Test: Invalid sortBy defaults to newest
8. [ ] Write E2E tests for accessibility:
   - [ ] Test: Sort dropdown keyboard navigation
   - [ ] Test: ARIA attributes present
9. [ ] Run Playwright tests:
   ```bash
   npx playwright test gallery-sorting
   ```
10. [ ] Debug failures with Playwright UI:
    ```bash
    npx playwright test --ui
    ```
11. [ ] **COMMIT 13**: "test(e2e): add Playwright tests for gallery sorting feature"
12. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] 15-20 comprehensive E2E tests written
- [ ] All tests pass reliably
- [ ] Tests use best practices (page objects, no arbitrary waits)
- [ ] Tests cover user journeys
- [ ] Execution time < 3 minutes

---

### Task 4.5: Create Playwright API Tests (45 min)
**Affected Files**: Extend existing API test file
**Estimated Time**: 45 minutes

**Files Modified**:
- `tests/api/gallery.api.spec.ts`

**Steps**:
1. [ ] Add API tests for sortBy parameter (12-15 tests):
   - [ ] Test: GET /api/gallery/public?sortBy=newest returns correct order
   - [ ] Test: GET /api/gallery/public?sortBy=oldest returns reverse order
   - [ ] Test: GET /api/gallery/public?sortBy=mostLiked returns sorted by likes
   - [ ] Test: GET /api/gallery/public?sortBy=mostFavorited returns sorted by favorites
2. [ ] Test all 4 endpoints with sorting:
   - [ ] /api/gallery/public
   - [ ] /api/gallery/my-photos
   - [ ] /api/gallery/liked
   - [ ] /api/gallery/favorited
3. [ ] Test edge cases:
   - [ ] Test: Invalid sortBy returns 400 Bad Request
   - [ ] Test: Missing sortBy defaults to newest
   - [ ] Test: Empty results return empty array
   - [ ] Test: Pagination works with sorting
4. [ ] Test performance:
   - [ ] Test: Response time < 200ms
   - [ ] Test: Query count = 1 (verify N+1 fix)
5. [ ] Test data integrity:
   - [ ] Test: Like counts are accurate
   - [ ] Test: Favorite counts are accurate
   - [ ] Test: User-specific flags (is_liked, is_favorited) correct
6. [ ] Run API tests:
   ```bash
   npx playwright test api/gallery
   ```
7. [ ] **COMMIT 14**: "test(api): add API tests for gallery sorting endpoints"
8. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] 12-15 API tests written
- [ ] All tests pass
- [ ] Tests verify correct sort order
- [ ] Tests verify performance (< 200ms)
- [ ] Tests cover all 4 endpoints

---

## Phase 5: Documentation & Cleanup

### Task 5.1: Update API Documentation (20 min)
**Affected Files**: API documentation
**Estimated Time**: 20 minutes

**Files Modified/Created**:
- `docs/api/gallery-endpoints.md` (or similar)
- Swagger/OpenAPI spec (if exists)

**Steps**:
1. [ ] Document sortBy parameter for all 4 endpoints:
   ```markdown
   ### GET /api/gallery/public

   **Query Parameters**:
   - `page` (number, optional): Page number (0-indexed), default: 0
   - `size` (number, optional): Items per page, default: 25
   - `sortBy` (string, optional): Sort order, default: "newest"
     - `newest`: Sort by creation date (newest first)
     - `oldest`: Sort by creation date (oldest first)
     - `mostLiked`: Sort by like count (most liked first)
     - `mostFavorited`: Sort by favorite count (most favorited first)

   **Example**:
   ```
   GET /api/gallery/public?page=0&size=25&sortBy=mostLiked
   ```
2. [ ] Document response format (unchanged)
3. [ ] Document error responses:
   - [ ] 400 Bad Request for invalid sortBy
4. [ ] Add examples for all sort options
5. [ ] Update Swagger/OpenAPI spec (if applicable)
6. [ ] **COMMIT 15**: "docs: update API documentation with sortBy parameter"
7. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] All endpoints documented
- [ ] sortBy parameter clearly explained
- [ ] Examples provided
- [ ] Error responses documented

---

### Task 5.2: Add Component Documentation (15 min)
**Affected Files**: Component files
**Estimated Time**: 15 minutes

**Files Modified**:
- `frontend/src/components/SortingDropdown.tsx`

**Steps**:
1. [ ] Add JSDoc comments to SortingDropdown:
   ```typescript
   /**
    * SortingDropdown - Allows users to sort gallery photos by different criteria
    *
    * @component
    * @example
    * ```tsx
    * <SortingDropdown
    *   currentSort="newest"
    *   onSortChange={(sortBy) => console.log(sortBy)}
    * />
    * ```
    *
    * @param {SortingDropdownProps} props - Component props
    * @param {SortOption} props.currentSort - Currently selected sort option
    * @param {function} props.onSortChange - Callback when sort option changes
    */
   ```
2. [ ] Document SortOption type:
   ```typescript
   /**
    * Available sort options for gallery photos
    * - newest: Sort by creation date (newest first)
    * - oldest: Sort by creation date (oldest first)
    * - mostLiked: Sort by like count (most liked first)
    * - mostFavorited: Sort by favorite count (most favorited first)
    */
   export type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited';
   ```
3. [ ] Add inline comments for complex logic
4. [ ] **COMMIT 16**: "docs: add JSDoc documentation to SortingDropdown component"
5. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Component has clear JSDoc
- [ ] Props documented
- [ ] Usage example provided
- [ ] Types documented

---

### Task 5.3: Update User Guide (15 min)
**Affected Files**: User-facing documentation
**Estimated Time**: 15 minutes

**Files Modified/Created**:
- `docs/user-guide/gallery.md` (or similar)

**Steps**:
1. [ ] Add section on sorting photos:
   ```markdown
   ## Sorting Photos

   You can sort photos in the gallery using the **Sort** dropdown:

   - **Newest First** (⬇️): Shows the most recently uploaded photos first
   - **Oldest First** (⬆️): Shows the oldest photos first
   - **Most Liked** (🔥): Shows the most popular photos (by like count)
   - **Most Favorited** (⭐): Shows photos favorited the most

   ### Combining Filters and Sorting

   You can combine any filter with any sort option:
   - View your liked photos sorted by newest
   - View all public photos sorted by most liked
   - And more!
   ```
2. [ ] Add screenshots (optional):
   - [ ] Sort dropdown UI
   - [ ] Combined filter + sort example
3. [ ] Update table of contents
4. [ ] **COMMIT 17**: "docs: add user guide for gallery photo sorting"
5. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] User guide updated
- [ ] Clear instructions provided
- [ ] Examples included
- [ ] Screenshots added (optional)

---

### Task 5.4: Update Plan Status to Complete (10 min)
**Affected Files**: Plan files
**Estimated Time**: 10 minutes

**Files Modified**:
- `plans/in-progress/2024-12-28__gallery-sorting-feature/README.md`
- `plans/in-progress/2024-12-28__gallery-sorting-feature/checklist.md`

**Steps**:
1. [ ] Update README.md:
   - [ ] Change status from "⏳ In Progress" to "✅ Completed"
   - [ ] Add completion date
   - [ ] Update success criteria summary
2. [ ] Update checklist.md:
   - [ ] Mark all tasks as [✅] completed
   - [ ] Add final verification notes
3. [ ] Move plan folder to done:
   ```bash
   git mv plans/in-progress/2024-12-28__gallery-sorting-feature plans/done/
   ```
4. [ ] **COMMIT 18**: "docs: mark gallery sorting feature plan as completed"
5. [ ] **PUSH IMMEDIATELY** (Atomic commit push)

**Acceptance Criteria**:
- [ ] Plan marked as complete
- [ ] Plan moved to done folder
- [ ] All documentation updated
- [ ] Completion date recorded

---

## Phase 6: Final Verification

### Task 6.1: Full Feature Manual Testing (30 min)
**Goal**: Verify all 16 filter+sort combinations work correctly
**Estimated Time**: 30 minutes

**Steps**:
1. [ ] Test all filter + sort combinations (4 filters × 4 sorts = 16):

   **Filter: All Photos**
   - [ ] Sort: Newest First
   - [ ] Sort: Oldest First
   - [ ] Sort: Most Liked
   - [ ] Sort: Most Favorited

   **Filter: My Photos**
   - [ ] Sort: Newest First
   - [ ] Sort: Oldest First
   - [ ] Sort: Most Liked
   - [ ] Sort: Most Favorited

   **Filter: Liked Photos**
   - [ ] Sort: Newest First
   - [ ] Sort: Oldest First
   - [ ] Sort: Most Liked
   - [ ] Sort: Most Favorited

   **Filter: Favorited Photos**
   - [ ] Sort: Newest First
   - [ ] Sort: Oldest First
   - [ ] Sort: Most Liked
   - [ ] Sort: Most Favorited

2. [ ] Test URL persistence:
   - [ ] URL updates when sort changes
   - [ ] Direct URL navigation works
   - [ ] Browser back/forward works
   - [ ] Page refresh maintains sort

3. [ ] Test pagination:
   - [ ] Changing sort resets to page 1
   - [ ] Pagination maintains sort order
   - [ ] All pages show correct sort

4. [ ] Test edge cases:
   - [ ] Empty results (no photos)
   - [ ] Single photo
   - [ ] Photos with same like/favorite count (tiebreaker)
   - [ ] Invalid sortBy URL parameter

5. [ ] Test UI/UX:
   - [ ] Dropdown visual feedback
   - [ ] Loading states
   - [ ] Mobile responsive
   - [ ] Keyboard navigation

6. [ ] Test performance:
   - [ ] Page loads quickly (< 2 seconds)
   - [ ] Smooth transitions
   - [ ] No lag when changing sort

7. [ ] Document any issues found
8. [ ] Take screenshots for documentation

**Acceptance Criteria**:
- [ ] All 16 combinations work correctly
- [ ] No bugs or issues found
- [ ] Performance is acceptable
- [ ] UX is smooth and intuitive

---

### Task 6.2: Full Test Suite Run (20 min)
**Goal**: Confirm all tests pass end-to-end
**Estimated Time**: 20 minutes

**Steps**:
1. [ ] Clean environment:
   - [ ] Stop all running servers
   - [ ] Clear browser cache
   - [ ] Clear test artifacts

2. [ ] Start fresh servers:
   ```bash
   # Terminal 1: Backend
   cd backend/ikp-labs-api && mvn spring-boot:run

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

3. [ ] Run backend tests:
   ```bash
   cd backend/ikp-labs-api
   mvn test
   ```
   - [ ] Verify: All unit tests pass
   - [ ] Verify: All integration tests pass

4. [ ] Run frontend unit tests:
   ```bash
   cd frontend
   npm test
   ```
   - [ ] Verify: All component tests pass
   - [ ] Verify: Coverage > 80%

5. [ ] Run Gherkin/Cucumber tests:
   ```bash
   cd frontend
   npm run test:cucumber
   ```
   - [ ] Verify: 12-15 scenarios pass (100%)
   - [ ] Verify: No flaky tests

6. [ ] Run Playwright E2E tests:
   ```bash
   npx playwright test gallery-sorting
   ```
   - [ ] Verify: 15-20 tests pass (100%)
   - [ ] Verify: No flaky tests

7. [ ] Run Playwright API tests:
   ```bash
   npx playwright test api/gallery
   ```
   - [ ] Verify: 12-15 tests pass (100%)
   - [ ] Verify: Performance < 200ms

8. [ ] Verify total test count:
   - [ ] Backend: 10-12 tests
   - [ ] Frontend Unit: 8-10 tests
   - [ ] Gherkin: 12-15 scenarios
   - [ ] Playwright E2E: 15-20 tests
   - [ ] Playwright API: 12-15 tests
   - [ ] **Total: ~62-80 tests**

9. [ ] Take screenshots of green test results
10. [ ] Celebrate! 🎉

**Acceptance Criteria**:
- [ ] 100% backend test pass rate
- [ ] 100% frontend unit test pass rate
- [ ] 100% Gherkin test pass rate
- [ ] 100% Playwright E2E test pass rate
- [ ] 100% Playwright API test pass rate
- [ ] Total: ~62-80 tests passing
- [ ] Tests run reliably (no flakiness)

---

### Task 6.3: Performance Verification (15 min)
**Goal**: Confirm performance improvements achieved
**Estimated Time**: 15 minutes

**Steps**:
1. [ ] Enable database query logging:
   ```properties
   # application.properties
   spring.jpa.show-sql=true
   logging.level.org.hibernate.SQL=DEBUG
   ```

2. [ ] Test query count per page:
   - [ ] Load gallery page (25 photos)
   - [ ] Count total queries in logs
   - [ ] **Target**: 1 query per page (down from 25)

3. [ ] Test response times:
   ```bash
   # Use curl with timing
   time curl "http://localhost:8081/api/gallery/public?page=0&size=25&sortBy=mostLiked"
   ```
   - [ ] **Target**: < 100ms response time

4. [ ] Test with larger dataset:
   - [ ] Create 100+ test photos
   - [ ] Verify pagination still fast
   - [ ] Verify query optimization holds

5. [ ] Document performance results:
   - [ ] Before: X queries, Y ms
   - [ ] After: 1 query, Z ms
   - [ ] Improvement: % reduction

6. [ ] Disable query logging (production):
   ```properties
   spring.jpa.show-sql=false
   ```

**Acceptance Criteria**:
- [ ] Single query per page (N+1 solved)
- [ ] Response time < 100ms
- [ ] Performance scales with larger datasets
- [ ] 96% query reduction achieved

---

## Atomic Commit Summary

**Expected Commits (18 total)**:
1. [ ] docs: add gallery sorting feature implementation plan
2. [ ] feat(gallery): add sortBy parameter to 4 gallery endpoints
3. [ ] feat(gallery): implement sorting logic in service layer
4. [ ] perf(gallery): optimize queries to solve N+1 problem with JOINs
5. [ ] test(gallery): add backend unit and integration tests for sorting
6. [ ] feat(gallery): create SortingDropdown component
7. [ ] feat(gallery): integrate SortingDropdown and sort state in Gallery page
8. [ ] feat(gallery): add sortBy parameter to all gallery service functions
9. [ ] test(gallery): add frontend unit tests for SortingDropdown
10. [ ] test(gherkin): add BDD scenarios for gallery photo sorting
11. [ ] test(gherkin): implement step definitions for photo sorting scenarios
12. [ ] fix(gherkin): resolve failing photo sorting test scenarios (if needed)
13. [ ] test(e2e): add Playwright tests for gallery sorting feature
14. [ ] test(api): add API tests for gallery sorting endpoints
15. [ ] docs: update API documentation with sortBy parameter
16. [ ] docs: add JSDoc documentation to SortingDropdown component
17. [ ] docs: add user guide for gallery photo sorting
18. [ ] docs: mark gallery sorting feature plan as completed

**Commit Pattern**:
- ✅ Each task = 1 focused commit
- ✅ Push immediately after each commit (atomic push)
- ✅ Clear, descriptive commit messages
- ✅ Easy rollback if needed
- ✅ Good GitHub activity visibility

---

## Success Criteria Summary

### Must Have (P0)
- [ ] **Backend**: All 4 endpoints support sortBy parameter
- [ ] **Backend**: N+1 query problem solved (96% query reduction)
- [ ] **Backend**: All 4 sort options work correctly (newest, oldest, mostLiked, mostFavorited)
- [ ] **Frontend**: SortingDropdown component implemented
- [ ] **Frontend**: Gallery page integrated with sorting
- [ ] **Frontend**: URL-based state management works
- [ ] **Integration**: All 16 filter+sort combinations work
- [ ] **Testing**: ~62-80 tests written and passing (100% pass rate)
  - Backend: 10-12 tests
  - Frontend Unit: 8-10 tests
  - Gherkin: 12-15 scenarios
  - Playwright E2E: 15-20 tests
  - Playwright API: 12-15 tests
- [ ] **Performance**: Query time < 100ms, 1 query per page
- [ ] **No Breaking Changes**: Backward compatible API

### Should Have (P1)
- [ ] **Testing**: No test flakiness (all tests reliable)
- [ ] **Testing**: Test coverage > 80% on new code
- [ ] **Documentation**: API documentation updated
- [ ] **Documentation**: Component JSDoc complete
- [ ] **Documentation**: User guide updated
- [ ] **Accessibility**: Keyboard navigation works
- [ ] **Accessibility**: ARIA attributes present
- [ ] **Mobile**: Responsive design on mobile devices

### Nice to Have (P2)
- [ ] **UX**: Smooth animations/transitions
- [ ] **UX**: Loading states for better feedback
- [ ] **Performance**: Response time < 50ms (stretch goal)
- [ ] **Testing**: Visual regression tests
- [ ] **CI/CD**: Tests integrated into pipeline

### Overall Status: ⏳ IN PROGRESS
**Target**: Complete all P0 and P1 criteria by end of Week 1
**Timeline**: 12-18 hours estimated over Week 1
**Next Steps**: Begin Phase 2 (Backend Implementation)

---

## Notes

### Time Estimates by Phase
- **Phase 1: Planning** - 2 hours ✅ DONE
- **Phase 2: Backend** - 2.5-3 hours
  - Controller: 20 min
  - Service: 30 min
  - Repository: 60 min
  - Testing: 60 min
- **Phase 3: Frontend** - 2.5-3 hours
  - SortingDropdown: 45 min
  - Gallery Page: 30 min
  - Service Functions: 20 min
  - Unit Tests: 60 min
- **Phase 4: E2E Testing** - 4-5 hours
  - Gherkin Scenarios: 45 min
  - Step Definitions: 60 min
  - Fix Issues: 30 min
  - Playwright E2E: 60 min
  - Playwright API: 45 min
- **Phase 5: Documentation** - 1 hour
  - API Docs: 20 min
  - Component Docs: 15 min
  - User Guide: 15 min
  - Plan Completion: 10 min
- **Phase 6: Verification** - 1-1.5 hours
  - Manual Testing: 30 min
  - Full Test Suite: 20 min
  - Performance Check: 15 min

**Total**: 12-18 hours

### Atomic Commit Reminders
- ✅ 1 task = 1 commit + 1 push
- ✅ Explain each commit to user
- ✅ Keep commits focused (single responsibility)
- ✅ Push immediately (GitHub activity visibility)
- ✅ Include root cause analysis in commit messages

### Testing Strategy
- **Test-Driven Development**: Write tests alongside implementation
- **Test Pyramid**: More unit tests, fewer E2E tests
- **No Flakiness**: Use proper waits, no arbitrary sleeps
- **Comprehensive Coverage**: All 16 combinations tested

### Performance Targets
- **Query Count**: 1 query per page (down from 25)
- **Response Time**: < 100ms (stretch: < 50ms)
- **Page Load**: < 2 seconds
- **Query Reduction**: 96% improvement

### Risk Mitigation
- **Backward Compatibility**: sortBy defaults to 'newest'
- **Input Validation**: Whitelist sortBy values
- **Error Handling**: Return 400 for invalid sortBy
- **Rollback Plan**: Each commit is atomic, easy to revert

---

**Checklist Version**: 1.0
**Created**: December 28, 2024
**Status**: ⏳ In Progress - Ready to Begin Phase 2
**Next Task**: Task 2.1 - Add SortBy Parameter to Controller
