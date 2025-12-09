Feature: Photo Likes
  As a registered user
  I want to like and unlike photos
  So that I can show appreciation for content I enjoy and save photos I find interesting

  Background:
    Given the user is authenticated with a valid JWT token
    And there are public photos available in the gallery

  # Aligns with: PhotoLikeService.likePhoto()
  # Aligns with: POST /api/gallery/photo/{photoId}/like
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 1
  Scenario: Successfully like a public photo
    Given the user is viewing a public photo they haven't liked
    When the user clicks the like button
    Then the photo should be marked as liked
    And the like count should increase by 1
    And the like button should show as filled (solid heart icon)
    And the photo should appear in the user's "Liked Photos" page

  # Aligns with: PhotoLikeService.likePhoto() - duplicate check
  # Aligns with: POST /api/gallery/photo/{photoId}/like (409 Conflict)
  # Aligns with: tests/api/photo-likes.api.spec.ts - Test 2
  Scenario: Prevent duplicate likes on the same photo
    Given the user has already liked a photo
    When the user attempts to like the same photo again
    Then the system should prevent the duplicate like
    And the like count should remain unchanged
    And an error message should be returned

  # Aligns with: PhotoLikeService.unlikePhoto()
  # Aligns with: DELETE /api/gallery/photo/{photoId}/like
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 2
  Scenario: Successfully unlike a previously liked photo
    Given the user has liked a photo
    When the user clicks the like button again
    Then the photo should be unmarked as liked
    And the like count should decrease by 1
    And the like button should show as outline (empty heart icon)
    And the photo should be removed from the user's "Liked Photos" page

  # Aligns with: PhotoLikeService.unlikePhoto() - validation
  # Aligns with: DELETE /api/gallery/photo/{photoId}/like (400 Bad Request)
  # Aligns with: tests/api/photo-likes.api.spec.ts - Test 6
  Scenario: Cannot unlike a photo that was never liked
    Given the user is viewing a photo they have not liked
    When the user attempts to unlike the photo
    Then the system should return an error
    And the error message should indicate the photo was not liked

  # Aligns with: PhotoLikeService.getLikedPhotos()
  # Aligns with: GET /api/gallery/liked-photos
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 6
  Scenario: View all liked photos in dedicated page
    Given the user has liked multiple photos
    When the user navigates to the "Liked Photos" page
    Then the user should see all photos they have liked
    And the photos should be ordered by most recently liked first
    And each photo should display the like button as filled
    And pagination should work if there are more than 12 photos

  # Aligns with: PhotoLikeService.getLikedPhotos() - empty state
  # Aligns with: GET /api/gallery/liked-photos (empty response)
  # Aligns with: tests/e2e/photo-likes.spec.ts - empty state
  Scenario: View empty state when no photos are liked
    Given the user has not liked any photos
    When the user navigates to the "Liked Photos" page
    Then the user should see an empty state message
    And the message should say "You haven't liked any photos yet"
    And there should be a suggestion to explore the gallery

  # Aligns with: PhotoLikeController - JWT authentication
  # Aligns with: Spring Security configuration
  # Aligns with: tests/api/photo-likes.api.spec.ts - Test 8
  Scenario: Unauthenticated user cannot like photos
    Given the user is not authenticated (no JWT token)
    When the user attempts to like a photo
    Then the system should return 401 Unauthorized
    And the like should not be saved

  # Aligns with: PhotoLikeService.likePhoto() - privacy validation
  # Aligns with: POST /api/gallery/photo/{photoId}/like (403 Forbidden)
  # Aligns with: tests/api/photo-likes.api.spec.ts - private photo test
  Scenario: Cannot like private photos
    Given there is a private photo in the system
    When the user attempts to like the private photo
    Then the system should return an error
    And the error message should indicate private photos cannot be liked

  # Aligns with: PhotoLikeService.likePhoto() - owner validation
  # Aligns with: POST /api/gallery/photo/{photoId}/like (403 Forbidden)
  # Aligns with: tests/api/photo-likes.api.spec.ts - Test 4
  Scenario: User cannot like their own photos
    Given the user has uploaded a photo
    When the user attempts to like their own photo
    Then the system should return an error
    And the error message should indicate users cannot like their own photos

  # Aligns with: LikeButton component - optimistic updates
  # Aligns with: frontend/src/components/LikeButton.tsx
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 8
  Scenario: Optimistic UI update when liking a photo
    Given the user is viewing a photo they haven't liked
    When the user clicks the like button
    Then the UI should update immediately (within 50ms)
    And the like button should show as filled
    And the like count should increase by 1
    And the API request should complete in the background
    And if the API succeeds, the optimistic state should be confirmed
    And if the API fails, the UI should rollback to the previous state

  # Aligns with: LikeButton component - error handling
  # Aligns with: frontend/src/components/LikeButton.tsx - catch block
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 9
  Scenario: Rollback optimistic update on API failure
    Given the user clicks the like button
    And the API request fails (network error or server error)
    Then the UI should rollback to the previous state
    And the like button should show as outline (unliked)
    And the like count should return to the original value
    And an error message should be displayed to the user
    And the user should be able to retry

  # Aligns with: PhotoLikeRepository.countByPhotoId()
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 4
  # Aligns with: frontend photo cards and detail page
  Scenario: Like count displays correctly across all views
    Given a photo has been liked by 5 different users
    When the user views the photo in the gallery
    Then the like count should display "5"
    When the user views the photo detail page
    Then the like count should display "5"
    When another user likes the photo
    Then the like count should update to "6"
    And the count should be accurate and consistent across all views

  # Aligns with: Persistence and page refresh
  # Aligns with: tests/e2e/photo-likes.spec.ts - Test 5
  # Aligns with: Database persistence via photo_likes table
  Scenario: Liked state persists after page refresh
    Given the user has liked a photo
    When the user refreshes the page
    Then the photo should still show as liked (filled heart)
    And the like count should remain the same
    And the photo should still appear in "Liked Photos" page

  # Aligns with: Database foreign key cascade
  # Aligns with: photo_likes table ON DELETE CASCADE constraint
  # Aligns with: Data integrity tests
  Scenario: Likes are removed when photo is deleted
    Given the user has liked a photo
    And the photo owner deletes the photo
    Then the like should be automatically removed from the database
    And the photo should no longer appear in the user's "Liked Photos" page
    And no orphaned like records should exist

  # Aligns with: Database unique constraint
  # Aligns with: UNIQUE(photo_id, user_id) constraint
  # Aligns with: Data integrity at database level
  Scenario: Database prevents duplicate likes via constraint
    Given a like record exists for a user and photo
    When the system attempts to insert a duplicate like record
    Then the database should reject the insert
    And a unique constraint violation error should be raised
    And the application should handle the error gracefully
