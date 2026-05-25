import { lazy, Suspense } from "react";
import Hero from "./components/Hero";
import NewsBanner from "./components/NewsBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  ROICalculatorSkeleton,
  StatsSkeleton,
  PricingSkeleton,
  FooterSkeleton,
} from "./components/LoadingSkeletons";

// Lazy load components that are below the fold with prefetching
const ROICalculator = lazy(() => import("./components/ROICalculator"));
const Stats = lazy(() => import("./components/Stats"));
const Pricing = lazy(() => import("./components/Pricing"));
const Footer = lazy(() => import("./components/Footer"));

export default function App(){
  return (
    <ErrorBoundary fallbackMessage="We're experiencing technical difficulties. Please refresh the page or try again later.">
      <div id="top">
        {/* News Banner - Fixed at top */}
        <NewsBanner />

        {/* Hero loads immediately - it's above the fold */}
        <Hero />

        {/* Below-the-fold components load lazily with skeleton loaders */}
        <Suspense fallback={<ROICalculatorSkeleton />}>
          <ROICalculator />
        </Suspense>

        <Suspense fallback={<StatsSkeleton />}>
          <Stats />
        </Suspense>

        <div className="bg-gradient-to-b from-[#071420] via-[#0a1625] via-[#0d1a2a] to-[#0d1a2a]">
          <Suspense fallback={<PricingSkeleton />}>
            <Pricing />
          </Suspense>
        </div>

        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}