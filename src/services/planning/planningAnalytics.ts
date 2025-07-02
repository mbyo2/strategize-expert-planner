
import { supabase } from '@/integrations/supabase/client';

export const planningAnalytics = {
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
