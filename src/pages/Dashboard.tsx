
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Home } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const DashboardPage = () => {
  return (
    <PageLayout 
      title="Dashboard" 
      subtitle="Your strategic overview and quick insights"
      icon={<Home className="h-6 w-6" />}
    >
      <Dashboard />
    </PageLayout>
  );
};

export default DashboardPage;
