import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from './useSimpleAuth';

interface DashboardStats {
  activeGoals: number;
  teamMembers: number;
  planningInitiatives: number;
  reviewsScheduled: number;
}

interface RecentActivity {
  title: string;
  description: string;
  time: string;
  type: 'goal' | 'team' | 'metric' | 'planning';
}

export const useDashboardData = () => {
  const { session } = useSimpleAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeGoals: 0,
    teamMembers: 0,
    planningInitiatives: 0,
    reviewsScheduled: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    const fetchDashboardData = async () => {
      if (!mounted) return;
      
      try {
        // Fetch active goals count
        const { count: goalsCount } = await supabase
          .from('strategic_goals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .in('status', ['active', 'planned']);

        // Fetch team members count
        const { count: membersCount } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true });

        // Fetch planning initiatives count (uses owner_id, not user_id)
        const { count: initiativesCount } = await supabase
          .from('planning_initiatives')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', session.user.id)
          .eq('status', 'active');

        // Fetch upcoming reviews count (strategy_reviews has no user field - show all upcoming)
        const { count: reviewsCount } = await supabase
          .from('strategy_reviews')
          .select('*', { count: 'exact', head: true })
          .gte('scheduled_date', new Date().toISOString());

        if (mounted) {
          setStats({
            activeGoals: goalsCount || 0,
            teamMembers: membersCount || 0,
            planningInitiatives: initiativesCount || 0,
            reviewsScheduled: reviewsCount || 0,
          });
        }

        // Fetch recent activities from activity_logs
        const { data: activityData } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activityData && mounted) {
          const formattedActivities: RecentActivity[] = activityData.map((log) => {
            const timeAgo = getTimeAgo(new Date(log.created_at));
            return {
              title: formatActivityTitle(log.action, log.resource_type),
              description: formatActivityDescription(log.action, log.resource_type, log.metadata),
              time: timeAgo,
              type: mapResourceTypeToActivityType(log.resource_type),
            };
          });
          setActivities(formattedActivities);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Set up real-time subscription for activity updates
    subscription = supabase
      .channel(`dashboard-${session.user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          if (mounted) {
            fetchDashboardData();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [session?.user?.id]);

  return { stats, activities, isLoading };
};

// Helper functions
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatActivityTitle(action: string, entityType: string): string {
  const actionMap: Record<string, string> = {
    created: 'Created',
    updated: 'Updated',
    deleted: 'Deleted',
    completed: 'Completed',
  };
  
  const entityMap: Record<string, string> = {
    strategic_goal: 'Strategic Goal',
    planning_initiative: 'Planning Initiative',
    team_member: 'Team Member',
    strategy_review: 'Strategy Review',
  };

  return `${actionMap[action] || action} ${entityMap[entityType] || entityType}`;
}

function formatActivityDescription(action: string, entityType: string, metadata: any): string {
  if (metadata?.name) {
    return `${metadata.name}`;
  }
  return `A ${entityType} was ${action}`;
}

function mapResourceTypeToActivityType(resourceType: string): 'goal' | 'team' | 'metric' | 'planning' {
  if (resourceType.includes('goal')) return 'goal';
  if (resourceType.includes('team') || resourceType.includes('member')) return 'team';
  if (resourceType.includes('planning') || resourceType.includes('initiative')) return 'planning';
  return 'metric';
}
