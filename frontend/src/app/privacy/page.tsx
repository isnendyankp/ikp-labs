import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

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
        { label: 'Home', href: '/' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact', href: 'mailto:isnendyankp@gmail.com' },
      ]}
    >
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Kameravue, we take your privacy seriously. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our photo
          sharing platform.
        </p>
        <p className="text-gray-700 leading-relaxed">
          By using Kameravue, you agree to the collection and use of information in accordance
          with this policy. If you disagree with any part of this policy, please do not use
          our service.
        </p>
      </section>

      {/* Data Collection */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.1 Personal Information
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you register for an account, we collect the following information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Email address:</strong> Used for account creation and authentication</li>
          <li><strong>Password:</strong> Securely hashed for account security</li>
          <li><strong>Username:</strong> Display name on your profile and galleries</li>
          <li><strong>Profile information:</strong> Optional details you choose to provide</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.2 Content Data
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you use Kameravue, we collect:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Photos:</strong> Images you upload to your galleries</li>
          <li><strong>Gallery settings:</strong> Privacy preferences (public/private)</li>
          <li><strong>Favorites:</strong> Photos you mark as favorites (anonymous)</li>
          <li><strong>Metadata:</strong> Upload dates, file sizes, and image dimensions</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          2.3 Usage Data
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          We automatically collect information about your use of the service:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Device information:</strong> Browser type, operating system, device type</li>
          <li><strong>Log data:</strong> IP address, access times, pages viewed</li>
          <li><strong>Usage patterns:</strong> Features used, interactions with content</li>
        </ul>
      </section>

      {/* Data Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use the collected information for various purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Service Delivery:</strong> To provide, maintain, and improve Kameravue</li>
          <li><strong>Authentication:</strong> To verify your identity and secure your account</li>
          <li><strong>Content Management:</strong> To store, display, and organize your photos</li>
          <li><strong>Communication:</strong> To send important updates about your account</li>
          <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
          <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
        </ul>
      </section>

      {/* Data Sharing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We respect your privacy and do not sell your personal information. We may share your
          information only in the following circumstances:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          4.1 Public Galleries
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you set a gallery to public, your photos and username are visible to:
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
          We never share your private galleries with third parties without your explicit
          permission.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          4.3 Anonymous Favorites
        </h3>
        <p className="text-gray-700 leading-relaxed">
          When you favorite a photo, your identity remains anonymous. Other users cannot see
          who has favorited their photos. This feature is completely private.
        </p>
      </section>

      {/* Security */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to protect your
          information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Password Security:</strong> Passwords are securely hashed and salted</li>
          <li><strong>Encryption:</strong> Data is encrypted in transit using HTTPS</li>
          <li><strong>Access Control:</strong> Strict access controls to user data</li>
          <li><strong>Regular Audits:</strong> Periodic security reviews and updates</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          However, no method of transmission over the internet is 100% secure. While we strive
          to protect your data, we cannot guarantee absolute security.
        </p>
      </section>

      {/* Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use cookies and similar technologies to enhance your experience:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you use Kameravue</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          You can control cookie settings through your browser. However, disabling cookies may
          affect the functionality of our service.
        </p>
      </section>

      {/* Third-Party Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kameravue may use third-party services to help operate our platform:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Hosting Services:</strong> To store and serve your photos</li>
          <li><strong>Analytics Tools:</strong> To understand user behavior</li>
          <li><strong>Email Services:</strong> To send account-related emails</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          These third parties have access to your personal information only to perform specific
          tasks on our behalf and are obligated not to disclose or use it for other purposes.
        </p>
      </section>

      {/* User Rights */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Export:</strong> Download your photos and data</li>
          <li><strong>Objection:</strong> Object to processing of your personal data</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          To exercise these rights, please contact us at{' '}
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kameravue is not intended for children under the age of 13. We do not knowingly
          collect personal information from children under 13.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you are a parent or guardian and believe your child has provided us with personal
          information, please contact us, and we will take steps to delete such information.
        </p>
      </section>

      {/* Policy Changes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you of any
          changes by posting the new policy on this page and updating the "Last updated" date.
          Significant changes will be communicated via email or a prominent notice on our
          platform.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy,
          please contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong>{' '}
            <a
              href="mailto:isnendyankp@gmail.com"
              className="text-black underline hover:no-underline"
            >
              isnendyankp@gmail.com
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Platform:</strong>{' '}
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
