import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { getProjectRcaIncidents } from '../../services/dummyData';
import { BrainCircuit, AlertTriangle, Play, ChevronRight, Activity, Zap, CheckCircle2 } from 'lucide-react';

const RootCauseAnalysis: React.FC = () => {
  const { selectedProject } = useProject();
  const incidents = selectedProject ? getProjectRcaIncidents(selectedProject.id) : [];
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(incidents.length > 0 ? incidents[0].id : null);

  if (!selectedProject) {
    return <div className="flex h-full items-center justify-center text-text-secondary">Please select a project to view RCA investigations.</div>;
  }

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'trigger': return <Play size={16} className="text-accent-cyan" />;
      case 'root-cause': return <AlertTriangle size={16} className="text-status-error" />;
      case 'cascade': return <Activity size={16} className="text-status-warning" />;
      default: return <ChevronRight size={16} className="text-text-secondary" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'root-cause': return 'border-status-error bg-status-error/5 shadow-[0_0_15px_rgba(220,38,38,0.15)]';
      case 'trigger': return 'border-accent-cyan bg-accent-cyan/5';
      default: return 'border-border-color bg-bg-dark/50 hover:border-text-secondary/50';
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-accent-purple" size={32} />
        <div>
          <h1 className="text-3xl font-semibold mb-0">Root Cause Analysis (RCA)</h1>
          <p className="text-text-secondary text-sm mt-1">Forensic timeline and AI diagnosis for <span className="font-semibold text-accent-purple">{selectedProject.name}</span></p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 h-full min-h-[600px]">
        {/* Incidents Sidebar */}
        <div className="w-[320px] flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-text-secondary px-2">Active Incidents</h2>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2">
            {incidents.length > 0 ? (
              incidents.map(inc => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedIncidentId === inc.id 
                      ? 'bg-status-error/10 border-status-error text-text-primary shadow-sm' 
                      : 'bg-bg-card border-border-color text-text-secondary hover:bg-bg-cardHover'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-status-error/20 text-status-error border border-status-error/30">
                      {inc.severity}
                    </span>
                    <span className="text-xs opacity-80">{inc.id}</span>
                  </div>
                  <div className="font-semibold text-base mb-1 leading-tight">{inc.title}</div>
                  <div className="text-xs opacity-70 flex items-center gap-1">
                    <AlertTriangle size={12} /> {inc.rootCauseNode}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center p-6 text-text-secondary border border-dashed border-border-color rounded-xl">
                No active incidents require RCA.
              </div>
            )}
          </div>
        </div>

        {/* RCA Investigation Panel */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          {selectedIncident ? (
            <>
              {/* Header Details */}
              <div className="card p-6 border-l-4 border-l-status-error">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedIncident.title}</h2>
                    <p className="text-text-secondary flex items-center gap-2">
                      Started: <span className="font-mono text-text-primary">{selectedIncident.startTime}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-text-secondary uppercase font-semibold">Identified Root Cause Node</span>
                    <span className="px-3 py-1 bg-status-error/20 text-status-error font-bold rounded border border-status-error/30 flex items-center gap-2">
                      <HardDrive size={14} /> {selectedIncident.rootCauseNode}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Conclusion Box */}
              <div className="bg-gradient-to-r from-accent-purple/10 to-transparent border border-accent-purple/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <BrainCircuit size={150} />
                </div>
                <h3 className="text-lg font-semibold text-accent-purple flex items-center gap-2 mb-3">
                  <Sparkles size={20} /> AI Diagnostic Conclusion
                </h3>
                <p className="text-text-primary leading-relaxed text-sm md:text-base relative z-10">
                  {selectedIncident.aiConclusion}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Timeline Graph */}
                <div className="lg:col-span-2 card p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-text-primary mb-6 border-b border-border-color pb-2">Causal Timeline</h3>
                  <div className="flex-1 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-border-color rounded-full"></div>
                    
                    <div className="flex flex-col gap-6 relative z-10">
                      {selectedIncident.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className={`w-12 h-12 rounded-full border-4 border-bg-dark flex items-center justify-center flex-shrink-0 ${item.type === 'root-cause' ? 'bg-status-error' : item.type === 'trigger' ? 'bg-accent-cyan' : 'bg-bg-card'}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div className={`flex-1 border rounded-xl p-4 transition-all duration-300 ${getTypeStyle(item.type)}`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-xs text-text-secondary">{item.time}</span>
                              <span className="text-[10px] uppercase font-bold text-text-secondary">{item.type}</span>
                            </div>
                            <p className={`text-sm ${item.type === 'root-cause' ? 'font-bold text-status-error' : 'text-text-primary'}`}>
                              {item.event}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Remediation Actions */}
                <div className="card p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-text-primary border-b border-border-color pb-2">Suggested Actions</h3>
                  <div className="flex flex-col gap-3">
                    {selectedIncident.suggestedActions.map((action, idx) => (
                      <button key={idx} className="flex items-start gap-3 p-3 bg-bg-dark/50 border border-border-color rounded-lg text-left hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all group">
                        <Zap size={18} className="text-accent-cyan mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
                        <span className="text-sm font-medium text-text-primary">{action}</span>
                      </button>
                    ))}
                  </div>
                  <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-status-success text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                    <CheckCircle2 size={18} />
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary card">
              Select an incident to view forensic analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick helper icon imports for this file specifically
const Sparkles: React.FC<{size?: number, className?: string}> = ({size=24, className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const HardDrive: React.FC<{size?: number, className?: string}> = ({size=24, className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
);

export default RootCauseAnalysis;
