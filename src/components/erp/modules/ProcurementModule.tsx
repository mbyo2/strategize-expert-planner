import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShoppingCart, 
  Plus, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  Users,
  FileText
} from 'lucide-react';
import { useProcurementMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ProcurementModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading } = useProcurementMetrics(organizationId);

  const hasData = metrics.purchaseOrders.length > 0 || metrics.suppliers.length > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'approved': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Procurement Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalSpend)}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalSpend > 0 ? (
                    <><TrendingDown className="inline w-3 h-3 mr-1 text-green-500" />From purchase orders</>
                  ) : 'No spend recorded'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <>
                <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <>
                <div className="text-2xl font-bold">{metrics.activeSuppliers}</div>
                <p className="text-xs text-muted-foreground">
                  Avg delivery: {metrics.avgDeliveryTime} days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.costSavings)}
                </div>
                <p className="text-xs text-muted-foreground">This year</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Manage purchase orders and track their status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : metrics.purchaseOrders.length === 0 ? (
                <div className="text-center p-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No purchase orders found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first purchase order to start tracking procurement
                  </p>
                  <Button>Create Purchase Order</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Approved</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.purchaseOrders.filter(o => o.status === 'approved').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Delivered</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.purchaseOrders.filter(o => o.status === 'delivered').length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Orders</h4>
                    {metrics.purchaseOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-medium">PO-{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-muted-foreground">{order.supplier}</p>
                            {order.date && <div className="text-xs text-muted-foreground">Date: {order.date}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(order.amount)}</div>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>Manage and evaluate your supplier relationships</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : metrics.suppliers.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No suppliers found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add suppliers to manage vendor relationships
                  </p>
                  <Button>Add Supplier</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.suppliers.map((supplier) => (
                    <div key={supplier.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{supplier.name}</h3>
                          <div className="text-sm text-yellow-600">
                            {'★'.repeat(Math.floor(supplier.rating))}{'☆'.repeat(5 - Math.floor(supplier.rating))} ({supplier.rating})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(supplier.spend)}</div>
                          <div className="text-sm text-muted-foreground">Total spend</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>On-Time Rate</span>
                            <span>{supplier.onTime}%</span>
                          </div>
                          <Progress value={supplier.onTime} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Quality Score</span>
                            <span>{supplier.quality}%</span>
                          </div>
                          <Progress value={supplier.quality} className="w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Analytics</CardTitle>
              <CardDescription>Analyze procurement performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <DollarSign className="w-8 h-8 mb-2" />
                  <span>Spend Analysis</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Users className="w-8 h-8 mb-2" />
                  <span>Supplier Performance</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <TrendingDown className="w-8 h-8 mb-2" />
                  <span>Cost Savings Report</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <FileText className="w-8 h-8 mb-2" />
                  <span>Compliance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};