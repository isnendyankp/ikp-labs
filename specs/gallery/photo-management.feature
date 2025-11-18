Feature: Photo Management
  As a registered user
  I want to view, edit, and delete photos
  So that I can manage my photo gallery effectively

  Background:
    Given the user is logged in with a valid JWT token

  # VIEW SCENARIOS

  # Aligns with: GalleryService.getMyPhotos() - Owner view
  # Aligns with: GalleryController.getMyPhotos() - GET /api/gallery/my-photos
  # Aligns with: Test Plan E2E-009: My Gallery shows all own photos
  Scenario: View my gallery shows all owned photos
    Given the user has 5 public photos and 3 private photos
    When the user views their gallery
    Then all 8 photos should be displayed with privacy badges

  # Aligns with: GalleryService.getPublicPhotos() - Public view
  # Aligns with: GalleryController.getPublicPhotos() - GET /api/gallery/public
  # Aligns with: Test Plan E2E-010: Public Gallery shows only public photos
  Scenario: View public gallery shows only public photos
    Given the system has 10 public photos and 5 private photos from various users
    When the user views the public gallery
    Then only 10 public photos should be displayed

  # Aligns with: GalleryService.getUserPublicPhotos() - User's public photos
  # Aligns with: GalleryController.getUserPublicPhotos() - GET /api/gallery/user/{userId}/public
  # Aligns with: Test Plan API-008: Get user's public photos
  Scenario: View specific user's public photos
    Given another user has 5 public photos and 3 private photos
    When the user views that user's public gallery
    Then only 5 public photos should be displayed

  # Aligns with: GalleryService.getPhotoById() - Public photo access
  # Aligns with: GalleryController.getPhotoById() - GET /api/gallery/photo/{photoId}
  # Aligns with: Test Plan SVC-010: Anyone can see public photo
  Scenario: View public photo detail by any user
    Given another user has a public photo
    When the user views that photo's details
    Then the photo details should be displayed successfully

  # Aligns with: GalleryService.getPhotoById() - Owner can view private
  # Aligns with: Test Plan SVC-008: Owner can see private photo
  Scenario: View own private photo detail
    Given the user has a private photo
    When the user views that photo's details
    Then the photo details should be displayed successfully

  # Aligns with: GalleryService.getPhotoById() - Unauthorized access
  # Aligns with: Test Plan SVC-009: Non-owner cannot see private photo
  Scenario: View private photo denied for non-owner
    Given another user has a private photo
    When the user attempts to view that photo's details
    Then access should be denied with unauthorized error

  # PAGINATION SCENARIOS

  # Aligns with: GalleryController.getMyPhotos() - Pagination
  # Aligns with: Test Plan E2E-012: Pagination works in My Gallery
  Scenario: View my gallery with pagination
    Given the user has 25 photos
    When the user views page 1 of their gallery with 20 photos per page
    Then 20 photos should be displayed with pagination controls showing 2 pages

  # Aligns with: GalleryController.getPublicPhotos() - Pagination
  # Aligns with: Test Plan E2E-013: Pagination works in Public Gallery
  Scenario: View public gallery with pagination
    Given the system has 50 public photos
    When the user views page 1 of the public gallery with 20 photos per page
    Then 20 photos should be displayed with pagination controls showing 3 pages

  # UPDATE SCENARIOS

  # Aligns with: GalleryService.updatePhoto() - Owner can update
  # Aligns with: GalleryController.updatePhoto() - PUT /api/gallery/photo/{photoId}
  # Aligns with: Test Plan SVC-011: Owner can update photo
  # Aligns with: Test Plan E2E-011: Edit photo title and description
  Scenario: Update photo title and description by owner
    Given the user owns a photo with title "Old Title"
    When the user updates the photo with title "New Title" and description "New Description"
    Then the photo should be updated with the new title and description

  # Aligns with: GalleryService.updatePhoto() - Partial update
  Scenario: Update photo title only
    Given the user owns a photo
    When the user updates only the photo title
    Then the photo title should be updated without changing other fields

  # Aligns with: GalleryService.updatePhoto() - Partial update
  Scenario: Update photo description only
    Given the user owns a photo
    When the user updates only the photo description
    Then the photo description should be updated without changing other fields

  # Aligns with: GalleryService.updatePhoto() - Authorization
  # Aligns with: Test Plan SVC-012: Non-owner cannot update photo
  # Aligns with: Test Plan E2E-018: Cannot edit other user's photo
  Scenario: Update photo denied for non-owner
    Given another user owns a photo
    When the user attempts to update that photo
    Then the update should be denied with unauthorized error

  # Aligns with: GalleryService.updatePhoto() - Photo not found
  Scenario: Update non-existent photo
    When the user attempts to update a photo that does not exist
    Then the update should fail with photo not found error

  # DELETE SCENARIOS

  # Aligns with: GalleryService.deletePhoto() - Owner can delete
  # Aligns with: GalleryController.deletePhoto() - DELETE /api/gallery/photo/{photoId}
  # Aligns with: Test Plan SVC-016: Owner can delete photo
  # Aligns with: Test Plan E2E-007: Delete photo successfully
  Scenario: Delete photo by owner
    Given the user owns a photo
    When the user deletes the photo
    Then the photo should be removed from the gallery and filesystem

  # Aligns with: GalleryService.deletePhoto() - Authorization
  # Aligns with: Test Plan SVC-017: Non-owner cannot delete photo
  # Aligns with: Test Plan E2E-017: Cannot delete other user's photo
  Scenario: Delete photo denied for non-owner
    Given another user owns a photo
    When the user attempts to delete that photo
    Then the delete should be denied with unauthorized error

  # Aligns with: GalleryService.deletePhoto() - Photo not found
  # Aligns with: Test Plan API-018: Photo not found
  Scenario: Delete non-existent photo
    When the user attempts to delete a photo that does not exist
    Then the delete should fail with photo not found error

  # Aligns with: Test Plan E2E-008: Cancel delete keeps photo
  Scenario: Cancel photo deletion
    Given the user owns a photo
    When the user cancels the deletion
    Then the photo should remain in the gallery

  # PERSISTENCE SCENARIOS

  # Aligns with: Test Plan E2E-019: Photos persist after page refresh
  Scenario: Photos persist after session
    Given the user has uploaded a photo
    When the user refreshes the gallery page
    Then the photo should still be visible in the gallery

  # Aligns with: GalleryService.getMyPhotos() - Empty gallery
  Scenario: View empty gallery
    Given the user has no photos
    When the user views their gallery
    Then an empty gallery message should be displayed
