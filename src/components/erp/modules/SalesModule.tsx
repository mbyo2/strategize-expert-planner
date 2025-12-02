import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  Star
} from 'lucide-react';
import { useSalesMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const SalesModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading } = useSalesMetrics(organizationId);

  const hasData = metrics.activeCustomers > 0 || metrics.salesPipeline.some(s => s.count > 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
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
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalRevenue > 0 && (
                    <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                  )}
                  From customers
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  Customer base
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.newLeads}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Lead to customer
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.pipelineValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total pipeline
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
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
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : !hasData ? (
                <div className="text-center p-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No deals in pipeline</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add deals to track your sales pipeline
                  </p>
                  <Button>Add Deal</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.salesPipeline.map((stage, index) => {
                    const maxCount = Math.max(...metrics.salesPipeline.map(s => s.count), 1);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                            <h3 className="font-medium">{stage.stage}</h3>
                            <Badge variant="outline">{stage.count} deals</Badge>
                          </div>
                          <div className="text-lg font-semibold">
                            {formatCurrency(stage.value)}
                          </div>
                        </div>
                        <Progress 
                          value={(stage.count / maxCount) * 100} 
                          className="w-full" 
                        />
                      </div>
                    );
                  })}
                </div>
              )}
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
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : metrics.topCustomers.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No customers found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first customer to start tracking relationships
                  </p>
                  <Button>Add Customer</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Customers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">New This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.newLeads}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Avg. Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.activeCustomers > 0 
                            ? formatCurrency(Math.round(metrics.totalRevenue / metrics.activeCustomers))
                            : '$0'
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Customers</h4>
                    {metrics.topCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                          <div className="font-semibold">{formatCurrency(customer.revenue)}</div>
                          <div className="text-sm text-muted-foreground">Total revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
