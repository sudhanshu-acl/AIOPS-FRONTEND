import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './modules/dashboard/Dashboard';
import Alerts from './modules/alerts/Alerts';
import Analytics from './modules/analytics/Analytics';
import AnomalyDetection from './modules/anomalies/AnomalyDetection';
import RootCauseAnalysis from './modules/rca/RootCauseAnalysis';
import Topology from './modules/topology/Topology';
import ProjectManagement from './modules/projects/ProjectManagement';
import Users from './modules/users/Users';
import Roles from './modules/roles/Roles';
import LogExplorer from './modules/logs/LogExplorer';
import ActivityLogs from './modules/logs/ActivityLogs';
import Settings from './modules/settings/Settings';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="anomalies" element={<AnomalyDetection />} />
            <Route path="rca" element={<RootCauseAnalysis />} />
            <Route path="topology" element={<Topology />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="log-explorer" element={<LogExplorer />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
