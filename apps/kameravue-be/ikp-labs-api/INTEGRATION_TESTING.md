# Integration Testing Guide

Panduan lengkap untuk menjalankan dan memahami Integration Tests di Registration Form API.

## 📚 Daftar Isi

- [Apa itu Integration Tests?](#apa-itu-integration-tests)
- [Mengapa Penting?](#mengapa-penting)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prerequisites](#prerequisites)
- [Struktur Integration Tests](#struktur-integration-tests)
- [Cara Menjalankan Tests](#cara-menjalankan-tests)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Apa itu Integration Tests?

Integration Tests adalah testing yang menguji **integrasi antar komponen** dalam aplikasi dengan menggunakan **real dependencies** (database, network, dll).

### Perbedaan dengan Unit Tests

| Aspek            | Unit Tests          | Integration Tests           |
| ---------------- | ------------------- | --------------------------- |
| **Scope**        | Single class/method | Multiple components         |
| **Dependencies** | Mocked/stubbed      | Real (via Testcontainers)   |
| **Database**     | H2 in-memory        | PostgreSQL (Testcontainers) |
| **Speed**        | Very fast (< 1s)    | Slower (~5-10s per test)    |
| **Purpose**      | Test business logic | Test component integration  |
| **When to run**  | Every build         | Before merge/deploy         |

### Analogi Sederhana

**Unit Test** = Test mesin mobil sendirian di workshop

- Cepat, terisolasi, tapi tidak tau apakah cocok dengan mobil

**Integration Test** = Test mobil lengkap di test track

- Lebih lambat, tapi pastikan semua bagian bekerja bersama dengan baik

---

## Mengapa Penting?

Integration tests penting karena:

1. ✅ **Detect Integration Issues**
   - Database compatibility issues
   - JWT authentication flow problems
   - Spring Security configuration errors

2. ✅ **Production-like Environment**
   - Real PostgreSQL database (bukan H2)
   - Real HTTP requests via MockMvc
   - Real Spring Boot context

3. ✅ **Confidence Before Deployment**
   - Verify all components work together
   - Catch issues yang tidak terdeteksi di unit tests

4. ✅ **Documentation**
   - Integration tests = live documentation
   - Show how components interact

---

## Teknologi yang Digunakan

### 1. Testcontainers 🐳

**Apa itu?**
Library Java untuk running Docker containers dalam tests.

**Kenapa?**

- Start PostgreSQL container otomatis
- Isolated database untuk setiap test run
- No manual database setup required

**Contoh Penggunaan:**

```java
@Container
protected static final PostgreSQLContainer<?> postgresContainer =
    new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass");
```

### 2. MockMvc 🎭

**Apa itu?**
Spring Test tool untuk simulate HTTP requests tanpa start real HTTP server.

**Kenapa?**

- Test controller endpoints
- Verify HTTP status codes
- Validate JSON responses
- Faster than real HTTP server

**Contoh Penggunaan:**

```java
mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"test@example.com\",\"password\":\"Test@1234\"}"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.success").value(true));
```

### 3. Spring Boot Test

Provides:

- `@SpringBootTest` - Load full Spring context
- `@AutoConfigureMockMvc` - Auto-configure MockMvc
- `@ActiveProfiles` - Use specific configuration profile

---

## Prerequisites

### 1. Docker Desktop

Integration tests **REQUIRE** Docker untuk running PostgreSQL container.

**Install Docker Desktop:**

- Mac: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Windows: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Linux: `sudo apt-get install docker.io`

**Verify Docker:**

```bash
docker --version
# Should show: Docker version 20.x.x or higher

docker ps
# Should not show error
```

### 2. Maven

Integration tests run via Maven:

```bash
mvn --version
# Should show: Apache Maven 3.8.x or higher
```

### 3. Java 17+

```bash
java -version
# Should show: Java 17 or higher
```

---

## Struktur Integration Tests

### File Structure

```text
backend/ikp-labs-api/
├── src/
│   └── test/
│       ├── java/com/registrationform/api/
│       │   └── integration/
│       │       ├── BaseIntegrationTest.java                     # Base class
│       │       ├── AuthControllerIntegrationTest.java           # Auth tests (12 tests)
│       │       ├── UserControllerIntegrationTest.java           # User CRUD tests (17 tests)
│       │       └── UserProfileControllerIntegrationTest.java    # JWT auth tests (11 tests)
│       │
│       └── resources/
│           └── application-integration.properties               # Test config
│
└── INTEGRATION_TESTING.md  # This file
```

### Base Integration Test Class

`BaseIntegrationTest.java` adalah parent class untuk semua integration tests:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration")
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    protected static final PostgreSQLContainer<?> postgresContainer = ...;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Override datasource dengan Testcontainers connection
    }
}
```

**Benefits:**

- Testcontainers setup shared across all tests
- PostgreSQL container created ONCE (singleton pattern)
- Dynamic datasource configuration
- Consistent test environment

---

## Cara Menjalankan Tests

### 1. Start Docker Desktop

Pastikan Docker Desktop running:

```bash
docker ps
# Harus tidak error
```

### 2. Run All Integration Tests

```bash
cd backend/ikp-labs-api

# Run all integration tests
mvn test -Dtest="*IntegrationTest"
```

### 3. Run Specific Test Class

```bash
# Run hanya AuthController tests
mvn test -Dtest=AuthControllerIntegrationTest

# Run hanya UserController tests
mvn test -Dtest=UserControllerIntegrationTest

# Run hanya UserProfileController tests
mvn test -Dtest=UserProfileControllerIntegrationTest
```

### 4. Run Specific Test Method

```bash
# Run satu test method
mvn test -Dtest=AuthControllerIntegrationTest#testLogin_WithValidCredentials_ShouldReturn200
```

### 5. Run dengan Verbose Output

```bash
# See detailed test output
mvn test -Dtest="*IntegrationTest" -X
```

---

## Test Coverage

### Total Integration Tests: **40 tests**

#### 1. AuthControllerIntegrationTest (12 tests)

**Registration Tests:**

- ✅ Register dengan valid data returns 201 Created
- ✅ Register dengan duplicate email returns 400
- ✅ Register dengan invalid email returns 400
- ✅ Register dengan missing fields returns 400

**Login Tests:**

- ✅ Login dengan valid credentials returns 200 OK
- ✅ Login dengan wrong password returns 401
- ✅ Login dengan non-existent email returns 401

**Token Management Tests:**

- ✅ Refresh valid token returns new token
- ✅ Refresh invalid token returns 401
- ✅ Validate valid token returns true
- ✅ Validate invalid token returns false

**Health Check:**

- ✅ Health check returns 200 OK

**Test File:**

```bash
src/test/java/com/registrationform/api/integration/AuthControllerIntegrationTest.java
```

---

#### 2. UserControllerIntegrationTest (17 tests)

**Create User Tests:**

- ✅ Create user dengan valid data returns 201
- ✅ Reject duplicate email returns 400

**Get All Users Tests:**

- ✅ Get all users returns list
- ✅ Get all users when empty returns empty list

**Get User By ID Tests:**

- ✅ Valid ID returns user data
- ✅ Non-existent ID returns 404

**Update User Tests:**

- ✅ Valid update returns updated user
- ✅ Non-existent ID returns 400
- ✅ Duplicate email on update returns 400

**Delete User Tests:**

- ✅ Valid ID deletes user successfully
- ✅ Non-existent ID returns 404

**Get User By Email Tests:**

- ✅ Valid email returns user
- ✅ Non-existent email returns 404

**Check Email Exists Tests:**

- ✅ Existing email returns true
- ✅ Non-existent email returns false

**Get User Count Tests:**

- ✅ Returns correct count
- ✅ Returns 0 when empty

**Test File:**

```bash
src/test/java/com/registrationform/api/integration/UserControllerIntegrationTest.java
```

---

#### 3. UserProfileControllerIntegrationTest (11 tests)

**Profile Endpoint Tests:**

- ✅ Valid JWT token returns profile (200 OK)
- ✅ No token returns 403 Forbidden
- ✅ Invalid token returns 403
- ✅ Missing Bearer prefix returns 403

**Dashboard Endpoint Tests:**

- ✅ Valid token returns dashboard data
- ✅ No token returns 403
- ✅ Regular user shows correct dashboard

**Settings Endpoint Tests:**

- ✅ Valid token returns settings
- ✅ No token returns 403

**JWT Validation Tests:**

- ✅ Token contains correct user info
- ✅ End-to-end authentication flow works

**Test File:**

```bash
src/test/java/com/registrationform/api/integration/UserProfileControllerIntegrationTest.java
```

---

## What Happens When You Run Tests?

### Step-by-Step Execution Flow

1. **Maven starts test execution**

   ```text
   mvn test -Dtest="*IntegrationTest"
   ```

2. **Testcontainers downloads PostgreSQL image** (first time only)

   ```text
   🐳 Pulling postgres:15 image...
   ✅ Image downloaded
   ```

3. **Testcontainers starts PostgreSQL container**

   ```text
   🐳 Starting PostgreSQL container...
   📦 Container ID: abc123def456
   🌐 Exposed port: 54321 (random)
   ✅ Database ready
   ```

4. **Spring Boot loads test context**

   ```text
   🌱 Loading Spring Boot context...
   📝 Active profile: integration
   💾 Datasource: jdbc:postgresql://localhost:54321/testdb
   ✅ Context loaded
   ```

5. **Tests execute sequentially**

   ```text
   ▶️  Running AuthControllerIntegrationTest...
       ✅ testRegister_WithValidData_ShouldReturn201
       ✅ testLogin_WithValidCredentials_ShouldReturn200
       ... (12 tests total)

   ▶️  Running UserControllerIntegrationTest...
       ✅ testCreateUser_WithValidData_ShouldReturn201
       ... (17 tests total)

   ▶️  Running UserProfileControllerIntegrationTest...
       ✅ testGetProfile_WithValidToken_ShouldReturn200
       ... (11 tests total)
   ```

6. **Testcontainers cleans up**

   ```text
   🧹 Stopping PostgreSQL container...
   🗑️  Removing container abc123def456
   ✅ Cleanup complete
   ```

7. **Maven shows test summary**

   ```text
   Tests run: 40, Failures: 0, Errors: 0, Skipped: 0

   ✅ BUILD SUCCESS
   ```

---

## Troubleshooting

### Problem: "Could not find or load main class"

**Solution:**

```bash
# Clean dan rebuild
mvn clean compile test-compile
```

---

### Problem: "Docker not running"

**Error:**

```text
Could not start container: docker: Cannot connect to the Docker daemon
```

**Solution:**

1. Start Docker Desktop
2. Wait until Docker is ready (whale icon in taskbar)
3. Verify: `docker ps`
4. Run tests again

---

### Problem: "Port already in use"

**Error:**

```text
Address already in use: bind
```

**Solution:**
Testcontainers uses RANDOM ports, tapi kalau masih error:

```bash
# Find dan kill process
lsof -i :5432
kill -9 <PID>

# Or restart Docker
```

---

### Problem: "Connection refused to PostgreSQL"

**Error:**

```text
Connection to localhost:xxxxx refused
```

**Solution:**

1. Check Docker has enough resources:
   - Docker Desktop → Preferences → Resources
   - Memory: minimum 2GB
   - CPUs: minimum 2

2. Clean Docker:

   ```bash
   docker system prune -a
   ```

3. Restart Docker Desktop

---

### Problem: "Tests are too slow"

**Cause:**

- Testcontainers downloads PostgreSQL image first time
- Container startup overhead

**Solutions:**

1. **First time setup** (slow, normal):

   ```bash
   # Pre-pull image
   docker pull postgres:15
   ```

2. **Reuse containers** (already enabled):

   ```java
   .withReuse(true)  // Already in BaseIntegrationTest
   ```

3. **Run specific tests** instead of all:

   ```bash
   # Run only what you're working on
   mvn test -Dtest=AuthControllerIntegrationTest
   ```

---

### Problem: "Out of memory"

**Error:**

```text
java.lang.OutOfMemoryError: Java heap space
```

**Solution:**

```bash
# Increase Maven memory
export MAVEN_OPTS="-Xmx2g"

# Then run tests
mvn test -Dtest="*IntegrationTest"
```

---

## Best Practices

### 1. Test Isolation

**Always clean database before each test:**

```java
@BeforeEach
void setUp() {
    userRepository.deleteAll();  // ✅ Clean slate
}
```

**Why?**

- Tests independent
- Can run in any order
- No data pollution

---

### 2. Use Helper Methods

**Don't repeat yourself:**

```java
// ❌ BAD: Duplicate registration code in every test
@Test
void test1() {
    UserRegistrationRequest req = new UserRegistrationRequest();
    req.setEmail("test@example.com");
    req.setPassword("Test@1234");
    // ... repeat in every test
}

// ✅ GOOD: Reusable helper
private String registerUserAndGetToken(String email) throws Exception {
    UserRegistrationRequest req = new UserRegistrationRequest();
    req.setEmail(email);
    req.setPassword("Test@1234");
    // ... registration logic
    return token;
}

@Test
void test1() {
    String token = registerUserAndGetToken("test@example.com");
    // Use token
}
```

---

### 3. Descriptive Test Names

**Use clear, descriptive names:**

```java
// ❌ BAD
@Test
void test1() { }

// ✅ GOOD
@Test
@DisplayName("POST /api/auth/login - Should return 200 OK with valid credentials")
void testLogin_WithValidCredentials_ShouldReturn200() { }
```

---

### 4. AAA Pattern

**Arrange-Act-Assert:**

```java
@Test
void testExample() {
    // ARRANGE: Setup test data
    String email = "test@example.com";
    String password = "Test@1234";

    // ACT: Perform action
    LoginResponse response = authService.login(email, password);

    // ASSERT: Verify results
    assertEquals(true, response.isSuccess());
    assertNotNull(response.getToken());
}
```

---

### 5. Test Real Scenarios

**Test actual user workflows:**

```java
@Test
@DisplayName("Full user journey: Register → Login → Access Profile")
void testCompleteUserJourney() {
    // 1. Register
    String token = registerUserAndGetToken("journey@test.com");

    // 2. Login
    LoginResponse loginResponse = login("journey@test.com");

    // 3. Access protected endpoint
    ProfileResponse profile = getProfile(token);

    // Verify complete flow works
    assertEquals("journey@test.com", profile.getEmail());
}
```

---

## Running in CI/CD

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'

      - name: Run Integration Tests
        run: |
          cd backend/ikp-labs-api
          mvn test -Dtest="*IntegrationTest"
```

**Note:** GitHub Actions has Docker pre-installed, jadi Testcontainers works out of the box!

---

## Summary

✅ **Integration tests verify component integration**
✅ **Use Testcontainers untuk real PostgreSQL**
✅ **Test dengan MockMvc untuk HTTP simulation**
✅ **40 integration tests covering all controllers**
✅ **Requires Docker Desktop**
✅ **Run with: `mvn test -Dtest="*IntegrationTest"`**

---

## Next Steps

1. **Install Docker Desktop** (if not installed)
2. **Run integration tests** to verify setup
3. **Add more integration tests** when adding new features
4. **Keep integration tests updated** with code changes

---

## Questions?

Kalau ada pertanyaan tentang integration testing:

1. Check test code comments (banyak penjelasan educational)
2. Read Spring Boot Testing docs
3. Check Testcontainers documentation

Happy Testing! 🚀
