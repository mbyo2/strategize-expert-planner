import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Truck, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Route,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const SupplyChainModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: shipments, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'supply_chain',
    'shipment'
  );

  const mockSupplyChainData = {
    activeShipments: 42,
    onTimeDelivery: 94.5,
    totalRoutes: 18,
    avgTransitTime: 3.2,
    costPerMile: 2.45,
    fuelEfficiency: 7.8,
    shipments: [
      { 
        id: 'SH-001', 
        origin: 'New York, NY', 
        destination: 'Los Angeles, CA', 
        status: 'in_transit', 
        progress: 65,
        eta: '2024-01-18',
        cargo: 'Electronics'
      },
      { 
        id: 'SH-002', 
        origin: 'Chicago, IL', 
        destination: 'Miami, FL', 
        status: 'delivered', 
        progress: 100,
        eta: '2024-01-15',
        cargo: 'Medical Supplies'
      },
      { 
        id: 'SH-003', 
        origin: 'Seattle, WA', 
        destination: 'Denver, CO', 
        status: 'pending', 
        progress: 0,
        eta: '2024-01-22',
        cargo: 'Automotive Parts'
      }
    ],
    warehouses: [
      { 
        id: '1', 
        name: 'East Coast Hub', 
        location: 'New York, NY', 
        capacity: 85000, 
        utilization: 78,
        inventory: 12450
      },
      { 
        id: '2', 
        name: 'West Coast Hub', 
        location: 'Los Angeles, CA', 
        capacity: 92000, 
        utilization: 82,
        inventory: 15680
      },
      { 
        id: '3', 
        name: 'Central Hub', 
        location: 'Chicago, IL', 
        capacity: 78000, 
        utilization: 71,
        inventory: 9850
      }
    ],
    risks: [
      { type: 'weather', severity: 'medium', location: 'Midwest', impact: 'Potential delays in Chicago hub' },
      { type: 'traffic', severity: 'low', location: 'California', impact: 'Minor routing adjustments' },
      { type: 'port_congestion', severity: 'high', location: 'Long Beach', impact: 'International shipment delays' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_transit': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in_transit': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'weather': return <AlertTriangle className="w-4 h-4" />;
      case 'traffic': return <Route className="w-4 h-4" />;
      case 'port_congestion': return <Globe className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supply Chain Management</h2>
        <Button>
          <Route className="w-4 h-4 mr-2" />
          Plan Route
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSupplyChainData.activeShipments}</div>
            <p className="text-xs text-muted-foreground">
              {mockSupplyChainData.totalRoutes} active routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSupplyChainData.onTimeDelivery}%</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
              Above target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSupplyChainData.avgTransitTime} days</div>
            <p className="text-xs text-muted-foreground">
              Across all routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Mile</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockSupplyChainData.costPerMile}</div>
            <p className="text-xs text-muted-foreground">
              {mockSupplyChainData.fuelEfficiency} MPG avg
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="risks">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>
                Monitor shipments in real-time across your supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading shipments...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">In Transit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">28</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Delivered Today</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">6</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Shipments</h4>
                    {mockSupplyChainData.shipments.map((shipment) => (
                      <div key={shipment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(shipment.status)}
                            <div>
                              <h3 className="font-medium">{shipment.id}</h3>
                              <p className="text-sm text-muted-foreground">{shipment.cargo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(shipment.status)}>
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              ETA: {shipment.eta}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{shipment.origin} → {shipment.destination}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{shipment.progress}%</span>
                          </div>
                          <Progress value={shipment.progress} className="w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Management</CardTitle>
              <CardDescription>
                Monitor warehouse capacity and inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSupplyChainData.warehouses.map((warehouse) => (
                  <div key={warehouse.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{warehouse.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {warehouse.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{warehouse.inventory.toLocaleString()} items</div>
                        <div className="text-sm text-muted-foreground">
                          {warehouse.capacity.toLocaleString()} sq ft
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span>{warehouse.utilization}%</span>
                      </div>
                      <Progress value={warehouse.utilization} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
              <CardDescription>
                Optimize delivery routes for efficiency and cost reduction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <div className="text-muted-foreground mb-4">Route optimization coming soon</div>
                <Button disabled>
                  <Route className="w-4 h-4 mr-2" />
                  Optimize Routes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Risk Management</CardTitle>
              <CardDescription>
                Monitor and mitigate supply chain risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Current Risk Alerts</h4>
                {mockSupplyChainData.risks.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getRiskColor(risk.severity)}`}>
                        {getRiskIcon(risk.type)}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{risk.type.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{risk.location}</div>
                        <div className="text-xs text-muted-foreground">{risk.impact}</div>
                      </div>
                    </div>
                    <Badge className={getRiskColor(risk.severity)}>
                      {risk.severity}
                    </Badge>
                  </div>
                ))}
                
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Risk Mitigation Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="p-6 h-auto flex-col">
                      <AlertTriangle className="w-8 h-8 mb-2" />
                      <span>Risk Assessment</span>
                    </Button>
                    <Button variant="outline" className="p-6 h-auto flex-col">
                      <Route className="w-8 h-8 mb-2" />
                      <span>Alternative Routes</span>
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