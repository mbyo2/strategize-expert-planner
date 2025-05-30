
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

export interface AnalyticsData {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  totalInitiatives: number;
  completedInitiatives: number;
  averageProgress: number;
  upcomingReviews: number;
  highPriorityRecommendations: number;
}

export interface GoalProgress {
  id: string;
  name: string;
  progress: number;
  status: string;
  due_date?: string;
}

export interface InitiativeStatus {
  id: string;
  name: string;
  status: string;
  progress: number;
  start_date?: string;
  end_date?: string;
}

export interface TrendData {
  date: string;
  completed_goals: number;
  new_initiatives: number;
  progress_average: number;
}

export const fetchAnalyticsOverview = async (): Promise<AnalyticsData> => {
  try {
    // Fetch strategic goals data
    const { data: goals, error: goalsError } = await customSupabase
      .from('strategic_goals')
      .select('status, progress');

    if (goalsError) throw goalsError;

    // Fetch planning initiatives data
    const { data: initiatives, error: initiativesError } = await customSupabase
      .from('planning_initiatives')
      .select('status, progress');

    if (initiativesError) throw initiativesError;

    // Fetch upcoming strategy reviews
    const { data: reviews, error: reviewsError } = await customSupabase
      .from('strategy_reviews')
      .select('id')
      .eq('status', 'scheduled')
      .gte('scheduled_date', new Date().toISOString());

    if (reviewsError) throw reviewsError;

    // Fetch high priority recommendations
    const { data: recommendations, error: recommendationsError } = await customSupabase
      .from('recommendations')
      .select('id')
      .eq('status', 'pending')
      .gte('priority', 4);

    if (recommendationsError) throw recommendationsError;

    const totalGoals = goals?.length || 0;
    const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;
    const inProgressGoals = goals?.filter(g => g.status === 'in_progress').length || 0;
    
    const totalInitiatives = initiatives?.length || 0;
    const completedInitiatives = initiatives?.filter(i => i.status === 'completed').length || 0;
    
    const averageProgress = goals?.length > 0 
      ? goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length 
      : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      totalInitiatives,
      completedInitiatives,
      averageProgress: Math.round(averageProgress),
      upcomingReviews: reviews?.length || 0,
      highPriorityRecommendations: recommendations?.length || 0,
    };
  } catch (error) {
    console.error('Failed to fetch analytics overview:', error);
    toast.error('Failed to load analytics data');
    throw error;
  }
};

export const fetchGoalProgressData = async (): Promise<GoalProgress[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategic_goals')
      .select('id, name, progress, status, due_date')
      .order('progress', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Failed to fetch goal progress data:', error);
    toast.error('Failed to load goal progress data');
    return [];
  }
};

export const fetchInitiativeStatusData = async (): Promise<InitiativeStatus[]> => {
  try {
    const { data, error } = await customSupabase
      .from('planning_initiatives')
      .select('id, name, status, progress, start_date, end_date')
      .order('progress', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Failed to fetch initiative status data:', error);
    toast.error('Failed to load initiative status data');
    return [];
  }
};

export const fetchTrendData = async (days: number = 30): Promise<TrendData[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // This would typically be implemented with a more sophisticated query
    // For now, we'll return mock trend data
    const trendData: TrendData[] = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        completed_goals: Math.floor(Math.random() * 5),
        new_initiatives: Math.floor(Math.random() * 3),
        progress_average: Math.floor(Math.random() * 100),
      });
    }

    return trendData;
  } catch (error) {
    console.error('Failed to fetch trend data:', error);
    toast.error('Failed to load trend data');
    return [];
  }
};

export const exportAnalyticsData = async (format: 'csv' | 'json' = 'csv') => {
  try {
    const overview = await fetchAnalyticsOverview();
    const goals = await fetchGoalProgressData();
    const initiatives = await fetchInitiativeStatusData();

    const data = {
      overview,
      goals,
      initiatives,
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Convert to CSV format
      const csvLines = [
        'Type,Name,Status,Progress,Due Date',
        ...goals.map(g => `Goal,"${g.name}",${g.status},${g.progress}%,${g.due_date || ''}`),
        ...initiatives.map(i => `Initiative,"${i.name}",${i.status},${i.progress}%,${i.end_date || ''}`),
      ];
      
      const csvContent = csvLines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Analytics data exported as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Failed to export analytics data:', error);
    toast.error('Failed to export analytics data');
  }
};
