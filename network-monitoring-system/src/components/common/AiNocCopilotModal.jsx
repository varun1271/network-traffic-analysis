import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Zap,
  Copy,
  Check
} from 'lucide-react';

export const AiNocCopilotModal = ({ isOpen, onClose }) => {
  const { devices, alertLogs, syslogStream, triggerAnomalySimulation } = useNetwork();
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your **NOC AI Copilot**. I analyze live telemetry, syslog streams, and Cisco CDP topologies in real time. How can I assist you with network operations today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Network State Analysis Helpers
  const healthyCount = devices.filter(d => d.status === 'Healthy').length;
  const degradedDevices = devices.filter(d => d.status === 'Degraded');
  const offlineDevices = devices.filter(d => d.status === 'Offline');

  const generateAiResponse = (userPrompt) => {
    const promptLower = userPrompt.toLowerCase();
    let responseText = '';

    if (promptLower.includes('health') || promptLower.includes('status') || promptLower.includes('overview')) {
      responseText = `### 📊 Live NOC System Health Report
- **Total Monitored Nodes**: ${devices.length} Devices
- **Healthy Nodes**: ${healthyCount} / ${devices.length} (${Math.round((healthyCount / devices.length) * 100)}%)
- **Degraded Nodes**: ${degradedDevices.length > 0 ? degradedDevices.map(d => d.name).join(', ') : 'None'}
- **Offline Nodes**: ${offlineDevices.length > 0 ? offlineDevices.map(d => d.name).join(', ') : 'None'}

**AI Diagnostic Verdict**: ${
        offlineDevices.length > 0 || degradedDevices.length > 0
          ? `⚠️ Critical attention required. ${degradedDevices.length} node(s) exhibiting elevated latency / packet drop rates.`
          : `✅ All backbone tiers operating within optimal ICMP & SNMP telemetry baselines.`
      }`;
    } else if (promptLower.includes('anomaly') || promptLower.includes('incident') || promptLower.includes('alert')) {
      if (degradedDevices.length > 0) {
        const dev = degradedDevices[0];
        responseText = `### 🚨 AI Incident Root Cause Analysis
**Target Node**: \`${dev.name}\` (${dev.ip})
**Vendor/OS**: ${dev.vendor} (${dev.os})
**Symptom**: RTT Latency elevated to \`${dev.latency}ms\` with \`${dev.packetLoss}%\` packet loss and \`${dev.cpu}%\` CPU load.

**Probable Root Cause**: High bandwidth saturation on 10GbE interface combined with queue buffer overrun.

**Recommended Cisco Remediation Commands**:
\`\`\`bash
${dev.name}# show processes cpu sorted
${dev.name}# show interfaces ${dev.interfaces?.[0]?.name || 'Gi0/0/1'}
${dev.name}# clear counters ${dev.interfaces?.[0]?.name || 'Gi0/0/1'}
\`\`\``;
      } else {
        responseText = `### ℹ️ Incident Analysis
Currently, no active network anomalies are detected. All 24 monitored Cisco & Juniper nodes are responding with normal latency (<15ms) and 0.0% packet drop rates.

*Tip: Click **Inject Anomaly** in the header to simulate a live bandwidth surge and test the AI diagnosis!*`;
      }
    } else if (promptLower.includes('cisco') || promptLower.includes('cdp') || promptLower.includes('cli')) {
      responseText = `### 🛡️ Cisco CDP & IOS Diagnostic Intelligence
The topology currently tracks **Cisco Discovery Protocol (CDP v2)** across:
- **ASR 9904 Core Router** (\`10.0.1.1\` running Cisco IOS-XR 7.5.2)
- **Catalyst 9500 Core Switch** (\`10.0.1.10\` running Cisco IOS-XE 17.06)

**Useful Cisco CLI Quick Diagnostics**:
- \`show cdp neighbors detail\` — View native VLANs & connected port IDs.
- \`show ip interface brief\` — Inspect Layer-3 interface IP states.
- \`show processes cpu sorted\` — Identify high CPU process spikes.`;
    } else if (promptLower.includes('bandwidth') || promptLower.includes('throughput') || promptLower.includes('capacity')) {
      const totalMbps = devices.reduce((acc, d) => acc + d.bandwidth, 0);
      responseText = `### ⚡ Aggregate Throughput Analysis
- **Current Network Load**: \`${(totalMbps / 1000).toFixed(2)} Gbps\`
- **Top Consumption Layer**: Core Tier 1 Backbone (ASR 9904 & PA-3220 Firewall)
- **Bandwidth Saturation**: Running at ~38% of total 20 Gbps aggregate capacity.`;
    } else {
      responseText = `I analyzed your request against live SNMP telemetry logs for **${devices.length} network nodes**.

**Key Observation**: Network telemetry stream is active. All ICMP echo baselines are synced with NTP time \`${new Date().toLocaleTimeString()}\`.

Try one of these AI diagnostic queries:
- *"Analyze Network Health"*
- *"Explain Latest Anomaly"*
- *"Recommend Cisco Remediation Commands"*
- *"Check Bandwidth Bottlenecks"*`;
    }

    return responseText;
  };

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const aiReplyText = generateAiResponse(textToSend);
      const aiMsg = {
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 750);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="bg-[#0b0f19] border border-blue-500/50 rounded-xl shadow-2xl w-full max-w-2xl h-[620px] flex flex-col z-10 relative overflow-hidden font-sans"
          >
            {/* Modal Header */}
            <div className="bg-[#0e1626] border-b border-[#1e293b] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-sm font-mono tracking-wider">NOC AI COPILOT</h3>
                    <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-blue-400" /> LLM Telemetry Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Real-time AI diagnostic assistant for Cisco CDP, SNMP MIBs, and anomaly remediation
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded bg-[#151d30] hover:bg-[#1e293b] text-slate-400 hover:text-white border border-[#1e293b] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Preset Prompt Pills */}
            <div className="bg-[#111827] border-b border-[#1e293b] p-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
              <span className="text-slate-500 shrink-0 px-2 text-[10px] uppercase font-bold">Quick Analysis:</span>
              <button
                onClick={() => handleSend('Analyze Network Health')}
                className="shrink-0 bg-[#151d30] hover:bg-blue-900/40 border border-[#1e293b] hover:border-blue-500/50 text-blue-300 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> System Health Summary
              </button>
              <button
                onClick={() => handleSend('Explain Latest Anomaly')}
                className="shrink-0 bg-[#151d30] hover:bg-amber-900/40 border border-[#1e293b] hover:border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Root Cause Diagnosis
              </button>
              <button
                onClick={() => handleSend('Cisco CDP Remediation Commands')}
                className="shrink-0 bg-[#151d30] hover:bg-purple-900/40 border border-[#1e293b] hover:border-purple-500/50 text-purple-300 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3 h-3 text-purple-400" /> Cisco CLI Commands
              </button>
            </div>

            {/* Messages Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#090d16]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-[#151d30] border border-[#1e293b] text-slate-200 shadow-md font-mono'
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {msg.text.split('```').map((part, i) => {
                        if (i % 2 === 1) {
                          const codeLines = part.replace(/^bash\n|^sh\n/, '');
                          return (
                            <div key={i} className="my-2 bg-[#070a12] border border-[#1e293b] rounded p-2 text-emerald-400 font-mono text-[11px] relative group">
                              <button
                                onClick={() => copyToClipboard(codeLines, `${idx}-${i}`)}
                                className="absolute top-1.5 right-1.5 p-1 bg-[#151d30] hover:bg-[#1e293b] rounded text-slate-400 hover:text-white"
                                title="Copy Cisco CLI Command"
                              >
                                {copiedIndex === `${idx}-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <pre className="overflow-x-auto">{codeLines}</pre>
                            </div>
                          );
                        }
                        return part;
                      })}
                    </div>
                    <span className={`text-[9px] mt-1.5 block ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-center text-slate-400 font-mono text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#151d30] border border-[#1e293b] px-3 py-2 rounded-xl flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span>Analyzing live telemetry & Cisco CDP MIB states...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Query Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#0e1626] border-t border-[#1e293b] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask AI Copilot about network health, Cisco CDP, latency spikes..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                className="flex-1 bg-[#0b0f19] border border-[#1e293b] rounded-lg text-slate-100 text-xs px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md font-mono"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
