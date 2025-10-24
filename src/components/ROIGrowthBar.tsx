import { useState, useEffect } from 'react';
import { TrendingUp, Zap } from 'lucide-react';

interface ROIGrowthBarProps {
  coverage: number;
  hoursSaved: number;
  maxPotentialHours: number;
}

export default function ROIGrowthBar({ coverage, hoursSaved, maxPotentialHours }: ROIGrowthBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = coverage / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValue(prev => Math.min(prev + increment, coverage));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [coverage]);

  const getColorClass = () => {
    if (coverage >= 80) return 'from-green-500 to-emerald-500';
    if (coverage >= 60) return 'from-blue-500 to-cyan-500';
    if (coverage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getMessage = () => {
    if (coverage >= 80) return 'Excellent automation potential! 🚀';
    if (coverage >= 60) return 'Great automation opportunity! 💪';
    if (coverage >= 40) return 'Good starting point for automation 👍';
    return 'Every bit of automation helps! ⚡';
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColorClass()} flex items-center justify-center shadow-md`}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Automation Potential</h3>
            <p className="text-xs text-slate-600">{getMessage()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black bg-gradient-to-r ${getColorClass()} bg-clip-text text-transparent`}>
            {Math.round(animatedValue)}%
          </div>
          <div className="text-xs text-slate-500">Unlocked</div>
        </div>
      </div>

      <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #64748b 0px, #64748b 1px, transparent 1px, transparent 10px)',
        }} />

        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColorClass()} rounded-full transition-all duration-300 ease-out shadow-lg`}
          style={{ width: `${animatedValue}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-700 drop-shadow-sm">
            {hoursSaved.toLocaleString()} hours automated
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs">
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-slate-300 mx-auto mb-1" />
          <span className="text-slate-500">0%</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${coverage >= 50 ? 'bg-blue-500' : 'bg-slate-300'}`} />
          <span className="text-slate-500">50%</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${coverage >= 100 ? 'bg-green-500' : 'bg-slate-300'}`} />
          <span className="text-slate-500">100%</span>
        </div>
      </div>

      {coverage < 90 && (
        <div className="mt-4 p-3 rounded-lg bg-cyan-50 border border-cyan-200 flex items-start gap-2">
          <Zap className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-800">
            <span className="font-semibold">Unlock {100 - coverage}% more potential!</span>
            <br />
            Increase automation coverage to save an additional {Math.round((maxPotentialHours - hoursSaved))} hours/month.
          </div>
        </div>
      )}
    </div>
  );
}
