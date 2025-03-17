
import React from 'react';
import { 
  LineChart, 
  Target, 
  Users, 
  Building, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import StrategySection from '@/components/StrategySection';
import InfoCard from '@/components/InfoCard';
import { Card, CardContent } from '@/components/ui/card';
import StrategicGoals from '@/components/StrategicGoals';
import IndustryMetrics from '@/components/IndustryMetrics';

const Index = () => {
  return (
    <PageLayout 
      title="Strategic Dashboard" 
      subtitle="Monitor your organization's strategic initiatives and industry performance"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StrategySection
          title="Industry Analysis"
          description="Key metrics and competitive position"
          className="lg:col-span-2"
        >
          <IndustryMetrics />
        </StrategySection>

        <StrategySection
          title="Strategic Goals"
          description="Progress on key objectives"
          collapsible
        >
          <StrategicGoals />
        </StrategySection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Recent Market Changes</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                <span>Competitor XYZ launched new product line targeting small business segment</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
                <span>Regulatory changes affecting industry standards expected in Q1 2023</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <span>Market growth in APAC region exceeding forecasts by 12%</span>
              </li>
            </ul>
            
            <Button variant="ghost" size="sm" className="mt-4">
              View all updates <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Strategic Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">1</span>
                <span>Increase R&D investment in AI technologies to maintain competitive edge</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">2</span>
                <span>Expand distribution channels in emerging markets to capture growth</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">3</span>
                <span>Develop strategic partnerships with complementary service providers</span>
              </li>
            </ul>
            
            <Button variant="ghost" size="sm" className="mt-4">
              See all recommendations <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Index;
