import Hero from "./components/Hero";
import ROICalculator from "./components/ROICalculator";
import Pricing from "./components/Pricing";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App(){
  return (
    <ErrorBoundary fallbackMessage="We're experiencing technical difficulties. Please refresh the page or try again later.">
      <div id="top">
        <Hero />
        <ROICalculator />
        <Stats />
        <div className="bg-gradient-to-b from-[#071420] via-[#0a1625] via-[#0d1a2a] to-[#0d1a2a]">
          <Pricing />
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}