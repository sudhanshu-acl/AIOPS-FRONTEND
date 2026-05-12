import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, BarChart2, Network, Settings, Building, Users, ActivitySquare, Sun, Moon, ShieldCheck, Database, Terminal, Target, Activity, LogOut, Menu, X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import Dropdown from './Dropdown';

const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (val: boolean) => void }> = ({ isOpen, setIsOpen }) => {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-[260px] bg-bg-card border-r border-border-color flex flex-col py-6 px-4`}>
        <div className="flex items-center justify-between pb-8 pl-2 border-b border-border-color mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Network className="text-accent-cyan" size={28} />
            <span className="text-gradient font-bold text-xl">AIOps Core</span>
          </div>
          <button className="md:hidden text-text-secondary hover:text-text-primary" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
    </>
  );
};

export const Layout: React.FC = () => {
  const { user, authorizedProjects, selectedProject, setSelectedProject } = useProject();
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col bg-bg-dark min-w-0">
        <header className="h-[70px] flex items-center justify-between px-4 md:px-8 bg-bg-dark border-b border-border-color shrink-0">

          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <button 
              className="md:hidden text-text-secondary hover:text-text-primary p-1"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-bg-card border border-border-color rounded-lg px-2 md:px-3 py-1.5 shrink-0">
              <Building size={16} className="text-accent-purple" />
              <Dropdown
                items={authorizedProjects.map(proj => ({ label: proj.name, value: proj.id }))}
                value={selectedProject?.id || ''}
                onChange={(val) => {
                  const proj = authorizedProjects.find(p => p.id === val);
                  if (proj) setSelectedProject(proj);
                }}
                triggerClassName="bg-transparent border-none px-1 md:px-2 py-1 shadow-none hover:bg-transparent !p-0 gap-1 text-sm md:text-base max-w-[100px] md:max-w-none truncate"
                menuClassName="w-[200px]"
              />
            </div>

            <div className="hidden md:block w-[200px] lg:w-[300px]">
              <input
                type="text"
                placeholder="Search resources, alerts, etc..."
                className="w-full bg-bg-card border border-border-color text-text-primary py-2 px-4 rounded-full focus:outline-none focus:border-accent-cyan font-sans text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 font-medium shrink-0">
            <button
              onClick={() => setIsDark(prev => !prev)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <div 
                className="flex items-center gap-2 md:gap-3 cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-text-secondary">{user.role}</span>
                </div>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border-color rounded-lg shadow-lg py-1 z-50">
                  <div className="sm:hidden px-4 py-2 border-b border-border-color mb-1">
                    <span className="block text-sm font-semibold text-text-primary">{user.name}</span>
                    <span className="block text-xs text-text-secondary">{user.role}</span>
                  </div>
                  <button 
                    className="w-full flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-bg-cardHover hover:text-accent-purple transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden relative">
          {selectedProject ? (
            <Outlet />
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-4 text-center p-4">
              <Building size={64} className="text-text-secondary opacity-50" />
              <h2 className="text-xl md:text-2xl font-bold text-text-secondary">No Project Selected</h2>
              <p className="text-text-secondary text-sm md:text-base">Please select a project you have access to.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

