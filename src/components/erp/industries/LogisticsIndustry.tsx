import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Truck, Route, Plane, Ship, Warehouse } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

const LogisticsIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: shipments, isLoading: l1 } = useERPEntities(orgId, 'logistics', 'shipment');
  const { entities: orders, isLoading: l2 } = useERPEntities(orgId, 'logistics', 'order');
  const { entities: warehouses, isLoading: l3 } = useERPEntities(orgId, 'logistics', 'warehouse');
  const isLoading = l1 || l2 || l3;

  const inTransit = shipments.filter((s: any) => (s.entity_data?.status === 'in_transit')).length;
  const onTimeCount = shipments.filter((s: any) => s.entity_data?.on_time !== false && s.entity_data?.status === 'delivered').length;
  const totalDelivered = shipments.filter((s: any) => s.entity_data?.status === 'delivered').length;
  const onTimeRate = totalDelivered > 0 ? Math.round((onTimeCount / totalDelivered) * 100) : 100;
  const avgCapacity = warehouses.length > 0 ? Math.round(warehouses.reduce((s: number, w: any) => s + (w.entity_data?.utilization || 0), 0) / warehouses.length) : 0;

  return (
    <section aria-labelledby="logistics-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="logistics-erp-heading" className="text-2xl font-bold">Logistics Suite</h2>
          <p className="text-muted-foreground">Optimize transportation, warehousing, orders, and compliance</p>
        </div>
        <Button variant="default" size="sm"><Truck className="mr-2 h-4 w-4" /> Create Shipment</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Shipments Today', value: shipments.length, icon: Plane },
          { label: 'On-Time Rate', value: `${onTimeRate}%`, icon: Route },
          { label: 'Orders In Transit', value: inTransit, icon: Ship },
          { label: 'Warehouse Capacity', value: `${avgCapacity}%`, icon: Warehouse },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{value}</p>}
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transportation">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="transportation">
          <Card><CardHeader><CardTitle>Transportation Management</CardTitle><CardDescription>Carrier, routing, and tracking</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-20 w-full" /> : shipments.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground"><Truck className="h-12 w-12 mx-auto mb-4" /><p>No shipments found. Create logistics entities to get started.</p></div>
              ) : (
                <div className="space-y-3">
                  {shipments.slice(0, 5).map((s: any) => {
                    const d = s.entity_data || {};
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 border rounded">
                        <div><div className="font-medium">{d.origin || '?'} → {d.destination || '?'}</div><div className="text-sm text-muted-foreground">{d.cargo || 'General'}</div></div>
                        <div className="text-sm text-muted-foreground">{d.status || 'pending'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse"><Card><CardHeader><CardTitle>Warehouse Operations</CardTitle><CardDescription>Receiving, putaway, picking, and packing</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Optimize slotting, labor, and picking routes.</p></CardContent></Card></TabsContent>
        <TabsContent value="inventory"><Card><CardHeader><CardTitle>Inventory Control</CardTitle><CardDescription>Stock levels, cycle counts, and replenishment</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Real-time visibility across locations.</p></CardContent></Card></TabsContent>
        <TabsContent value="orders"><Card><CardHeader><CardTitle>Order Management</CardTitle><CardDescription>Orchestration across channels and carriers</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-sm text-muted-foreground">{orders.length} orders tracked</p>}</CardContent></Card></TabsContent>
        <TabsContent value="compliance"><Card><CardHeader><CardTitle>Compliance</CardTitle><CardDescription>Customs, export controls, and documentation</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Generate paperwork and maintain audit trails.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default LogisticsIndustry;