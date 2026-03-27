/**
 * Liked Photos Page - Display all photos liked by current user
 *
 * Features:
 * - Display liked photos in grid layout (reuse PhotoGrid)
 * - Pagination controls
 * - Empty state: "You haven't liked any photos yet"
 * - Authentication check
 * - Back to gallery link
 * - Responsive design
 *
 * Route: /myprofile/liked-photos
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserFromToken } from "../../../lib/auth";
import { GalleryPhoto, AuthUser } from "../../../types/api";
import { getLikedPhotos } from "../../../services/photoLikeService";
import PhotoGrid from "../../../components/gallery/PhotoGrid";
import Pagination from "../../../components/gallery/Pagination";
import LogoutButton from "../../../components/LogoutButton";
import SortByDropdown, {
  SortByOption,
} from "../../../components/SortByDropdown";

const PHOTOS_PER_PAGE = 12;

export default function LikedPhotosPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSort, setCurrentSort] = useState<SortByOption>("newest");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch liked photos function (wrapped in useCallback to avoid stale closures)
  const fetchLikedPhotos = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const response = await getLikedPhotos(
        currentPage,
        PHOTOS_PER_PAGE,
        currentSort,
      );

      if (response.data) {
        // Backend returns GalleryListResponse with photos array AND pagination metadata
        setPhotos(response.data.photos || []);
        setTotalPages(response.data.totalPages || 1);
        console.log("❤️ Liked photos fetched:", {
          count: response.data.photos?.length || 0,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
        });
      } else if (response.error) {
        console.error("Failed to fetch liked photos:", response.error);
        setPhotos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching liked photos:", error);
      setPhotos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, currentSort]);

  // Fetch liked photos when page or sort changes
  useEffect(() => {
    if (user) {
      fetchLikedPhotos();
    }
  }, [user, currentSort, fetchLikedPhotos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sort: SortByOption) => {
    setCurrentSort(sort);
    setCurrentPage(0); // Reset to page 1 when sort changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span>❤️</span>
                <span>Liked Photos</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Photos you&apos;ve liked from the gallery
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/gallery")}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Gallery
              </button>
              <button
                onClick={() => router.push("/myprofile/favorited-photos")}
                className="px-4 py-2 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                ⭐ Favorited Photos
              </button>
              <button
                onClick={() => router.push("/myprofile")}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                My Profile
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort Dropdown */}
        <div className="mb-6">
          <SortByDropdown
            currentSort={currentSort}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Info Banner */}
        {!loading && photos.length > 0 && (
          <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <p className="text-sm text-pink-800">
              <span className="font-semibold">
                Total {photos.length} liked photo
                {photos.length !== 1 ? "s" : ""} on this page
              </span>
              {totalPages > 1 && ` (Page ${currentPage + 1} of ${totalPages})`}
            </p>
          </div>
        )}

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          loading={loading}
          emptyIcon="❤️"
          emptyMessage="You haven't liked any photos yet. Explore the gallery and like some photos!"
          actionText="Go to Gallery"
          onAction={() => router.push("/gallery")}
          onLikeChange={(photoId) => {
            // Optimistic update: Immediately remove photo from state
            // This gives instant feedback without waiting for API refetch
            console.log("📸 Removing photo from Liked Photos page:", photoId);
            setPhotos((prevPhotos) =>
              prevPhotos.filter((p) => p.id !== photoId),
            );
          }}
        />

        {/* Pagination */}
        {!loading && photos.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

/**
 * NOTES UNTUK PEMAHAMAN (PEMULA):
 * =================================
 *
 * 1. ROUTE STRUCTURE:
 *    ================
 *    /myprofile/liked-photos → This page
 *    /gallery → All photos (my photos + public)
 *    /myprofile → User profile
 *
 * 2. DATA FETCHING:
 *    ==============
 *    - Call getLikedPhotos(page, size) from photoLikeService
 *    - API: GET /api/gallery/liked-photos?page=0&size=12
 *    - Returns: GalleryListResponse { photos, currentPage, totalPages, ... }
 *    - Same structure as gallery, easy to reuse components!
 *
 * 3. COMPONENT REUSE:
 *    ================
 *    - PhotoGrid → Same component untuk display photos
 *    - Pagination → Same pagination component
 *    - PhotoCard → Inside PhotoGrid, has LikeButton
 *    - LogoutButton → Standard logout button
 *
 *    DRY Principle: Don't Repeat Yourself!
 *
 * 4. EMPTY STATE:
 *    ============
 *    "You haven't liked any photos yet..."
 *    - Friendly message
 *    - Call-to-action: "Go to Gallery" button
 *    - Encourages user to explore
 *
 * 5. LOADING STATE:
 *    =============
 *    - PhotoGrid handles loading automatically
 *    - Shows skeleton cards while fetching
 *    - Smooth user experience
 *
 * 6. PAGINATION:
 *    ===========
 *    - 12 photos per page (same as gallery)
 *    - Click page number → fetchLikedPhotos() again
 *    - Scroll to top after page change
 *    - Only show pagination if totalPages > 1
 *
 * 7. AUTHENTICATION:
 *    ===============
 *    - Check isAuthenticated() on mount
 *    - Redirect to /login if not authenticated
 *    - Get user info from JWT token
 *    - All liked photos endpoints require auth
 *
 * 8. NAVIGATION:
 *    ===========
 *    Header links:
 *    - Gallery → /gallery (main photo gallery)
 *    - My Profile → /myprofile (user profile page)
 *    - Logout → Clear session
 *
 * 9. STATE MANAGEMENT:
 *    =================
 *    - photos: GalleryPhoto[] → Array of liked photos
 *    - loading: boolean → Show skeleton cards
 *    - currentPage: number → Current pagination page (0-indexed)
 *    - totalPages: number → Total pages available
 *    - user: AuthUser | null → Current logged-in user
 *
 * 10. USER FLOW:
 *     ==========
 *     1. User browses gallery
 *     2. User clicks ❤️ on photos (PhotoCard has LikeButton)
 *     3. User navigates to "Liked Photos" (this page)
 *     4. See all liked photos in grid
 *     5. Click photo → Go to detail page
 *     6. Can unlike from this page (PhotoCard has LikeButton)
 *
 * 11. RESPONSIVE DESIGN:
 *     ==================
 *     - PhotoGrid: 1-4 columns based on screen size
 *     - Mobile: 1 column
 *     - Tablet: 2 columns
 *     - Desktop: 3-4 columns
 *     - All handled by PhotoGrid component!
 *
 * 12. INTEGRATION WITH BACKEND:
 *     =========================
 *     Frontend: getLikedPhotos(0, 12)
 *     ↓
 *     API: GET /api/gallery/liked-photos?page=0&size=12
 *     ↓
 *     Backend: PhotoLikeController.getLikedPhotos()
 *     ↓
 *     Service: PhotoLikeService.getLikedPhotos()
 *     ↓
 *     Repository: photoLikeRepository.findLikedPhotosByUserId()
 *     ↓
 *     Database: SELECT * FROM photo_likes JOIN gallery_photos WHERE user_id = ?
 *     ↓
 *     Response: { photos: [...], currentPage: 0, totalPages: 3, ... }
 *
 * 13. WHY LIKED PHOTOS PAGE MATTERS:
 *     ==============================
 *     - Easy access to favorite photos
 *     - Curated collection (personal Pinterest!)
 *     - Quick reference to liked content
 *     - Engagement tracking
 *     - User personalization
 *
 * 14. FUTURE ENHANCEMENTS:
 *     ====================
 *     - Add "Unlike All" button
 *     - Filter by date liked
 *     - Sort options (most recent, oldest)
 *     - Share liked photos collection
 *     - Export liked photos list
 */
