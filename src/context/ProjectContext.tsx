import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, User, projects, currentUser } from '../services/dummyData';

interface ProjectContextType {
  user: User;
  authorizedProjects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, this user would come from an Auth service
  const user = currentUser;
  
  // Filter available projects to only those the user is authorized for
  const authorizedProjects = projects.filter(p => user.authorizedProjectIds.includes(p.id));
  
  // Default to the first authorized project if available
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    authorizedProjects.length > 0 ? authorizedProjects[0] : null
  );

  return (
    <ProjectContext.Provider value={{ user, authorizedProjects, selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
