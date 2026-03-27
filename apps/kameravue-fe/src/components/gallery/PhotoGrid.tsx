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
 * - Support both like and favorite callbacks
 */

"use client";

import { GalleryPhoto } from "../../types/api";
import PhotoCard from "./PhotoCard";
import { GalleryGridSkeleton } from "../skeletons/GalleryGridSkeleton";
import { EmptyState } from "../ui/EmptyState";

interface PhotoGridProps {
  photos: GalleryPhoto[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  actionText?: string;
  onAction?: () => void;
  onLikeChange?: (photoId: number) => void;
  onFavoriteChange?: (photoId: number) => void;
}

export default function PhotoGrid({
  photos,
  loading = false,
  emptyMessage = "No photos found",
  emptyIcon = "📷",
  actionText,
  onAction,
  onLikeChange,
  onFavoriteChange,
}: PhotoGridProps) {
  // Loading state - show skeleton cards
  if (loading) {
    return <GalleryGridSkeleton />;
  }

  // Empty state
  if (photos.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyMessage}
        actionText={actionText}
        onAction={onAction}
      />
    );
  }

  // Render photo grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onLikeChange={onLikeChange}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
}
