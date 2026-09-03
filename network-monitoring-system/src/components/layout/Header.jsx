import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { AiNocCopilotModal } from '../common/AiNocCopilotModal';
import {
  Activity,
  Zap,
  RefreshCw,
  Clock,
  Radio,
  BellRing,
  X,
  Bot,
  Sparkles
} from 'lucide-react';

export const Header = () => {
  const {
    devices,
    alertLogs,
    liveSimulation,
    setLiveSimulation,
    lastSyncTime,
    triggerAnomalySimulation,
    refreshSNMP
  } = useNetwork();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshSNMP();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleAnomaly = () => {
    triggerAnomalySimulation();
    setToastMessage({
      title: 'SYNTHETIC ANOMALY INJECTED',
      description: 'Bandwidth spike simulated on RTR-EDGE-02. ML predictive engine engaged!',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

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

  return (
    <header className="no-print bg-[#0e1626] border-b border-[#1e293b] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs relative">
      {/* Brand & System Identifier */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#1e293b] border border-[#334155] text-emerald-400 shadow-inner cursor-pointer"
        >
          <Activity className="w-5 h-5 animate-pulse" />
        </motion.div>
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 bg-[#151d30] px-3 py-1 rounded border border-[#1e293b]"
        >
          <span className="text-slate-400 font-medium text-[11px]">System Status:</span>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${overallBadgeClass}`}>
            <span className="w-2 h-2 rounded-full bg-current pulse-live"></span>
            <span>{overallHealth} ({healthPercent}%)</span>
          </div>
        </motion.div>

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
        {/* Ask AI Copilot Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAiModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1.5 shadow-md border border-blue-400/40"
          title="Open AI NOC Diagnostic Copilot Assistant"
        >
          <Bot className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
          <span>Ask AI Copilot</span>
          <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
        </motion.button>

        {/* Toggle Simulation */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>

        {/* Manual Refresh SNMP */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleManualRefresh}
          className="bg-[#151d30] hover:bg-[#1c263e] text-slate-300 border border-[#1e293b] px-2.5 py-1 rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors"
          title="Trigger immediate SNMP polling sweep across all 24 monitored nodes"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Poll Now</span>
        </motion.button>

        {/* Anomaly Simulation Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnomaly}
          className="bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-800/60 px-3 py-1 rounded font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-md pulse-ring-red"
          title="Inject synthetic bandwidth anomaly on RTR-EDGE-02 to trigger real-time predictive ML alert"
        >
          <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400/20" />
          <span>Inject Anomaly</span>
        </motion.button>
      </div>

      {/* Floating Animated Anomaly Alert Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-14 right-6 z-50 bg-[#1c1017] border border-red-500/60 rounded-lg p-3 shadow-2xl flex items-start gap-3 max-w-sm"
          >
            <div className="p-2 rounded-full bg-red-500/20 text-red-400 shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 text-xs tracking-wider">{toastMessage.title}</span>
                <button
                  onClick={() => setToastMessage(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.description}</p>
              <span className="text-[9px] font-mono text-slate-500 mt-1 block">{toastMessage.time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI NOC Copilot Assistant Modal */}
      <AiNocCopilotModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </header>
  );
};

