
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Network, 
  LineChart, 
  Shield, 
  Brain,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  records: number;
}

interface DataPipeline {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'running' | 'stopped' | 'error';
  lastRun: string;
}

const DataFoundry: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const dataSources: DataSource[] = [
    {
      id: '1',
      name: 'Strategic Goals Database',
      type: 'database',
      status: 'connected',
      lastSync: '2 minutes ago',
      records: 1247
    },
    {
      id: '2',
      name: 'Market Intelligence API',
      type: 'api',
      status: 'syncing',
      lastSync: '5 minutes ago',
      records: 8950
    },
    {
      id: '3',
      name: 'Industry Reports',
      type: 'file',
      status: 'connected',
      lastSync: '1 hour ago',
      records: 342
    },
    {
      id: '4',
      name: 'Real-time Analytics Stream',
      type: 'stream',
      status: 'connected',
      lastSync: 'Live',
      records: 15670
    }
  ];

  const dataPipelines: DataPipeline[] = [
    {
      id: '1',
      name: 'Strategic Goal Analytics',
      source: 'Strategic Goals Database',
      destination: 'Analytics Warehouse',
      status: 'running',
      lastRun: '10 minutes ago'
    },
    {
      id: '2',
      name: 'Market Trend Processing',
      source: 'Market Intelligence API',
      destination: 'Trend Analysis Engine',
      status: 'running',
      lastRun: '5 minutes ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'running':
        return 'bg-green-500';
      case 'syncing':
        return 'bg-yellow-500';
      case 'disconnected':
      case 'stopped':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDataExploration = (sourceId: string) => {
    setSelectedSource(sourceId);
    toast.success('Data exploration initiated', {
      description: 'Opening advanced analytics workspace...'
    });
  };

  const handlePipelineAction = (pipelineId: string, action: 'start' | 'stop' | 'restart') => {
    toast.info(`Pipeline ${action}`, {
      description: `${action.charAt(0).toUpperCase() + action.slice(1)}ing data pipeline...`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Data Foundry - Enterprise Data Platform
          </CardTitle>
          <p className="text-muted-foreground">
            Connect, integrate, and analyze data from multiple sources with enterprise-grade security
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="sources">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Sources
              </TabsTrigger>
              <TabsTrigger value="pipelines" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Pipelines
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search data sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <Card key={source.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            <h3 className="font-semibold">{source.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                            <Badge variant="outline">{source.type}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Status: {source.status}</p>
                          <p>Last sync: {source.lastSync}</p>
                          <p>Records: {source.records.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDataExploration(source.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Explore
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pipelines">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Data Pipelines</h3>
                  <Button>
                    <Network className="h-4 w-4 mr-2" />
                    Create Pipeline
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {dataPipelines.map((pipeline) => (
                    <Card key={pipeline.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{pipeline.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pipeline.source} → {pipeline.destination}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last run: {pipeline.lastRun}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(pipeline.status)}`} />
                              <span className="text-sm">{pipeline.status}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePipelineAction(pipeline.id, 'restart')}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePipelineAction(pipeline.id, pipeline.status === 'running' ? 'stop' : 'start')}
                              >
                                {pipeline.status === 'running' ? 'Stop' : 'Start'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Data Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">94%</div>
                      <p className="text-sm text-muted-foreground mt-1">Excellent data quality</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Active Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dataSources.filter(s => s.status === 'connected').length}</div>
                      <p className="text-sm text-muted-foreground mt-1">Real-time data sources</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Processing Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1.2M</div>
                      <p className="text-sm text-muted-foreground mt-1">Records per hour</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Analytics Workspace</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                      <div className="text-center">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">AI-Powered Analytics</h3>
                        <p className="text-muted-foreground mb-4">
                          Select a data source to begin advanced analysis with machine learning insights
                        </p>
                        <Button>
                          <LineChart className="h-4 w-4 mr-2" />
                          Launch Analytics Workspace
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Enterprise Security Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Data Encryption</h4>
                          <p className="text-sm text-muted-foreground">End-to-end encryption for all data transfers</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Access Controls</h4>
                          <p className="text-sm text-muted-foreground">Role-based permissions and audit trails</p>
                        </div>
                        <Badge variant="default">Enforced</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Data Lineage</h4>
                          <p className="text-sm text-muted-foreground">Complete tracking of data transformations</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataFoundry;
