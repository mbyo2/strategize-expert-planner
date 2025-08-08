import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShieldAlert, Landmark, LineChart, FileText, Banknote } from 'lucide-react';

export const FinancialServicesIndustry: React.FC = () => {
  const summary = {
    accounts: 1284,
    multicurrency: true,
    riskAlerts: 3,
    liquidity: '$12.4M'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Services Suite</h2>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Accounts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.accounts}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Multi-currency</CardTitle></CardHeader><CardContent><Badge variant="outline">{summary.multicurrency ? 'Enabled' : 'Disabled'}</Badge></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Risk Alerts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.riskAlerts}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Liquidity</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.liquidity}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="risk">Risk & Compliance</TabsTrigger>
          <TabsTrigger value="alm">ALM</TabsTrigger>
          <TabsTrigger value="invest">Investment</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
              <CardDescription>Multi-entity, multi-currency accounting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Advanced ledger features coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk & Compliance</CardTitle>
              <CardDescription>Fraud detection, regulatory reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><ShieldAlert className="w-6 h-6 mb-2" /><span>AML/KYC</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Landmark className="w-6 h-6 mb-2" /><span>Basel/IFRS</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><LineChart className="w-6 h-6 mb-2" /><span>Stress Tests</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alm">
          <Card>
            <CardHeader>
              <CardTitle>Asset & Liability Management</CardTitle>
              <CardDescription>ALM gap, duration, and liquidity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">ALM analytics coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invest">
          <Card>
            <CardHeader>
              <CardTitle>Investment Management</CardTitle>
              <CardDescription>Portfolios, performance, client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Portfolio tools coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treasury">
          <Card>
            <CardHeader>
              <CardTitle>Treasury</CardTitle>
              <CardDescription>Cash, liquidity, and instruments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Treasury workflows coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialServicesIndustry;
