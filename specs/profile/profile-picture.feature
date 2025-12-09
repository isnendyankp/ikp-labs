Feature: Profile Picture Management
  As a registered user
  I want to upload and manage my profile picture
  So that I can personalize my account and make it recognizable

  Background:
    Given the user is authenticated with a valid JWT token
    And the user is on the home page

  # Aligns with: ProfileService.uploadProfilePicture()
  # Aligns with: POST /api/profile/upload-picture
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 1
  Scenario: Successfully upload JPEG profile picture
    Given the user has no profile picture
    When the user selects a valid JPEG image file (less than 5MB)
    And submits the upload
    Then the profile picture should be uploaded successfully
    And the new picture should be displayed immediately
    And the picture URL should be saved in the database
    And the default avatar should be replaced with the uploaded image

  # Aligns with: ProfileService.uploadProfilePicture() - PNG support
  # Aligns with: POST /api/profile/upload-picture
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 2
  Scenario: Successfully upload PNG profile picture
    Given the user has no profile picture
    When the user selects a valid PNG image file (less than 5MB)
    And submits the upload
    Then the profile picture should be uploaded successfully
    And the PNG image should be displayed correctly
    And the file should be stored in the backend uploads directory

  # Aligns with: ProfileService.deleteProfilePicture()
  # Aligns with: DELETE /api/profile/picture
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 3
  Scenario: Successfully delete profile picture
    Given the user has an existing profile picture
    When the user clicks the delete button
    And confirms the deletion
    Then the profile picture should be removed
    And the picture file should be deleted from the server
    And the default avatar with initials should be displayed
    And the profile_picture_url in database should be set to null

  # Aligns with: ProfileService.uploadProfilePicture() - replace logic
  # Aligns with: FileStorageService.deleteFile() + uploadFile()
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 9
  Scenario: Replace existing profile picture with new one
    Given the user has an existing profile picture
    When the user uploads a new profile picture
    Then the old picture file should be deleted from the server
    And the new picture should replace the old one
    And only the new picture should be displayed
    And the database should reference only the new picture URL

  # Aligns with: FileStorageService.validateFile() - size validation
  # Aligns with: frontend validation + backend validation
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 7
  Scenario: Reject profile picture larger than 5MB
    Given the user selects an image file larger than 5MB
    When the user attempts to upload
    Then the system should reject the upload
    And an error message should be displayed: "File size exceeds 5MB limit"
    And no file should be uploaded to the server
    And the existing profile picture should remain unchanged

  # Aligns with: FileStorageService.validateFile() - type validation
  # Aligns with: ALLOWED_CONTENT_TYPES check
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 8
  Scenario: Reject non-image file types
    Given the user selects a non-image file (PDF, TXT, DOCX, etc.)
    When the user attempts to upload
    Then the system should reject the upload
    And an error message should be displayed: "Invalid file type. Only JPEG, PNG, GIF are allowed"
    And no file should be uploaded

  # Aligns with: FileStorageService.validateFile() - format validation
  # Aligns with: Supported formats: JPEG, PNG, GIF, WebP
  Scenario: Reject unsupported image formats
    Given the user selects an unsupported image format (BMP, TIFF, SVG)
    When the user attempts to upload
    Then the system should reject the upload
    And an error message should indicate supported formats only
    And the list of supported formats should be: JPEG, PNG, GIF, WebP

  # Aligns with: ProfileController.getProfilePicture()
  # Aligns with: GET /api/profile/picture
  # Aligns with: frontend ProfilePicture component
  Scenario: View current profile picture
    Given the user has an uploaded profile picture
    When the user views their profile on the home page
    Then the profile picture should be displayed
    And the image should load from the correct URL
    And the image should be responsive (fit container)

  # Aligns with: ProfilePicture component - avatar fallback
  # Aligns with: frontend/src/components/ProfilePicture.tsx
  # Aligns with: Initial user state without picture
  Scenario: Display avatar fallback when no picture exists
    Given the user has not uploaded a profile picture
    When the user views their profile
    Then a default avatar with user initials should be displayed
    And the initials should be derived from the user's full name
    And the avatar should have a colored background

  # Aligns with: Spring Security - JWT authentication
  # Aligns with: @PreAuthorize or JWT filter
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 10
  Scenario: Unauthenticated user cannot upload profile picture
    Given the user is not authenticated (no JWT token)
    When the user attempts to access the upload endpoint
    Then the system should return 401 Unauthorized
    And no file should be uploaded
    And the request should be rejected before processing

  # Aligns with: FileStorageService - file persistence
  # Aligns with: backend/uploads/profiles/ directory
  # Aligns with: Database profile_picture_url column
  Scenario: Profile picture persists after logout and login
    Given the user has uploaded a profile picture
    When the user logs out
    And logs back in
    Then the profile picture should still be displayed
    And the picture should load from the same URL
    And the database record should remain unchanged

  # Aligns with: Multiple upload cycles testing
  # Aligns with: tests/e2e/profile-picture.spec.ts - Test 5
  Scenario: Multiple upload and delete cycles work correctly
    Given the user uploads a profile picture
    When the user deletes it
    And uploads a new picture
    And deletes it again
    And uploads a third picture
    Then the final picture should be displayed correctly
    And only the latest picture file should exist on the server
    And previous picture files should be cleaned up

  # Aligns with: User entity update
  # Aligns with: users table - profile_picture_url column
  # Aligns with: Flyway V1 migration
  Scenario: Profile picture URL is saved correctly in database
    Given the user uploads a profile picture
    When the upload completes successfully
    Then the users table should have the profile_picture_url updated
    And the URL should point to the correct file path
    And the URL format should be: /uploads/profiles/{filename}
    And the database record should persist the URL

  # Aligns with: Real-time UI update after upload
  # Aligns with: frontend/src/app/home/page.tsx
  # Aligns with: ProfilePictureUpload component callback
  Scenario: Profile picture updates immediately after upload
    Given the user is viewing the home page
    When the user uploads a new profile picture
    Then the new picture should appear immediately without page refresh
    And the old avatar/picture should be replaced instantly
    And the UI should reflect the change in real-time

  # Aligns with: Error handling in upload flow
  # Aligns with: ProfileService error handling
  # Aligns with: User-friendly error messages
  Scenario: Display helpful error message on upload failure
    Given the user attempts to upload a profile picture
    When the upload fails due to a server error
    Then the user should see a clear error message
    And the message should indicate what went wrong
    And the user should be able to retry the upload
    And the existing profile picture should remain unchanged
