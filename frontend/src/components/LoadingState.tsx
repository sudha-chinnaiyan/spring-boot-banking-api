import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-24 bg-slate-900/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-900 rounded-2xl" />
        ))}
      </div>

      <div className="h-8 bg-slate-900/60 w-48 rounded" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-900/60 border border-slate-900 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
export default LoadingState;
