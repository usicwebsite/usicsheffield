import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Restricted - USIC',
  description: 'Your account has been restricted by an administrator.',
};

export default function RestrictedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center shadow-lg">
        {/* Warning Icon */}
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Account Restricted
        </h1>

        {/* Description */}
        <div className="text-gray-300 mb-6 space-y-3">
          <p>
            Your account has been restricted by an administrator due to a violation of our community guidelines or terms of service.
          </p>
          <p className="text-sm">
            This restriction prevents you from accessing most features of the website until the issue is resolved.
          </p>
        </div>

        {/* What to do next */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2">What can you do?</h3>
          <ul className="text-blue-200 text-sm text-left space-y-2">
            <li>• Contact the USIC committee for clarification</li>
            <li>• Review our community guidelines</li>
            <li>• Appeal the restriction if you believe it was made in error</li>
            <li>• Allow time for the issue to be reviewed</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-green-300 font-semibold mb-2">Contact Us</h3>
          <div className="text-green-200 text-sm space-y-1">
            <p>Email: <a href="mailto:islam.circle@sheffield.ac.uk?subject=Account Restriction Inquiry" className="underline hover:text-green-100">islam.circle@sheffield.ac.uk</a></p>
            <p>Or reach out via our social media channels</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold"
          >
            Return to Home
          </Link>

          <a
            href="mailto:islam.circle@sheffield.ac.uk?subject=Account Restriction Inquiry"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold inline-block text-center"
          >
            Contact Us
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-400 text-xs">
          <p>University of Sheffield Islamic Circle (USIC)</p>
          <p>If you believe this restriction was made in error, please contact us immediately.</p>
        </div>
      </div>
    </div>
  );
}
