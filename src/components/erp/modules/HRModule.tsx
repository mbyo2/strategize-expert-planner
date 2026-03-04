import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, Award, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { useHRMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import ERPEntityDialog, { ENTITY_FIELDS } from '../ERPEntityDialog';

export const HRModule: React.FC = () => {
  const { organizationId: orgId } = useOrganization();
  const organizationId = orgId || '';
  const { metrics, isLoading: metricsLoading } = useHRMetrics(organizationId);
  const { entities: employees, isLoading: employeesLoading } = useERPEntities(organizationId, 'hr', 'employee');
  const [showDialog, setShowDialog] = useState(false);

  const isLoading = metricsLoading || employeesLoading;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Human Resources</h2>
        <Button size="sm" onClick={() => setShowDialog(true)}>
          <UserPlus className="w-4 h-4 mr-1" /> Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: metrics.totalEmployees, icon: Users, sub: metrics.newHires > 0 ? `+${metrics.newHires} this month` : 'Active employees' },
          { label: 'Open Positions', value: metrics.openPositions, icon: UserPlus, sub: 'Actively recruiting' },
          { label: 'Average Salary', value: metrics.avgSalary > 0 ? formatCurrency(metrics.avgSalary) : 'N/A', icon: DollarSign, sub: 'Per year' },
          { label: 'Departments', value: metrics.departments.length, icon: Award, sub: 'Active departments' },
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

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Employee Directory</CardTitle><CardDescription>Manage your workforce</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : employees.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No employees found</p>
                  <Button onClick={() => setShowDialog(true)}>Add Employee</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {employees.map((employee: any) => {
                    const data = employee.entity_data || {};
                    return (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarImage src={data.avatar} /><AvatarFallback>{(data.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                          <div>
                            <h3 className="font-medium">{data.name || 'Unknown'}</h3>
                            <p className="text-sm text-muted-foreground">{data.position || 'No position'}</p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline">{data.department || 'Unassigned'}</Badge>
                              <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>{data.status || 'active'}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader><CardTitle>Department Overview</CardTitle><CardDescription>Departments and budgets</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : metrics.departments.length === 0 ? (
                <div className="text-center p-8">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Departments are created from employee assignments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {metrics.departments.map((dept, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                        <div>
                          <h3 className="font-medium">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.count} employee{dept.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="font-semibold">{formatCurrency(dept.budget)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERPEntityDialog open={showDialog} onOpenChange={setShowDialog} moduleKey="hr" entityType="employee" title="Add Employee" fields={ENTITY_FIELDS.employee} />
    </div>
  );
};
