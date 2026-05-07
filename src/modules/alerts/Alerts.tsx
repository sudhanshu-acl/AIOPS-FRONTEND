import React, { useState } from 'react';
import { getAlerts, AlertSeverity, AlertStatus, Alert } from '../../services/dummyData';
import { AlertCircle, CheckCircle, Clock, Sparkles, Server, Network, Terminal } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const Alerts: React.FC = () => {
  const { selectedProject } = useProject();
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  
  if (!selectedProject) return null;

  const alerts = getAlerts(selectedProject.id);

  const getSeverityClass = (severity: AlertSeverity) => {
    switch(severity) {
      case 'critical': return 'bg-status-error/15 text-status-error border border-status-error/30';
      case 'warning': return 'bg-status-warning/15 text-status-warning border border-status-warning/30';
      case 'info': return 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30';
      default: return '';
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    if (status === 'Closed') return <CheckCircle size={16} className="text-status-success" />;
    if (status === 'Investigating') return <Clock size={16} className="text-status-warning" />;
    return <AlertCircle size={16} className="text-status-error" />;
  };

  const getExpandedInfo = (alert: Alert) => {
    switch(alert.severity) {
      case 'critical':
        return {
          rootCause: 'Connection pool thread exhaustion due to unoptimized recursive query.',
          affectedNodes: ['DB-Cluster-02', 'Payment-API'],
          remediation: 'Restart connection pool service immediately. Run optimization script `db-opt-v2.sh`.',
          aiConfidence: '98%'
        };
      case 'warning':
        return {
          rootCause: 'Garbage collection cycle taking > 500ms causing minor request queuing.',
          affectedNodes: ['Web-Node-05', 'Analytics-Engine'],
          remediation: 'Schedule rolling restart during next maintenance window. Increase JVM heap by 2GB.',
          aiConfidence: '85%'
        };
      default:
        return {
          rootCause: 'Standard scheduled automated process execution.',
          affectedNodes: ['Storage-Cluster'],
          remediation: 'No action required. Process completed successfully within expected duration.',
          aiConfidence: '99%'
        };
    }
  }

  const toggleExpand = (id: string) => {
    if (expandedAlertId === id) setExpandedAlertId(null);
    else setExpandedAlertId(id);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-1">System Alerts & Incidents</h1>
          <p className="text-text-secondary">Project: <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
        <button className="bg-accent-cyan text-white border-none py-2 px-4 rounded-lg font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90">
          Acknowledge All
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-[100px_100px_2fr_120px_150px_100px] py-4 px-6 bg-bg-dark/50 border-b border-border-color font-semibold text-text-secondary text-sm uppercase">
          <div>ID</div>
          <div>Severity</div>
          <div>Message</div>
          <div>Time</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        <div className="flex flex-col">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <React.Fragment key={alert.id}>
                <div 
                  className={`grid grid-cols-[100px_100px_2fr_120px_150px_100px] py-5 px-6 items-center border-b border-border-color transition-colors duration-200 cursor-pointer last:border-b-0 hover:bg-white/5 ${expandedAlertId === alert.id ? 'bg-white/5' : ''}`}
                  onClick={() => toggleExpand(alert.id)}
                >
                  <div className="font-medium text-text-secondary">{alert.id}</div>
                  <div>
                    <span className={`py-1 px-2 rounded-full text-xs font-semibold uppercase ${getSeverityClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="font-medium text-text-primary">{alert.message}</div>
                  <div className="text-text-secondary">{alert.timestamp}</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alert.status)}
                    <span>{alert.status}</span>
                  </div>
                  <div>
                    <button className="bg-transparent border-none cursor-pointer font-medium text-sm text-accent-cyan hover:underline">
                      {expandedAlertId === alert.id ? 'Close' : 'View Details'}
                    </button>
                  </div>
                </div>

                {expandedAlertId === alert.id && (
                  <div className="col-span-full bg-bg-dark/80 border-b border-border-color p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-text-primary mb-4">
                      <Sparkles size={18} className="text-accent-purple" />
                      AIOps Incident Report
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-bg-card border border-border-color rounded-lg p-4 col-span-2">
                        <div className="text-xs text-text-secondary mb-1 flex items-center gap-1"><Terminal size={14}/> Suspected Root Cause</div>
                        <div className="text-sm font-medium text-text-primary mb-4">
                          {getExpandedInfo(alert).rootCause}
                        </div>
                        
                        <div className="text-xs text-text-secondary mb-1 flex items-center gap-1"><Sparkles size={14}/> Suggested Remediation</div>
                        <div className="text-sm font-medium text-accent-cyan">
                          {getExpandedInfo(alert).remediation}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="bg-bg-card border border-border-color rounded-lg p-4 flex-1">
                          <div className="text-xs text-text-secondary mb-1 flex items-center gap-1"><Network size={14}/> Affected Infrastructure</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getExpandedInfo(alert).affectedNodes.map(node => (
                              <span key={node} className="text-xs bg-bg-dark border border-border-color px-2 py-1 rounded-md text-text-primary flex items-center gap-1">
                                <Server size={12} className="text-accent-cyan"/> {node}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-bg-card border border-border-color rounded-lg p-4 flex items-center justify-between">
                           <div className="text-xs text-text-secondary mb-1">AI Confidence</div>
                           <div className="text-xl font-bold text-accent-purple">{getExpandedInfo(alert).aiConfidence}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="py-8 text-center text-text-secondary">
              No alerts found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
