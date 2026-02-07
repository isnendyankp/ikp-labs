package com.ikplabs.api.enums;

/**
 * SortBy Enum - Valid sort options for gallery photo listing
 *
 * DRY (Don't Repeat Yourself) solution for sortBy validation.
 * Eliminates duplicate isValidSortBy() methods across multiple controllers.
 *
 * Used by:
 * - GalleryController (my-photos, public photos)
 * - PhotoLikeController (liked-photos)
 * - PhotoFavoriteController (favorited-photos)
 *
 * Usage:
 * - Validation: SortBy.isValid(sortByString)
 * - Direct use: SortBy.NEWEST.name().toLowerCase()
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */
public enum SortBy {

    /**
     * Sort by newest first (createdAt DESC)
     */
    NEWEST("newest"),

    /**
     * Sort by oldest first (createdAt ASC)
     */
    OLDEST("oldest"),

    /**
     * Sort by most liked first (likeCount DESC)
     */
    MOST_LIKED("mostLiked"),

    /**
     * Sort by most favorited first (favoriteCount DESC)
     */
    MOST_FAVORITED("mostFavorited");

    private final String value;

    /**
     * Constructor
     *
     * @param value The string value used in API requests
     */
    SortBy(String value) {
        this.value = value;
    }

    /**
     * Get the string value of this enum
     *
     * @return The lowercase string value (e.g., "newest", "oldest")
     */
    public String getValue() {
        return value;
    }

    /**
     * Validate if a string is a valid SortBy value
     *
     * This method replaces the duplicate isValidSortBy() methods in controllers.
     *
     * @param value The string value to validate
     * @return true if the value matches any SortBy enum constant, false otherwise
     */
    public static boolean isValid(String value) {
        for (SortBy sortBy : SortBy.values()) {
            if (sortBy.value.equals(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get SortBy enum from string value
     *
     * @param value The string value to convert
     * @return SortBy enum constant
     * @throws IllegalArgumentException if value is not valid
     */
    public static SortBy fromValue(String value) {
        for (SortBy sortBy : SortBy.values()) {
            if (sortBy.value.equals(value)) {
                return sortBy;
            }
        }
        throw new IllegalArgumentException(
            "Invalid sortBy parameter. Allowed values: " + getAllowedValues()
        );
    }

    /**
     * Get all allowed sortBy values as comma-separated string
     * Used for error messages
     *
     * @return Comma-separated string of allowed values (e.g., "newest, oldest, mostLiked, mostFavorited")
     */
    public static String getAllowedValues() {
        StringBuilder sb = new StringBuilder();
        for (SortBy sortBy : SortBy.values()) {
            if (sb.length() > 0) {
                sb.append(", ");
            }
            sb.append(sortBy.value);
        }
        return sb.toString();
    }
}
