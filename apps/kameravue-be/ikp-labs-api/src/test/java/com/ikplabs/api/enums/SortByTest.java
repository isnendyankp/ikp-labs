package com.ikplabs.api.enums;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for SortBy enum
 *
 * Tests the enum values and static validation methods.
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */
@DisplayName("SortBy Enum Tests")
class SortByTest {

    // ========== isValid() TESTS ==========

    @Test
    @DisplayName("isValid with 'newest' should return true")
    void isValid_withNewest_shouldReturnTrue() {
        assertTrue(SortBy.isValid("newest"));
    }

    @Test
    @DisplayName("isValid with 'oldest' should return true")
    void isValid_withOldest_shouldReturnTrue() {
        assertTrue(SortBy.isValid("oldest"));
    }

    @Test
    @DisplayName("isValid with 'mostLiked' should return true")
    void isValid_withMostLiked_shouldReturnTrue() {
        assertTrue(SortBy.isValid("mostLiked"));
    }

    @Test
    @DisplayName("isValid with 'mostFavorited' should return true")
    void isValid_withMostFavorited_shouldReturnTrue() {
        assertTrue(SortBy.isValid("mostFavorited"));
    }

    @Test
    @DisplayName("isValid with invalid value should return false")
    void isValid_withInvalidValue_shouldReturnFalse() {
        assertFalse(SortBy.isValid("invalid"));
        assertFalse(SortBy.isValid("random"));
        assertFalse(SortBy.isValid("asc"));
        assertFalse(SortBy.isValid("desc"));
    }

    @Test
    @DisplayName("isValid with empty string should return false")
    void isValid_withEmptyString_shouldReturnFalse() {
        assertFalse(SortBy.isValid(""));
    }

    @Test
    @DisplayName("isValid with null should return false")
    void isValid_withNull_shouldReturnFalse() {
        assertFalse(SortBy.isValid(null));
    }

    @Test
    @DisplayName("isValid with case sensitive should return false for wrong case")
    void isValid_withWrongCase_shouldReturnFalse() {
        assertFalse(SortBy.isValid("Newest"));
        assertFalse(SortBy.isValid("NEWEST"));
        assertFalse(SortBy.isValid("Oldest"));
        assertFalse(SortBy.isValid("MostLiked"));
        assertFalse(SortBy.isValid("MostFavorited"));
    }

    // ========== fromValue() TESTS ==========

    @Test
    @DisplayName("fromValue with 'newest' should return NEWEST enum")
    void fromValue_withNewest_shouldReturnNewestEnum() {
        assertEquals(SortBy.NEWEST, SortBy.fromValue("newest"));
    }

    @Test
    @DisplayName("fromValue with 'oldest' should return OLDEST enum")
    void fromValue_withOldest_shouldReturnOldestEnum() {
        assertEquals(SortBy.OLDEST, SortBy.fromValue("oldest"));
    }

    @Test
    @DisplayName("fromValue with 'mostLiked' should return MOST_LIKED enum")
    void fromValue_withMostLiked_shouldReturnMostLikedEnum() {
        assertEquals(SortBy.MOST_LIKED, SortBy.fromValue("mostLiked"));
    }

    @Test
    @DisplayName("fromValue with 'mostFavorited' should return MOST_FAVORITED enum")
    void fromValue_withMostFavorited_shouldReturnMostFavoritedEnum() {
        assertEquals(SortBy.MOST_FAVORITED, SortBy.fromValue("mostFavorited"));
    }

    @Test
    @DisplayName("fromValue with invalid value should throw IllegalArgumentException")
    void fromValue_withInvalidValue_shouldThrowException() {
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> SortBy.fromValue("invalid")
        );

        assertTrue(exception.getMessage().contains("Invalid sortBy parameter"));
        assertTrue(exception.getMessage().contains("Allowed values"));
    }

    @Test
    @DisplayName("fromValue with null should throw IllegalArgumentException")
    void fromValue_withNull_shouldThrowException() {
        assertThrows(
            IllegalArgumentException.class,
            () -> SortBy.fromValue(null)
        );
    }

    @Test
    @DisplayName("fromValue with empty string should throw IllegalArgumentException")
    void fromValue_withEmptyString_shouldThrowException() {
        assertThrows(
            IllegalArgumentException.class,
            () -> SortBy.fromValue("")
        );
    }

    // ========== getValue() TESTS ==========

    @Test
    @DisplayName("getValue of NEWEST should return 'newest'")
    void getValue_ofNewest_shouldReturnNewest() {
        assertEquals("newest", SortBy.NEWEST.getValue());
    }

    @Test
    @DisplayName("getValue of OLDEST should return 'oldest'")
    void getValue_ofOldest_shouldReturnOldest() {
        assertEquals("oldest", SortBy.OLDEST.getValue());
    }

    @Test
    @DisplayName("getValue of MOST_LIKED should return 'mostLiked'")
    void getValue_ofMostLiked_shouldReturnMostLiked() {
        assertEquals("mostLiked", SortBy.MOST_LIKED.getValue());
    }

    @Test
    @DisplayName("getValue of MOST_FAVORITED should return 'mostFavorited'")
    void getValue_ofMostFavorited_shouldReturnMostFavorited() {
        assertEquals("mostFavorited", SortBy.MOST_FAVORITED.getValue());
    }

    // ========== getAllowedValues() TESTS ==========

    @Test
    @DisplayName("getAllowedValues should return all values comma-separated")
    void getAllowedValues_shouldReturnAllValuesCommaSeparated() {
        String allowed = SortBy.getAllowedValues();

        assertTrue(allowed.contains("newest"));
        assertTrue(allowed.contains("oldest"));
        assertTrue(allowed.contains("mostLiked"));
        assertTrue(allowed.contains("mostFavorited"));
    }

    @Test
    @DisplayName("getAllowedValues should have 4 values")
    void getAllowedValues_shouldHaveFourValues() {
        String allowed = SortBy.getAllowedValues();
        String[] values = allowed.split(", ");

        assertEquals(4, values.length);
    }

    @Test
    @DisplayName("getAllowedValues format should be correct")
    void getAllowedValues_formatShouldBeCorrect() {
        String allowed = SortBy.getAllowedValues();

        // Check format: "newest, oldest, mostLiked, mostFavorited"
        assertEquals("newest, oldest, mostLiked, mostFavorited", allowed);
    }

    // ========== ENUM VALUES() TESTS ==========

    @Test
    @DisplayName("values() should return all 4 enum constants")
    void values_shouldReturnAllEnumConstants() {
        SortBy[] values = SortBy.values();

        assertEquals(4, values.length);
        assertEquals(SortBy.NEWEST, values[0]);
        assertEquals(SortBy.OLDEST, values[1]);
        assertEquals(SortBy.MOST_LIKED, values[2]);
        assertEquals(SortBy.MOST_FAVORITED, values[3]);
    }

    @Test
    @DisplayName("valueOf should return correct enum for valid string")
    void valueOf_withValidString_shouldReturnCorrectEnum() {
        assertEquals(SortBy.NEWEST, SortBy.valueOf("NEWEST"));
        assertEquals(SortBy.OLDEST, SortBy.valueOf("OLDEST"));
        assertEquals(SortBy.MOST_LIKED, SortBy.valueOf("MOST_LIKED"));
        assertEquals(SortBy.MOST_FAVORITED, SortBy.valueOf("MOST_FAVORITED"));
    }

    @Test
    @DisplayName("valueOf with invalid string should throw IllegalArgumentException")
    void valueOf_withInvalidString_shouldThrowException() {
        assertThrows(
            IllegalArgumentException.class,
            () -> SortBy.valueOf("INVALID")
        );
    }

    // ========== INTEGRATION TESTS ==========

    @Test
    @DisplayName("fromValue and getValue should be consistent")
    void fromValue_and_getValue_shouldBeConsistent() {
        // For each valid value, fromValue() should return the enum whose getValue() matches
        for (SortBy sortBy : SortBy.values()) {
            String value = sortBy.getValue();
            SortBy result = SortBy.fromValue(value);
            assertEquals(sortBy, result);
        }
    }

    @Test
    @DisplayName("isValid should match enum values")
    void isValid_shouldMatchEnumValues() {
        // All enum values should be valid
        for (SortBy sortBy : SortBy.values()) {
            assertTrue(SortBy.isValid(sortBy.getValue()));
        }
    }
}
