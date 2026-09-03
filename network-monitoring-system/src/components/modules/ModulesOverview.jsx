import React from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import {
  HardDrive,
  Activity,
  LayoutDashboard,
  Network,
  TrendingUp,
  Bell,
  Sliders,
  FileText,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  Radio,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

export const ModulesOverview = () => {
  const { selectModule, setActiveTab, devices, alertLogs, predictiveAlerts, thresholds, scheduledReports, triggerAnomalySimulation } = useNetwork();

  const totalDevices = devices.length;
  const healthyCount = devices.filter(d => d.status === 'Healthy').length;
  const degradedCount = devices.filter(d => d.status === 'Degraded').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;
  const activeAlertsCount = alertLogs.filter(a => a.status === 'New').length;

  const modulesList = [
    {
      id: 'module1',
      number: 'MODULE 1',
      title: 'Device & Network Monitoring',
      description: 'Comprehensive network discovery, device health telemetry, interface specs, live ping/packet loss tracking, and interactive network topology visualizer.',
      icon: HardDrive,
      accentColor: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
      badge: 'Real-time Telemetry & Discovery',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      buttonGradient: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
      stats: [
        { label: 'Total Devices', value: totalDevices, color: 'text-slate-100' },
        { label: 'Healthy Nodes', value: healthyCount, color: 'text-emerald-400' },
        { label: 'Degraded', value: degradedCount, color: 'text-amber-400' },
        { label: 'Offline', value: offlineCount, color: 'text-red-400' }
      ],
      features: [
        'SNMP v2c/v3 telemetry sweep across 24 core nodes',
        'Device inventory with IP, MAC, firmware & interface specs',
        'Interactive network topology node map & link status',
        'Ping response latency & packet loss tracking'
      ],
      subViews: [
        { id: 'device-inventory', label: 'Device Inventory & Health', icon: HardDrive },
        { id: 'topology', label: 'Network Topology Map', icon: Network }
      ]
    },
    {
      id: 'module2',
      number: 'MODULE 2',
      title: 'Performance Analysis & Alert Generation',
      description: 'Machine Learning predictive anomaly detection, dynamic bandwidth & throughput analytics, custom threshold rule engine, and incident triage lifecycle.',
      icon: Activity,
      accentColor: 'border-purple-500/50 bg-purple-950/20 text-purple-400',
      badge: 'ML Predictive Engine Active',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
      stats: [
        { label: 'Active Alerts', value: activeAlertsCount, color: activeAlertsCount > 0 ? 'text-red-400 font-bold' : 'text-slate-100' },
        { label: 'Predictive Anomalies', value: predictiveAlerts.length, color: 'text-purple-400' },
        { label: 'Threshold Rules', value: thresholds.filter(t => t.enabled).length, color: 'text-blue-400' },
        { label: 'ML Accuracy', value: '98.4%', color: 'text-emerald-400' }
      ],
      features: [
        'Real-time traffic graph telemetry & jitter metrics',
        'Machine Learning predictive failure & breach forecasting',
        'Automated incident generation & resolution workflow',
        'Customizable SLA threshold rules & alert policies'
      ],
      subViews: [
        { id: 'performance', label: 'Performance & Predictive ML', icon: TrendingUp },
        { id: 'alerts', label: 'Alert Manager & Incidents', icon: Bell },
        { id: 'settings', label: 'Threshold Rules & Settings', icon: Sliders }
      ]
    },
    {
      id: 'module3',
      number: 'MODULE 3',
      title: 'Dashboard & Report Management',
      description: 'High-level NOC executive dashboard overview, automated SLA compliance reports, export capabilities (PDF/CSV), and syslog event stream logging.',
      icon: LayoutDashboard,
      accentColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400',
      badge: 'Automated Reports & Compliance',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
      stats: [
        { label: 'System Uptime', value: '99.94%', color: 'text-emerald-400' },
        { label: 'Active Reports', value: scheduledReports.length, color: 'text-slate-100' },
        { label: 'SLA Score', value: '99.8%', color: 'text-blue-400' },
        { label: 'Export Formats', value: 'PDF / CSV', color: 'text-slate-300' }
      ],
      features: [
        'Executive NOC control room summary widgets',
        'Automated PDF & CSV report generation engine',
        'SLA availability compliance auditing & export',
        'Live Syslog stream event viewer & security logs'
      ],
      subViews: [
        { id: 'dashboard', label: 'Executive NOC Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports & Export Center', icon: FileText }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#111927] via-[#172238] to-[#111927] border border-[#1e293b] rounded-xl p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Modular System Architecture
              </span>
              <span className="text-slate-400 text-xs font-mono">3 Core Modules Configured</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Network Monitoring System Modules
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              The capstone network monitoring application is structured into three dedicated functional modules for device health, predictive AI performance analytics, and executive dashboard management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerAnomalySimulation}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-red-400 fill-red-400/20" />
              <span>Simulate ML Anomaly</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3 Core Modules Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modulesList.map((mod, idx) => {
          const Icon = mod.icon;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#111928] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between hover:border-slate-600 transition-all duration-300 shadow-xl group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Module Header Pill & Title */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg border ${mod.accentColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
                        {mod.number}
                      </span>
                      <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {mod.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <span className={`inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded border ${mod.badgeBg}`}>
                  {mod.badge}
                </span>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {mod.description}
                </p>

                {/* Module Key Statistics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[#0b0f19] border border-[#1e293b] rounded-lg p-3">
                  {mod.stats.map((s, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-mono block">{s.label}</span>
                      <span className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Key Feature Highlights */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                    Module Features & Components:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {mod.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sub-view Navigation Buttons */}
              <div className="pt-6 space-y-2 border-t border-[#1e293b] mt-5">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">
                  Quick View Access:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mod.subViews.map(sub => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => selectModule(mod.id, sub.id)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151d30] hover:bg-[#1c263e] border border-[#1e293b] text-xs font-medium text-slate-200 hover:text-white transition-all group/btn"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SubIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate text-[11px]">{sub.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
