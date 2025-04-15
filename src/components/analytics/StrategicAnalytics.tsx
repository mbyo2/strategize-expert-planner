
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { format } from 'date-fns';

const StrategicAnalytics = () => {
  const [timeframe, setTimeframe] = useState('quarter');
  
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['strategic-goals'],
    queryFn: fetchStrategicGoals,
  });

  const quarterlyData = goals.reduce((acc: any[], goal) => {
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

  const progressData = quarterlyData.map(q => ({
    ...q,
    avgProgress: Math.round(q.progress / q.total),
  }));

  const handleExport = () => {
    // Implementation for report export
    const reportData = {
      title: 'Strategic Goals Analysis',
      date: new Date().toISOString(),
      data: progressData,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-analysis-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </div>
  );
};

export default StrategicAnalytics;
