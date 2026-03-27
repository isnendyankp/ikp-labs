/**
 * LandingPageSkeleton Component
 *
 * Skeleton loading states for the landing page sections
 * Displays placeholder animations while content is loading
 */

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Headline Skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Subheadline Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="hidden lg:block">
            <div className="h-[500px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Skeleton */}
        <div className="text-center mb-16">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mt-4 animate-pulse"></div>
        </div>

        {/* Feature Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 space-y-4">
              {/* Icon Skeleton */}
              <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>

              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>

            {/* Description Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASectionSkeleton() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-full mx-auto animate-pulse"></div>
        </div>

        {/* CTA Button Skeleton */}
        <div className="mt-8">
          <div className="h-12 bg-gray-700 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Trust Elements Skeleton */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-40 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-36 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>

          {/* Nav Links Skeleton */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>

          {/* Mobile Menu Button Skeleton */}
          <div className="lg:hidden">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>

          {/* Column 2 - Product */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>

          {/* Column 3 - Company */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>

          {/* Column 4 - Legal */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
