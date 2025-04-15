
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Line, ComposedChart 
} from 'recharts';
import { Download, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { format, parseISO, isAfter, isBefore, startOfQuarter, endOfQuarter, subQuarters } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const StrategicAnalytics = () => {
  const [timeframe, setTimeframe] = useState('quarter');
  const [compareMode, setCompareMode] = useState(false);
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('progress');
  
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['strategic-goals'],
    queryFn: fetchStrategicGoals,
  });

  // Process data by quarters
  const quarterlyData = useMemo(() => {
    return goals.reduce((acc, goal) => {
      const quarter = format(new Date(goal.created_at), 'yyyy-QQ');
      const existingQuarter = acc.find(d => d.period === quarter);
      
      if (existingQuarter) {
        existingQuarter.total++;
        existingQuarter.completed += goal.status === 'completed' ? 1 : 0;
        existingQuarter.progress += goal.progress;
      } else {
        acc.push({
          period: quarter,
          total: 1,
          completed: goal.status === 'completed' ? 1 : 0,
          progress: goal.progress,
        });
      }
      
      return acc;
    }, []);
  }, [goals]);

  // Calculate average progress and completion rate
  const progressData = useMemo(() => {
    const data = quarterlyData.map(q => ({
      ...q,
      avgProgress: Math.round(q.progress / q.total),
      completionRate: Math.round((q.completed / q.total) * 100) || 0,
    }));
    
    // Sort the data based on the period
    return sortDirection === 'desc' 
      ? [...data].sort((a, b) => b.period.localeCompare(a.period))
      : [...data].sort((a, b) => a.period.localeCompare(b.period));
  }, [quarterlyData, sortDirection]);
  
  // Prepare comparative data by getting current and previous quarters
  const comparativeData = useMemo(() => {
    const currentQuarter = startOfQuarter(new Date());
    const previousQuarter = subQuarters(currentQuarter, 1);
    
    const currentQuarterGoals = goals.filter(
      goal => isAfter(new Date(goal.created_at), previousQuarter) && 
              isBefore(new Date(goal.created_at), endOfQuarter(currentQuarter))
    );
    
    const previousQuarterGoals = goals.filter(
      goal => isAfter(new Date(goal.created_at), subQuarters(previousQuarter, 1)) && 
              isBefore(new Date(goal.created_at), previousQuarter)
    );
    
    const currentStats = {
      period: format(currentQuarter, 'yyyy-QQ'),
      label: 'Current Quarter',
      totalGoals: currentQuarterGoals.length,
      completedGoals: currentQuarterGoals.filter(g => g.status === 'completed').length,
      avgProgress: currentQuarterGoals.length ? 
        Math.round(currentQuarterGoals.reduce((sum, g) => sum + g.progress, 0) / currentQuarterGoals.length) : 0,
    };
    
    const previousStats = {
      period: format(previousQuarter, 'yyyy-QQ'),
      label: 'Previous Quarter', 
      totalGoals: previousQuarterGoals.length,
      completedGoals: previousQuarterGoals.filter(g => g.status === 'completed').length,
      avgProgress: previousQuarterGoals.length ? 
        Math.round(previousQuarterGoals.reduce((sum, g) => sum + g.progress, 0) / previousQuarterGoals.length) : 0,
    };
    
    return [previousStats, currentStats];
  }, [goals]);

  const handleExport = () => {
    // Implementation for report export
    const reportData = {
      title: 'Strategic Goals Analysis',
      date: new Date().toISOString(),
      timeframe,
      data: progressData,
      comparativeData: compareMode ? comparativeData : null,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-analysis-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    
    toast.success('Analysis report exported successfully');
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={toggleSortDirection}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setCompareMode(!compareMode)}
            className={compareMode ? "bg-muted" : ""}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {compareMode ? "Hide Comparison" : "Compare Quarters"}
          </Button>
        </div>
        
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="progress">Progress Over Time</TabsTrigger>
          <TabsTrigger value="completion">Completion Rate</TabsTrigger>
          {compareMode && <TabsTrigger value="comparison">Quarterly Comparison</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Goals Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgProgress" 
                        name="Average Progress" 
                        stroke="#8B5CF6" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total Goals" fill="#94A3B8" />
                      <Bar dataKey="avgProgress" name="Avg. Progress %" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completion">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Goals Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total Goals" fill="#94A3B8" />
                      <Bar dataKey="completed" name="Completed" fill="#22C55E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completion Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="completionRate" 
                        name="Completion Rate %" 
                        stroke="#22C55E"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {compareMode && (
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Quarter-over-Quarter Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={comparativeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalGoals" name="Total Goals" fill="#94A3B8" yAxisId="left" />
                      <Bar dataKey="completedGoals" name="Completed Goals" fill="#22C55E" yAxisId="left" />
                      <Line 
                        type="monotone" 
                        dataKey="avgProgress" 
                        name="Avg. Progress %" 
                        stroke="#8B5CF6" 
                        yAxisId="right"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {comparativeData.map((quarter) => (
                    <div key={quarter.period} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{quarter.label}</h4>
                        <Badge variant="outline">{quarter.period}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Goals:</span>
                          <span className="font-medium">{quarter.totalGoals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Completed Goals:</span>
                          <span className="font-medium">{quarter.completedGoals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Completion Rate:</span>
                          <span className="font-medium">
                            {quarter.totalGoals ? Math.round((quarter.completedGoals / quarter.totalGoals) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Average Progress:</span>
                          <span className="font-medium">{quarter.avgProgress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StrategicAnalytics;
