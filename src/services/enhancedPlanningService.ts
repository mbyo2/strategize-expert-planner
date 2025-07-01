
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EnhancedPlanningInitiative {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  start_date?: string;
  end_date?: string;
  owner_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget?: number;
  currency: string;
  resources_required: ResourceRequirement[];
  stakeholders: Stakeholder[];
  risks: Risk[];
  success_metrics: SuccessMetric[];
  created_at: string;
  updated_at: string;
}

export interface ResourceRequirement {
  id: string;
  type: 'human' | 'financial' | 'equipment' | 'technology';
  description: string;
  quantity?: number;
  cost?: number;
  allocated: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  contact?: string;
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation_plan?: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'occurred';
}

export interface SuccessMetric {
  id: string;
  name: string;
  description?: string;
  target_value: number;
  current_value?: number;
  unit: string;
  measurement_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface InitiativeMilestone {
  id: string;
  initiative_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  completion_percentage: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export const enhancedPlanningService = {
  // Get enhanced planning initiatives
  async getEnhancedInitiatives(): Promise<EnhancedPlanningInitiative[]> {
    try {
      const { data, error } = await supabase
        .from('planning_initiatives')
        .select(`
          *,
          initiative_milestones(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enhanced initiatives:', error);
      return [];
    }
  },

  // Create enhanced planning initiative
  async createEnhancedInitiative(initiative: Omit<EnhancedPlanningInitiative, 'id' | 'created_at' | 'updated_at'>): Promise<EnhancedPlanningInitiative | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('planning_initiatives')
        .insert({
          ...initiative,
          owner_id: initiative.owner_id || user.id,
          resources_required: initiative.resources_required || [],
          stakeholders: initiative.stakeholders || [],
          risks: initiative.risks || [],
          success_metrics: initiative.success_metrics || []
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Planning initiative created successfully');
      return data;
    } catch (error) {
      console.error('Error creating enhanced initiative:', error);
      toast.error('Failed to create planning initiative');
      return null;
    }
  },

  // Update planning initiative
  async updateEnhancedInitiative(id: string, updates: Partial<EnhancedPlanningInitiative>): Promise<EnhancedPlanningInitiative | null> {
    try {
      const { data, error } = await supabase
        .from('planning_initiatives')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Planning initiative updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating enhanced initiative:', error);
      toast.error('Failed to update planning initiative');
      return null;
    }
  },

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
      return data;
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
      return data;
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
      return data || [];
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
  },

  // Get initiative analytics
  async getInitiativeAnalytics(): Promise<any> {
    try {
      const { data: initiatives, error: initiativesError } = await supabase
        .from('planning_initiatives')
        .select('status, priority, progress, budget');

      const { data: milestones, error: milestonesError } = await supabase
        .from('initiative_milestones')
        .select('status, completion_percentage');

      if (initiativesError || milestonesError) {
        throw initiativesError || milestonesError;
      }

      const analytics = {
        totalInitiatives: initiatives?.length || 0,
        completedInitiatives: initiatives?.filter(i => i.status === 'completed').length || 0,
        activeInitiatives: initiatives?.filter(i => i.status === 'in-progress').length || 0,
        totalBudget: initiatives?.reduce((sum, i) => sum + (i.budget || 0), 0) || 0,
        averageProgress: initiatives?.length ? 
          initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length : 0,
        milestoneStats: {
          total: milestones?.length || 0,
          completed: milestones?.filter(m => m.status === 'completed').length || 0,
          inProgress: milestones?.filter(m => m.status === 'in-progress').length || 0,
          blocked: milestones?.filter(m => m.status === 'blocked').length || 0
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching initiative analytics:', error);
      return null;
    }
  }
};
