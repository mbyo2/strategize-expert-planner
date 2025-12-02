import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  FileText,
  Calculator
} from 'lucide-react';
import { useFinancialMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const FinancialModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading: metricsLoading } = useFinancialMetrics(organizationId);
  const { entities: transactions, isLoading: transactionsLoading } = useERPEntities(
    organizationId,
    'financial',
    'transaction'
  );

  const isLoading = metricsLoading || transactionsLoading;
  const hasData = metrics.accounts.length > 0 || transactions.length > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.revenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.revenue > 0 ? (
                    <>
                      <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                      From transactions
                    </>
                  ) : (
                    'No revenue recorded'
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.expenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.expenses > 0 ? 'From transactions' : 'No expenses recorded'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.profit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.profit >= 0 ? (
                    <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="inline w-3 h-3 mr-1 text-red-500" />
                  )}
                  Revenue - Expenses
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.cashFlow)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total account balance
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Manage your organization's financial accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : metrics.accounts.length === 0 ? (
                <div className="text-center p-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No accounts found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create financial accounts to track your organization's funds
                  </p>
                  <Button>Add Account</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{account.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatCurrency(account.balance)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Track all financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No transactions found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Record your first transaction to start tracking finances
                  </p>
                  <Button>Add Transaction</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction: any) => {
                    const data = transaction.entity_data || {};
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{data.description || 'Transaction'}</div>
                          <div className="text-sm text-muted-foreground">{data.category || 'Uncategorized'}</div>
                        </div>
                        <div className={`font-semibold ${(data.amount || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(data.amount || 0) > 0 ? '+' : ''}{formatCurrency(data.amount || 0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>
                Set and track departmental budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="text-muted-foreground mb-4">Budget management coming soon</div>
                <p className="text-sm text-muted-foreground">
                  Create and track budgets for departments and projects
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate comprehensive financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <FileText className="w-8 h-8 mb-2" />
                  <span>Profit & Loss</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <PieChart className="w-8 h-8 mb-2" />
                  <span>Balance Sheet</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <span>Cash Flow</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Calculator className="w-8 h-8 mb-2" />
                  <span>Tax Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
