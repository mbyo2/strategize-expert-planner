import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useERPAnalytics, useOrganizationERP } from '@/hooks/useERP';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Link2, Package, TrendingUp, Settings, ExternalLink } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useOrganization } from '@/contexts/OrganizationContext';

const ERPIntegrationWidget: React.FC<WidgetProps> = (props) => {
  const { session } = useSimpleAuth();
  const { organizationId } = useOrganization();
  const { analytics, isLoading } = useERPAnalytics(organizationId || '');
  const { config } = useOrganizationERP(organizationId || '');

  if (isLoading) {
    return (
      <WidgetWrapper {...props}>
        <div className="flex justify-center items-center h-32">
          Loading ERP integration...
        </div>
      </WidgetWrapper>
    );
  }

  if (!organizationId) {
    return (
      <WidgetWrapper {...props}>
        <div className="text-center space-y-4">
          <Package className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <h4 className="font-medium">Organization Required</h4>
            <p className="text-sm text-muted-foreground">
              Join an organization to access ERP integration
            </p>
          </div>
        </div>
      </WidgetWrapper>
    );
  }

  const activeModules = config?.active_modules || [];
  const totalEntities = analytics?.totalEntities || 0;
  const totalLinks = analytics?.totalStrategicLinks || 0;

  return (
    <WidgetWrapper {...props}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ERP Integration</h3>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/organization">
              <Settings className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Active Modules */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Modules</span>
            <Badge variant="secondary">{activeModules.length}</Badge>
          </div>
          
          {activeModules.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Package className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">No ERP modules activated</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href="/organization">
                  Configure Modules
                </a>
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {activeModules.slice(0, 3).map(moduleKey => (
                <Badge key={moduleKey} variant="outline" className="text-xs">
                  {moduleKey.replace('_', ' ')}
                </Badge>
              ))}
              {activeModules.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{activeModules.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
        {activeModules.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">ERP Entities</span>
                </div>
                <div className="text-lg font-semibold">{totalEntities}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">Strategic Links</span>
                </div>
                <div className="text-lg font-semibold">{totalLinks}</div>
              </div>
            </div>

            {/* Integration Health */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Integration Health</span>
                <span className="text-xs text-muted-foreground">
                  {totalLinks > 0 ? Math.round((totalLinks / Math.max(totalEntities, 1)) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={totalLinks > 0 ? Math.round((totalLinks / Math.max(totalEntities, 1)) * 100) : 0} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Strategic planning integration coverage
              </p>
            </div>

            {/* Top Modules by Usage */}
            {analytics?.entitiesByModule && Object.keys(analytics.entitiesByModule).length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Most Used Modules</span>
                <div className="space-y-2">
                  {Object.entries(analytics.entitiesByModule)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([moduleKey, count]) => (
                      <div key={moduleKey} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">
                          {moduleKey.replace('_', ' ')}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Button */}
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href="/organization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Manage ERP Integration
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </WidgetWrapper>
  );
};

export default ERPIntegrationWidget;