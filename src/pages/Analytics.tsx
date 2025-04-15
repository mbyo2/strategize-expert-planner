
import React from 'react';
import PageLayout from '@/components/PageLayout';
import StrategicAnalytics from '@/components/analytics/StrategicAnalytics';

const Analytics = () => {
  return (
    <PageLayout
      title="Strategic Analytics"
      subtitle="Analyze and track your strategic goals performance"
    >
      <StrategicAnalytics />
    </PageLayout>
  );
};

export default Analytics;
