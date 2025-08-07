import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cog, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Wrench,
  BarChart3,
  Factory
} from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ManufacturingModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: workOrders, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'manufacturing',
    'work_order'
  );

  const mockManufacturingData = {
    totalProduction: 12450,
    efficiency: 87.5,
    activeLines: 8,
    totalLines: 10,
    qualityRate: 98.2,
    downtime: 2.3,
    productionLines: [
      { 
        id: 'LINE-01', 
        name: 'Assembly Line A', 
        status: 'running', 
        efficiency: 94, 
        output: 1250,
        target: 1300,
        product: 'Widget Pro'
      },
      { 
        id: 'LINE-02', 
        name: 'Assembly Line B', 
        status: 'maintenance', 
        efficiency: 0, 
        output: 0,
        target: 1100,
        product: 'Widget Standard'
      },
      { 
        id: 'LINE-03', 
        name: 'Packaging Line', 
        status: 'running', 
        efficiency: 89, 
        output: 2100,
        target: 2200,
        product: 'All Products'
      }
    ],
    workOrders: [
      { 
        id: 'WO-001', 
        product: 'Widget Pro', 
        quantity: 500, 
        completed: 350, 
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-01-20'
      },
      { 
        id: 'WO-002', 
        product: 'Widget Standard', 
        quantity: 800, 
        completed: 800, 
        status: 'completed',
        priority: 'medium',
        dueDate: '2024-01-18'
      },
      { 
        id: 'WO-003', 
        product: 'Widget Deluxe', 
        quantity: 300, 
        completed: 120, 
        status: 'in_progress',
        priority: 'low',
        dueDate: '2024-01-25'
      }
    ],
    qualityMetrics: [
      { metric: 'Defect Rate', current: 1.8, target: 2.0, trend: 'down' },
      { metric: 'First Pass Yield', current: 96.2, target: 95.0, trend: 'up' },
      { metric: 'Customer Returns', current: 0.3, target: 0.5, trend: 'down' },
      { metric: 'Rework Rate', current: 2.1, target: 3.0, trend: 'stable' }
    ],
    maintenance: [
      { equipment: 'Assembly Robot A1', type: 'preventive', status: 'scheduled', date: '2024-01-19' },
      { equipment: 'Conveyor System B', type: 'corrective', status: 'in_progress', date: '2024-01-16' },
      { equipment: 'Quality Scanner C3', type: 'preventive', status: 'completed', date: '2024-01-14' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'stopped': return <Pause className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Cog className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Cog className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'stopped': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manufacturing Operations</h2>
        <Button>
          <Cog className="w-4 h-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockManufacturingData.totalProduction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Units this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockManufacturingData.efficiency}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              Above target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lines</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockManufacturingData.activeLines}/{mockManufacturingData.totalLines}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockManufacturingData.downtime}% downtime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockManufacturingData.qualityRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              First pass yield
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production" className="space-y-4">
        <TabsList>
          <TabsTrigger value="production">Production Lines</TabsTrigger>
          <TabsTrigger value="orders">Work Orders</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Line Status</CardTitle>
              <CardDescription>
                Monitor real-time status of all production lines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockManufacturingData.productionLines.map((line) => (
                  <div key={line.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(line.status)}
                        <div>
                          <h3 className="font-medium">{line.name}</h3>
                          <p className="text-sm text-muted-foreground">{line.product}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(line.status)}>
                          {line.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {line.output}/{line.target} units
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{line.efficiency}%</span>
                      </div>
                      <Progress value={line.efficiency} className="w-full" />
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Output Progress</span>
                        <span>{Math.round((line.output / line.target) * 100)}%</span>
                      </div>
                      <Progress value={(line.output / line.target) * 100} className="w-full mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                Manage and track manufacturing work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading work orders...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">In Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mockManufacturingData.workOrders.filter(w => w.status === 'in_progress').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mockManufacturingData.workOrders.filter(w => w.status === 'completed').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Units</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mockManufacturingData.workOrders.reduce((sum, w) => sum + w.quantity, 0)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Active Work Orders</h4>
                    {mockManufacturingData.workOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="font-medium">{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.product}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority} priority
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              Due: {order.dueDate}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{order.completed}/{order.quantity} units ({Math.round((order.completed / order.quantity) * 100)}%)</span>
                          </div>
                          <Progress value={(order.completed / order.quantity) * 100} className="w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Metrics</CardTitle>
              <CardDescription>
                Monitor quality standards and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockManufacturingData.qualityMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{metric.metric}</h3>
                        <p className="text-sm text-muted-foreground">
                          Target: {metric.target}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <div className="text-lg font-semibold">{metric.current}%</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          {getTrendIcon(metric.trend)}
                          <span className="ml-1">{metric.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Maintenance</CardTitle>
              <CardDescription>
                Track maintenance schedules and equipment health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Maintenance Schedule</h4>
                {mockManufacturingData.maintenance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Wrench className="w-4 h-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{item.equipment}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {item.type} maintenance
                        </div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
                
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Maintenance Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="p-6 h-auto flex-col">
                      <Wrench className="w-8 h-8 mb-2" />
                      <span>Schedule Maintenance</span>
                    </Button>
                    <Button variant="outline" className="p-6 h-auto flex-col">
                      <BarChart3 className="w-8 h-8 mb-2" />
                      <span>Equipment Health</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};