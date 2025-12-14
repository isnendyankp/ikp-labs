package com.ikplabs.api.dto;

import java.util.List;

/**
 * GalleryListResponse - DTO for paginated photo list response
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryListResponse seperti "Katalog Foto dengan Halaman":
 *
 * Bayangkan katalog foto dengan:
 * - Halaman 1: 12 foto pertama
 * - Halaman 2: 12 foto berikutnya
 * - Info di bawah: "Showing 1-12 of 48 photos"
 * - Button: [Previous] [1] [2] [3] [4] [Next]
 *
 * Response structure:
 * {
 *   "photos": [...],              // List of photos (12 items)
 *   "currentPage": 0,             // Current page (0-indexed)
 *   "totalPages": 4,              // Total pages available
 *   "totalPhotos": 48,            // Total photos count
 *   "pageSize": 12,               // Photos per page
 *   "hasNext": true,              // Can go to next page?
 *   "hasPrevious": false          // Can go to previous page?
 * }
 *
 * Kenapa pakai Pagination?
 * - Performance: Don't load 1000 photos at once
 * - UX: Scroll infinitely or click page numbers
 * - Bandwidth: Save data transfer
 *
 * Use Cases:
 * - GET /api/gallery/my-photos?page=0&size=12
 * - GET /api/gallery/public?page=2&size=12
 * - GET /api/gallery/user/83/public?page=0&size=12
 */
public class GalleryListResponse {

    /**
     * List of photos for current page
     *
     * Contains GalleryPhotoResponse objects.
     * Length depends on pageSize (default 12).
     *
     * Empty list if no photos found.
     */
    private List<GalleryPhotoResponse> photos;

    /**
     * Current page number (0-indexed)
     *
     * Page 0 = first page
     * Page 1 = second page
     * etc.
     *
     * Frontend typically shows as "Page 1" (add +1 for display)
     */
    private int currentPage;

    /**
     * Total number of pages available
     *
     * Calculated as: ceil(totalPhotos / pageSize)
     * Example: 48 photos / 12 per page = 4 pages
     *
     * Used for pagination UI (show page numbers)
     */
    private int totalPages;

    /**
     * Total number of photos across all pages
     *
     * Total count in database matching the query.
     * Example: User has 48 photos total
     *
     * Used for display: "Showing 1-12 of 48 photos"
     */
    private long totalPhotos;

    /**
     * Number of photos per page
     *
     * Default: 12 (configurable)
     * Backend sets this from Pageable.getPageSize()
     *
     * Frontend uses this to calculate range display
     */
    private int pageSize;

    /**
     * Whether there is a next page
     *
     * true = can click "Next" button
     * false = already on last page
     *
     * Disable "Next" button if false
     */
    private boolean hasNext;

    /**
     * Whether there is a previous page
     *
     * true = can click "Previous" button
     * false = already on first page (page 0)
     *
     * Disable "Previous" button if false
     */
    private boolean hasPrevious;

    /**
     * Default constructor - required by Spring for serialization
     */
    public GalleryListResponse() {
    }

    /**
     * Constructor with all fields
     *
     * Use this for manual creation or testing.
     */
    public GalleryListResponse(List<GalleryPhotoResponse> photos, int currentPage, int totalPages,
                               long totalPhotos, int pageSize, boolean hasNext, boolean hasPrevious) {
        this.photos = photos;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalPhotos = totalPhotos;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    /**
     * Static factory method - Convert from Spring Page<GalleryPhoto>
     *
     * RECOMMENDED WAY untuk create response dari Spring Page.
     * Spring Data JPA return Page<Entity>, kita convert ke DTO.
     *
     * Flow:
     * 1. Service return Page<GalleryPhoto> from repository
     * 2. Controller convert each photo to GalleryPhotoResponse
     * 3. Controller create GalleryListResponse with pagination info
     *
     * Example usage:
     * ```
     * Page<GalleryPhoto> photoPage = repository.findByUserId(userId, pageable);
     * List<GalleryPhotoResponse> photoResponses = photoPage.getContent()
     *     .stream()
     *     .map(GalleryPhotoResponse::fromEntity)
     *     .collect(Collectors.toList());
     * GalleryListResponse response = GalleryListResponse.fromPage(
     *     photoResponses,
     *     photoPage.getNumber(),
     *     photoPage.getTotalPages(),
     *     photoPage.getTotalElements(),
     *     photoPage.getSize(),
     *     photoPage.hasNext(),
     *     photoPage.hasPrevious()
     * );
     * ```
     *
     * @param photos List of GalleryPhotoResponse for current page
     * @param currentPage Current page number (0-indexed)
     * @param totalPages Total pages available
     * @param totalPhotos Total photos count
     * @param pageSize Photos per page
     * @param hasNext Whether there is next page
     * @param hasPrevious Whether there is previous page
     * @return GalleryListResponse with pagination metadata
     */
    public static GalleryListResponse fromPage(List<GalleryPhotoResponse> photos, int currentPage,
                                               int totalPages, long totalPhotos, int pageSize,
                                               boolean hasNext, boolean hasPrevious) {
        return new GalleryListResponse(photos, currentPage, totalPages, totalPhotos,
                                       pageSize, hasNext, hasPrevious);
    }

    // Getters and Setters

    public List<GalleryPhotoResponse> getPhotos() {
        return photos;
    }

    public void setPhotos(List<GalleryPhotoResponse> photos) {
        this.photos = photos;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalPhotos() {
        return totalPhotos;
    }

    public void setTotalPhotos(long totalPhotos) {
        this.totalPhotos = totalPhotos;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    /**
     * toString for debugging
     */
    @Override
    public String toString() {
        return "GalleryListResponse{" +
                "photosCount=" + (photos != null ? photos.size() : 0) +
                ", currentPage=" + currentPage +
                ", totalPages=" + totalPages +
                ", totalPhotos=" + totalPhotos +
                ", pageSize=" + pageSize +
                ", hasNext=" + hasNext +
                ", hasPrevious=" + hasPrevious +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY PAGINATION?
     *    ================
     *    WITHOUT PAGINATION:
     *    - Load all 1000 photos at once → slow query
     *    - Transfer 10MB JSON → slow network
     *    - Render 1000 images → slow browser
     *    - Bad UX (page freeze, out of memory)
     *
     *    WITH PAGINATION:
     *    - Load 12 photos → fast query (0.05s)
     *    - Transfer 100KB JSON → instant
     *    - Render 12 images → smooth
     *    - Good UX (responsive, smooth scrolling)
     *
     * 2. PAGE NUMBER CONVENTION:
     *    =======================
     *    Backend: 0-indexed (page 0, 1, 2, 3...)
     *    Frontend: 1-indexed display (Page 1, 2, 3, 4...)
     *
     *    Conversion:
     *    - Display: currentPage + 1 (show "Page 1" instead of "Page 0")
     *    - Request: displayPage - 1 (send page=0 for "Page 1")
     *
     * 3. PAGINATION METADATA USAGE:
     *    ===========================
     *    currentPage: Highlight current page button
     *    totalPages: Show page numbers (1, 2, 3, 4)
     *    totalPhotos: Display "Showing 1-12 of 48 photos"
     *    pageSize: Calculate range (1-12, 13-24, etc.)
     *    hasNext: Enable/disable "Next" button
     *    hasPrevious: Enable/disable "Previous" button
     *
     * 4. TYPICAL FRONTEND UI:
     *    ====================
     *    ┌─────────────────────────────────────────┐
     *    │  Showing 1-12 of 48 photos              │
     *    ├─────────────────────────────────────────┤
     *    │  [Photo 1] [Photo 2] [Photo 3]          │
     *    │  [Photo 4] [Photo 5] [Photo 6]          │
     *    │  [Photo 7] [Photo 8] [Photo 9]          │
     *    │  [Photo 10] [Photo 11] [Photo 12]       │
     *    ├─────────────────────────────────────────┤
     *    │  [Previous] [1] [2] [3] [4] [Next]      │
     *    └─────────────────────────────────────────┘
     *
     * 5. EXAMPLE API RESPONSE (JSON):
     *    =============================
     *    GET /api/gallery/my-photos?page=0&size=12
     *
     *    {
     *      "photos": [
     *        { "id": 1, "title": "Photo 1", ... },
     *        { "id": 2, "title": "Photo 2", ... },
     *        ...12 photos total
     *      ],
     *      "currentPage": 0,
     *      "totalPages": 4,
     *      "totalPhotos": 48,
     *      "pageSize": 12,
     *      "hasNext": true,
     *      "hasPrevious": false
     *    }
     *
     * 6. SPRING PAGE OBJECT:
     *    ===================
     *    Spring Data JPA returns Page<T> with these methods:
     *    - getContent(): List<T> (photos for current page)
     *    - getNumber(): int (current page, 0-indexed)
     *    - getTotalPages(): int (total pages)
     *    - getTotalElements(): long (total items count)
     *    - getSize(): int (page size)
     *    - hasNext(): boolean (has next page?)
     *    - hasPrevious(): boolean (has previous page?)
     *
     *    We map these directly to our DTO fields!
     *
     * 7. TYPICAL USAGE IN CONTROLLER:
     *    =============================
     *    @GetMapping("/my-photos")
     *    public ResponseEntity<GalleryListResponse> getMyPhotos(
     *        @RequestParam(defaultValue = "0") int page,
     *        @RequestParam(defaultValue = "12") int size,
     *        @AuthenticationPrincipal UserDetails userDetails
     *    ) {
     *        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
     *        Page<GalleryPhoto> photoPage = galleryService.getMyPhotos(userId, pageable);
     *
     *        List<GalleryPhotoResponse> photoResponses = photoPage.getContent()
     *            .stream()
     *            .map(GalleryPhotoResponse::fromEntity)
     *            .collect(Collectors.toList());
     *
     *        GalleryListResponse response = GalleryListResponse.fromPage(
     *            photoResponses,
     *            photoPage.getNumber(),
     *            photoPage.getTotalPages(),
     *            photoPage.getTotalElements(),
     *            photoPage.getSize(),
     *            photoPage.hasNext(),
     *            photoPage.hasPrevious()
     *        );
     *
     *        return ResponseEntity.ok(response);
     *    }
     *
     * 8. DEFAULT PAGE SIZE:
     *    ==================
     *    Common page sizes:
     *    - 10: Standard for tables/lists
     *    - 12: Good for photo grids (3x4 or 4x3)
     *    - 20: Good for search results
     *    - 25: Common for admin panels
     *
     *    We use 12 for photo galleries (fits nicely in grid layout)
     *
     * 9. INFINITE SCROLL ALTERNATIVE:
     *    =============================
     *    Instead of page numbers, can use infinite scroll:
     *    - Frontend loads page 0
     *    - User scrolls to bottom
     *    - Frontend loads page 1, appends to list
     *    - Repeat...
     *
     *    Same GalleryListResponse works for both approaches!
     *    - hasNext tells frontend if more data available
     *    - Frontend just increments page number
     */
}
