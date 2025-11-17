package com.registrationform.api.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests untuk PasswordValidator - Menggunakan Mock Data
 *
 * PENJELASAN UNTUK PEMULA:
 * ========================
 * PasswordValidator adalah Custom Constraint Validator yang mengecek password complexity:
 * - Must contain lowercase letter (a-z)
 * - Must contain uppercase letter (A-Z)
 * - Must contain digit (0-9)
 * - Must contain special character (@$!%*?&)
 *
 * Mengapa pakai Mock (bukan real database)?
 * ------------------------------------------
 * Validator test adalah UNIT TEST MURNI:
 * - NO dependencies (tidak butuh database, Spring Context, etc.)
 * - FAST: Test logic validation saja
 * - ISOLATED: Test satu method isValid() secara independen
 *
 * @ExtendWith(MockitoExtension.class):
 * ------------------------------------
 * - Enable Mockito annotations (@Mock, @InjectMocks)
 * - Auto-initialize mocks sebelum setiap test
 * - Tidak perlu MockitoAnnotations.openMocks(this)
 *
 * @Mock ConstraintValidatorContext:
 * ---------------------------------
 * - Mock parameter context yang required oleh isValid() method
 * - Kita tidak pakai context dalam validation logic, jadi cukup mock saja
 *
 * Pattern:
 * --------
 * - Arrange: Prepare password string
 * - Act: Call validator.isValid(password, context)
 * - Assert: Check if result is true/false
 *
 * Test Categories:
 * ----------------
 * 1. Valid passwords (all requirements met)
 * 2. Invalid passwords (missing requirements)
 * 3. Edge cases (null, empty, whitespace)
 *
 * @author Registration Form Team
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PasswordValidator Unit Tests - Using Mock Data")
public class PasswordValidatorTest {

    /**
     * Validator yang akan di-test (tidak perlu @InjectMocks karena tidak ada dependencies)
     */
    private PasswordValidator passwordValidator;

    /**
     * @Mock ConstraintValidatorContext - Required parameter untuk isValid() method
     * Kita mock karena tidak dipakai dalam validation logic
     */
    @Mock
    private ConstraintValidatorContext context;

    /**
     * Setup sebelum SETIAP test method
     */
    @BeforeEach
    void setUp() {
        passwordValidator = new PasswordValidator();
        passwordValidator.initialize(null); // Initialize validator (tidak butuh annotation)
    }

    // ========================================================================
    // VALID PASSWORD TESTS - All requirements met
    // ========================================================================

    @Test
    @DisplayName("1. Valid password - Should return true for password with all requirements")
    void testIsValid_ValidPasswordAllRequirements_ShouldReturnTrue() {
        // ARRANGE: Password dengan lowercase, uppercase, digit, special char
        String validPassword = "Password123!";

        // ACT: Validate password
        boolean result = passwordValidator.isValid(validPassword, context);

        // ASSERT: Should be valid
        assertTrue(result, "Password with all requirements should be valid");
    }

    @Test
    @DisplayName("2. Valid password - Should return true for complex password")
    void testIsValid_ComplexPassword_ShouldReturnTrue() {
        // ARRANGE: Complex password
        String complexPassword = "MyP@ssw0rd!";

        // ACT
        boolean result = passwordValidator.isValid(complexPassword, context);

        // ASSERT
        assertTrue(result, "Complex password should be valid");
    }

    @Test
    @DisplayName("3. Valid password - Should return true for password with all special chars")
    void testIsValid_AllSpecialChars_ShouldReturnTrue() {
        // ARRANGE: Password dengan berbagai special chars
        String password = "Pass123@$!%*?&";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with multiple special chars should be valid");
    }

    @Test
    @DisplayName("4. Valid password - Should return true for minimum valid password")
    void testIsValid_MinimumValidPassword_ShouldReturnTrue() {
        // ARRANGE: Minimum password yang memenuhi semua syarat
        String password = "Aa1@"; // lowercase, uppercase, digit, special

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Minimum valid password should be valid");
    }

    // ========================================================================
    // INVALID PASSWORD TESTS - Missing requirements
    // ========================================================================

    @Test
    @DisplayName("5. Invalid password - Should return false when missing lowercase")
    void testIsValid_MissingLowercase_ShouldReturnFalse() {
        // ARRANGE: Password tanpa lowercase
        String password = "PASSWORD123!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without lowercase should be invalid");
    }

    @Test
    @DisplayName("6. Invalid password - Should return false when missing uppercase")
    void testIsValid_MissingUppercase_ShouldReturnFalse() {
        // ARRANGE: Password tanpa uppercase
        String password = "password123!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without uppercase should be invalid");
    }

    @Test
    @DisplayName("7. Invalid password - Should return false when missing digit")
    void testIsValid_MissingDigit_ShouldReturnFalse() {
        // ARRANGE: Password tanpa digit
        String password = "Password!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without digit should be invalid");
    }

    @Test
    @DisplayName("8. Invalid password - Should return false when missing special character")
    void testIsValid_MissingSpecialChar_ShouldReturnFalse() {
        // ARRANGE: Password tanpa special char
        String password = "Password123";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without special character should be invalid");
    }

    @Test
    @DisplayName("9. Invalid password - Should return false for only lowercase")
    void testIsValid_OnlyLowercase_ShouldReturnFalse() {
        // ARRANGE: Hanya lowercase
        String password = "password";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only lowercase should be invalid");
    }

    @Test
    @DisplayName("10. Invalid password - Should return false for only uppercase")
    void testIsValid_OnlyUppercase_ShouldReturnFalse() {
        // ARRANGE: Hanya uppercase
        String password = "PASSWORD";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only uppercase should be invalid");
    }

    @Test
    @DisplayName("11. Invalid password - Should return false for only digits")
    void testIsValid_OnlyDigits_ShouldReturnFalse() {
        // ARRANGE: Hanya digits
        String password = "12345678";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only digits should be invalid");
    }

    @Test
    @DisplayName("12. Invalid password - Should return false for only special chars")
    void testIsValid_OnlySpecialChars_ShouldReturnFalse() {
        // ARRANGE: Hanya special chars
        String password = "@$!%*?&";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only special chars should be invalid");
    }

    // ========================================================================
    // EDGE CASE TESTS - Null, empty, whitespace
    // ========================================================================

    @Test
    @DisplayName("13. Edge case - Should return true for null password (let @NotBlank handle)")
    void testIsValid_NullPassword_ShouldReturnTrue() {
        // ARRANGE: null password
        String password = null;

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT: Validator returns true, @NotBlank akan handle validation
        assertTrue(result, "Null password should return true (handled by @NotBlank)");
    }

    @Test
    @DisplayName("14. Edge case - Should return true for empty password (let @NotBlank handle)")
    void testIsValid_EmptyPassword_ShouldReturnTrue() {
        // ARRANGE: Empty password
        String password = "";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT: Validator returns true, @NotBlank akan handle validation
        assertTrue(result, "Empty password should return true (handled by @NotBlank)");
    }

    @Test
    @DisplayName("15. Edge case - Should return true for whitespace password (let @NotBlank handle)")
    void testIsValid_WhitespacePassword_ShouldReturnTrue() {
        // ARRANGE: Whitespace password
        String password = "   ";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT: Validator returns true, @NotBlank akan handle validation
        assertTrue(result, "Whitespace password should return true (handled by @NotBlank)");
    }

    // ========================================================================
    // SPECIAL CHARACTER VALIDATION TESTS
    // ========================================================================

    @Test
    @DisplayName("16. Special char - Should return true for @ symbol")
    void testIsValid_AtSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan @ symbol
        String password = "Password123@";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with @ should be valid");
    }

    @Test
    @DisplayName("17. Special char - Should return true for $ symbol")
    void testIsValid_DollarSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan $ symbol
        String password = "Password123$";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with $ should be valid");
    }

    @Test
    @DisplayName("18. Special char - Should return true for ! symbol")
    void testIsValid_ExclamationSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan ! symbol
        String password = "Password123!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with ! should be valid");
    }

    @Test
    @DisplayName("19. Special char - Should return true for % symbol")
    void testIsValid_PercentSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan % symbol
        String password = "Password123%";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with % should be valid");
    }

    @Test
    @DisplayName("20. Special char - Should return true for * symbol")
    void testIsValid_AsteriskSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan * symbol
        String password = "Password123*";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with * should be valid");
    }

    @Test
    @DisplayName("21. Special char - Should return true for ? symbol")
    void testIsValid_QuestionSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan ? symbol
        String password = "Password123?";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with ? should be valid");
    }

    @Test
    @DisplayName("22. Special char - Should return true for & symbol")
    void testIsValid_AmpersandSymbol_ShouldReturnTrue() {
        // ARRANGE: Password dengan & symbol
        String password = "Password123&";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertTrue(result, "Password with & should be valid");
    }

    @Test
    @DisplayName("23. Special char - Should return false for invalid special char (#)")
    void testIsValid_InvalidSpecialChar_ShouldReturnFalse() {
        // ARRANGE: Password dengan # (not in allowed list)
        String password = "Password123#";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with # should be invalid (not in allowed list)");
    }

    @Test
    @DisplayName("24. Special char - Should return false for invalid special char (-)")
    void testIsValid_InvalidSpecialCharDash_ShouldReturnFalse() {
        // ARRANGE: Password dengan - (not in allowed list)
        String password = "Password123-";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with - should be invalid (not in allowed list)");
    }

    // ========================================================================
    // COMBINATION TESTS - Missing multiple requirements
    // ========================================================================

    @Test
    @DisplayName("25. Combination - Should return false when missing lowercase and uppercase")
    void testIsValid_MissingLowercaseAndUppercase_ShouldReturnFalse() {
        // ARRANGE: Hanya digit dan special char
        String password = "123456!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without letters should be invalid");
    }

    @Test
    @DisplayName("26. Combination - Should return false when missing digit and special char")
    void testIsValid_MissingDigitAndSpecialChar_ShouldReturnFalse() {
        // ARRANGE: Hanya lowercase dan uppercase
        String password = "PasswordOnly";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password without digit and special char should be invalid");
    }

    @Test
    @DisplayName("27. Combination - Should return false when only lowercase and digit")
    void testIsValid_OnlyLowercaseAndDigit_ShouldReturnFalse() {
        // ARRANGE: Hanya lowercase dan digit
        String password = "password123";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only lowercase and digit should be invalid");
    }

    @Test
    @DisplayName("28. Combination - Should return false when only uppercase and special char")
    void testIsValid_OnlyUppercaseAndSpecialChar_ShouldReturnFalse() {
        // ARRANGE: Hanya uppercase dan special char
        String password = "PASSWORD!";

        // ACT
        boolean result = passwordValidator.isValid(password, context);

        // ASSERT
        assertFalse(result, "Password with only uppercase and special char should be invalid");
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 28
 *
 * Valid Password Tests (4 tests):
 * - All requirements met
 * - Complex password
 * - Multiple special characters
 * - Minimum valid password
 *
 * Invalid Password Tests (8 tests):
 * - Missing lowercase
 * - Missing uppercase
 * - Missing digit
 * - Missing special character
 * - Only lowercase
 * - Only uppercase
 * - Only digits
 * - Only special chars
 *
 * Edge Case Tests (3 tests):
 * - Null password (handled by @NotBlank)
 * - Empty password (handled by @NotBlank)
 * - Whitespace password (handled by @NotBlank)
 *
 * Special Character Tests (9 tests):
 * - @ symbol (valid)
 * - $ symbol (valid)
 * - ! symbol (valid)
 * - % symbol (valid)
 * - * symbol (valid)
 * - ? symbol (valid)
 * - & symbol (valid)
 * - # symbol (invalid)
 * - - symbol (invalid)
 *
 * Combination Tests (4 tests):
 * - Missing multiple requirements
 * - Various partial combinations
 *
 * Password Requirements:
 * ----------------------
 * ✅ Lowercase letter (a-z)
 * ✅ Uppercase letter (A-Z)
 * ✅ Digit (0-9)
 * ✅ Special character (@$!%*?&)
 *
 * Expected Coverage: ~100% (all branches covered)
 *
 * CARA MENJALANKAN:
 * ================
 * mvn test -Dtest=PasswordValidatorTest
 *
 * NOTES:
 * ======
 * - Pure unit test (no Spring Context needed)
 * - Mock ConstraintValidatorContext (not used in logic)
 * - Fast execution (no database, no external dependencies)
 * - Comprehensive coverage of all validation branches
 */
