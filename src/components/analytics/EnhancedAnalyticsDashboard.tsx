
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Target, Users, Calendar } from 'lucide-react';
import StrategicAnalytics from './StrategicAnalytics';
import { useQuery } from '@tanstack/react-query';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { fetchPlanningInitiatives } from '@/services/planningInitiativesService';
import { toast } from 'sonner';

const EnhancedAnalyticsDashboard = () => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const { data: goals = [] } = useQuery({
    queryKey: ['strategic-goals'],
    queryFn: fetchStrategicGoals,
  });

  const { data: initiatives = [] } = useQuery({
    queryKey: ['planning-initiatives'],
    queryFn: fetchPlanningInitiatives,
  });

  // Calculate summary metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.length ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;
  const totalInitiatives = initiatives.length;
  const completedInitiatives = initiatives.filter(i => i.status === 'completed').length;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const analyticsData = {
        summary: {
          totalGoals,
          completedGoals,
          avgProgress,
          totalInitiatives,
          completedInitiatives
        },
        goals,
        initiatives,
        timestamp: new Date().toISOString()
      };

      let blob: Blob;
      let filename: string;

      switch (exportFormat) {
        case 'pdf':
          // In a real implementation, you'd convert to PDF
          blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
          filename = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'excel':
          // Simple CSV export for Excel compatibility
          const csvData = goals.map(goal => `${goal.name},${goal.status},${goal.progress}`).join('\n');
          blob = new Blob(['Name,Status,Progress\n' + csvData], { type: 'text/csv' });
          filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'csv':
          const csvGoals = goals.map(goal => `${goal.name},${goal.status},${goal.progress}`).join('\n');
          blob = new Blob(['Name,Status,Progress\n' + csvGoals], { type: 'text/csv' });
          filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
          filename = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Analytics report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export analytics report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your strategic performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals} completed ({totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Across all active goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Initiatives</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInitiatives}</div>
            <p className="text-xs text-muted-foreground">
              {completedInitiatives} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Goal completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StrategicAnalytics />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed trend analysis coming soon. This will include predictive analytics,
                seasonal patterns, and performance forecasting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance metrics dashboard will include team efficiency,
                goal achievement rates, and strategic alignment scores.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
