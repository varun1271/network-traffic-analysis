// Mock Data for Network Monitoring & Predictive Alert System
// Realistic Enterprise Network Topology, Telemetry, Alerts, & Reports

export const INITIAL_DEVICES = [
  {
    id: "dev-01",
    name: "CORE-RTR-01",
    type: "Router",
    vendor: "Cisco Systems",
    model: "ASR 9904",
    os: "IOS-XR 7.5.2",
    ip: "10.0.1.1",
    mac: "00:1A:2B:3C:4D:01",
    status: "Healthy",
    tier: "Core",
    location: "DataCenter 1 - Rack A01",
    uptime: "142d 18h 32m",
    latency: 2.1, // ms
    packetLoss: 0.0, // %
    bandwidth: 7420, // Mbps out of 10000
    bandwidthCapacity: 10000,
    cpu: 34, // %
    memory: 48, // %
    temperature: 38, // C
    interfaces: [
      { name: "TenGigE0/0/0/0", speed: "10 Gbps", status: "Up", rxMbps: 3840, txMbps: 3580, errors: 0, drops: 0 },
      { name: "TenGigE0/0/0/1", speed: "10 Gbps", status: "Up", rxMbps: 2100, txMbps: 1950, errors: 0, drops: 0 },
      { name: "GigE0/0/0/2", speed: "1 Gbps", status: "Up", rxMbps: 450, txMbps: 420, errors: 0, drops: 0 },
      { name: "GigE0/0/0/3", speed: "1 Gbps", status: "Down", rxMbps: 0, txMbps: 0, errors: 0, drops: 0 }
    ],
    sparkline: [2.1, 2.3, 2.0, 2.2, 2.1, 2.4, 2.1, 2.0, 2.2, 2.1]
  },
  {
    id: "dev-02",
    name: "CORE-SW-01",
    type: "Switch",
    vendor: "Cisco Systems",
    model: "Catalyst 9500",
    os: "IOS-XE 17.06.03",
    ip: "10.0.1.10",
    mac: "00:1A:2B:3C:4D:02",
    status: "Healthy",
    tier: "Core",
    location: "DataCenter 1 - Rack A02",
    uptime: "210d 04h 12m",
    latency: 1.4,
    packetLoss: 0.0,
    bandwidth: 8200,
    bandwidthCapacity: 10000,
    cpu: 28,
    memory: 52,
    temperature: 41,
    interfaces: [
      { name: "FortyGigE1/0/1", speed: "40 Gbps", status: "Up", rxMbps: 4200, txMbps: 4000, errors: 0, drops: 0 },
      { name: "TenGigE1/0/2", speed: "10 Gbps", status: "Up", rxMbps: 8500, txMbps: 7900, errors: 2, drops: 0 }
    ],
    sparkline: [1.5, 1.4, 1.4, 1.6, 1.3, 1.4, 1.5, 1.4, 1.4, 1.4]
  },
  {
    id: "dev-03",
    name: "RTR-EDGE-02",
    type: "Router",
    vendor: "Juniper Networks",
    model: "MX240 3D",
    os: "Junos OS 21.4R1",
    ip: "10.0.2.254",
    mac: "00:1A:2B:3C:4D:03",
    status: "Degraded",
    tier: "Core",
    location: "Edge Node Alpha - Rack B01",
    uptime: "45d 11h 05m",
    latency: 48.6,
    packetLoss: 3.4,
    bandwidth: 9150,
    bandwidthCapacity: 10000,
    cpu: 89,
    memory: 84,
    temperature: 58,
    interfaces: [
      { name: "xe-0/0/0", speed: "10 Gbps", status: "Up", rxMbps: 4800, txMbps: 4350, errors: 142, drops: 89 },
      { name: "xe-0/0/1", speed: "10 Gbps", status: "Up", rxMbps: 4350, txMbps: 4800, errors: 98, drops: 45 }
    ],
    sparkline: [12.4, 18.2, 24.5, 31.0, 39.4, 42.1, 45.8, 47.2, 48.6, 51.0]
  },
  {
    id: "dev-04",
    name: "FW-PALOALTO-01",
    type: "Firewall",
    vendor: "Palo Alto Networks",
    model: "PA-3220",
    os: "PAN-OS 10.1.6",
    ip: "10.0.1.254",
    mac: "00:1A:2B:3C:4D:04",
    status: "Healthy",
    tier: "Distribution",
    location: "DataCenter 1 - DMZ Rack",
    uptime: "98d 22h 19m",
    latency: 3.2,
    packetLoss: 0.01,
    bandwidth: 3400,
    bandwidthCapacity: 5000,
    cpu: 42,
    memory: 61,
    temperature: 44,
    interfaces: [
      { name: "ethernet1/1 (Untrust)", speed: "10 Gbps", status: "Up", rxMbps: 1800, txMbps: 1600, errors: 0, drops: 0 },
      { name: "ethernet1/2 (Trust)", speed: "10 Gbps", status: "Up", rxMbps: 1600, txMbps: 1800, errors: 0, drops: 0 }
    ],
    sparkline: [3.1, 3.2, 3.3, 3.1, 3.2, 3.4, 3.2, 3.1, 3.2, 3.2]
  },
  {
    id: "dev-05",
    name: "DIST-SW-BUILDING-A",
    type: "Switch",
    vendor: "Aruba Networks",
    model: "CX 6300M",
    os: "ArubaOS-CX 10.09",
    ip: "10.0.10.1",
    mac: "00:1A:2B:3C:4D:05",
    status: "Healthy",
    tier: "Distribution",
    location: "Bldg A - MDF Room",
    uptime: "312d 14h 50m",
    latency: 2.8,
    packetLoss: 0.0,
    bandwidth: 1850,
    bandwidthCapacity: 4000,
    cpu: 22,
    memory: 38,
    temperature: 36,
    interfaces: [
      { name: "1/1/49", speed: "10 Gbps", status: "Up", rxMbps: 950, txMbps: 900, errors: 0, drops: 0 }
    ],
    sparkline: [2.8, 2.7, 2.9, 2.8, 2.8, 2.9, 2.7, 2.8, 2.8, 2.8]
  },
  {
    id: "dev-06",
    name: "ACC-SW-FLOOR1",
    type: "Switch",
    vendor: "Cisco Systems",
    model: "Catalyst 9200",
    os: "IOS-XE 17.03.04",
    ip: "10.0.10.11",
    mac: "00:1A:2B:3C:4D:06",
    status: "Healthy",
    tier: "Access",
    location: "Bldg A - Floor 1 IDF",
    uptime: "88d 09h 14m",
    latency: 3.5,
    packetLoss: 0.0,
    bandwidth: 620,
    bandwidthCapacity: 1000,
    cpu: 18,
    memory: 32,
    temperature: 34,
    interfaces: [
      { name: "Gi1/0/1", speed: "1 Gbps", status: "Up", rxMbps: 320, txMbps: 300, errors: 0, drops: 0 }
    ],
    sparkline: [3.4, 3.5, 3.6, 3.4, 3.5, 3.5, 3.7, 3.5, 3.4, 3.5]
  },
  {
    id: "dev-07",
    name: "AP-FLOOR3-05",
    type: "Access Point",
    vendor: "Aruba Networks",
    model: "AP-535 Wi-Fi 6",
    os: "ArubaOS 8.8.0.0",
    ip: "10.0.10.155",
    mac: "00:1A:2B:3C:4D:07",
    status: "Degraded",
    tier: "Access",
    location: "Bldg A - Floor 3 Executive Suite",
    uptime: "12d 02h 45m",
    latency: 24.8,
    packetLoss: 4.8,
    bandwidth: 410,
    bandwidthCapacity: 500,
    cpu: 76,
    memory: 71,
    temperature: 46,
    interfaces: [
      { name: "eth0", speed: "1 Gbps", status: "Up", rxMbps: 220, txMbps: 190, errors: 45, drops: 28 }
    ],
    sparkline: [5.2, 8.1, 12.4, 18.0, 22.1, 24.8, 23.9, 25.1, 24.8, 26.2]
  },
  {
    id: "dev-08",
    name: "AP-FLOOR2-03",
    type: "Access Point",
    vendor: "Aruba Networks",
    model: "AP-535 Wi-Fi 6",
    os: "ArubaOS 8.8.0.0",
    ip: "10.0.10.153",
    mac: "00:1A:2B:3C:4D:08",
    status: "Healthy",
    tier: "Access",
    location: "Bldg A - Floor 2 Engineering Lab",
    uptime: "64d 18h 10m",
    latency: 5.1,
    packetLoss: 0.02,
    bandwidth: 290,
    bandwidthCapacity: 500,
    cpu: 24,
    memory: 40,
    temperature: 37,
    interfaces: [
      { name: "eth0", speed: "1 Gbps", status: "Up", rxMbps: 150, txMbps: 140, errors: 0, drops: 0 }
    ],
    sparkline: [5.0, 5.1, 5.2, 5.0, 5.1, 5.3, 5.1, 5.0, 5.2, 5.1]
  },
  {
    id: "dev-09",
    name: "SRV-DC-DB01",
    type: "Server",
    vendor: "Dell Technologies",
    model: "PowerEdge R750",
    os: "Ubuntu 22.04 LTS (Kernel 5.15)",
    ip: "10.0.20.10",
    mac: "00:1A:2B:3C:4D:09",
    status: "Healthy",
    tier: "Server",
    location: "DataCenter 1 - Server Row 3",
    uptime: "405d 10h 22m",
    latency: 1.1,
    packetLoss: 0.0,
    bandwidth: 3200,
    bandwidthCapacity: 10000,
    cpu: 48,
    memory: 74,
    temperature: 39,
    interfaces: [
      { name: "eno1", speed: "10 Gbps", status: "Up", rxMbps: 1700, txMbps: 1500, errors: 0, drops: 0 }
    ],
    sparkline: [1.1, 1.2, 1.1, 1.0, 1.1, 1.1, 1.2, 1.1, 1.1, 1.1]
  },
  {
    id: "dev-10",
    name: "SRV-DC-APP02",
    type: "Server",
    vendor: "Dell Technologies",
    model: "PowerEdge R650",
    os: "RHEL 8.6",
    ip: "10.0.20.22",
    mac: "00:1A:2B:3C:4D:10",
    status: "Healthy",
    tier: "Server",
    location: "DataCenter 1 - Server Row 3",
    uptime: "189d 07h 04m",
    latency: 1.3,
    packetLoss: 0.0,
    bandwidth: 1450,
    bandwidthCapacity: 10000,
    cpu: 31,
    memory: 58,
    temperature: 37,
    interfaces: [
      { name: "ens1f0", speed: "10 Gbps", status: "Up", rxMbps: 750, txMbps: 700, errors: 0, drops: 0 }
    ],
    sparkline: [1.3, 1.3, 1.4, 1.2, 1.3, 1.3, 1.2, 1.4, 1.3, 1.3]
  },
  {
    id: "dev-11",
    name: "SAN-STORAGE-01",
    type: "Storage",
    vendor: "NetApp",
    model: "AFF A400",
    os: "ONTAP 9.10.1",
    ip: "10.0.30.5",
    mac: "00:1A:2B:3C:4D:11",
    status: "Healthy",
    tier: "Server",
    location: "DataCenter 1 - SAN Bay",
    uptime: "520d 21h 14m",
    latency: 0.8,
    packetLoss: 0.0,
    bandwidth: 6400,
    bandwidthCapacity: 10000,
    cpu: 29,
    memory: 63,
    temperature: 32,
    interfaces: [
      { name: "e0a", speed: "10 Gbps", status: "Up", rxMbps: 3400, txMbps: 3000, errors: 0, drops: 0 }
    ],
    sparkline: [0.8, 0.8, 0.9, 0.7, 0.8, 0.8, 0.9, 0.8, 0.8, 0.8]
  },
  {
    id: "dev-12",
    name: "ACC-SW-FLOOR2",
    type: "Switch",
    vendor: "Cisco Systems",
    model: "Catalyst 9200",
    os: "IOS-XE 17.03.04",
    ip: "10.0.10.12",
    mac: "00:1A:2B:3C:4D:12",
    status: "Offline",
    tier: "Access",
    location: "Bldg A - Floor 2 IDF",
    uptime: "0d 0h 0m",
    latency: 0.0,
    packetLoss: 100.0,
    bandwidth: 0,
    bandwidthCapacity: 1000,
    cpu: 0,
    memory: 0,
    temperature: 0,
    interfaces: [
      { name: "Gi1/0/1", speed: "1 Gbps", status: "Down", rxMbps: 0, txMbps: 0, errors: 0, drops: 0 }
    ],
    sparkline: [3.2, 3.4, 3.1, 0, 0, 0, 0, 0, 0, 0]
  }
];

// Predictive ML Engine Alerts
export const INITIAL_PREDICTIVE_ALERTS = [
  {
    id: "pred-101",
    severity: "Critical",
    confidence: 94,
    device: "RTR-EDGE-02",
    ip: "10.0.2.254",
    metric: "Bandwidth Saturation & Packet Loss",
    predictedIssue: "Uplink interface xe-0/0/0 trending toward 98.5% capacity saturation in ~1h 35m",
    trendRate: "+18.4% / hour growth",
    rootCause: "Unscheduled data sync traffic originating from 10.0.20.10 + BGP route jitter on peer 198.51.100.45",
    suggestedAction: "Reroute non-critical sync traffic to Secondary Core Link (CORE-RTR-01) or adjust QoS rate-limiting rules.",
    timestamp: "2026-08-15 10:14:22"
  },
  {
    id: "pred-102",
    severity: "Warning",
    confidence: 87,
    device: "AP-FLOOR3-05",
    ip: "10.0.10.155",
    metric: "Wi-Fi Signal & Packet Degradation",
    predictedIssue: "Wireless frame retransmissions predicted to exceed 12% threshold within 45 mins",
    trendRate: "+2.1% retransmissions / 15m",
    rootCause: "Co-channel interference (DFS Radar pulse detected on Ch 116) forcing client roaming spikes",
    suggestedAction: "Trigger Dynamic Frequency Selection (DFS) channel change to Ch 44 via Aruba WLC API.",
    timestamp: "2026-08-15 10:05:10"
  },
  {
    id: "pred-103",
    severity: "Warning",
    confidence: 81,
    device: "CORE-SW-01",
    ip: "10.0.1.10",
    metric: "Control Plane Memory Leak",
    predictedIssue: "RAM utilization projected to breach 90% threshold in ~6 hours",
    trendRate: "+1.2% memory growth / hour",
    rootCause: "Orphaned ARP entry tables in IOS-XE process 'arp_manager' following VLAN 100 reconfiguration",
    suggestedAction: "Schedule a soft restart of the ARP process or perform 'clear ip arp' maintenance window flush.",
    timestamp: "2026-08-15 09:42:00"
  },
  {
    id: "pred-104",
    severity: "Info",
    confidence: 76,
    device: "FW-PALOALTO-01",
    ip: "10.0.1.254",
    metric: "NAT Session Table Capacity",
    predictedIssue: "Active NAT session table predicted to hit 75% limit during upcoming 14:00 peak hours",
    trendRate: "+450 sessions / min",
    rootCause: "Increased outbound API telemetry polling from internal microservices pool",
    suggestedAction: "Expand NAT pool IP address range on interface ethernet1/1.",
    timestamp: "2026-08-15 08:30:15"
  }
];

// Historical & Active Incident Alert Logs
export const INITIAL_ALERT_LOGS = [
  {
    id: "alt-801",
    severity: "Critical",
    device: "ACC-SW-FLOOR2",
    ip: "10.0.10.12",
    metric: "ICMP Unreachable",
    message: "Device non-responsive to ICMP echo requests for 3 consecutive polling cycles",
    status: "New",
    timestamp: "2026-08-15 10:18:04",
    acknowledgedBy: null
  },
  {
    id: "alt-802",
    severity: "Critical",
    device: "RTR-EDGE-02",
    ip: "10.0.2.254",
    metric: "High Latency & Packet Loss",
    message: "Latency spiked to 48.6 ms (Threshold: >35 ms). Packet loss elevated to 3.4%",
    status: "New",
    timestamp: "2026-08-15 10:12:45",
    acknowledgedBy: null
  },
  {
    id: "alt-803",
    severity: "Warning",
    device: "AP-FLOOR3-05",
    ip: "10.0.10.155",
    metric: "High CPU & Loss",
    message: "CPU usage at 76% (Threshold: >70%). Packet loss at 4.8%",
    status: "Acknowledged",
    timestamp: "2026-08-15 09:55:12",
    acknowledgedBy: "admin@company.com"
  },
  {
    id: "alt-804",
    severity: "Warning",
    device: "SRV-DC-DB01",
    ip: "10.0.20.10",
    metric: "Memory Utilization",
    message: "Memory utilization exceeded 70% threshold (Current: 74%)",
    status: "Acknowledged",
    timestamp: "2026-08-15 08:14:30",
    acknowledgedBy: "sysadmin_noc"
  },
  {
    id: "alt-805",
    severity: "Info",
    device: "CORE-RTR-01",
    ip: "10.0.1.1",
    metric: "BGP Peer State Change",
    message: "BGP peer 198.51.100.45 state changed from Established to Active",
    status: "Resolved",
    timestamp: "2026-08-15 06:22:11",
    acknowledgedBy: "net_ops_lead"
  }
];

// Alert Threshold Rules
export const INITIAL_THRESHOLDS = [
  {
    id: "rule-01",
    name: "Core Latency Threshold",
    metric: "Latency",
    unit: "ms",
    targetType: "Core & Distribution Routers",
    warningVal: 20,
    criticalVal: 40,
    durationSec: 60,
    action: "Trigger Alert & Email",
    enabled: true
  },
  {
    id: "rule-02",
    name: "Interface Packet Loss Rule",
    metric: "Packet Loss",
    unit: "%",
    targetType: "All Devices",
    warningVal: 1.5,
    criticalVal: 4.0,
    durationSec: 30,
    action: "Trigger Critical Alert & Syslog",
    enabled: true
  },
  {
    id: "rule-03",
    name: "Uplink Bandwidth Saturation",
    metric: "Bandwidth Utilization",
    unit: "%",
    targetType: "Core Routers & Edge Switches",
    warningVal: 80,
    criticalVal: 92,
    durationSec: 120,
    action: "Trigger Predictive Alert",
    enabled: true
  },
  {
    id: "rule-04",
    name: "Device CPU Load Limit",
    metric: "CPU Utilization",
    unit: "%",
    targetType: "Firewalls & Routers",
    warningVal: 75,
    criticalVal: 88,
    durationSec: 180,
    action: "Trigger Warning Log",
    enabled: true
  }
];

// Scheduled Automated Reports
export const INITIAL_SCHEDULED_REPORTS = [
  {
    id: "sched-01",
    name: "Weekly Network Health & SLA Summary",
    frequency: "Weekly",
    scheduleTime: "Every Monday @ 08:00 AM",
    recipients: "admin@company.com, noc-team@company.com",
    format: "PDF",
    lastRun: "2026-08-10 08:00",
    status: "Active"
  },
  {
    id: "sched-02",
    name: "Daily Bandwidth Saturation & Capacity Audit",
    frequency: "Daily",
    scheduleTime: "Every Day @ 06:00 AM",
    recipients: "network-planner@company.com",
    format: "CSV",
    lastRun: "2026-08-15 06:00",
    status: "Active"
  },
  {
    id: "sched-03",
    name: "Monthly Executive NOC Incident Log",
    frequency: "Monthly",
    scheduleTime: "1st of Month @ 00:00 AM",
    recipients: "cio-office@company.com",
    format: "PDF",
    lastRun: "2026-08-01 00:00",
    status: "Paused"
  }
];

// Monospace Live Syslog Stream Initial Lines
export const INITIAL_SYSLOG_STREAM = [
  { time: "10:21:44", level: "INFO", source: "10.0.1.1", msg: "SNMP v3 poll successful. 24 devices responding. RTT avg 4.12ms." },
  { time: "10:21:40", level: "WARN", source: "10.0.2.254", msg: "Interface xe-0/0/0 throughput 9.15 Gbps (91.5% capacity)." },
  { time: "10:21:35", level: "INFO", source: "10.0.1.254", msg: "PaloAlto-01 NAT session table: 42,108 active entries." },
  { time: "10:21:30", level: "WARN", source: "10.0.10.155", msg: "802.11ax AP-FLOOR3-05 retransmissions elevated (4.8%)." },
  { time: "10:21:22", level: "ERROR", source: "10.0.10.12", msg: "ICMP Echo timeout from ACC-SW-FLOOR2. Retry count 3/3 failed." }
];
