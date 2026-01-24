'use client';

import type { FooterProps } from './landing.types';

/**
 * Footer Component
 *
 * Footer with logo, link columns, and copyright
 * - Desktop: 4-column grid
 * - Mobile: 2-column grid
 * - Gray background for visual separation
 */
export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kameravue</h3>
              <p className="text-gray-600 text-sm">
                Your perfect moments, beautifully captured and shared with the world.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigate('features')}
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <a
                    href="/gallery"
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Gallery
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigate('about')}
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:isnendyankp@gmail.com"
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} Kameravue. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Made with{' '}
              <span className="text-red-500" role="img" aria-label="heart">
                ❤️
              </span>{' '}
              for beautiful moments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
