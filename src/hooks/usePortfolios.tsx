import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  template_id: string | null;
  is_public: boolean;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSection {
  id: string;
  portfolio_id: string;
  section_type: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  order_index: number;
  metadata: Record<string, any>;
  created_at: string;
}

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPortfolios();
    } else {
      setPortfolios([]);
      setActivePortfolio(null);
      setLoading(false);
    }
  }, [user]);

  const loadPortfolios = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const portfoliosData = (data || []).map(p => ({
        ...p,
        metadata: p.metadata as Record<string, any>
      }));
      
      setPortfolios(portfoliosData);
      
      // Set active portfolio (first active one or first one)
      const active = portfoliosData?.find(p => p.is_active) || portfoliosData?.[0] || null;
      setActivePortfolio(active);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolio: Omit<Portfolio, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        ...portfolio,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      const portfolio = { ...data, metadata: data.metadata as Record<string, any> };
      setPortfolios([portfolio, ...portfolios]);
      setActivePortfolio(portfolio);
      return portfolio;
    }
    
    return data;
  };

  const updatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      const portfolio = { ...data, metadata: data.metadata as Record<string, any> };
      setPortfolios(portfolios.map(p => p.id === id ? portfolio : p));
      if (activePortfolio?.id === id) {
        setActivePortfolio(portfolio);
      }
      return portfolio;
    }
    
    return data;
  };

  const deletePortfolio = async (id: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    
    setPortfolios(portfolios.filter(p => p.id !== id));
    if (activePortfolio?.id === id) {
      setActivePortfolio(portfolios[0] || null);
    }
  };

  const getSections = async (portfolioId: string): Promise<PortfolioSection[]> => {
    const { data, error } = await supabase
      .from('portfolio_sections')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []).map(s => ({ ...s, metadata: s.metadata as Record<string, any> }));
  };

  const addSection = async (section: Omit<PortfolioSection, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert(section)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateSection = async (id: string, updates: Partial<PortfolioSection>) => {
    const { data, error } = await supabase
      .from('portfolio_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteSection = async (id: string) => {
    const { error } = await supabase
      .from('portfolio_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    portfolios,
    activePortfolio,
    loading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    setActivePortfolio,
    getSections,
    addSection,
    updateSection,
    deleteSection,
    reload: loadPortfolios,
  };
};
