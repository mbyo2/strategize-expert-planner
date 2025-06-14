
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Eye, Camera, Megaphone, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CrowdMonitoringPanelProps {
  onStatusUpdate: (count: number) => void;
}

const CrowdMonitoringPanel: React.FC<CrowdMonitoringPanelProps> = ({ onStatusUpdate }) => {
  const [crowdEvents, setCrowdEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrowdEvents();
    
    const channel = supabase
      .channel('crowd_events_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crowd_events' }, 
        () => fetchCrowdEvents())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCrowdEvents = async () => {
    setLoading(true);
    // For demo purposes, using mock data since we don't have the crowd_events table yet
    const mockData = [
      {
        id: '1',
        location: 'Central Square',
        crowd_size: 250,
        density_level: 'medium',
        threat_level: 'low',
        activity_type: 'peaceful_protest',
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        police_units_deployed: 3,
        emergency_services: true,
        containment_status: 'monitored'
      },
      {
        id: '2',
        location: 'University Campus',
        crowd_size: 150,
        density_level: 'low',
        threat_level: 'low',
        activity_type: 'student_gathering',
        start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        police_units_deployed: 1,
        emergency_services: false,
        containment_status: 'observation'
      },
      {
        id: '3',
        location: 'Government Building',
        crowd_size: 500,
        density_level: 'high',
        threat_level: 'medium',
        activity_type: 'demonstration',
        start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        police_units_deployed: 8,
        emergency_services: true,
        containment_status: 'active_management'
      }
    ];
    
    setCrowdEvents(mockData);
    onStatusUpdate(mockData.length);
    setLoading(false);
  };

  const getThreatLevelBadge = (level: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default', 
      high: 'destructive',
      critical: 'destructive'
    };
    return variants[level] || 'secondary';
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Crowd Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Crowd Monitoring
        </CardTitle>
        <CardDescription>
          Active crowd events and demonstrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {crowdEvents.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No active crowd events
          </div>
        ) : (
          crowdEvents.map((event) => (
            <div key={event.id} className="p-3 border rounded-lg space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{event.location}</span>
                  <Badge variant={getThreatLevelBadge(event.threat_level)}>
                    {event.threat_level.toUpperCase()}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {event.activity_type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Crowd Size: {event.crowd_size} people</span>
                  <span>Police Units: {event.police_units_deployed}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Density Level</span>
                    <span className="font-medium">{event.density_level.toUpperCase()}</span>
                  </div>
                  <Progress 
                    value={event.density_level === 'low' ? 30 : event.density_level === 'medium' ? 60 : 90} 
                    className="h-2"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <div>Status: {event.containment_status.replace('_', ' ').toUpperCase()}</div>
                <div>Duration: {Math.floor((Date.now() - new Date(event.start_time).getTime()) / (1000 * 60))} minutes</div>
                <div>Emergency Services: {event.emergency_services ? 'On Site' : 'Standby'}</div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Camera className="h-3 w-3 mr-1" />
                  Live Feed
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Megaphone className="h-3 w-3 mr-1" />
                  Broadcast
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CrowdMonitoringPanel;
