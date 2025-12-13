/**
 * PhotoGrid Component
 *
 * Grid layout untuk display multiple PhotoCards.
 *
 * Features:
 * - Responsive grid (1-4 columns based on screen size)
 * - Loading state with skeletons
 * - Empty state message
 * - Flexible gap between cards
 */

'use client';

import { GalleryPhoto } from '../../types/api';
import PhotoCard from './PhotoCard';

interface PhotoGridProps {
  photos: GalleryPhoto[];
  loading?: boolean;
  emptyMessage?: string;
  onLikeChange?: (photoId: number) => void;
}

export default function PhotoGrid({
  photos,
  loading = false,
  emptyMessage = 'No photos found',
  onLikeChange
}: PhotoGridProps) {
  // Loading state - show skeleton cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg overflow-hidden animate-pulse">
            <div className="w-full pt-[100%] bg-gray-300"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // Render photo grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onLikeChange={onLikeChange} />
      ))}
    </div>
  );
}
