
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import StrategicAnalytics from '@/components/analytics/StrategicAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Users, Target, Building } from 'lucide-react';
import TeamCollaboration from '@/components/TeamManagement/TeamCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealTimeStrategicGoals } from '@/hooks/useRealTimeStrategicGoals';
import { useRealTimeIndustryMetrics } from '@/hooks/useRealTimeIndustryMetrics';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const { goals } = useRealTimeStrategicGoals();
  const { metrics } = useRealTimeIndustryMetrics();
  
  const handleExportReport = () => {
    // Create a complete analytics report for download
    const reportData = {
      date: new Date().toISOString(),
      goals: goals,
      metrics: metrics,
      analysis: "Strategic Performance Analysis Report"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategic-analytics-report.json';
    a.click();
  };
  
  return (
    <PageLayout
      title="Strategic Analytics Dashboard"
      subtitle="Analyze and track your strategic goals, team performance, and industry positioning"
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="performance">
              <Target className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="h-4 w-4 mr-2" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="industry">
              <Building className="h-4 w-4 mr-2" />
              Industry
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <TabsContent value="performance" className="mt-0">
        <StrategicAnalytics />
      </TabsContent>
      
      <TabsContent value="collaboration" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Team Collaboration Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamCollaboration />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="industry" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Industry Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track market trends, competitor positioning, and industry benchmarks to inform your strategic decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center">
                <Building className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Competitor Analysis</span>
                <span className="text-sm text-muted-foreground mt-1">Compare your strategic positioning</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center">
                <Target className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Market Trends</span>
                <span className="text-sm text-muted-foreground mt-1">Track industry movements</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </PageLayout>
  );
};

export default Analytics;
