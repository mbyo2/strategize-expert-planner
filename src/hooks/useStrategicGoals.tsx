
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchStrategicGoals, 
  createStrategicGoal, 
  updateStrategicGoal, 
  deleteStrategicGoal,
  StrategicGoal 
} from '@/services/strategicGoalsService';
import { toast } from 'sonner';

export const useStrategicGoals = () => {
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['strategic-goals'],
    queryFn: fetchStrategicGoals,
  });

  const createGoalMutation = useMutation({
    mutationFn: createStrategicGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-goals'] });
      toast.success('Strategic goal created successfully');
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
      toast.error('Failed to create strategic goal');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StrategicGoal> }) =>
      updateStrategicGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-goals'] });
      toast.success('Strategic goal updated successfully');
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast.error('Failed to update strategic goal');
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteStrategicGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-goals'] });
      toast.success('Strategic goal deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete strategic goal');
    },
  });

  return {
    goals,
    isLoading,
    error,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
  };
};
