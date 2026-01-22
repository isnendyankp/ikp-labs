import type { ComponentType, SVGProps } from 'react';

/**
 * Feature Card Props
 * Used for individual feature cards in the Features section
 */
export interface FeatureCardProps {
  /** Icon component from Heroicons */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Stats Card Props
 * Used for statistics in the About section
 */
export interface StatsCardProps {
  /** Stat number/label */
  value: string;
  /** Stat description */
  label: string;
  /** Optional icon */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Navbar Props
 */
export interface NavbarProps {
  /** Callback for navigation */
  onNavigate?: (section: string) => void;
}

/**
 * Hero Section Props
 */
export interface HeroSectionProps {
  /** Callback for Get Started button */
  onGetStarted: () => void;
  /** Callback for Learn More button */
  onLearnMore: () => void;
}

/**
 * Features Section Props
 */
export interface FeaturesSectionProps {
  /** Array of feature cards to display */
  features: FeatureCardProps[];
}

/**
 * About Section Props
 */
export interface AboutSectionProps {
  /** Optional stats to display */
  stats?: {
    stat1: string;  // "Public or Private Galleries"
    stat2: string;  // "Anonymous Photo Favorites"
    stat3: string;  // "100% Free Forever"
  };
}

/**
 * CTA Section Props
 */
export interface CTASectionProps {
  /** Callback for Get Started button */
  onGetStarted: () => void;
}

/**
 * Footer Props
 */
export interface FooterProps {
  /** Callback for navigation links */
  onNavigate?: (path: string) => void;
}
