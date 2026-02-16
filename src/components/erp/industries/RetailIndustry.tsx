import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Store, Layers, BarChart3, Users, ScanBarcode } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const RetailIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: stores, isLoading: l1 } = useERPEntities(orgId, 'retail', 'store');
  const { entities: products, isLoading: l2 } = useERPEntities(orgId, 'retail', 'product');
  const { entities: channels, isLoading: l3 } = useERPEntities(orgId, 'retail', 'channel');
  const isLoading = l1 || l2 || l3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Retail Industry Suite</h2>
        <Button><ShoppingCart className="w-4 h-4 mr-2" />New Promotion</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Stores', value: stores.length },
          { label: 'Active Channels', value: channels.length },
          { label: 'SKUs', value: products.length.toLocaleString() },
          { label: 'POS Uptime', value: '99.9%' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}</CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pos">
        <TabsList>
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="merch">Merchandising</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="omni">Omni-Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <Card><CardHeader><CardTitle>Point of Sale Integration</CardTitle><CardDescription>Unified in-store and online transactions</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><ScanBarcode className="w-6 h-6 mb-2" /><span>Sync Terminals</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Users className="w-6 h-6 mb-2" /><span>Loyalty Programs</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><BarChart3 className="w-6 h-6 mb-2" /><span>Sales Reports</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merch">
          <Card><CardHeader><CardTitle>Merchandising</CardTitle><CardDescription>Pricing, promotions, and markdowns</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Assortment Planning', 'Price Management', 'Promotion Calendar'].map((f) => (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><Layers className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Configured</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory"><Card><CardHeader><CardTitle>Inventory Management</CardTitle><CardDescription>Real-time stock across locations</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{products.length} products tracked across {stores.length} locations.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="omni">
          <Card><CardHeader><CardTitle>Omni-Channel</CardTitle><CardDescription>Click & collect, ship-from-store, returns</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Store className="w-6 h-6 mb-2" /><span>Store Ops</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><ShoppingCart className="w-6 h-6 mb-2" /><span>E-commerce</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><BarChart3 className="w-6 h-6 mb-2" /><span>Demand Forecast</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailIndustry;