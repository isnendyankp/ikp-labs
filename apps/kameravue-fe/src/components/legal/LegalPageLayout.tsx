import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Legal Page Layout Props
 */
export interface LegalPageLayoutProps {
  /** Page title */
  title: string;
  /** Last updated date */
  lastUpdated: string;
  /** Page content */
  children: ReactNode;
  /** Additional footer links (optional) */
  footerLinks?: Array<{
    label: string;
    href: string;
  }>;
}

/**
 * LegalPageLayout Component
 *
 * Reusable layout for legal pages (Terms of Service, Privacy Policy, etc.)
 * Provides consistent header, footer, and styling across all legal documents
 *
 * @example
 * ```tsx
 * <LegalPageLayout title="Terms of Service" lastUpdated="January 2026">
 *   <section>Content here...</section>
 * </LegalPageLayout>
 * ```
 */
export function LegalPageLayout({
  title,
  lastUpdated,
  children,
  footerLinks,
}: LegalPageLayoutProps) {
  const currentYear = new Date().getFullYear();

  // Default footer links
  const defaultFooterLinks = [
    { label: "Home", href: "/" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "mailto:isnendyankp@gmail.com" },
  ];

  const links = footerLinks || defaultFooterLinks;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">Last updated: {lastUpdated}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} Kameravue. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
              {links.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
