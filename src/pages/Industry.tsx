import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Building, Zap, Loader2, Plus, Globe, Shield, Swords, BarChart3, Newspaper } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useIndustryMetrics } from '@/hooks/useIndustryMetrics';
import AddMetricDialog from '@/components/industry/AddMetricDialog';
import AddMarketChangeDialog from '@/components/industry/AddMarketChangeDialog';
import CompetitorDialog from '@/components/industry/CompetitorDialog';
import { format } from 'date-fns';

const Industry = () => {
  const { metrics, marketChanges, competitors, isLoading, refetch } = useIndustryMetrics();
  const [metricDialogOpen, setMetricDialogOpen] = useState(false);
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [competitorDialogOpen, setCompetitorDialogOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<any>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'medium': return 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400';
      case 'low': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up'
      ? <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      : <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  if (isLoading) {
    return (
      <PageLayout title="Industry Intelligence" subtitle="Monitor market trends" icon={<Building className="h-5 w-5" />}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  // Summary stats
  const totalMetrics = metrics.length;
  const highImpactChanges = marketChanges.filter(c => c.impact === 'high').length;
  const totalCompetitors = competitors.length;
  const avgMarketShare = competitors.length > 0 ? (competitors.reduce((s, c) => s + c.market_share, 0) / competitors.length).toFixed(1) : '0';

  return (
    <PageLayout title="Industry Intelligence" subtitle="Monitor market trends, competitors, and industry insights" icon={<Building className="h-5 w-5" />}>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMetrics}</p>
                <p className="text-xs text-muted-foreground">Tracked Metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Newspaper className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highImpactChanges}</p>
                <p className="text-xs text-muted-foreground">High Impact Changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Swords className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCompetitors}</p>
                <p className="text-xs text-muted-foreground">Competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgMarketShare}%</p>
                <p className="text-xs text-muted-foreground">Avg Competitor Share</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="changes">Market Changes ({marketChanges.length})</TabsTrigger>
          <TabsTrigger value="competitors">Competitors ({competitors.length})</TabsTrigger>
        </TabsList>

        {/* METRICS TAB */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setMetricDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Metric</Button>
          </div>
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Industry Metrics</h3>
                <p className="text-sm text-muted-foreground mb-4">Add industry metrics to track market performance</p>
                <Button onClick={() => setMetricDialogOpen(true)}>Add Metric</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => {
                const changePercentage = metric.previous_value
                  ? ((metric.value - metric.previous_value) / metric.previous_value * 100).toFixed(1)
                  : '0';
                const isPositive = metric.trend === 'up';
                return (
                  <Card key={metric.id} className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">{metric.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold tracking-tight">{metric.value.toLocaleString()}</span>
                        <span className={`inline-flex items-center gap-1 text-sm font-medium pb-0.5 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                          {getTrendIcon(metric.trend)}
                          {isPositive ? '+' : ''}{changePercentage}%
                        </span>
                      </div>
                      {metric.source && <p className="text-xs text-muted-foreground mt-2">Source: {metric.source}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* MARKET CHANGES TAB */}
        <TabsContent value="changes" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setChangeDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Record Change</Button>
          </div>
          {marketChanges.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                  <Newspaper className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Market Changes</h3>
                <p className="text-sm text-muted-foreground mb-4">Record market changes to track industry shifts</p>
                <Button onClick={() => setChangeDialogOpen(true)}>Record Change</Button>
              </CardContent>
            </Card>
          ) : (
            marketChanges.map((change) => (
              <Card key={change.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base">{change.title}</CardTitle>
                      <CardDescription>{change.description}</CardDescription>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-muted-foreground">{format(new Date(change.dateIdentified), 'MMM d, yyyy')}</span>
                        {change.source && <span className="text-xs text-muted-foreground">• {change.source}</span>}
                        {change.category && <Badge variant="secondary" className="text-xs">{change.category}</Badge>}
                      </div>
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

        {/* COMPETITORS TAB */}
        <TabsContent value="competitors" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingCompetitor(null); setCompetitorDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Add Competitor
            </Button>
          </div>
          {competitors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                  <Swords className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Competitors Tracked</h3>
                <p className="text-sm text-muted-foreground mb-4">Add competitors to monitor the competitive landscape</p>
                <Button onClick={() => { setEditingCompetitor(null); setCompetitorDialogOpen(true); }}>Add Competitor</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {competitors.map((comp) => (
                <Card key={comp.id} className="transition-shadow hover:shadow-md cursor-pointer" onClick={() => { setEditingCompetitor(comp); setCompetitorDialogOpen(true); }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {comp.name}
                          {comp.website && <Globe className="h-3.5 w-3.5 text-muted-foreground" />}
                        </CardTitle>
                        {comp.description && <CardDescription className="mt-1">{comp.description}</CardDescription>}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{comp.market_share}%</span>
                        <p className="text-xs text-muted-foreground">Market Share</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {comp.strengths.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Shield className="h-3 w-3" /> Strengths</p>
                        <div className="flex flex-wrap gap-1.5">
                          {comp.strengths.map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}
                        </div>
                      </div>
                    )}
                    {comp.threats.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Swords className="h-3 w-3" /> Threats</p>
                        <div className="flex flex-wrap gap-1.5">
                          {comp.threats.map((t, i) => <Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive">{t}</Badge>)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddMetricDialog open={metricDialogOpen} onOpenChange={setMetricDialogOpen} onSuccess={() => refetch()} />
      <AddMarketChangeDialog open={changeDialogOpen} onOpenChange={setChangeDialogOpen} onSuccess={() => refetch()} />
      <CompetitorDialog
        open={competitorDialogOpen}
        onOpenChange={setCompetitorDialogOpen}
        onSuccess={() => refetch()}
        competitor={editingCompetitor}
      />
    </PageLayout>
  );
};

export default Industry;
