/**
 * Gallery Page - Photo Gallery List View
 *
 * Features:
 * - Display user's photos in grid layout
 * - Filter: My Photos vs Public Photos
 * - Pagination controls
 * - Upload button
 * - Authentication check
 * - Responsive design
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated, getUserFromToken } from "../../lib/auth";
import { GalleryPhoto, AuthUser } from "../../types/api";
import { getUserPhotos, getPublicPhotos } from "../../services/galleryService";
import { getLikedPhotos } from "../../services/photoLikeService";
import { getFavoritedPhotos } from "../../services/photoFavoriteService";
import PhotoGrid from "../../components/gallery/PhotoGrid";
import Pagination from "../../components/gallery/Pagination";
import LogoutButton from "../../components/LogoutButton";
import FilterDropdown, { FilterOption } from "../../components/FilterDropdown";
import SortByDropdown, { SortByOption } from "../../components/SortByDropdown";
import { MobileHeaderControls } from "../../components/gallery/MobileHeaderControls";

const PHOTOS_PER_PAGE = 12;

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filter, page, and sortBy from URL query params
  const filterParam = (searchParams.get("filter") as FilterOption) || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sortByParam = (searchParams.get("sortBy") as SortByOption) || "newest";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>(filterParam);
  const [currentPage, setCurrentPage] = useState(pageParam - 1); // Convert to 0-indexed
  const [currentSort, setCurrentSort] = useState<SortByOption>(sortByParam);
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

  // Sync state with URL params
  useEffect(() => {
    setCurrentFilter(filterParam);
    setCurrentPage(pageParam - 1);
    setCurrentSort(sortByParam);
  }, [filterParam, pageParam, sortByParam]);

  // Fetch photos when user, page, filter, or sort changes
  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user, currentPage, currentFilter, currentSort]);

  const fetchPhotos = async () => {
    if (!user) return;

    setLoading(true);

    try {
      let response;

      // Fetch based on current filter (with sorting)
      switch (currentFilter) {
        case "my-photos":
          response = await getUserPhotos(user.id, currentPage, PHOTOS_PER_PAGE, currentSort);
          break;
        case "all":
          response = await getPublicPhotos(currentPage, PHOTOS_PER_PAGE, currentSort);
          break;
        case "liked":
          response = await getLikedPhotos(currentPage, PHOTOS_PER_PAGE, currentSort);
          break;
        case "favorited":
          response = await getFavoritedPhotos(currentPage, PHOTOS_PER_PAGE, currentSort);
          break;
        default:
          response = await getPublicPhotos(currentPage, PHOTOS_PER_PAGE, currentSort);
      }

      if (response.data) {
        // Backend returns GalleryListResponse with photos array AND pagination metadata
        setPhotos(response.data.photos || []);
        setTotalPages(response.data.totalPages || 1);
        console.log("📄 Pagination:", {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          photosCount: response.data.photos?.length || 0,
        });
      } else if (response.error) {
        console.error("Failed to fetch photos:", response.error);
        setPhotos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const newPage = page + 1; // Convert to 1-indexed for URL
    const params = new URLSearchParams();
    params.set("filter", currentFilter);
    params.set("page", newPage.toString());
    params.set("sortBy", currentSort);
    router.push(`/gallery?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filter: FilterOption) => {
    const params = new URLSearchParams();
    params.set("filter", filter);
    params.set("page", "1"); // Reset to page 1 when filter changes
    params.set("sortBy", currentSort); // Keep current sort
    router.push(`/gallery?${params.toString()}`);
  };

  const handleSortChange = (sort: SortByOption) => {
    const params = new URLSearchParams();
    params.set("filter", currentFilter);
    params.set("page", "1"); // Reset to page 1 when sort changes
    params.set("sortBy", sort);
    router.push(`/gallery?${params.toString()}`);
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
              <h1 className="text-3xl font-bold text-gray-900">
                Photo Gallery
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and share your photos
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile Header Controls (filter/sort icons) */}
              <MobileHeaderControls
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                currentSort={currentSort}
                onSortChange={handleSortChange}
              />
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
        {/* Action Bar - Hidden on mobile, shown on desktop */}
        <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Left: Filter and Sort Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <FilterDropdown
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />

            {/* Sort By Dropdown */}
            <SortByDropdown
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Right: Upload Button */}
          <button
            onClick={() => router.push("/gallery/upload")}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow"
          >
            + Upload Photo
          </button>
        </div>

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          loading={loading}
          emptyMessage={
            currentFilter === "my-photos"
              ? "No photos yet. Upload your first photo!"
              : currentFilter === "liked"
              ? "You haven't liked any photos yet. Explore the gallery!"
              : currentFilter === "favorited"
              ? "You haven't favorited any photos yet."
              : "No public photos available"
          }
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
