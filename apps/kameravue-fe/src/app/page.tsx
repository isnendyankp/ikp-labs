import LandingPage from "@/components/landing/LandingPage";

/**
 * Root Landing Page Component
 *
 * This is the main entry point of the Kameravue application.
 * Renders the public landing page with navigation to login for authenticated users.
 *
 * The landing page showcases:
 * - Hero section with value proposition
 * - Features overview
 * - About section with statistics
 * - Call-to-action for user registration
 *
 * Route: /
 */
export default function RootPage() {
  return <LandingPage />;
}
