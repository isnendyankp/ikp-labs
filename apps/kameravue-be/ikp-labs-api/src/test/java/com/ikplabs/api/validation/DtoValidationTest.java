package com.ikplabs.api.validation;

import com.ikplabs.api.dto.LoginRequest;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.dto.UserUpdateRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DTO Validation Test - Unit tests untuk Bean Validation pada semua DTOs
 *
 * APA ITU DTO VALIDATION?
 * =======================
 * DTO Validation adalah proses validasi data yang masuk melalui API request.
 * Menggunakan Jakarta Bean Validation annotations seperti:
 * - @NotBlank: Field tidak boleh null, empty, atau whitespace
 * - @Email: Field harus format email valid
 * - @Size: Field harus sesuai panjang min/max
 * - @Pattern: Field harus sesuai regex pattern
 * - @ValidPassword: Custom annotation untuk password complexity
 *
 * MENGAPA PERLU TEST VALIDATION?
 * ===============================
 * 1. Pastikan validation rules bekerja dengan benar
 * 2. Mencegah invalid data masuk ke business logic
 * 3. Verifikasi error messages sesuai ekspektasi
 * 4. Test coverage untuk security (input validation)
 *
 * TOTAL TEST CASES: 30+ tests
 * ===========================
 * - LoginRequest (6 tests)
 * - UserRegistrationRequest (12 tests)
 * - UserUpdateRequest (12 tests)
 *
 * @author Claude Code
 */
@DisplayName("DTO Validation Tests - Bean Validation for all DTOs")
public class DtoValidationTest {

    /**
     * Validator instance - untuk melakukan validation testing
     */
    private Validator validator;

    /**
     * Setup method - dijalankan sebelum setiap test
     * Initialize Validator dari ValidatorFactory
     */
    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // ============================================
    // LOGINREQUEST VALIDATION TESTS
    // ============================================

    /**
     * TEST 1: LoginRequest dengan data valid - harus PASS
     */
    @Test
    @DisplayName("Test 1: LoginRequest - valid data - Should have no violations")
    void testLoginRequest_ValidData_ShouldHaveNoViolations() {
        // ARRANGE
        LoginRequest request = new LoginRequest("user@example.com", "password123");

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Valid LoginRequest should have no violations");

        System.out.println("✅ Test 1 PASSED: LoginRequest with valid data passes validation");
    }

    /**
     * TEST 2: LoginRequest dengan email null - harus FAIL
     */
    @Test
    @DisplayName("Test 2: LoginRequest - null email - Should have violation")
    void testLoginRequest_NullEmail_ShouldHaveViolation() {
        // ARRANGE
        LoginRequest request = new LoginRequest(null, "password123");

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Null email should have violation");
        assertEquals(1, violations.size());

        ConstraintViolation<LoginRequest> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());
        assertTrue(violation.getMessage().contains("required") ||
                   violation.getMessage().contains("blank"));

        System.out.println("✅ Test 2 PASSED: LoginRequest with null email fails validation");
    }

    /**
     * TEST 3: LoginRequest dengan email invalid - harus FAIL
     */
    @Test
    @DisplayName("Test 3: LoginRequest - invalid email format - Should have violation")
    void testLoginRequest_InvalidEmail_ShouldHaveViolation() {
        // ARRANGE
        LoginRequest request = new LoginRequest("notanemail", "password123");

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Invalid email format should have violation");

        ConstraintViolation<LoginRequest> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());

        System.out.println("✅ Test 3 PASSED: LoginRequest with invalid email fails validation");
    }

    /**
     * TEST 4: LoginRequest dengan email empty - harus FAIL
     */
    @Test
    @DisplayName("Test 4: LoginRequest - empty email - Should have violation")
    void testLoginRequest_EmptyEmail_ShouldHaveViolation() {
        // ARRANGE
        LoginRequest request = new LoginRequest("", "password123");

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Empty email should have violation");

        System.out.println("✅ Test 4 PASSED: LoginRequest with empty email fails validation");
    }

    /**
     * TEST 5: LoginRequest dengan password null - harus FAIL
     */
    @Test
    @DisplayName("Test 5: LoginRequest - null password - Should have violation")
    void testLoginRequest_NullPassword_ShouldHaveViolation() {
        // ARRANGE
        LoginRequest request = new LoginRequest("user@example.com", null);

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Null password should have violation");

        ConstraintViolation<LoginRequest> violation = violations.iterator().next();
        assertEquals("password", violation.getPropertyPath().toString());

        System.out.println("✅ Test 5 PASSED: LoginRequest with null password fails validation");
    }

    /**
     * TEST 6: LoginRequest dengan password empty - harus FAIL
     */
    @Test
    @DisplayName("Test 6: LoginRequest - empty password - Should have violation")
    void testLoginRequest_EmptyPassword_ShouldHaveViolation() {
        // ARRANGE
        LoginRequest request = new LoginRequest("user@example.com", "");

        // ACT
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Empty password should have violation");

        System.out.println("✅ Test 6 PASSED: LoginRequest with empty password fails validation");
    }

    // ============================================
    // USERREGISTRATIONREQUEST VALIDATION TESTS
    // ============================================

    /**
     * TEST 7: UserRegistrationRequest dengan data valid - harus PASS
     */
    @Test
    @DisplayName("Test 7: UserRegistrationRequest - valid data - Should have no violations")
    void testUserRegistrationRequest_ValidData_ShouldHaveNoViolations() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john.doe@example.com",
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Valid UserRegistrationRequest should have no violations");

        System.out.println("✅ Test 7 PASSED: UserRegistrationRequest with valid data passes validation");
    }

    /**
     * TEST 8: UserRegistrationRequest dengan fullName null - harus FAIL
     */
    @Test
    @DisplayName("Test 8: UserRegistrationRequest - null fullName - Should have violation")
    void testUserRegistrationRequest_NullFullName_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            null,
            "john@example.com",
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Null fullName should have violation");

        boolean hasFullNameViolation = violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("fullName"));
        assertTrue(hasFullNameViolation, "Should have violation for fullName");

        System.out.println("✅ Test 8 PASSED: UserRegistrationRequest with null fullName fails validation");
    }

    /**
     * TEST 9: UserRegistrationRequest dengan fullName too short - harus FAIL
     */
    @Test
    @DisplayName("Test 9: UserRegistrationRequest - fullName too short - Should have violation")
    void testUserRegistrationRequest_FullNameTooShort_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "A",  // Only 1 character
            "john@example.com",
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "FullName with 1 character should have violation");

        System.out.println("✅ Test 9 PASSED: UserRegistrationRequest with short fullName fails validation");
    }

    /**
     * TEST 10: UserRegistrationRequest dengan fullName invalid characters - harus FAIL
     */
    @Test
    @DisplayName("Test 10: UserRegistrationRequest - fullName with numbers - Should have violation")
    void testUserRegistrationRequest_FullNameWithNumbers_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John123",  // Contains numbers
            "john@example.com",
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "FullName with numbers should have violation");

        System.out.println("✅ Test 10 PASSED: UserRegistrationRequest with invalid fullName fails validation");
    }

    /**
     * TEST 11: UserRegistrationRequest dengan email null - harus FAIL
     */
    @Test
    @DisplayName("Test 11: UserRegistrationRequest - null email - Should have violation")
    void testUserRegistrationRequest_NullEmail_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            null,
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Null email should have violation");

        System.out.println("✅ Test 11 PASSED: UserRegistrationRequest with null email fails validation");
    }

    /**
     * TEST 12: UserRegistrationRequest dengan email invalid - harus FAIL
     */
    @Test
    @DisplayName("Test 12: UserRegistrationRequest - invalid email - Should have violation")
    void testUserRegistrationRequest_InvalidEmail_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "notanemail",
            "Password123!"
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Invalid email should have violation");

        System.out.println("✅ Test 12 PASSED: UserRegistrationRequest with invalid email fails validation");
    }

    /**
     * TEST 13: UserRegistrationRequest dengan password null - harus FAIL
     */
    @Test
    @DisplayName("Test 13: UserRegistrationRequest - null password - Should have violation")
    void testUserRegistrationRequest_NullPassword_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            null
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Null password should have violation");

        System.out.println("✅ Test 13 PASSED: UserRegistrationRequest with null password fails validation");
    }

    /**
     * TEST 14: UserRegistrationRequest dengan password too short - harus FAIL
     */
    @Test
    @DisplayName("Test 14: UserRegistrationRequest - password too short - Should have violation")
    void testUserRegistrationRequest_PasswordTooShort_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            "Pass1!"  // Only 6 characters (min is 8)
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password with less than 8 characters should have violation");

        System.out.println("✅ Test 14 PASSED: UserRegistrationRequest with short password fails validation");
    }

    /**
     * TEST 15: UserRegistrationRequest dengan password no uppercase - harus FAIL
     */
    @Test
    @DisplayName("Test 15: UserRegistrationRequest - password without uppercase - Should have violation")
    void testUserRegistrationRequest_PasswordNoUppercase_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            "password123!"  // No uppercase
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without uppercase should have violation");

        System.out.println("✅ Test 15 PASSED: UserRegistrationRequest with no-uppercase password fails validation");
    }

    /**
     * TEST 16: UserRegistrationRequest dengan password no lowercase - harus FAIL
     */
    @Test
    @DisplayName("Test 16: UserRegistrationRequest - password without lowercase - Should have violation")
    void testUserRegistrationRequest_PasswordNoLowercase_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            "PASSWORD123!"  // No lowercase
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without lowercase should have violation");

        System.out.println("✅ Test 16 PASSED: UserRegistrationRequest with no-lowercase password fails validation");
    }

    /**
     * TEST 17: UserRegistrationRequest dengan password no digit - harus FAIL
     */
    @Test
    @DisplayName("Test 17: UserRegistrationRequest - password without digit - Should have violation")
    void testUserRegistrationRequest_PasswordNoDigit_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            "Password!"  // No digit
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without digit should have violation");

        System.out.println("✅ Test 17 PASSED: UserRegistrationRequest with no-digit password fails validation");
    }

    /**
     * TEST 18: UserRegistrationRequest dengan password no special char - harus FAIL
     */
    @Test
    @DisplayName("Test 18: UserRegistrationRequest - password without special char - Should have violation")
    void testUserRegistrationRequest_PasswordNoSpecialChar_ShouldHaveViolation() {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest(
            "John Doe",
            "john@example.com",
            "Password123"  // No special character
        );

        // ACT
        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without special character should have violation");

        System.out.println("✅ Test 18 PASSED: UserRegistrationRequest with no-special-char password fails validation");
    }

    // ============================================
    // USERUPDATEREQUEST VALIDATION TESTS
    // ============================================

    /**
     * TEST 19: UserUpdateRequest dengan data valid - harus PASS
     */
    @Test
    @DisplayName("Test 19: UserUpdateRequest - valid data - Should have no violations")
    void testUserUpdateRequest_ValidData_ShouldHaveNoViolations() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(
            "Jane Doe",
            "jane@example.com",
            "NewPassword123!"
        );

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Valid UserUpdateRequest should have no violations");

        System.out.println("✅ Test 19 PASSED: UserUpdateRequest with valid data passes validation");
    }

    /**
     * TEST 20: UserUpdateRequest dengan semua fields null - harus PASS (partial update)
     */
    @Test
    @DisplayName("Test 20: UserUpdateRequest - all fields null - Should have no violations (partial update)")
    void testUserUpdateRequest_AllFieldsNull_ShouldHaveNoViolations() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Null fields in UserUpdateRequest should be valid (partial update)");

        System.out.println("✅ Test 20 PASSED: UserUpdateRequest with null fields passes validation");
    }

    /**
     * TEST 21: UserUpdateRequest dengan fullName too short - harus FAIL
     */
    @Test
    @DisplayName("Test 21: UserUpdateRequest - fullName too short - Should have violation")
    void testUserUpdateRequest_FullNameTooShort_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest("A", null, null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "FullName with 1 character should have violation");

        System.out.println("✅ Test 21 PASSED: UserUpdateRequest with short fullName fails validation");
    }

    /**
     * TEST 22: UserUpdateRequest dengan fullName invalid characters - harus FAIL
     */
    @Test
    @DisplayName("Test 22: UserUpdateRequest - fullName with numbers - Should have violation")
    void testUserUpdateRequest_FullNameWithNumbers_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest("Jane123", null, null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "FullName with numbers should have violation");

        System.out.println("✅ Test 22 PASSED: UserUpdateRequest with invalid fullName fails validation");
    }

    /**
     * TEST 23: UserUpdateRequest dengan email invalid - harus FAIL
     */
    @Test
    @DisplayName("Test 23: UserUpdateRequest - invalid email - Should have violation")
    void testUserUpdateRequest_InvalidEmail_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, "notanemail", null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Invalid email should have violation");

        System.out.println("✅ Test 23 PASSED: UserUpdateRequest with invalid email fails validation");
    }

    /**
     * TEST 24: UserUpdateRequest dengan password too short - harus FAIL
     */
    @Test
    @DisplayName("Test 24: UserUpdateRequest - password too short - Should have violation")
    void testUserUpdateRequest_PasswordTooShort_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, "Pass1!");

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password with less than 8 characters should have violation");

        System.out.println("✅ Test 24 PASSED: UserUpdateRequest with short password fails validation");
    }

    /**
     * TEST 25: UserUpdateRequest dengan password no uppercase - harus FAIL
     */
    @Test
    @DisplayName("Test 25: UserUpdateRequest - password without uppercase - Should have violation")
    void testUserUpdateRequest_PasswordNoUppercase_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, "password123!");

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without uppercase should have violation");

        System.out.println("✅ Test 25 PASSED: UserUpdateRequest with no-uppercase password fails validation");
    }

    /**
     * TEST 26: UserUpdateRequest dengan password no lowercase - harus FAIL
     */
    @Test
    @DisplayName("Test 26: UserUpdateRequest - password without lowercase - Should have violation")
    void testUserUpdateRequest_PasswordNoLowercase_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, "PASSWORD123!");

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without lowercase should have violation");

        System.out.println("✅ Test 26 PASSED: UserUpdateRequest with no-lowercase password fails validation");
    }

    /**
     * TEST 27: UserUpdateRequest dengan password no digit - harus FAIL
     */
    @Test
    @DisplayName("Test 27: UserUpdateRequest - password without digit - Should have violation")
    void testUserUpdateRequest_PasswordNoDigit_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, "Password!");

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without digit should have violation");

        System.out.println("✅ Test 27 PASSED: UserUpdateRequest with no-digit password fails validation");
    }

    /**
     * TEST 28: UserUpdateRequest dengan password no special char - harus FAIL
     */
    @Test
    @DisplayName("Test 28: UserUpdateRequest - password without special char - Should have violation")
    void testUserUpdateRequest_PasswordNoSpecialChar_ShouldHaveViolation() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, null, "Password123");

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertFalse(violations.isEmpty(), "Password without special character should have violation");

        System.out.println("✅ Test 28 PASSED: UserUpdateRequest with no-special-char password fails validation");
    }

    /**
     * TEST 29: UserUpdateRequest - partial update hanya fullName - harus PASS
     */
    @Test
    @DisplayName("Test 29: UserUpdateRequest - only fullName updated - Should have no violations")
    void testUserUpdateRequest_OnlyFullNameUpdated_ShouldHaveNoViolations() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest("Jane Smith", null, null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Partial update with only fullName should be valid");

        System.out.println("✅ Test 29 PASSED: UserUpdateRequest with partial update (fullName only) passes");
    }

    /**
     * TEST 30: UserUpdateRequest - partial update hanya email - harus PASS
     */
    @Test
    @DisplayName("Test 30: UserUpdateRequest - only email updated - Should have no violations")
    void testUserUpdateRequest_OnlyEmailUpdated_ShouldHaveNoViolations() {
        // ARRANGE
        UserUpdateRequest request = new UserUpdateRequest(null, "newemail@example.com", null);

        // ACT
        Set<ConstraintViolation<UserUpdateRequest>> violations = validator.validate(request);

        // ASSERT
        assertTrue(violations.isEmpty(), "Partial update with only email should be valid");

        System.out.println("✅ Test 30 PASSED: UserUpdateRequest with partial update (email only) passes");
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 30
 *
 * LoginRequest (6 tests):
 * - Valid data
 * - Null email
 * - Invalid email format
 * - Empty email
 * - Null password
 * - Empty password
 *
 * UserRegistrationRequest (12 tests):
 * - Valid data
 * - Null fullName
 * - FullName too short
 * - FullName with invalid characters (numbers)
 * - Null email
 * - Invalid email
 * - Null password
 * - Password too short
 * - Password without uppercase
 * - Password without lowercase
 * - Password without digit
 * - Password without special character
 *
 * UserUpdateRequest (12 tests):
 * - Valid data
 * - All fields null (partial update allowed)
 * - FullName too short
 * - FullName with numbers
 * - Invalid email
 * - Password too short
 * - Password without uppercase
 * - Password without lowercase
 * - Password without digit
 * - Password without special character
 * - Partial update (fullName only)
 * - Partial update (email only)
 *
 * Expected Coverage: 100% untuk DTO validations
 *
 * CARA MENJALANKAN:
 * ================
 * mvn test -Dtest=DtoValidationTest
 *
 * NOTES UNTUK PEMULA:
 * ===================
 * 1. ConstraintViolation: Object yang berisi informasi tentang validation error
 * 2. Validator: Tool untuk melakukan validasi Bean Validation
 * 3. violations.isEmpty(): True = no errors, False = ada errors
 * 4. @ValidPassword: Custom annotation yang kita buat sendiri
 * 5. Partial update: Update sebagian field saja (sisanya null)
 */
