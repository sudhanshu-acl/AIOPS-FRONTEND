import React from 'react';
import { getAnalyticsPredictions, getProjectTimeSeriesData } from '../../services/dummyData';
import { TrendingUp, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useProject } from '../../context/ProjectContext';

const Analytics: React.FC = () => {
  const { selectedProject } = useProject();
  
  if (!selectedProject) {
    return <div className="text-text-secondary flex justify-center items-center h-full">Please select a project to view analytics.</div>;
  }

  const predictions = getAnalyticsPredictions(selectedProject.id);
  const timeSeriesData = getProjectTimeSeriesData(selectedProject.id);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-accent-purple" size={32} />
        <div>
          <h1 className="text-3xl font-semibold mb-0">Predictive Analytics</h1>
          <p className="text-text-secondary text-sm mt-1">Project: <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-border-color">AI Predictions</h2>
          <div className="flex flex-col gap-4">
            {predictions.length > 0 ? (
              predictions.map((item, index) => (
                <div key={index} className="bg-bg-dark/40 border border-border-color p-4 rounded-lg transition-transform duration-200 hover:translate-x-1 hover:border-accent-purple">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-accent-cyan">{item.service}</span>
                    <span className="text-xs bg-accent-purple/20 text-[#c4b5fd] py-1 px-2 rounded-full font-semibold">
                      Confidence: {item.confidence}
                    </span>
                  </div>
                  <p className="text-text-secondary">{item.prediction}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary">No AI predictions currently available for this project.</p>
            )}
          </div>
        </div>

        <div className="card flex flex-col h-[400px]">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-border-color flex items-center gap-2 flex-shrink-0">
            <TrendingUp size={20} className="text-accent-purple" />
            Resource Trend Forecast
          </h2>
          <div className="flex-1 w-full min-h-0 bg-bg-dark/30 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="cpu" name="CPU Usage %" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="memory" name="Memory Usage %" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
