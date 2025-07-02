
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InitiativeMilestone } from './planningTypes';

export const planningMilestones = {
  // Create initiative milestone
  async createMilestone(milestone: Omit<InitiativeMilestone, 'id' | 'created_at' | 'updated_at'>): Promise<InitiativeMilestone | null> {
    try {
      const { data, error } = await supabase
        .from('initiative_milestones')
        .insert(milestone)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Milestone created successfully');
      return {
        ...data,
        status: data.status as 'pending' | 'in-progress' | 'completed' | 'blocked'
      };
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast.error('Failed to create milestone');
      return null;
    }
  },

  // Update milestone
  async updateMilestone(id: string, updates: Partial<InitiativeMilestone>): Promise<InitiativeMilestone | null> {
    try {
      const { data, error } = await supabase
        .from('initiative_milestones')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Milestone updated successfully');
      return {
        ...data,
        status: data.status as 'pending' | 'in-progress' | 'completed' | 'blocked'
      };
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
      return null;
    }
  },

  // Get initiative milestones
  async getInitiativeMilestones(initiativeId: string): Promise<InitiativeMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('initiative_milestones')
        .select('*')
        .eq('initiative_id', initiativeId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(milestone => ({
        ...milestone,
        status: milestone.status as 'pending' | 'in-progress' | 'completed' | 'blocked'
      }));
    } catch (error) {
      console.error('Error fetching initiative milestones:', error);
      return [];
    }
  },

  // Delete milestone
  async deleteMilestone(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('initiative_milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Milestone deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
      return false;
    }
  }
};
