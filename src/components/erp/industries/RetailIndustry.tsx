import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Layers, BarChart3, Users, ScanBarcode } from 'lucide-react';

export const RetailIndustry: React.FC = () => {
  const stats = {
    channels: 3,
    stores: 28,
    sku: 15420,
    posUptime: 99.9,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Retail Industry Suite</h2>
        <Button>
          <ShoppingCart className="w-4 h-4 mr-2" />
          New Promotion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Stores</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.stores}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Active Channels</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.channels}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">SKUs</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.sku.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">POS Uptime</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.posUptime}%</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pos">
        <TabsList>
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="merch">Merchandising</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="omni">Omni-Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <Card>
            <CardHeader>
              <CardTitle>Point of Sale Integration</CardTitle>
              <CardDescription>Unified in-store and online transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <ScanBarcode className="w-6 h-6 mb-2" />
                  <span>Sync Terminals</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  <span>Loyalty Programs</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Sales Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merch">
          <Card>
            <CardHeader>
              <CardTitle>Merchandising</CardTitle>
              <CardDescription>Pricing, promotions, and markdowns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Assortment Planning','Price Management','Promotion Calendar'].map((f)=> (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><Layers className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Configured</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Real-time stock across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Replenishment and forecasting coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="omni">
          <Card>
            <CardHeader>
              <CardTitle>Omni-Channel</CardTitle>
              <CardDescription>Click & collect, ship-from-store, returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Store className="w-6 h-6 mb-2" />
                  <span>Store Ops</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <ShoppingCart className="w-6 h-6 mb-2" />
                  <span>E-commerce</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Demand Forecast</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailIndustry;
