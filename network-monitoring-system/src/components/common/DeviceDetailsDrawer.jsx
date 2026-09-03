import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleRunTool = (tool) => {
    if (!selectedDevice) return;
    setTerminalTool(tool);
    setIsRunningTool(true);
    const hostPrompt = `${selectedDevice.name}#`;
    setTerminalOutput(`[Cisco IOS-XE / NOC CLI] ${hostPrompt} ${tool.replace('_', ' ').toUpperCase()}...`);

    setTimeout(() => {
      let output = '';
      if (tool === 'ping') {
        output = `${hostPrompt} ping ${selectedDevice.ip}
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to ${selectedDevice.ip}, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = ${(selectedDevice.latency * 0.9).toFixed(1)}/${selectedDevice.latency}/${(selectedDevice.latency * 1.1).toFixed(1)} ms`;
      } else if (tool === 'traceroute') {
        output = `${hostPrompt} traceroute ${selectedDevice.ip}
Type escape sequence to abort.
Tracing the route to ${selectedDevice.ip}
VRF info: (default)
  1 10.0.1.1 (CORE-RTR-01) 0.812 msec 0.785 msec 0.750 msec
  2 10.0.1.254 (FW-PALOALTO-01) 1.420 msec 1.380 msec 1.350 msec
  3 ${selectedDevice.ip} (${selectedDevice.name}) ${selectedDevice.latency} msec ${selectedDevice.latency} msec`;
      } else if (tool === 'cdp_neighbors') {
        output = `${hostPrompt} show cdp neighbors detail
--------------------------------------------------
Device ID: CORE-SW-01.noc.local
Entry address(es): 
  IP address: 10.0.1.10
Platform: cisco Catalyst 9500,  Capabilities: Router Switch IGMP 
Interface: TenGigabitEthernet1/0/1,  Port ID (outgoing port): TenGigabitEthernet1/0/1
Holdtime : 142 sec

Version :
Cisco IOS Software [Cupertino], Catalyst L3 Switch Software (CAT9K_IOSXE), Version 17.06.03, RELEASE SOFTWARE (fc3)
Duplex: full, Speed: 10000Mb/s, Encapsulation: ARPA
Native VLAN: 1, CDP Version: 2`;
      } else if (tool === 'show_ip_int_brief') {
        output = `${hostPrompt} show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   10.0.1.1        YES NVRAM  up                    up      
GigabitEthernet0/0/1   10.0.1.2        YES NVRAM  up                    up      
TenGigE0/0/0/0         198.51.100.1    YES NVRAM  up                    up (BGP Active)
Loopback0              10.255.255.1    YES NVRAM  up                    up (OSPF Router-ID)`;
      } else if (tool === 'snmp') {
        output = `${hostPrompt} show snmp stats / walk
SNMP Engine ID: 800000090300001A2B3C4D01
sysDescr.0 = Cisco IOS Software, ${selectedDevice.vendor} ${selectedDevice.model} (${selectedDevice.os})
sysObjectID.0 = ciscoProducts.1.3.6.1.4.1.9.1.2845
sysUpTimeInstance = ${selectedDevice.uptime}
SNMP Packets In: 1842901, Out: 1842898 (0 SNMP errors)`;
      }
      setTerminalOutput(output);
      setIsRunningTool(false);
    }, 600);
  };

  const getStatusBadge = (status) => {
    if (status === 'Healthy') return <span className="badge-healthy px-2 py-0.5 rounded text-[11px] font-semibold">Healthy</span>;
    if (status === 'Degraded') return <span className="badge-warning px-2 py-0.5 rounded text-[11px] font-semibold">Degraded</span>;
    return <span className="badge-critical px-2 py-0.5 rounded text-[11px] font-semibold">Offline</span>;
  };

  return (
    <AnimatePresence>
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDeviceId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="w-full max-w-2xl bg-[#0b0f19] border-l border-[#1e293b] h-full flex flex-col justify-between shadow-2xl overflow-y-auto z-10 relative"
          >
            {/* Top Header */}
            <div className="p-4 bg-[#0e1626] border-b border-[#1e293b] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#151d30] border border-[#1e293b] text-blue-400">
                  <Server className="w-5 h-5 animate-pulse" />
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

              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDeviceId(null)}
                className="p-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-400 border border-[#1e293b]"
              >
                <X className="w-4 h-4" />
              </motion.button>
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDevice.cpu}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-full ${selectedDevice.cpu > 80 ? 'bg-red-500' : selectedDevice.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                      <span>RAM Usage</span>
                      <span className="text-slate-200 font-bold">{selectedDevice.memory}%</span>
                    </div>
                    <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDevice.memory}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`h-full ${selectedDevice.memory > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                      />
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((selectedDevice.bandwidth / selectedDevice.bandwidthCapacity) * 100)}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="h-full bg-purple-500"
                      />
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
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleRunTool('cdp_neighbors')}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        terminalTool === 'cdp_neighbors' ? 'bg-blue-600 text-white font-bold' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      show cdp neighbors
                    </button>
                    <button
                      onClick={() => handleRunTool('show_ip_int_brief')}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        terminalTool === 'show_ip_int_brief' ? 'bg-blue-600 text-white font-bold' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      show ip int brief
                    </button>
                    <button
                      onClick={() => handleRunTool('ping')}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        terminalTool === 'ping' ? 'bg-blue-600 text-white font-bold' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ping
                    </button>
                    <button
                      onClick={() => handleRunTool('traceroute')}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        terminalTool === 'traceroute' ? 'bg-blue-600 text-white font-bold' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      traceroute
                    </button>
                    <button
                      onClick={() => handleRunTool('snmp')}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        terminalTool === 'snmp' ? 'bg-blue-600 text-white font-bold' : 'bg-[#151d30] text-slate-400 hover:text-slate-200'
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDeviceId(null)}
                className="px-4 py-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-300 border border-[#1e293b] text-xs font-semibold"
              >
                Close Drawer
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
