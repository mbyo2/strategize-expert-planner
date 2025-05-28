
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Send, Settings, Zap, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  requiresKey: boolean;
  endpoint?: string;
}

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    requiresKey: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    requiresKey: true,
  },
  {
    id: 'local',
    name: 'Local LLM',
    models: ['llama-3.1', 'mistral-7b', 'custom'],
    requiresKey: false,
    endpoint: 'http://localhost:11434',
  },
  {
    id: 'military',
    name: 'Secure Military LLM',
    models: ['classified-model-1', 'tactical-ai', 'secure-gpt'],
    requiresKey: true,
    endpoint: 'https://secure-military-api.mil',
  },
];

const LLMConnector: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useLocalStorage('llm-provider', 'openai');
  const [selectedModel, setSelectedModel] = useLocalStorage('llm-model', 'gpt-4o-mini');
  const [apiKey, setApiKey] = useLocalStorage('llm-api-key', '');
  const [customEndpoint, setCustomEndpoint] = useLocalStorage('llm-endpoint', '');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');

  const currentProvider = LLM_PROVIDERS.find(p => p.id === selectedProvider);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (currentProvider?.requiresKey && !apiKey) {
        throw new Error('API key required');
      }
      
      setConnectionStatus('connected');
      toast.success('LLM Connection Successful', {
        description: `Connected to ${currentProvider?.name}`,
      });
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Connection Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate LLM response - in production, this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `Response from ${currentProvider?.name} (${selectedModel}):

This is a simulated response for demonstration. In a real implementation, this would:
1. Send your prompt to the selected LLM provider
2. Handle authentication with API keys
3. Process the response and display it here
4. Support streaming responses for real-time feedback

Your prompt: "${prompt}"

For military use, this system would integrate with secure, classified LLM endpoints that meet security requirements for battlefield operations.`;

      setResponse(mockResponse);
      toast.success('Response received');
    } catch (error) {
      toast.error('Failed to get response', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          LLM Integration
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Connect to Large Language Models for AI-powered assistance in strategic planning and analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">LLM Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          {provider.id === 'military' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentProvider?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {currentProvider?.requiresKey && (
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
            )}
            
            {currentProvider?.endpoint && (
              <div className="space-y-2">
                <Label htmlFor="endpoint">Custom Endpoint</Label>
                <Input
                  id="endpoint"
                  value={customEndpoint || currentProvider.endpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="API endpoint URL"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={testConnection} disabled={isLoading}>
                <Zap className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </div>
            
            {selectedProvider === 'military' && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <strong>Military/Classified Integration</strong>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  This provider connects to secure, classified LLM endpoints. Ensure you have proper clearance 
                  and are on a secure network before proceeding.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Send Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt for the LLM..."
                rows={4}
              />
            </div>
            
            <Button 
              onClick={sendPrompt} 
              disabled={isLoading || connectionStatus !== 'connected'}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Send Prompt'}
            </Button>
            
            {response && (
              <div className="space-y-2">
                <Label>Response</Label>
                <Textarea
                  value={response}
                  readOnly
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LLMConnector;
