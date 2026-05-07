import React from 'react';
import { getTopologyNodes, NodeType } from '../../services/dummyData';
import { Network, Server, Database, Code } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const Topology: React.FC = () => {
  const { selectedProject } = useProject();
  
  if (!selectedProject) return null;

  const nodes = getTopologyNodes(selectedProject.id);

  const getNodeIcon = (type: NodeType) => {
    switch(type) {
      case 'Database': return <Database size={24} />;
      case 'Microservice': return <Code size={24} />;
      default: return <Server size={24} />;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Network className="text-accent-cyan" size={32} />
        <div>
          <h1 className="text-3xl font-semibold mb-0">Service Topology Map</h1>
          <p className="text-text-secondary text-sm mt-1">Project: <span className="font-semibold text-accent-cyan">{selectedProject.name}</span></p>
        </div>
      </div>

      <div className="card min-h-[500px]" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        <p className="text-text-secondary mb-4">Interactive map of microservices and infrastructure dependencies.</p>
        
        {nodes.length > 0 ? (
          <div className="flex flex-wrap gap-6 p-4">
            {nodes.map((node) => {
              const isCritical = node.status === 'critical';
              const isWarning = node.status === 'warning';
              const statusColor = isCritical ? 'bg-status-error' : isWarning ? 'bg-status-warning' : 'bg-status-success';
              const shadowStyle = isCritical ? { boxShadow: '0 0 10px var(--status-error)' } : {};
              const iconColor = isCritical ? 'text-status-error' : isWarning ? 'text-status-warning' : 'text-text-secondary';
              
              return (
                <div 
                  key={node.id} 
                  className="flex items-center gap-4 bg-bg-dark border border-border-color py-4 px-6 rounded-xl relative transition-all duration-200 cursor-pointer min-w-[200px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className={`bg-white/5 p-2 rounded-lg ${iconColor}`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-text-primary">{node.id}</div>
                    <div className="text-xs text-text-secondary">{node.type}</div>
                  </div>
                  <div 
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-bg-dark ${statusColor}`}
                    style={shadowStyle}
                  ></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-text-secondary">
            No topology nodes configured for this project.
          </div>
        )}
      </div>
    </div>
  );
};

export default Topology;
