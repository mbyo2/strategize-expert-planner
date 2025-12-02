import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package, 
  Truck, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Zap,
  Activity
} from 'lucide-react';
import { useOperationsMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const OperationsModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading: metricsLoading } = useOperationsMetrics(organizationId);
  const { entities: orders, isLoading: ordersLoading } = useERPEntities(
    organizationId,
    'operations',
    'order'
  );

  const isLoading = metricsLoading || ordersLoading;
  const hasData = metrics.totalOrders > 0 || metrics.inventory.totalItems > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Operations Management</h2>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configure Processes
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.pendingOrders > 0 ? `+${metrics.pendingOrders} pending` : 'All processed'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.inventory.totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.inventory.lowStock > 0 && (
                    <>
                      <AlertCircle className="inline w-3 h-3 mr-1 text-orange-500" />
                      {metrics.inventory.lowStock} low stock
                    </>
                  )}
                  {metrics.inventory.lowStock === 0 && 'Stock levels OK'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.shippedOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalOrders > 0 ? (
                    <>
                      <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
                      {Math.round((metrics.shippedOrders / metrics.totalOrders) * 100)}% fulfillment
                    </>
                  ) : 'No orders yet'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.inventory.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total inventory value
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Track and manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center p-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No orders found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Orders will appear here when customers place them
                  </p>
                  <Button>Create Order</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Shipped</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.shippedOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.completedOrders}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Orders</h4>
                    {orders.slice(0, 5).map((order: any) => {
                      const data = order.entity_data || {};
                      return (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(data.status)}
                            <div>
                              <h3 className="font-medium">ORD-{order.id.slice(0, 8)}</h3>
                              <p className="text-sm text-muted-foreground">{data.customer || 'Unknown customer'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(data.amount || 0)}</div>
                            <Badge variant="outline">{data.status || 'pending'}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>
                Monitor stock levels and inventory value
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : metrics.inventory.totalItems === 0 ? (
                <div className="text-center p-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No inventory items found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add inventory items to track stock levels
                  </p>
                  <Button>Add Inventory</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.inventory.totalItems}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Low Stock</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          {metrics.inventory.lowStock}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Out of Stock</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {metrics.inventory.outOfStock}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-muted-foreground">
                      Total Inventory Value: <span className="font-bold text-foreground">{formatCurrency(metrics.inventory.value)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operations Analytics</CardTitle>
              <CardDescription>
                Analyze operational performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Advanced analytics coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Track order trends, fulfillment rates, and operational efficiency
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
