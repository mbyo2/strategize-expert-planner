
import React from 'react';
import { LineChart } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IndustryMetrics from '../components/IndustryMetrics';
import CompetitorAnalysis from '../components/IndustryAnalysis/CompetitorAnalysis';
import SWOTAnalysis from '../components/IndustryAnalysis/SWOTAnalysis';
import MarketSegmentAnalysis from '../components/IndustryAnalysis/MarketSegmentAnalysis';

const Industry = () => {
  return (
    <PageLayout 
      title="Industry Analysis" 
      subtitle="Monitor market trends, competitor activities, and industry metrics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-3 banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IndustryMetrics />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CompetitorAnalysis />
        <SWOTAnalysis />
      </div>

      <MarketSegmentAnalysis />
    </PageLayout>
  );
};

export default Industry;
