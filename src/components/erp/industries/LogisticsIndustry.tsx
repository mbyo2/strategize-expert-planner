import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Boxes, Navigation, Package, ClipboardCheck, Route, Plane, Ship, Warehouse } from 'lucide-react';

const LogisticsIndustry: React.FC = () => {
  return (
    <section aria-labelledby="logistics-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="logistics-erp-heading" className="text-2xl font-bold">Logistics Suite</h2>
          <p className="text-muted-foreground">
            Optimize transportation, warehousing, orders, and compliance
          </p>
        </div>
        <Button variant="default" size="sm">
          <Truck className="mr-2 h-4 w-4" /> Create Shipment
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shipments Today</p>
                <p className="text-2xl font-bold">186</p>
              </div>
              <Plane className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
              <Route className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orders In Transit</p>
                <p className="text-2xl font-bold">421</p>
              </div>
              <Ship className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warehouse Capacity</p>
                <p className="text-2xl font-bold">82%</p>
              </div>
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Tabs defaultValue="transportation">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="transportation">
          <Card>
            <CardHeader>
              <CardTitle>Transportation Management</CardTitle>
              <CardDescription>Carrier, routing, and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Active Routes</h3>
                  <p className="text-sm text-muted-foreground">Dynamic routing with ETA predictions.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Carrier Performance</h3>
                  <p className="text-sm text-muted-foreground">On-time metrics and SLA monitoring.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Operations</CardTitle>
              <CardDescription>Receiving, putaway, picking, and packing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Optimize slotting, labor, and picking routes.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Control</CardTitle>
              <CardDescription>Stock levels, cycle counts, and replenishment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Real-time visibility across locations.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Orchestration across channels and carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Rate shop, allocate, and confirm shipments.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>Customs, export controls, and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Generate paperwork and maintain audit trails.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default LogisticsIndustry;
