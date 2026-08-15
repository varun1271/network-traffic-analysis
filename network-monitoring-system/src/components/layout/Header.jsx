import React, { useState, useEffect } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import {
  Activity,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Server
} from 'lucide-react';

export const Header = () => {
  const {
    devices,
    predictiveAlerts,
    alertLogs,
    liveSimulation,
    setLiveSimulation,
    lastSyncTime,
    triggerAnomalySimulation,
    refreshSNMP
  } = useNetwork();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Overall Network Health Status
  const totalDevices = devices.length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;
  const degradedCount = devices.filter(d => d.status === 'Degraded').length;
  const healthyCount = devices.filter(d => d.status === 'Healthy').length;

  let overallHealth = 'HEALTHY';
  let overallBadgeClass = 'badge-healthy';
  let healthPercent = Math.round((healthyCount / totalDevices) * 100);

  if (offlineCount > 0 || degradedCount > 1) {
    overallHealth = 'DEGRADED';
    overallBadgeClass = 'badge-warning';
  }
  if (offlineCount >= 2 || degradedCount >= 3) {
    overallHealth = 'CRITICAL';
    overallBadgeClass = 'badge-critical';
  }

  const criticalAlertsCount = alertLogs.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;

  return (
    <header className="no-print bg-[#0e1626] border-b border-[#1e293b] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Brand & System Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-[#1e293b] border border-[#334155] text-emerald-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 tracking-wider text-sm">NOC-NETANALYZER</span>
            <span className="bg-[#1e293b] text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#334155]">
              v3.4.2-PROD
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
            AUTOMATED NETWORK PERFORMANCE ANALYZER & PREDICTIVE ALERT SYSTEM
          </p>
        </div>
      </div>

      {/* Middle Telemetry & Live Clock Badges */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Network Health Badge */}
        <div className="flex items-center gap-2 bg-[#151d30] px-3 py-1 rounded border border-[#1e293b]">
          <span className="text-slate-400 font-medium text-[11px]">System Status:</span>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${overallBadgeClass}`}>
            <span className="w-2 h-2 rounded-full bg-current pulse-live"></span>
            <span>{overallHealth} ({healthPercent}%)</span>
          </div>
        </div>

        {/* Live NTP Clock */}
        <div className="hidden md:flex items-center gap-2 bg-[#151d30] px-3 py-1 rounded border border-[#1e293b] text-slate-300 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentTime.toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1 rounded border border-emerald-800/40">
            NTP Synced
          </span>
        </div>

        {/* Last Polled & Active Feed Status */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Radio className={`w-3.5 h-3.5 ${liveSimulation ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span>Poll Engine: {liveSimulation ? `2.5s (${lastSyncTime})` : 'PAUSED'}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Toggle Simulation */}
        <button
          onClick={() => setLiveSimulation(!liveSimulation)}
          className={`px-2.5 py-1 rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors border ${
            liveSimulation
              ? 'bg-[#151d30] hover:bg-[#1c263e] text-slate-300 border-[#1e293b]'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
          }`}
          title="Pause or resume 2.5s live SNMP telemetry polling simulation"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{liveSimulation ? 'Pause Stream' : 'Resume Stream'}</span>
        </button>

        {/* Manual Refresh SNMP */}
        <button
          onClick={refreshSNMP}
          className="bg-[#151d30] hover:bg-[#1c263e] text-slate-300 border border-[#1e293b] px-2.5 py-1 rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors"
          title="Trigger immediate SNMP polling sweep across all 24 monitored nodes"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Poll Now</span>
        </button>

        {/* Anomaly Simulation Button */}
        <button
          onClick={triggerAnomalySimulation}
          className="bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-800/60 px-3 py-1 rounded font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-sm"
          title="Inject synthetic bandwidth anomaly on RTR-EDGE-02 to trigger real-time predictive ML alert"
        >
          <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400/20" />
          <span>Inject Anomaly</span>
        </button>
      </div>
    </header>
  );
};
