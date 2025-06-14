
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Drone, Battery, Eye, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DronePanelProps {
  onStatusUpdate: (count: number) => void;
}

const DronePanel: React.FC<DronePanelProps> = ({ onStatusUpdate }) => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrones();
    
    const channel = supabase
      .channel('drones_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drones' }, 
        () => fetchDrones())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDrones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('drones')
      .select('*')
      .order('last_telemetry', { ascending: false });

    if (error) {
      console.error('Error fetching drones:', error);
    } else {
      setDrones(data || []);
      const activeDrones = data?.filter(d => d.status === 'operational').length || 0;
      onStatusUpdate(activeDrones);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      operational: 'default',
      maintenance: 'secondary',
      lost: 'destructive',
      returning: 'outline'
    };
    return variants[status] || 'secondary';
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Drone className="h-4 w-4" />
            Drone Fleet
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
          <Drone className="h-4 w-4" />
          Drone Fleet
        </CardTitle>
        <CardDescription>
          Active surveillance and reconnaissance assets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {drones.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No drones deployed
          </div>
        ) : (
          drones.map((drone) => (
            <div key={drone.id} className="p-3 border rounded-lg space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{drone.drone_id}</span>
                  <Badge variant={getStatusBadge(drone.status)}>
                    {drone.status.toUpperCase()}
                  </Badge>
                </div>
                {drone.mission_type && (
                  <Badge variant="outline" className="text-xs">
                    {drone.mission_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Battery className="h-3 w-3" />
                    Battery
                  </span>
                  <span className="font-medium">{drone.battery_level}%</span>
                </div>
                <Progress 
                  value={drone.battery_level} 
                  className="h-2"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                <div>Model: {drone.model}</div>
                <div>Altitude: {drone.altitude}m</div>
                <div>Last Contact: {new Date(drone.last_telemetry).toLocaleTimeString()}</div>
              </div>

              <div className="flex gap-2">
                {drone.camera_feed_url && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Feed
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1">
                  <Navigation className="h-3 w-3 mr-1" />
                  Control
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default DronePanel;
