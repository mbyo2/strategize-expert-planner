import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Truck, 
  MapPin, 
  Clock,
  CheckCircle,
  Package,
  Route,
  Zap
} from 'lucide-react';
import { useSupplyChainMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const SupplyChainModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading } = useSupplyChainMetrics(organizationId);

  const hasData = metrics.shipments.length > 0 || metrics.warehouses.length > 0;

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
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.activeShipments}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalRoutes} active routes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.onTimeDelivery}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.onTimeDelivery >= 90 ? (
                    <>
                      <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
                      Above target
                    </>
                  ) : 'Below target'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.avgTransitTime} days</div>
                <p className="text-xs text-muted-foreground">
                  Across all routes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Mile</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">${metrics.costPerMile}</div>
                <p className="text-xs text-muted-foreground">
                  Average cost
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
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
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))}
                </div>
              ) : metrics.shipments.length === 0 ? (
                <div className="text-center p-8">
                  <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No shipments found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create shipments to track deliveries
                  </p>
                  <Button>Create Shipment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">In Transit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.shipments.filter(s => s.status === 'in_transit').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Delivered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.shipments.filter(s => s.status === 'delivered').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.shipments.filter(s => s.status === 'pending').length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Shipments</h4>
                    {metrics.shipments.map((shipment) => (
                      <div key={shipment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(shipment.status)}
                            <div>
                              <h3 className="font-medium">SH-{shipment.id}</h3>
                              <p className="text-sm text-muted-foreground">{shipment.cargo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(shipment.status)}>
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                            {shipment.eta && (
                              <div className="text-sm text-muted-foreground mt-1">
                                ETA: {shipment.eta}
                              </div>
                            )}
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
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : metrics.warehouses.length === 0 ? (
                <div className="text-center p-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No warehouses found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add warehouses to manage storage locations
                  </p>
                  <Button>Add Warehouse</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.warehouses.map((warehouse) => (
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
              )}
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
                <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Route optimization coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Plan and optimize delivery routes for maximum efficiency
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
