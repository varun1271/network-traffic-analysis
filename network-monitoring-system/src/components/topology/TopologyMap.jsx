import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Network, Server, Shield, Wifi, HardDrive, Globe, RefreshCw, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';

export const TopologyMap = () => {
  const { devices, setSelectedDeviceId, setActiveTab } = useNetwork();
  const [selectedTier, setSelectedTier] = useState('All');
  const [showLinkLabels, setShowLinkLabels] = useState(true);

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

  const getNodeBorder = (status) => {
    if (status === 'Healthy') return 'border-emerald-500/60 bg-[#151d30] text-emerald-400';
    if (status === 'Degraded') return 'border-amber-500/80 bg-amber-950/30 text-amber-400 ring-2 ring-amber-500/30';
    return 'border-red-500/80 bg-red-950/30 text-red-400 ring-2 ring-red-500/30';
  };

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* Topology Header Controls */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-1.5 rounded bg-[#0b0f19] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Enterprise Interactive Topology Diagram
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time interconnect link state & node health topology (Core → Distribution → Access → Servers)
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Toggles */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#0b0f19] px-2.5 py-1 rounded border border-[#1e293b]">
            <span className="text-slate-500 text-[11px]">Tier Filter:</span>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
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
            <span>Show Link Bandwidth Labels</span>
          </label>
        </div>
      </div>

      {/* Topology Canvas Area */}
      <div className="bg-[#090d16] border border-[#1e293b] rounded p-6 relative overflow-x-auto min-h-[560px] flex flex-col justify-between space-y-8">
        {/* Tier 0: WAN / Internet Gateway */}
        <div className="flex justify-center items-center">
          <div className="bg-[#151d30] border border-blue-500/50 rounded-lg p-3 text-center text-xs shadow-lg flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-400 animate-spin-slow" />
            <div className="text-left">
              <span className="font-bold text-slate-100 block">ISP WAN GATEWAY (198.51.100.1)</span>
              <span className="text-emerald-400 text-[10px] block">Primary BGP Fiber Uplink (10 Gbps Active)</span>
            </div>
          </div>
        </div>

        {/* Tier 1: Core Routers & Firewalls */}
        {(selectedTier === 'All' || selectedTier === 'Core') && (
          <div className="space-y-2">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1">
              Tier 1: Core Backbone & Perimeter Security Layer
            </div>
            <div className="flex flex-wrap justify-around items-center gap-4">
              {coreDevices.map(dev => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-3 rounded-lg border cursor-pointer hover:scale-105 transition-all shadow-md w-56 ${getNodeBorder(
                    dev.status
                  )}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {getNodeIcon(dev.type)}
                    <span className="font-bold text-slate-100 text-xs truncate">{dev.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>IP: <span className="text-slate-200">{dev.ip}</span></div>
                    <div>Latency: <span className={dev.latency > 30 ? 'text-amber-400 font-bold' : 'text-slate-200'}>{dev.latency} ms</span></div>
                    <div>Bandwidth: <span className="text-slate-200">{dev.bandwidth} Mbps</span></div>
                  </div>
                  {showLinkLabels && (
                    <div className="mt-2 pt-1 border-t border-[#1e293b] text-[9px] text-blue-400 font-sans flex justify-between">
                      <span>Interconnect: 10GbE</span>
                      <span className="text-emerald-400">Up</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connector Interconnect Line Decorator */}
        <div className="flex justify-center my-2">
          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 to-emerald-500/50"></div>
        </div>

        {/* Tier 2: Distribution Layer */}
        {(selectedTier === 'All' || selectedTier === 'Distribution') && (
          <div className="space-y-2">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1">
              Tier 2: Aggregation & Distribution Layer
            </div>
            <div className="flex flex-wrap justify-around items-center gap-4">
              {distDevices.map(dev => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-3 rounded-lg border cursor-pointer hover:scale-105 transition-all shadow-md w-56 ${getNodeBorder(
                    dev.status
                  )}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {getNodeIcon(dev.type)}
                    <span className="font-bold text-slate-100 text-xs truncate">{dev.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>IP: <span className="text-slate-200">{dev.ip}</span></div>
                    <div>Latency: <span className="text-slate-200">{dev.latency} ms</span></div>
                    <div>Model: <span className="text-slate-300">{dev.model}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connector Interconnect Line Decorator */}
        <div className="flex justify-center my-2">
          <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500/50 to-purple-500/50"></div>
        </div>

        {/* Tier 3: Access Switches, APs & Datacenter Servers */}
        {(selectedTier === 'All' || selectedTier === 'Access' || selectedTier === 'Server') && (
          <div className="space-y-2">
            <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b] pb-1">
              Tier 3: Access Endpoints & DataCenter Compute/Storage
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...accessDevices, ...serverDevices].map(dev => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-2.5 rounded border cursor-pointer hover:scale-102 transition-all ${getNodeBorder(
                    dev.status
                  )}`}
                >
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
                      <span>Loss: {dev.packetLoss}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Topology Legend Footer */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-200">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy (Optimal)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 pulse-live"></span> Degraded (Latency / Loss)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Offline (Down)
          </span>
        </div>
        <div className="text-[11px]">Click any topology node to open full hardware drawer & diagnostics.</div>
      </div>
    </div>
  );
};
