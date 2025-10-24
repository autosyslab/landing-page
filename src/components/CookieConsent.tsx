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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-gentle-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 md:mr-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                  By clicking "Accept", you consent to our use of cookies.
                  <a
                    href="/cookie-policy"
                    className="text-cyan-600 hover:text-cyan-700 underline ml-1"
                  >
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors text-sm"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-semibold text-sm shadow-lg"
            >
              Accept Cookies
            </button>
            <button
              onClick={declineCookies}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
