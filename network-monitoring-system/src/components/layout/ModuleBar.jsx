import React from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import {
  Grid,
  HardDrive,
  Activity,
  LayoutDashboard,
  Network,
  TrendingUp,
  Bell,
  Sliders,
  FileText,
  Layers
} from 'lucide-react';

export const ModuleBar = () => {
  const { activeModule, activeTab, selectModule, setActiveTab, devices, alertLogs, scheduledReports } = useNetwork();

  const activeIncidents = alertLogs.filter(a => a.status === 'New').length;
  const onlineDevicesCount = devices.filter(d => d.status === 'Healthy').length;
  const totalDevicesCount = devices.length;

  const modules = [
    {
      id: 'overview',
      title: 'Modules Overview',
      subtitle: 'System Hub & Module Matrix',
      icon: Grid,
      badge: '3 Modules',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      themeColor: 'from-indigo-600/20 via-slate-900 to-slate-900',
      activeBorder: 'border-indigo-500',
      activeText: 'text-indigo-400',
      subTabs: []
    },
    {
      id: 'module1',
      number: 'Module 1',
      title: 'Device & Network Monitoring',
      subtitle: 'Device Inventory, Ping Health & Topology',
      icon: HardDrive,
      badge: `${onlineDevicesCount}/${totalDevicesCount} Online`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      themeColor: 'from-cyan-950/40 via-[#0b0f19] to-[#0b0f19]',
      activeBorder: 'border-cyan-400',
      activeText: 'text-cyan-400',
      subTabs: [
        { id: 'device-inventory', label: 'Device Inventory & Health', icon: HardDrive },
        { id: 'topology', label: 'Network Topology Map', icon: Network }
      ]
    },
    {
      id: 'module2',
      number: 'Module 2',
      title: 'Performance Analysis & Alert Generation',
      subtitle: 'Predictive ML Analytics & Incident Triage',
      icon: Activity,
      badge: activeIncidents > 0 ? `${activeIncidents} Active Alerts` : 'ML Active',
      badgeColor: activeIncidents > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      themeColor: 'from-purple-950/40 via-[#0b0f19] to-[#0b0f19]',
      activeBorder: 'border-purple-400',
      activeText: 'text-purple-400',
      subTabs: [
        { id: 'performance', label: 'Performance & Predictive ML', icon: TrendingUp },
        { id: 'alerts', label: 'Alert Manager & Incidents', icon: Bell, count: activeIncidents },
        { id: 'settings', label: 'Threshold Rules & Settings', icon: Sliders }
      ]
    },
    {
      id: 'module3',
      number: 'Module 3',
      title: 'Dashboard & Report Management',
      subtitle: 'NOC Overview, SLA Analytics & Reports',
      icon: LayoutDashboard,
      badge: `${scheduledReports.length} Reports Ready`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      themeColor: 'from-emerald-950/40 via-[#0b0f19] to-[#0b0f19]',
      activeBorder: 'border-emerald-400',
      activeText: 'text-emerald-400',
      subTabs: [
        { id: 'dashboard', label: 'Executive NOC Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports & Export Center', icon: FileText }
      ]
    }
  ];

  const currentModuleObj = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <div className="no-print bg-[#0b0f19] border-b border-[#1e293b] px-4 py-2.5 space-y-2">
      {/* Top Module Card Switcher Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {modules.map(mod => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;

          return (
            <motion.button
              key={mod.id}
              onClick={() => selectModule(mod.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left p-3 rounded-lg border transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${mod.themeColor} ${mod.activeBorder} shadow-lg shadow-black/40 ring-1 ring-[#334155]`
                  : 'bg-[#151d30]/80 hover:bg-[#1c263e] border-[#1e293b] opacity-80 hover:opacity-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeModuleHighlight"
                  className="absolute inset-0 rounded-lg border-2 border-blue-500/50 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-md ${isActive ? 'bg-blue-600/30 text-white' : 'bg-[#0b0f19] text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    {mod.number && (
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase block ${isActive ? mod.activeText : 'text-slate-400'}`}>
                        {mod.number}
                      </span>
                    )}
                    <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {mod.title}
                    </h3>
                  </div>
                </div>

                {mod.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Sub-Feature Tab Strip (Appears when Module 1, 2, or 3 is active) */}
      {currentModuleObj.subTabs && currentModuleObj.subTabs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar border-t border-[#1e293b]/60"
        >
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-blue-400" /> {currentModuleObj.number} Views:
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {currentModuleObj.subTabs.map(sub => {
              const SubIcon = sub.icon;
              const isSubActive = activeTab === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                    isSubActive
                      ? 'bg-blue-600 text-white shadow border border-blue-400/40'
                      : 'bg-[#151d30] text-slate-300 hover:text-white hover:bg-[#1e293b] border border-[#1e293b]'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                  {sub.count > 0 && (
                    <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 rounded-full">
                      {sub.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
