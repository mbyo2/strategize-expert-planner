import { useState, useEffect } from 'react';
import { fetchStrategicGoals, StrategicGoal } from '@/services/strategicGoalsService';
import { useRealTimeStrategicGoals } from './useRealTimeStrategicGoals';
import { toast } from 'sonner';

export const useStrategicGoalsData = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use real-time updates
  const { goals: realtimeGoals, loading: realtimeLoading, error: realtimeError } = useRealTimeStrategicGoals();

  useEffect(() => {
    if (!realtimeLoading) {
      setGoals(realtimeGoals);
      setLoading(false);
      if (realtimeError) {
        setError(realtimeError.message);
        toast.error('Failed to load strategic goals');
      } else {
        setError(null);
      }
    }
  }, [realtimeGoals, realtimeLoading, realtimeError]);

  const refreshGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchStrategicGoals();
      setGoals(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goals';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    loading,
    error,
    refreshGoals
  };
};