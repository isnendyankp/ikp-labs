Feature: Photo Privacy Control
  As a registered user
  I want to control the privacy of my photos
  So that I can choose who can view my photos

  Background:
    Given the user is logged in with a valid JWT token

  # TOGGLE PRIVACY SCENARIOS

  # Aligns with: GalleryService.togglePrivacy() - Private to public
  # Aligns with: GalleryController.togglePrivacy() - PUT /api/gallery/photo/{photoId}/toggle-privacy
  # Aligns with: Test Plan SVC-013: Toggle privacy private to public
  # Aligns with: Test Plan E2E-004: Toggle privacy from private to public
  Scenario: Toggle photo from private to public
    Given the user has a private photo
    When the user toggles the photo privacy to public
    Then the photo should become public and appear in public gallery

  # Aligns with: GalleryService.togglePrivacy() - Public to private
  # Aligns with: Test Plan SVC-014: Toggle privacy public to private
  # Aligns with: Test Plan E2E-005: Toggle privacy from public to private
  Scenario: Toggle photo from public to private
    Given the user has a public photo
    When the user toggles the photo privacy to private
    Then the photo should become private and be removed from public gallery

  # Aligns with: GalleryService.togglePrivacy() - Authorization
  # Aligns with: Test Plan SVC-015: Non-owner cannot toggle privacy
  # Aligns with: Test Plan API-015: Non-owner blocked from privacy toggle
  Scenario: Toggle privacy denied for non-owner
    Given another user owns a photo
    When the user attempts to toggle that photo's privacy
    Then the toggle should be denied with unauthorized error

  # Aligns with: GalleryService.updatePhoto() - Privacy via update
  Scenario: Set photo to public during upload
    When the user uploads a photo with public privacy setting
    Then the photo should be public immediately

  # Aligns with: GalleryService.updatePhoto() - Privacy via update
  Scenario: Update photo privacy via metadata update
    Given the user has a private photo
    When the user updates the photo metadata with public privacy setting
    Then the photo should become public

  # VISIBILITY SCENARIOS

  # Aligns with: GalleryService.getPublicPhotos() - Privacy filter
  # Aligns with: Test Plan SVC-006: Only public photos shown in public gallery
  Scenario: Private photos hidden from public gallery
    Given the user has 3 private photos
    When any user views the public gallery
    Then the user's private photos should not be visible

  # Aligns with: GalleryService.getMyPhotos() - Owner can see all
  # Aligns with: Test Plan SVC-004: Owner sees all photos
  Scenario: Owner can view their own private photos
    Given the user has 5 private photos
    When the user views their gallery
    Then all 5 private photos should be visible

  # Aligns with: GalleryService.getPhotoById() - Privacy enforcement
  # Aligns with: Test Plan SVC-009: Non-owner cannot see private photo
  Scenario: Non-owner cannot view private photo directly
    Given another user has a private photo with known ID
    When the user attempts to view that photo by ID
    Then access should be denied with unauthorized error

  # Aligns with: GalleryService.getUserPublicPhotos() - Privacy filter
  # Aligns with: Test Plan API-008: User's public photos only
  Scenario: View user's public photos excludes private
    Given another user has 4 public photos and 6 private photos
    When the user views that user's public gallery
    Then only 4 public photos should be displayed

  # PERSISTENCE SCENARIOS

  # Aligns with: Test Plan E2E-020: Privacy setting persists after page refresh
  Scenario: Privacy setting persists after refresh
    Given the user has toggled a photo to public
    When the user refreshes the page
    Then the photo should remain public

  # Aligns with: GalleryService.togglePrivacy() - Multiple toggles
  Scenario: Toggle privacy multiple times
    Given the user has a private photo
    When the user toggles the photo to public
    And the user toggles the photo back to private
    Then the photo should be private

  # AUTHORIZATION SCENARIOS

  # Aligns with: GalleryController.togglePrivacy() - JWT required
  Scenario: Toggle privacy requires authentication
    Given the user is not authenticated
    When the user attempts to toggle a photo's privacy
    Then the request should be rejected with authentication required error

  # Aligns with: GalleryService.getPhotoById() - Public photo access
  # Aligns with: Test Plan E2E-006: Public photo visible to other users
  Scenario: Public photo visible to all authenticated users
    Given the user has a public photo
    When another authenticated user views that photo
    Then the photo should be visible with full details

  # Aligns with: GalleryService.getPublicPhotos() - Public access
  Scenario: Public gallery accessible to all users
    Given the system has 20 public photos from various users
    When any authenticated user views the public gallery
    Then all 20 public photos should be visible

  # BATCH SCENARIOS

  # Aligns with: Multiple GalleryService.togglePrivacy() calls
  Scenario Outline: Toggle privacy for different photo states
    Given the user has a photo with privacy set to "<initial_privacy>"
    When the user toggles the photo privacy
    Then the photo privacy should become "<final_privacy>"

    Examples:
      | initial_privacy | final_privacy |
      | private         | public        |
      | public          | private       |

  # PRIVACY BADGE SCENARIOS

  # Aligns with: GalleryPhotoResponse - Privacy indicator
  # Aligns with: Test Plan COMP-006 & COMP-007: Public/private badges
  Scenario: Private photo displays privacy badge
    Given the user has a private photo in their gallery
    When the user views their gallery
    Then the photo should display a private badge

  # Aligns with: GalleryPhotoResponse - Privacy indicator
  Scenario: Public photo displays privacy badge
    Given the user has a public photo in their gallery
    When the user views their gallery
    Then the photo should display a public badge
