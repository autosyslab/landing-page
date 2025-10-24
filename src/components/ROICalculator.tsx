import React, { useState, useEffect } from "react";
import { content } from "../content";
import { computeROI } from "../lib/roi";
import { fmtCurrency } from "../lib/format";
import { TrendingUp, Clock, Users, Zap, Target, DollarSign, Sparkles } from "lucide-react";

export default function ROICalculator(){
  const C = content.roi;
  const [monthlyHours, setMonthlyHours] = useState<number | ''>(C.defaults.monthlyHours);
  const [hourlyCost, setHourlyCost] = useState<number | ''>(C.defaults.hourlyCost);
  const [employees, setEmployees] = useState<number | ''>(C.defaults.employees);
  const [coverage, setCoverage] = useState(C.defaults.coverage);
  const [out, setOut] = useState<{hoursSaved:number; monthlySavings:number; annual:number} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const calc = () => {
    setIsAnimating(true);
    setCtaVisible(false);
    setTimeout(() => {
      const hours = typeof monthlyHours === 'number' ? monthlyHours : 0;
      const cost = typeof hourlyCost === 'number' ? hourlyCost : 0;
      const emp = typeof employees === 'number' ? employees : 0;
      setOut(computeROI(hours, cost, emp, coverage));
      setIsAnimating(false);
      // Show CTA after all number animations complete (800ms delay)
      setTimeout(() => setCtaVisible(true), 800);
    }, 800);
  };

  const reset = () => { 
    setMonthlyHours(''); 
    setHourlyCost(''); 
    setEmployees(''); 
    setCoverage(C.defaults.coverage); 
    setOut(null);
    setIsAnimating(false);
    setCtaVisible(false);
  };

  return (
    <section id="main-content" className="bg-gradient-to-b from-[#00d7ea] via-[#4dd0e1] via-[#87ceeb] via-[#b0c4de] via-slate-200 to-slate-400 -mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            <span className="text-white drop-shadow-lg">{C.heading}</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90 drop-shadow-sm max-w-3xl mx-auto font-medium">{C.sub}</p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-10">
          {/* Left: Enhanced Inputs */}
          <form onSubmit={(e) => { e.preventDefault(); calc(); }} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Calculate Your Transformation</h3>
            </div>

            <EnhancedInput
              id="monthly-hours"
              icon={<Clock className="w-4 h-4 text-cyan-600" />}
              label="Hours wasted on manual tasks monthly"
              description="Time your team loses to repetitive work"
            >
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border-2 border-slate-300 focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] p-4 text-slate-800 bg-gradient-to-r from-white to-cyan-50/80 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:bg-gradient-to-r hover:from-cyan-50/80 hover:to-white"
                value={monthlyHours}
                onChange={e=>setMonthlyHours(e.target.value === '' ? '' : +e.target.value)}
              />
            </EnhancedInput>

            <EnhancedInput
              id="hourly-cost"
              icon={<DollarSign className="w-4 h-4 text-cyan-600" />}
              label="Cost per hour (including benefits)"
              description="True hourly cost of your workforce"
            >
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border-2 border-slate-300 focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] p-4 text-slate-800 bg-gradient-to-r from-white to-cyan-50/80 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:bg-gradient-to-r hover:from-cyan-50/80 hover:to-white"
                value={hourlyCost}
                onChange={e=>setHourlyCost(e.target.value === '' ? '' : +e.target.value)}
              />
            </EnhancedInput>

            <EnhancedInput
              id="employees"
              icon={<Users className="w-4 h-4 text-cyan-600" />}
              label="Team members affected"
              description="People who'll benefit from automation"
            >
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border-2 border-slate-300 focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] p-4 text-slate-800 bg-gradient-to-r from-white to-cyan-50/80 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:bg-gradient-to-r hover:from-cyan-50/80 hover:to-white"
                value={employees}
                onChange={e=>setEmployees(e.target.value === '' ? '' : +e.target.value)}
              />
            </EnhancedInput>

            <div className="mt-8 group">
              <div className="relative">
                {/* Animated background glow for slider */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
                
                <div className="relative bg-gradient-to-br from-white to-purple-50/50 rounded-2xl border border-purple-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <label htmlFor="automation-coverage" className="font-bold text-slate-800 text-lg">Automation Impact</label>
                    </div>
                    <span className="text-purple-600 font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">{coverage}%</span>
                  </div>

                  <div className="relative mb-4">
                    <input
                      id="automation-coverage"
                      type="range"
                      min={10}
                      max={95}
                      value={coverage}
                      onChange={e=>setCoverage(+e.target.value)}
                      aria-label="Automation coverage percentage"
                      aria-valuemin={10}
                      aria-valuemax={95}
                      aria-valuenow={coverage}
                      aria-valuetext={`${coverage} percent`}
                      className="w-full h-3 bg-gradient-to-r from-slate-200 to-cyan-100 rounded-lg appearance-none slider shadow-inner hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${coverage}%, #e2e8f0 ${coverage}%, #cbd5e1 100%)`
                      }}
                    />
                    {/* Animated glow on track */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-500 mb-4 font-medium">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                      <p className="text-lg font-bold text-slate-800 tracking-tight">
                        How much of your manual work can be automated?
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 ml-7">This determines your transformation potential</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <button
                type="submit"
                disabled={isAnimating}
                className="group relative overflow-hidden rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg hover:shadow-xl disabled:opacity-70 transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <span className={`transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                  🚀 Calculate My Savings
                </span>
                {isAnimating && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={reset}
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 hover:underline"
              >
                Reset Fields
              </button>
            </div>
          </form>

          {/* Right: Enhanced Results with Animations */}
          <div className="rounded-3xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl p-6 sm:p-8">
            {isAnimating ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-white animate-bounce" />
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Crunching the Numbers...</h3>
                <p className="text-slate-600">Calculating your automation potential</p>
              </div>
            ) : !out ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="mb-6 relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span className="text-4xl">💡</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Ready to Discover Your Potential?</h3>
                <p className="text-lg text-slate-600 max-w-xs leading-relaxed">
                  Enter your numbers above and see how much time and money you could save with automation.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Your Automation Impact</h3>
                </div>
                
                <AnimatedResultRow 
                  icon="⏰"
                  label="Hours You'll Get Back Each Month"
                  value={`${out.hoursSaved.toLocaleString()}`}
                  unit="hours"
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                  delay={0}
                />
                
                <AnimatedResultRow 
                  icon="💰"
                  label="Money Back In Your Pocket Monthly"
                  value={fmtCurrency(out.monthlySavings)}
                  unit=""
                  color="text-green-600"
                  bgColor="bg-green-50"
                  delay={200}
                />
                
                <AnimatedResultRow 
                  icon="🚀"
                  label="Your Annual Financial Gain"
                  value={fmtCurrency(out.annual)}
                  unit=""
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                  delay={400}
                  isHighlight
                />

                <div className={`
                  mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100
                  transform transition-all duration-700 ease-out
                  ${ctaVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
                `}>
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚡</span>
                        <span className="font-bold text-slate-800">Ready to make this real?</span>
                      </div>
                      <p className="text-sm text-slate-600">These savings are waiting for you. Let's build your automation solution.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <a 
                        href="https://cal.com/iulian-boamfa-rjnurb/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden inline-flex items-center rounded-xl px-6 py-3 font-bold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>Start My Automation</span>
                          <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">🚀</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EnhancedInput({ icon, label, description, children, id }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <label htmlFor={id} className="font-semibold text-slate-800">
          {label}
        </label>
      </div>
      <p id={`${id}-description`} className="text-sm text-slate-600 mb-3">
        {description}
      </p>
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': `${id}-description`,
        'aria-required': 'true'
      })}
    </div>
  );
}

function AnimatedResultRow({ icon, label, value, unit, color, bgColor, delay, isHighlight }: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  bgColor: string;
  delay: number;
  isHighlight?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`
      ${isHighlight ? 'mb-6 p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50' : 'mb-4'}
      transform transition-all duration-700 ease-out
      ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
    `}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
            <span className="text-lg">{icon}</span>
          </div>
          <div>
            <div className={`font-medium ${isHighlight ? 'text-purple-900' : 'text-slate-700'}`}>{label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${color} ${isVisible ? 'animate-pulse' : ''}`}>
            {value} <span className="text-sm font-medium">{unit}</span>
          </div>
        </div>
      </div>
      
      {isHighlight && (
        <div className="mt-3 h-2 bg-purple-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${delay + 300}ms`
            }}
          />
        </div>
      )}
    </div>
  );
}