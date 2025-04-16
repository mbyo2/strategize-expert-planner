
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import StrategicAnalytics from '@/components/analytics/StrategicAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Users, Target, Building, Smartphone, Laptop } from 'lucide-react';
import TeamCollaboration from '@/components/TeamManagement/TeamCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealTimeStrategicGoals } from '@/hooks/useRealTimeStrategicGoals';
import { useRealTimeIndustryMetrics } from '@/hooks/useRealTimeIndustryMetrics';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cacheAnalyticsData, getCachedAnalyticsData, isOnline } from '@/services/offlineService';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const { goals } = useRealTimeStrategicGoals();
  const { metrics } = useRealTimeIndustryMetrics();
  const isMobile = useIsMobile();
  
  // Track if data is loaded from offline cache
  const [isOfflineData, setIsOfflineData] = useState(false);
  
  // Optimize data for mobile
  useEffect(() => {
    if (!isOnline()) {
      const cachedData = getCachedAnalyticsData();
      if (cachedData) {
        setIsOfflineData(true);
        toast.info('Viewing cached analytics data while offline');
      } else {
        toast.warning('No cached analytics data available for offline use');
      }
    } else if (goals && metrics) {
      // Cache data for offline use when online
      cacheAnalyticsData({ goals, metrics });
      setIsOfflineData(false);
    }
  }, [goals, metrics]);
  
  const handleExportReport = () => {
    // Handle offline state
    if (!isOnline()) {
      toast.error('Export is not available while offline');
      return;
    }
    
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
    
    toast.success('Analytics report exported successfully');
  };
  
  return (
    <PageLayout
      title="Strategic Analytics Dashboard"
      subtitle="Analyze and track your strategic goals, team performance, and industry positioning"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className={isMobile ? "w-full overflow-x-auto pb-1" : "w-full"}
        >
          <TabsList className={`grid w-full ${isMobile ? "grid-cols-3" : "max-w-md grid-cols-3"}`}>
            <TabsTrigger value="performance" className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              {!isMobile && "Performance"}
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {!isMobile && "Collaboration"}
            </TabsTrigger>
            <TabsTrigger value="industry" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              {!isMobile && "Industry"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          onClick={handleExportReport}
          variant={isMobile ? "outline" : "default"}
          size={isMobile ? "sm" : "default"}
          className={isMobile ? "self-end" : ""}
          disabled={!isOnline()}
        >
          <Download className="mr-2 h-4 w-4" />
          {!isMobile && "Export Report"}
        </Button>
      </div>
      
      {isOfflineData && (
        <div className="mb-4 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-amber-700 dark:text-amber-300 text-sm">
          You're viewing cached data in offline mode. Some visualizations may be limited.
        </div>
      )}
      
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
            
            <div className="flex items-center justify-center mb-6">
              <Button variant="outline" className="mr-4">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile View
              </Button>
              <Button variant="outline">
                <Laptop className="h-4 w-4 mr-2" />
                Desktop View
              </Button>
            </div>
            
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
