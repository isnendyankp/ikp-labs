/**
 * PhotoCard Component
 *
 * Card component untuk display single photo di gallery grid.
 *
 * Features:
 * - Photo preview dengan aspect ratio 1:1
 * - Title & description display
 * - Public/Private badge
 * - Click to view detail
 * - Responsive design
 * - Hover effects
 * - Like button (public appreciation)
 * - Favorite button (private bookmarks)
 * - Scroll position preservation before navigation
 */

'use client';

import { GalleryPhoto } from '../../types/api';
import { getPhotoUrl } from '../../services/galleryService';
import { getUserFromToken } from '../../lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import LikeButton from '../LikeButton';
import FavoriteButton from '../FavoriteButton';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

interface PhotoCardProps {
  photo: GalleryPhoto;
  onLikeChange?: (photoId: number) => void;
  onFavoriteChange?: (photoId: number) => void;
}

export default function PhotoCard({ photo, onLikeChange, onFavoriteChange }: PhotoCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = getUserFromToken();
  const { saveScrollPosition } = useScrollRestoration();

  // Get current filter, page, and sort from URL
  const filter = (searchParams.get('filter') as 'all' | 'my-photos' | 'liked' | 'favorited') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sortBy') as 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited') || 'newest';

  const handleClick = () => {
    // Save scroll position before navigating to photo detail
    saveScrollPosition(filter, page, sort, photo.id.toString());
    // Navigate to photo detail page
    router.push(`/gallery/${photo.id}`);
  };

  const photoUrl = getPhotoUrl(photo.filePath);

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* Photo Container - Square aspect ratio */}
      <div className="relative w-full pt-[100%] bg-gray-100">
        <img
          src={photoUrl}
          alt={photo.title || 'Gallery photo'}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Privacy Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`
              px-2 py-1 text-xs font-medium rounded
              ${photo.isPublic
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-white'
              }
            `}
          >
            {photo.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Photo Info */}
      <div className="p-4">
        {/* Title */}
        {photo.title && (
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {photo.title}
          </h3>
        )}

        {/* Description */}
        {photo.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {photo.description}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-gray-400 mt-2">
          {new Date(photo.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        {/* Action Buttons: Like & Favorite */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
          {/* Like Button - Public appreciation */}
          <LikeButton
            photoId={photo.id}
            initialIsLiked={photo.isLikedByUser}
            initialLikeCount={photo.likeCount}
            size="small"
            onLikeChange={onLikeChange}
            isOwnPhoto={currentUser?.id === photo.userId}
          />

          {/* Favorite Button - Private bookmarks */}
          <FavoriteButton
            photoId={photo.id}
            initialIsFavorited={photo.isFavoritedByUser}
            size="small"
            onFavoriteChange={onFavoriteChange}
          />
        </div>
      </div>
    </div>
  );
}
