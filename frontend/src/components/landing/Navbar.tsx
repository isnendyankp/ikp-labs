'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import type { NavbarProps } from './landing.types';

/**
 * Navbar Component
 *
 * Fixed navigation bar with logo, menu links, and auth buttons
 * - Desktop: Full nav with links and buttons
 * - Mobile: Hamburger menu
 * - Auth-aware: Shows "Gallery" when logged in, "Login + Get Started" when not
 */
export function Navbar({ onNavigate }: NavbarProps) {
  const router = useRouter();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handlers
  const handleNavigate = (section: string) => {
    onNavigate?.(section);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    router.push('/register');
    setIsMobileMenuOpen(false);
  };

  const handleGallery = () => {
    router.push('/gallery');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight">
              Kameravue
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Nav Links */}
            <button
              onClick={() => handleNavigate('features')}
              className="text-gray-600 hover:text-black font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className="text-gray-600 hover:text-black font-medium transition-colors"
            >
              About
            </button>

            {/* Auth Buttons */}
            {isUserAuthenticated ? (
              <button
                onClick={handleGallery}
                className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Gallery
              </button>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-black font-medium transition-colors px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {!isUserAuthenticated && (
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => handleNavigate('features')}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
            >
              Features
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
            >
              About
            </button>
            {!isUserAuthenticated && (
              <>
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
                >
                  Login
                </button>
              </>
            )}
            {isUserAuthenticated && (
              <button
                onClick={handleGallery}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
              >
                Go to Gallery
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
