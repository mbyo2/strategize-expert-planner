import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Cog, 
  Play, 
  Pause,
  CheckCircle,
  TrendingUp,
  Zap,
  Wrench,
  Factory
} from 'lucide-react';
import { useManufacturingMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ManufacturingModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading } = useManufacturingMetrics(organizationId);

  const hasData = metrics.productionLines.length > 0 || metrics.workOrders.length > 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'stopped': return <Pause className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Cog className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Cog className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'stopped': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manufacturing Operations</h2>
        <Button>
          <Cog className="w-4 h-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.totalProduction.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Units produced
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.efficiency}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.efficiency >= 85 ? (
                    <>
                      <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                      Above target
                    </>
                  ) : 'Below target'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lines</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics.activeLines}/{metrics.totalLines || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.downtime}% downtime
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${metrics.qualityRate >= 95 ? 'text-green-600' : 'text-orange-600'}`}>
                  {metrics.qualityRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Completion rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production" className="space-y-4">
        <TabsList>
          <TabsTrigger value="production">Production Lines</TabsTrigger>
          <TabsTrigger value="orders">Work Orders</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Line Status</CardTitle>
              <CardDescription>
                Monitor real-time status of all production lines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : metrics.productionLines.length === 0 ? (
                <div className="text-center p-8">
                  <Factory className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No production lines found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add production lines to track manufacturing operations
                  </p>
                  <Button>Add Production Line</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.productionLines.map((line) => (
                    <div key={line.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(line.status)}
                          <div>
                            <h3 className="font-medium">{line.name}</h3>
                            <p className="text-sm text-muted-foreground">{line.product}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(line.status)}>
                            {line.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {line.output}/{line.target} units
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency</span>
                          <span>{line.efficiency}%</span>
                        </div>
                        <Progress value={line.efficiency} className="w-full" />
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm">
                          <span>Output Progress</span>
                          <span>{line.target > 0 ? Math.round((line.output / line.target) * 100) : 0}%</span>
                        </div>
                        <Progress value={line.target > 0 ? (line.output / line.target) * 100 : 0} className="w-full mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                Manage and track manufacturing work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : metrics.workOrders.length === 0 ? (
                <div className="text-center p-8">
                  <Cog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No work orders found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create work orders to track manufacturing jobs
                  </p>
                  <Button>Create Work Order</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">In Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.workOrders.filter(w => w.status === 'in_progress').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.workOrders.filter(w => w.status === 'completed').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Units</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.workOrders.reduce((sum, w) => sum + w.quantity, 0)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Active Work Orders</h4>
                    {metrics.workOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="font-medium">WO-{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.product}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority} priority
                            </Badge>
                            {order.dueDate && (
                              <div className="text-sm text-muted-foreground mt-1">
                                Due: {order.dueDate}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{order.completed}/{order.quantity} units ({order.quantity > 0 ? Math.round((order.completed / order.quantity) * 100) : 0}%)</span>
                          </div>
                          <Progress value={order.quantity > 0 ? (order.completed / order.quantity) * 100 : 0} className="w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Maintenance</CardTitle>
              <CardDescription>
                Track maintenance schedules and equipment health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Maintenance tracking coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Schedule preventive maintenance and track equipment status
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
