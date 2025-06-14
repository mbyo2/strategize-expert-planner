
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Map, 
  Crosshair, 
  AlertTriangle, 
  Radio, 
  Users, 
  Target,
  Radio as RadioIcon,
  Eye,
  Shield,
  Navigation,
  Camera,
  Megaphone
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import TacticalMapView from '@/components/tactical/TacticalMapView';
import ThreatPanel from '@/components/tactical/ThreatPanel';
import DronePanel from '@/components/tactical/DronePanel';
import AIRecommendationsPanel from '@/components/tactical/AIRecommendationsPanel';
import UnitsPanel from '@/components/tactical/UnitsPanel';
import CrowdMonitoringPanel from '@/components/tactical/CrowdMonitoringPanel';
import SurveillancePanel from '@/components/tactical/SurveillancePanel';
import ResponseCoordinationPanel from '@/components/tactical/ResponseCoordinationPanel';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const TacticalMap = () => {
  const { session } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState('map');
  const [mapCenter, setMapCenter] = useState({ lat: 33.3128, lng: 44.3615 }); // Baghdad coordinates
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Real-time status counters
  const [status, setStatus] = useState({
    activeUnits: 0,
    activeDrones: 0,
    threats: 0,
    recommendations: 0,
    crowdEvents: 0,
    surveillanceAssets: 0,
    responseTeams: 0
  });

  return (
    <PageLayout 
      title="Battlefield Command Center"
      subtitle="Comprehensive tactical operations and crowd control management system"
      icon={<Map className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Units</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{status.activeUnits}</div>
              <p className="text-xs text-muted-foreground">
                Operational assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drones Active</CardTitle>
              <Radio className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{status.activeDrones}</div>
              <p className="text-xs text-muted-foreground">
                Surveillance coverage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{status.threats}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crowd Events</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{status.crowdEvents}</div>
              <p className="text-xs text-muted-foreground">
                Active monitoring
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Surveillance</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{status.surveillanceAssets}</div>
              <p className="text-xs text-muted-foreground">
                Assets online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Teams</CardTitle>
              <Shield className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{status.responseTeams}</div>
              <p className="text-xs text-muted-foreground">
                Deployed teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Target className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{status.recommendations}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Map View */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crosshair className="h-5 w-5" />
                    Tactical Battlefield Map
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50">
                      <RadioIcon className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-1" />
                      Center Map
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <TacticalMapView 
                  center={mapCenter}
                  onUnitSelect={setSelectedUnit}
                  selectedUnit={selectedUnit}
                />
              </CardContent>
            </Card>
          </div>

          {/* Side Panels */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="threats" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Threats
                </TabsTrigger>
                <TabsTrigger value="crowd" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Crowds
                </TabsTrigger>
                <TabsTrigger value="surveillance" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Intel
                </TabsTrigger>
                <TabsTrigger value="response" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Response
                </TabsTrigger>
              </TabsList>

              <TabsContent value="threats" className="mt-4">
                <ThreatPanel onStatusUpdate={(count) => setStatus(prev => ({ ...prev, threats: count }))} />
              </TabsContent>

              <TabsContent value="crowd" className="mt-4">
                <CrowdMonitoringPanel onStatusUpdate={(count) => setStatus(prev => ({ ...prev, crowdEvents: count }))} />
              </TabsContent>

              <TabsContent value="surveillance" className="mt-4">
                <SurveillancePanel onStatusUpdate={(count) => setStatus(prev => ({ ...prev, surveillanceAssets: count }))} />
              </TabsContent>

              <TabsContent value="response" className="mt-4">
                <ResponseCoordinationPanel onStatusUpdate={(count) => setStatus(prev => ({ ...prev, responseTeams: count }))} />
              </TabsContent>
            </Tabs>

            {/* Drone Panel - Always visible */}
            <DronePanel onStatusUpdate={(count) => setStatus(prev => ({ ...prev, activeDrones: count }))} />

            {/* AI Recommendations */}
            <AIRecommendationsPanel 
              onStatusUpdate={(count) => setStatus(prev => ({ ...prev, recommendations: count }))} 
            />

            {/* Units Panel */}
            <UnitsPanel 
              selectedUnit={selectedUnit}
              onStatusUpdate={(count) => setStatus(prev => ({ ...prev, activeUnits: count }))}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TacticalMap;
