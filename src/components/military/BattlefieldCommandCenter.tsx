
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Eye, 
  Users, 
  Radio, 
  AlertTriangle, 
  Camera, 
  Megaphone,
  Target,
  Lock,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const BattlefieldCommandCenter: React.FC = () => {
  const [operationalMode, setOperationalMode] = useState('standard');
  const [crowdControlMode, setCrowdControlMode] = useState(false);
  const [emergencyProtocols, setEmergencyProtocols] = useState(false);
  const [massiveDataCollection, setMassiveDataCollection] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(false);

  const activateEmergencyProtocols = () => {
    setEmergencyProtocols(true);
    setCrowdControlMode(true);
    setMassiveDataCollection(true);
    setRealTimeAnalysis(true);
    setOperationalMode('emergency');
    
    toast.error('Emergency Protocols Activated', {
      description: 'All systems are now in maximum alert mode with enhanced surveillance'
    });
  };

  const activateCrowdControl = () => {
    setCrowdControlMode(!crowdControlMode);
    if (!crowdControlMode) {
      toast.warning('Crowd Control Mode Activated', {
        description: 'Enhanced monitoring and non-lethal response capabilities enabled'
      });
    } else {
      toast.info('Crowd Control Mode Deactivated');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Battlefield Command Center
          </CardTitle>
          <CardDescription>
            Advanced command and control for military and civilian operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operational Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Operational Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={operationalMode === 'emergency' ? 'destructive' : 'default'} className="text-lg p-2">
                  {operationalMode.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Crowd Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={crowdControlMode ? 'destructive' : 'secondary'} className="text-lg p-2">
                  {crowdControlMode ? 'ACTIVE' : 'STANDBY'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={massiveDataCollection ? 'destructive' : 'secondary'} className="text-lg p-2">
                  {massiveDataCollection ? 'MAXIMUM' : 'STANDARD'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Controls */}
          <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
            <h4 className="font-semibold mb-4 text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Response Controls
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant={emergencyProtocols ? "destructive" : "outline"}
                onClick={activateEmergencyProtocols}
                className="h-12"
                disabled={emergencyProtocols}
              >
                <Zap className="h-4 w-4 mr-2" />
                {emergencyProtocols ? 'Emergency Active' : 'Activate Emergency Protocols'}
              </Button>
              
              <Button 
                variant={crowdControlMode ? "destructive" : "outline"}
                onClick={activateCrowdControl}
                className="h-12"
              >
                <Shield className="h-4 w-4 mr-2" />
                {crowdControlMode ? 'Crowd Control Active' : 'Enable Crowd Control'}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="surveillance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="surveillance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <div>
                      <Label htmlFor="facial-recognition">Facial Recognition</Label>
                      <p className="text-xs text-muted-foreground">AI-powered identification</p>
                    </div>
                  </div>
                  <Switch id="facial-recognition" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <Label htmlFor="behavioral-analysis">Behavioral Analysis</Label>
                      <p className="text-xs text-muted-foreground">Crowd behavior monitoring</p>
                    </div>
                  </div>
                  <Switch id="behavioral-analysis" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4" />
                    <div>
                      <Label htmlFor="signal-intelligence">Signal Intelligence</Label>
                      <p className="text-xs text-muted-foreground">Communications monitoring</p>
                    </div>
                  </div>
                  <Switch 
                    id="signal-intelligence" 
                    checked={massiveDataCollection}
                    onCheckedChange={setMassiveDataCollection}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <div>
                      <Label htmlFor="predictive-analysis">Predictive Analysis</Label>
                      <p className="text-xs text-muted-foreground">AI threat prediction</p>
                    </div>
                  </div>
                  <Switch 
                    id="predictive-analysis"
                    checked={realTimeAnalysis}
                    onCheckedChange={setRealTimeAnalysis}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Social Media Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">Real-time analysis of social networks</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor Platforms
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Communication Intercept</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">Mobile and internet communications</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Radio className="h-3 w-3 mr-1" />
                      Active Monitoring
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col">
                  <Megaphone className="h-4 w-4 mb-1" />
                  <span className="text-xs">Audio Warning</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col">
                  <Shield className="h-4 w-4 mb-1" />
                  <span className="text-xs">Deploy Barriers</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col">
                  <Users className="h-4 w-4 mb-1" />
                  <span className="text-xs">Mobile Teams</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col">
                  <Lock className="h-4 w-4 mb-1" />
                  <span className="text-xs">Area Lockdown</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Crowd Violence Risk</span>
                        <Badge variant="destructive">HIGH</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Escalation Probability</span>
                        <Badge variant="default">MEDIUM</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Optimal Response</span>
                        <Badge variant="secondary">NON-LETHAL</Badge>
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

export default BattlefieldCommandCenter;
