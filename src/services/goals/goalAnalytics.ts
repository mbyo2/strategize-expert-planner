
import { supabase } from '@/integrations/supabase/client';

export const goalAnalytics = {
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
