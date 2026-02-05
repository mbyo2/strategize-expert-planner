import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StrategyReview {
  id: string;
  title: string;
  description?: string | null;
  scheduled_date: string;
  duration_minutes: number | null;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CreateReviewData {
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes?: number;
  status?: 'draft' | 'scheduled' | 'completed' | 'cancelled';
}

async function fetchStrategyReviews(): Promise<StrategyReview[]> {
  const { data, error } = await supabase
    .from('strategy_reviews')
    .select('*')
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching strategy reviews:', error);
    return [];
  }

  return (data || []).map(review => ({
    ...review,
    status: review.status as StrategyReview['status'],
  }));
}

async function createStrategyReview(data: CreateReviewData): Promise<StrategyReview> {
  const { data: review, error } = await supabase
    .from('strategy_reviews')
    .insert({
      title: data.title,
      description: data.description,
      scheduled_date: data.scheduled_date,
      duration_minutes: data.duration_minutes || 60,
      status: data.status || 'draft',
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...review,
    status: review.status as StrategyReview['status'],
  };
}

async function updateStrategyReview(id: string, updates: Partial<CreateReviewData>): Promise<StrategyReview> {
  const { data: review, error } = await supabase
    .from('strategy_reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...review,
    status: review.status as StrategyReview['status'],
  };
}

async function deleteStrategyReview(id: string): Promise<void> {
  const { error } = await supabase
    .from('strategy_reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const useStrategyReviews = () => {
  const queryClient = useQueryClient();

  const {
    data: reviews = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['strategy-reviews'],
    queryFn: fetchStrategyReviews,
  });

  const createReviewMutation = useMutation({
    mutationFn: createStrategyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy-reviews'] });
      toast.success('Strategy review scheduled successfully');
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast.error('Failed to schedule strategy review');
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateReviewData> }) =>
      updateStrategyReview(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy-reviews'] });
      toast.success('Strategy review updated successfully');
    },
    onError: (error) => {
      console.error('Error updating review:', error);
      toast.error('Failed to update strategy review');
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteStrategyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy-reviews'] });
      toast.success('Strategy review deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete strategy review');
    },
  });

  return {
    reviews,
    isLoading,
    error,
    refetch,
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
  };
};
