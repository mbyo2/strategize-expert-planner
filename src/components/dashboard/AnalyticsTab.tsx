
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsTabProps {
  goalAnalytics: any;
  initiativeAnalytics: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ goalAnalytics, initiativeAnalytics }) => {
  // Mock data for demonstration
  const goalStatusData = [
    { name: 'Completed', value: goalAnalytics?.completedGoals || 5, color: '#22c55e' },
    { name: 'In Progress', value: goalAnalytics?.inProgressGoals || 8, color: '#3b82f6' },
    { name: 'Planned', value: goalAnalytics?.plannedGoals || 3, color: '#eab308' },
    { name: 'On Hold', value: goalAnalytics?.onHoldGoals || 2, color: '#ef4444' },
  ];

  const initiativeProgressData = [
    { name: 'Q1', goals: 12, initiatives: 8 },
    { name: 'Q2', goals: 15, initiatives: 12 },
    { name: 'Q3', goals: 18, initiatives: 15 },
    { name: 'Q4', goals: 20, initiatives: 18 },
  ];

  const monthlyTrendsData = [
    { month: 'Jan', completion: 65 },
    { month: 'Feb', completion: 72 },
    { month: 'Mar', completion: 68 },
    { month: 'Apr', completion: 75 },
    { month: 'May', completion: 82 },
    { month: 'Jun', completion: 78 },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalAnalytics?.totalGoals || 18}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initiativeAnalytics?.activeInitiatives || 13}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(goalAnalytics?.averageProgress || 78)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(initiativeAnalytics?.budgetUtilization || 67)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quarterly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={initiativeProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goals" fill="#3b82f6" name="Goals" />
                <Bar dataKey="initiatives" fill="#22c55e" name="Initiatives" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Completion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="completion" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
