# Technical Design - API Tests

## Overview

API tests use **REAL PostgreSQL database** and **real HTTP server**. This is the highest level of backend testing before E2E.

## Architecture

```
API Test (REST Assured)
    ↓ Real HTTP Request
Spring Boot Server (mvn spring-boot:run)
    ↓ Real Service Calls
PostgreSQL Database (localhost:5432)
    ↓ Real SQL
Database Tables (users, gallery_photos)
    +
Real File System (uploads/gallery/)
```

## Setup Requirements

### 1. Database Setup
```bash
# PostgreSQL must be running
# Database: registrationform_db
# User: postgres
# Password: (your password)
```

### 2. Server Running
```bash
# Terminal 1: Start server
mvn spring-boot:run

# Terminal 2: Run API tests
mvn test -Dtest=*APITest
```

### 3. Test Configuration

**BaseAPITest.java:**
```java
public class GalleryAPITest {

    private static final String BASE_URI = "http://localhost:8081/api";

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = BASE_URI;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @AfterEach
    void cleanup() {
        // Delete test users: apitest*@test.com
        // Delete test photos
    }
}
```

## Test Pattern

### Upload with Multipart
```java
File photo = new File("src/test/resources/test-photo.jpg");

given()
    .header("Authorization", "Bearer " + token)
    .multiPart("file", photo, "image/jpeg")
    .multiPart("title", "Test Photo")
.when()
    .post("/gallery/upload")
.then()
    .statusCode(201);
```

### Get with Pagination
```java
given()
    .header("Authorization", "Bearer " + token)
    .queryParam("page", 0)
    .queryParam("size", 12)
.when()
    .get("/gallery/my-photos")
.then()
    .statusCode(200)
    .body("photos", hasSize(greaterThanOrEqualTo(0)))
    .body("currentPage", equalTo(0));
```

### Update
```java
given()
    .header("Authorization", "Bearer " + token)
    .contentType(ContentType.JSON)
    .body("{\"title\":\"Updated Title\"}")
.when()
    .put("/gallery/photo/" + photoId)
.then()
    .statusCode(200);
```

### Delete
```java
given()
    .header("Authorization", "Bearer " + token)
.when()
    .delete("/gallery/photo/" + photoId)
.then()
    .statusCode(204);
```

## Key Differences

| Test Type | Database | Server | HTTP |
|-----------|----------|--------|------|
| Unit | None (mocked) | None | None |
| Integration | Mocked (@MockBean) | Spring context | MockMvc (simulated) |
| **API** | **Real PostgreSQL** | **Real (mvn spring-boot:run)** | **Real (REST Assured)** |

## Success Criteria

- Real database operations verified
- Real file uploads working
- JWT authentication working
- Test cleanup preventing pollution
