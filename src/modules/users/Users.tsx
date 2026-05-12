import React, { useState } from 'react';
import { allUsers, projects, systemRoles, User } from '../../services/dummyData';
import { Users as UsersIcon, Shield, UserPlus, Edit2, X, Check } from 'lucide-react';

const Users: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(allUsers);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'Operator', authorizedProjectIds: [] as string[] });

  const getProjectNames = (projectIds: string[]) => {
    return projectIds.map(id => {
      const proj = projects.find(p => p.id === id);
      return proj ? proj.name : id;
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name) return;
    
    const createdUser: User = {
      id: `usr-${Math.floor(Math.random() * 10000)}`,
      name: newUser.name,
      role: newUser.role,
      authorizedProjectIds: newUser.authorizedProjectIds
    };
    
    setUsersList([...usersList, createdUser]);
    setShowModal(false);
    setNewUser({ name: '', role: 'Operator', authorizedProjectIds: [] });
  };

  const toggleProjectSelection = (projectId: string) => {
    setNewUser(prev => {
      if (prev.authorizedProjectIds.includes(projectId)) {
        return { ...prev, authorizedProjectIds: prev.authorizedProjectIds.filter(id => id !== projectId) };
      }
      return { ...prev, authorizedProjectIds: [...prev.authorizedProjectIds, projectId] };
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center gap-3">
          <UsersIcon className="text-accent-cyan" size={32} />
          <h1 className="text-3xl font-semibold mb-0">User Management</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent-cyan text-white border-none py-2 px-4 rounded-lg font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="card p-0 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[1fr_1.5fr_2fr_100px] py-4 px-6 bg-bg-dark/50 border-b border-border-color font-semibold text-text-secondary text-sm uppercase">
              <div>User</div>
              <div>Role</div>
              <div>Authorized Projects</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col">
              {usersList.map(user => (
                <div key={user.id} className="grid grid-cols-[1fr_1.5fr_2fr_100px] py-5 px-6 items-center border-b border-border-color transition-colors duration-200 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={user.role === 'System Admin' ? 'text-accent-purple' : 'text-text-secondary'} />
                    <span className="text-text-primary">{user.role}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {getProjectNames(user.authorizedProjectIds).map((projName, idx) => (
                      <span key={idx} className="bg-bg-card border border-border-color py-1 px-2 rounded text-xs font-medium text-text-secondary">
                        {projName}
                      </span>
                    ))}
                    {user.authorizedProjectIds.length === 0 && <span className="text-xs text-text-secondary italic">No access</span>}
                  </div>
                  
                  <div className="text-right">
                    <button className="bg-transparent border-none cursor-pointer text-text-secondary hover:text-accent-cyan p-2 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm">
          <div className="bg-bg-card border border-border-color rounded-xl shadow-2xl w-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-color bg-bg-dark/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                <UserPlus size={20} className="text-accent-cyan" /> Add New User
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="flex flex-col p-6 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-secondary">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-bg-dark border border-border-color rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-secondary">Assign Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="bg-bg-dark border border-border-color rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan appearance-none"
                >
                  {systemRoles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-secondary">Project Access</label>
                <div className="flex flex-col gap-2 border border-border-color rounded-lg p-3 bg-bg-dark/50">
                  {projects.map(proj => {
                    const isSelected = newUser.authorizedProjectIds.includes(proj.id);
                    return (
                      <button 
                        key={proj.id}
                        type="button"
                        onClick={() => toggleProjectSelection(proj.id)}
                        className={`flex items-center gap-3 p-2 rounded border text-left transition-colors ${isSelected ? 'bg-accent-cyan/10 border-accent-cyan' : 'bg-bg-card border-border-color hover:border-text-secondary'}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-accent-cyan border-accent-cyan text-white' : 'border-text-secondary'}`}>
                          {isSelected && <Check size={12} />}
                        </div>
                        <span className="text-sm font-medium">{proj.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-bg-cardHover transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-accent-cyan text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
