import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ERPModuleSelector from '@/components/erp/ERPModuleSelector';
import ERPStrategicIntegration from '@/components/erp/ERPStrategicIntegration';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationERP, useERPAnalytics } from '@/hooks/useERP';
import { Package, Link2, BarChart3, Settings, Building2 } from 'lucide-react';

const ERPPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('modules');
  
  // For now, use a placeholder organization ID
  // This should be updated when organization system is fully implemented
  const organizationId = 'placeholder-org-id';
  
  const { config, isLoading } = useOrganizationERP(organizationId);
  const { analytics } = useERPAnalytics(organizationId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <Package className="h-8 w-8 mx-auto animate-spin" />
            <p>Loading ERP configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeModules = config?.active_modules || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ERP Integration</h1>
            <p className="text-muted-foreground">
              Integrate Enterprise Resource Planning modules with your strategic planning
            </p>
          </div>
          
          {activeModules.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Active Modules</div>
              <div className="text-2xl font-bold">{activeModules.length}</div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Modules</p>
                    <p className="text-2xl font-bold">{activeModules.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ERP Entities</p>
                    <p className="text-2xl font-bold">{analytics.totalEntities}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Strategic Links</p>
                    <p className="text-2xl font-bold">{analytics.totalStrategicLinks}</p>
                  </div>
                  <Link2 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Integration Health</p>
                    <p className="text-2xl font-bold">
                      {analytics.totalEntities > 0 
                        ? Math.round((analytics.totalStrategicLinks / analytics.totalEntities) * 100)
                        : 0}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Alert for organization requirement */}
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> ERP integration requires organization setup. 
          This demo uses placeholder data. Full functionality will be available once organization 
          management is complete.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Strategic Integration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <ERPModuleSelector 
            organizationId={organizationId}
            onConfigurationChange={() => {
              // Refresh analytics when configuration changes
            }}
          />
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <ERPStrategicIntegration organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Usage Analytics</CardTitle>
                <CardDescription>
                  Track how different ERP modules are being utilized
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.entitiesByModule && Object.keys(analytics.entitiesByModule).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.entitiesByModule)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .map(([moduleKey, count]) => (
                        <div key={moduleKey} className="flex items-center justify-between">
                          <span className="font-medium">
                            {moduleKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ 
                                  width: `${(count as number / Math.max(...Object.values(analytics.entitiesByModule) as number[])) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-mono w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>No module usage data available yet</p>
                    <p className="text-sm">Start using ERP modules to see analytics</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategic Integration Overview</CardTitle>
                <CardDescription>
                  How ERP data connects to strategic planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.linksByType && Object.keys(analytics.linksByType).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analytics.linksByType).map(([linkType, count]) => (
                      <div key={linkType} className="text-center">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {linkType.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="h-12 w-12 mx-auto mb-4" />
                    <p>No strategic links created yet</p>
                    <p className="text-sm">Link ERP data to strategic goals and initiatives</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ERPPage;