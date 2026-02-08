import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Minus, Search, Filter, RefreshCw } from "lucide-react";
import { useIndustryMetrics } from '@/hooks/useIndustryMetrics';

export default function EnhancedIndustryMetrics() {
  const { metrics, isLoading, error, refetch } = useIndustryMetrics();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('30d');

  const categories = ['all', ...new Set(metrics.map(m => m.category))];

  const filteredMetrics = metrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         metric.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getChangePercentage = (metric: typeof metrics[0]) => {
    if (!metric.previous_value) return 0;
    return ((metric.value - metric.previous_value) / metric.previous_value) * 100;
  };

  const getTrendIcon = (trend?: string, changePercentage?: number) => {
    if (!trend || changePercentage === undefined) {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendBadge = (trend?: string, changePercentage?: number) => {
    if (!trend || changePercentage === undefined) {
      return <Badge variant="secondary">No Change</Badge>;
    }
    const absChange = Math.abs(changePercentage);
    switch (trend) {
      case 'up':
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">+{absChange.toFixed(1)}%</Badge>;
      case 'down':
        return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">-{absChange.toFixed(1)}%</Badge>;
      default:
        return <Badge variant="secondary">Stable</Badge>;
    }
  };

  const formatValue = (value: number, category: string) => {
    if (category.toLowerCase().includes('price') || category.toLowerCase().includes('cost')) {
      return `$${value.toLocaleString()}`;
    }
    if (category.toLowerCase().includes('rate') || category.toLowerCase().includes('percentage')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Industry Metrics</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Industry Metrics</h2>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">{error instanceof Error ? error.message : 'Failed to load metrics'}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Industry Metrics</h2>
          <p className="text-muted-foreground">Real-time industry data and market indicators</p>
        </div>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input placeholder="Search metrics..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
            <SelectItem value="1y">1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMetrics.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No Metrics Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No industry metrics available at this time.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMetrics.map((metric, index) => {
            const changePct = getChangePercentage(metric);
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold mb-1">{metric.name}</CardTitle>
                      <CardDescription className="text-sm">{metric.category}</CardDescription>
                    </div>
                    {getTrendIcon(metric.trend, changePct)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold">{formatValue(metric.value, metric.category)}</span>
                      {getTrendBadge(metric.trend, changePct)}
                    </div>
                    {metric.previous_value && (
                      <div className="text-sm text-muted-foreground">
                        Previous: {formatValue(metric.previous_value, metric.category)}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {metric.source && <span>Source: {metric.source}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Total Metrics</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{filteredMetrics.filter(m => m.trend === 'up').length}</div>
                <div className="text-sm text-muted-foreground">Trending Up</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{filteredMetrics.filter(m => m.trend === 'down').length}</div>
                <div className="text-sm text-muted-foreground">Trending Down</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{filteredMetrics.filter(m => !m.trend).length}</div>
                <div className="text-sm text-muted-foreground">No Data</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
