import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import {
  X,
  Server,
  Activity,
  Cpu,
  HardDrive,
  Globe,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  Shield
} from 'lucide-react';

export const DeviceDetailsDrawer = () => {
  const { selectedDevice, setSelectedDeviceId } = useNetwork();
  const [terminalTool, setTerminalTool] = useState('ping'); // ping | traceroute | snmp
  const [terminalOutput, setTerminalOutput] = useState(null);
  const [isRunningTool, setIsRunningTool] = useState(false);

  if (!selectedDevice) return null;

  const handleRunTool = (tool) => {
    setTerminalTool(tool);
    setIsRunningTool(true);
    setTerminalOutput(`[NOC CLI v3.4] Executing ${tool.toUpperCase()} against ${selectedDevice.ip}...`);

    setTimeout(() => {
      let output = '';
      if (tool === 'ping') {
        output = `PING ${selectedDevice.ip} (${selectedDevice.ip}): 56 data bytes
64 bytes from ${selectedDevice.ip}: icmp_seq=0 ttl=64 time=${selectedDevice.latency} ms
64 bytes from ${selectedDevice.ip}: icmp_seq=1 ttl=64 time=${(selectedDevice.latency * 0.95).toFixed(1)} ms
64 bytes from ${selectedDevice.ip}: icmp_seq=2 ttl=64 time=${(selectedDevice.latency * 1.05).toFixed(1)} ms
64 bytes from ${selectedDevice.ip}: icmp_seq=3 ttl=64 time=${selectedDevice.latency} ms

--- ${selectedDevice.ip} ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = ${(selectedDevice.latency * 0.95).toFixed(1)}/${selectedDevice.latency}/${(selectedDevice.latency * 1.05).toFixed(1)}/0.2 ms`;
      } else if (tool === 'traceroute') {
        output = `traceroute to ${selectedDevice.ip} (${selectedDevice.ip}), 30 hops max, 60 byte packets
 1  10.0.1.1 (CORE-RTR-01)  0.812 ms  0.785 ms  0.750 ms
 2  10.0.1.254 (FW-PALOALTO-01)  1.420 ms  1.380 ms  1.350 ms
 3  ${selectedDevice.ip} (${selectedDevice.name})  ${selectedDevice.latency} ms  ${(selectedDevice.latency * 1.02).toFixed(1)} ms  ${(selectedDevice.latency * 0.98).toFixed(1)} ms`;
      } else if (tool === 'snmp') {
        output = `SNMPv3 WALK output for ${selectedDevice.name} (${selectedDevice.ip}) [Community: private-noc]:
sysDescr.0 = STRING: ${selectedDevice.vendor} ${selectedDevice.model} ${selectedDevice.os}
sysObjectID.0 = OID: 1.3.6.1.4.1.9.1.2845
sysUpTimeInstance = Timeticks: (12345678) ${selectedDevice.uptime}
ifNumber.0 = INTEGER: ${selectedDevice.interfaces.length}
ifDescr.1 = STRING: ${selectedDevice.interfaces[0]?.name || 'eth0'}
ifOperStatus.1 = INTEGER: up(1)
ifInOctets.1 = Counter32: 3840128491
ifOutOctets.1 = Counter32: 3580219412`;
      }
      setTerminalOutput(output);
      setIsRunningTool(false);
    }, 800);
  };

  const getStatusBadge = (status) => {
    if (status === 'Healthy') return <span className="badge-healthy px-2 py-0.5 rounded text-[11px] font-semibold">Healthy</span>;
    if (status === 'Degraded') return <span className="badge-warning px-2 py-0.5 rounded text-[11px] font-semibold">Degraded</span>;
    return <span className="badge-critical px-2 py-0.5 rounded text-[11px] font-semibold">Offline</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-[#0b0f19] border-l border-[#1e293b] h-full flex flex-col justify-between shadow-2xl overflow-y-auto">
        {/* Top Header */}
        <div className="p-4 bg-[#0e1626] border-b border-[#1e293b] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#151d30] border border-[#1e293b] text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 font-mono">{selectedDevice.name}</h3>
                {getStatusBadge(selectedDevice.status)}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                IP: {selectedDevice.ip} | MAC: {selectedDevice.mac} | {selectedDevice.type}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDeviceId(null)}
            className="p-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-5">
          {/* Quick Hardware Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-[#151d30] border border-[#1e293b] p-2.5 rounded">
              <span className="text-slate-500 block text-[10px] uppercase">Vendor / OS</span>
              <span className="text-slate-200 font-medium truncate block">{selectedDevice.vendor}</span>
              <span className="text-slate-400 text-[10px] block truncate">{selectedDevice.os}</span>
            </div>
            <div className="bg-[#151d30] border border-[#1e293b] p-2.5 rounded">
              <span className="text-slate-500 block text-[10px] uppercase">Location</span>
              <span className="text-slate-200 font-medium truncate block">{selectedDevice.location}</span>
              <span className="text-slate-400 text-[10px] block">Tier: {selectedDevice.tier}</span>
            </div>
            <div className="bg-[#151d30] border border-[#1e293b] p-2.5 rounded">
              <span className="text-slate-500 block text-[10px] uppercase">System Uptime</span>
              <span className="text-emerald-400 font-medium block truncate">{selectedDevice.uptime}</span>
            </div>
            <div className="bg-[#151d30] border border-[#1e293b] p-2.5 rounded">
              <span className="text-slate-500 block text-[10px] uppercase">Telemetry</span>
              <span className="text-blue-400 font-medium block">
                {selectedDevice.latency} ms | {selectedDevice.packetLoss}% Loss
              </span>
            </div>
          </div>

          {/* Live Metric Gauges */}
          <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Live Device Utilization Metrics
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                  <span>CPU Load</span>
                  <span className="text-slate-200 font-bold">{selectedDevice.cpu}%</span>
                </div>
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedDevice.cpu > 80 ? 'bg-red-500' : selectedDevice.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${selectedDevice.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                  <span>RAM Usage</span>
                  <span className="text-slate-200 font-bold">{selectedDevice.memory}%</span>
                </div>
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedDevice.memory > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${selectedDevice.memory}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                  <span>Bandwidth Saturation</span>
                  <span className="text-slate-200 font-bold">
                    {Math.round((selectedDevice.bandwidth / selectedDevice.bandwidthCapacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${Math.round((selectedDevice.bandwidth / selectedDevice.bandwidthCapacity) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interfaces Table */}
          <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Network Interfaces (SNMP MIB-II)
            </h4>
            <div className="overflow-x-auto">
              <table className="noc-table">
                <thead>
                  <tr>
                    <th>Interface</th>
                    <th>Speed</th>
                    <th>Status</th>
                    <th>RX Rate</th>
                    <th>TX Rate</th>
                    <th>Errors/Drops</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {selectedDevice.interfaces.map((iface, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-slate-200">{iface.name}</td>
                      <td className="text-slate-400">{iface.speed}</td>
                      <td>
                        {iface.status === 'Up' ? (
                          <span className="text-emerald-400">● Up</span>
                        ) : (
                          <span className="text-red-400">● Down</span>
                        )}
                      </td>
                      <td>{iface.rxMbps} Mbps</td>
                      <td>{iface.txMbps} Mbps</td>
                      <td className={iface.errors > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {iface.errors} err / {iface.drops} drop
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monospaced Diagnostic Terminal Tool */}
          <div className="bg-[#0e1626] border border-[#1e293b] rounded p-3 space-y-2 font-mono">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>NOC Diagnostic CLI Tool</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleRunTool('ping')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    terminalTool === 'ping' ? 'bg-blue-600 text-white' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ping ICMP
                </button>
                <button
                  onClick={() => handleRunTool('traceroute')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    terminalTool === 'traceroute' ? 'bg-blue-600 text-white' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Traceroute
                </button>
                <button
                  onClick={() => handleRunTool('snmp')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    terminalTool === 'snmp' ? 'bg-blue-600 text-white' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SNMP Walk
                </button>
              </div>
            </div>

            {/* CLI Console Output Window */}
            <div className="bg-[#070a12] border border-[#1a2338] p-3 rounded text-[11px] text-emerald-400 font-mono whitespace-pre-wrap min-h-[120px] max-h-[220px] overflow-y-auto">
              {isRunningTool ? (
                <div className="animate-pulse text-slate-400">Executing diagnostic command...</div>
              ) : (
                terminalOutput || `Ready. Select a tool above to run diagnostic test against ${selectedDevice.ip}.`
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0e1626] border-t border-[#1e293b] flex justify-end">
          <button
            onClick={() => setSelectedDeviceId(null)}
            className="px-4 py-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-300 border border-[#1e293b] text-xs font-semibold"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
