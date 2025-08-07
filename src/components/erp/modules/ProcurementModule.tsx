import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ProcurementModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: purchaseOrders, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'procurement',
    'purchase_order'
  );

  const mockProcurementData = {
    totalSpend: 1850000,
    monthlyReduction: 8.5,
    pendingOrders: 24,
    activeSuppliers: 156,
    avgDeliveryTime: 5.2,
    costSavings: 245000,
    purchaseOrders: [
      { id: 'PO-001', supplier: 'Tech Components Ltd', amount: 45000, status: 'pending', dueDate: '2024-01-20' },
      { id: 'PO-002', supplier: 'Global Materials Co', amount: 32000, status: 'approved', dueDate: '2024-01-18' },
      { id: 'PO-003', supplier: 'Industrial Supplies Inc', amount: 18500, status: 'delivered', dueDate: '2024-01-15' }
    ],
    suppliers: [
      { 
        id: '1', 
        name: 'Tech Components Ltd', 
        category: 'Electronics', 
        rating: 4.8, 
        orders: 45, 
        totalSpend: 450000,
        performance: 96
      },
      { 
        id: '2', 
        name: 'Global Materials Co', 
        category: 'Raw Materials', 
        rating: 4.6, 
        orders: 38, 
        totalSpend: 380000,
        performance: 94
      },
      { 
        id: '3', 
        name: 'Industrial Supplies Inc', 
        category: 'Equipment', 
        rating: 4.4, 
        orders: 32, 
        totalSpend: 290000,
        performance: 91
      }
    ],
    categories: [
      { name: 'Electronics', spend: 650000, suppliers: 45, avgPrice: '↓ 5.2%' },
      { name: 'Raw Materials', spend: 420000, suppliers: 32, avgPrice: '↑ 2.1%' },
      { name: 'Equipment', spend: 380000, suppliers: 28, avgPrice: '↓ 3.8%' },
      { name: 'Services', spend: 400000, suppliers: 51, avgPrice: '↓ 1.5%' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'approved': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
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
            <div className="text-2xl font-bold">
              ${(mockProcurementData.totalSpend / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1 text-green-500" />
              -{mockProcurementData.monthlyReduction}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProcurementData.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProcurementData.activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Avg delivery: {mockProcurementData.avgDeliveryTime} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockProcurementData.costSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage purchase orders and track their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading purchase orders...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockProcurementData.pendingOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Approved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">18</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Delivered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">156</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Orders</h4>
                    {mockProcurementData.purchaseOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{order.supplier}</p>
                            <div className="text-xs text-muted-foreground">Due: {order.dueDate}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.amount.toLocaleString()}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
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
              <CardDescription>
                Manage and evaluate your supplier relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockProcurementData.suppliers.map((supplier) => (
                  <div key={supplier.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                        <div className="text-sm text-yellow-600">
                          {getRatingStars(supplier.rating)} ({supplier.rating})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${supplier.totalSpend.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{supplier.orders} orders</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance Score</span>
                        <span>{supplier.performance}%</span>
                      </div>
                      <Progress value={supplier.performance} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Categories</CardTitle>
              <CardDescription>
                Analyze spending patterns across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProcurementData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.suppliers} suppliers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${category.spend.toLocaleString()}</div>
                      <div className={`text-sm ${category.avgPrice.includes('↓') ? 'text-green-600' : 'text-red-600'}`}>
                        {category.avgPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Analytics</CardTitle>
              <CardDescription>
                Analyze procurement performance and trends
              </CardDescription>
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