
import React from 'react';
import PageLayout from './PageLayout';
import CustomizableDashboard from './CustomizableDashboard';
import InfoCard from './InfoCard';
import ReportGenerator from './ReportGenerator';
import { Target, Building, Users, Calendar, BarChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOptimizedQuery } from '@/hooks/use-optimized-query';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { fetchIndustryMetrics } from '@/services/industryMetricsService';
import { fetchUpcomingStrategyReviews } from '@/services/strategyReviewsService';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { cacheDashboardData, getCachedDashboardData } from '@/services/offlineService';
import ExportDialog from './export/ExportDialog';
import ImportDialog from './import/ImportDialog';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    goalsCount: 0,
    completedGoals: 0,
    industryPosition: '',
    industryTrend: 'neutral',
    industryValue: '',
    teamAlignment: 87,
    teamAlignmentTrend: 'neutral',
    nextReviewDate: '',
    nextReviewTitle: '',
  });
  
  // Use optimized query with offline support
  const { data: goals = [], isLoading: isGoalsLoading, isOfflineData: isGoalsOffline } = useOptimizedQuery(
    ['strategic-goals'],
    fetchStrategicGoals,
    {
      cacheKey: 'dashboard-goals',
      mobilePriority: 'high',
      offlineCapable: true,
    }
  );
  
  const { data: metrics = [], isLoading: isMetricsLoading, isOfflineData: isMetricsOffline } = useOptimizedQuery(
    ['industry-metrics'],
    fetchIndustryMetrics,
    {
      cacheKey: 'dashboard-metrics',
      mobilePriority: 'medium',
      offlineCapable: true,
    }
  );
  
  const { data: reviews = [], isLoading: isReviewsLoading, isOfflineData: isReviewsOffline } = useOptimizedQuery(
    ['strategy-reviews'],
    () => fetchUpcomingStrategyReviews(1),
    {
      cacheKey: 'dashboard-reviews',
      mobilePriority: 'low',
      offlineCapable: true,
    }
  );
  
  useEffect(() => {
    const processDashboardData = () => {
      try {
        setLoading(true);
        
        const completedGoals = goals.filter(g => g.status === 'completed').length;
        const goalsCount = goals.length;
        
        const marketShareMetric = metrics.find(m => 
          m.name.toLowerCase().includes('market share') || 
          m.name.toLowerCase().includes('position')
        );
        
        let industryPosition = 'Top 15%';
        let industryTrend = 'neutral';
        let industryValue = '';
        
        if (marketShareMetric) {
          industryPosition = `${marketShareMetric.value}%`;
          industryTrend = marketShareMetric.trend || 'neutral';
          industryValue = `${marketShareMetric.change_percentage || 0}% YoY`;
        }
        
        let nextReviewDate = 'Not Scheduled';
        let nextReviewTitle = 'No upcoming reviews';
        
        if (reviews.length > 0) {
          const nextReview = reviews[0];
          nextReviewDate = format(new Date(nextReview.scheduled_date), 'MMM d');
          nextReviewTitle = nextReview.title;
        }
        
        const newDashboardData = {
          goalsCount,
          completedGoals,
          industryPosition,
          industryTrend,
          industryValue,
          teamAlignment: 87,
          teamAlignmentTrend: 'neutral',
          nextReviewDate,
          nextReviewTitle,
        };
        
        setDashboardData(newDashboardData);
        
        // Cache the processed dashboard data for offline use
        cacheDashboardData(newDashboardData);
      } catch (error) {
        console.error('Error processing dashboard data:', error);
        
        // Try to get cached dashboard data as fallback
        const cachedData = getCachedDashboardData();
        if (cachedData) {
          setDashboardData(cachedData);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Only process data when all queries are completed (or offline data is loaded)
    if (!isGoalsLoading && !isMetricsLoading && !isReviewsLoading) {
      processDashboardData();
    }
  }, [goals, metrics, reviews, isGoalsLoading, isMetricsLoading, isReviewsLoading]);
  
  // Show offline indicator if any data is from cache
  const isAnyOfflineData = isGoalsOffline || isMetricsOffline || isReviewsOffline;
  
  return (
    <PageLayout 
      title="Dashboard" 
      subtitle="Monitor your organization's strategic initiatives and industry performance"
      loading={isGoalsLoading && isMetricsLoading && isReviewsLoading}
    >
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/analytics">
              <BarChart className="mr-2 h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>View Analytics</span>
            </Link>
          </Button>
          <ExportDialog />
          <ImportDialog />
        </div>
        <ReportGenerator triggerClassName="ml-auto" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {loading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </>
        ) : (
          <>
            <InfoCard
              title="Strategic Goals"
              value={dashboardData.goalsCount.toString()}
              description={`${dashboardData.completedGoals} completed this quarter`}
              icon={<Target />}
              trend="up"
              trendValue="+2 from last quarter"
            />
            <InfoCard
              title="Industry Position"
              value={dashboardData.industryPosition}
              description="Market share growth"
              icon={<Building />}
              trend={dashboardData.industryTrend as any}
              trendValue={dashboardData.industryValue}
            />
            <InfoCard
              title="Team Alignment"
              value={`${dashboardData.teamAlignment}%`}
              description="Strategy awareness score"
              icon={<Users />}
              trend={dashboardData.teamAlignmentTrend as any}
              trendValue="No change"
            />
            <InfoCard
              title="Next Review"
              value={dashboardData.nextReviewDate}
              description={dashboardData.nextReviewTitle}
              icon={<Calendar />}
              trend="neutral"
              trendValue="On schedule"
            />
          </>
        )}
      </div>

      <CustomizableDashboard />
    </PageLayout>
  );
};

export default Dashboard;
