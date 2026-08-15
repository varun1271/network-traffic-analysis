import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import {
  TrendingUp,
  Activity,
  Cpu,
  Zap,
  AlertTriangle,
  Clock,
  Sliders,
  CheckCircle2,
  BrainCircuit,
  Filter
} from 'lucide-react';

export const PerformanceAnalytics = () => {
  const { devices, predictiveAlerts, triggerAnomalySimulation } = useNetwork();

  // Active Chart Controls
  const [selectedMetric, setSelectedMetric] = useState('latency'); // latency | loss | bandwidth | cpu | memory
  const [timeRange, setTimeRange] = useState('1h'); // 1h | 24h | 7d | 30d
  const [selectedDevices, setSelectedDevices] = useState(['dev-01', 'dev-03', 'dev-04', 'dev-07']);

  const toggleDeviceSelection = (id) => {
    if (selectedDevices.includes(id)) {
      if (selectedDevices.length > 1) {
        setSelectedDevices(selectedDevices.filter(d => d !== id));
      }
    } else {
      if (selectedDevices.length < 5) {
        setSelectedDevices([...selectedDevices, id]);
      }
    }
  };

  // Sample time labels for 1h chart (12 interval points)
  const timeLabels = ['10:00', '10:02', '10:04', '10:06', '10:08', '10:10', '10:12', '10:14', '10:16', '10:18', '10:20', '10:22'];

  const deviceColors = {
    'dev-01': '#3b82f6', // blue
    'dev-02': '#10b981', // green
    'dev-03': '#f59e0b', // amber
    'dev-04': '#a855f7', // purple
    'dev-07': '#ef4444', // red
    'dev-09': '#06b6d4'  // cyan
  };

  // Generate simulated chart dataset for selected devices
  const chartDatasets = selectedDevices.map(devId => {
    const dev = devices.find(d => d.id === devId);
    if (!dev) return null;

    let points = [];
    const baseVal =
      selectedMetric === 'latency'
        ? dev.latency
        : selectedMetric === 'loss'
        ? dev.packetLoss
        : selectedMetric === 'bandwidth'
        ? dev.bandwidth
        : selectedMetric === 'cpu'
        ? dev.cpu
        : dev.memory;

    // Generate 12 trend points ending at current value
    for (let i = 0; i < 12; i++) {
      let noise = (Math.random() - 0.48) * (selectedMetric === 'bandwidth' ? 150 : 2);
      if (dev.status === 'Degraded' && i > 6) {
        noise += selectedMetric === 'latency' ? 12 : selectedMetric === 'bandwidth' ? 600 : 5;
      }
      points.push(Math.max(0.1, Number((baseVal + (i - 11) * 0.5 + noise).toFixed(1))));
    }

    return {
      id: dev.id,
      name: dev.name,
      color: deviceColors[dev.id] || '#64748b',
      points
    };
  }).filter(Boolean);

  // Render SVG multi-line plot with gridlines & threshold reference line
  const renderMultiLineChart = () => {
    const width = 800;
    const height = 240;
    const padding = 35;

    // Find min and max across all points for dynamic scaling
    const allVals = chartDatasets.flatMap(d => d.points);
    const maxVal = Math.max(...allVals, selectedMetric === 'latency' ? 60 : 100) * 1.1;
    const minVal = 0;

    // Threshold value line reference
    const thresholdVal =
      selectedMetric === 'latency' ? 40 : selectedMetric === 'loss' ? 2.5 : selectedMetric === 'cpu' ? 80 : 85;

    const thresholdY = height - padding - ((thresholdVal - minVal) / (maxVal - minVal)) * (height - padding * 2);

    return (
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-400 font-mono">
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - padding - pct * (height - padding * 2);
            const val = (minVal + pct * (maxVal - minVal)).toFixed(0);
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x={padding - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#64748b">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Time Labels (X-Axis) */}
          {timeLabels.map((lbl, idx) => {
            const x = padding + (idx / (timeLabels.length - 1)) * (width - padding * 2);
            return (
              <text key={idx} x={x} y={height - 10} textAnchor="middle" fontSize="9" fill="#64748b">
                {lbl}
              </text>
            );
          })}

          {/* Critical Threshold Overlay Line (Red Dashed) */}
          <line
            x1={padding}
            y1={thresholdY}
            x2={width - padding}
            y2={thresholdY}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={width - padding - 4} y={thresholdY - 4} textAnchor="end" fontSize="9" fill="#ef4444" fontWeight="bold">
            Critical Threshold Rule ({thresholdVal} {selectedMetric === 'latency' ? 'ms' : '%'})
          </text>

          {/* Device Telemetry Lines */}
          {chartDatasets.map(ds => {
            const pathD = ds.points
              .map((val, idx) => {
                const x = padding + (idx / (ds.points.length - 1)) * (width - padding * 2);
                const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
                return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
              })
              .join(' ');

            return (
              <g key={ds.id}>
                <path d={pathD} fill="none" stroke={ds.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                {ds.points.map((val, idx) => {
                  const x = padding + (idx / (ds.points.length - 1)) * (width - padding * 2);
                  const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
                  return (
                    <circle key={idx} cx={x} cy={y} r="3" fill={ds.color} className="hover:r-5 transition-all cursor-pointer" />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Header Controls */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Performance Analysis & Predictive ML Engine
            </h2>
            <p className="text-[11px] text-slate-400">
              Multi-metric telemetry overlay with predictive time-series anomaly forecasting
            </p>
          </div>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded border border-[#1e293b] font-mono text-xs">
          {['1h', '24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                timeRange === range ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range === '1h' ? '1 Hour (Live)' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-4">
        {/* Metric Focus & Device Overlay Checkboxes */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3 text-xs font-mono">
          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded border border-[#1e293b]">
            {[
              { id: 'latency', label: 'Latency (ms)' },
              { id: 'loss', label: 'Packet Loss (%)' },
              { id: 'bandwidth', label: 'Throughput (Mbps)' },
              { id: 'cpu', label: 'CPU Load (%)' },
              { id: 'memory', label: 'RAM Usage (%)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  selectedMetric === m.id ? 'bg-[#1e293b] text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Device Checklist Overlay Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-[11px]">Compare Devices:</span>
            {devices.slice(0, 6).map(dev => (
              <label
                key={dev.id}
                className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] cursor-pointer transition-colors ${
                  selectedDevices.includes(dev.id)
                    ? 'bg-[#0b0f19] border-blue-500/50 text-slate-200'
                    : 'bg-[#0b0f19] border-[#1e293b] text-slate-500 opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(dev.id)}
                  onChange={() => toggleDeviceSelection(dev.id)}
                  className="rounded text-blue-500"
                />
                <span style={{ color: deviceColors[dev.id] || '#94a3b8' }} className="font-bold">
                  {dev.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Multi-Line Chart Canvas */}
        {renderMultiLineChart()}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-2 border-t border-[#1e293b]">
          {chartDatasets.map(ds => (
            <div key={ds.id} className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded" style={{ backgroundColor: ds.color }}></span>
              <span className="text-slate-300">{ds.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive ML Alerts Engine Panel */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-4">
        {/* ML Model Engine Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1626] border border-[#1e293b] p-3 rounded font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-purple-950/60 border border-purple-800/50 text-purple-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Predictive Anomaly Engine (Holt-Winters + Random Forest v2.1)
                </h3>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px] px-1.5 py-0.5 rounded font-bold">
                  ● ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Continuous telemetry analysis forecasting capacity saturation & packet loss degradation
              </p>
            </div>
          </div>

          <button
            onClick={triggerAnomalySimulation}
            className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            Simulate Predictive Anomaly Trigger
          </button>
        </div>

        {/* Predictive Alerts Cards List */}
        <div className="space-y-3 font-mono">
          {predictiveAlerts.map(pred => (
            <div
              key={pred.id}
              className={`p-3.5 rounded border space-y-2 transition-colors ${
                pred.severity === 'Critical'
                  ? 'bg-red-950/20 border-red-800/40 text-slate-200'
                  : pred.severity === 'Warning'
                  ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                  : 'bg-blue-950/20 border-blue-800/40 text-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pred.severity === 'Critical'
                        ? 'badge-critical'
                        : pred.severity === 'Warning'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                  >
                    {pred.severity} Predictive Alert
                  </span>
                  <span className="font-bold text-slate-100 text-xs">{pred.device} ({pred.ip})</span>
                  <span className="text-slate-500 text-[11px]">| {pred.metric}</span>
                </div>

                {/* Confidence Score Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">ML Confidence:</span>
                  <span className="font-bold text-purple-400 text-xs">{pred.confidence}%</span>
                  <div className="w-16 bg-[#0b0f19] h-1.5 rounded overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${pred.confidence}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Issue & Velocity */}
              <div className="text-xs space-y-1">
                <div className="text-slate-100 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{pred.predictedIssue}</span>
                </div>
                <div className="text-slate-400 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                  <div>Velocity: <span className="text-amber-400 font-semibold">{pred.trendRate}</span></div>
                  <div>Root Cause: <span className="text-slate-300">{pred.rootCause}</span></div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-[#0b0f19] border border-[#1e293b] p-2 rounded text-[11px] flex items-baseline gap-2 text-emerald-400">
                <span className="font-bold uppercase shrink-0 text-slate-400">Action Plan:</span>
                <span>{pred.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
