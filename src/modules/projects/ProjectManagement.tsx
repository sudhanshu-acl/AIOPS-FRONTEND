import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { getProjectServers, ServerInstance } from '../../services/dummyData';
import { Building, Server, Plus, HardDrive, Cpu, Activity, Globe, BrainCircuit, Sparkles, AlertTriangle, Terminal } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ProjectManagement: React.FC = () => {
  const { authorizedProjects, selectedProject, setSelectedProject } = useProject();
  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const servers = selectedProject ? getProjectServers(selectedProject.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-status-success/20 text-status-success border-status-success/30';
      case 'warning': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'critical': return 'bg-status-error/20 text-status-error border-status-error/30';
      default: return 'bg-text-secondary/20 text-text-secondary border-text-secondary/30';
    }
  };

  const generateSparkline = (baseUsage: number) => {
    return Array.from({ length: 10 }).map((_, i) => ({
      val: Math.max(10, Math.min(100, baseUsage + (Math.random() * 30 - 15)))
    }));
  };

  const toggleExpand = (id: string) => {
    if (expandedServerId === id) setExpandedServerId(null);
    else setExpandedServerId(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center gap-3">
          <Building className="text-accent-cyan" size={32} />
          <h1 className="text-3xl font-semibold mb-0">Project & Server Management</h1>
        </div>
        <button className="flex items-center gap-2 bg-bg-card border border-border-color text-text-primary py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-bg-cardHover transition-colors">
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="flex gap-6 flex-1 h-full min-h-[500px]">
        {/* Projects Master List */}
        <div className="w-[300px] flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-text-secondary px-2">Your Projects</h2>
          <div className="flex flex-col gap-2">
            {authorizedProjects.map(proj => (
              <button
                key={proj.id}
                onClick={() => { setSelectedProject(proj); setExpandedServerId(null); }}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${selectedProject?.id === proj.id
                    ? 'bg-accent-cyan/10 border-accent-cyan text-text-primary shadow-sm'
                    : 'bg-bg-card border-border-color text-text-secondary hover:bg-bg-cardHover hover:border-text-secondary/30'
                  }`}
              >
                <div className="font-semibold text-lg mb-1">{proj.name}</div>
                <div className="text-xs opacity-80 mb-2">{proj.description}</div>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded text-accent-purple">{proj.environment}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Server Details Panel */}
        <div className="flex-1 card p-0 overflow-hidden flex flex-col">
          {selectedProject ? (
            <>
              <div className="bg-bg-dark/50 border-b border-border-color p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    {selectedProject.name}
                    <span className="text-xs uppercase font-bold bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-md">{selectedProject.environment}</span>
                  </h2>
                  <p className="text-text-secondary text-sm mt-2">{selectedProject.description}</p>
                  <p className="text-text-secondary text-xs mt-1">Created: {selectedProject.createdAt}</p>
                </div>
                <button className="flex items-center gap-2 bg-accent-cyan text-white border-none py-2 px-4 rounded-lg font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90">
                  <Server size={18} />
                  Provision Server
                </button>
              </div>

              <div className="p-0 overflow-y-auto flex-1">
                <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1.2fr_1fr_1fr_80px] py-3 px-6 bg-bg-dark/50 border-b border-border-color font-semibold text-text-secondary text-xs uppercase sticky top-0 z-10">
                  <div>Instance</div>
                  <div>Region</div>
                  <div>Resources (CPU/RAM)</div>
                  <div>Network I/O</div>
                  <div>1h Trend</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="flex flex-col">
                  {servers.length > 0 ? (
                    servers.map(server => (
                      <React.Fragment key={server.id}>
                        <div 
                          onClick={() => toggleExpand(server.id)}
                          className={`grid grid-cols-[1.5fr_1fr_1.5fr_1.2fr_1fr_1fr_80px] py-4 px-6 items-center border-b border-border-color transition-colors duration-200 cursor-pointer last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 ${expandedServerId === server.id ? 'bg-accent-cyan/5' : ''}`}
                        >
                          <div className="flex flex-col pr-2">
                            <span className="font-semibold text-text-primary flex items-center gap-2 truncate">
                              <HardDrive size={14} className="text-accent-cyan flex-shrink-0" />
                              <span className="truncate">{server.name}</span>
                            </span>
                            <span className="text-xs text-text-secondary font-mono mt-0.5">{server.ipAddress}</span>
                          </div>

                          <div className="flex flex-col text-sm text-text-secondary">
                            <div className="flex items-center gap-1"><Globe size={12} /> {server.region}</div>
                            <span className="text-xs opacity-70 mt-0.5">Up {server.uptime}</span>
                          </div>

                          <div className="flex flex-col gap-2 pr-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                              <span className="w-8 text-text-secondary">CPU</span>
                              <div className="flex-1 h-1.5 bg-bg-dark rounded-full overflow-hidden">
                                <div className={`h-full ${server.cpuUsage > 80 ? 'bg-status-error' : 'bg-accent-cyan'}`} style={{ width: `${server.cpuUsage}%` }}></div>
                              </div>
                              <span className={`w-6 text-right ${server.cpuUsage > 80 ? 'text-status-error' : 'text-text-primary'}`}>{server.cpuUsage}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                              <span className="w-8 text-text-secondary">RAM</span>
                              <div className="flex-1 h-1.5 bg-bg-dark rounded-full overflow-hidden">
                                <div className={`h-full ${server.memoryUsage > 80 ? 'bg-status-error' : 'bg-accent-purple'}`} style={{ width: `${server.memoryUsage}%` }}></div>
                              </div>
                              <span className={`w-6 text-right ${server.memoryUsage > 80 ? 'text-status-error' : 'text-text-primary'}`}>{server.memoryUsage}%</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center text-xs font-mono text-text-secondary">
                            <div className="flex justify-between w-full pr-4">
                              <span className="text-accent-cyan opacity-80">↓ Tx</span>
                              <span>{(server as any).networkTxRx ? (server as any).networkTxRx.split('|')[0].trim() : '800 MB/s'}</span>
                            </div>
                            <div className="flex justify-between w-full pr-4 mt-0.5">
                              <span className="text-accent-purple opacity-80">↑ Rx</span>
                              <span>{(server as any).networkTxRx ? (server as any).networkTxRx.split('|')[1].trim() : '400 MB/s'}</span>
                            </div>
                          </div>

                          <div className="h-8 w-20 opacity-70">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={generateSparkline(server.cpuUsage)}>
                                <Line type="monotone" dataKey="val" stroke={server.cpuUsage > 80 ? '#ef4444' : '#06b6d4'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          <div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(server.status)}`}>
                              {server.status}
                            </span>
                          </div>

                          <div className="text-right">
                            <button className="text-accent-cyan font-medium text-sm hover:underline cursor-pointer bg-transparent border-none">
                              {expandedServerId === server.id ? 'Close' : 'Explain'}
                            </button>
                          </div>
                        </div>

                        {/* Inline AIOps Expanded Info */}
                        {expandedServerId === server.id && (
                          <div className="col-span-full bg-bg-dark/80 border-b border-border-color p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h4 className="font-semibold text-sm flex items-center gap-2 text-text-primary mb-4">
                              <BrainCircuit size={18} className="text-accent-purple" />
                              AIOps Server Diagnostics
                            </h4>
                            
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="bg-bg-card border border-border-color rounded-lg p-4">
                                  <div className="text-xs text-text-secondary mb-1">Health Score</div>
                                  <div className={`text-2xl font-bold ${server.status === 'healthy' ? 'text-status-success' : server.status === 'critical' ? 'text-status-error' : 'text-status-warning'}`}>
                                    {server.status === 'healthy' ? '98/100' : server.status === 'critical' ? '42/100' : '76/100'}
                                  </div>
                                </div>
                                <div className="bg-bg-card border border-border-color rounded-lg p-4">
                                  <div className="text-xs text-text-secondary mb-1">Anomaly Prediction</div>
                                  <div className="text-base font-medium text-text-primary">
                                    {server.status === 'healthy' ? 'Stable for 7 days' : server.status === 'critical' ? 'Imminent Failure' : 'Memory Leak Suspected'}
                                  </div>
                                </div>
                              </div>

                              <div className={`flex-[2] text-sm p-4 rounded-lg border ${server.status === 'critical' ? 'bg-status-error/10 border-status-error/30 text-status-error' : server.status === 'warning' ? 'bg-status-warning/10 border-status-warning/30 text-status-warning' : 'bg-status-success/10 border-status-success/30 text-status-success'}`}>
                                <div className="flex items-start gap-3 flex-1">
                                  <Sparkles size={20} className="mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <strong className="block mb-1 text-base">AI Automated Insight</strong>
                                    {server.status === 'critical' 
                                      ? `Critical alert triggered for ${server.name}. CPU usage has spiked to ${server.cpuUsage}% and connection pools are exhausted. Immediate remediation required.`
                                      : server.status === 'warning'
                                      ? `Warning: ${server.name} is showing irregular memory allocation patterns (${server.memoryUsage}%). AI predicts exhaustion in 14 hours.`
                                      : `${server.name} is operating optimally. All telemetry metrics are within standard historical baselines.`}
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button 
                                    onClick={() => navigate('/log-explorer', { state: { serverFilter: server.name } })}
                                    className="flex items-center gap-2 bg-bg-card hover:bg-bg-dark border border-border-color hover:border-accent-cyan text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <Terminal size={16} />
                                    View Full Logs
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center gap-3">
                      <Server size={48} className="text-text-secondary opacity-30" />
                      <p className="text-text-secondary font-medium">No active servers provisioned for this project.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-4">
              <Building size={64} className="text-text-secondary opacity-50" />
              <h2 className="text-2xl font-bold text-text-secondary">Select a Project</h2>
              <p className="text-text-secondary">Choose a project from the left sidebar to manage its infrastructure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
