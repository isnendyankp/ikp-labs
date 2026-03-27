"use client";

import type { FooterProps } from "./landing.types";

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
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Kameravue
              </h3>
              <p className="text-gray-600 text-sm">
                Your perfect moments, beautifully captured and shared with the
                world.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigate("features")}
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("/gallery")}
                    className="text-gray-600 hover:text-black text-sm transition-colors"
                  >
                    Gallery
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigate("about")}
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
                <li>
                  <a
                    href="https://github.com/isnendyankp/ikp-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black text-sm transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/isnendyan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black text-sm transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Legal
              </h4>
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
              Made with{" "}
              <span className="text-red-500" role="img" aria-label="heart">
                ❤️
              </span>{" "}
              for beautiful moments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
