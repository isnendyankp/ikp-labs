"use client";

/**
 * Gallery Grid Skeleton Component
 *
 * Loading placeholder for the gallery photo grid.
 * Renders 12 PhotoCardSkeletons in a responsive grid layout.
 */

import { PhotoCardSkeleton } from "./PhotoCardSkeleton";

export function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Render 12 skeleton cards */}
      {Array.from({ length: 12 }).map((_, index) => (
        <PhotoCardSkeleton key={index} />
      ))}
    </div>
  );
}
