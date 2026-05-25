import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: January 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              AutoSys Lab ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">1. Information You Provide</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Contact information when you book a consultation (name, email, phone)</li>
              <li>Business information you share during consultations</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">2. Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent on site)</li>
              <li>IP address and general location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>To provide and improve our services</li>
              <li>To communicate with you about our services</li>
              <li>To analyze website usage and optimize user experience</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our website (hosting, analytics, calendar booking)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Withdraw consent at any time</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience.
              You can control cookies through your browser settings. For more information, see our
              <a href="/cookie-policy" className="text-cyan-600 hover:text-cyan-700 underline ml-1">
                Cookie Policy
              </a>.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data.
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Our services are not directed to individuals under 18 years of age.
              We do not knowingly collect personal information from children.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </p>
          </div>

          <div className="bg-cyan-50 rounded-2xl border border-cyan-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-slate-700">
              <p><strong>Company:</strong> AutoSys Lab SRL</p>
              <p><strong>Email:</strong> privacy@autosyslab.com</p>
              <p><strong>Website:</strong> <a href="https://autosyslab.com" className="text-cyan-600 hover:text-cyan-700 underline">autosyslab.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
