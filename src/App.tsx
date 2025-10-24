import { lazy, Suspense } from "react";
import Hero from "./components/Hero";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load components that are below the fold
const ROICalculator = lazy(() => import("./components/ROICalculator"));
const Stats = lazy(() => import("./components/Stats"));
const Pricing = lazy(() => import("./components/Pricing"));
const Footer = lazy(() => import("./components/Footer"));

// Loading component for Suspense fallback
function SectionLoader() {
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <ErrorBoundary fallbackMessage="We're experiencing technical difficulties. Please refresh the page or try again later.">
      <div id="top">
        {/* Hero loads immediately - it's above the fold */}
        <Hero />

        {/* Below-the-fold components load lazily */}
        <Suspense fallback={<SectionLoader />}>
          <ROICalculator />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Stats />
        </Suspense>

        <div className="bg-gradient-to-b from-[#071420] via-[#0a1625] via-[#0d1a2a] to-[#0d1a2a]">
          <Suspense fallback={<SectionLoader />}>
            <Pricing />
          </Suspense>
        </div>

        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}