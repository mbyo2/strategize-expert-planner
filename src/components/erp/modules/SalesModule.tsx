import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  ShoppingCart,
  Star
} from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const SalesModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: customers, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'sales',
    'customer'
  );

  const mockSalesData = {
    totalRevenue: 2450000,
    monthlyGrowth: 15.2,
    activeCustomers: 342,
    newLeads: 48,
    conversionRate: 23.5,
    salesPipeline: [
      { stage: 'Prospecting', count: 23, value: 145000 },
      { stage: 'Qualification', count: 18, value: 220000 },
      { stage: 'Proposal', count: 12, value: 380000 },
      { stage: 'Negotiation', count: 8, value: 295000 },
      { stage: 'Closing', count: 5, value: 180000 }
    ],
    topCustomers: [
      { id: '1', name: 'Global Tech Corp', revenue: 450000, status: 'active', contact: 'john.doe@globaltech.com' },
      { id: '2', name: 'Innovation Labs', revenue: 380000, status: 'active', contact: 'sarah.smith@innolabs.com' },
      { id: '3', name: 'Future Solutions', revenue: 290000, status: 'prospect', contact: 'mike.johnson@futuresol.com' }
    ],
    recentActivity: [
      { type: 'call', customer: 'Global Tech Corp', description: 'Quarterly review call', date: '2024-01-15', agent: 'Alice Johnson' },
      { type: 'meeting', customer: 'Innovation Labs', description: 'Product demo scheduled', date: '2024-01-14', agent: 'Bob Smith' },
      { type: 'email', customer: 'Future Solutions', description: 'Proposal sent', date: '2024-01-13', agent: 'Carol Davis' }
    ]
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4 text-blue-500" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'email': return <Mail className="w-4 h-4 text-orange-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'prospect': return 'bg-blue-100 text-blue-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales & CRM</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockSalesData.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +{mockSalesData.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSalesData.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Customer base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSalesData.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSalesData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockSalesData.salesPipeline.reduce((sum, stage) => sum + stage.value, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Total pipeline
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>
                Track deals through your sales process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSalesData.salesPipeline.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <h3 className="font-medium">{stage.stage}</h3>
                        <Badge variant="outline">{stage.count} deals</Badge>
                      </div>
                      <div className="text-lg font-semibold">
                        ${stage.value.toLocaleString()}
                      </div>
                    </div>
                    <Progress 
                      value={(stage.count / Math.max(...mockSalesData.salesPipeline.map(s => s.count))) * 100} 
                      className="w-full" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage your customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading customers...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Customers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockSalesData.activeCustomers}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">New This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mockSalesData.newLeads}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Avg. Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${Math.round(mockSalesData.totalRevenue / mockSalesData.activeCustomers).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Customers</h4>
                    {mockSalesData.topCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.contact}</p>
                            <Badge className={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${customer.revenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Annual revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Track customer interactions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <div className="font-medium">{activity.customer}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">by {activity.agent}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>
                Generate comprehensive sales analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <span>Revenue Report</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Target className="w-8 h-8 mb-2" />
                  <span>Pipeline Analysis</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Users className="w-8 h-8 mb-2" />
                  <span>Customer Analytics</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Star className="w-8 h-8 mb-2" />
                  <span>Performance Metrics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};