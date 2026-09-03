import React from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Terminal,
  TrendingUp,
  Cpu,
  FileText,
  FileSpreadsheet,
  Zap,
  Radio,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Server
} from 'lucide-react';

export const ExecutiveDashboard = () => {
  const {
    devices,
    alertLogs,
    syslogStream,
    scheduledReports,
    setActiveTab,
    triggerAnomalySimulation,
    setSelectedDeviceId
  } = useNetwork();

  const totalDevices = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Healthy').length;
  const degradedCount = devices.filter(d => d.status === 'Degraded').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;

  const onlineDevices = devices.filter(d => d.status !== 'Offline');
  const avgLatency = (
    onlineDevices.reduce((acc, d) => acc + d.latency, 0) / (onlineDevices.length || 1)
  ).toFixed(1);

  const totalBwMbps = devices.reduce((acc, d) => acc + d.bandwidth, 0);
  const totalBwGbps = (totalBwMbps / 1000).toFixed(2);

  const criticalAlerts = alertLogs.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const unresolvedAlerts = alertLogs.filter(a => a.status !== 'Resolved').length;

  // Top Bandwidth Hog Devices (sorted by bandwidth desc)
  const topBandwidthDevices = [...devices]
    .filter(d => d.status !== 'Offline')
    .sort((a, b) => b.bandwidth - a.bandwidth)
    .slice(0, 5);

  // Top CPU Utilization Devices (sorted by cpu desc)
  const topCpuDevices = [...devices]
    .filter(d => d.status !== 'Offline')
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      {/* Module 3 Context Header Banner */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            MODULE 3
          </span>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Module 3: Dashboard & Report Management</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-emerald-400">Executive NOC Dashboard</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Executive NOC control room summary, network health indicators, bandwidth consumption, and live Syslog auditor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('reports')}
            className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/80 px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-colors shadow"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate SLA PDF Report</span>
          </button>
        </div>
      </div>

      {/* Executive Health Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Overall System Health"
          value={offlineCount === 0 ? '98.4%' : '94.2%'}
          unit="HEALTHY"
          subtitle={`${onlineCount} Nodes Healthy | ${degradedCount} Degraded`}
          icon={Activity}
          statusColor="text-emerald-400"
        />

        <StatCard
          title="SLA Availability Uptime"
          value="99.94%"
          unit="30 Days"
          subtitle="Tier-3 Enterprise Target: 99.90%"
          icon={CheckCircle2}
          statusColor="text-blue-400"
          trend="+0.04%"
        />

        <StatCard
          title="Total Traffic Throughput"
          value={totalBwGbps}
          unit="Gbps"
          subtitle="Aggregate Real-Time Telemetry"
          icon={TrendingUp}
          statusColor="text-purple-400"
        />

        <StatCard
          title="Unresolved Incident Alerts"
          value={unresolvedAlerts}
          unit="Incidents"
          subtitle={`${criticalAlerts} Critical Priority`}
          icon={AlertTriangle}
          statusColor={criticalAlerts > 0 ? 'text-red-400' : 'text-slate-400'}
        />

        <StatCard
          title="Scheduled SLA Reports"
          value={scheduledReports.length}
          unit="Ready"
          subtitle="PDF / CSV Exports Configured"
          icon={FileText}
          statusColor="text-cyan-400"
        />
      </div>

      {/* Executive Visual Grid: Top Traffic Hogs & CPU Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Bandwidth Hogs Widget */}
        <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3 shadow-md font-mono">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Top Bandwidth Consuming Nodes</span>
            </h3>
            <span className="text-[10px] text-slate-400">Mbps Telemetry</span>
          </div>

          <div className="space-y-2.5">
            {topBandwidthDevices.map(dev => {
              const pct = Math.min(100, Math.round((dev.bandwidth / dev.bandwidthCapacity) * 100));
              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className="p-2 rounded bg-[#0b0f19] border border-[#1e293b] hover:border-purple-500/50 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      {dev.name} ({dev.ip})
                    </span>
                    <span className="text-purple-400 font-bold">
                      {dev.bandwidth} / {dev.bandwidthCapacity} Mbps ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#151d30] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : 'bg-purple-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 High CPU Load Nodes */}
        <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3 shadow-md font-mono">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Top CPU Load Devices</span>
            </h3>
            <span className="text-[10px] text-slate-400">NOC Engine Poller</span>
          </div>

          <div className="space-y-2.5">
            {topCpuDevices.map(dev => (
              <div
                key={dev.id}
                onClick={() => setSelectedDeviceId(dev.id)}
                className="p-2 rounded bg-[#0b0f19] border border-[#1e293b] hover:border-blue-500/50 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {dev.name} ({dev.type})
                  </span>
                  <span className={`font-bold ${dev.cpu > 80 ? 'text-red-400' : 'text-blue-400'}`}>
                    {dev.cpu}% CPU
                  </span>
                </div>

                <div className="w-full bg-[#151d30] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${dev.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${dev.cpu}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monospace Live Syslog Security & Telemetry Event Terminal */}
      <div className="bg-[#0e1626] border border-[#1e293b] rounded p-4 space-y-3 font-mono shadow-md">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Executive Syslog & Telemetry Event Stream</span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            UDP Port 514 / Real-time SNMP Trap Receiver
          </span>
        </div>

        <div className="bg-[#070a12] border border-[#1a2338] rounded p-3 text-xs font-mono space-y-1.5 max-h-[220px] overflow-y-auto">
          {syslogStream.map((log, i) => (
            <div key={i} className="flex items-baseline gap-2 text-[11px]">
              <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] font-bold rounded shrink-0 ${
                  log.level === 'CRIT' || log.level === 'ERROR'
                    ? 'bg-red-950 text-red-400 border border-red-800/40'
                    : log.level === 'WARN'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                    : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                }`}
              >
                {log.level}
              </span>
              <span className="text-slate-400 font-semibold shrink-0">{log.source}:</span>
              <span className="text-slate-300 truncate">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
