export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-28"
          >
            <div className="h-4 bg-slate-800 rounded w-24 mb-3" />
            <div className="h-7 bg-slate-800 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-20" />
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-64">
        <div className="h-5 bg-slate-800 rounded w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 h-24" />
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-80">
        <div className="h-5 bg-slate-800 rounded w-40 mb-4" />
        <div className="h-60 bg-slate-800/40 rounded-lg" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-96">
        <div className="h-5 bg-slate-800 rounded w-44 mb-4" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/40 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
