
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Settings, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LLMProvider {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  endpoint?: string;
}

const LLMConnector: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [testPrompt, setTestPrompt] = useState('Hello, can you help me with strategic analysis?');
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; content: string}>>([]);

  const [providers] = useState<LLMProvider[]>([
    { id: 'openai', name: 'OpenAI GPT', status: 'disconnected' },
    { id: 'anthropic', name: 'Anthropic Claude', status: 'disconnected' },
    { id: 'google', name: 'Google Gemini', status: 'disconnected' },
    { id: 'local', name: 'Local Model', status: 'disconnected' },
    { id: 'custom', name: 'Custom Endpoint', status: 'disconnected' }
  ]);

  const handleConnect = async () => {
    if (!selectedProvider || !apiKey) {
      toast.error('Please select a provider and enter API key');
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection test
    setTimeout(() => {
      setIsConnecting(false);
      toast.success('LLM connection established', {
        description: `Connected to ${providers.find(p => p.id === selectedProvider)?.name}`
      });
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (!testPrompt.trim()) return;

    // Simulate AI response
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: testPrompt },
      { role: 'assistant', content: 'I am ready to assist with strategic analysis and planning. How can I help you today?' }
    ]);
    setTestPrompt('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Large Language Model Integration
          </CardTitle>
          <CardDescription>
            Connect to AI models for strategic analysis and decision support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider">AI Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(provider.status)}
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endpoint">Custom Endpoint (Optional)</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.example.com/v1"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Connect to AI
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Test Connection
              </h4>
              
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Test your AI connection here
                  </p>
                ) : (
                  chatHistory.map((message, index) => (
                    <div key={index} className={`p-2 rounded ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-4' 
                        : 'bg-muted mr-4'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Enter test prompt..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="min-h-[60px]"
                />
                <Button 
                  onClick={handleTestConnection}
                  size="icon"
                  className="self-end"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Available AI Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium">Strategic Analysis</h5>
                <p className="text-xs text-muted-foreground">Market insights and recommendations</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium">Risk Assessment</h5>
                <p className="text-xs text-muted-foreground">Automated risk evaluation</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium">Decision Support</h5>
                <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMConnector;
