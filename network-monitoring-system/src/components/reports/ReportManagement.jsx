import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Sliders,
  Grid,
  Send,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  Server
} from 'lucide-react';

export const ReportManagement = () => {
  const { devices, alertLogs, scheduledReports } = useNetwork();

  // Report Generator Form State
  const [reportTitle, setReportTitle] = useState('Enterprise Network Health & SLA Audit Report');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [deviceScope, setDeviceScope] = useState('All Devices');
  const [includePredictive, setIncludePredictive] = useState(true);
  const [includeSLA, setIncludeSLA] = useState(true);
  const [generatedReport, setGeneratedReport] = useState(null);

  // Widget Layout Visibility Customizer State
  const [widgetConfig, setWidgetConfig] = useState({
    summaryCards: true,
    deviceTable: true,
    topologyMap: true,
    predictiveEngine: true,
    syslogStream: true
  });

  const handleToggleWidget = (key) => {
    setWidgetConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const onlineDevices = devices.filter(d => d.status !== 'Offline');
    const slaCompliance = ((onlineDevices.length / devices.length) * 100).toFixed(1);
    const avgLatency = (onlineDevices.reduce((a, b) => a + b.latency, 0) / onlineDevices.length).toFixed(1);
    const totalIncidents = alertLogs.length;

    setGeneratedReport({
      title: reportTitle,
      dateRange,
      deviceScope,
      generatedAt: now,
      slaCompliance,
      avgLatency,
      totalIncidents,
      devicesSummary: devices
    });
  };

  // Export CSV handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Device Name,IP Address,Type,Status,Latency (ms),Packet Loss (%),Bandwidth (Mbps),CPU (%)\n";

    devices.forEach(d => {
      csvContent += `${d.name},${d.ip},${d.type},${d.status},${d.latency},${d.packetLoss},${d.bandwidth},${d.cpu}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Network_Telemetry_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* Top Header */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Dashboard Customizer & Report Generator
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Generate publication-grade PDF/CSV network SLA compliance reports & customize widget layouts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/60 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export Telemetry CSV
          </button>

          <button
            onClick={handlePrintReport}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Export
          </button>
        </div>
      </div>

      {/* Grid Layout Widgets Customizer */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3 no-print">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Grid className="w-4 h-4 text-purple-400" /> Dashboard Widget Visibility Customizer
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { key: 'summaryCards', label: 'Summary Stat Cards' },
            { key: 'deviceTable', label: 'Device Inventory Table' },
            { key: 'topologyMap', label: 'Network Topology Diagram' },
            { key: 'predictiveEngine', label: 'Predictive ML Panel' },
            { key: 'syslogStream', label: 'Syslog Terminal Stream' }
          ].map(w => (
            <button
              key={w.key}
              onClick={() => handleToggleWidget(w.key)}
              className={`p-2 rounded border text-left transition-colors ${
                widgetConfig[w.key]
                  ? 'bg-blue-950/40 border-blue-600/50 text-blue-300 font-bold'
                  : 'bg-[#0b0f19] border-[#1e293b] text-slate-500 line-through'
              }`}
            >
              {widgetConfig[w.key] ? '✓ ' : '✕ '} {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Generator Form */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-4 no-print">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" /> Automated Report Generator Parameters
        </h3>

        <form onSubmit={handleGenerateReport} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block text-[10px] uppercase mb-1">Report Document Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] uppercase mb-1">Audit Time Period</label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Today (Last 24 Hours)">Today (Last 24 Hours)</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Current Month to Date">Current Month to Date</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] uppercase mb-1">Device Scope</label>
              <select
                value={deviceScope}
                onChange={e => setDeviceScope(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All Devices">All 24 Monitored Nodes</option>
                <option value="Core Layer Only">Core Routers & Firewalls Only</option>
                <option value="Access & APs Only">Access Switches & APs Only</option>
                <option value="DataCenter Servers">Datacenter Compute & Storage</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includePredictive}
                onChange={e => setIncludePredictive(e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Predictive ML Anomaly Audit</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSLA}
                onChange={e => setIncludeSLA(e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include SLA Availability Breakdown</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate Report Preview
          </button>
        </form>
      </div>

      {/* Printable Report Preview Card */}
      {generatedReport && (
        <div className="bg-[#0e1626] border-2 border-blue-600/60 rounded p-6 space-y-6 noc-card shadow-2xl">
          <div className="border-b border-[#1e293b] pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                AUTOMATED NETWORK PERFORMANCE ANALYSIS REPORT
              </div>
              <h1 className="text-lg font-bold text-slate-100 mt-1">{generatedReport.title}</h1>
              <p className="text-xs text-slate-400">
                Scope: {generatedReport.deviceScope} | Time Window: {generatedReport.dateRange}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Generated: {generatedReport.generatedAt} UTC</div>
              <div className="text-emerald-400 font-bold">STATUS: COMPLIANT</div>
            </div>
          </div>

          {/* Executive SLA Summary Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#151d30] border border-[#1e293b] p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase block">Network SLA Uptime</span>
              <span className="text-2xl font-bold text-emerald-400">{generatedReport.slaCompliance}%</span>
            </div>
            <div className="bg-[#151d30] border border-[#1e293b] p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase block">Average Latency</span>
              <span className="text-2xl font-bold text-blue-400">{generatedReport.avgLatency} ms</span>
            </div>
            <div className="bg-[#151d30] border border-[#1e293b] p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase block">Logged Incidents</span>
              <span className="text-2xl font-bold text-amber-400">{generatedReport.totalIncidents} Alerts</span>
            </div>
          </div>

          {/* Device Summary Table inside Report */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Monitored Nodes Compliance Matrix
            </h4>
            <table className="noc-table text-xs">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>IP Address</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Loss</th>
                  <th>Capacity Util</th>
                </tr>
              </thead>
              <tbody>
                {generatedReport.devicesSummary.map(d => (
                  <tr key={d.id}>
                    <td className="font-bold text-slate-200">{d.name}</td>
                    <td>{d.ip}</td>
                    <td>{d.type}</td>
                    <td className={d.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}>{d.status}</td>
                    <td>{d.latency} ms</td>
                    <td>{d.packetLoss}%</td>
                    <td>{Math.round((d.bandwidth / d.bandwidthCapacity) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print Action Bar */}
          <div className="pt-4 border-t border-[#1e293b] flex justify-between items-center no-print text-xs">
            <span className="text-slate-400">Click Print to generate formal PDF version using browser print.</span>
            <button
              onClick={handlePrintReport}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded font-bold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Document
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Automated Reports Table */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3 no-print">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" /> Scheduled Automated Reports
        </h3>

        <div className="overflow-x-auto">
          <table className="noc-table text-xs">
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Frequency</th>
                <th>Schedule Time</th>
                <th>Recipients</th>
                <th>Format</th>
                <th>Last Executed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports.map(sched => (
                <tr key={sched.id}>
                  <td className="font-bold text-slate-200">{sched.name}</td>
                  <td className="text-blue-400">{sched.frequency}</td>
                  <td className="text-slate-400 text-[11px]">{sched.scheduleTime}</td>
                  <td className="text-slate-300 text-[11px] truncate max-w-xs">{sched.recipients}</td>
                  <td>
                    <span className="bg-[#0b0f19] border border-[#1e293b] text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {sched.format}
                    </span>
                  </td>
                  <td className="text-slate-400 text-[11px]">{sched.lastRun}</td>
                  <td>
                    <span className={sched.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      ● {sched.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={handleGenerateReport}
                      className="bg-[#0b0f19] hover:bg-blue-950 text-blue-400 border border-[#1e293b] px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      Run Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
