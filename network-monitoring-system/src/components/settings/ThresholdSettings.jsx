import React, { useState } from 'react';
import { Sliders, Server, Shield, Bell, CheckCircle2, Save, RefreshCw } from 'lucide-react';

export const ThresholdSettings = () => {
  const [pollingRate, setPollingRate] = useState(2.5);
  const [syslogServer, setSyslogServer] = useState('10.0.1.50:514');
  const [snmpCommunity, setSnmpCommunity] = useState('private-noc-v3');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 space-y-4 font-mono">
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              System Administration & Polling Configuration
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Configure SNMP polling frequency, Syslog server IP destinations, and webhook alerts
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded text-xs flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved Live!
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="bg-[#151d30] border border-[#1e293b] rounded p-5 space-y-6 text-xs">
        {/* Polling Interval Slider */}
        <div className="space-y-2 border-b border-[#1e293b] pb-4">
          <div className="flex justify-between items-center">
            <label className="text-slate-200 font-bold uppercase tracking-wider">
              SNMP Telemetry Polling Rate
            </label>
            <span className="text-blue-400 font-bold text-sm">{pollingRate} Seconds</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={pollingRate}
            onChange={e => setPollingRate(Number(e.target.value))}
            className="w-full h-2 bg-[#0b0f19] rounded appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-[11px] text-slate-400 font-sans">
            Lower intervals increase real-time data accuracy. Higher intervals reduce router CPU load.
          </p>
        </div>

        {/* Syslog Server Config */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#1e293b] pb-4">
          <div>
            <label className="text-slate-300 block font-bold uppercase mb-1">Central Syslog Target Server</label>
            <input
              type="text"
              value={syslogServer}
              onChange={e => setSyslogServer(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#1e293b] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block font-bold uppercase mb-1">SNMPv3 Security Community String</label>
            <input
              type="password"
              value={snmpCommunity}
              onChange={e => setSnmpCommunity(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#1e293b] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Webhook Integrations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Incident Notification Webhooks
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-[#0b0f19] border border-[#1e293b] p-2.5 rounded">
              <input type="checkbox" defaultChecked className="rounded text-blue-500" />
              <div>
                <span className="text-slate-200 font-bold block">Slack NOC Channel Webhook</span>
                <span className="text-slate-400 text-[10px]">https://hooks.slack.com/services/T00/B00/XXXXX</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#0b0f19] border border-[#1e293b] p-2.5 rounded">
              <input type="checkbox" defaultChecked className="rounded text-blue-500" />
              <div>
                <span className="text-slate-200 font-bold block">Microsoft Teams Operations Channel</span>
                <span className="text-slate-400 text-[10px]">https://outlook.office.com/webhook/XXXXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded font-bold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
