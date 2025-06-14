import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Eye, Volume, Wifi, Lock, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import BattlefieldCommandCenter from './BattlefieldCommandCenter';

const BattlefieldMode: React.FC = () => {
  const [tacticalMode, setTacticalMode] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [secureComms, setSecureComms] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleTacticalToggle = () => {
    setTacticalMode(!tacticalMode);
    if (!tacticalMode) {
      // Enable all battlefield optimizations
      setHighContrast(true);
      setSilentMode(true);
      setSecureComms(true);
      toast.success('Tactical mode activated', {
        description: 'Interface optimized for battlefield conditions'
      });
    } else {
      toast.info('Tactical mode deactivated');
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Battlefield Command Center */}
      <BattlefieldCommandCenter />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Advanced Battlefield Configuration
          </CardTitle>
          <CardDescription>
            Configure tactical systems for military and civilian crowd control operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="tactical-mode" className="font-semibold">
                  Tactical Mode
                </Label>
                {tacticalMode && <Badge variant="destructive">ACTIVE</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Enable all battlefield optimizations at once
              </p>
            </div>
            <Switch
              id="tactical-mode"
              checked={tacticalMode}
              onCheckedChange={handleTacticalToggle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Volume className="h-4 w-4" />
                <div>
                  <Label htmlFor="silent-mode">Silent Operation</Label>
                  <p className="text-xs text-muted-foreground">No audio alerts</p>
                </div>
              </div>
              <Switch
                id="silent-mode"
                checked={silentMode}
                onCheckedChange={setSilentMode}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <div>
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">Enhanced visibility</p>
                </div>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <div>
                  <Label htmlFor="secure-comms">Secure Communications</Label>
                  <p className="text-xs text-muted-foreground">Encrypted channels</p>
                </div>
              </div>
              <Switch
                id="secure-comms"
                checked={secureComms}
                onCheckedChange={setSecureComms}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <div>
                  <Label htmlFor="offline-mode">Offline Operation</Label>
                  <p className="text-xs text-muted-foreground">Local data cache</p>
                </div>
              </div>
              <Switch
                id="offline-mode"
                checked={offlineMode}
                onCheckedChange={setOfflineMode}
              />
            </div>

            {/* New Crowd Control Features */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div>
                  <Label htmlFor="crowd-analysis">Crowd Analysis</Label>
                  <p className="text-xs text-muted-foreground">AI-powered crowd behavior</p>
                </div>
              </div>
              <Switch id="crowd-analysis" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <Label htmlFor="threat-prediction">Threat Prediction</Label>
                  <p className="text-xs text-muted-foreground">Predictive threat modeling</p>
                </div>
              </div>
              <Switch id="threat-prediction" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Emergency Protocols</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                Emergency Alert
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-1" />
                Secure Wipe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BattlefieldMode;
