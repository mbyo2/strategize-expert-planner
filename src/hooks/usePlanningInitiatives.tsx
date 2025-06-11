
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPlanningInitiatives, 
  createPlanningInitiative, 
  updatePlanningInitiative, 
  deletePlanningInitiative,
  PlanningInitiative 
} from '@/services/planningInitiativesService';
import { toast } from 'sonner';

export const usePlanningInitiatives = () => {
  const queryClient = useQueryClient();

  const {
    data: initiatives = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['planning-initiatives'],
    queryFn: fetchPlanningInitiatives,
  });

  const createInitiativeMutation = useMutation({
    mutationFn: createPlanningInitiative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-initiatives'] });
      toast.success('Planning initiative created successfully');
    },
    onError: (error) => {
      console.error('Error creating initiative:', error);
      toast.error('Failed to create planning initiative');
    },
  });

  const updateInitiativeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PlanningInitiative> }) =>
      updatePlanningInitiative(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-initiatives'] });
      toast.success('Planning initiative updated successfully');
    },
    onError: (error) => {
      console.error('Error updating initiative:', error);
      toast.error('Failed to update planning initiative');
    },
  });

  const deleteInitiativeMutation = useMutation({
    mutationFn: deletePlanningInitiative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-initiatives'] });
      toast.success('Planning initiative deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting initiative:', error);
      toast.error('Failed to delete planning initiative');
    },
  });

  return {
    initiatives,
    isLoading,
    error,
    createInitiative: createInitiativeMutation.mutate,
    updateInitiative: updateInitiativeMutation.mutate,
    deleteInitiative: deleteInitiativeMutation.mutate,
    isCreating: createInitiativeMutation.isPending,
    isUpdating: updateInitiativeMutation.isPending,
    isDeleting: deleteInitiativeMutation.isPending,
  };
};
