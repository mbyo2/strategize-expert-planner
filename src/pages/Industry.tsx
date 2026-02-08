import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Building, Zap, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useIndustryMetrics } from '@/hooks/useIndustryMetrics';

const Industry = () => {
  const { metrics, marketChanges, competitors, isLoading } = useIndustryMetrics();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up'
      ? <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
  };

  if (isLoading) {
    return (
      <PageLayout title="Industry Analysis" subtitle="Monitor market trends" icon={<Building className="h-5 w-5" />}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Industry Analysis" subtitle="Monitor market trends, competitors, and industry insights" icon={<Building className="h-5 w-5" />}>
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="changes">Market Changes</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Industry Metrics</h3>
                <p className="text-sm text-muted-foreground mb-4">Add industry metrics to track market performance</p>
                <Button>Add Metric</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {metrics.map((metric, index) => {
                const changePercentage = metric.previous_value
                  ? ((metric.value - metric.previous_value) / metric.previous_value * 100).toFixed(1)
                  : '0';
                const isPositive = metric.trend === 'up';
                return (
                  <Card key={index} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">{metric.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold tracking-tight">{metric.value}</span>
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {getTrendIcon(metric.trend)}
                          {isPositive ? '+' : ''}{changePercentage}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          {marketChanges.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No market changes recorded</p>
              </CardContent>
            </Card>
          ) : (
            marketChanges.map((change) => (
              <Card key={change.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{change.title}</CardTitle>
                      <CardDescription>{change.description}</CardDescription>
                    </div>
                    <Badge className={getImpactColor(change.impact)} variant="outline">
                      {change.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No competitors added yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">Advanced analytics coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Industry;
