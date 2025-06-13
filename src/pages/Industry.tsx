
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Building, AlertTriangle, Info, Zap } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Industry = () => {
  const [metrics] = useState([
    {
      name: 'Market Growth Rate',
      value: 12.5,
      previousValue: 10.2,
      trend: 'up',
      category: 'Growth',
      source: 'Industry Report 2024'
    },
    {
      name: 'Customer Satisfaction Index',
      value: 8.4,
      previousValue: 8.1,
      trend: 'up',
      category: 'Customer',
      source: 'Customer Survey'
    },
    {
      name: 'Digital Adoption Rate',
      value: 78,
      previousValue: 82,
      trend: 'down',
      category: 'Technology',
      source: 'Tech Analytics'
    },
    {
      name: 'Market Share',
      value: 23.7,
      previousValue: 22.1,
      trend: 'up',
      category: 'Competitive',
      source: 'Market Research'
    }
  ]);

  const [marketChanges] = useState([
    {
      id: 1,
      title: 'New Regulatory Requirements',
      description: 'Updated compliance standards effective Q3 2024',
      impact: 'high',
      category: 'Regulatory',
      dateIdentified: '2024-05-15',
      source: 'Regulatory News'
    },
    {
      id: 2,
      title: 'Emerging Technology Trend',
      description: 'AI adoption accelerating across industry sectors',
      impact: 'medium',
      category: 'Technology',
      dateIdentified: '2024-05-10',
      source: 'Tech Report'
    },
    {
      id: 3,
      title: 'Consumer Behavior Shift',
      description: 'Increased preference for sustainable products',
      impact: 'medium',
      category: 'Consumer',
      dateIdentified: '2024-05-08',
      source: 'Consumer Survey'
    }
  ]);

  const [competitors] = useState([
    {
      name: 'TechCorp Industries',
      marketShare: 28.5,
      changePercentage: 12,
      strengths: ['Innovation', 'Brand Recognition'],
      threats: ['Pricing Pressure', 'Market Saturation']
    },
    {
      name: 'Global Solutions Inc',
      marketShare: 19.3,
      changePercentage: -3,
      strengths: ['Customer Service', 'Global Reach'],
      threats: ['Technology Gap', 'Cost Structure']
    },
    {
      name: 'Future Dynamics',
      marketShare: 15.8,
      changePercentage: 8,
      strengths: ['Agility', 'Digital Focus'],
      threats: ['Limited Resources', 'Scale Challenges']
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <PageLayout 
      title="Industry Analysis"
      subtitle="Monitor market trends, competitors, and industry insights"
      icon={<Building className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="changes">Market Changes</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {metrics.map((metric, index) => {
                const changePercentage = ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
                const isPositive = metric.trend === 'up';
                
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{metric.name}</CardTitle>
                          <CardDescription>{metric.source}</CardDescription>
                        </div>
                        <Badge variant="outline">{metric.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-end space-x-4">
                        <div className="text-3xl font-bold">{metric.value}{metric.name.includes('Rate') || metric.name.includes('Share') ? '%' : ''}</div>
                        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-medium">
                            {isPositive ? '+' : ''}{changePercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Previous: {metric.previousValue}{metric.name.includes('Rate') || metric.name.includes('Share') ? '%' : ''}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Industry Overview</CardTitle>
                <CardDescription>Key insights and trends summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Growth Opportunities</h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Market expansion and digital transformation driving growth
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Market Challenges</h4>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Regulatory changes and competitive pressure require attention
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Strategic Focus</h4>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Customer satisfaction and technology adoption key priorities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Market Changes</h2>
                <p className="text-muted-foreground">Recent market developments and their impact</p>
              </div>
              <Button variant="outline">Add Change</Button>
            </div>

            <div className="space-y-4">
              {marketChanges.map((change) => (
                <Card key={change.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{change.title}</CardTitle>
                        <CardDescription>{change.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getImpactColor(change.impact)}>
                          {change.impact} impact
                        </Badge>
                        <Badge variant="outline">{change.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Identified: {new Date(change.dateIdentified).toLocaleDateString()}</span>
                      <span>Source: {change.source}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="ghost" size="sm">Add to Watch List</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold">Competitive Analysis</h2>
              <p className="text-muted-foreground">Monitor key competitors and market positioning</p>
            </div>

            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Market Share: {competitor.marketShare}%</span>
                          <div className={`flex items-center gap-1 ${competitor.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.changePercentage >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span className="text-xs">
                              {competitor.changePercentage >= 0 ? '+' : ''}{competitor.changePercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Strengths</h5>
                        <div className="space-y-1">
                          {competitor.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-green-600 border-green-600 mr-1">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Threats</h5>
                        <div className="space-y-1">
                          {competitor.threats.map((threat, idx) => (
                            <Badge key={idx} variant="outline" className="text-red-600 border-red-600 mr-1">
                              {threat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">Detailed Analysis</Button>
                      <Button variant="ghost" size="sm">Compare</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground mb-4">
                Advanced analytics and predictive insights coming soon
              </p>
              <Button variant="outline">Request Beta Access</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Industry;
