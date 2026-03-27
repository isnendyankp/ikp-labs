"use client";

import { FeatureCard } from "./FeatureCard";
import type { FeaturesSectionProps } from "./landing.types";

/**
 * FeaturesSection Component
 *
 * Displays feature cards in a responsive grid
 * - Desktop: 3 columns
 * - Tablet: 2 columns
 * - Mobile: 1 column
 * - Alternating background color for visual separation
 */
export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to share beautiful moments
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
