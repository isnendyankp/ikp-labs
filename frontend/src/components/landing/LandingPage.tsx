'use client';

import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { AboutSection } from './AboutSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { useRouter } from 'next/navigation';

/**
 * LandingPage Component
 *
 * Main landing page container for Kameravue
 * Renders all sections: Navbar, Hero, Features, About, CTA, Footer
 */
export default function LandingPage() {
  const router = useRouter();

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get Started handler - navigate to login
  const handleGetStarted = () => {
    router.push('/login');
  };

  // Learn More handler - scroll to features
  const handleLearnMore = () => {
    scrollToSection('features');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />

        {/* Features Section */}
        <div id="features">
          <FeaturesSection
            features={[
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                ),
                title: 'Upload & Organize',
                description: 'Easily upload your photos and organize them into beautiful galleries with drag-and-drop simplicity.',
              },
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                ),
                title: 'Share Beautifully',
                description: 'Share your galleries with friends, family, or the world. Control who sees what with powerful privacy settings.',
              },
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                ),
                title: 'Discover Moments',
                description: 'Explore stunning public galleries from photographers around the world. Get inspired by beautiful captures.',
              },
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                ),
                title: 'Privacy Control',
                description: 'Your photos, your rules. Set your galleries to private, public, or share with specific people.',
              },
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                ),
                title: 'Mobile Friendly',
                description: 'Access your galleries anywhere, anytime. Fully responsive design works perfectly on all devices.',
              },
              {
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                ),
                title: 'Free Forever',
                description: 'Enjoy unlimited photo uploads and galleries. No hidden fees, no premium tiers. Completely free.',
              },
            ]}
          />
        </div>

        {/* About Section */}
        <div id="about">
          <AboutSection
            stats={{
              users: '10,000+',
              photos: '50,000+',
              tagline: '100% Free Forever',
            }}
          />
        </div>

        {/* CTA Section */}
        <CTASection onGetStarted={handleGetStarted} />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
