# Photo Favorites Feature - Daily Checklist

**Timeline:** December 19-23, 2024 (Thursday-Monday)
**Goal:** Implement Photo Favorites feature with 32 tests (100% pass rate)

---

## Progress Overview

```
Day 1 (Thu): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10 tasks (0%)
Day 2 (Fri): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10 tasks (0%)
Day 3 (Sat): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10 tasks (0%)
Day 4 (Sun): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10 tasks (0%)
Day 5 (Mon): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10 tasks (0%)

Overall Progress: 0/50 tasks (0%)
```

**Legend:** ⬜ Pending | 🔄 In Progress | ✅ Complete

**Current Status (December 18, 2024):**
- ⏳ **Day 0 (Today):** Planning Complete ✅
- ⏳ **Day 1 (Thu):** Backend Foundation (Database + Gherkin)
- ⏳ **Day 2 (Fri):** Backend APIs + API Tests
- ⏳ **Day 3 (Sat):** Unit + Integration Tests
- ⏳ **Day 4 (Sun):** Frontend Implementation
- ⏳ **Day 5 (Mon):** E2E Tests + Documentation

**Commits Planned:** 10 atomic commits (2 per day)
- Commit #1: ⏳ Database (V4 migration + Entity + Repository)
- Commit #2: ⏳ Gherkin specs
- Commit #3: ⏳ Service + Controller
- Commit #4: ⏳ API Tests
- Commit #5: ⏳ Unit Tests
- Commit #6: ⏳ Integration Tests
- Commit #7: ⏳ FavoriteButton Component
- Commit #8: ⏳ FavoritedPhotosPage
- Commit #9: ⏳ E2E Tests
- Commit #10: ⏳ Documentation

**Tests Planned:** 32 tests total
- ⏳ API Tests: 0/8
- ⏳ Unit Tests: 0/8
- ⏳ Integration Tests: 0/6
- ⏳ E2E Tests: 0/10

---

## Day 1: Thursday, December 19 - Backend Foundation + Gherkin

**Goal:** Database setup + Gherkin specs
**Expected Time:** 6-7 hours
**Target:** Database ready + Gherkin spec complete

### Morning Session (3-4 hours)

#### Backend - Database Setup

- [ ] **Task 1.1:** Create Flyway migration file
  - File: `backend/ikp-labs-api/src/main/resources/db/migration/V4__create_photo_favorites.sql`
  - Copy SQL from technical-design.md
  - Include all constraints and indexes
  - Note: V4 (not V3) - V3 was photo_likes

- [ ] **Task 1.2:** Create PhotoFavorite entity
  - File: `backend/ikp-labs-api/src/main/java/com/registrationform/api/entity/PhotoFavorite.java`
  - Add `@Entity`, `@Table` annotations
  - Add `@UniqueConstraint` for (photo_id, user_id)
  - Add `@ManyToOne` relationships to GalleryPhoto and User
  - Add `@PrePersist` for created_at
  - Similar to PhotoLike but for favorites

- [ ] **Task 1.3:** Create PhotoFavoriteRepository interface
  - File: `backend/ikp-labs-api/src/main/java/com/registrationform/api/repository/PhotoFavoriteRepository.java`
  - Extend `JpaRepository<PhotoFavorite, Long>`
  - Add method: `findByPhotoIdAndUserId()`
  - Add method: `existsByPhotoIdAndUserId()`
  - Add method: `findFavoritedPhotosByUserId()` with @Query
  - Add method: `deleteByPhotoIdAndUserId()`
  - NO countByPhotoId (favorites are private!)

- [ ] **Task 1.4:** Run migration and verify schema
  - Start backend: `cd backend/ikp-labs-api && ./mvnw spring-boot:run`
  - Check logs for Flyway migration success: "V4__create_photo_favorites.sql"
  - Verify table created in PostgreSQL
  - Verify indexes created
  - Verify unique constraint works

**Commit 1:** (Push immediately after completing)
```bash
cd /Users/isnendyankp/Desktop/Programmer/Belajar/Project/Template/IKP-Labs
git add backend/ikp-labs-api/src/main/resources/db/migration/V4__create_photo_favorites.sql
git add backend/ikp-labs-api/src/main/java/com/registrationform/api/entity/PhotoFavorite.java
git add backend/ikp-labs-api/src/main/java/com/registrationform/api/repository/PhotoFavoriteRepository.java
git commit -m "feat(db): add photo_favorites table with migration and repository

- Create V4 Flyway migration for photo_favorites table
- Add PhotoFavorite entity with @ManyToOne relationships
- Add PhotoFavoriteRepository with custom queries
- Include unique constraint on (photo_id, user_id)
- Add indexes for performance optimization
- Privacy by design: no public counter methods"
git push
```

---

### Afternoon Session (3 hours)

#### Documentation - Gherkin Specifications

- [ ] **Task 1.5:** Create Photo Favorites Gherkin spec
  - File: `specs/gallery/photo-favorites.feature`
  - Feature description: "As a user, I want to save photos to favorites..."
  - Background section with Given steps
  - Scenario 1: Favorite a public photo
  - Scenario 2: Unfavorite a photo
  - Scenario 3: View favorited photos page
  - Scenario 4: Favorite own photo (allowed!)
  - Scenario 5: Favorite private photo of others (forbidden)
  - Scenario 6: Prevent duplicate favorites
  - Scenario 7: Optimistic UI updates
  - Scenario 8: Favorites are private
  - Scenario 9: Persist after refresh
  - Scenario 10: Empty state
  - Scenario 11: Pagination works
  - Scenario 12: Works alongside likes
  - Total: 12 scenarios

- [ ] **Task 1.6:** Review and test Gherkin syntax
  - Verify Given-When-Then structure
  - Check for typos and consistency
  - Align with technical design
  - Ensure 1-1-1 rule (1 Given, 1 When, 1 Then per scenario)

**Commit 2:** (Push immediately after completing)
```bash
git add specs/gallery/photo-favorites.feature
git commit -m "docs(gherkin): add spec for photo favorites feature

- Add photo-favorites.feature with 12 BDD scenarios
- Include scenarios for favorite/unfavorite operations
- Test privacy rules (can favorite own photos)
- Test interaction with likes feature
- Follow Given-When-Then structure
- Align with implementation and test plans"
git push
```

---

### Day 1 End-of-Day Checklist

- [ ] All commits pushed to GitHub (2 commits)
- [ ] Database migration successful
- [ ] Entities compile without errors
- [ ] Gherkin spec written and reviewed
- [ ] Tomorrow's tasks previewed

**Day 1 Summary:**
- Database: ✅ Ready
- Entities: ✅ Created
- Repositories: ✅ Created
- Gherkin: ✅ 12 scenarios written
- Commits: ✅ 2 atomic commits pushed

---

## Day 2: Friday, December 20 - Backend APIs + Automated API Tests

**Goal:** Service + Controller + API tests (Playwright automated)
**Expected Time:** 7-8 hours
**Target:** All backend endpoints working + 8 API tests passing

### Morning Session (4 hours)

#### Backend - Service Layer

- [ ] **Task 2.1:** Create PhotoFavoriteService class
  - File: `backend/ikp-labs-api/src/main/java/com/registrationform/api/service/PhotoFavoriteService.java`
  - Add `@Service` annotation
  - Inject repositories via constructor (`@RequiredArgsConstructor`)
  - Method: `favoritePhoto(photoId, userId)`
    - Validate photo exists
    - Privacy check: public OR user is owner (CAN favorite own!)
    - Check not already favorited
    - Save to database
  - Method: `unfavoritePhoto(photoId, userId)`
  - Method: `getFavoritedPhotos(userId, pageable)`
  - Method: `isFavoritedByUser(photoId, userId)`
  - Add `@Transactional` annotations
  - NO public counter method (privacy!)

- [ ] **Task 2.2:** Create PhotoFavoriteController class
  - File: `backend/ikp-labs-api/src/main/java/com/registrationform/api/controller/PhotoFavoriteController.java`
  - Add `@RestController`, `@RequestMapping("/api/gallery")`
  - Add `@CrossOrigin` for localhost:3002
  - Endpoint: `POST /photo/{photoId}/favorite`
  - Endpoint: `DELETE /photo/{photoId}/favorite`
  - Endpoint: `GET /favorited-photos` with pagination
  - Extract user ID from JWT token (never from request!)
  - Return appropriate HTTP status codes
  - Include both like and favorite status in PhotoResponse

- [ ] **Task 2.3:** Update PhotoResponse DTO
  - File: `backend/.../dto/PhotoResponse.java`
  - Add field: `Boolean isFavoritedByCurrentUser`
  - Ensure both `isLikedByCurrentUser` and `isFavoritedByCurrentUser` exist

- [ ] **Task 2.4:** Test endpoints compile and start
  - Start backend: `cd backend/ikp-labs-api && ./mvnw spring-boot:run`
  - Check for compilation errors
  - Verify endpoints registered in logs
  - Check: "Mapped POST [/api/gallery/photo/{photoId}/favorite]"
  - Check: "Mapped DELETE [/api/gallery/photo/{photoId}/favorite]"
  - Check: "Mapped GET [/api/gallery/favorited-photos]"

**Commit 3:** (Push immediately after completing)
```bash
git add backend/ikp-labs-api/src/main/java/com/registrationform/api/service/PhotoFavoriteService.java
git add backend/ikp-labs-api/src/main/java/com/registrationform/api/controller/PhotoFavoriteController.java
git add backend/ikp-labs-api/src/main/java/com/registrationform/api/dto/PhotoResponse.java
git commit -m "feat(backend): add PhotoFavoriteService with business logic

- Create PhotoFavoriteService with favorite/unfavorite/get methods
- Add PhotoFavoriteController with 3 REST endpoints
- Implement privacy rules (can favorite own photos)
- Add JWT authentication for all endpoints
- Update PhotoResponse DTO with isFavoritedByCurrentUser
- Include transaction management and error handling
- No public counter (private bookmarks)"
git push
```

---

### Afternoon Session (3-4 hours)

#### Testing - Playwright API Tests (Automated!)

- [ ] **Task 2.5:** Create Playwright API test file
  - File: `frontend/tests/api/photo-favorites.api.spec.ts`
  - Import Playwright test utilities
  - Setup beforeEach:
    - Create test user 1
    - Create test user 2 (for privacy tests)
    - Create public photo (by user 2)
    - Get auth tokens

- [ ] **Task 2.6:** Write 8 API tests
  - Test 1: `POST /favorite - should favorite photo successfully`
    - Given: Valid photo, valid user
    - When: POST /api/gallery/photo/{id}/favorite
    - Then: 201 Created, photo appears in favorited-photos
  - Test 2: `POST /favorite - should allow favoriting own photo`
    - Given: Photo owner = current user
    - When: POST /favorite
    - Then: 201 Created (SUCCESS - different from likes!)
  - Test 3: `POST /favorite - should prevent duplicate favorite`
    - Given: Already favorited
    - When: POST /favorite again
    - Then: 409 Conflict
  - Test 4: `POST /favorite - should return 404 for invalid photo`
    - Given: Photo ID = 99999
    - When: POST /favorite
    - Then: 404 Not Found
  - Test 5: `POST /favorite - should prevent favoriting private photo of others`
    - Given: Photo is_public = false, owner ≠ current user
    - When: POST /favorite
    - Then: 403 Forbidden
  - Test 6: `DELETE /favorite - should unfavorite photo successfully`
    - Given: Photo is favorited
    - When: DELETE /api/gallery/photo/{id}/favorite
    - Then: 204 No Content
  - Test 7: `GET /favorited-photos - should return only user's favorites (privacy)`
    - Given: User1 favorited 2 photos, User2 favorited 1 photo
    - When: GET /favorited-photos as User1
    - Then: Returns only User1's 2 photos (not User2's)
  - Test 8: `API - should require authentication`
    - Given: No Authorization header
    - When: POST /favorite
    - Then: 401 Unauthorized

- [ ] **Task 2.7:** Run API tests and verify all pass
  - Run: `cd frontend && npx playwright test tests/api/photo-favorites.api.spec.ts`
  - Verify: 8/8 tests passing ✅
  - Check test execution time
  - Fix any failures
  - Ensure database cleanup after tests

**Commit 4:** (Push immediately after completing)
```bash
git add frontend/tests/api/photo-favorites.api.spec.ts
git commit -m "test(api): add automated photo favorites API tests (8 tests)

- Add Playwright API tests with real PostgreSQL database
- Test all 3 endpoints (POST, DELETE, GET /favorited-photos)
- Verify privacy rules (can favorite own photos)
- Test that favorites are private (user-specific)
- Verify status codes and response bodies
- Test error cases (duplicate, not found, unauthorized)
- Replace manual Postman testing with automation
- All 8 tests passing with real database"
git push
```

---

### Day 2 End-of-Day Checklist

- [ ] PhotoFavoriteService implemented and tested
- [ ] PhotoFavoriteController implemented
- [ ] 8 API tests written and passing
- [ ] All commits pushed (2 commits today)
- [ ] Backend fully functional

**Day 2 Summary:**
- Service: ✅ Complete
- Controller: ✅ Complete
- API Tests: ✅ 8/8 passing
- Commits: ✅ 2 atomic commits pushed
- Total API endpoints: 3 working
- Privacy: ✅ Enforced at API level

---

## Day 3: Saturday, December 21 - Unit & Integration Tests

**Goal:** Complete backend testing (Unit + Integration)
**Expected Time:** 6-7 hours
**Target:** 14 backend tests passing (8 unit + 6 integration)

### Morning Session (3-4 hours)

#### Unit Tests - PhotoFavoriteService

- [ ] **Task 3.1:** Create PhotoFavoriteServiceTest class
  - File: `backend/ikp-labs-api/src/test/java/com/registrationform/api/service/PhotoFavoriteServiceTest.java`
  - Add `@ExtendWith(MockitoExtension.class)`
  - Mock: `PhotoFavoriteRepository`, `GalleryPhotoRepository`, `UserRepository`
  - Use `@InjectMocks` for PhotoFavoriteService
  - Use `@Mock` for dependencies

- [ ] **Task 3.2:** Write 8 unit tests
  - Test 1: `testFavoritePhoto_Success()`
    - Mock: Photo exists, is public, not favorited
    - When: favoritePhoto()
    - Verify: save() called once
  - Test 2: `testFavoritePhoto_CanFavoriteOwnPhoto()`
    - Mock: Photo owner_id == current user_id
    - When: favoritePhoto()
    - Verify: save() called once (SUCCESS!)
  - Test 3: `testFavoritePhoto_PhotoNotFound()`
    - Mock: findById returns Optional.empty()
    - When: favoritePhoto()
    - Assert: IllegalArgumentException thrown
  - Test 4: `testFavoritePhoto_PrivatePhotoNotOwner()`
    - Mock: is_public = false, owner_id ≠ user_id
    - When: favoritePhoto()
    - Assert: IllegalArgumentException thrown
  - Test 5: `testFavoritePhoto_AlreadyFavorited()`
    - Mock: existsByPhotoIdAndUserId returns true
    - When: favoritePhoto()
    - Assert: IllegalStateException thrown
  - Test 6: `testUnfavoritePhoto_Success()`
    - Mock: Photo exists, is favorited
    - When: unfavoritePhoto()
    - Verify: deleteByPhotoIdAndUserId() called once
  - Test 7: `testUnfavoritePhoto_NotFavorited()`
    - Mock: existsByPhotoIdAndUserId returns false
    - When: unfavoritePhoto()
    - Assert: IllegalArgumentException thrown
  - Test 8: `testGetFavoritedPhotos_ReturnsUserFavorites()`
    - Mock: findFavoritedPhotosByUserId returns Page with 3 photos
    - When: getFavoritedPhotos()
    - Assert: Returns Page with 3 photos

- [ ] **Task 3.3:** Run unit tests and verify all pass
  - Run: `cd backend/ikp-labs-api && ./mvnw test -Dtest=PhotoFavoriteServiceTest`
  - Verify: 8/8 tests passing ✅
  - Check execution time (should be <100ms)
  - Check test coverage

**Commit 5:** (Push immediately after completing)
```bash
git add backend/ikp-labs-api/src/test/java/com/registrationform/api/service/PhotoFavoriteServiceTest.java
git commit -m "test(unit): add PhotoFavoriteService unit tests (8 tests)

- Test favorite/unfavorite business logic in isolation
- Mock all repository dependencies with Mockito
- Test can favorite own photos (unlike likes)
- Test privacy rules (cannot favorite others' private photos)
- Test validation rules (no duplicates)
- Test error cases with proper exception handling
- 100% code coverage for service layer
- All 8 tests passing in <100ms"
git push
```

---

### Afternoon Session (3 hours)

#### Integration Tests - PhotoFavoriteController

- [ ] **Task 3.4:** Create PhotoFavoriteControllerIntegrationTest class
  - File: `backend/ikp-labs-api/src/test/java/com/registrationform/api/controller/PhotoFavoriteControllerIntegrationTest.java`
  - Add `@WebMvcTest(PhotoFavoriteController.class)`
  - Use `@MockBean` for PhotoFavoriteService, PhotoLikeService, JwtUtil
  - Use `@Autowired MockMvc` for HTTP testing

- [ ] **Task 3.5:** Write 6 integration tests
  - Test 1: `testFavoritePhoto_Returns201Created()`
    - Given: Valid photo ID, valid JWT
    - When: POST /photo/123/favorite
    - Then: 201 Created
  - Test 2: `testFavoritePhoto_Returns404NotFound()`
    - Given: Service throws IllegalArgumentException
    - When: POST /favorite
    - Then: 404 Not Found
  - Test 3: `testFavoritePhoto_Returns401Unauthorized()`
    - Given: No Authorization header
    - When: POST /favorite
    - Then: 401 Unauthorized
  - Test 4: `testUnfavoritePhoto_Returns204NoContent()`
    - Given: Valid photo ID, user has favorited
    - When: DELETE /photo/123/favorite
    - Then: 204 No Content
  - Test 5: `testGetFavoritedPhotos_Returns200WithPhotos()`
    - Given: User has favorited photos
    - When: GET /favorited-photos?page=0&size=12
    - Then: 200 OK with paginated response
  - Test 6: `testGetFavoritedPhotos_Returns200EmptyPage()`
    - Given: User has no favorites
    - When: GET /favorited-photos
    - Then: 200 OK with empty content array

- [ ] **Task 3.6:** Run integration tests and verify all pass
  - Run: `cd backend/ikp-labs-api && ./mvnw test -Dtest=PhotoFavoriteControllerIntegrationTest`
  - Verify: 6/6 tests passing ✅
  - Check HTTP status codes correct

**Commit 6:** (Push immediately after completing)
```bash
git add backend/ikp-labs-api/src/test/java/com/registrationform/api/controller/PhotoFavoriteControllerIntegrationTest.java
git commit -m "test(integration): add PhotoFavoriteController integration tests (6 tests)

- Test Controller + Service interaction with MockMvc
- Test HTTP status codes (201, 204, 200, 401, 404)
- Mock service layer with @MockBean
- Test JWT authentication enforcement
- Test request/response formatting
- All 6 tests passing without real database"
git push
```

---

### Day 3 End-of-Day Checklist

- [ ] 8 unit tests passing
- [ ] 6 integration tests passing
- [ ] All commits pushed (2 commits today)
- [ ] Test coverage report generated
- [ ] Backend testing complete

**Day 3 Summary:**
- Unit Tests: ✅ 8/8 passing
- Integration Tests: ✅ 6/6 passing
- Total Backend Tests: ✅ 22/22 (8 API + 8 Unit + 6 Integration)
- Commits: ✅ 2 atomic commits pushed
- Backend: ✅ Fully tested and ready

---

## Day 4: Sunday, December 22 - Frontend Implementation

**Goal:** FavoriteButton component + FavoritedPhotosPage
**Expected Time:** 7-8 hours
**Target:** Frontend working with optimistic updates

### Morning Session (4 hours)

#### Frontend - API Service & FavoriteButton Component

- [ ] **Task 4.1:** Create photoFavoriteService.ts
  - File: `frontend/src/services/photoFavoriteService.ts`
  - Function: `favoritePhoto(photoId: number): Promise<void>`
    - POST /api/gallery/photo/{photoId}/favorite
    - Get JWT from localStorage
    - Handle errors
  - Function: `unfavoritePhoto(photoId: number): Promise<void>`
    - DELETE /api/gallery/photo/{photoId}/favorite
  - Function: `getFavoritedPhotos(page, size): Promise<any>`
    - GET /api/gallery/favorited-photos
  - Use API_BASE_URL from environment

- [ ] **Task 4.2:** Create FavoriteButton component
  - File: `frontend/src/components/FavoriteButton.tsx`
  - Props: `photoId`, `initialIsFavorited`, `onFavoriteChange`
  - State: `isFavorited`, `isLoading`
  - Handler: `handleFavoriteToggle()` with optimistic update
  - Icon: Star (⭐) from lucide-react
    - Outline when not favorited (gray)
    - Filled when favorited (yellow/gold)
  - Rollback on error
  - Disabled during loading

- [ ] **Task 4.3:** Integrate FavoriteButton into GalleryPhotoCard
  - File: `frontend/src/components/GalleryPhotoCard.tsx`
  - Add FavoriteButton next to LikeButton
  - Pass `photo.isFavoritedByCurrentUser` as prop
  - Both buttons (heart and star) visible
  - Position: Below photo or in action bar

- [ ] **Task 4.4:** Test FavoriteButton in gallery
  - Start frontend: `cd frontend && npm run dev`
  - Start backend: `cd backend/ikp-labs-api && ./mvnw spring-boot:run`
  - Navigate to gallery
  - Click favorite button (star) on a photo
  - Verify: Instant UI update (star fills)
  - Verify: API call succeeds (check Network tab)
  - Test: Unfavorite (star empties)
  - Test: Works independently from Like button

**Commit 7:** (Push immediately after completing)
```bash
git add frontend/src/services/photoFavoriteService.ts
git add frontend/src/components/FavoriteButton.tsx
git add frontend/src/components/GalleryPhotoCard.tsx
git commit -m "feat(ui): add FavoriteButton component with optimistic updates

- Create photoFavoriteService with API methods
- Add FavoriteButton component with star icon
- Implement optimistic UI updates for instant feedback
- Add rollback on error with user notification
- Integrate into GalleryPhotoCard alongside LikeButton
- Use yellow/gold star (different from red heart)
- Prevent double-clicks with loading state"
git push
```

---

### Afternoon Session (3-4 hours)

#### Frontend - Favorited Photos Page

- [ ] **Task 4.5:** Create FavoritedPhotosPage component
  - File: `frontend/src/app/home/favorited-photos/page.tsx`
  - State: `photos`, `currentPage`, `totalPages`, `isLoading`
  - useEffect: Load favorited photos on mount
  - Function: `loadFavoritedPhotos()` calls API
  - Grid layout: Same as gallery (responsive)
  - Empty state: "No favorited photos yet" with star icon
  - Pagination: Show if totalPages > 1

- [ ] **Task 4.6:** Add navigation link to sidebar
  - File: `frontend/src/components/Sidebar.tsx` (or Navigation)
  - Add link: "Favorited Photos" with star icon ⭐
  - Route: `/home/favorited-photos`
  - Position: Below "Liked Photos" link

- [ ] **Task 4.7:** Update TypeScript types
  - File: `frontend/src/types/photo.ts` (if exists)
  - Add `isFavoritedByCurrentUser?: boolean` to Photo interface
  - Ensure both `isLikedByCurrentUser` and `isFavoritedByCurrentUser` defined

- [ ] **Task 4.8:** Test full favorite flow
  - Login to application
  - Go to gallery
  - Favorite 3 photos (click star on each)
  - Navigate to "Favorited Photos" page
  - Verify: All 3 photos appear
  - Unfavorite 1 photo from gallery
  - Refresh Favorited Photos page
  - Verify: Only 2 photos remain
  - Test: Pagination (if you have 12+ favorites)
  - Test: Empty state (unfavorite all)

**Commit 8:** (Push immediately after completing)
```bash
git add frontend/src/app/home/favorited-photos/page.tsx
git add frontend/src/components/Sidebar.tsx
git add frontend/src/types/photo.ts
git commit -m "feat(ui): add FavoritedPhotosPage and integrate favorite functionality

- Create FavoritedPhotosPage with grid layout
- Add navigation link to sidebar/menu
- Implement pagination for favorited photos
- Add empty state with helpful message
- Update TypeScript interfaces for favorites
- Test full favorite/unfavorite flow
- Private collection only visible to user"
git push
```

---

### Day 4 End-of-Day Checklist

- [ ] FavoriteButton component working
- [ ] FavoritedPhotosPage displaying correctly
- [ ] Navigation link added
- [ ] Optimistic updates working
- [ ] All commits pushed (2 commits today)

**Day 4 Summary:**
- FavoriteButton: ✅ Complete
- FavoritedPhotosPage: ✅ Complete
- API Integration: ✅ Working
- Optimistic UI: ✅ Functional
- Commits: ✅ 2 atomic commits pushed
- Frontend: ✅ Fully functional

---

## Day 5: Monday, December 23 - E2E Tests + Documentation

**Goal:** E2E tests + Final polish + Documentation
**Expected Time:** 7-8 hours
**Target:** 10 E2E tests passing + README updated

### Morning Session (4-5 hours)

#### E2E Tests - Full Flow Testing

- [ ] **Task 5.1:** Create photo-favorites.spec.ts
  - File: `frontend/tests/e2e/photo-favorites.spec.ts`
  - Setup beforeEach: Register user, login, navigate to gallery

- [ ] **Task 5.2:** Write 10 E2E tests
  - Test 1: `should favorite photo from gallery view`
    - Click star on photo → Verify star fills → Verify count doesn't show (private)
  - Test 2: `should unfavorite photo from gallery view`
    - Favorite photo → Click star again → Verify star empties
  - Test 3: `should favorite own photo`
    - Upload photo → Click star on own photo → Verify favorited (allowed!)
  - Test 4: `should favorite photo from detail view`
    - Click photo → Open detail → Click star → Verify favorited
  - Test 5: `should persist favorite after page refresh`
    - Favorite photo → Refresh page → Verify star still filled
  - Test 6: `should show favorited photo in Favorited Photos page`
    - Favorite photo → Navigate to "Favorited Photos" → Verify photo appears
  - Test 7: `should handle multiple favorite/unfavorite cycles`
    - Favorite → Unfavorite → Favorite → Unfavorite → Verify final state
  - Test 8: `should show optimistic update`
    - Click star → Verify UI updates instantly (<50ms) → Verify API confirms
  - Test 9: `should work independently from likes (both buttons on same photo)`
    - Like photo (heart) → Favorite same photo (star) → Verify both active
    - Unlike → Verify favorite still active
    - Unfavorite → Verify like not affected
  - Test 10: `should show empty state when no favorites`
    - Navigate to Favorited Photos with no favorites → Verify empty message

- [ ] **Task 5.3:** Run E2E tests and verify all pass
  - Run: `cd frontend && npx playwright test tests/e2e/photo-favorites.spec.ts`
  - Verify: 10/10 tests passing ✅
  - Generate report: `npx playwright show-report`
  - Fix any flaky tests

**Commit 9:** (Push immediately after completing)
```bash
git add frontend/tests/e2e/photo-favorites.spec.ts
git commit -m "test(e2e): add photo favorites E2E tests (10 scenarios)

- Test full user journey through browser
- Verify favorite/unfavorite flows in gallery and detail views
- Test can favorite own photos
- Test optimistic UI updates
- Test persistence across page refreshes
- Test empty state and error handling
- Test independence from likes feature
- All 10 E2E tests passing with Playwright
- Total test suite: 32/32 tests passing"
git push
```

---

### Afternoon Session (2-3 hours)

#### Documentation & Final Polish

- [ ] **Task 5.4:** Update main README.md
  - File: `README.md` (root)
  - Add Photo Favorites to features list
  - Update tech stack section
  - Add screenshots or GIFs
  - Document both Likes and Favorites features

- [ ] **Task 5.5:** Update API documentation
  - File: `docs/api/endpoints.md` (if exists)
  - Document 3 new endpoints:
    - POST /api/gallery/photo/{id}/favorite
    - DELETE /api/gallery/photo/{id}/favorite
    - GET /api/gallery/favorited-photos
  - Include request/response examples

- [ ] **Task 5.6:** Final testing sweep
  - Run all tests: `cd frontend && npx playwright test`
  - Verify: 32/32 tests passing ✅
    - 8 API tests ✅
    - 8 Unit tests ✅
    - 6 Integration tests ✅
    - 10 E2E tests ✅
  - Backend tests: `cd backend/ikp-labs-api && ./mvnw test`
  - Check for any warnings or deprecations

- [ ] **Task 5.7:** Code review and cleanup
  - Remove console.log statements
  - Check for unused imports
  - Verify error handling complete
  - Check accessibility (aria-labels)
  - Verify mobile responsiveness

**Commit 10:** (Push immediately after completing)
```bash
git add README.md
git add docs/api/endpoints.md
git commit -m "docs(readme): update with photo favorites feature

- Add Photo Favorites to features section
- Document API endpoints with examples
- Update tech stack and testing info
- Add screenshots of favorites functionality
- Explain difference between Likes and Favorites
- Final code cleanup and polish
- All 32 tests passing (100% pass rate)"
git push
```

---

### Day 5 End-of-Day Checklist

- [ ] All 10 E2E tests passing
- [ ] Documentation updated
- [ ] All commits pushed (2 commits today)
- [ ] Feature fully complete
- [ ] Ready for demo/LinkedIn post

**Day 5 Summary:**
- E2E Tests: ✅ 10/10 passing
- Total Tests: ✅ 32/32 passing (100%)
- Documentation: ✅ Updated
- Commits: ✅ 2 atomic commits pushed
- Feature: ✅ 100% Complete

---

## Final Summary (December 23, 2024)

### Feature Completion Checklist

- [ ] **Backend** ✅ Complete
  - Database: photo_favorites table
  - Entities: PhotoFavorite
  - Repositories: PhotoFavoriteRepository
  - Services: PhotoFavoriteService
  - Controllers: PhotoFavoriteController
  - 3 API endpoints working

- [ ] **Frontend** ✅ Complete
  - API Service: photoFavoriteService.ts
  - Components: FavoriteButton.tsx
  - Pages: FavoritedPhotosPage
  - Navigation: Link added to sidebar
  - Optimistic updates working

- [ ] **Testing** ✅ Complete (32/32)
  - API Tests: 8/8 passing
  - Unit Tests: 8/8 passing
  - Integration Tests: 6/6 passing
  - E2E Tests: 10/10 passing

- [ ] **Documentation** ✅ Complete
  - Gherkin specs: 12 scenarios
  - API docs updated
  - README updated
  - Planning docs complete

- [ ] **Quality** ✅ Complete
  - No duplicate code
  - Error handling complete
  - Privacy enforced
  - Mobile responsive
  - Accessible (keyboard, screen readers)

### Commits Summary

**Total: 10 atomic commits over 5 days**

1. ✅ feat(db): photo_favorites table
2. ✅ docs(gherkin): favorites spec
3. ✅ feat(backend): service + controller
4. ✅ test(api): 8 API tests
5. ✅ test(unit): 8 unit tests
6. ✅ test(integration): 6 integration tests
7. ✅ feat(ui): FavoriteButton component
8. ✅ feat(ui): FavoritedPhotosPage
9. ✅ test(e2e): 10 E2E tests
10. ✅ docs(readme): feature documentation

**Result:** Consistent GitHub activity (2 commits/day) visible to recruiters! 📈

---

## Optional: Day 6 - LinkedIn Post (Tuesday, December 24)

**Goal:** Professional LinkedIn post showcasing the feature

### LinkedIn Post Content

**Headline:**
🚀 Just shipped Photo Favorites - a privacy-focused bookmarking system for my photo gallery app!

**Body:**
Excited to share my latest feature: Photo Favorites! 📸⭐

**What I Built:**
✅ Private bookmarking system (unlike public "Likes")
✅ Users can save ANY photo - including their own!
✅ 32 automated tests across 4 types (API, Unit, Integration, E2E)
✅ Optimistic UI updates for instant feedback
✅ Works seamlessly alongside the existing Likes feature

**Technical Highlights:**
• Spring Boot + PostgreSQL backend with REST APIs
• React 19 + Next.js 15 frontend
• Playwright for automated testing (no manual Postman!)
• Privacy by design - favorites are 100% private
• Clean separation of concerns (Entity → Repository → Service → Controller)

**Key Learning:**
Building features that work TOGETHER is crucial. Favorites and Likes coexist beautifully - one for public appreciation (heart ❤️), one for private bookmarks (star ⭐).

**Testing Coverage:**
• 8 API tests (with real database)
• 8 Unit tests (isolated business logic)
• 6 Integration tests (controller + service)
• 10 E2E tests (full user journey)

**Result:** 100% test pass rate, production-ready feature! 🎉

#FullStackDevelopment #ReactJS #SpringBoot #Testing #WebDevelopment #SoftwareEngineering #PostgreSQL #Playwright #CleanCode

**Visuals to Include:**
1. Screenshot of FavoriteButton (star icon) next to LikeButton
2. Screenshot of Favorited Photos page
3. GIF of optimistic update (click star → instant fill)
4. Comparison table: Likes vs Favorites
5. Test results: 32/32 passing

---

## Troubleshooting Guide

### Common Issues

**Issue 1: Migration fails with "table already exists"**
- Solution: Check Flyway version table
- Solution: Rename to V5 if V4 already used
- Solution: Drop table and re-run migration

**Issue 2: FavoriteButton not updating UI**
- Check: API endpoint working (Network tab)
- Check: JWT token valid
- Check: Optimistic update logic correct
- Check: State management (useState)

**Issue 3: Tests failing intermittently**
- Solution: Add wait conditions
- Solution: Ensure database cleanup
- Solution: Check for race conditions
- Solution: Increase timeouts if needed

**Issue 4: Can't favorite own photos**
- Check: Service logic allows owner_id == user_id
- Check: Different from PhotoLikeService
- Check: Privacy check only blocks others' private photos

---

## Notes for Implementation

### Key Differences from Likes:

| Aspect | Likes (Week 1) | Favorites (Week 2) |
|--------|---------------|-------------------|
| Purpose | Public appreciation | Private bookmarks |
| Visibility | Public (counter visible) | Private (only user sees) |
| Icon | Heart ❤️ (red) | Star ⭐ (yellow/gold) |
| Can save own photos? | ❌ NO | ✅ YES |
| Public counter? | ✅ YES | ❌ NO |
| Use case | Social engagement | Content organization |

### Privacy Enforcement:

1. **API Level:** User ID from JWT only
2. **Database Level:** No public counter queries
3. **Frontend Level:** No visibility to others
4. **Testing Level:** Verify privacy in API tests

### Code Reuse:

- Entity structure similar to PhotoLike
- Repository pattern same
- Service logic similar (with privacy tweaks)
- Controller pattern same
- Frontend components similar (different icon/color)

### Best Practices:

1. **Atomic Commits:** 1 feature per commit
2. **Push Immediately:** After each commit
3. **Test First:** Verify tests pass before committing
4. **Document:** Update README after feature complete
5. **Review:** Code review before pushing

---

**Ready to start Day 1! Let's build this! 🚀**

Good luck with the implementation! You got this! 💪
