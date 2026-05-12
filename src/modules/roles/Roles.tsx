import React, { useState } from 'react';
import { systemRoles as initialSystemRoles, availablePermissions, SystemRole, Permission } from '../../services/dummyData';
import { ShieldCheck, Plus, Check, X } from 'lucide-react';

const Roles: React.FC = () => {
  const [rolesList, setRolesList] = useState<SystemRole[]>(initialSystemRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialSystemRoles[0].id);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const selectedRole = rolesList.find(r => r.id === selectedRoleId) || rolesList[0];

  // Group permissions by module
  const groupedPermissions = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    
    const createdRole: SystemRole = {
      id: `role-${Math.floor(Math.random() * 10000)}`,
      name: newRole.name,
      description: newRole.description,
      permissionIds: [] // Initially no permissions
    };
    
    setRolesList([...rolesList, createdRole]);
    setSelectedRoleId(createdRole.id);
    setShowModal(false);
    setNewRole({ name: '', description: '' });
  };

  const togglePermission = (permId: string) => {
    setRolesList(rolesList.map(role => {
      if (role.id === selectedRoleId) {
        const hasPerm = role.permissionIds.includes(permId);
        return {
          ...role,
          permissionIds: hasPerm 
            ? role.permissionIds.filter(id => id !== permId)
            : [...role.permissionIds, permId]
        };
      }
      return role;
    }));
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-accent-purple" size={32} />
          <h1 className="text-3xl font-semibold mb-0">Roles & Permissions</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent-cyan text-white border-none py-2 px-4 rounded-lg font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[500px] overflow-hidden">
        {/* Roles List Sidebar */}
        <div className="w-full md:w-[300px] flex flex-col gap-3 shrink-0 max-h-[300px] md:max-h-none overflow-y-auto custom-scrollbar">
          <h2 className="text-lg font-semibold text-text-secondary px-2">System Roles</h2>
          <div className="flex flex-col gap-2 pr-2">
            {rolesList.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedRoleId === role.id 
                    ? 'bg-accent-purple/10 border-accent-purple text-text-primary shadow-sm' 
                    : 'bg-bg-card border-border-color text-text-secondary hover:bg-bg-cardHover hover:border-text-secondary/30'
                }`}
              >
                <div className="font-semibold text-lg mb-1">{role.name}</div>
                <div className="text-xs opacity-80">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="flex-1 card p-0 overflow-hidden flex flex-col">
          <div className="bg-bg-dark/50 border-b border-border-color p-6">
            <h2 className="text-xl font-bold">{selectedRole.name} Permissions</h2>
            <p className="text-text-secondary text-sm mt-1">Configure what users with this role can do across the system.</p>
          </div>

          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
            {Object.keys(groupedPermissions).map(moduleName => (
              <div key={moduleName} className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg border-b border-border-color pb-2 text-accent-cyan">{moduleName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedPermissions[moduleName].map(perm => {
                    const isEnabled = selectedRole.permissionIds.includes(perm.id);
                    return (
                      <div key={perm.id} className="flex items-center justify-between p-3 rounded-lg border border-border-color bg-bg-dark/30 hover:bg-white/5 transition-colors">
                        <div className="flex flex-col pr-4">
                          <span className="font-medium text-text-primary">{perm.action}</span>
                          <span className="text-xs text-text-secondary">{perm.description}</span>
                        </div>
                        <button 
                          onClick={() => togglePermission(perm.id)}
                          className={`w-12 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 cursor-pointer ${isEnabled ? 'bg-status-success' : 'bg-bg-cardHover border border-border-color'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 flex items-center justify-center ${isEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}>
                            {isEnabled ? <Check size={12} className="text-status-success" /> : <X size={12} className="text-text-secondary" />}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm">
          <div className="bg-bg-card border border-border-color rounded-xl shadow-2xl w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-color bg-bg-dark/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                <ShieldCheck size={20} className="text-accent-purple" /> Create New Role
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRole} className="flex flex-col p-6 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-secondary">Role Name</label>
                <input 
                  type="text" 
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  className="bg-bg-dark border border-border-color rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-purple"
                  placeholder="e.g. Database Admin"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-secondary">Description</label>
                <textarea 
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  className="bg-bg-dark border border-border-color rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-purple min-h-[100px] resize-none"
                  placeholder="Briefly describe what this role does..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-bg-cardHover transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-accent-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
