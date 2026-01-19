'use client';

import type { FeatureCardProps } from './landing.types';

/**
 * FeatureCard Component
 *
 * Reusable card component for displaying features
 * - Icon + title + description layout
 * - Hover effect: scale and shadow
 * - Responsive: consistent sizing across breakpoints
 */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <article className="group p-6 bg-white border border-gray-200 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300">
      {/* Icon */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
        <Icon />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </article>
  );
}
