/**
 * Favorited Photos Page - Alias Route
 *
 * This page serves as an alias route for /gallery/favorited
 * It redirects to the main implementation at /myprofile/favorited-photos
 *
 * Why alias route?
 * - Tests expect /gallery/favorited (semantic grouping with gallery features)
 * - Main implementation is at /myprofile/favorited-photos (established route)
 * - This alias ensures backward compatibility while supporting test expectations
 *
 * Route: /gallery/favorited → redirects to → /myprofile/favorited-photos
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoritedPhotosAliasPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main favorited photos implementation
    router.replace('/myprofile/favorited-photos');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to favorited photos...</p>
      </div>
    </div>
  );
}
