import React from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import {
  Server,
  Activity,
  Wifi,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  HardDrive,
  Globe,
  Shield,
  Network
} from 'lucide-react';

export const DeviceInventory = () => {
  const {
    devices,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
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

  const avgLoss = (
    onlineDevices.reduce((acc, d) => acc + d.packetLoss, 0) / (onlineDevices.length || 1)
  ).toFixed(2);

  const totalBwMbps = devices.reduce((acc, d) => acc + d.bandwidth, 0);

  // Device tier breakdowns
  const coreRouters = devices.filter(d => d.type === 'Router');
  const switches = devices.filter(d => d.type === 'Switch');
  const firewalls = devices.filter(d => d.type === 'Firewall');
  const servers = devices.filter(d => d.type === 'Server');

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      {/* Module 1 Context Header Banner */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            MODULE 1
          </span>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Module 1: Device & Network Monitoring</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-cyan-400">Device Inventory & Health</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Monitored hardware devices, IP/MAC tables, ping latency, packet loss, and interface status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-[#0b0f19] px-2.5 py-1 rounded border border-[#1e293b] text-cyan-400 font-bold">
            {onlineCount}/{totalDevices} Nodes Online
          </span>
        </div>
      </div>

      {/* Top 4 Infrastructure Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Monitored Devices"
          value={totalDevices}
          unit="Nodes"
          subtitle={`${onlineCount} Healthy | ${degradedCount} Degraded | ${offlineCount} Offline`}
          icon={Server}
          statusColor="text-cyan-400"
        />

        <StatCard
          title="Average Ping Latency"
          value={avgLatency}
          unit="ms"
          subtitle="ICMP Echo Response Baseline"
          icon={Activity}
          statusColor="text-blue-400"
        />

        <StatCard
          title="Average Interface Loss"
          value={avgLoss}
          unit="%"
          subtitle="Packet Buffer Drop Rate"
          icon={TrendingUp}
          statusColor={avgLoss > 1.0 ? 'text-amber-400' : 'text-emerald-400'}
        />

        <StatCard
          title="Aggregate Bandwidth"
          value={(totalBwMbps / 1000).toFixed(2)}
          unit="Gbps"
          subtitle="All Monitored Interfaces"
          icon={Cpu}
          statusColor="text-purple-400"
        />
      </div>

      {/* Hardware Categories Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Core Routers</span>
              <span className="text-sm font-bold text-white">{coreRouters.length} Nodes</span>
            </div>
          </div>
          <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
            {coreRouters.filter(r => r.status === 'Healthy').length} Up
          </span>
        </div>

        <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Distribution Switches</span>
              <span className="text-sm font-bold text-white">{switches.length} Nodes</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
            {switches.filter(s => s.status === 'Healthy').length} Up
          </span>
        </div>

        <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Firewalls</span>
              <span className="text-sm font-bold text-white">{firewalls.length} Nodes</span>
            </div>
          </div>
          <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
            {firewalls.filter(f => f.status === 'Healthy').length} Up
          </span>
        </div>

        <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Datacenter Servers</span>
              <span className="text-sm font-bold text-white">{servers.length} Nodes</span>
            </div>
          </div>
          <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
            {servers.filter(s => s.status === 'Healthy').length} Up
          </span>
        </div>
      </div>

      {/* High-Density Device Telemetry Table */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#151d30] border border-[#1e293b] rounded p-3 space-y-3 shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Hardware Device Inventory Telemetry ({filteredDevices.length} / {totalDevices})
            </h2>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search device, IP, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-200 text-xs pl-8 pr-3 py-1 focus:outline-none focus:border-cyan-500 font-mono w-48 sm:w-64"
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-300 text-xs px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Router">Router</option>
              <option value="Switch">Switch</option>
              <option value="Firewall">Firewall</option>
              <option value="Access Point">Access Point</option>
              <option value="Server">Server</option>
              <option value="Storage">Storage</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-300 text-xs px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

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
                <th>CPU Utilization</th>
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
                  <motion.tr
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    whileHover={{ backgroundColor: 'rgba(28, 38, 62, 0.9)' }}
                    className="cursor-pointer transition-colors border-b border-[#1e293b]/60"
                  >
                    <td className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dev.status === 'Healthy' ? 'bg-emerald-400' : dev.status === 'Degraded' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'}`}></span>
                      <span>{dev.name}</span>
                    </td>
                    <td className="text-cyan-400 font-semibold">{dev.ip}</td>
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
                              className={`h-full ${dev.cpu > 80 ? 'bg-red-500' : 'bg-cyan-500'}`}
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
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDeviceId(dev.id);
                        }}
                        className="bg-[#0b0f19] hover:bg-cyan-900/40 text-cyan-400 border border-[#1e293b] px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
