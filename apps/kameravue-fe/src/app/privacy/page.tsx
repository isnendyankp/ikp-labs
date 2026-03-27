import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

/**
 * Privacy Policy Page
 *
 * Privacy practices and data handling for Kameravue
 */
export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="January 2026"
      footerLinks={[
        { label: "Home", href: "/" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Contact", href: "mailto:isnendyankp@gmail.com" },
      ]}
    >
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          1. Overview
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Kameravue, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our photo sharing platform.
        </p>
        <p className="text-gray-700 leading-relaxed">
          By using Kameravue, you agree to the collection and use of information
          in accordance with this policy. If you disagree with any part of this
          policy, please do not use our service.
        </p>
      </section>

      {/* Educational Purpose Disclaimer */}
      <section className="mb-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Educational Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Kameravue is a learning project.</strong> This platform is
              created for educational and demonstration purposes as part of a
              fullstack engineering portfolio.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is still important to us. Please review this Privacy
              Policy to understand how data is handled in this learning
              environment.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              The source code is publicly available on{" "}
              <a
                href="https://github.com/isnendyankp/ikp-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:no-underline font-medium"
              >
                GitHub
              </a>{" "}
              for review and learning purposes.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Connect with the developer on{" "}
              <a
                href="https://www.linkedin.com/in/isnendyan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:no-underline font-medium inline-flex items-center gap-1"
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
              </a>{" "}
              for professional networking.
            </p>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          2. Information We Collect
        </h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.1 Personal Information
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you register for an account, we collect the following
          information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Email address:</strong> Used for account creation and
            authentication
          </li>
          <li>
            <strong>Password:</strong> Securely hashed for account security
          </li>
          <li>
            <strong>Username:</strong> Display name on your profile and
            galleries
          </li>
          <li>
            <strong>Profile information:</strong> Optional details you choose to
            provide
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.2 Content Data
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you use Kameravue, we collect:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Photos:</strong> Images you upload to your galleries
          </li>
          <li>
            <strong>Gallery settings:</strong> Privacy preferences
            (public/private)
          </li>
          <li>
            <strong>Favorites:</strong> Photos you mark as favorites (anonymous)
          </li>
          <li>
            <strong>Metadata:</strong> Upload dates, file sizes, and image
            dimensions
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.3 Usage Data
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          We automatically collect information about your use of the service:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Device information:</strong> Browser type, operating system,
            device type
          </li>
          <li>
            <strong>Log data:</strong> IP address, access times, pages viewed
          </li>
          <li>
            <strong>Usage patterns:</strong> Features used, interactions with
            content
          </li>
        </ul>
      </section>

      {/* Data Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          3. How We Use Your Information
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use the collected information for various purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Service Delivery:</strong> To provide, maintain, and improve
            Kameravue
          </li>
          <li>
            <strong>Authentication:</strong> To verify your identity and secure
            your account
          </li>
          <li>
            <strong>Content Management:</strong> To store, display, and organize
            your photos
          </li>
          <li>
            <strong>Communication:</strong> To send important updates about your
            account
          </li>
          <li>
            <strong>Analytics:</strong> To understand how users interact with
            our platform
          </li>
          <li>
            <strong>Security:</strong> To detect, prevent, and address technical
            issues and fraudulent activity
          </li>
        </ul>
      </section>

      {/* Data Sharing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          4. Information Sharing
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We respect your privacy and do not sell your personal information. We
          may share your information only in the following circumstances:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          4.1 Public Galleries
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you set a gallery to public, your photos and username are visible
          to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>All visitors to the Kameravue platform</li>
          <li>Search engines (if indexed)</li>
          <li>Anyone with the direct gallery link</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          4.2 Private Galleries
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you set a gallery to private, your photos are only visible to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>You (when logged into your account)</li>
          <li>Specific users you choose to share with (if implemented)</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          We never share your private galleries with third parties without your
          explicit permission.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          4.3 Anonymous Favorites
        </h3>
        <p className="text-gray-700 leading-relaxed">
          When you favorite a photo, your identity remains anonymous. Other
          users cannot see who has favorited their photos. This feature is
          completely private.
        </p>
      </section>

      {/* Security */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          5. Data Security
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to
          protect your information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Password Security:</strong> Passwords are securely hashed
            and salted
          </li>
          <li>
            <strong>Encryption:</strong> Data is encrypted in transit using
            HTTPS
          </li>
          <li>
            <strong>Access Control:</strong> Strict access controls to user data
          </li>
          <li>
            <strong>Regular Audits:</strong> Periodic security reviews and
            updates
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          However, no method of transmission over the internet is 100% secure.
          While we strive to protect your data, we cannot guarantee absolute
          security.
        </p>
      </section>

      {/* Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          6. Cookies and Tracking
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use cookies and similar technologies to enhance your experience:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Essential Cookies:</strong> Required for authentication and
            core functionality
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and
            preferences
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how you use
            Kameravue
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          You can control cookie settings through your browser. However,
          disabling cookies may affect the functionality of our service.
        </p>
      </section>

      {/* Third-Party Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          7. Third-Party Services
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kameravue may use third-party services to help operate our platform:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Hosting Services:</strong> To store and serve your photos
          </li>
          <li>
            <strong>Analytics Tools:</strong> To understand user behavior
          </li>
          <li>
            <strong>Email Services:</strong> To send account-related emails
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          These third parties have access to your personal information only to
          perform specific tasks on our behalf and are obligated not to disclose
          or use it for other purposes.
        </p>
      </section>

      {/* User Rights */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          8. Your Rights
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Correction:</strong> Update or correct inaccurate
            information
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your account and data
          </li>
          <li>
            <strong>Export:</strong> Download your photos and data
          </li>
          <li>
            <strong>Objection:</strong> Object to processing of your personal
            data
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          To exercise these rights, please contact us at{" "}
          <a
            href="mailto:isnendyankp@gmail.com"
            className="text-black underline hover:no-underline"
          >
            isnendyankp@gmail.com
          </a>
          .
        </p>
      </section>

      {/* Children's Privacy */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          9. Children&apos;s Privacy
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kameravue is not intended for children under the age of 13. We do not
          knowingly collect personal information from children under 13.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you are a parent or guardian and believe your child has provided us
          with personal information, please contact us, and we will take steps
          to delete such information.
        </p>
      </section>

      {/* Policy Changes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          10. Changes to This Policy
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new policy on this page and updating the
          &quot;Last updated&quot; date. Significant changes will be
          communicated via email or a prominent notice on our platform.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          11. Contact Us
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:isnendyankp@gmail.com"
              className="text-black underline hover:no-underline"
            >
              isnendyankp@gmail.com
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Platform:</strong>{" "}
            <Link href="/" className="text-black underline hover:no-underline">
              Kameravue
            </Link>
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mt-4">
          We will respond to your inquiries within a reasonable timeframe.
        </p>
      </section>
    </LegalPageLayout>
  );
}
