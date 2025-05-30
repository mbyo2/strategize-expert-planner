
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Cpu, 
  Activity, 
  Zap,
  TrendingUp,
  Shield,
  Network,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AIModel {
  id: string;
  name: string;
  type: 'llm' | 'ml' | 'analytics';
  status: 'active' | 'training' | 'idle' | 'error';
  accuracy: number;
  lastUpdate: string;
  usage: number;
}

interface DeployedModel {
  id: string;
  name: string;
  version: string;
  endpoint: string;
  status: 'deployed' | 'deploying' | 'failed';
  requests: number;
  latency: number;
}

const AIOperationsCenter: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const aiModels: AIModel[] = [
    {
      id: '1',
      name: 'Strategic Insights GPT',
      type: 'llm',
      status: 'active',
      accuracy: 94.5,
      lastUpdate: '2 hours ago',
      usage: 78
    },
    {
      id: '2',
      name: 'Market Prediction Engine',
      type: 'ml',
      status: 'training',
      accuracy: 89.2,
      lastUpdate: '30 minutes ago',
      usage: 45
    },
    {
      id: '3',
      name: 'Risk Assessment AI',
      type: 'analytics',
      status: 'active',
      accuracy: 91.8,
      lastUpdate: '1 hour ago',
      usage: 62
    },
    {
      id: '4',
      name: 'Competitive Intelligence',
      type: 'llm',
      status: 'idle',
      accuracy: 88.7,
      lastUpdate: '4 hours ago',
      usage: 23
    }
  ];

  const deployedModels: DeployedModel[] = [
    {
      id: '1',
      name: 'Strategic Insights GPT',
      version: 'v2.1.0',
      endpoint: '/api/v1/strategic-insights',
      status: 'deployed',
      requests: 1250,
      latency: 120
    },
    {
      id: '2',
      name: 'Risk Assessment AI',
      version: 'v1.8.3',
      endpoint: '/api/v1/risk-assessment',
      status: 'deployed',
      requests: 890,
      latency: 95
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'deployed':
        return 'bg-green-500';
      case 'training':
      case 'deploying':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-blue-500';
      case 'error':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'llm':
        return <Brain className="h-4 w-4" />;
      case 'ml':
        return <Cpu className="h-4 w-4" />;
      case 'analytics':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const handleModelAction = (modelId: string, action: 'start' | 'stop' | 'retrain') => {
    toast.info(`Model ${action}`, {
      description: `${action.charAt(0).toUpperCase() + action.slice(1)}ing AI model...`
    });
  };

  const handleDeploy = (modelId: string) => {
    toast.success('Deployment initiated', {
      description: 'Model is being deployed to production environment...'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Operations Center - Model Management Platform
          </CardTitle>
          <p className="text-muted-foreground">
            Deploy, monitor, and optimize AI/ML models with enterprise-grade MLOps
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="models">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Models
              </TabsTrigger>
              <TabsTrigger value="deployment" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Deployment
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="operations" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Operations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="models">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">AI Model Registry</h3>
                  <Button>
                    <Brain className="h-4 w-4 mr-2" />
                    Register New Model
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiModels.map((model) => (
                    <Card key={model.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(model.type)}
                            <h3 className="font-semibold">{model.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
                            <Badge variant="outline">{model.type.toUpperCase()}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span>{model.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Accuracy:</span>
                            <span className="text-green-600 font-semibold">{model.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Usage:</span>
                            <span>{model.usage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Update:</span>
                            <span>{model.lastUpdate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleModelAction(model.id, model.status === 'active' ? 'stop' : 'start')}
                          >
                            {model.status === 'active' ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                            {model.status === 'active' ? 'Stop' : 'Start'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeploy(model.id)}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Deploy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="deployment">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Production Deployments</h3>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    New Deployment
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {deployedModels.map((model) => (
                    <Card key={model.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{model.name}</h4>
                              <Badge variant="outline">{model.version}</Badge>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
                                <span className="text-sm">{model.status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{model.endpoint}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Requests: </span>
                              <span className="font-semibold">{model.requests.toLocaleString()}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Latency: </span>
                              <span className="font-semibold">{model.latency}ms</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="monitoring">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Active Models</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{aiModels.filter(m => m.status === 'active').length}</div>
                      <p className="text-sm text-muted-foreground mt-1">Currently running</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Avg Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {(aiModels.reduce((acc, m) => acc + m.accuracy, 0) / aiModels.length).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Model performance</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">API Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2.1K</div>
                      <p className="text-sm text-muted-foreground mt-1">Last hour</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Avg Latency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {Math.round(deployedModels.reduce((acc, m) => acc + m.latency, 0) / deployedModels.length)}ms
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Response time</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Model Training Pipeline</span>
                        </div>
                        <Badge variant="default">Healthy</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Inference Servers</span>
                        </div>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span>Data Pipeline</span>
                        </div>
                        <Badge variant="secondary">Degraded</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="operations">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>MLOps Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Auto-scaling</h4>
                          <p className="text-sm text-muted-foreground">Automatic resource scaling based on demand</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Model Versioning</h4>
                          <p className="text-sm text-muted-foreground">Automatic versioning and rollback capabilities</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Performance Monitoring</h4>
                          <p className="text-sm text-muted-foreground">Real-time model performance tracking</p>
                        </div>
                        <Badge variant="default">Running</Badge>
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

export default AIOperationsCenter;
