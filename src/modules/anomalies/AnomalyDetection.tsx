import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { getProjectAnomalies } from '../../services/dummyData';
import { Activity, AlertOctagon, TrendingUp, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const AnomalyDetection: React.FC = () => {
  const { selectedProject } = useProject();
  const anomalies = selectedProject ? getProjectAnomalies(selectedProject.id) : [];

  if (!selectedProject) {
    return <div className="flex h-full items-center justify-center text-text-secondary">Please select a project to view anomalies.</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Detected': return 'text-status-error bg-status-error/10 border-status-error/30';
      case 'Investigating': return 'text-status-warning bg-status-warning/10 border-status-warning/30';
      case 'Resolved': return 'text-status-success bg-status-success/10 border-status-success/30';
      default: return 'text-text-secondary bg-text-secondary/10 border-text-secondary/30';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-accent-cyan" size={32} />
        <div>
          <h1 className="text-3xl font-semibold mb-0">Anomaly Detection</h1>
          <p className="text-text-secondary text-sm mt-1">AI-driven deviation monitoring for <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pb-8">
        {anomalies.length > 0 ? (
          anomalies.map(anomaly => {
            // Find the anomalous range to highlight it
            const anomalousPoints = anomaly.dataPoints.filter(dp => dp.isAnomalous);
            const startX = anomalousPoints.length > 0 ? anomalousPoints[0].time : null;
            const endX = anomalousPoints.length > 0 ? anomalousPoints[anomalousPoints.length - 1].time : null;

            return (
              <div key={anomaly.id} className="card flex flex-col xl:flex-row gap-6 p-6">
                
                {/* Details Side */}
                <div className="xl:w-[400px] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className={`px-2 py-1 rounded border text-xs font-bold uppercase ${getStatusColor(anomaly.status)}`}>
                      {anomaly.status}
                    </div>
                    <span className="text-text-secondary text-sm">{anomaly.timestamp}</span>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
                      <AlertOctagon size={20} className="text-status-error" />
                      {anomaly.metricName}
                    </h2>
                    <div className="text-accent-purple font-medium text-sm flex items-center gap-1">
                      <TrendingUp size={14} /> {anomaly.serverName}
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm bg-bg-dark/50 p-4 rounded-lg border border-border-color">
                    {anomaly.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border-color flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-text-secondary uppercase font-semibold">AI Confidence</span>
                      <span className="text-lg font-bold text-accent-cyan">{anomaly.confidence}%</span>
                    </div>
                    <button className="bg-bg-dark border border-border-color hover:border-accent-cyan text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Investigate (RCA)
                    </button>
                  </div>
                </div>

                {/* Chart Side */}
                <div className="flex-1 h-[300px] bg-bg-dark/30 rounded-xl border border-border-color p-4">
                  <h3 className="text-sm font-semibold text-text-secondary mb-4 text-center">Baseline vs Actual Deviation</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={anomaly.dataPoints} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      
                      {startX && endX && (
                        <ReferenceArea x1={startX} x2={endX} fill="#ef4444" fillOpacity={0.15} />
                      )}
                      
                      <Line type="monotone" dataKey="baseline" name="Expected Baseline" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="actual" name="Actual Metric" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: '#ef4444' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle size={64} className="text-status-success mb-4 opacity-80" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">System Healthy</h2>
            <p className="text-text-secondary">No active anomalies detected in {selectedProject.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyDetection;
