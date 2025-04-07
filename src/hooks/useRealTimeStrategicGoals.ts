
import { useState, useEffect } from 'react';
import { StrategicGoal, fetchStrategicGoals } from '@/services/strategicGoalsService';
import { customSupabase } from "@/integrations/supabase/customClient";

export const useRealTimeStrategicGoals = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadGoals = async () => {
      try {
        setLoading(true);
        const data = await fetchStrategicGoals();
        setGoals(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch strategic goals'));
      } finally {
        setLoading(false);
      }
    };

    loadGoals();

    // Set up real-time subscription
    const channel = customSupabase
      .channel('strategic-goals-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'strategic_goals' 
        },
        async (payload) => {
          console.log('Strategic goals change detected:', payload);
          // Reload all goals when any change is detected
          const updatedGoals = await fetchStrategicGoals();
          setGoals(updatedGoals);
        }
      )
      .subscribe();

    return () => {
      customSupabase.removeChannel(channel);
    };
  }, []);

  return { goals, loading, error };
};
