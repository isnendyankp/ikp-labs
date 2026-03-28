package com.ikplabs.api.util;

import com.ikplabs.api.dto.GalleryListResponse;
import com.ikplabs.api.dto.GalleryPhotoResponse;

import java.util.List;

/**
 * PaginationUtil - Utility class for pagination metadata calculation
 *
 * DRY (Don't Repeat Yourself) solution for pagination metadata building.
 * Eliminates duplicate pagination logic across multiple controllers.
 *
 * Used by:
 * - GalleryController (my-photos, public, user/{userId}/public)
 * - PhotoLikeController (liked-photos)
 * - PhotoFavoriteController (favorited-photos)
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */
public class PaginationUtil {

    /**
     * Build GalleryListResponse with pagination metadata
     *
     * Calculates totalPages, hasNext, hasPrevious from totalPhotos and page size.
     * All pagination logic centralized in one place for easier maintenance.
     *
     * @param photos List of photo DTOs for current page
     * @param page Current page number (0-indexed)
     * @param totalPhotos Total number of photos across all pages
     * @param size Number of photos per page
     * @return GalleryListResponse with pagination metadata
     */
    public static GalleryListResponse buildPaginatedResponse(
            List<GalleryPhotoResponse> photos,
            int page,
            long totalPhotos,
            int size) {

        // Calculate total pages (ceiling division)
        int totalPages = (int) Math.ceil((double) totalPhotos / size);

        // Calculate navigation flags
        boolean hasNext = page < totalPages - 1;
        boolean hasPrevious = page > 0;

        // Build response with pagination metadata using static factory method
        return GalleryListResponse.fromPage(
                photos,
                page,          // Current page (0-indexed)
                totalPages,    // Total pages
                totalPhotos,   // Total photos count
                size,          // Page size
                hasNext,       // Has next page?
                hasPrevious    // Has previous page?
        );
    }

    /**
     * Private constructor to prevent instantiation
     * This is a utility class with only static methods
     */
    private PaginationUtil() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
}
