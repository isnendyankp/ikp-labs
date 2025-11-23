# Requirements - API Tests

## Scope

### Gallery API Tests (35-40 tests)

**Prerequisites:**
1. PostgreSQL running locally
2. Server running: `mvn spring-boot:run`
3. Database: `registrationform_db`

**Test Coverage:**

#### Upload Tests (8-10 tests)
- POST /api/gallery/upload - Valid JPEG
- POST /api/gallery/upload - Valid PNG
- POST /api/gallery/upload - File too large (>5MB)
- POST /api/gallery/upload - Invalid type (.pdf)
- POST /api/gallery/upload - Without JWT (401)
- POST /api/gallery/upload - With metadata
- POST /api/gallery/upload - Default privacy (private)
- Verify file saved to disk
- Verify database record created

#### Retrieve Tests (10-12 tests)
- GET /api/gallery/my-photos - Owner sees all
- GET /api/gallery/my-photos - Pagination (page 0, 1, 2)
- GET /api/gallery/my-photos - Empty gallery
- GET /api/gallery/public - Public photos only
- GET /api/gallery/public - Pagination
- GET /api/gallery/user/{userId}/public - User's public photos
- GET /api/gallery/photo/{photoId} - Public photo
- GET /api/gallery/photo/{photoId} - Private by owner
- GET /api/gallery/photo/{photoId} - Private by non-owner (403)
- GET /api/gallery/photo/{photoId} - Not found (404)

#### Update Tests (8-10 tests)
- PUT /api/gallery/photo/{photoId} - Update by owner
- PUT /api/gallery/photo/{photoId} - Update by non-owner (403)
- PUT /api/gallery/photo/{photoId} - Not found (404)
- PUT /api/gallery/photo/{photoId} - Partial update (title only)
- PUT /api/gallery/photo/{photoId} - Partial update (description only)
- PUT /api/gallery/photo/{photoId} - Validation error
- Verify database updated
- Verify updatedAt timestamp changes

#### Delete Tests (5-7 tests)
- DELETE /api/gallery/photo/{photoId} - By owner
- DELETE /api/gallery/photo/{photoId} - By non-owner (403)
- DELETE /api/gallery/photo/{photoId} - Not found (404)
- Verify file deleted from disk
- Verify database record deleted

#### Privacy Tests (4-6 tests)
- PUT /api/gallery/photo/{photoId}/toggle-privacy - Private to public
- PUT /api/gallery/photo/{photoId}/toggle-privacy - Public to private
- Verify private photo hidden from public gallery
- Verify public photo visible in public gallery

### Success Criteria

- All 35-40 tests pass with real database
- Real file operations working
- Authorization enforced
- Database cleanup working
- Test isolation verified

### Test Pattern

```java
@Test
void testUploadPhoto() {
    // ARRANGE: Register and login
    String email = "gallerytest@test.com";
    registerUser(email, "Test@1234");
    String token = loginAndGetToken(email, "Test@1234");

    // ACT: Upload photo
    File photo = new File("src/test/resources/test-photo.jpg");

    given()
        .header("Authorization", "Bearer " + token)
        .multiPart("file", photo)
        .multiPart("title", "Test Photo")
        .multiPart("isPublic", false)
    .when()
        .post("/api/gallery/upload")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
        .body("filePath", notNullValue());

    // VERIFY: Check database
    // Check file exists on disk
}
```

## Out of Scope

- E2E tests (Week 2)
- Unit/Integration tests (Day 1-2)
- Performance testing
