import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, PieChart, Activity, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const Analytics = () => {
  const { analytics, isLoading } = useAnalyticsData();

  if (isLoading || !analytics) {
    return (
      <PageLayout 
        title="Analytics & Insights"
        subtitle="Track performance and gain strategic insights"
        icon={<BarChart3 className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  const COLORS = analytics.categoryData.map(c => c.color);

  return (
    <PageLayout 
      title="Analytics & Insights"
      subtitle="Track performance and gain strategic insights"
      icon={<BarChart3 className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Last 30 Days</Button>
            <Button variant="ghost" size="sm">Last Quarter</Button>
            <Button variant="ghost" size="sm">Last Year</Button>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.goalCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Based on completed goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.teamPerformance.toFixed(1)}/10</div>
              <p className="text-xs text-muted-foreground">
                Average goal progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Initiatives</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeInitiatives}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.completedInitiatives} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategy Alignment</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.strategyAlignment}%</div>
              <p className="text-xs text-muted-foreground">
                Goals with progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress vs Target</CardTitle>
                <CardDescription>
                  Quarterly performance comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.goalProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Monthly performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Goals by Category</CardTitle>
                  <CardDescription>
                    Distribution of strategic goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Tooltip />
                      <Pie
                        data={analytics.categoryData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {analytics.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>
                    Performance breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{category.value}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>
                    AI-powered strategic insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.goalCompletionRate >= 50 ? (
                    <div className="border-l-4 border-green-500 p-4 bg-green-50 dark:bg-green-900/20">
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Strong Performance</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Goal completion rate is at {analytics.goalCompletionRate}%, indicating healthy progress
                      </p>
                    </div>
                  ) : (
                    <div className="border-l-4 border-yellow-500 p-4 bg-yellow-50 dark:bg-yellow-900/20">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Attention Needed</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Goal completion rate is at {analytics.goalCompletionRate}%, consider reviewing priorities
                      </p>
                    </div>
                  )}
                  
                  <div className="border-l-4 border-blue-500 p-4 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Active Initiatives</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {analytics.activeInitiatives} initiatives currently in progress
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    Strategic recommendations based on data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium">Review Goal Progress</h5>
                    <p className="text-sm text-muted-foreground">
                      Ensure all active goals have recent progress updates
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium">Balance Categories</h5>
                    <p className="text-sm text-muted-foreground">
                      Consider distributing goals across different strategic areas
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium">Track Initiatives</h5>
                    <p className="text-sm text-muted-foreground">
                      Keep initiative progress aligned with strategic goals
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Analytics;
