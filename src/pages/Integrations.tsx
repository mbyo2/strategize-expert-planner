
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Puzzle, CheckCircle, Clock, AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Integrations = () => {
  const [integrations] = useState([
    {
      id: 1,
      name: 'Slack',
      description: 'Get notifications and updates in your Slack channels',
      category: 'Communication',
      status: 'connected',
      icon: '💬',
      features: ['Team notifications', 'Goal updates', 'Strategy alerts'],
      setupRequired: false
    },
    {
      id: 2,
      name: 'Google Calendar',
      description: 'Sync strategy reviews and meetings with your calendar',
      category: 'Productivity',
      status: 'available',
      icon: '📅',
      features: ['Meeting sync', 'Review scheduling', 'Deadline reminders'],
      setupRequired: true
    },
    {
      id: 3,
      name: 'Microsoft Teams',
      description: 'Collaborate on strategic initiatives within Teams',
      category: 'Communication',
      status: 'connected',
      icon: '🤝',
      features: ['Channel notifications', 'Meeting integration', 'File sharing'],
      setupRequired: false
    },
    {
      id: 4,
      name: 'Salesforce',
      description: 'Import customer and market data for strategic analysis',
      category: 'CRM',
      status: 'available',
      icon: '⚡',
      features: ['Data import', 'Customer insights', 'Revenue tracking'],
      setupRequired: true
    },
    {
      id: 5,
      name: 'Jira',
      description: 'Track initiative progress and project milestones',
      category: 'Project Management',
      status: 'in-progress',
      icon: '🎯',
      features: ['Project tracking', 'Milestone sync', 'Progress updates'],
      setupRequired: true
    },
    {
      id: 6,
      name: 'Tableau',
      description: 'Create advanced visualizations of strategic data',
      category: 'Analytics',
      status: 'available',
      icon: '📊',
      features: ['Data visualization', 'Custom dashboards', 'Report generation'],
      setupRequired: true
    }
  ]);

  const [activeIntegrations, setActiveIntegrations] = useState({
    1: true,
    3: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'available':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryIntegrations = (category: string) => {
    return integrations.filter(integration => integration.category === category);
  };

  const categories = ['Communication', 'Productivity', 'CRM', 'Project Management', 'Analytics'];

  const handleToggleIntegration = (integrationId: number) => {
    setActiveIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <PageLayout 
      title="Integrations"
      subtitle="Connect with your favorite tools and services"
      icon={<Puzzle className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Integration Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">Available integrations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {integrations.filter(i => i.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">Being configured</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {integrations.filter(i => i.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Ready to connect</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(integration.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(integration.status)}
                            {integration.status}
                          </div>
                        </Badge>
                        <Badge variant="outline">{integration.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Features:</h5>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {integration.status === 'connected' ? (
                        <>
                          <div className="flex items-center space-x-2 flex-1">
                            <Switch
                              checked={activeIntegrations[integration.id] || false}
                              onCheckedChange={() => handleToggleIntegration(integration.id)}
                            />
                            <span className="text-sm">Active</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </>
                      ) : integration.status === 'in-progress' ? (
                        <Button variant="outline" size="sm" className="w-full">
                          <Clock className="h-4 w-4 mr-1" />
                          Complete Setup
                        </Button>
                      ) : (
                        <Button size="sm" className="w-full">
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category.toLowerCase()} value={category.toLowerCase()} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getCategoryIntegrations(category).map((integration) => (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{integration.icon}</div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(integration.status)}
                            {integration.status}
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Features:</h5>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        {integration.status === 'connected' ? (
                          <>
                            <div className="flex items-center space-x-2 flex-1">
                              <Switch
                                checked={activeIntegrations[integration.id] || false}
                                onCheckedChange={() => handleToggleIntegration(integration.id)}
                              />
                              <span className="text-sm">Active</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          </>
                        ) : integration.status === 'in-progress' ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Clock className="h-4 w-4 mr-1" />
                            Complete Setup
                          </Button>
                        ) : (
                          <Button size="sm" className="w-full">
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Integration Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help with Integrations?</CardTitle>
            <CardDescription>
              Get assistance setting up your integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                <ExternalLink className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-sm text-muted-foreground">Setup guides and tutorials</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">API Access</div>
                  <div className="text-sm text-muted-foreground">Developer tools and API keys</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                <AlertTriangle className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Support</div>
                  <div className="text-sm text-muted-foreground">Get help from our team</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Integrations;
