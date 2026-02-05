import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Building, AlertTriangle, Info, Zap, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useIndustryMetrics } from '@/hooks/useIndustryMetrics';

const Industry = () => {
  const { metrics, marketChanges, competitors, isLoading } = useIndustryMetrics();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (isLoading) {
    return (
      <PageLayout title="Industry Analysis" subtitle="Monitor market trends" icon={<Building className="h-6 w-6" />}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Industry Analysis" subtitle="Monitor market trends, competitors, and industry insights" icon={<Building className="h-6 w-6" />}>
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="changes">Market Changes</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Industry Metrics</h3>
                <p className="text-muted-foreground mb-4">Add industry metrics to track market performance</p>
                <Button>Add Metric</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {metrics.map((metric, index) => {
                const changePercentage = metric.previous_value ? ((metric.value - metric.previous_value) / metric.previous_value * 100).toFixed(1) : '0';
                const isPositive = metric.trend === 'up';
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                        <Badge variant="outline">{metric.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end space-x-4">
                        <div className="text-3xl font-bold">{metric.value}</div>
                        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm ml-1">{isPositive ? '+' : ''}{changePercentage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="changes" className="space-y-6">
          {marketChanges.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No market changes recorded</CardContent></Card>
          ) : (
            <div className="space-y-4">
              {marketChanges.map((change) => (
                <Card key={change.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{change.title}</CardTitle>
                      <Badge className={getImpactColor(change.impact)}>{change.impact} impact</Badge>
                    </div>
                    <CardDescription>{change.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card><CardContent className="py-12 text-center text-muted-foreground">No competitors added yet</CardContent></Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground mb-4">Advanced analytics coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Industry;
