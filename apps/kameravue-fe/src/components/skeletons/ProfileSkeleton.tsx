/**
 * ProfileSkeleton Component
 *
 * Skeleton loading state for the My Profile page.
 * Displays placeholder animations while profile data is loading.
 * Fully responsive: 1 column on mobile, 3 columns on desktop.
 */

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back to Gallery Link Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>

          {/* Header Title and Logout Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Section Title */}
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>

              {/* Profile Picture Circle Skeleton */}
              <div className="flex justify-center mb-6">
                <div className="h-40 w-40 rounded-full bg-gray-200 animate-pulse"></div>
              </div>

              {/* Change Picture Button Skeleton */}
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>

          {/* Right Column - User Information Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Welcome Message Skeleton */}
              <div className="h-8 bg-gray-200 rounded w-56 mb-6 animate-pulse"></div>

              {/* User Info Fields Skeleton */}
              <div className="space-y-6 mb-8">
                {/* Name Field */}
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Email Field */}
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                {/* User ID Field */}
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* Quick Actions Section Skeleton */}
              <div className="pt-6 border-t border-gray-200">
                {/* Section Title */}
                <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>

                {/* Go to Gallery Button Skeleton */}
                <div className="h-12 bg-gray-200 rounded w-full animate-pulse mb-3"></div>

                {/* Description Text Skeleton */}
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
