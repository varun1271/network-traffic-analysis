import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import {
  Network,
  Server,
  Shield,
  Wifi,
  HardDrive,
  Globe,
  RefreshCw,
  Zap,
  ArrowLeft,
  Activity,
  Radio,
  Eye
} from 'lucide-react';

export const TopologyMap = () => {
  const { devices, setSelectedDeviceId, setActiveTab } = useNetwork();
  const [selectedTier, setSelectedTier] = useState('All');
  const [showLinkLabels, setShowLinkLabels] = useState(true);
  const [hoveredDeviceId, setHoveredDeviceId] = useState(null);
  const [packetSpeed, setPacketSpeed] = useState('normal'); // normal | fast
  const [pingWaveActive, setPingWaveActive] = useState(false);
  const [ciscoCdpMode, setCiscoCdpMode] = useState(true); // Cisco CDP Mode

  // Trigger simulated ping wave animation across network tiers
  const triggerPingWave = () => {
    setPingWaveActive(true);
    setTimeout(() => setPingWaveActive(false), 2400);
  };

  // Group devices by network tier
  const coreDevices = devices.filter(d => d.tier === 'Core');
  const distDevices = devices.filter(d => d.tier === 'Distribution');
  const accessDevices = devices.filter(d => d.tier === 'Access');
  const serverDevices = devices.filter(d => d.tier === 'Server');

  const getNodeIcon = (type) => {
    switch (type) {
      case 'Router': return <Globe className="w-5 h-5" />;
      case 'Switch': return <Network className="w-5 h-5" />;
      case 'Firewall': return <Shield className="w-5 h-5" />;
      case 'Access Point': return <Wifi className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Storage': return <HardDrive className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getNodeBorderClass = (status, isHovered) => {
    let base = 'transition-all duration-300 shadow-lg relative ';
    if (isHovered) {
      base += 'ring-2 ring-blue-400 border-blue-400 bg-[#1c263e] scale-[1.03] z-20 ';
    }
    if (status === 'Healthy') return base + 'border-emerald-500/60 bg-[#151d30] text-emerald-400 pulse-ring-emerald';
    if (status === 'Degraded') return base + 'border-amber-500/80 bg-amber-950/30 text-amber-400 ring-2 ring-amber-500/30 pulse-ring-amber';
    return base + 'border-red-500/80 bg-red-950/30 text-red-400 ring-2 ring-red-500/30 pulse-ring-red';
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
              <span className="text-cyan-400">Network Topology Map</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive node topology diagram, interconnect links, CDP discovery protocol, and real-time packet flow simulation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-[#0b0f19] px-2.5 py-1 rounded border border-[#1e293b] text-cyan-400 font-bold">
            24 Monitored Nodes Linked
          </span>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveTab('dashboard')}
            className="p-1.5 rounded bg-[#0b0f19] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Enterprise Interactive Topology Diagram
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time interconnect link state & interactive packet telemetry (Core → Distribution → Access → Servers)
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Interactive Toggles */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {/* Cisco CDP Protocol Discovery Toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCiscoCdpMode(!ciscoCdpMode)}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 text-[11px] ${
              ciscoCdpMode
                ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/30 font-bold'
                : 'bg-[#0b0f19] border-[#1e293b] text-slate-400'
            }`}
            title="Toggle Cisco Discovery Protocol (CDP v2) interconnect labels and Cisco IOS badges"
          >
            <Shield className={`w-3.5 h-3.5 ${ciscoCdpMode ? 'text-blue-400 fill-blue-400/30' : 'text-slate-500'}`} />
            <span>Cisco CDP Discovery: {ciscoCdpMode ? 'Active (v2)' : 'Off'}</span>
          </motion.button>

          {/* Packet Flow Speed Toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPacketSpeed(packetSpeed === 'normal' ? 'fast' : 'normal')}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 text-[11px] ${
              packetSpeed === 'fast'
                ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                : 'bg-[#0b0f19] border-[#1e293b] text-slate-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${packetSpeed === 'fast' ? 'text-purple-400 fill-purple-400' : 'text-slate-400'}`} />
            <span>Traffic Speed: {packetSpeed === 'fast' ? 'High Speed (Burst)' : 'Normal Flow'}</span>
          </motion.button>

          {/* Trigger Ping Wave Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerPingWave}
            disabled={pingWaveActive}
            className="bg-[#0b0f19] hover:bg-[#1e293b] border border-[#1e293b] text-emerald-400 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5"
          >
            <Radio className={`w-3.5 h-3.5 ${pingWaveActive ? 'animate-ping text-emerald-400' : 'text-emerald-500'}`} />
            <span>{pingWaveActive ? 'Ping Sweeping...' : 'Ping Sweep Topology'}</span>
          </motion.button>

          <div className="flex items-center gap-1.5 bg-[#0b0f19] px-2.5 py-1 rounded border border-[#1e293b]">
            <span className="text-slate-500 text-[11px]">Tier Filter:</span>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Network Tiers</option>
              <option value="Core">Core Layer Only</option>
              <option value="Distribution">Distribution Only</option>
              <option value="Access">Access Layer Only</option>
              <option value="Server">Servers & Storage Only</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer bg-[#0b0f19] px-2.5 py-1 rounded border border-[#1e293b]">
            <input
              type="checkbox"
              checked={showLinkLabels}
              onChange={e => setShowLinkLabels(e.target.checked)}
              className="rounded text-blue-500"
            />
            <span>Link Bandwidth</span>
          </label>
        </div>
      </div>

      {/* Topology Canvas Area */}
      <div className="bg-[#090d16] border border-[#1e293b] rounded p-6 relative overflow-x-auto min-h-[580px] flex flex-col justify-between space-y-6">
        {/* Tier 0: WAN / Internet Gateway */}
        <div className="flex justify-center items-center relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#151d30] border border-blue-500/60 rounded-lg p-3 text-center text-xs shadow-xl flex items-center gap-3 cursor-pointer hover:border-blue-400"
          >
            <div className="relative">
              <Globe className="w-6 h-6 text-blue-400 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-100 block">ISP WAN GATEWAY (198.51.100.1)</span>
              <span className="text-emerald-400 text-[10px] block">Primary BGP Fiber Uplink (10 Gbps Active)</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Interconnect Lines Stream */}
        <div className="relative flex justify-center py-1">
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
          </svg>
        </div>

        {/* Tier 1: Core Routers & Firewalls */}
        {(selectedTier === 'All' || selectedTier === 'Core') && (
          <div className="space-y-2 relative z-10">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Tier 1: Core Backbone & Perimeter Security Layer</span>
            </div>
            <div className="flex flex-wrap justify-around items-center gap-4">
              {coreDevices.map(dev => {
                const isHovered = hoveredDeviceId === dev.id;
                return (
                  <motion.div
                    key={dev.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setHoveredDeviceId(dev.id)}
                    onMouseLeave={() => setHoveredDeviceId(null)}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-3 rounded-lg border cursor-pointer w-60 ${getNodeBorderClass(
                      dev.status,
                      isHovered
                    )}`}
                  >
                    {/* Simulated Ping Signal Pulse */}
                    {pingWaveActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.9 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 rounded-lg border-2 border-emerald-400 pointer-events-none"
                      />
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[#0b0f19] border border-[#1e293b]">
                          {getNodeIcon(dev.type)}
                        </span>
                        <span className="font-bold text-slate-100 text-xs truncate">{dev.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {dev.vendor === 'Cisco Systems' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-blue-600 text-white font-bold">
                            CISCO
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300">
                          {dev.tier}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                      <div className="flex justify-between">
                        <span>IP:</span>
                        <span className="text-slate-200 font-semibold">{dev.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OS:</span>
                        <span className="text-slate-300 font-sans text-[10px]">{dev.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className={dev.latency > 30 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {dev.latency} ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load:</span>
                        <span className="text-slate-200">{dev.cpu}% CPU</span>
                      </div>
                    </div>

                    {showLinkLabels && (
                      <div className="mt-2 pt-1.5 border-t border-[#1e293b] text-[9px] font-sans flex justify-between items-center text-slate-400">
                        <span>10GbE Uplink</span>
                        <span className="text-emerald-400 font-mono">● {dev.bandwidth} Mbps</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Animated Interconnect Lines Stream Tier 1 -> Tier 2 */}
        <div className="relative flex justify-around py-1">
          <svg className="w-full h-8 overflow-visible">
            <line
              x1="25%"
              y1="0"
              x2="25%"
              y2="100%"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="6 6"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
            <line
              x1="75%"
              y1="0"
              x2="75%"
              y2="100%"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="6 6"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
          </svg>
        </div>

        {/* Tier 2: Distribution Layer */}
        {(selectedTier === 'All' || selectedTier === 'Distribution') && (
          <div className="space-y-2 relative z-10">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1 flex items-center justify-center gap-2">
              <Network className="w-3 h-3 text-emerald-400" />
              <span>Tier 2: Aggregation & Distribution Layer</span>
            </div>
            <div className="flex flex-wrap justify-around items-center gap-4">
              {distDevices.map(dev => {
                const isHovered = hoveredDeviceId === dev.id;
                return (
                  <motion.div
                    key={dev.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setHoveredDeviceId(dev.id)}
                    onMouseLeave={() => setHoveredDeviceId(null)}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-3 rounded-lg border cursor-pointer w-60 ${getNodeBorderClass(
                      dev.status,
                      isHovered
                    )}`}
                  >
                    {/* Simulated Ping Signal Pulse */}
                    {pingWaveActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.9 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute inset-0 rounded-lg border-2 border-emerald-400 pointer-events-none"
                      />
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[#0b0f19] border border-[#1e293b]">
                          {getNodeIcon(dev.type)}
                        </span>
                        <span className="font-bold text-slate-100 text-xs truncate">{dev.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                        {dev.tier}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                      <div className="flex justify-between">
                        <span>IP:</span>
                        <span className="text-slate-200 font-semibold">{dev.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RTT:</span>
                        <span className="text-slate-200">{dev.latency} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="text-slate-300 truncate max-w-[110px]">{dev.model}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Animated Interconnect Lines Stream Tier 2 -> Tier 3 */}
        <div className="relative flex justify-center py-1">
          <svg className="w-full h-8 overflow-visible">
            <line
              x1="20%"
              y1="0"
              x2="20%"
              y2="100%"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="5 5"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="5 5"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
            <line
              x1="80%"
              y1="0"
              x2="80%"
              y2="100%"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="5 5"
              className={packetSpeed === 'fast' ? 'animate-dash-flow-fast' : 'animate-dash-flow'}
            />
          </svg>
        </div>

        {/* Tier 3: Access Switches, APs & Datacenter Servers */}
        {(selectedTier === 'All' || selectedTier === 'Access' || selectedTier === 'Server') && (
          <div className="space-y-2 relative z-10">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1 flex items-center justify-center gap-2">
              <Server className="w-3 h-3 text-purple-400" />
              <span>Tier 3: Access Endpoints & DataCenter Compute/Storage</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...accessDevices, ...serverDevices].map(dev => {
                const isHovered = hoveredDeviceId === dev.id;
                return (
                  <motion.div
                    key={dev.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => setHoveredDeviceId(dev.id)}
                    onMouseLeave={() => setHoveredDeviceId(null)}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-2.5 rounded border cursor-pointer ${getNodeBorderClass(
                      dev.status,
                      isHovered
                    )}`}
                  >
                    {/* Simulated Ping Signal Pulse */}
                    {pingWaveActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.9 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="absolute inset-0 rounded border-2 border-emerald-400 pointer-events-none"
                      />
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getNodeIcon(dev.type)}
                        <span className="font-bold text-slate-100 text-xs truncate">{dev.name}</span>
                      </div>
                      <span className="text-[9px] px-1 bg-[#0b0f19] rounded border border-[#1e293b] text-slate-400">
                        {dev.type}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <div>IP: {dev.ip}</div>
                      <div className="flex justify-between">
                        <span>RTT: {dev.latency}ms</span>
                        <span className={dev.packetLoss > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          Loss: {dev.packetLoss}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Topology Legend Footer */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-200">Legend & Live State:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-ring-emerald"></span> Healthy (Optimal)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 pulse-ring-amber"></span> Degraded (Latency / Loss)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-ring-red"></span> Offline (Down)
          </span>
        </div>
        <div className="text-[11px] text-blue-400 flex items-center gap-1.5 font-mono">
          <Eye className="w-3.5 h-3.5" /> Hover or click nodes to inspect live telemetry & hardware logs.
        </div>
      </div>
    </motion.div>
  );
};

