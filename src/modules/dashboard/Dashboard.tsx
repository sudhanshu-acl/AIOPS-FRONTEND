import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardMetrics, getProjectTimeSeriesData, getProjectTrafficDistribution, getProjectMttrData, getAlerts, getProjectServers } from '../../services/dummyData';
import { Activity, ShieldCheck, AlertTriangle, Zap, Network, Server, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { useProject } from '../../context/ProjectContext';

const Dashboard: React.FC = () => {
  const { selectedProject } = useProject();
  const navigate = useNavigate();
  const [selectedGridServerId, setSelectedGridServerId] = React.useState<string | null>(null);

  if (!selectedProject) return null;

  const metrics = getDashboardMetrics(selectedProject.id);
  const timeSeriesData = getProjectTimeSeriesData(selectedProject.id);
  const trafficData = getProjectTrafficDistribution(selectedProject.id);
  const mttrData = getProjectMttrData(selectedProject.id);
  const recentAlerts = getAlerts(selectedProject.id).slice(0, 5);
  const servers = getProjectServers(selectedProject.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-semibold mb-1">System Overview</h1>
          <p className="text-text-secondary">Currently viewing data for <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-l-4 border-l-status-success">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">System Health</h3>
            <ShieldCheck className="text-status-success" />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.systemHealth}%</div>
          <p className="text-sm text-status-success">+2% from last week</p>
        </div>

        <div className="card border-l-4 border-l-status-warning">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">Active Anomalies</h3>
            <Activity className={metrics.activeAnomalies > 0 ? "text-status-warning" : "text-status-success"} />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.activeAnomalies}</div>
          <p className={`text-sm ${metrics.activeAnomalies > 0 ? 'text-status-error' : 'text-status-success'}`}>
            {metrics.activeAnomalies > 0 ? 'Needs attention' : 'All clear'}
          </p>
        </div>

        <div className="card border-l-4 border-l-accent-cyan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">Incidents Resolved</h3>
            <Zap className="text-accent-cyan" />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.incidentsResolved}</div>
          <p className="text-sm text-status-success">Last 24 hours</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">Network Traffic</h3>
            <AlertTriangle className="text-text-secondary" />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.networkTraffic}</div>
          <p className="text-sm text-text-secondary">Stable</p>
        </div>
      </div>

      {/* Middle Row: AI Load & MTTR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 card h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
            <Activity className="text-accent-cyan" size={18} />
            AI Load Prediction
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="cpu" name="Actual Load" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="predictedLoad" name="AI Prediction" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MTTR Chart */}
        <div className="card h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-1 text-text-primary flex items-center gap-2">
            <TrendingDown className="text-status-success" size={18} />
            Mean Time To Resolution
          </h3>
          <p className="text-xs text-text-secondary mb-4">Human vs AI Auto-Remediation (mins)</p>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mttrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="human" name="Manual Triage" fill="#64748b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="ai" name="AI Remediation" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Topology Matrix & Live Anomaly Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Infrastructure Health Matrix */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-border-color pb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Server className="text-text-primary" size={18} />
              Infrastructure Health Matrix
            </h3>
            <div className="text-sm font-medium text-text-secondary bg-bg-dark px-3 py-1.5 rounded-lg border border-border-color">
              <span className="text-accent-cyan font-bold">{servers.length}</span> Active Servers
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-3">
                {servers.length > 0 ? servers.map(server => (
                  <button 
                    key={server.id} 
                    onClick={() => setSelectedGridServerId(server.id)}
                    className={`w-12 h-12 rounded flex items-center justify-center border transition-all hover:scale-105 cursor-pointer
                      ${selectedGridServerId === server.id ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-bg-card' : ''}
                      ${server.status === 'critical' ? 'bg-status-error/20 border-status-error text-status-error' : 
                        server.status === 'warning' ? 'bg-status-warning/20 border-status-warning text-status-warning' : 
                        'bg-status-success/20 border-status-success text-status-success'}
                    `}
                  >
                    <Server size={20} />
                  </button>
                )) : (
                   <p className="text-text-secondary text-sm">No servers found in this project.</p>
                )}
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs font-medium text-text-secondary">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-status-success rounded"></div> Healthy</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-status-warning rounded"></div> Warning</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-status-error rounded"></div> Critical</div>
              </div>
            </div>

            <div className="w-full sm:w-[250px] bg-bg-dark rounded-xl border border-border-color p-4">
              {selectedGridServerId ? (() => {
                const srv = servers.find(s => s.id === selectedGridServerId);
                if (!srv) return null;
                return (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">Selected Instance</div>
                      <div className="font-bold text-text-primary text-lg leading-tight">{srv.name}</div>
                      <div className="text-xs text-text-secondary font-mono mt-0.5">{srv.ipAddress}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-bg-card p-2 rounded border border-border-color">
                        <div className="text-[10px] text-text-secondary uppercase font-bold mb-1">Status</div>
                        <div className={`text-sm font-bold capitalize ${srv.status === 'critical' ? 'text-status-error' : srv.status === 'warning' ? 'text-status-warning' : 'text-status-success'}`}>
                          {srv.status}
                        </div>
                      </div>
                      <div className="bg-bg-card p-2 rounded border border-border-color">
                        <div className="text-[10px] text-text-secondary uppercase font-bold mb-1">Region</div>
                        <div className="text-sm font-bold text-text-primary truncate">{srv.region}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary font-bold">CPU Usage</span>
                          <span className={srv.cpuUsage > 80 ? 'text-status-error font-bold' : 'text-text-primary'}>{srv.cpuUsage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-card rounded-full overflow-hidden">
                          <div className={`h-full ${srv.cpuUsage > 80 ? 'bg-status-error' : 'bg-accent-cyan'}`} style={{ width: `${srv.cpuUsage}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary font-bold">Memory Usage</span>
                          <span className={srv.memoryUsage > 80 ? 'text-status-warning font-bold' : 'text-text-primary'}>{srv.memoryUsage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-card rounded-full overflow-hidden">
                          <div className={`h-full ${srv.memoryUsage > 80 ? 'bg-status-warning' : 'bg-accent-purple'}`} style={{ width: `${srv.memoryUsage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary p-4 opacity-70">
                  <Server size={32} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">Select a server from the grid to view live telemetry and health metrics.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Anomaly Stream */}
        <div className="card flex flex-col p-0 overflow-hidden h-[300px]">
          <div className="p-4 border-b border-border-color bg-bg-dark/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <AlertTriangle className="text-status-warning" size={18} />
              Live Anomaly Stream
            </h3>
            <button
              onClick={() => navigate('/anomalies')}
              className="text-xs font-bold text-accent-cyan hover:text-white flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {recentAlerts.length > 0 ? recentAlerts.map(alert => (
              <div key={alert.id} className="bg-bg-dark border border-border-color p-3 rounded-lg flex flex-col gap-1 hover:border-text-secondary/30 transition-colors">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${alert.severity === 'critical' ? 'bg-status-error/20 text-status-error' :
                    alert.severity === 'warning' ? 'bg-status-warning/20 text-status-warning' :
                      'bg-accent-cyan/20 text-accent-cyan'
                    }`}>{alert.severity}</span>
                  <span className="text-[10px] text-text-secondary">{alert.timestamp}</span>
                </div>
                <p className="text-sm font-medium mt-1 leading-tight">{alert.message}</p>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
                No active anomalies.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
