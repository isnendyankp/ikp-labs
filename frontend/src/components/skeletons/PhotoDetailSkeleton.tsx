/**
 * PhotoDetailSkeleton Component
 *
 * Skeleton loading state for the Photo Detail page.
 * Displays placeholder animations while photo data is loading.
 * Fully responsive: 1 column on mobile, 2 columns on desktop.
 */

export function PhotoDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Large Photo Placeholder */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Right Column - Photo Info Skeleton */}
          <div className="space-y-6">
            {/* Photo Info Card Skeleton */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* Title and Date Row */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {/* Title Skeleton */}
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  {/* Date Skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
                {/* Public/Private Badge Skeleton */}
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse ml-4"></div>
              </div>

              {/* Description Section Skeleton */}
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>

              {/* Like & Favorite Buttons Skeleton */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6">
                  {/* Like Button Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  {/* Favorite Button Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Edit & Delete Buttons Skeleton */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
