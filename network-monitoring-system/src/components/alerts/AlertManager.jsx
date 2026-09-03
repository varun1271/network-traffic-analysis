import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Plus,
  Search,
  Filter,
  Shield,
  Clock,
  UserCheck
} from 'lucide-react';

export const AlertManager = () => {
  const { alertLogs, thresholds, acknowledgeAlert, resolveAlert, addThresholdRule, toggleThresholdRule } = useNetwork();

  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    name: '',
    metric: 'Latency',
    unit: 'ms',
    targetType: 'Core Routers',
    warningVal: 25,
    criticalVal: 50,
    durationSec: 60,
    action: 'Trigger Alert & Email'
  });

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRule.name) return;
    addThresholdRule(newRule);
    setShowAddForm(false);
    setNewRule({
      name: '',
      metric: 'Latency',
      unit: 'ms',
      targetType: 'Core Routers',
      warningVal: 25,
      criticalVal: 50,
      durationSec: 60,
      action: 'Trigger Alert & Email'
    });
  };

  const criticalCount = alertLogs.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alertLogs.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const ackCount = alertLogs.filter(a => a.status === 'Acknowledged').length;
  const resolvedCount = alertLogs.filter(a => a.status === 'Resolved').length;
  const unresolvedCount = alertLogs.filter(a => a.status !== 'Resolved').length;

  const filteredLogs = alertLogs.filter(alt => {
    const matchesSev = severityFilter === 'All' || alt.severity === severityFilter;
    const matchesStat = statusFilter === 'All' || alt.status === statusFilter;
    const matchesSearch =
      alt.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesStat && matchesSearch;
  });

  return (
    <motion.div className="p-4 space-y-4 font-mono">
      {/* Module 2 Context Header Banner */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-md font-sans">
        <div className="flex items-center gap-2.5">
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            MODULE 2
          </span>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Module 2: Performance Analysis & Alert Generation</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-purple-400">Alert Manager & Incident Triage</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Active incident alerts, SLA breach tracking, operator acknowledgement, and resolution lifecycle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded border font-bold ${
            unresolvedCount > 0 ? 'bg-red-950/60 border-red-800/80 text-red-400' : 'bg-[#0b0f19] border-[#1e293b] text-emerald-400'
          }`}>
            {unresolvedCount} Active Unresolved Alerts
          </span>
        </div>
      </div>

      {/* Top Incident Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Critical Unresolved"
          value={criticalCount}
          subtitle="Requires Immediate Action"
          icon={AlertTriangle}
          statusColor="text-red-400"
        />
        <StatCard
          title="Warning Incidents"
          value={warningCount}
          subtitle="Degraded Performance"
          icon={Bell}
          statusColor="text-amber-400"
        />
        <StatCard
          title="Acknowledged"
          value={ackCount}
          subtitle="Assigned to NOC Team"
          icon={UserCheck}
          statusColor="text-blue-400"
        />
        <StatCard
          title="Resolved Incidents"
          value={resolvedCount}
          subtitle="Historical Solved Alerts"
          icon={CheckCircle2}
          statusColor="text-emerald-400"
        />
      </div>

      {/* Threshold Configuration Rules Section */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Configured Telemetry Threshold Rules ({thresholds.length})
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Set latency, packet loss, and saturation rules triggering automated incident tickets
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddForm ? 'Cancel Form' : 'Add Threshold Rule'}
          </button>
        </div>

        {/* Add Threshold Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreateRule} className="bg-[#0b0f19] border border-[#1e293b] p-3 rounded space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block text-[10px] uppercase mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Edge Switch Packet Loss"
                  value={newRule.name}
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full bg-[#151d30] border border-[#1e293b] rounded px-2 py-1 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase mb-1">Metric</label>
                <select
                  value={newRule.metric}
                  onChange={e => setNewRule({ ...newRule, metric: e.target.value })}
                  className="w-full bg-[#151d30] border border-[#1e293b] rounded px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="Latency">Latency (ms)</option>
                  <option value="Packet Loss">Packet Loss (%)</option>
                  <option value="Bandwidth Utilization">Bandwidth Saturation (%)</option>
                  <option value="CPU Utilization">CPU Load (%)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase mb-1">Warning Threshold</label>
                <input
                  type="number"
                  value={newRule.warningVal}
                  onChange={e => setNewRule({ ...newRule, warningVal: Number(e.target.value) })}
                  className="w-full bg-[#151d30] border border-[#1e293b] rounded px-2 py-1 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase mb-1">Critical Threshold</label>
                <input
                  type="number"
                  value={newRule.criticalVal}
                  onChange={e => setNewRule({ ...newRule, criticalVal: Number(e.target.value) })}
                  className="w-full bg-[#151d30] border border-[#1e293b] rounded px-2 py-1 text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded bg-[#151d30] text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-1 rounded bg-blue-600 text-white font-bold">
                Save Rule
              </button>
            </div>
          </form>
        )}

        {/* Existing Rules Table */}
        <div className="overflow-x-auto">
          <table className="noc-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Metric</th>
                <th>Target Scope</th>
                <th>Warning Limit</th>
                <th>Critical Limit</th>
                <th>Duration</th>
                <th>Triggered Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map(rule => (
                <tr key={rule.id}>
                  <td className="font-bold text-slate-200">{rule.name}</td>
                  <td className="text-blue-400">{rule.metric}</td>
                  <td className="text-slate-400 text-[11px]">{rule.targetType}</td>
                  <td className="text-amber-400">{rule.warningVal} {rule.unit}</td>
                  <td className="text-red-400 font-bold">{rule.criticalVal} {rule.unit}</td>
                  <td className="text-slate-400">{rule.durationSec}s sustained</td>
                  <td className="text-slate-300 text-[11px]">{rule.action}</td>
                  <td>
                    <button
                      onClick={() => toggleThresholdRule(rule.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {rule.enabled ? 'ENABLED' : 'PAUSED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Incident Alert Log Table */}
      <div className="bg-[#151d30] border border-[#1e293b] rounded p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Incident Alert Logs ({filteredLogs.length})
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#0b0f19] border border-[#1e293b] rounded text-slate-200 pl-8 pr-3 py-1 focus:outline-none w-48"
              />
            </div>

            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded px-2 py-1 text-slate-300 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#0b0f19] border border-[#1e293b] rounded px-2 py-1 text-slate-300 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Alert Logs Table */}
        <div className="overflow-x-auto">
          <table className="noc-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Affected Device</th>
                <th>IP Address</th>
                <th>Metric / Rule</th>
                <th>Incident Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className={log.status === 'New' ? 'bg-red-950/10' : ''}>
                  <td className="text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'Critical'
                          ? 'badge-critical'
                          : log.severity === 'Warning'
                          ? 'badge-warning'
                          : 'badge-info'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="font-bold text-slate-200">{log.device}</td>
                  <td className="text-blue-400">{log.ip}</td>
                  <td className="text-slate-300">{log.metric}</td>
                  <td className="text-slate-300 text-[11px] truncate max-w-xs">{log.message}</td>
                  <td>
                    {log.status === 'New' && <span className="text-red-400 font-bold">● New</span>}
                    {log.status === 'Acknowledged' && (
                      <span className="text-blue-400 text-[11px]">
                        ✓ Ack by {log.acknowledgedBy || 'Admin'}
                      </span>
                    )}
                    {log.status === 'Resolved' && <span className="text-emerald-400">✓ Resolved</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {log.status === 'New' && (
                        <button
                          onClick={() => acknowledgeAlert(log.id)}
                          className="bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60 px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          Ack
                        </button>
                      )}
                      {log.status !== 'Resolved' && (
                        <button
                          onClick={() => resolveAlert(log.id)}
                          className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
