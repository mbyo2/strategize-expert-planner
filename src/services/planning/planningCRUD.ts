
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedPlanningInitiative, ResourceRequirement, Stakeholder, Risk, SuccessMetric } from './planningTypes';

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

export const planningCRUD = {
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
      
      return (data || []).map(initiative => ({
        ...initiative,
        status: initiative.status as 'planning' | 'in-progress' | 'completed' | 'cancelled',
        priority: initiative.priority as 'low' | 'medium' | 'high' | 'critical',
        resources_required: safeParseArray<ResourceRequirement>(initiative.resources_required),
        stakeholders: safeParseArray<Stakeholder>(initiative.stakeholders),
        risks: safeParseArray<Risk>(initiative.risks),
        success_metrics: safeParseArray<SuccessMetric>(initiative.success_metrics)
      }));
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
          name: initiative.name,
          description: initiative.description,
          status: initiative.status,
          progress: initiative.progress,
          start_date: initiative.start_date,
          end_date: initiative.end_date,
          priority: initiative.priority,
          budget: initiative.budget,
          currency: initiative.currency,
          resources_required: JSON.stringify(initiative.resources_required || []),
          stakeholders: JSON.stringify(initiative.stakeholders || []),
          risks: JSON.stringify(initiative.risks || []),
          success_metrics: JSON.stringify(initiative.success_metrics || [])
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Planning initiative created successfully');
      return {
        ...data,
        status: data.status as 'planning' | 'in-progress' | 'completed' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        resources_required: safeParseArray<ResourceRequirement>(data.resources_required),
        stakeholders: safeParseArray<Stakeholder>(data.stakeholders),
        risks: safeParseArray<Risk>(data.risks),
        success_metrics: safeParseArray<SuccessMetric>(data.success_metrics)
      };
    } catch (error) {
      console.error('Error creating enhanced initiative:', error);
      toast.error('Failed to create planning initiative');
      return null;
    }
  },

  // Update planning initiative
  async updateEnhancedInitiative(id: string, updates: Partial<EnhancedPlanningInitiative>): Promise<EnhancedPlanningInitiative | null> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Handle JSON serialization for complex fields
      if (updates.resources_required) {
        updateData.resources_required = JSON.stringify(updates.resources_required);
      }
      if (updates.stakeholders) {
        updateData.stakeholders = JSON.stringify(updates.stakeholders);
      }
      if (updates.risks) {
        updateData.risks = JSON.stringify(updates.risks);
      }
      if (updates.success_metrics) {
        updateData.success_metrics = JSON.stringify(updates.success_metrics);
      }

      // Remove read-only fields
      delete updateData.created_at;

      const { data, error } = await supabase
        .from('planning_initiatives')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Planning initiative updated successfully');
      return {
        ...data,
        status: data.status as 'planning' | 'in-progress' | 'completed' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        resources_required: safeParseArray<ResourceRequirement>(data.resources_required),
        stakeholders: safeParseArray<Stakeholder>(data.stakeholders),
        risks: safeParseArray<Risk>(data.risks),
        success_metrics: safeParseArray<SuccessMetric>(data.success_metrics)
      };
    } catch (error) {
      console.error('Error updating enhanced initiative:', error);
      toast.error('Failed to update planning initiative');
      return null;
    }
  }
};
