/**
 * Favorited Photos Page - Display all photos favorited by current user
 *
 * Features:
 * - Display favorited photos in grid layout (reuse PhotoGrid)
 * - Pagination controls
 * - Empty state: "You haven't favorited any photos yet"
 * - Authentication check
 * - Back to gallery link
 * - Responsive design
 * - PRIVATE collection (only user can see their favorites)
 *
 * KEY DIFFERENCES from Liked Photos Page:
 * ========================================
 * Liked Photos (PUBLIC):
 * - Purpose: Public appreciation (like Instagram likes)
 * - Icon: Heart ❤️
 * - Color: Pink/Red
 * - Cannot like own photos
 * - Shows public like count
 *
 * Favorited Photos (PRIVATE):
 * - Purpose: Personal bookmarks (like YouTube "Watch Later")
 * - Icon: Star ⭐
 * - Color: Yellow/Gold
 * - CAN favorite own photos
 * - Private collection (no public counter)
 *
 * Route: /myprofile/favorited-photos
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '../../../lib/auth';
import { GalleryPhoto, AuthUser } from '../../../types/api';
import { getFavoritedPhotos } from '../../../services/photoFavoriteService';
import PhotoGrid from '../../../components/gallery/PhotoGrid';
import Pagination from '../../../components/gallery/Pagination';
import LogoutButton from '../../../components/LogoutButton';
import SortByDropdown, { SortByOption } from '../../../components/SortByDropdown';

const PHOTOS_PER_PAGE = 12;

export default function FavoritedPhotosPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSort, setCurrentSort] = useState<SortByOption>('newest');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Fetch favorited photos function (wrapped in useCallback to avoid stale closures)
  const fetchFavoritedPhotos = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try{
      const response = await getFavoritedPhotos(currentPage, PHOTOS_PER_PAGE, currentSort);

      if (response.data) {
        // Backend returns GalleryListResponse with photos array AND pagination metadata
        setPhotos(response.data.photos || []);
        setTotalPages(response.data.totalPages || 1);
        console.log('⭐ Favorited photos fetched:', {
          count: response.data.photos?.length || 0,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalPhotos: response.data.totalPhotos
        });
      } else if (response.error) {
        console.error('Failed to fetch favorited photos:', response.error);
        setPhotos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching favorited photos:', error);
      setPhotos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [user, currentPage]);

  // Fetch favorited photos when page or sort changes
  useEffect(() => {
    if (user) {
      fetchFavoritedPhotos();
    }
  }, [user, currentSort, fetchFavoritedPhotos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: SortByOption) => {
    setCurrentSort(sort);
    setCurrentPage(0); // Reset to page 1 when sort changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <span>⭐</span>
                <span>Favorited Photos</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your private photo collection - only you can see this
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/gallery')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Gallery
              </button>
              <button
                onClick={() => router.push('/myprofile/liked-photos')}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                ❤️ Liked Photos
              </button>
              <button
                onClick={() => router.push('/myprofile')}
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
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">🔒 Private Collection: {photos.length} favorited photo{photos.length !== 1 ? 's' : ''} on this page</span>
              {totalPages > 1 && ` (Page ${currentPage + 1} of ${totalPages})`}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Only you can see this collection. Favorites are private bookmarks for your reference.
            </p>
          </div>
        )}

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          loading={loading}
          emptyMessage="You haven't favorited any photos yet. Browse the gallery and save your favorite photos!"
          onFavoriteChange={(photoId) => {
            // Optimistic update: Immediately remove photo from state
            // This gives instant feedback without waiting for API refetch
            console.log('📸 Removing photo from Favorited Photos page:', photoId);
            setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
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

        {/* Back to Gallery Button (shown when empty) */}
        {!loading && photos.length === 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push('/gallery')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Explore Gallery
            </button>
          </div>
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
 *    /myprofile/favorited-photos → This page (PRIVATE collection)
 *    /myprofile/liked-photos → Liked photos page (PUBLIC appreciation)
 *    /gallery → All photos (my photos + public)
 *    /myprofile → User profile
 *
 * 2. DATA FETCHING:
 *    ==============
 *    - Call getFavoritedPhotos(page, size) from photoFavoriteService
 *    - API: GET /api/gallery/favorited-photos?page=0&size=12
 *    - Returns: GalleryListResponse { photos, currentPage, totalPages, ... }
 *    - Same structure as gallery, easy to reuse components!
 *
 * 3. COMPONENT REUSE:
 *    ================
 *    - PhotoGrid → Same component untuk display photos
 *    - Pagination → Same pagination component
 *    - PhotoCard → Inside PhotoGrid, has FavoriteButton
 *    - LogoutButton → Standard logout button
 *
 *    DRY Principle: Don't Repeat Yourself!
 *
 * 4. EMPTY STATE:
 *    ============
 *    "You haven't favorited any photos yet..."
 *    - Friendly message
 *    - Call-to-action: "Explore Gallery" button
 *    - Encourages user to browse and save photos
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
 *    - Click page number → fetchFavoritedPhotos() again
 *    - Scroll to top after page change
 *    - Only show pagination if totalPages > 1
 *
 * 7. AUTHENTICATION:
 *    ===============
 *    - Check isAuthenticated() on mount
 *    - Redirect to /login if not authenticated
 *    - Get user info from JWT token
 *    - All favorited photos endpoints require auth
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
 *    - photos: GalleryPhoto[] → Array of favorited photos
 *    - loading: boolean → Show skeleton cards
 *    - currentPage: number → Current pagination page (0-indexed)
 *    - totalPages: number → Total pages available
 *    - user: AuthUser | null → Current logged-in user
 *
 * 10. USER FLOW:
 *     ==========
 *     1. User browses gallery (public or own photos)
 *     2. User clicks ⭐ on photos (PhotoCard has FavoriteButton)
 *     3. User navigates to "Favorited Photos" (this page)
 *     4. See all favorited photos in grid (PRIVATE collection)
 *     5. Click photo → Go to detail page
 *     6. Can unfavorite from this page (PhotoCard has FavoriteButton)
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
 *     Frontend: getFavoritedPhotos(0, 12)
 *     ↓
 *     API: GET /api/gallery/favorited-photos?page=0&size=12
 *     ↓
 *     Backend: PhotoFavoriteController.getFavoritedPhotos()
 *     ↓
 *     Service: PhotoFavoriteService.getFavoritedPhotos()
 *     ↓
 *     Repository: photoFavoriteRepository.findFavoritedPhotosByUserId()
 *     ↓
 *     Database: SELECT * FROM photo_favorites JOIN gallery_photos WHERE user_id = ?
 *     ↓
 *     Response: { photos: [...], currentPage: 0, totalPages: 3, ... }
 *
 * 13. PRIVACY BY DESIGN:
 *     ==================
 *     - 🔒 Private collection indicator in banner
 *     - "Only you can see this collection" message
 *     - Backend enforces privacy (user_id from JWT)
 *     - Other users CANNOT access this page
 *     - Yellow color scheme (different from pink likes)
 *
 * 14. DIFFERENCES: LIKES vs FAVORITES:
 *     ================================
 *     Liked Photos Page:
 *     - Icon: ❤️ Heart
 *     - Color: Pink (bg-pink-50, border-pink-200)
 *     - Purpose: Public appreciation
 *     - Business rule: Cannot like own photos
 *     - Message: "Photos you've liked from the gallery"
 *
 *     Favorited Photos Page (THIS PAGE):
 *     - Icon: ⭐ Star
 *     - Color: Yellow (bg-yellow-50, border-yellow-200)
 *     - Purpose: Private bookmarks
 *     - Business rule: CAN favorite own photos
 *     - Message: "Your private photo collection"
 *
 * 15. WHY FAVORITED PHOTOS PAGE MATTERS:
 *     ==================================
 *     - Personal bookmarking system (like Pinterest boards)
 *     - Quick reference to important photos
 *     - Portfolio organization (can favorite own work)
 *     - Private inspiration collection
 *     - Save photos for later review
 *     - No social pressure (100% private)
 *
 * 16. REAL-WORLD ANALOGIES:
 *     =====================
 *     Favorited Photos is like:
 *     - YouTube "Watch Later" playlist (private)
 *     - Browser bookmarks (only you see them)
 *     - Instagram "Saved Posts" (private collection)
 *     - Pinterest boards (can be private)
 *     - Apple Photos "Favorites" album
 *
 *     vs. Liked Photos (public appreciation):
 *     - Instagram likes (everyone sees count)
 *     - Facebook reactions (public engagement)
 *     - Twitter likes (visible to others)
 *
 * 17. BOTH FEATURES CAN COEXIST:
 *     ==========================
 *     User can like AND favorite the same photo:
 *     - Like → "I appreciate this photo" (public)
 *     - Favorite → "I want to save this" (private)
 *     - Independent actions, different purposes
 *     - PhotoCard shows both buttons side-by-side
 *
 * 18. FUTURE ENHANCEMENTS:
 *     ====================
 *     - Add "Unfavorite All" button
 *     - Filter by date favorited
 *     - Sort options (most recent, oldest, alphabetical)
 *     - Create multiple favorite collections (folders)
 *     - Add notes/tags to favorited photos
 *     - Export favorited photos list
 *     - Share selected favorites (opt-in public sharing)
 */
