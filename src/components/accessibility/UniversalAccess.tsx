
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Universal, 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Heart,
  Shield,
  Settings,
  Users
} from 'lucide-react';
import BattlefieldMode from '@/components/military/BattlefieldMode';
import LLMConnector from '@/components/ai/LLMConnector';
import A11yMenu from '@/components/a11y/A11yMenu';

interface AccessibilityProfile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ACCESSIBILITY_PROFILES: AccessibilityProfile[] = [
  {
    id: 'military',
    name: 'Military/Tactical',
    description: 'Optimized for battlefield and high-stress environments',
    icon: <Shield className="h-5 w-5" />,
    features: [
      'High contrast for all lighting conditions',
      'Silent operation modes',
      'Emergency alerts and protocols',
      'Secure communications',
      'Offline functionality'
    ]
  },
  {
    id: 'visual',
    name: 'Visual Impairment',
    description: 'Enhanced for users with visual disabilities',
    icon: <Eye className="h-5 w-5" />,
    features: [
      'Screen reader compatibility',
      'High contrast themes',
      'Large text options',
      'Voice navigation',
      'Braille support ready'
    ]
  },
  {
    id: 'hearing',
    name: 'Hearing Impairment',
    description: 'Optimized for deaf and hard-of-hearing users',
    icon: <Ear className="h-5 w-5" />,
    features: [
      'Visual alerts and notifications',
      'Closed captioning for audio',
      'Sign language support',
      'Vibration feedback',
      'Text-based communication'
    ]
  },
  {
    id: 'motor',
    name: 'Motor Disabilities',
    description: 'Adapted for users with limited mobility',
    icon: <Hand className="h-5 w-5" />,
    features: [
      'Voice control',
      'Eye tracking support',
      'Large touch targets',
      'Switch navigation',
      'Gesture alternatives'
    ]
  },
  {
    id: 'cognitive',
    name: 'Cognitive Support',
    description: 'Simplified for cognitive disabilities',
    icon: <Brain className="h-5 w-5" />,
    features: [
      'Simplified interface',
      'Clear navigation',
      'Memory aids',
      'Step-by-step guidance',
      'Error prevention'
    ]
  },
  {
    id: 'elderly',
    name: 'Senior-Friendly',
    description: 'Optimized for older adults',
    icon: <Heart className="h-5 w-5" />,
    features: [
      'Large fonts and buttons',
      'Simple navigation',
      'Clear instructions',
      'Medical emergency features',
      'Family connectivity'
    ]
  }
];

const UniversalAccess: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const applyProfile = (profileId: string) => {
    setSelectedProfile(profileId);
    const profile = ACCESSIBILITY_PROFILES.find(p => p.id === profileId);
    
    if (profile) {
      // Apply profile-specific settings
      const root = document.documentElement;
      
      // Remove existing profile classes
      ACCESSIBILITY_PROFILES.forEach(p => {
        root.classList.remove(`profile-${p.id}`);
      });
      
      // Add new profile class
      root.classList.add(`profile-${profileId}`);
      
      // Apply specific optimizations
      switch (profileId) {
        case 'military':
          root.style.setProperty('--font-size-base', '18px');
          root.style.setProperty('--button-min-height', '48px');
          break;
        case 'visual':
          root.style.setProperty('--font-size-base', '20px');
          root.style.setProperty('--line-height', '1.8');
          break;
        case 'motor':
          root.style.setProperty('--touch-target-min', '48px');
          root.style.setProperty('--button-padding', '16px');
          break;
        case 'elderly':
          root.style.setProperty('--font-size-base', '22px');
          root.style.setProperty('--button-min-height', '56px');
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Universal className="h-6 w-6" />
            Universal Access Center
          </CardTitle>
          <CardDescription>
            Making the software accessible to people from all walks of life
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="profiles">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profiles
              </TabsTrigger>
              <TabsTrigger value="military" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Military
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI/LLM
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profiles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACCESSIBILITY_PROFILES.map((profile) => (
                  <Card 
                    key={profile.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProfile === profile.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => applyProfile(profile.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {profile.icon}
                        {profile.name}
                        {selectedProfile === profile.id && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {profile.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {profile.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedProfile && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Active Profile:</strong> {ACCESSIBILITY_PROFILES.find(p => p.id === selectedProfile)?.name}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSelectedProfile(null)}
                  >
                    Reset to Default
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="military">
              <BattlefieldMode />
            </TabsContent>
            
            <TabsContent value="ai">
              <LLMConnector />
            </TabsContent>
            
            <TabsContent value="settings">
              <A11yMenu />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalAccess;
