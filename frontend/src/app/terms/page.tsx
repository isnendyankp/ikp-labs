import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

/**
 * Terms of Service Page
 *
 * Legal terms and conditions for using Kameravue
 */
export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated="January 2026"
      footerLinks={[
        { label: 'Home', href: '/' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Contact', href: 'mailto:isnendyankp@gmail.com' },
      ]}
    >
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Welcome to Kameravue. These Terms of Service govern your use of our photo sharing
          platform. By accessing or using Kameravue, you agree to be bound by these terms.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Kameravue is a free platform that allows users to upload, organize, and share photos
          with others. Please read these terms carefully before using our service.
        </p>
      </section>

      {/* Educational Purpose Disclaimer */}
      <section className="mb-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Educational Purpose</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Kameravue is a learning project.</strong> This platform is created for educational
              and demonstration purposes as part of a fullstack engineering portfolio.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The service is provided as-is for learning purposes. Features are continuously being
              developed and improved as part of the educational journey.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              The source code is publicly available on{' '}
              <a
                href="https://github.com/isnendyankp/ikp-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:no-underline font-medium"
              >
                GitHub
              </a>
              {' '}for review and learning purposes.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Connect with the developer on{' '}
              <a
                href="https://www.linkedin.com/in/isnendyan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:no-underline font-medium inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              {' '}for professional networking.
            </p>
          </div>
        </div>
      </section>

      {/* Terms of Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Terms of Use</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By using Kameravue, you agree to the following:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>You must be at least 13 years old to use this service</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must not share your password with others</li>
          <li>You are responsible for all activities that occur under your account</li>
          <li>You must not use Kameravue for any illegal or unauthorized purpose</li>
          <li>You must not transmit any worms or viruses or any code of a destructive nature</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>Content Ownership:</strong> You retain ownership of all photos and content
          you upload to Kameravue. By uploading content, you grant us a license to store,
          display, and distribute your content solely for the purpose of providing our service.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>Platform Content:</strong> The design, layout, and functionality of
          Kameravue, including all text, graphics, logos, and software, is owned by
          Kameravue and is protected by intellectual property laws.
        </p>
        <p className="text-gray-700 leading-relaxed">
          <strong>License Grant:</strong> You grant Kameravue a worldwide, non-exclusive,
          royalty-free license to use, display, and distribute your content for the purpose
          of operating and improving the service.
        </p>
      </section>

      {/* User-Generated Content */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User-Generated Content</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You are solely responsible for the content you upload to Kameravue. You agree that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Your content will not violate any laws or regulations</li>
          <li>Your content will not infringe on any third-party rights</li>
          <li>Your content will not contain harmful, offensive, or inappropriate material</li>
          <li>You have the right to upload and share the content</li>
          <li>You will not upload content containing viruses or malicious code</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          We reserve the right to remove any content that violates these terms or is
          otherwise inappropriate, without prior notice.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your privacy is important to us. Please review our{' '}
          <Link href="/privacy" className="text-black underline hover:no-underline">
            Privacy Policy
          </Link>
          , which also governs your use of Kameravue, to understand how we collect, use,
          and protect your personal information.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We respect your privacy choices. You can set your galleries to private, public,
          or share with specific people. Anonymous users can favorite photos without revealing
          their identity.
        </p>
      </section>

      {/* Termination */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Termination</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We reserve the right to suspend or terminate your account at any time for any
          reason, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Violation of these Terms of Service</li>
          <li>Fraudulent or illegal activities</li>
          <li>Abuse of other users or the platform</li>
          <li>Inactivity for an extended period</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          Upon termination, your right to use Kameravue will immediately cease. All your
          content may be deleted from our servers.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kameravue is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no
          representations or warranties of any kind, express or implied, including but not
          limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>The accuracy, reliability, or availability of the service</li>
          <li>The products, services, or information provided</li>
          <li>Uninterrupted or error-free operation</li>
          <li>That bugs or errors will be corrected</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          We are not liable for any damages arising from your use of Kameravue, including
          but not limited to direct, indirect, incidental, or consequential damages.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          We reserve the right to modify these Terms of Service at any time. We will notify
          users of significant changes via email or by posting a notice on our platform.
          Your continued use of Kameravue after such modifications constitutes your acceptance
          of the updated terms.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have any questions about these Terms of Service, please contact us:
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
      </section>
    </LegalPageLayout>
  );
}
