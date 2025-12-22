'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

/**
 * Root Landing Page Component
 *
 * This page serves as the entry point of the application and automatically
 * redirects users based on their authentication status.
 *
 * Redirect Logic:
 * - Authenticated users → /gallery (main application page)
 * - Unauthenticated users → /login (authentication required)
 *
 * This implements a gallery-centric navigation model where the gallery
 * is the true "home" of the authenticated experience.
 *
 * Route: /
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    if (isAuthenticated()) {
      // User is logged in - redirect to gallery (the new home)
      router.push('/gallery');
    } else {
      // User is not logged in - redirect to login page
      router.push('/login');
    }
  }, [router]);

  // Show loading state while redirecting
  // This component renders briefly before the redirect occurs
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
        <p className="mt-2 text-sm text-gray-500">
          Taking you to the right place
        </p>
      </div>
    </div>
  );
}
