
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, BarChart3, Workflow } from 'lucide-react';
import StrategicGoals from '@/components/StrategicGoals';
import GoalProgressDashboard from '@/components/GoalTracking/GoalProgressDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import StrategicPlanningWorkflow from '@/components/StrategicPlanningWorkflow';

const Goals = () => {
  return (
    <PageLayout 
      title="Strategic Goals" 
      subtitle="Track and manage your strategic objectives"
      icon={<Target className="h-6 w-6" />}
    >
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals Management</TabsTrigger>
          <TabsTrigger value="tracking">Progress Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Planning Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals">
          <StrategicGoals />
        </TabsContent>
        
        <TabsContent value="tracking">
          <GoalProgressDashboard />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="workflow">
          <StrategicPlanningWorkflow />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Goals;
