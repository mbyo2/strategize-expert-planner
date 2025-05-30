
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Workflow, 
  BarChart3, 
  Shield,
  Plus,
  Play,
  Pause,
  Settings,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  recordCount: number;
}

interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  progress: number;
  lastRun: string;
  dataFlow: string[];
}

const DataFoundry: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState('');

  const dataSources: DataSource[] = [
    {
      id: '1',
      name: 'Customer Database',
      type: 'database',
      status: 'connected',
      lastSync: '2 minutes ago',
      recordCount: 125000
    },
    {
      id: '2',
      name: 'Market API',
      type: 'api',
      status: 'connected',
      lastSync: '5 minutes ago',
      recordCount: 89000
    },
    {
      id: '3',
      name: 'Financial Reports',
      type: 'file',
      status: 'disconnected',
      lastSync: '1 hour ago',
      recordCount: 45000
    },
    {
      id: '4',
      name: 'Real-time Feed',
      type: 'stream',
      status: 'connected',
      lastSync: 'Live',
      recordCount: 234000
    }
  ];

  const pipelines: Pipeline[] = [
    {
      id: '1',
      name: 'Customer Analytics Pipeline',
      status: 'running',
      progress: 78,
      lastRun: '10 minutes ago',
      dataFlow: ['Customer DB', 'Clean', 'Transform', 'Analytics Store']
    },
    {
      id: '2',
      name: 'Market Intelligence',
      status: 'running',
      progress: 92,
      lastRun: '5 minutes ago',
      dataFlow: ['Market API', 'Validate', 'Enrich', 'Data Warehouse']
    },
    {
      id: '3',
      name: 'Financial Reporting',
      status: 'stopped',
      progress: 0,
      lastRun: '2 hours ago',
      dataFlow: ['Financial Reports', 'Parse', 'Validate', 'Report Store']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'running':
        return 'bg-green-500';
      case 'disconnected':
      case 'stopped':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <TrendingUp className="h-4 w-4" />;
      case 'file':
        return <BarChart3 className="h-4 w-4" />;
      case 'stream':
        return <Workflow className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const handlePipelineAction = (pipelineId: string, action: 'start' | 'stop') => {
    toast.info(`Pipeline ${action}`, {
      description: `${action.charAt(0).toUpperCase() + action.slice(1)}ing data pipeline...`
    });
  };

  const handleAddDataSource = () => {
    if (!newSourceName.trim()) {
      toast.error('Please enter a data source name');
      return;
    }
    
    toast.success('Data source added', {
      description: `${newSourceName} has been configured successfully`
    });
    setNewSourceName('');
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
                Sources
              </TabsTrigger>
              <TabsTrigger value="pipelines" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Pipelines
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Data Sources</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New source name"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={handleAddDataSource}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Source
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataSources.map((source) => (
                    <Card key={source.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(source.type)}
                            <h3 className="font-semibold">{source.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                            <Badge variant="outline">{source.type.toUpperCase()}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span>{source.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Records:</span>
                            <span className="font-semibold">{source.recordCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span>{source.lastSync}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-3">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Create Pipeline
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {pipelines.map((pipeline) => (
                    <Card key={pipeline.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{pipeline.name}</h4>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(pipeline.status)}`} />
                              <span className="text-sm">{pipeline.status}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePipelineAction(pipeline.id, pipeline.status === 'running' ? 'stop' : 'start')}
                            >
                              {pipeline.status === 'running' ? (
                                <Pause className="h-4 w-4 mr-1" />
                              ) : (
                                <Play className="h-4 w-4 mr-1" />
                              )}
                              {pipeline.status === 'running' ? 'Stop' : 'Start'}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {pipeline.progress}%</span>
                            <span>Last run: {pipeline.lastRun}</span>
                          </div>
                          
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${pipeline.progress}%` }}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            {pipeline.dataFlow.map((step, index) => (
                              <React.Fragment key={index}>
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {step}
                                </span>
                                {index < pipeline.dataFlow.length - 1 && (
                                  <span className="text-muted-foreground">→</span>
                                )}
                              </React.Fragment>
                            ))}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">493K</div>
                      <p className="text-sm text-muted-foreground mt-1">Across all sources</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Active Pipelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2</div>
                      <p className="text-sm text-muted-foreground mt-1">Currently processing</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Data Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">98.5%</div>
                      <p className="text-sm text-muted-foreground mt-1">Clean records</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Processing Speed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2.1K</div>
                      <p className="text-sm text-muted-foreground mt-1">Records/second</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Data Lineage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Data lineage visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Data Encryption at Rest</span>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Data Encryption in Transit</span>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span>Access Control Policies</span>
                        </div>
                        <Badge variant="secondary">Review Required</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Audit Logging</span>
                        </div>
                        <Badge variant="default">Active</Badge>
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
