import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, TrendingUp, DollarSign, Target, ShoppingCart, Star, Plus } from 'lucide-react';
import { useSalesMetrics } from '@/hooks/useERPMetrics';
import { useOrganization } from '@/contexts/OrganizationContext';
import ERPEntityDialog, { ENTITY_FIELDS } from '../ERPEntityDialog';

export const SalesModule: React.FC = () => {
  const { organizationId: orgId } = useOrganization();
  const organizationId = orgId || '';
  const { metrics, isLoading } = useSalesMetrics(organizationId);
  const [dialogType, setDialogType] = useState<'customer' | 'lead' | 'deal' | null>(null);

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
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales & CRM</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogType('lead')}><Plus className="w-4 h-4 mr-1" /> Lead</Button>
          <Button variant="outline" size="sm" onClick={() => setDialogType('deal')}><Plus className="w-4 h-4 mr-1" /> Deal</Button>
          <Button size="sm" onClick={() => setDialogType('customer')}><UserPlus className="w-4 h-4 mr-1" /> Customer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), icon: DollarSign },
          { label: 'Active Customers', value: metrics.activeCustomers, icon: Users },
          { label: 'New Leads', value: metrics.newLeads, icon: Target },
          { label: 'Conversion Rate', value: `${metrics.conversionRate}%`, icon: Star },
          { label: 'Pipeline Value', value: formatCurrency(metrics.pipelineValue), icon: ShoppingCart },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{kpi.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Sales Pipeline</CardTitle><CardDescription>Track deals through your process</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('deal')}><Plus className="w-4 h-4 mr-1" /> Deal</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : !hasData ? (
                <div className="text-center p-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No deals in pipeline</p>
                  <Button onClick={() => setDialogType('deal')}>Add Deal</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.salesPipeline.map((stage, i) => {
                    const maxCount = Math.max(...metrics.salesPipeline.map(s => s.count), 1);
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                            <h3 className="font-medium">{stage.stage}</h3>
                            <Badge variant="outline">{stage.count} deals</Badge>
                          </div>
                          <div className="text-lg font-semibold">{formatCurrency(stage.value)}</div>
                        </div>
                        <Progress value={(stage.count / maxCount) * 100} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Customer Management</CardTitle><CardDescription>Manage relationships</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('customer')}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : metrics.topCustomers.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No customers found</p>
                  <Button onClick={() => setDialogType('customer')}>Add Customer</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {metrics.topCustomers.map(customer => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                        </div>
                      </div>
                      <div className="font-semibold">{formatCurrency(customer.revenue)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERPEntityDialog open={dialogType === 'customer'} onOpenChange={o => !o && setDialogType(null)} moduleKey="sales" entityType="customer" title="Add Customer" fields={ENTITY_FIELDS.customer} />
      <ERPEntityDialog open={dialogType === 'lead'} onOpenChange={o => !o && setDialogType(null)} moduleKey="sales" entityType="lead" title="Add Lead" fields={ENTITY_FIELDS.lead} />
      <ERPEntityDialog open={dialogType === 'deal'} onOpenChange={o => !o && setDialogType(null)} moduleKey="sales" entityType="deal" title="Add Deal" fields={ENTITY_FIELDS.deal} />
    </div>
  );
};
