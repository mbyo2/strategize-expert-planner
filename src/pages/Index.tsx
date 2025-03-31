
import React from 'react';
import PageLayout from '../components/PageLayout';
import CustomizableDashboard from '../components/CustomizableDashboard';
import InfoCard from '../components/InfoCard';
import { Target, Building, Users, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <PageLayout 
      title="Intantiko Strategic Dashboard" 
      subtitle="Monitor your organization's strategic initiatives and industry performance"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <InfoCard
          title="Strategic Goals"
          value="6"
          description="2 completed this quarter"
          icon={<Target />}
          trend="up"
          trendValue="+2 from last quarter"
        />
        <InfoCard
          title="Industry Position"
          value="Top 15%"
          description="Market share growth"
          icon={<Building />}
          trend="up"
          trendValue="+3% YoY"
        />
        <InfoCard
          title="Team Alignment"
          value="87%"
          description="Strategy awareness score"
          icon={<Users />}
          trend="neutral"
          trendValue="No change"
        />
        <InfoCard
          title="Next Review"
          value="Dec 15"
          description="Quarterly strategy review"
          icon={<Calendar />}
          trend="neutral"
          trendValue="On schedule"
        />
      </div>

      <CustomizableDashboard />
    </PageLayout>
  );
};

export default Index;
