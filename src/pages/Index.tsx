
import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import CustomizableDashboard from '../components/CustomizableDashboard';
import InfoCard from '../components/InfoCard';
import ReportGenerator from '../components/ReportGenerator';
import { Target, Building, Users, Calendar, BarChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { fetchIndustryMetrics } from '@/services/industryMetricsService';
import { fetchUpcomingStrategyReviews } from '@/services/strategyReviewsService';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
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
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [goals, metrics, reviews] = await Promise.all([
          fetchStrategicGoals(),
          fetchIndustryMetrics(),
          fetchUpcomingStrategyReviews(1),
        ]);
        
        const completedGoals = goals.filter(g => g.status === 'completed').length;
        const goalsCount = goals.length;
        
        const marketShareMetric = metrics.find(m => 
          m.name.toLowerCase().includes('market share') || 
          m.name.toLowerCase().includes('position')
        );
        
        let industryPosition = 'Top 15%';
        let industryTrend: 'up' | 'down' | 'neutral' = 'neutral';
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
        
        setDashboardData({
          goalsCount,
          completedGoals,
          industryPosition,
          industryTrend,
          industryValue,
          teamAlignment: 87,
          teamAlignmentTrend: 'neutral',
          nextReviewDate,
          nextReviewTitle,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <PageLayout 
      title="Intantiko Strategic Dashboard" 
      subtitle="Monitor your organization's strategic initiatives and industry performance"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/analytics">
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
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

export default Index;
