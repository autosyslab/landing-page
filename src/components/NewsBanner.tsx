import { useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

export default function NewsBanner() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollContent = scroller.querySelector('.scroll-content') as HTMLElement;
    if (!scrollContent) return;

    // Clone the content for seamless loop
    const clone = scrollContent.cloneNode(true) as HTMLElement;
    scroller.appendChild(clone);

    // No cleanup needed - CSS handles the animation
  }, []);

  const handleBookCall = () => {
    window.open('https://cal.com/iulian-boamfa-rjnurb/30min', '_blank');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="flex items-stretch h-14">
        {/* Left Section - Scrolling Ticker */}
        <div className="flex-1 overflow-hidden relative bg-slate-900/50">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 to-transparent z-10 pointer-events-none" />

          {/* Scrolling content */}
          <div
            ref={scrollerRef}
            className="flex items-center h-full ticker-scroll"
          >
            <div className="scroll-content flex items-center whitespace-nowrap px-8">
              <span className="inline-flex items-center text-white font-semibold text-sm md:text-base">
                Tired of manual work slowing you down? Let smart automations handle the busywork while you focus on growth.
              </span>
              <Zap className="mx-4 text-cyan-400 flex-shrink-0" size={18} fill="currentColor" />

              <span className="inline-flex items-center text-white font-semibold text-sm md:text-base">
                Your business runs better when it runs itself — discover how our AI systems work behind the scenes 24/7.
              </span>
              <Zap className="mx-4 text-cyan-400 flex-shrink-0" size={18} fill="currentColor" />

              <span className="inline-flex items-center text-white font-semibold text-sm md:text-base">
                Ready to scale without hiring more people? Book your free call and we'll show you what's possible with AI.
              </span>
              <Zap className="mx-4 text-cyan-400 flex-shrink-0" size={18} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Middle Section - Vertical Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />

        {/* Right Section - CTA Button */}
        <div className="flex items-center px-4 bg-slate-800/50">
          <button
            onClick={handleBookCall}
            className="
              group relative
              px-6 py-2.5
              bg-gradient-to-r from-cyan-500 to-cyan-400
              hover:from-cyan-400 hover:to-cyan-300
              text-slate-900 font-bold text-sm md:text-base
              rounded-lg
              transition-all duration-300
              shadow-lg shadow-cyan-500/25
              hover:shadow-xl hover:shadow-cyan-400/40
              hover:scale-105
              active:scale-95
              whitespace-nowrap
              focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Book Your Call
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .ticker-scroll {
          animation: ticker-scroll 30s linear infinite;
        }

        .ticker-scroll:hover {
          animation-play-state: paused;
        }

        /* Ensure smooth seamless loop */
        .ticker-scroll > * {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
