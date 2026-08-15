import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import {
  LayoutDashboard,
  Network,
  TrendingUp,
  Bell,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  HardDrive,
  Cpu,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, alertLogs, predictiveAlerts } = useNetwork();
  const [collapsed, setCollapsed] = useState(false);

  const activeIncidentsCount = alertLogs.filter(a => a.status === 'New').length;
  const criticalPredictiveCount = predictiveAlerts.filter(p => p.severity === 'Critical').length;

  const navItems = [
    { id: 'dashboard', label: 'Monitoring Dashboard', icon: LayoutDashboard },
    { id: 'topology', label: 'Topology Map', icon: Network },
    { id: 'performance', label: 'Performance & Predictive ML', icon: TrendingUp },
    {
      id: 'alerts',
      label: 'Alert Manager',
      icon: Bell,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : null,
      badgeColor: 'bg-red-500 text-white'
    },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Threshold Rules', icon: Sliders }
  ];

  return (
    <aside
      className={`no-print bg-[#0b0f19] border-r border-[#1e293b] flex flex-col justify-between transition-all duration-200 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Menu */}
      <div className="py-4">
        {/* Module Section Label */}
        {!collapsed && (
          <div className="px-4 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            NOC Control Center
          </div>
        )}

        <nav className="space-y-1 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-[#1e293b] text-blue-400 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151d30]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Resources Gauge & Collapse Toggle */}
      <div className="border-t border-[#1e293b] p-3 space-y-3">
        {!collapsed && (
          <div className="bg-[#151d30] border border-[#1e293b] rounded p-2.5 space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400 border-b border-[#1e293b] pb-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> NOC Engine CPU
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
              <div className="bg-blue-500 h-full w-[30%]"></div>
            </div>
          </div>
        )}

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b] text-xs transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
