import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import {
  Server,
  Activity,
  AlertTriangle,
  Wifi,
  Search,
  Filter,
  Terminal,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  HardDrive
} from 'lucide-react';

export const MonitoringDashboard = () => {
  const {
    devices,
    alertLogs,
    syslogStream,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    setSelectedDeviceId,
    setActiveTab
  } = useNetwork();

  // Summary Metrics calculations
  const totalDevices = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Healthy').length;
  const degradedCount = devices.filter(d => d.status === 'Degraded').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;

  const onlineDevices = devices.filter(d => d.status !== 'Offline');
  const avgLatency = (
    onlineDevices.reduce((acc, d) => acc + d.latency, 0) / (onlineDevices.length || 1)
  ).toFixed(1);

  const avgLoss = (
    onlineDevices.reduce((acc, d) => acc + d.packetLoss, 0) / (onlineDevices.length || 1)
  ).toFixed(2);

  const totalBwMbps = devices.reduce((acc, d) => acc + d.bandwidth, 0);
  const totalBwGbps = (totalBwMbps / 1000).toFixed(2);

  const criticalAlerts = alertLogs.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;

  // Filtered devices list
  const filteredDevices = devices.filter(dev => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || dev.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || dev.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const renderSparkline = (points, color = '#3b82f6') => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points) || 1;
    const height = 20;
    const width = 80;

    const pathD = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / (max - min || 1)) * (height - 4) - 2;
        return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="inline-block overflow-visible">
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top 5 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Monitored Devices"
          value={totalDevices}
          unit="Nodes"
          subtitle={`${onlineCount} Online | ${degradedCount} Degraded | ${offlineCount} Offline`}
          icon={Server}
          statusColor="text-[#10b981]"
        />

        <StatCard
          title="Avg Network Latency"
          value={avgLatency}
          unit="ms"
          subtitle="ICMP Echo RTT baseline"
          icon={Activity}
          statusColor="text-blue-400"
          trend="-0.2ms"
        />

        <StatCard
          title="Avg Packet Loss"
          value={avgLoss}
          unit="%"
          subtitle="Interface Drop Rate"
          icon={TrendingUp}
          statusColor={avgLoss > 1.0 ? 'text-amber-400' : 'text-emerald-400'}
        />

        <StatCard
          title="Aggregate Throughput"
          value={totalBwGbps}
          unit="Gbps"
          subtitle="All Monitored Interfaces"
          icon={Cpu}
          statusColor="text-purple-400"
        />

        <StatCard
          title="Active Incident Alerts"
          value={criticalAlerts}
          unit="Unresolved"
          subtitle="Predictive & Rule Alerts"
          icon={AlertTriangle}
          statusColor={criticalAlerts > 0 ? 'text-red-400' : 'text-slate-400'}
        />
      </div>

      {/* Main Inventory Section Header & Search Filters */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Real-Time Network Device Inventory ({filteredDevices.length} / {totalDevices})
            </h2>
          </div>

          {/* Search Bar & Dropdown Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search device, IP, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-200 text-xs pl-8 pr-3 py-1 focus:outline-none focus:border-blue-500 font-mono w-48 sm:w-64"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-300 text-xs px-2 py-1 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="All">All Types</option>
              <option value="Router">Router</option>
              <option value="Switch">Switch</option>
              <option value="Firewall">Firewall</option>
              <option value="Access Point">Access Point</option>
              <option value="Server">Server</option>
              <option value="Storage">Storage</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-300 text-xs px-2 py-1 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* High-Density NOC Device Table */}
        <div className="overflow-x-auto">
          <table className="noc-table">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>IP Address</th>
                <th>Type</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Loss</th>
                <th>Throughput</th>
                <th>CPU</th>
                <th>RTT Sparkline (10p)</th>
                <th>Uptime</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {filteredDevices.map(dev => {
                const sparkColor =
                  dev.status === 'Degraded' ? '#f59e0b' : dev.status === 'Offline' ? '#ef4444' : '#10b981';

                return (
                  <tr
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className="cursor-pointer hover:bg-[#1c263e] transition-colors"
                  >
                    <td className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                      <span>{dev.name}</span>
                    </td>
                    <td className="text-blue-400 font-semibold">{dev.ip}</td>
                    <td>
                      <span className="bg-[#0b0f19] text-slate-300 px-2 py-0.5 rounded text-[10px] border border-[#1e293b]">
                        {dev.type}
                      </span>
                    </td>
                    <td>
                      {dev.status === 'Healthy' && (
                        <span className="badge-healthy px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Healthy
                        </span>
                      )}
                      {dev.status === 'Degraded' && (
                        <span className="badge-warning px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-live"></span> Degraded
                        </span>
                      )}
                      {dev.status === 'Offline' && (
                        <span className="badge-critical px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Offline
                        </span>
                      )}
                    </td>
                    <td className={dev.latency > 30 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                      {dev.status === 'Offline' ? '—' : `${dev.latency} ms`}
                    </td>
                    <td className={dev.packetLoss > 1.0 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {dev.status === 'Offline' ? '100%' : `${dev.packetLoss}%`}
                    </td>
                    <td className="text-slate-200">
                      {dev.status === 'Offline' ? '0 Mbps' : `${dev.bandwidth} Mbps`}
                    </td>
                    <td>
                      {dev.status === 'Offline' ? (
                        '—'
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={dev.cpu > 80 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                            {dev.cpu}%
                          </span>
                          <div className="w-12 bg-[#0b0f19] h-1.5 rounded overflow-hidden">
                            <div
                              className={`h-full ${dev.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${dev.cpu}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{renderSparkline(dev.sparkline, sparkColor)}</td>
                    <td className="text-slate-400 text-[11px]">{dev.uptime}</td>
                    <td className="text-slate-400 text-[11px] truncate max-w-[140px]">{dev.location}</td>
                    <td>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDeviceId(dev.id);
                        }}
                        className="bg-[#0b0f19] hover:bg-blue-900/40 text-blue-400 border border-[#1e293b] px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Quick Topology & Monospace Syslog Terminal Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topology Card Switcher */}
        <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Network Topology Overview
            </h3>
            <button
              onClick={() => setActiveTab('topology')}
              className="text-xs text-blue-400 hover:underline font-mono flex items-center gap-1"
            >
              Open Interactive Topology Map →
            </button>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] rounded p-4 flex items-center justify-around font-mono text-xs">
            <div className="text-center space-y-1">
              <span className="block text-[10px] text-slate-500 uppercase">Core Layer</span>
              <span className="badge-healthy px-2 py-1 rounded inline-block text-[11px] font-bold">
                2 Routers (1 Degraded)
              </span>
            </div>
            <span className="text-slate-600 font-bold">⇄</span>
            <div className="text-center space-y-1">
              <span className="block text-[10px] text-slate-500 uppercase">Distribution</span>
              <span className="badge-healthy px-2 py-1 rounded inline-block text-[11px] font-bold">
                2 Switches (100% Up)
              </span>
            </div>
            <span className="text-slate-600 font-bold">⇄</span>
            <div className="text-center space-y-1">
              <span className="block text-[10px] text-slate-500 uppercase">Access Layer</span>
              <span className="badge-warning px-2 py-1 rounded inline-block text-[11px] font-bold">
                8 Devices (1 Down)
              </span>
            </div>
          </div>
        </div>

        {/* Monospace Syslog Live Terminal Stream */}
        <div className="lg:col-span-2 bg-[#0e1626] border border-[#1e293b] rounded p-3 space-y-2 font-mono">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Syslog & Telemetry Log Stream</span>
            </div>
            <span className="text-[10px] text-slate-500">UDP Port 514 / SNMP Traps</span>
          </div>

          <div className="bg-[#070a12] border border-[#1a2338] rounded p-2.5 text-[11px] font-mono space-y-1 max-h-[140px] overflow-y-auto">
            {syslogStream.map((log, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-slate-500 text-[10px]">{log.time}</span>
                <span
                  className={`px-1 py-0.2 text-[9px] font-bold rounded ${
                    log.level === 'CRIT' || log.level === 'ERROR'
                      ? 'bg-red-950 text-red-400 border border-red-800/40'
                      : log.level === 'WARN'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-400 font-semibold">{log.source}:</span>
                <span className="text-slate-300 truncate">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
