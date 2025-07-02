
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedStrategicGoal } from './goalTypes';
import { safeParseArray } from './goalUtils';

export const goalCRUD = {
  // Get enhanced strategic goals with all data
  async getEnhancedGoals(): Promise<EnhancedStrategicGoal[]> {
    try {
      const { data, error } = await supabase
        .from('strategic_goals')
        .select(`
          *,
          goal_comments(*),
          goal_attachments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(goal => ({
        ...goal,
        status: goal.status as 'planned' | 'active' | 'completed' | 'paused',
        priority: goal.priority as 'low' | 'medium' | 'high' | 'critical',
        risk_level: goal.risk_level as 'low' | 'medium' | 'high',
        milestones: safeParseArray(goal.milestones),
        dependencies: safeParseArray(goal.dependencies),
        goal_comments: goal.goal_comments || [],
        goal_attachments: goal.goal_attachments || []
      }));
    } catch (error) {
      console.error('Error fetching enhanced goals:', error);
      return [];
    }
  },

  // Create enhanced strategic goal
  async createEnhancedGoal(goal: Omit<EnhancedStrategicGoal, 'id' | 'created_at' | 'updated_at' | 'goal_comments' | 'goal_attachments'>): Promise<EnhancedStrategicGoal | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('strategic_goals')
        .insert({
          name: goal.name,
          description: goal.description,
          status: goal.status,
          progress: goal.progress,
          target_value: goal.target_value,
          current_value: goal.current_value,
          start_date: goal.start_date,
          due_date: goal.due_date,
          user_id: user.id,
          owner_id: goal.owner_id || user.id,
          priority: goal.priority,
          category: goal.category,
          milestones: JSON.stringify(goal.milestones || []),
          dependencies: JSON.stringify(goal.dependencies || []),
          risk_level: goal.risk_level
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Strategic goal created successfully');
      return {
        ...data,
        status: data.status as 'planned' | 'active' | 'completed' | 'paused',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        risk_level: data.risk_level as 'low' | 'medium' | 'high',
        milestones: safeParseArray(data.milestones),
        dependencies: safeParseArray(data.dependencies)
      };
    } catch (error) {
      console.error('Error creating enhanced goal:', error);
      toast.error('Failed to create strategic goal');
      return null;
    }
  },

  // Update strategic goal
  async updateEnhancedGoal(id: string, updates: Partial<EnhancedStrategicGoal>): Promise<EnhancedStrategicGoal | null> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Handle JSON serialization for complex fields
      if (updates.milestones) {
        updateData.milestones = JSON.stringify(updates.milestones);
      }
      if (updates.dependencies) {
        updateData.dependencies = JSON.stringify(updates.dependencies);
      }

      // Remove read-only fields
      delete updateData.goal_comments;
      delete updateData.goal_attachments;
      delete updateData.created_at;

      const { data, error } = await supabase
        .from('strategic_goals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Strategic goal updated successfully');
      return {
        ...data,
        status: data.status as 'planned' | 'active' | 'completed' | 'paused',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        risk_level: data.risk_level as 'low' | 'medium' | 'high',
        milestones: safeParseArray(data.milestones),
        dependencies: safeParseArray(data.dependencies)
      };
    } catch (error) {
      console.error('Error updating enhanced goal:', error);
      toast.error('Failed to update strategic goal');
      return null;
    }
  }
};
