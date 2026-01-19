'use client';

import Image from 'next/image';
import type { HeroSectionProps } from './landing.types';

/**
 * HeroSection Component
 *
 * Main hero section with headline, subheadline, and CTA buttons
 * - Desktop: 2-column layout (text left, image right)
 * - Mobile: Stacked layout (text top, image bottom)
 * - Min height: full viewport height
 */
export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your perfect moments,{' '}
              <span className="text-black">beautifully captured</span> and shared with the world
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Share life&apos;s beautiful moments with stunning photo galleries that bring your
              memories to life. Start sharing today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </button>
              <button
                onClick={onLearnMore}
                className="px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Learn More →
              </button>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Right Column - Hero Image */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-image.jpg"
                alt="Beautiful photography moment being captured"
                width={800}
                height={600}
                priority
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Elements (Optional decorative elements) */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gray-100 rounded-2xl -z-10 hidden sm:block" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gray-50 rounded-2xl -z-10 hidden sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
