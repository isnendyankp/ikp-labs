'use client';

import type { CTASectionProps } from './landing.types';

/**
 * CTASection Component
 *
 * Final call-to-action section with dark background
 * - Centered content layout
 * - Dark gradient background for visual contrast
 * - Prominent CTA button
 * - Trust elements below button
 */
export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to start sharing your moments?
        </h2>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of users capturing life&apos;s beauty. Start your free gallery today.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="px-10 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl mb-8"
        >
          Get Started Free →
        </button>

        {/* Trust Elements */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
