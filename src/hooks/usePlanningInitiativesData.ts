import { useState, useEffect } from 'react';
import { fetchPlanningInitiatives, PlanningInitiative } from '@/services/planningInitiativesService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePlanningInitiativesData = () => {
  const [initiatives, setInitiatives] = useState<PlanningInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitiatives = async () => {
      try {
        setLoading(true);
        const data = await fetchPlanningInitiatives();
        setInitiatives(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch initiatives';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInitiatives();

    // Set up real-time subscription
    const channel = supabase
      .channel('planning-initiatives-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'planning_initiatives' 
        },
        async () => {
          // Refetch data when changes occur
          await loadInitiatives();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshInitiatives = async () => {
    try {
      setLoading(true);
      const data = await fetchPlanningInitiatives();
      setInitiatives(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch initiatives';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatives,
    loading,
    error,
    refreshInitiatives
  };
};