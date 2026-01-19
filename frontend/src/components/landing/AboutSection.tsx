'use client';

import type { AboutSectionProps } from './landing.types';

/**
 * AboutSection Component
 *
 * About section with mission text and statistics
 * - Desktop: 2-column layout (text left, stats right)
 * - Mobile: Stacked layout
 * - White background for alternating visual rhythm
 */
export function AboutSection({ stats }: AboutSectionProps) {
  return (
    <section className="py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re on a mission to preserve your memories
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Mission Text */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Kameravue was born from a simple belief that everyone deserves to beautifully
              share their life&apos;s moments. We believe photos are more than just images -
              they&apos;re stories.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform makes it easy to upload, organize, and share those stories with the
              people who matter most. Whether you&apos;re a professional photographer or just
              love capturing memories, Kameravue is for you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join thousands of users who trust Kameravue to store and share their most precious
              moments.
            </p>
          </div>

          {/* Right Column - Stats */}
          {stats && (
            <div className="space-y-6">
              {/* Users Stat */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-black">{stats.users}</p>
                    <p className="text-gray-600 font-medium">Active Users</p>
                  </div>
                </div>
              </div>

              {/* Photos Stat */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-black">{stats.photos}</p>
                    <p className="text-gray-600 font-medium">Photos Shared</p>
                  </div>
                </div>
              </div>

              {/* Free Stat */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-black">
                      {stats.tagline}
                    </p>
                    <p className="text-gray-600 font-medium">No hidden fees</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
