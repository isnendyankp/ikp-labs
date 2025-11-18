Feature: Photo Upload
  As a registered user
  I want to upload photos to my gallery
  So that I can share my memories with others or keep them private

  Background:
    Given the user is logged in with a valid JWT token

  # Aligns with: GalleryService.uploadPhoto() - Happy path
  # Aligns with: GalleryController.uploadPhoto() - POST /api/gallery/upload
  # Aligns with: Test Plan E2E-001: Upload single photo successfully
  Scenario: Upload photo with valid JPEG file
    When the user uploads a valid JPEG photo with title and description
    Then the photo should be saved successfully with default private setting

  # Aligns with: GalleryService.uploadPhoto() - Happy path with PNG
  # Aligns with: Test Plan E2E-001: Upload single photo successfully
  Scenario: Upload photo with valid PNG file
    When the user uploads a valid PNG photo with metadata
    Then the photo should be saved successfully with correct metadata

  # Aligns with: FileStorageService.validateGalleryPhoto() - Invalid file type
  # Aligns with: Test Plan E2E-015: Reject invalid file format
  Scenario Outline: Upload rejected for invalid file types
    When the user attempts to upload a file with extension "<extension>"
    Then the upload should be rejected with invalid file type error

    Examples:
      | extension |
      | .pdf      |
      | .txt      |
      | .docx     |
      | .mp4      |

  # Aligns with: FileStorageService.validateGalleryPhoto() - File too large
  # Aligns with: Test Plan E2E-014: Reject file too large
  Scenario: Upload rejected for oversized file
    When the user attempts to upload a photo larger than 5MB
    Then the upload should be rejected with file size exceeded error

  # Aligns with: GalleryService.uploadPhoto() - Validation
  # Aligns with: Test Plan: Validation tests
  Scenario: Upload photo with title only
    When the user uploads a photo with title but no description
    Then the photo should be saved successfully without description

  # Aligns with: GalleryService.uploadPhoto() - Validation
  Scenario: Upload photo with description only
    When the user uploads a photo with description but no title
    Then the photo should be saved successfully without title

  # Aligns with: GalleryService.uploadPhoto() - Default privacy
  # Aligns with: Test Plan E2E-001: Photo is marked as Private by default
  Scenario: Upload photo without specifying privacy setting
    When the user uploads a photo without privacy setting
    Then the photo should default to private visibility

  # Aligns with: GalleryService.uploadPhoto() - Empty file validation
  # Aligns with: FileStorageService.validateGalleryPhoto() - Null file
  Scenario: Upload rejected for empty file
    When the user attempts to upload an empty file
    Then the upload should be rejected with empty file error

  # Aligns with: GalleryService.uploadPhoto() - File storage
  # Aligns with: FileStorageService.saveGalleryPhoto() - User subdirectory
  # Aligns with: Test Plan FILE-001: Save gallery photo with user subdirectory
  Scenario: Upload photo creates user-specific directory
    When the user uploads their first photo
    Then the photo should be stored in a user-specific directory

  # Aligns with: GalleryController.uploadPhoto() - Success message
  # Aligns with: Test Plan E2E-001: Success message shown
  Scenario: Upload photo displays success message
    When the user successfully uploads a photo
    Then a success message should be displayed to the user

  # Aligns with: Test Plan E2E-003: Upload with title and description
  Scenario: Upload photo with complete metadata
    When the user uploads a photo with title "Summer Vacation 2025" and description "Family trip to the beach"
    Then the photo should be saved with the specified title and description
