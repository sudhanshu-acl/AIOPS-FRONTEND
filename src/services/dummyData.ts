// Types for the global state and multi-tenancy
export interface Project {
  id: string;
  name: string;
  description?: string;
  environment?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  authorizedProjectIds: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  projectId?: string;
}

// Dummy Global Data
export const projects: Project[] = [
  { id: 'proj-1', name: 'Alpha E-Commerce', description: 'Main e-commerce platform.', environment: 'Production', createdAt: '2025-01-15' },
  { id: 'proj-2', name: 'Beta Analytics', description: 'Internal data processing pipeline.', environment: 'Staging', createdAt: '2025-06-20' },
  { id: 'proj-3', name: 'Internal HR Tools', description: 'Employee management portal.', environment: 'Production', createdAt: '2024-11-05' }
];

export const allUsers: User[] = [
  { id: 'usr-1001', name: 'Admin User', role: 'System Admin', authorizedProjectIds: ['proj-1', 'proj-2'] },
  { id: 'usr-1002', name: 'Jane Doe', role: 'Operator', authorizedProjectIds: ['proj-1'] },
  { id: 'usr-1003', name: 'John Smith', role: 'Viewer', authorizedProjectIds: ['proj-1', 'proj-2', 'proj-3'] },
  { id: 'usr-1004', name: 'Alice Bob', role: 'DevOps Engineer', authorizedProjectIds: ['proj-2', 'proj-3'] },
];

export const currentUser: User = allUsers[0]; // Set current user to Admin

export const activityLogsData: ActivityLog[] = [
  { id: 'log-1', timestamp: '10 mins ago', userId: 'usr-1001', userName: 'Admin User', action: 'Acknowledged Alert ALT-1002', projectId: 'proj-1' },
  { id: 'log-2', timestamp: '1 hour ago', userId: 'usr-1004', userName: 'Alice Bob', action: 'Restarted DB-Cluster-02', projectId: 'proj-3' },
  { id: 'log-3', timestamp: '3 hours ago', userId: 'usr-1002', userName: 'Jane Doe', action: 'Resolved Incident INC-992', projectId: 'proj-1' },
  { id: 'log-4', timestamp: '5 hours ago', userId: 'usr-1001', userName: 'Admin User', action: 'Granted access to Jane Doe', projectId: 'proj-1' },
  { id: 'log-5', timestamp: '1 day ago', userId: 'usr-1003', userName: 'John Smith', action: 'Downloaded Monthly Report', projectId: 'proj-2' },
];

export const getProjectActivityLogs = (projectId: string): ActivityLog[] => {
  return activityLogsData.filter(log => log.projectId === projectId || !log.projectId);
};

// --- Dashboard Metrics ---
export interface DashboardMetrics {
  projectId: string;
  activeAnomalies: number;
  systemHealth: number;
  incidentsResolved: number;
  networkTraffic: string;
}

const allMetrics: DashboardMetrics[] = [
  { projectId: 'proj-1', activeAnomalies: 14, systemHealth: 92, incidentsResolved: 128, networkTraffic: '4.2 TB/s' },
  { projectId: 'proj-2', activeAnomalies: 3, systemHealth: 99, incidentsResolved: 45, networkTraffic: '1.1 TB/s' },
  { projectId: 'proj-3', activeAnomalies: 0, systemHealth: 100, incidentsResolved: 5, networkTraffic: '500 GB/s' }
];

export const getDashboardMetrics = (projectId: string): DashboardMetrics => {
  return allMetrics.find(m => m.projectId === projectId) || {
    projectId, activeAnomalies: 0, systemHealth: 100, incidentsResolved: 0, networkTraffic: '0 B/s'
  };
};

// --- Alerts ---
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'Open' | 'Investigating' | 'Closed';

export interface Alert {
  id: string;
  projectId: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  status: AlertStatus;
}

const allAlerts: Alert[] = [
  { id: 'ALT-1001', projectId: 'proj-1', severity: 'critical', message: 'Database Connection Timeout on DB-Cluster-02', timestamp: '2 mins ago', status: 'Open' },
  { id: 'ALT-1002', projectId: 'proj-1', severity: 'warning', message: 'High CPU Usage on Web-Node-05 (>85%)', timestamp: '15 mins ago', status: 'Investigating' },
  { id: 'ALT-1003', projectId: 'proj-1', severity: 'critical', message: 'Payment API Latency Spike', timestamp: '1 hr ago', status: 'Open' },
  { id: 'ALT-2001', projectId: 'proj-2', severity: 'info', message: 'Nightly Backup Completed Successfully', timestamp: '4 hrs ago', status: 'Closed' },
  { id: 'ALT-2002', projectId: 'proj-2', severity: 'warning', message: 'Memory Leak Detected in Analytics Service', timestamp: '5 hrs ago', status: 'Investigating' },
];

export const getAlerts = (projectId: string): Alert[] => {
  return allAlerts.filter(a => a.projectId === projectId);
};

// --- Topology ---
export type NodeStatus = 'healthy' | 'warning' | 'critical';
export type NodeType = 'Gateway' | 'Frontend' | 'Microservice' | 'Database';

export interface TopologyNode {
  id: string;
  projectId: string;
  type: NodeType;
  status: NodeStatus;
}

const allTopologyNodes: TopologyNode[] = [
  { id: 'LoadBalancer-A', projectId: 'proj-1', type: 'Gateway', status: 'healthy' },
  { id: 'Web-Node-01', projectId: 'proj-1', type: 'Frontend', status: 'healthy' },
  { id: 'Web-Node-02', projectId: 'proj-1', type: 'Frontend', status: 'healthy' },
  { id: 'Payment-API', projectId: 'proj-1', type: 'Microservice', status: 'critical' },
  { id: 'DB-Cluster-01', projectId: 'proj-1', type: 'Database', status: 'healthy' },
  { id: 'DB-Cluster-02', projectId: 'proj-1', type: 'Database', status: 'critical' },
  { id: 'API-Gateway', projectId: 'proj-2', type: 'Gateway', status: 'healthy' },
  { id: 'Analytics-Engine', projectId: 'proj-2', type: 'Microservice', status: 'warning' },
  { id: 'Data-Lake', projectId: 'proj-2', type: 'Database', status: 'healthy' }
];

export const getTopologyNodes = (projectId: string): TopologyNode[] => {
  return allTopologyNodes.filter(n => n.projectId === projectId);
};

// --- Analytics Predictions ---
export interface AnalyticsPrediction {
  projectId: string;
  service: string;
  prediction: string;
  confidence: string;
}

const allPredictions: AnalyticsPrediction[] = [
  { projectId: 'proj-1', service: 'Payment-API', prediction: 'Latency will breach SLA during upcoming peak hour.', confidence: '94%' },
  { projectId: 'proj-1', service: 'Storage-Cluster', prediction: 'Disk space will reach 95% capacity in 3 days.', confidence: '99%' },
  { projectId: 'proj-2', service: 'Analytics-Engine', prediction: 'Likely to exhaust memory in 4 hours based on current trend.', confidence: '89%' },
];

export const getAnalyticsPredictions = (projectId: string): AnalyticsPrediction[] => {
  return allPredictions.filter(p => p.projectId === projectId);
};

// --- Roles and Permissions ---
export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

export const availablePermissions: Permission[] = [
  // Dashboard
  { id: 'dash:view', module: 'Dashboard', action: 'View Metrics', description: 'Can view high-level dashboard metrics.' },
  
  // Alerts
  { id: 'alerts:view', module: 'Alerts', action: 'View Alerts', description: 'Can view the list of system alerts.' },
  { id: 'alerts:ack', module: 'Alerts', action: 'Acknowledge Alerts', description: 'Can acknowledge and change alert status.' },
  { id: 'alerts:delete', module: 'Alerts', action: 'Delete Alerts', description: 'Can permanently delete alerts.' },

  // Topology
  { id: 'topo:view', module: 'Topology', action: 'View Topology', description: 'Can view the system topology map.' },
  { id: 'topo:edit', module: 'Topology', action: 'Edit Nodes', description: 'Can edit node properties and connections.' },

  // System
  { id: 'sys:users', module: 'System', action: 'Manage Users', description: 'Can add, edit, and delete users.' },
  { id: 'sys:roles', module: 'System', action: 'Manage Roles', description: 'Can define roles and assign permissions.' },
];

export interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
}

export const systemRoles: SystemRole[] = [
  { 
    id: 'role-1', 
    name: 'System Admin', 
    description: 'Full access to all system modules and configuration.',
    permissionIds: ['dash:view', 'alerts:view', 'alerts:ack', 'alerts:delete', 'topo:view', 'topo:edit', 'sys:users', 'sys:roles']
  },
  { 
    id: 'role-2', 
    name: 'DevOps Engineer', 
    description: 'Can manage alerts and topology, but cannot manage users.',
    permissionIds: ['dash:view', 'alerts:view', 'alerts:ack', 'topo:view', 'topo:edit']
  },
  { 
    id: 'role-3', 
    name: 'Operator', 
    description: 'Can view dashboards and acknowledge alerts.',
    permissionIds: ['dash:view', 'alerts:view', 'alerts:ack', 'topo:view']
  },
  { 
    id: 'role-4', 
    name: 'Viewer', 
    description: 'Read-only access to most modules.',
    permissionIds: ['dash:view', 'alerts:view', 'topo:view']
  }
];

// --- Server Infrastructure ---
export interface ServerInstance {
  id: string;
  projectId: string;
  name: string;
  type: string;
  ipAddress: string;
  region: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
  networkTxRx: string;
}

const allServers: ServerInstance[] = [
  { id: 'srv-101', projectId: 'proj-1', name: 'Web-Node-01', type: 'Frontend', ipAddress: '192.168.1.10', region: 'us-east-1', status: 'healthy', cpuUsage: 45, memoryUsage: 60, uptime: '45d 12h', networkTxRx: '1.2 GB/s | 800 MB/s' },
  { id: 'srv-102', projectId: 'proj-1', name: 'Web-Node-02', type: 'Frontend', ipAddress: '192.168.1.11', region: 'us-east-1', status: 'healthy', cpuUsage: 50, memoryUsage: 65, uptime: '45d 12h', networkTxRx: '1.1 GB/s | 750 MB/s' },
  { id: 'srv-103', projectId: 'proj-1', name: 'Payment-API', type: 'Microservice', ipAddress: '10.0.0.5', region: 'us-west-2', status: 'critical', cpuUsage: 95, memoryUsage: 88, uptime: '12d 4h', networkTxRx: '4.5 GB/s | 4.2 GB/s' },
  { id: 'srv-104', projectId: 'proj-1', name: 'DB-Cluster-01', type: 'Database', ipAddress: '10.0.1.100', region: 'us-east-1', status: 'healthy', cpuUsage: 30, memoryUsage: 40, uptime: '120d 2h', networkTxRx: '500 MB/s | 2.1 GB/s' },
  { id: 'srv-105', projectId: 'proj-1', name: 'DB-Cluster-02', type: 'Database', ipAddress: '10.0.1.101', region: 'us-east-1', status: 'critical', cpuUsage: 85, memoryUsage: 92, uptime: '15d 1h', networkTxRx: '10 MB/s | 0 MB/s' },
  { id: 'srv-201', projectId: 'proj-2', name: 'API-Gateway', type: 'Gateway', ipAddress: '172.16.0.5', region: 'eu-central-1', status: 'healthy', cpuUsage: 25, memoryUsage: 30, uptime: '80d 5h', networkTxRx: '800 MB/s | 400 MB/s' },
  { id: 'srv-202', projectId: 'proj-2', name: 'Analytics-Engine', type: 'Microservice', ipAddress: '172.16.0.15', region: 'eu-central-1', status: 'warning', cpuUsage: 75, memoryUsage: 82, uptime: '5d 8h', networkTxRx: '2.5 GB/s | 3.1 GB/s' },
  { id: 'srv-203', projectId: 'proj-2', name: 'Data-Lake', type: 'Database', ipAddress: '172.16.1.50', region: 'eu-west-1', status: 'healthy', cpuUsage: 40, memoryUsage: 55, uptime: '200d 0h', networkTxRx: '100 MB/s | 4.8 GB/s' },
];

export const getProjectServers = (projectId: string): ServerInstance[] => {
  return allServers.filter(s => s.projectId === projectId);
};

// --- Server Logs ---
export interface ServerLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

const generateMockLogs = (serverId: string): ServerLog[] => {
  const isCritical = allServers.find(s => s.id === serverId)?.status === 'critical';
  
  const baseLogs: ServerLog[] = [
    { id: 'log-1', timestamp: '2026-05-07 10:00:01', level: 'INFO', message: 'System boot sequence initiated.' },
    { id: 'log-2', timestamp: '2026-05-07 10:00:05', level: 'INFO', message: 'Starting background workers...' },
    { id: 'log-3', timestamp: '2026-05-07 10:01:12', level: 'DEBUG', message: 'Cache populated with 4,203 items.' },
    { id: 'log-4', timestamp: '2026-05-07 10:15:00', level: 'INFO', message: 'Health check passed (latency: 12ms).' },
    { id: 'log-5', timestamp: '2026-05-07 11:30:22', level: 'WARN', message: 'Memory usage exceeding 75% threshold.' },
  ];

  if (isCritical) {
    baseLogs.push(
      { id: 'log-6', timestamp: '2026-05-07 12:45:10', level: 'ERROR', message: 'Connection timeout to primary database cluster.' },
      { id: 'log-7', timestamp: '2026-05-07 12:45:12', level: 'ERROR', message: 'Retrying connection (1/3)... Failed.' },
      { id: 'log-8', timestamp: '2026-05-07 12:45:15', level: 'ERROR', message: 'Fatal exception in request handler. Stack trace dumped.' },
      { id: 'log-9', timestamp: '2026-05-07 12:46:00', level: 'WARN', message: 'Falling back to secondary read replica.' }
    );
  } else {
    baseLogs.push(
      { id: 'log-6', timestamp: '2026-05-07 12:45:10', level: 'INFO', message: 'Processed 15,200 requests successfully.' },
      { id: 'log-7', timestamp: '2026-05-07 13:00:00', level: 'INFO', message: 'Routine garbage collection completed.' }
    );
  }

  return baseLogs.reverse(); // Newest first
};

export const getServerLogs = (serverId: string): ServerLog[] => {
  return generateMockLogs(serverId);
};

// --- Time Series Data for Charts ---
export interface TimeSeriesMetric {
  time: string;
  cpu: number;
  memory: number;
  predictedLoad?: number;
}

export const getProjectTimeSeriesData = (projectId: string): TimeSeriesMetric[] => {
  // Generate mock 24h data
  const data: TimeSeriesMetric[] = [];
  let baseCpu = projectId === 'proj-1' ? 45 : 20;
  let baseMem = projectId === 'proj-1' ? 60 : 30;
  
  for (let i = 0; i < 24; i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    // Add some random noise and a spike at hour 14
    const cpuNoise = Math.floor(Math.random() * 15) - 5;
    const memNoise = Math.floor(Math.random() * 10) - 3;
    
    let cpu = Math.max(5, Math.min(100, baseCpu + cpuNoise));
    let memory = Math.max(10, Math.min(100, baseMem + memNoise));
    
    if (i >= 12 && i <= 16 && projectId === 'proj-1') {
      cpu += 40; // Simulate load spike
      memory += 25;
    }
    
    // Add AI prediction for future times (last 6 hours)
    let predictedLoad = undefined;
    if (i >= 18) {
      predictedLoad = cpu + Math.floor(Math.random() * 20) - 10;
    }
    
    data.push({ time, cpu, memory, predictedLoad });
  }
  return data;
};

export interface TrafficData {
  name: string;
  value: number;
  fill: string;
}

export const getProjectTrafficDistribution = (projectId: string): TrafficData[] => {
  if (projectId === 'proj-1') {
    return [
      { name: 'Gateway', value: 45, fill: '#06b6d4' }, // accent-cyan
      { name: 'Frontend', value: 30, fill: '#8b5cf6' }, // accent-purple
      { name: 'Microservices', value: 15, fill: '#10b981' }, // status-success
      { name: 'Database', value: 10, fill: '#f59e0b' } // status-warning
    ];
  }
  return [
    { name: 'Gateway', value: 60, fill: '#06b6d4' },
    { name: 'Analytics API', value: 30, fill: '#8b5cf6' },
    { name: 'Data Lake', value: 10, fill: '#10b981' }
  ];
};

// --- Anomalies & RCA Data ---

export interface AnomalyEvent {
  id: string;
  projectId: string;
  metricName: string;
  serverName: string;
  timestamp: string;
  confidence: number;
  status: 'Detected' | 'Investigating' | 'Resolved';
  description: string;
  dataPoints: { time: string; baseline: number; actual: number; isAnomalous: boolean }[];
}

export const getProjectAnomalies = (projectId: string): AnomalyEvent[] => {
  if (projectId !== 'proj-1') return [];
  
  const generateChartData = () => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      const baseline = 40 + Math.sin(i / 2) * 10;
      let actual = baseline + (Math.random() * 5 - 2.5);
      let isAnomalous = false;
      
      if (i > 12 && i < 17) {
        actual += 35 + Math.random() * 10; // The spike
        isAnomalous = true;
      }
      data.push({ time: `10:${(i * 3).toString().padStart(2, '0')}`, baseline, actual, isAnomalous });
    }
    return data;
  };

  return [
    {
      id: 'anom-101',
      projectId: 'proj-1',
      metricName: 'HTTP 5xx Error Rate',
      serverName: 'Gateway-API-East',
      timestamp: 'Just now',
      confidence: 98.4,
      status: 'Detected',
      description: 'Sudden spike in 5xx errors violating historical 7-day baseline. Pattern matches previous downstream DB failure.',
      dataPoints: generateChartData()
    },
    {
      id: 'anom-102',
      projectId: 'proj-1',
      metricName: 'Memory Heap Allocation',
      serverName: 'Payment-Worker-Node',
      timestamp: '2 hours ago',
      confidence: 85.2,
      status: 'Investigating',
      description: 'Gradual memory leak detected. Memory reclaiming is failing to keep up with allocation rate.',
      dataPoints: generateChartData().map(d => ({ ...d, actual: d.baseline + (Math.random() * 20) }))
    }
  ];
};

export interface RcaIncident {
  id: string;
  projectId: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  startTime: string;
  rootCauseNode: string;
  aiConclusion: string;
  timeline: { time: string; event: string; type: 'trigger' | 'cascade' | 'root-cause' }[];
  suggestedActions: string[];
}

export const getProjectRcaIncidents = (projectId: string): RcaIncident[] => {
  if (projectId !== 'proj-1') return [];
  
  return [
    {
      id: 'inc-9932',
      projectId: 'proj-1',
      title: 'Global Checkout Service Outage',
      severity: 'Critical',
      startTime: '2026-05-07 14:00:00',
      rootCauseNode: 'DB-Cluster-02 (PostgreSQL)',
      aiConclusion: 'The root cause of the Checkout Service outage is a sustained CPU starvation event on DB-Cluster-02. This was triggered by a rogue unindexed query deployed in v2.4 of the Recommendation Engine, which locked the primary users table and caused connection pools in the Payment Gateway to exhaust.',
      timeline: [
        { time: '14:00:10', event: 'New deployment (v2.4) initialized on Recommendation Engine.', type: 'trigger' },
        { time: '14:02:45', event: 'Unindexed query executed against DB-Cluster-02.', type: 'root-cause' },
        { time: '14:04:12', event: 'DB-Cluster-02 CPU usage spikes to 100%. Table locks detected.', type: 'cascade' },
        { time: '14:05:00', event: 'Payment Gateway connection pool exhausted waiting for DB.', type: 'cascade' },
        { time: '14:06:30', event: 'HTTP 504 Gateway Timeouts reported by Frontend.', type: 'cascade' }
      ],
      suggestedActions: [
        'Rollback Recommendation Engine to v2.3',
        'Kill long-running queries on DB-Cluster-02',
        'Auto-scale DB-Cluster read replicas'
      ]
    }
  ];
};
