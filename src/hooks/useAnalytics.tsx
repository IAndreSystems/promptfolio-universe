import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  const trackEvent = async (eventType: string, eventData?: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (session) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-analytics`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          event_type: eventType,
          event_data: eventData
        })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackEvent };
};