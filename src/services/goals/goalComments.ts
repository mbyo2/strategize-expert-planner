
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GoalComment } from './goalTypes';

export const goalComments = {
  // Add comment to goal
  async addGoalComment(goalId: string, content: string): Promise<GoalComment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goal_comments')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Comment added successfully');
      return data;
    } catch (error) {
      console.error('Error adding goal comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  },

  async getGoalComments(goalId: string): Promise<GoalComment[]> {
    try {
      const { data, error } = await supabase
        .from('goal_comments')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data?.map(comment => ({
        ...comment,
        user_name: 'User'
      })) || [];
    } catch (error) {
      console.error('Error fetching goal comments:', error);
      return [];
    }
  }
};
