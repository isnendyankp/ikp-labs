package com.ikplabs.api.util;

import com.ikplabs.api.dto.GalleryListResponse;
import com.ikplabs.api.dto.GalleryPhotoResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PaginationUtil
 *
 * Tests the buildPaginatedResponse method that calculates pagination metadata
 * including totalPages, hasNext, and hasPrevious flags.
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */
@DisplayName("PaginationUtil Tests")
class PaginationUtilTest {

    @Test
    @DisplayName("buildPaginatedResponse with single page should return totalPages=1")
    void buildPaginatedResponse_SinglePage_ShouldReturnTotalPagesOne() {
        // Given: 10 photos, page 0, size 10, total 10
        List<GalleryPhotoResponse> photos = createMockPhotos(10);
        int page = 0;
        long totalPhotos = 10;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 1 total page, no next, no previous
        assertEquals(1, response.getTotalPages());
        assertFalse(response.isHasNext());
        assertFalse(response.isHasPrevious());
        assertEquals(0, response.getCurrentPage());
        assertEquals(10, response.getTotalPhotos());
        assertEquals(10, response.getPageSize());
        assertEquals(10, response.getPhotos().size());
    }

    @Test
    @DisplayName("buildPaginatedResponse with exact multiple pages should calculate correctly")
    void buildPaginatedResponse_ExactMultiplePages_ShouldCalculateCorrectly() {
        // Given: 10 photos per page, total 30 photos
        List<GalleryPhotoResponse> photos = createMockPhotos(10);
        int page = 1; // Second page
        long totalPhotos = 30;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 3 total pages, has next, has previous
        assertEquals(3, response.getTotalPages());
        assertTrue(response.isHasNext()); // Page 1 of 3 has next
        assertTrue(response.isHasPrevious()); // Page 1 has previous
        assertEquals(1, response.getCurrentPage());
        assertEquals(30, response.getTotalPhotos());
        assertEquals(10, response.getPageSize());
    }

    @Test
    @DisplayName("buildPaginatedResponse with partial last page should calculate correctly")
    void buildPaginatedResponse_PartialLastPage_ShouldCalculateCorrectly() {
        // Given: 25 photos total, page 2 (last page with 5 photos)
        List<GalleryPhotoResponse> photos = createMockPhotos(5);
        int page = 2;
        long totalPhotos = 25;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 3 total pages (ceil(25/10) = 3), no next, has previous
        assertEquals(3, response.getTotalPages());
        assertFalse(response.isHasNext()); // Last page
        assertTrue(response.isHasPrevious());
        assertEquals(2, response.getCurrentPage());
        assertEquals(25, response.getTotalPhotos());
        assertEquals(10, response.getPageSize());
        assertEquals(5, response.getPhotos().size()); // Partial page
    }

    @Test
    @DisplayName("buildPaginatedResponse on first page should not have previous")
    void buildPaginatedResponse_FirstPage_ShouldNotHavePrevious() {
        // Given: Page 0 (first page)
        List<GalleryPhotoResponse> photos = createMockPhotos(10);
        int page = 0;
        long totalPhotos = 100;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have next but no previous
        assertTrue(response.isHasNext());
        assertFalse(response.isHasPrevious());
        assertEquals(0, response.getCurrentPage());
    }

    @Test
    @DisplayName("buildPaginatedResponse on last page should not have next")
    void buildPaginatedResponse_LastPage_ShouldNotHaveNext() {
        // Given: Page 9 (last page of 10, assuming 100 photos / 10 per page)
        List<GalleryPhotoResponse> photos = createMockPhotos(10);
        int page = 9;
        long totalPhotos = 100;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have previous but no next
        assertFalse(response.isHasNext());
        assertTrue(response.isHasPrevious());
        assertEquals(9, response.getCurrentPage());
        assertEquals(10, response.getTotalPages());
    }

    @Test
    @DisplayName("buildPaginatedResponse with middle page should have both next and previous")
    void buildPaginatedResponse_MiddlePage_ShouldHaveBothNextAndPrevious() {
        // Given: Page 5 of 10
        List<GalleryPhotoResponse> photos = createMockPhotos(10);
        int page = 5;
        long totalPhotos = 100;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have both next and previous
        assertTrue(response.isHasNext());
        assertTrue(response.isHasPrevious());
        assertEquals(5, response.getCurrentPage());
    }

    @Test
    @DisplayName("buildPaginatedResponse with empty list should still calculate correctly")
    void buildPaginatedResponse_EmptyList_ShouldCalculateCorrectly() {
        // Given: Empty photo list
        List<GalleryPhotoResponse> photos = List.of();
        int page = 0;
        long totalPhotos = 0;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 0 total pages, no next, no previous
        assertEquals(0, response.getTotalPages());
        assertFalse(response.isHasNext());
        assertFalse(response.isHasPrevious());
        assertEquals(0, response.getTotalPhotos());
        assertEquals(0, response.getPhotos().size());
    }

    @Test
    @DisplayName("buildPaginatedResponse with single photo should return totalPages=1")
    void buildPaginatedResponse_SinglePhoto_ShouldReturnTotalPagesOne() {
        // Given: Only 1 photo total
        List<GalleryPhotoResponse> photos = createMockPhotos(1);
        int page = 0;
        long totalPhotos = 1;
        int size = 10;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 1 total page, no next, no previous
        assertEquals(1, response.getTotalPages());
        assertFalse(response.isHasNext());
        assertFalse(response.isHasPrevious());
        assertEquals(1, response.getPhotos().size());
    }

    @Test
    @DisplayName("buildPaginatedResponse with large page size should calculate correctly")
    void buildPaginatedResponse_LargePageSize_ShouldCalculateCorrectly() {
        // Given: 100 page size (maximum)
        List<GalleryPhotoResponse> photos = createMockPhotos(50);
        int page = 0;
        long totalPhotos = 150;
        int size = 100;

        // When: Build paginated response
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(photos, page, totalPhotos, size);

        // Then: Should have 2 total pages (ceil(150/100) = 2)
        assertEquals(2, response.getTotalPages());
        assertTrue(response.isHasNext());
        assertFalse(response.isHasPrevious());
        assertEquals(100, response.getPageSize());
    }

    // ========== HELPER METHODS ==========

    /**
     * Create mock GalleryPhotoResponse list for testing
     */
    private List<GalleryPhotoResponse> createMockPhotos(int count) {
        List<GalleryPhotoResponse> photos = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            GalleryPhotoResponse photo = new GalleryPhotoResponse();
            photo.setId((long) i + 1);
            photo.setTitle("Photo " + (i + 1));
            photo.setDescription("Description " + (i + 1));
            photo.setFilePath("/photos/photo" + (i + 1) + ".jpg");
            photo.setCreatedAt(LocalDateTime.now());
            photo.setLikeCount(0L);
            photo.setIsLikedByUser(false);
            photo.setIsFavoritedByUser(false);
            photos.add(photo);
        }
        return photos;
    }
}
