import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, unit = '', subtitle, icon: Icon, statusColor = 'text-blue-400', trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-col justify-between hover:border-[#334155] hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
            className={`shrink-0 ${statusColor}`}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <motion.span
          key={value}
          initial={{ scale: 1.15, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold font-mono text-slate-100 tracking-tight"
        >
          {value}
        </motion.span>
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
    </motion.div>
  );
};

