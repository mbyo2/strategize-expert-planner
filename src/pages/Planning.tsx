
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, BarChart3, Users } from 'lucide-react';
import PlanningInitiativesManager from '@/components/PlanningInitiativesManager';
import StrategicGoalsManager from '@/components/StrategicGoalsManager';

const Planning = () => {
  return (
    <PageLayout 
      title="Strategic Planning" 
      subtitle="Plan and execute your strategic initiatives"
      icon={<Calendar className="h-6 w-6" />}
    >
      <Tabs defaultValue="initiatives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="initiatives">Planning Initiatives</TabsTrigger>
          <TabsTrigger value="goals">Strategic Goals</TabsTrigger>
          <TabsTrigger value="calendar">Planning Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="initiatives">
          <PlanningInitiativesManager />
        </TabsContent>
        
        <TabsContent value="goals">
          <StrategicGoalsManager />
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Planning Calendar</h3>
            <p className="text-muted-foreground mb-6">
              Calendar view for planning and scheduling will be implemented here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Planning;
