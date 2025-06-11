
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { BarChart3 } from 'lucide-react';
import EnhancedAnalyticsDashboard from '@/components/analytics/EnhancedAnalyticsDashboard';

const Analytics = () => {
  return (
    <PageLayout 
      title="Analytics & Reporting" 
      subtitle="Comprehensive insights and data visualization"
      icon={<BarChart3 className="h-6 w-6" />}
    >
      <EnhancedAnalyticsDashboard />
    </PageLayout>
  );
};

export default Analytics;
