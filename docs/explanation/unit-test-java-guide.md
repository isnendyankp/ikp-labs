# Unit Test Java - Panduan Lengkap untuk Pemula

## 📚 Apa itu Unit Test?

### Definisi Sederhana

**Unit Test** adalah tes kecil untuk setiap bagian kecil (unit) dari program Anda.

### Analogi Mudah Dipahami

#### Analogi 1: Tes Matematika

```text
Test 1: 2 + 2 = 4 ✅ (benar)
Test 2: 5 - 3 = 2 ✅ (benar)
Test 3: 10 / 0 = ??? ❌ (error!)
```

Setiap baris di atas = **Unit Test**

#### Analogi 2: Quality Control Pabrik

Bayangkan pabrik mobil:

- ✅ Test mesin: Nyala atau tidak?
- ✅ Test rem: Berfungsi atau tidak?
- ✅ Test lampu: Menyala atau tidak?
- ✅ Test AC: Dingin atau tidak?

Setiap komponen di-test sendiri-sendiri = **Unit Testing**

#### Analogi 3: Recipe Testing

Anda bikin kue:

- ✅ Test: 200g tepung + 100g gula = adonan pas?
- ✅ Test: Panggang 180°C selama 30 menit = matang?
- ✅ Test: Tambah garam terlalu banyak = gosong? ❌

---

## 🎯 Mengapa Perlu Unit Test?

### 1. **Deteksi Bug Lebih Cepat** 🐛

```java
// Tanpa test: Bug baru ketahuan saat user pakai (TERLAMBAT!)
// Dengan test: Bug ketahuan sebelum deploy (CEPAT!)
```

### 2. **Dokumentasi Hidup** 📖

```java
// Test = dokumentasi yang selalu update
// Orang lain baca test = tahu cara pakai code Anda
```

### 3. **Refactoring Aman** 🔧

```java
// Mau ubah code? Run test dulu!
// Kalau test pass = aman! Kalau fail = ada yang rusak!
```

### 4. **Confidence** 💪

```java
// Dengan test: YAKIN code bekerja
// Tanpa test: HARAP-HARAP CEMAS
```

### 5. **Hemat Waktu** ⏰

```java
// Test otomatis = detik
// Test manual = menit/jam
// Bug di production = hari/minggu!
```

---

## 🧪 Anatomi Unit Test (AAA Pattern)

### Pattern AAA

Setiap test mengikuti 3 langkah:

```java
@Test
void testExample() {
    // 1. ARRANGE (Setup)
    // Siapkan data dan kondisi

    // 2. ACT (Execute)
    // Jalankan method yang mau di-test

    // 3. ASSERT (Verify)
    // Cek hasilnya benar atau tidak
}
```

### Contoh Real

```java
@Test
void testLogin_ValidCredentials_ShouldReturnToken() {
    // ============================================
    // 1. ARRANGE (Setup)
    // ============================================
    LoginRequest request = new LoginRequest();
    request.setEmail("test@example.com");
    request.setPassword("password123");

    // Mock: User ada di database
    when(userRepository.findByEmail("test@example.com"))
        .thenReturn(Optional.of(mockUser));

    // ============================================
    // 2. ACT (Execute)
    // ============================================
    LoginResponse response = authService.login(request);

    // ============================================
    // 3. ASSERT (Verify)
    // ============================================
    assertNotNull(response);
    assertNotNull(response.getToken());
    assertEquals("test@example.com", response.getEmail());
}
```

---

## 🛠️ Tools untuk Unit Test Java

### 1. **JUnit 5** - Framework Testing

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

**Fungsi:** Framework untuk menulis dan menjalankan test

### 2. **Mockito** - Mocking Framework

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
```

**Fungsi:** Membuat "fake objects" untuk testing

---

## 🎭 Mock vs Real Object

### Apa itu Mock?

#### Mock: Objek palsu untuk testing

### Analogi: Test Mesin Mobil

```text
Skenario: Anda mau test MESIN mobil

TANPA MOCK (Test real object):
❌ Butuh ban asli
❌ Butuh AC asli
❌ Butuh setir asli
❌ Butuh bensin asli
❌ MAHAL & RIBET!

DENGAN MOCK (Test with fake objects):
✅ Pakai ban dummy
✅ Pakai AC dummy
✅ Pakai setir dummy
✅ FOKUS TEST MESIN SAJA!
✅ MURAH & CEPAT!
```

### Di Unit Test Java

```java
// REAL OBJECT (yang mau kita test)
@InjectMocks
private AuthService authService;  // ← Test ini!

// MOCK OBJECTS (dummy dependencies)
@Mock
private UserRepository userRepository;  // ← Database palsu
@Mock
private PasswordEncoder passwordEncoder;  // ← Password checker palsu
@Mock
private JwtUtil jwtUtil;  // ← Token generator palsu
```

### Mengapa Pakai Mock?

1. **Tidak butuh database real** - Lebih cepat!
2. **Tidak butuh network** - Offline tetap bisa test!
3. **Control penuh** - Bisa simulasi error
4. **Fokus** - Test 1 unit saja

---

## 📝 Contoh Unit Test di Project Anda

### File Structure

```text
backend/ikp-labs-api/
├── src/main/java/
│   └── com/registrationform/api/
│       ├── controller/
│       ├── service/
│       │   └── AuthService.java         ← Code yang mau di-test
│       └── repository/
└── src/test/java/
    └── com/registrationform/api/
        └── service/
            └── AuthServiceTest.java     ← Unit test file
```

### Test Cases yang Sudah Dibuat

File: [`AuthServiceTest.java`](../../backend/ikp-labs-api/src/test/java/com/registrationform/api/service/AuthServiceTest.java)

#### Test 1: Login dengan Valid Credentials ✅

```java
@Test
void testLogin_ValidCredentials_ShouldReturnSuccessWithToken()
```

**Skenario:**

- Email: <test@example.com> (ada di database)
- Password: password123 (benar)
- **Harapan:** Login berhasil, dapat JWT token

**Test:**

```java
// Setup mock data
when(userRepository.findByEmail("test@example.com"))
    .thenReturn(Optional.of(mockUser));
when(passwordEncoder.matches("password123", hashedPassword))
    .thenReturn(true);

// Execute
LoginResponse response = authService.login(request);

// Verify
assertNotNull(response.getToken());
assertEquals("test@example.com", response.getEmail());
```

#### Test 2: Login dengan Email Tidak Terdaftar ❌

```java
@Test
void testLogin_EmailNotFound_ShouldThrowException()
```

**Skenario:**

- Email: <notfound@example.com> (tidak ada di database)
- **Harapan:** Throw exception

#### Test 3: Login dengan Password Salah ❌

```java
@Test
void testLogin_WrongPassword_ShouldThrowException()
```

**Skenario:**

- Email: <test@example.com> (ada)
- Password: wrongpassword (salah)
- **Harapan:** Throw exception

#### Test 4: Register User Baru ✅

```java
@Test
void testRegister_NewUser_ShouldSaveSuccessfully()
```

**Skenario:**

- Email: <newuser@example.com> (belum ada)
- Data lengkap dan valid
- **Harapan:** User tersimpan di database

#### Test 5: Register dengan Email Duplicate ❌

```java
@Test
void testRegister_DuplicateEmail_ShouldThrowException()
```

**Skenario:**

- Email: <existing@example.com> (sudah ada)
- **Harapan:** Throw exception

---

## 🚀 Cara Menjalankan Unit Test

### 1. Dari Command Line (Maven)

```bash
# Run semua test
mvn test

# Run test specific class
mvn test -Dtest=AuthServiceTest

# Run test specific method
mvn test -Dtest=AuthServiceTest#testLogin_ValidCredentials_ShouldReturnSuccessWithToken

# Run dengan verbose output
mvn test -X

# Skip test (untuk build production)
mvn install -DskipTests
```

### 2. Dari IDE (IntelliJ IDEA)

```text
1. Buka file AuthServiceTest.java
2. Right click di dalam file
3. Pilih "Run 'AuthServiceTest'"

Atau:
1. Klik icon ▶️ di sebelah @Test
2. Pilih "Run" atau "Debug"
```

### 3. Dari IDE (VS Code)

```text
1. Install extension: "Test Runner for Java"
2. Klik icon "Testing" di sidebar
3. Klik ▶️ untuk run test
```

---

## 📊 Membaca Test Results

### Test Berhasil (GREEN) ✅

```text
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.registrationform.api.service.AuthServiceTest

✅ Test 1 PASSED: Login dengan valid credentials berhasil!
✅ Test 2 PASSED: Login dengan email tidak ada throw exception!
✅ Test 3 PASSED: Login dengan password salah throw exception!
✅ Test 4 PASSED: Register user baru berhasil!
✅ Test 5 PASSED: Register dengan email duplicate gagal!

Tests run: 5, Failures: 0, Errors: 0, Skipped: 0

[INFO] BUILD SUCCESS
```

**Artinya:** Semua test pass! Code bekerja dengan benar! 🎉

### Test Gagal (RED) ❌

```text
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.registrationform.api.service.AuthServiceTest

❌ Test 1 FAILED: Expected token but got null!

Tests run: 5, Failures: 1, Errors: 0, Skipped: 0

[ERROR] BUILD FAILURE
```

**Artinya:** Ada 1 test gagal. Perlu fix bug! 🐛

---

## 🎓 JUnit Annotations

### Annotation Penting

```java
@Test
// Menandai method sebagai test case
void testExample() { }

@BeforeEach
// Dijalankan SEBELUM setiap @Test
void setUp() { }

@AfterEach
// Dijalankan SETELAH setiap @Test
void tearDown() { }

@BeforeAll
// Dijalankan SEKALI sebelum semua test
static void setUpAll() { }

@AfterAll
// Dijalankan SEKALI setelah semua test
static void tearDownAll() { }

@DisplayName("Test Login Feature")
// Nama test yang lebih readable
void testLogin() { }

@Disabled
// Skip test ini (jangan jalankan)
void testNotReady() { }

@Tag("integration")
// Kategorikan test (bisa filter saat run)
void testIntegration() { }
```

---

## 🧰 Mockito Cheat Sheet

### Setup Mock Behavior

```java
// When method dipanggil, return nilai tertentu
when(mockObject.method(param)).thenReturn(value);

// When method dipanggil, throw exception
when(mockObject.method(param)).thenThrow(new RuntimeException());

// When method dipanggil dengan ANY parameter
when(mockObject.method(any())).thenReturn(value);
when(mockObject.method(anyString())).thenReturn(value);
when(mockObject.method(anyInt())).thenReturn(value);
```

### Verify Method Calls

```java
// Verify method dipanggil
verify(mockObject).method(param);

// Verify method dipanggil N kali
verify(mockObject, times(3)).method(param);

// Verify method TIDAK dipanggil
verify(mockObject, never()).method(param);

// Verify method dipanggil minimal 1 kali
verify(mockObject, atLeastOnce()).method(param);

// Verify method dipanggil maksimal 2 kali
verify(mockObject, atMost(2)).method(param);
```

---

## ✅ JUnit Assertions

### Basic Assertions

```java
// Check value sama
assertEquals(expected, actual);
assertEquals(expected, actual, "Error message");

// Check value tidak sama
assertNotEquals(expected, actual);

// Check true/false
assertTrue(condition);
assertFalse(condition);

// Check null
assertNull(object);
assertNotNull(object);

// Check sama instance
assertSame(expected, actual);

// Check array sama
assertArrayEquals(expectedArray, actualArray);

// Check exception
assertThrows(Exception.class, () -> {
    // code that should throw exception
});
```

### Advanced Assertions

```java
// Multiple assertions (semua harus pass)
assertAll(
    () -> assertEquals(expected1, actual1),
    () -> assertEquals(expected2, actual2),
    () -> assertNotNull(actual3)
);

// Check timeout
assertTimeout(Duration.ofSeconds(1), () -> {
    // code should complete within 1 second
});
```

---

## 🎯 Best Practices

### 1. Naming Convention

```java
// GOOD ✅
@Test
void testLogin_ValidCredentials_ShouldReturnToken()

// Pattern: test[MethodName]_[Scenario]_[ExpectedResult]

// BAD ❌
@Test
void test1()
```

### 2. Test Independence

```java
// GOOD ✅
@Test
void testA() {
    // Standalone test
    // Tidak bergantung pada testB
}

@Test
void testB() {
    // Standalone test
    // Tidak bergantung pada testA
}

// BAD ❌
// testB bergantung pada testA
```

### 3. Test Scope

```java
// GOOD ✅
@Test
void testCalculate_PositiveNumbers_ShouldReturnSum() {
    // Test 1 scenario saja
    assertEquals(5, calculator.add(2, 3));
}

// BAD ❌
@Test
void testAllCalculations() {
    // Test terlalu banyak dalam 1 test
    assertEquals(5, calculator.add(2, 3));
    assertEquals(2, calculator.subtract(5, 3));
    assertEquals(6, calculator.multiply(2, 3));
    assertEquals(2, calculator.divide(6, 3));
}
```

### 4. Mock External Dependencies

```java
// GOOD ✅
@Mock
private UserRepository userRepository;  // Mock database

@Mock
private EmailService emailService;  // Mock external API

// BAD ❌
// Pakai database real dalam unit test
```

### 5. Clear Error Messages

```java
// GOOD ✅
assertEquals(expected, actual, "Token should not be null after successful login");

// BAD ❌
assertEquals(expected, actual);  // Tidak ada pesan error
```

---

## 📂 Project Structure Best Practice

```text
src/
├── main/java/
│   └── com/example/
│       ├── controller/
│       │   └── UserController.java
│       ├── service/
│       │   └── UserService.java
│       └── repository/
│           └── UserRepository.java
└── test/java/
    └── com/example/
        ├── controller/
        │   └── UserControllerTest.java      ← Test untuk Controller
        ├── service/
        │   └── UserServiceTest.java         ← Test untuk Service
        └── repository/
            └── UserRepositoryTest.java      ← Test untuk Repository
```

**Aturan:**

- Test file mirror structure main code
- Nama file: `[ClassName]Test.java`
- Package sama dengan class yang di-test

---

## 🔥 Common Mistakes & Solutions

### Mistake 1: Test Terlalu Besar

```java
// ❌ BAD: Test terlalu banyak hal
@Test
void testEverything() {
    // Test registration
    // Test login
    // Test profile update
    // Test delete user
    // ... terlalu banyak!
}

// ✅ GOOD: Satu test untuk satu scenario
@Test
void testRegister_ValidData_ShouldSaveUser() {
    // Fokus test registrasi saja
}
```

### Mistake 2: Tidak Pakai Mock

```java
// ❌ BAD: Pakai database real
@Test
void testLogin() {
    // Koneksi ke MySQL real
    // Lambat! Butuh database running!
}

// ✅ GOOD: Pakai mock
@Mock
private UserRepository userRepository;
```

### Mistake 3: Test Depends on Each Other

```java
// ❌ BAD
@Test
void testA() {
    User user = createUser();
    // Save user ke variable global
    this.savedUser = user;
}

@Test
void testB() {
    // Pakai savedUser dari testA
    // Kalau testA gagal, testB juga gagal!
}

// ✅ GOOD
@Test
void testA() {
    User user = createUser();
    // Test selesai di sini
}

@Test
void testB() {
    User user = createUser();  // Buat user sendiri
    // Independent dari testA
}
```

---

## 💡 Tips untuk Pemula

### 1. Mulai dari Test Sederhana

```java
@Test
void testAddition() {
    assertEquals(4, calculator.add(2, 2));
}
```

### 2. Pakai @DisplayName untuk Clarity

```java
@Test
@DisplayName("User should login successfully with valid credentials")
void testLogin() {
    // ...
}
```

### 3. Test Happy Path & Sad Path

```java
// Happy path (berhasil)
@Test
void testLogin_ValidCredentials_Success()

// Sad path (gagal)
@Test
void testLogin_WrongPassword_Fail()
@Test
void testLogin_EmailNotFound_Fail()
```

### 4. Baca Error Message dengan Teliti

```text
Expected: 4
Actual: 5

↑ Expected value
↑ Actual value dari code Anda
```

### 5. Jangan Takut Test Gagal

```text
Test FAIL = Bagus! Anda menemukan bug!
Lebih baik ketahuan di test daripada di production!
```

---

## 🎯 Coverage Metrics

### Apa itu Code Coverage?

**Code Coverage** = Persentase code yang di-test

```text
Total lines of code: 100
Lines tested: 80
Coverage: 80%
```

### Check Coverage dengan Maven

```bash
# Install JaCoCo plugin
mvn clean test jacoco:report

# Lihat report di:
# target/site/jacoco/index.html
```

### Coverage Target

- **Minimum:** 70%
- **Good:** 80%
- **Excellent:** 90%+

---

## 🚀 Next Steps

### 1. Run Test yang Sudah Dibuat

```bash
cd backend/ikp-labs-api
mvn test -Dtest=AuthServiceTest
```

### 2. Buat Test Baru

- Pilih class lain (UserService, FileStorageService)
- Ikuti pattern dari AuthServiceTest
- Test happy path & error path

### 3. Tambah Coverage

- Cek code coverage
- Target: 80%+

### 4. Learn More

- JUnit 5 Documentation
- Mockito Documentation
- Test-Driven Development (TDD)

---

## 📚 Resources

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [Baeldung Java Testing](https://www.baeldung.com/java-unit-testing-best-practices)

---

**Last Updated:** 2025-11-06
