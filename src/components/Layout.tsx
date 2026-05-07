import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, BarChart2, Network, Settings, Building, Users, ActivitySquare, Sun, Moon, ShieldCheck, Database, Terminal, Target, Activity } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <AlertCircle size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Anomalies', path: '/anomalies', icon: <Target size={20} /> },
    { name: 'RCA Investigations', path: '/rca', icon: <Activity size={20} /> },
    { name: 'Topology', path: '/topology', icon: <Network size={20} /> },
    { name: 'Projects & Servers', path: '/projects', icon: <Database size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Roles & Permissions', path: '/roles', icon: <ShieldCheck size={20} /> },
    { name: 'Log Explorer', path: '/log-explorer', icon: <Terminal size={20} /> },
    { name: 'Audit Logs', path: '/logs', icon: <ActivitySquare size={20} /> },
  ];

  return (
    <div className="w-[260px] bg-bg-card border-r border-border-color flex flex-col py-6 px-4">
      <div className="flex items-center gap-3 pb-8 pl-2 border-b border-border-color mb-6 flex-shrink-0">
        <Network className="text-accent-cyan" size={28} />
        <span className="text-gradient font-bold text-xl">AIOps Core</span>
      </div>
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${isActive
                ? 'bg-accent-cyan/10 text-accent-cyan relative before:content-[""] before:absolute before:-left-4 before:top-[10%] before:h-[80%] before:w-1 before:bg-accent-cyan before:rounded-r'
                : 'text-text-secondary hover:bg-bg-cardHover hover:text-text-primary'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="pt-4 border-t border-border-color mt-2 flex-shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isActive
              ? 'bg-accent-cyan/10 text-accent-cyan'
              : 'text-text-secondary hover:bg-bg-cardHover hover:text-text-primary'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export const Layout: React.FC = () => {
  const { user, authorizedProjects, selectedProject, setSelectedProject } = useProject();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-bg-dark">
        <header className="h-[70px] flex items-center justify-between px-8 bg-bg-dark border-b border-border-color">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-bg-card border border-border-color rounded-lg px-3 py-2">
              <Building size={18} className="text-accent-purple" />
              <select
                className="bg-transparent border-none text-text-primary text-sm font-medium focus:outline-none cursor-pointer"
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const proj = authorizedProjects.find(p => p.id === e.target.value);
                  if (proj) setSelectedProject(proj);
                }}
              >
                {authorizedProjects.map(proj => (
                  <option key={proj.id} value={proj.id} className="bg-bg-card text-text-primary">
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[300px]">
              <input
                type="text"
                placeholder="Search resources, alerts, etc..."
                className="w-full bg-bg-card border border-border-color text-text-primary py-2 px-4 rounded-full focus:outline-none focus:border-accent-cyan font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button
              onClick={() => setIsDark(prev => !prev)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-text-secondary">{user.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {selectedProject ? (
            <Outlet />
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-4">
              <Building size={64} className="text-text-secondary opacity-50" />
              <h2 className="text-2xl font-bold text-text-secondary">No Project Selected</h2>
              <p className="text-text-secondary">Please select a project you have access to.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
