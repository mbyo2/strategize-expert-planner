import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const OperationsModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: orders, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'operations',
    'order'
  );

  const mockOperationsData = {
    totalOrders: 1247,
    pendingOrders: 23,
    shippedOrders: 1180,
    completedOrders: 1200,
    inventory: {
      totalItems: 450,
      lowStock: 12,
      outOfStock: 3,
      value: 2850000
    },
    processes: [
      {
        id: '1',
        name: 'Order Processing',
        status: 'active',
        efficiency: 94,
        avgTime: '2.3 hours'
      },
      {
        id: '2',
        name: 'Quality Control',
        status: 'active',
        efficiency: 98,
        avgTime: '45 minutes'
      },
      {
        id: '3',
        name: 'Shipping',
        status: 'warning',
        efficiency: 87,
        avgTime: '4.2 hours'
      },
      {
        id: '4',
        name: 'Customer Service',
        status: 'active',
        efficiency: 92,
        avgTime: '12 minutes'
      }
    ],
    recentOrders: [
      { id: 'ORD-001', customer: 'Acme Corp', amount: 15000, status: 'shipped', date: '2024-01-15' },
      { id: 'ORD-002', customer: 'TechStart Inc', amount: 8500, status: 'processing', date: '2024-01-15' },
      { id: 'ORD-003', customer: 'Global Industries', amount: 22000, status: 'completed', date: '2024-01-14' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
            <div className="text-2xl font-bold">{mockOperationsData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +{mockOperationsData.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOperationsData.inventory.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="inline w-3 h-3 mr-1 text-orange-500" />
              {mockOperationsData.inventory.lowStock} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOperationsData.shippedOrders}</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
              94.6% fulfillment rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockOperationsData.inventory.value / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Total inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
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
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading orders...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockOperationsData.pendingOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Shipped</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockOperationsData.shippedOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockOperationsData.completedOrders}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Orders</h4>
                    {mockOperationsData.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{order.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.amount.toLocaleString()}</div>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockOperationsData.inventory.totalItems}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Low Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {mockOperationsData.inventory.lowStock}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Out of Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {mockOperationsData.inventory.outOfStock}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center p-8">
                <div className="text-muted-foreground mb-4">Detailed inventory management coming soon</div>
                <Button disabled>Manage Inventory</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Efficiency</CardTitle>
              <CardDescription>
                Monitor and optimize operational processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockOperationsData.processes.map((process) => (
                  <div key={process.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(process.status)}`} />
                        <h3 className="font-medium">{process.name}</h3>
                        <Badge variant="outline">{process.avgTime}</Badge>
                      </div>
                      <div className="text-sm font-medium">{process.efficiency}%</div>
                    </div>
                    <Progress value={process.efficiency} className="w-full" />
                  </div>
                ))}
              </div>
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
                <div className="text-muted-foreground mb-4">Advanced analytics coming soon</div>
                <Button disabled>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};