import { AlertTriangle, Clock } from 'lucide-react';
import { useSavingsTicker } from '../hooks/useSavingsTicker';
import { fmtCurrency } from '../lib/format';

interface SavingsTickerProps {
  monthlySavings: number;
  isActive: boolean;
}

export default function SavingsTicker({ monthlySavings, isActive }: SavingsTickerProps) {
  const currentLoss = useSavingsTicker(monthlySavings, isActive);
  const costPerMinute = monthlySavings / (30 * 24 * 60);

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl border-2 border-red-300">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Cost of Waiting</h3>
            <p className="text-xs text-white/80">Money lost every moment without automation</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/90">Since you calculated:</span>
            <Clock className="w-4 h-4 text-white/70 animate-pulse" />
          </div>
          <div className="text-4xl font-black text-white tabular-nums tracking-tight">
            {fmtCurrency(currentLoss)}
          </div>
          <div className="text-xs text-white/70 mt-1">...and counting</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-xs text-white/80 mb-1">Per Minute</div>
            <div className="text-lg font-bold text-white">
              {fmtCurrency(costPerMinute)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-xs text-white/80 mb-1">Per Hour</div>
            <div className="text-lg font-bold text-white">
              {fmtCurrency(costPerMinute * 60)}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-white/90 font-medium">
          ⏰ Every second counts. Act now to stop the bleeding.
        </div>
      </div>
    </div>
  );
}
