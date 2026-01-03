Feature: Gallery Photo Sorting
  As a registered user
  I want to sort photos in the gallery by different criteria
  So that I can find and view photos in my preferred order (newest, oldest, most liked, most favorited)

  Background:
    Given the user is authenticated with a valid JWT token
    And there are multiple photos available in the gallery with varying metadata

  # Aligns with: GalleryController.getAllPhotos() - sortBy parameter
  # Aligns with: GET /api/gallery/photos?sortBy=newest
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-001
  Scenario: Sort dropdown displays correctly on all gallery pages
    Given the user is on any gallery page (All Photos, My Photos, Public Photos, Liked Photos, Favorited Photos)
    When the page loads
    Then the sort dropdown should be visible above the photo grid
    And the sort dropdown should display the current sort option
    And the sort dropdown should have 4 options: "Newest", "Oldest", "Most Liked", "Most Favorited"

  # Aligns with: GalleryController.getAllPhotos(sortBy="newest")
  # Aligns with: PhotoLikeService.getLikedPhotos(sortBy="newest")
  # Aligns with: PhotoFavoriteService.getFavoritedPhotos(sortBy="newest")
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-002
  Scenario: Sort photos by newest first
    Given the user is on the All Photos gallery page
    And photos exist with different creation dates
    When the user selects "Newest" from the sort dropdown
    Then the photos should be displayed with the most recently created photos first
    And the photos should be ordered by creation date descending
    And the sort dropdown should show "Newest" as selected

  # Aligns with: GalleryController.getAllPhotos(sortBy="oldest")
  # Aligns with: PhotoLikeService.getLikedPhotos(sortBy="oldest")
  # Aligns with: PhotoFavoriteService.getFavoritedPhotos(sortBy="oldest")
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-003
  Scenario: Sort photos by oldest first
    Given the user is on the All Photos gallery page
    And photos exist with different creation dates
    When the user selects "Oldest" from the sort dropdown
    Then the photos should be displayed with the oldest created photos first
    And the photos should be ordered by creation date ascending
    And the sort dropdown should show "Oldest" as selected

  # Aligns with: GalleryController.getAllPhotos(sortBy="mostLiked")
  # Aligns with: PhotoLikeRepository.findAllPublicPhotosWithLikeFavoriteCounts() - mostLiked query
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-004
  Scenario: Sort photos by most liked
    Given the user is on the All Photos gallery page
    And photos exist with different like counts
    When the user selects "Most Liked" from the sort dropdown
    Then the photos should be displayed with the highest like count first
    And the photos should be ordered by like count descending
    And photos with equal like counts should be ordered by newest creation date
    And the sort dropdown should show "Most Liked" as selected

  # Aligns with: GalleryController.getAllPhotos(sortBy="mostFavorited")
  # Aligns with: PhotoFavoriteRepository - favorite count subquery
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-005
  Scenario: Sort photos by most favorited
    Given the user is on the All Photos gallery page
    And photos exist with different favorite counts
    When the user selects "Most Favorited" from the sort dropdown
    Then the photos should be displayed with the highest favorite count first
    And the photos should be ordered by favorite count descending
    And photos with equal favorite counts should be ordered by newest creation date
    And the sort dropdown should show "Most Favorited" as selected

  # Aligns with: URL state management - Next.js router
  # Aligns with: frontend/src/app/gallery/page.tsx - useRouter and searchParams
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-006
  Scenario: Sort preference persists in URL
    Given the user is on the All Photos gallery page
    When the user selects "Most Liked" from the sort dropdown
    Then the URL should update to include "sortBy=mostLiked" parameter
    And the browser address bar should show the updated URL
    When the user copies the URL and opens it in a new tab
    Then the gallery should load with "Most Liked" sort applied
    And the sort dropdown should show "Most Liked" as selected

  # Aligns with: URL state management - page refresh persistence
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-007
  Scenario: Sort preference persists after page refresh
    Given the user has selected "Oldest" from the sort dropdown
    And the URL contains "sortBy=oldest" parameter
    When the user refreshes the page
    Then the photos should still be sorted by oldest first
    And the sort dropdown should show "Oldest" as selected
    And the URL should still contain "sortBy=oldest" parameter

  # Aligns with: Default behavior when no sortBy parameter
  # Aligns with: GalleryController.getAllPhotos() - default sortBy value
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-008
  Scenario: Default sort is newest when no sortBy parameter
    Given the user navigates to the gallery page without a sortBy parameter
    When the page loads
    Then the photos should be sorted by newest first (default)
    And the sort dropdown should show "Newest" as selected
    And the URL should not contain a sortBy parameter (implicit default)

  # Aligns with: GalleryController.getMyPhotos(sortBy parameter)
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-009
  Scenario: Sort works on My Photos page
    Given the user is on the My Photos page
    And the user has uploaded multiple photos
    When the user selects "Oldest" from the sort dropdown
    Then the photos should be sorted by oldest first
    And only the user's own photos should be displayed
    And the URL should contain "sortBy=oldest" parameter

  # Aligns with: GalleryController.getPublicPhotos(sortBy parameter)
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-010
  Scenario: Sort works on Public Photos page
    Given the user is on the Public Photos page
    And there are public photos from multiple users
    When the user selects "Most Favorited" from the sort dropdown
    Then the photos should be sorted by favorite count descending
    And only public photos should be displayed
    And the URL should contain "sortBy=mostFavorited" parameter

  # Aligns with: PhotoLikeService.getLikedPhotos(sortBy parameter)
  # Aligns with: PhotoLikeRepository - sortBy queries
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-011
  Scenario: Sort works on Liked Photos page
    Given the user is on the Liked Photos page
    And the user has liked multiple photos
    When the user selects "Most Liked" from the sort dropdown
    Then the photos should be sorted by like count descending
    And only photos the user has liked should be displayed
    And the URL should contain "sortBy=mostLiked" parameter

  # Aligns with: PhotoFavoriteService.getFavoritedPhotos(sortBy parameter)
  # Aligns with: PhotoFavoriteRepository - sortBy queries
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-012
  Scenario: Sort works on Favorited Photos page
    Given the user is on the Favorited Photos page
    And the user has favorited multiple photos
    When the user selects "Newest" from the sort dropdown
    Then the photos should be sorted by creation date descending
    And only photos the user has favorited should be displayed
    And the URL should contain "sortBy=newest" parameter

  # Aligns with: Combined filter and sort functionality
  # Aligns with: GalleryController - filter and sortBy parameters
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-013
  Scenario: Sort works with filter=all
    Given the user is on the gallery page with "All Photos" filter selected
    When the user selects "Oldest" from the sort dropdown
    Then the URL should contain both "filter=all" and "sortBy=oldest" parameters
    And all public photos should be displayed
    And the photos should be sorted by oldest first
    And the sort dropdown should show "Oldest" as selected
    And the All Photos filter button should be highlighted

  # Aligns with: Combined filter and sort functionality
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-014
  Scenario: Sort works with filter=my-photos
    Given the user is on the gallery page with "My Photos" filter selected
    When the user selects "Most Liked" from the sort dropdown
    Then the URL should contain both "filter=my-photos" and "sortBy=mostLiked" parameters
    And only the user's photos should be displayed
    And the photos should be sorted by like count descending
    And the sort dropdown should show "Most Liked" as selected
    And the My Photos filter button should be highlighted

  # Aligns with: Combined filter and sort functionality
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-015
  Scenario: Sort works with filter=public
    Given the user is on the gallery page with "Public Photos" filter selected
    When the user selects "Most Favorited" from the sort dropdown
    Then the URL should contain both "filter=public" and "sortBy=mostFavorited" parameters
    And only public photos should be displayed
    And the photos should be sorted by favorite count descending
    And the sort dropdown should show "Most Favorited" as selected
    And the Public Photos filter button should be highlighted

  # Aligns with: Combined filter and sort functionality
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-016
  Scenario: Sort works with filter=liked
    Given the user is on the gallery page with "Liked Photos" filter selected
    When the user selects "Newest" from the sort dropdown
    Then the URL should contain both "filter=liked" and "sortBy=newest" parameters
    And only photos the user has liked should be displayed
    And the photos should be sorted by creation date descending
    And the sort dropdown should show "Newest" as selected
    And the Liked Photos filter button should be highlighted

  # Aligns with: Combined filter and sort functionality
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-017
  Scenario: Sort works with filter=favorited
    Given the user is on the gallery page with "Favorited Photos" filter selected
    When the user selects "Oldest" from the sort dropdown
    Then the URL should contain both "filter=favorited" and "sortBy=oldest" parameters
    And only photos the user has favorited should be displayed
    And the photos should be sorted by creation date ascending
    And the sort dropdown should show "Oldest" as selected
    And the Favorited Photos filter button should be highlighted

  # Aligns with: URL parameter preservation
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-018
  Scenario: Changing filter preserves sort preference
    Given the user is on the gallery page with "sortBy=mostLiked" selected
    And the user is viewing "All Photos" filter
    When the user clicks the "My Photos" filter button
    Then the URL should update to "filter=my-photos&sortBy=mostLiked"
    And only the user's photos should be displayed
    And the photos should still be sorted by most liked
    And the sort dropdown should still show "Most Liked" as selected

  # Aligns with: URL parameter preservation
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-019
  Scenario: Changing sort preserves filter preference
    Given the user is on the gallery page with "filter=public" selected
    And the sort dropdown shows "Newest" as selected
    When the user selects "Oldest" from the sort dropdown
    Then the URL should update to "filter=public&sortBy=oldest"
    And only public photos should be displayed
    And the photos should be sorted by oldest first
    And the Public Photos filter button should still be highlighted

  # Aligns with: Empty state handling
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-020
  Scenario: Sort dropdown appears even when no photos exist
    Given the user is on a gallery page with no photos (empty state)
    When the page loads
    Then the sort dropdown should still be visible
    And the sort dropdown should show the selected sort option
    And an empty state message should be displayed below the dropdown

  # Aligns with: Backend JPQL queries - like count ordering
  # Aligns with: PhotoLikeRepository queries
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-021
  Scenario: Photos with equal like counts are sorted by newest creation date
    Given there are 3 photos all with 5 likes
    And Photo A was created at 2025-01-01
    And Photo B was created at 2025-01-02
    And Photo C was created at 2025-01-03
    When the user selects "Most Liked" from the sort dropdown
    Then the photos should be displayed in order: Photo C, Photo B, Photo A
    And the like count should be the same for all 3 photos
    And the secondary sort should be by newest creation date

  # Aligns with: Backend JPQL queries - favorite count ordering
  # Aligns with: PhotoFavoriteRepository queries
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-022
  Scenario: Photos with equal favorite counts are sorted by newest creation date
    Given there are 3 photos all with 10 favorites
    And Photo X was created at 2025-01-01 10:00
    And Photo Y was created at 2025-01-01 11:00
    And Photo Z was created at 2025-01-01 12:00
    When the user selects "Most Favorited" from the sort dropdown
    Then the photos should be displayed in order: Photo Z, Photo Y, Photo X
    And the favorite count should be the same for all 3 photos
    And the secondary sort should be by newest creation date

  # Aligns with: Browser back/forward navigation
  # Aligns with: Next.js router history
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-023
  Scenario: Browser back button restores previous sort state
    Given the user is on the gallery page with "sortBy=newest" selected
    When the user selects "Oldest" from the sort dropdown
    Then the URL should update to "sortBy=oldest"
    When the user clicks the browser back button
    Then the URL should return to "sortBy=newest"
    And the photos should be sorted by newest first
    And the sort dropdown should show "Newest" as selected

  # Aligns with: Browser forward navigation
  # Aligns with: tests/e2e/gallery-sorting.spec.ts - SORT-024
  Scenario: Browser forward button restores next sort state
    Given the user is on the gallery page with "sortBy=newest" selected
    And the user has changed sort to "sortBy=oldest"
    And the user has clicked the browser back button (now at "sortBy=newest")
    When the user clicks the browser forward button
    Then the URL should return to "sortBy=oldest"
    And the photos should be sorted by oldest first
    And the sort dropdown should show "Oldest" as selected

  # Aligns with: Data integrity - N+1 query prevention
  # Aligns with: Optimized JPQL queries with JOINs
  # Aligns with: Performance optimization
  Scenario: Sorting uses optimized queries to prevent N+1 problems
    Given there are 100 photos in the gallery
    When the user selects "Most Liked" from the sort dropdown
    Then the backend should use a single optimized query with JOINs
    And the query should fetch photos with like counts in one database round trip
    And the page should load within acceptable performance limits (under 1 second)
    And no N+1 query issues should occur

  # Aligns with: Error handling - invalid sortBy parameter
  # Aligns with: Backend validation
  Scenario: Invalid sortBy parameter defaults to newest
    Given the user manually edits the URL to "sortBy=invalidOption"
    When the page loads
    Then the backend should default to "newest" sort
    And the photos should be sorted by newest first
    And the sort dropdown should show "Newest" as selected
    And no error should be displayed to the user

  # Aligns with: Accessibility - keyboard navigation
  # Aligns with: WCAG compliance
  Scenario: Sort dropdown is accessible via keyboard
    Given the user is on the gallery page
    When the user tabs to the sort dropdown using the keyboard
    Then the dropdown should receive focus
    When the user presses Enter or Space
    Then the dropdown should open and show all 4 options
    When the user navigates options with arrow keys
    Then the user should be able to select any option
    When the user presses Enter
    Then the selected sort should be applied
    And the photos should re-sort accordingly

  # Aligns with: Mobile responsiveness
  # Aligns with: Responsive design
  Scenario: Sort dropdown works correctly on mobile devices
    Given the user is on a mobile device (viewport width < 768px)
    And the user is on the gallery page
    When the page loads
    Then the sort dropdown should be visible and properly sized
    When the user taps the sort dropdown
    Then the dropdown should open with all 4 options visible
    When the user taps an option
    Then the sort should be applied
    And the dropdown should close
    And the photos should re-sort accordingly
