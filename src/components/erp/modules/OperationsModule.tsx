import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Truck, CheckCircle, AlertCircle, BarChart3, Settings, Zap, Activity, Plus } from 'lucide-react';
import { useOperationsMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import ERPEntityDialog, { ENTITY_FIELDS } from '../ERPEntityDialog';

export const OperationsModule: React.FC = () => {
  const { organizationId: orgId } = useOrganization();
  const organizationId = orgId || '';
  const { metrics, isLoading: metricsLoading } = useOperationsMetrics(organizationId);
  const { entities: orders, isLoading: ordersLoading } = useERPEntities(organizationId, 'operations', 'order');
  const [dialogType, setDialogType] = useState<'order' | 'inventory_item' | null>(null);

  const isLoading = metricsLoading || ordersLoading;

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
      default: return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Operations Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogType('inventory_item')}><Plus className="w-4 h-4 mr-1" /> Inventory</Button>
          <Button size="sm" onClick={() => setDialogType('order')}><Plus className="w-4 h-4 mr-1" /> Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: metrics.totalOrders, icon: Package, sub: metrics.pendingOrders > 0 ? `${metrics.pendingOrders} pending` : 'All processed' },
          { label: 'Inventory Items', value: metrics.inventory.totalItems, icon: BarChart3, sub: metrics.inventory.lowStock > 0 ? `${metrics.inventory.lowStock} low stock` : 'Stock OK' },
          { label: 'Shipped', value: metrics.shippedOrders, icon: Truck, sub: metrics.totalOrders > 0 ? `${Math.round((metrics.shippedOrders/metrics.totalOrders)*100)}% fulfillment` : 'No orders' },
          { label: 'Inventory Value', value: formatCurrency(metrics.inventory.value), icon: Zap, sub: 'Total value' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                <>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Order Management</CardTitle><CardDescription>Track customer orders</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('order')}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : orders.length === 0 ? (
                <div className="text-center p-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No orders found</p>
                  <Button onClick={() => setDialogType('order')}>Create Order</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 10).map((order: any) => {
                    const data = order.entity_data || {};
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(data.status)}
                          <div>
                            <h3 className="font-medium">ORD-{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-muted-foreground">{data.customer || 'Unknown'}</p>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Inventory Overview</CardTitle><CardDescription>Stock levels and value</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('inventory_item')}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {metrics.inventory.totalItems === 0 ? (
                <div className="text-center p-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No inventory items</p>
                  <Button onClick={() => setDialogType('inventory_item')}>Add Inventory</Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Items</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.inventory.totalItems}</div></CardContent></Card>
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Low Stock</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">{metrics.inventory.lowStock}</div></CardContent></Card>
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Out of Stock</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{metrics.inventory.outOfStock}</div></CardContent></Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERPEntityDialog open={dialogType === 'order'} onOpenChange={o => !o && setDialogType(null)} moduleKey="operations" entityType="order" title="Create Order" fields={ENTITY_FIELDS.order} />
      <ERPEntityDialog open={dialogType === 'inventory_item'} onOpenChange={o => !o && setDialogType(null)} moduleKey="operations" entityType="inventory_item" title="Add Inventory Item" fields={ENTITY_FIELDS.inventory_item} />
    </div>
  );
};
