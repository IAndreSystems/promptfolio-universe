import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  category: string;
  github_repo?: string;
  github_synced?: boolean;
  is_public: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ThemeSettings {
  id?: string;
  user_id?: string;
  mode: 'futuristic' | 'minimalist' | 'artistic';
  primary_color: string;
  accent_color: string;
  font_family: string;
}

interface PortfolioContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  syncGitHub: () => Promise<void>;
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => Promise<void>;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const defaultTheme: ThemeSettings = {
  mode: 'futuristic',
  primary_color: '270 100% 70%',
  accent_color: '190 100% 50%',
  font_family: 'Inter, system-ui, sans-serif',
};

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setProjects([]);
      setThemeSettings(defaultTheme);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (projectsData) {
        setProjects(projectsData);
      }

      // Load theme settings
      const { data: themeData } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (themeData) {
        setThemeSettings({
          id: themeData.id,
          user_id: themeData.user_id,
          mode: themeData.mode as 'futuristic' | 'minimalist' | 'artistic',
          primary_color: themeData.primary_color,
          accent_color: themeData.accent_color,
          font_family: themeData.font_family,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProjects([data, ...projects]);
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('projects')
      .update(updatedProject)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProjects(projects.map(p => p.id === id ? data : p));
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    setProjects(projects.filter(p => p.id !== id));
  };

  const syncGitHub = async () => {
    if (!user) throw new Error('User must be logged in');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-sync`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'GitHub sync failed');
    }

    // Reload projects after sync
    await loadUserData();
  };

  const updateThemeSettings = async (settings: Partial<ThemeSettings>) => {
    if (!user) throw new Error('User must be logged in');

    const updatedSettings = { ...themeSettings, ...settings };

    const { data, error } = await supabase
      .from('theme_settings')
      .upsert({
        user_id: user.id,
        mode: updatedSettings.mode,
        primary_color: updatedSettings.primary_color,
        accent_color: updatedSettings.accent_color,
        font_family: updatedSettings.font_family,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setThemeSettings({
        id: data.id,
        user_id: data.user_id,
        mode: data.mode as 'futuristic' | 'minimalist' | 'artistic',
        primary_color: data.primary_color,
        accent_color: data.accent_color,
        font_family: data.font_family,
      });
    }
  };

  return (
    <PortfolioContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      syncGitHub,
      themeSettings,
      updateThemeSettings,
      loading,
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
