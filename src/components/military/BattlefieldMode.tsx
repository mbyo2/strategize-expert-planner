
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Sun, Moon, Eye, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface BattlefieldModeProps {
  className?: string;
}

const BattlefieldMode: React.FC<BattlefieldModeProps> = ({ className }) => {
  const [battlefieldMode, setBattlefieldMode] = useLocalStorage('battlefield-mode', false);
  const [nightVision, setNightVision] = useLocalStorage('night-vision', false);
  const [highContrast, setHighContrast] = useLocalStorage('military-high-contrast', false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('military-sound', true);
  const [emergencyMode, setEmergencyMode] = useLocalStorage('emergency-mode', false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply battlefield mode styles
  useEffect(() => {
    const root = document.documentElement;
    
    if (battlefieldMode) {
      root.classList.add('battlefield-mode');
      // Ultra-high contrast for visibility in harsh conditions
      root.style.setProperty('--background', '0 0% 5%');
      root.style.setProperty('--foreground', '0 0% 95%');
      root.style.setProperty('--primary', '120 100% 50%'); // Military green
      root.style.setProperty('--border', '0 0% 30%');
      
      // Increase all font sizes for better visibility
      root.style.setProperty('--font-scale', '1.2');
    } else {
      root.classList.remove('battlefield-mode');
      // Reset to default values
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--border');
      root.style.removeProperty('--font-scale');
    }
    
    if (nightVision) {
      root.classList.add('night-vision');
      // Green tint for night vision
      root.style.setProperty('--background', '120 20% 5%');
      root.style.setProperty('--foreground', '120 100% 80%');
      root.style.filter = 'hue-rotate(90deg) saturate(1.5)';
    } else {
      root.classList.remove('night-vision');
      root.style.removeProperty('filter');
    }
    
    if (highContrast) {
      root.classList.add('military-contrast');
      // Maximum contrast for extreme conditions
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '0 0% 100%');
    } else {
      root.classList.remove('military-contrast');
    }
    
    if (emergencyMode) {
      root.classList.add('emergency-mode');
      // Red theme for emergency situations
      root.style.setProperty('--primary', '0 100% 50%');
      root.style.setProperty('--destructive', '0 100% 70%');
    } else {
      root.classList.remove('emergency-mode');
    }
  }, [battlefieldMode, nightVision, highContrast, emergencyMode]);

  const toggleBattlefieldMode = () => {
    const newMode = !battlefieldMode;
    setBattlefieldMode(newMode);
    
    if (newMode) {
      // Auto-enable optimal settings for battlefield
      setHighContrast(true);
      setSoundEnabled(false); // Silent by default
      toast.success('Battlefield Mode Activated', {
        description: 'Optimized for extreme conditions'
      });
    } else {
      toast.info('Battlefield Mode Deactivated');
    }
  };

  const activateEmergencyMode = () => {
    setEmergencyMode(true);
    setBattlefieldMode(true);
    setHighContrast(true);
    setNightVision(false);
    setSoundEnabled(true); // Enable sound for emergency alerts
    
    toast.error('EMERGENCY MODE ACTIVATED', {
      description: 'All systems optimized for critical operations',
      duration: 10000,
    });
  };

  return (
    <div className={`space-y-4 p-4 border rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h3 className="font-semibold">Military Operations</h3>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>
        {emergencyMode && (
          <Badge variant="destructive" className="animate-pulse">
            EMERGENCY
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="battlefield-mode" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Battlefield Mode
            </Label>
            <Switch
              id="battlefield-mode"
              checked={battlefieldMode}
              onCheckedChange={toggleBattlefieldMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="night-vision" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Night Vision
            </Label>
            <Switch
              id="night-vision"
              checked={nightVision}
              onCheckedChange={setNightVision}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="military-contrast" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Max Contrast
            </Label>
            <Switch
              id="military-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="military-sound" className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Audio Alerts
            </Label>
            <Switch
              id="military-sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={activateEmergencyMode}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            EMERGENCY MODE
          </Button>
          
          <Button 
            onClick={() => setEmergencyMode(false)}
            variant="outline"
            className="w-full"
            size="sm"
            disabled={!emergencyMode}
          >
            Reset Emergency
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Optimized for:
            <ul className="list-disc list-inside mt-1">
              <li>Low-light conditions</li>
              <li>High-stress environments</li>
              <li>Tactical operations</li>
              <li>Emergency response</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlefieldMode;
