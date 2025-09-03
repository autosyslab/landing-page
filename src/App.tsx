import React from "react";
import Hero from "./components/Hero";
import ROICalculator from "./components/ROICalculator";
import Pricing from "./components/Pricing";
import Stats from "./components/Stats";
import Footer from "./components/Footer";

export default function App() {
  // Preload critical resources
  React.useEffect(() => {
    // Preload Spline scene
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div id="top" className="overflow-x-hidden">
      <main>
        <Hero />
        <ROICalculator />
        <Stats />
        <div className="bg-gradient-to-b from-[#071420] via-[#0a1625] via-[#0d1a2a] to-[#0d1a2a]">
          <Pricing />
        </div>
      <Footer />
    </div>
  );
}
}
  )
}