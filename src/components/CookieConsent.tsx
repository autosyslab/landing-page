import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    console.log('✅ Cookies accepted - Initialize analytics');
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
    console.log('❌ Cookies declined - No tracking');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 animate-gentle-fade-in flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
                These cookies help us understand how you interact with our website and improve our services.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By clicking "Accept All Cookies", you consent to the storage of cookies on your device.
                You can choose to decline non-essential cookies by clicking "Decline".
                For more details about the cookies we use and your choices, please read our{' '}
                <a
                  href="/cookie-policy"
                  className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                >
                  Cookie Policy
                </a>
                {' '}and{' '}
                <a
                  href="/privacy-policy"
                  className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>
            <button
              onClick={declineCookies}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
            <button
              onClick={declineCookies}
              className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-semibold transition-colors text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
