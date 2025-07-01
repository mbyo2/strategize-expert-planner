
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EnhancedStrategicGoal {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
  user_id: string;
  owner_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  milestones: GoalMilestone[];
  dependencies: string[];
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  goal_comments?: GoalComment[];
  goal_attachments?: GoalAttachment[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  completed: boolean;
  completion_date?: string;
}

export interface GoalComment {
  id: string;
  goal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface GoalAttachment {
  id: string;
  goal_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  user_name?: string;
}

// Helper function to safely parse JSON with type checking
function safeParseArray<T>(value: any, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export const enhancedGoalsService = {
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
        milestones: safeParseArray<GoalMilestone>(goal.milestones),
        dependencies: safeParseArray<string>(goal.dependencies),
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
        milestones: safeParseArray<GoalMilestone>(data.milestones),
        dependencies: safeParseArray<string>(data.dependencies)
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
        milestones: safeParseArray<GoalMilestone>(data.milestones),
        dependencies: safeParseArray<string>(data.dependencies)
      };
    } catch (error) {
      console.error('Error updating enhanced goal:', error);
      toast.error('Failed to update strategic goal');
      return null;
    }
  },

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
  },

  async addGoalAttachment(goalId: string, file: File): Promise<GoalAttachment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileUrl = `https://example.com/files/${file.name}`;

      const { data, error } = await supabase
        .from('goal_attachments')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          file_name: file.name,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Attachment added successfully');
      return data;
    } catch (error) {
      console.error('Error adding goal attachment:', error);
      toast.error('Failed to add attachment');
      return null;
    }
  },

  async getGoalAttachments(goalId: string): Promise<GoalAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('goal_attachments')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(attachment => ({
        ...attachment,
        user_name: 'User'
      })) || [];
    } catch (error) {
      console.error('Error fetching goal attachments:', error);
      return [];
    }
  },

  async deleteGoalAttachment(attachmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('goal_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
      
      toast.success('Attachment deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting goal attachment:', error);
      toast.error('Failed to delete attachment');
      return false;
    }
  },

  async getGoalAnalytics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('strategic_goals')
        .select('status, priority, risk_level, progress');

      if (error) throw error;

      const analytics = {
        totalGoals: data?.length || 0,
        completedGoals: data?.filter(g => g.status === 'completed').length || 0,
        activeGoals: data?.filter(g => g.status === 'active').length || 0,
        highPriorityGoals: data?.filter(g => g.priority === 'high' || g.priority === 'critical').length || 0,
        averageProgress: data?.length ? 
          data.reduce((sum, g) => sum + g.progress, 0) / data.length : 0,
        riskDistribution: {
          low: data?.filter(g => g.risk_level === 'low').length || 0,
          medium: data?.filter(g => g.risk_level === 'medium').length || 0,
          high: data?.filter(g => g.risk_level === 'high').length || 0
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching goal analytics:', error);
      return null;
    }
  }
};
