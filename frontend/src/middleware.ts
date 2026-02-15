import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 *
 * Handles route redirects and other request processing before reaching the page.
 *
 * Features:
 * - Redirect /home routes to /myprofile for backward compatibility
 * - Preserves old bookmarks and external links
 * - Maintains SEO with 308 Permanent Redirect
 *
 * This middleware runs on Edge Runtime for optimal performance.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /home to /myprofile (backward compatibility)
  if (pathname.startsWith("/home")) {
    const newPath = pathname.replace("/home", "/myprofile");
    const url = request.nextUrl.clone();
    url.pathname = newPath;

    // Use 308 Permanent Redirect to inform browsers/crawlers
    // that this is a permanent change
    return NextResponse.redirect(url, 308);
  }

  // Continue to the requested page
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * Specify which routes this middleware should run on.
 * Using matcher for better performance - only runs on /home paths.
 */
export const config = {
  matcher: "/home/:path*",
};
