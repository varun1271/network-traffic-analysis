import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import {
  Grid,
  HardDrive,
  LayoutDashboard,
  Network,
  TrendingUp,
  Bell,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, alertLogs } = useNetwork();
  const [collapsed, setCollapsed] = useState(false);

  const activeIncidentsCount = alertLogs.filter(a => a.status === 'New').length;

  const moduleGroups = [
    {
      moduleTitle: 'Modules Overview',
      items: [
        { id: 'overview', label: 'Modules Hub', icon: Grid }
      ]
    },
    {
      moduleTitle: 'Module 1: Device & Network Monitoring',
      badge: 'Mod 1',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
      items: [
        { id: 'device-inventory', label: 'Device Inventory & Health', icon: HardDrive },
        { id: 'topology', label: 'Network Topology Map', icon: Network }
      ]
    },
    {
      moduleTitle: 'Module 2: Performance & Alerts',
      badge: 'Mod 2',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
      items: [
        { id: 'performance', label: 'Performance & Predictive ML', icon: TrendingUp },
        {
          id: 'alerts',
          label: 'Alert Manager',
          icon: Bell,
          badge: activeIncidentsCount > 0 ? activeIncidentsCount : null,
          badgeColor: 'bg-red-500 text-white shadow-sm shadow-red-500/50'
        },
        { id: 'settings', label: 'Threshold Rules', icon: Sliders }
      ]
    },
    {
      moduleTitle: 'Module 3: Dashboard & Reports',
      badge: 'Mod 3',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
      items: [
        { id: 'dashboard', label: 'Executive NOC Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports & Export Center', icon: FileText }
      ]
    }
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="no-print bg-[#0b0f19] border-r border-[#1e293b] flex flex-col justify-between z-20 overflow-hidden"
    >
      {/* Navigation Menu */}
      <div className="py-3 overflow-y-auto space-y-4">
        {moduleGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="px-2">
            {!collapsed && (
              <div className="px-3 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 truncate">
                  {group.moduleTitle}
                </span>
                {group.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${group.badgeColor}`}>
                    {group.badge}
                  </span>
                )}
              </div>
            )}

            <nav className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ x: collapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full relative flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                      isActive
                        ? 'text-blue-400 font-semibold bg-[#1e293b]/80 border-l-2 border-blue-500 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151d30]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActivePill"
                        className="absolute inset-0 rounded bg-blue-500/10 border-l-2 border-blue-400 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0 z-10">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`z-10 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer System Resources Gauge & Collapse Toggle */}
      <div className="border-t border-[#1e293b] p-3 space-y-3">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#151d30] border border-[#1e293b] rounded p-2.5 space-y-2 text-[11px] font-mono"
            >
              <div className="flex items-center justify-between text-slate-400 border-b border-[#1e293b] pb-1">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> NOC Engine CPU
                </span>
                <span className="text-slate-200 font-bold">14.2%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" /> RAM Allocated
                </span>
                <span className="text-slate-200 font-bold">2.4 / 8 GB</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ['30%', '35%', '28%', '30%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-blue-500 h-full rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Collapse Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b] text-xs transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.aside>
  );
};
