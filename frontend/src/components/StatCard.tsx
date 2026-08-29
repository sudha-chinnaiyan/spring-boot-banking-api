import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trendColor?: 'green' | 'red' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trendColor = 'neutral' }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between shadow-lg">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl border ${
        trendColor === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
        trendColor === 'red' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
        'bg-slate-800/40 border-slate-800 text-slate-400'
      }`}>
        {icon}
      </div>
    </div>
  );
};
export default StatCard;
