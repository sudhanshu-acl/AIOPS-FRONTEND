import React from 'react';
import { getDashboardMetrics, getProjectTimeSeriesData, getProjectTrafficDistribution } from '../../services/dummyData';
import { Activity, ShieldCheck, AlertTriangle, Zap, Network } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useProject } from '../../context/ProjectContext';

const Dashboard: React.FC = () => {
  const { selectedProject } = useProject();
  
  if (!selectedProject) return null;

  const metrics = getDashboardMetrics(selectedProject.id);
  const timeSeriesData = getProjectTimeSeriesData(selectedProject.id);
  const trafficData = getProjectTrafficDistribution(selectedProject.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-semibold mb-1">System Overview</h1>
          <p className="text-text-secondary">Currently viewing data for <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">System Health</h3>
            <ShieldCheck className="text-status-success" />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.systemHealth}%</div>
          <p className="text-sm text-status-success">+2% from last week</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-secondary">Active Anomalies</h3>
            <Activity className={metrics.activeAnomalies > 0 ? "text-status-warning" : "text-status-success"} />
          </div>
          <div className="text-4xl font-bold mb-2">{metrics.activeAnomalies}</div>
          <p className={`text-sm ${metrics.activeAnomalies > 0 ? 'text-status-error' : 'text-status-success'}`}>
            {metrics.activeAnomalies > 0 ? 'Needs attention' : 'All clear'}
          </p>
        </div>

        <div className="card">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
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
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="cpu" name="CPU Load" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="predictedLoad" name="Predicted Load (AI)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
            <Network className="text-accent-purple" size={18} />
            Traffic Distribution
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
