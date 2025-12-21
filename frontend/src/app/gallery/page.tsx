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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '../../lib/auth';
import { GalleryPhoto, AuthUser } from '../../types/api';
import { getUserPhotos, getPublicPhotos } from '../../services/galleryService';
import PhotoGrid from '../../components/gallery/PhotoGrid';
import Pagination from '../../components/gallery/Pagination';
import LogoutButton from '../../components/LogoutButton';

const PHOTOS_PER_PAGE = 12;

export default function GalleryPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'my-photos' | 'public'>('my-photos');

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

  // Fetch photos when page or view mode changes
  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user, currentPage, viewMode]);

  const fetchPhotos = async () => {
    if (!user) return;

    setLoading(true);

    try {
      let response;
      if (viewMode === 'my-photos') {
        response = await getUserPhotos(user.id, currentPage, PHOTOS_PER_PAGE);
      } else {
        response = await getPublicPhotos(currentPage, PHOTOS_PER_PAGE);
      }

      if (response.data) {
        // Backend returns GalleryListResponse with photos array AND pagination metadata
        setPhotos(response.data.photos || []);
        setTotalPages(response.data.totalPages || 1);
        console.log('📄 Pagination:', {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          photosCount: response.data.photos?.length || 0
        });
      } else if (response.error) {
        console.error('Failed to fetch photos:', response.error);
        setPhotos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (mode: 'my-photos' | 'public') => {
    setViewMode(mode);
    setCurrentPage(0); // Reset to first page
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
              <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and share your photos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/home/liked-photos')}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <span>❤️</span>
                <span>Liked Photos</span>
              </button>
              <button
                onClick={() => router.push('/home/favorited-photos')}
                className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
              >
                <span>⭐</span>
                <span>Favorited Photos</span>
              </button>
              <button
                onClick={() => router.push('/home')}
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
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* View Mode Tabs */}
          <div className="flex bg-white rounded-lg shadow p-1">
            <button
              onClick={() => handleViewModeChange('my-photos')}
              className={`
                px-6 py-2 rounded-md font-medium transition-colors
                ${viewMode === 'my-photos'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              My Photos
            </button>
            <button
              onClick={() => handleViewModeChange('public')}
              className={`
                px-6 py-2 rounded-md font-medium transition-colors
                ${viewMode === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Public Photos
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => router.push('/gallery/upload')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow"
          >
            + Upload Photo
          </button>
        </div>

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          loading={loading}
          emptyMessage={
            viewMode === 'my-photos'
              ? 'No photos yet. Upload your first photo!'
              : 'No public photos available'
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
