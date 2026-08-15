import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DEVICES,
  INITIAL_PREDICTIVE_ALERTS,
  INITIAL_ALERT_LOGS,
  INITIAL_THRESHOLDS,
  INITIAL_SCHEDULED_REPORTS,
  INITIAL_SYSLOG_STREAM
} from '../data/mockData';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [predictiveAlerts, setPredictiveAlerts] = useState(INITIAL_PREDICTIVE_ALERTS);
  const [alertLogs, setAlertLogs] = useState(INITIAL_ALERT_LOGS);
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [scheduledReports, setScheduledReports] = useState(INITIAL_SCHEDULED_REPORTS);
  const [syslogStream, setSyslogStream] = useState(INITIAL_SYSLOG_STREAM);

  // App Navigation & Filters
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | topology | performance | alerts | reports | settings
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [liveSimulation, setLiveSimulation] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Live Telemetry Simulation Timer (runs every 2.5 seconds)
  useEffect(() => {
    if (!liveSimulation) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      setLastSyncTime(timeStr);

      // Random jitter generator for live telemetry
      setDevices(prevDevices =>
        prevDevices.map(dev => {
          if (dev.status === 'Offline') return dev; // keep offline devices as 0

          // Calculate slight Gaussian noise
          let latencyDelta = (Math.random() - 0.48) * 0.4;
          let newLatency = Math.max(0.5, Number((dev.latency + latencyDelta).toFixed(1)));
          
          let bwDelta = Math.floor((Math.random() - 0.49) * 120);
          let newBw = Math.min(dev.bandwidthCapacity, Math.max(50, dev.bandwidth + bwDelta));

          let newCpu = Math.min(100, Math.max(5, Math.round(dev.cpu + (Math.random() - 0.5) * 2)));

          // Update sparkline array (keep last 10 points)
          const newSparkline = [...dev.sparkline.slice(1), newLatency];

          return {
            ...dev,
            latency: newLatency,
            bandwidth: newBw,
            cpu: newCpu,
            sparkline: newSparkline
          };
        })
      );

      // Randomly append occasional informational syslog event (25% chance per tick)
      if (Math.random() > 0.75) {
        const sampleSources = ['10.0.1.1', '10.0.1.10', '10.0.1.254', '10.0.20.10'];
        const randomSource = sampleSources[Math.floor(Math.random() * sampleSources.length)];
        const newLog = {
          time: timeStr,
          level: 'INFO',
          source: randomSource,
          msg: `Periodic SNMP ping response from ${randomSource} - RTT latency baseline normal.`
        };
        setSyslogStream(prev => [newLog, ...prev.slice(0, 19)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [liveSimulation]);

  // Action: Trigger Anomaly Simulation
  const triggerAnomalySimulation = () => {
    const timeStr = new Date().toLocaleTimeString();
    
    // Inject degradation into RTR-EDGE-02
    setDevices(prev =>
      prev.map(dev => {
        if (dev.id === 'dev-03') {
          return {
            ...dev,
            status: 'Degraded',
            latency: 68.4,
            packetLoss: 5.2,
            bandwidth: 9780,
            cpu: 96,
            sparkline: [...dev.sparkline.slice(1), 68.4]
          };
        }
        return dev;
      })
    );

    // Push new Predictive Alert
    const newPredictive = {
      id: `pred-${Date.now()}`,
      severity: 'Critical',
      confidence: 96,
      device: 'RTR-EDGE-02',
      ip: '10.0.2.254',
      metric: 'Uplink Saturation Breach',
      predictedIssue: 'Interface xe-0/0/0 throughput reached 97.8% limit. Critical packet buffer drop imminent in ~12 mins.',
      trendRate: '+24.2% / hour anomaly spike',
      rootCause: 'Simulated DDOS/Traffic Flood anomaly injected via NetFlow Analyzer module.',
      suggestedAction: 'Activate DDoS mitigation profile & rate-limit incoming peer 198.51.100.45.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setPredictiveAlerts(prev => [newPredictive, ...prev]);

    // Push new Incident Log
    const newIncident = {
      id: `alt-${Date.now()}`,
      severity: 'Critical',
      device: 'RTR-EDGE-02',
      ip: '10.0.2.254',
      metric: 'Bandwidth & Latency Spike',
      message: 'Bandwidth hit 97.8% (9,780 Mbps). Latency elevated to 68.4 ms.',
      status: 'New',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      acknowledgedBy: null
    };

    setAlertLogs(prev => [newIncident, ...prev]);

    // Log Syslog
    setSyslogStream(prev => [
      {
        time: timeStr,
        level: 'CRIT',
        source: '10.0.2.254',
        msg: 'ANOMALY INJECTED: Bandwidth breach on xe-0/0/0 (97.8% capacity).'
      },
      ...prev.slice(0, 19)
    ]);
  };

  // Action: Acknowledge Alert Log
  const acknowledgeAlert = (id, user = 'admin@company.com') => {
    setAlertLogs(prev =>
      prev.map(alt =>
        alt.id === id ? { ...alt, status: 'Acknowledged', acknowledgedBy: user } : alt
      )
    );
  };

  // Action: Resolve Alert Log
  const resolveAlert = (id) => {
    setAlertLogs(prev =>
      prev.map(alt =>
        alt.id === id ? { ...alt, status: 'Resolved' } : alt
      )
    );
  };

  // Action: Add / Edit Threshold Rule
  const addThresholdRule = (rule) => {
    const newRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      enabled: true
    };
    setThresholds(prev => [newRule, ...prev]);
  };

  const toggleThresholdRule = (id) => {
    setThresholds(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Action: Trigger Manual Refresh
  const refreshSNMP = () => {
    const timeStr = new Date().toLocaleTimeString();
    setSyslogStream(prev => [
      {
        time: timeStr,
        level: 'INFO',
        source: 'NOC-POLLER',
        msg: 'Manual SNMP sweep triggered by Administrator. 24 devices polled successfully.'
      },
      ...prev.slice(0, 19)
    ]);
  };

  // Selected device object
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

  return (
    <NetworkContext.Provider
      value={{
        devices,
        predictiveAlerts,
        alertLogs,
        thresholds,
        scheduledReports,
        syslogStream,
        activeTab,
        setActiveTab,
        selectedDeviceId,
        setSelectedDeviceId,
        selectedDevice,
        liveSimulation,
        setLiveSimulation,
        lastSyncTime,
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        triggerAnomalySimulation,
        acknowledgeAlert,
        resolveAlert,
        addThresholdRule,
        toggleThresholdRule,
        refreshSNMP
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
