import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserPlus, 
  Award,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useHRMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const HRModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading: metricsLoading } = useHRMetrics(organizationId);
  const { entities: employees, isLoading: employeesLoading } = useERPEntities(
    organizationId,
    'hr',
    'employee'
  );

  const isLoading = metricsLoading || employeesLoading;
  const hasData = metrics.totalEmployees > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Human Resources</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.newHires > 0 && (
                    <>
                      <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                      +{metrics.newHires} this month
                    </>
                  )}
                  {metrics.newHires === 0 && 'Active employees'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.openPositions}</div>
                <p className="text-xs text-muted-foreground">
                  Actively recruiting
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics.avgSalary > 0 ? formatCurrency(metrics.avgSalary) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per year
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.departments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active departments
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                Manage your organization's workforce
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No employees found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add employees to manage your workforce
                  </p>
                  <Button>Add Employee</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {employees.map((employee: any) => {
                    const data = employee.entity_data || {};
                    return (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={data.avatar} />
                            <AvatarFallback>
                              {(data.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{data.name || 'Unknown'}</h3>
                            <p className="text-sm text-muted-foreground">{data.position || 'No position'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{data.department || 'Unassigned'}</Badge>
                              <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
                                {data.status || 'active'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {data.start_date ? `Joined ${new Date(data.start_date).toLocaleDateString()}` : ''}
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

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Manage organizational departments and budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : metrics.departments.length === 0 ? (
                <div className="text-center p-8">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No departments found</div>
                  <p className="text-sm text-muted-foreground">
                    Departments are created from employee assignments
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dept.count} employee{dept.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(dept.budget)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total salaries
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>
                Monitor employee attendance and time off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Attendance tracking coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Track employee attendance, time off, and schedules
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>
                Process and manage employee compensation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Payroll management coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Process payroll and manage employee compensation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
