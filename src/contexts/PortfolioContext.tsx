import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  createdAt: string;
}

export interface ThemeSettings {
  mode: 'futuristic' | 'minimalist' | 'artistic';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface PortfolioContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const defaultTheme: ThemeSettings = {
  mode: 'futuristic',
  primaryColor: '270 100% 70%',
  accentColor: '190 100% 50%',
  fontFamily: 'Inter, system-ui, sans-serif',
};

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    const savedProjects = localStorage.getItem('promptfolio-projects');
    const savedTheme = localStorage.getItem('promptfolio-theme');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedTheme) {
      setThemeSettings(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('promptfolio-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('promptfolio-theme', JSON.stringify(themeSettings));
  }, [themeSettings]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setThemeSettings({ ...themeSettings, ...settings });
  };

  return (
    <PortfolioContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      themeSettings,
      updateThemeSettings,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};
