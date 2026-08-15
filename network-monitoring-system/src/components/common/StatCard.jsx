import React from 'react';

export const StatCard = ({ title, value, unit = '', subtitle, icon: Icon, statusColor = 'text-blue-400', trend }) => {
  return (
    <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-col justify-between hover:border-[#334155] transition-colors">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${statusColor}`} />}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-xl font-bold font-mono text-slate-100 tracking-tight">{value}</span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-[#1e293b]/60">
        <span className="truncate">{subtitle}</span>
        {trend && (
          <span className={trend.startsWith('+') ? 'text-amber-400' : 'text-emerald-400'}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
