"use client";

/**
 * PhotoCard Skeleton Component
 *
 * Loading placeholder for PhotoCard.
 * Matches PhotoCard dimensions exactly for smooth loading transition.
 */

export function PhotoCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Photo Container - Square aspect ratio */}
      <div className="relative w-full pt-[100%] bg-gray-200">
        {/* Privacy Badge Skeleton */}
        <div className="absolute top-2 right-2">
          <div className="w-16 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Photo Info */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-5 bg-gray-200 rounded mb-1 w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Date Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>

        {/* Action Buttons Skeleton */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
          {/* Like Button Skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

          {/* Favorite Button Skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
