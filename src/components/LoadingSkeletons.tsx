export const SplineSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full animate-pulse" />
      <div className="h-4 w-32 mx-auto bg-cyan-300/20 rounded animate-pulse" />
    </div>
  </div>
);

export const ROICalculatorSkeleton = () => (
  <div className="bg-gradient-to-b from-[#00d7ea] via-[#4dd0e1] to-slate-200 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-white/30 rounded-lg w-2/3 mx-auto" />
        <div className="h-6 bg-white/20 rounded w-1/2 mx-auto" />
        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          <div className="bg-white/80 rounded-3xl p-8 space-y-6">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/70 rounded-3xl p-8">
            <div className="h-full flex items-center justify-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="py-16 bg-gradient-to-b from-slate-200 to-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-6">
            <div className="h-16 bg-slate-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PricingSkeleton = () => (
  <div className="py-20 bg-gradient-to-b from-slate-300 to-[#0d1a2a]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-white/20 rounded w-1/2 mx-auto" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-8 h-96" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const FooterSkeleton = () => (
  <div className="bg-[#0d1a2a] py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
