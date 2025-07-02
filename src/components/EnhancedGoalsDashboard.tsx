
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Plus } from 'lucide-react';
import { enhancedGoalsService, type EnhancedStrategicGoal } from '@/services/enhancedGoalsService';
import { enhancedPlanningService, type EnhancedPlanningInitiative } from '@/services/enhancedPlanningService';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import GoalsTab from '@/components/dashboard/GoalsTab';
import InitiativesTab from '@/components/dashboard/InitiativesTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';

const EnhancedGoalsDashboard = () => {
  const [goals, setGoals] = useState<EnhancedStrategicGoal[]>([]);
  const [initiatives, setInitiatives] = useState<EnhancedPlanningInitiative[]>([]);
  const [goalAnalytics, setGoalAnalytics] = useState<any>(null);
  const [initiativeAnalytics, setInitiativeAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [goalsData, initiativesData, goalStats, initiativeStats] = await Promise.all([
        enhancedGoalsService.getEnhancedGoals(),
        enhancedPlanningService.getEnhancedInitiatives(),
        enhancedGoalsService.getGoalAnalytics(),
        enhancedPlanningService.getInitiativeAnalytics()
      ]);
      
      setGoals(goalsData);
      setInitiatives(initiativesData);
      setGoalAnalytics(goalStats);
      setInitiativeAnalytics(initiativeStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Enhanced Goals & Planning</h1>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Initiative
          </Button>
        </div>
      </div>

      <DashboardAnalytics 
        goalAnalytics={goalAnalytics} 
        initiativeAnalytics={initiativeAnalytics} 
      />

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Strategic Goals</TabsTrigger>
          <TabsTrigger value="initiatives">Planning Initiatives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <GoalsTab goals={goals} />
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-4">
          <InitiativesTab initiatives={initiatives} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab goalAnalytics={goalAnalytics} initiativeAnalytics={initiativeAnalytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedGoalsDashboard;
