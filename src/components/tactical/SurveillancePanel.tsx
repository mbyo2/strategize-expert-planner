
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Camera, Satellite, Radio, AlertTriangle, Shield } from 'lucide-react';

interface SurveillancePanelProps {
  onStatusUpdate: (count: number) => void;
}

const SurveillancePanel: React.FC<SurveillancePanelProps> = ({ onStatusUpdate }) => {
  const [surveillanceAssets, setSurveillanceAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveillanceAssets();
  }, []);

  const fetchSurveillanceAssets = async () => {
    setLoading(true);
    // Mock surveillance data
    const mockData = [
      {
        id: '1',
        asset_type: 'cctv_camera',
        location: 'Main Street Junction',
        status: 'active',
        coverage_radius: 100,
        recording: true,
        facial_recognition: true,
        crowd_analysis: true,
        last_maintenance: '2024-06-10',
        alerts_count: 3
      },
      {
        id: '2',
        asset_type: 'satellite',
        location: 'Orbital Coverage Zone 1',
        status: 'active',
        coverage_radius: 50000,
        recording: true,
        facial_recognition: false,
        crowd_analysis: true,
        last_maintenance: '2024-06-01',
        alerts_count: 0
      },
      {
        id: '3',
        asset_type: 'surveillance_drone',
        location: 'City Center Patrol',
        status: 'active',
        coverage_radius: 500,
        recording: true,
        facial_recognition: true,
        crowd_analysis: true,
        last_maintenance: '2024-06-14',
        alerts_count: 1
      },
      {
        id: '4',
        asset_type: 'signal_intelligence',
        location: 'Communications Hub Alpha',
        status: 'monitoring',
        coverage_radius: 10000,
        recording: true,
        facial_recognition: false,
        crowd_analysis: false,
        last_maintenance: '2024-06-12',
        alerts_count: 7
      }
    ];
    
    setSurveillanceAssets(mockData);
    onStatusUpdate(mockData.filter(asset => asset.status === 'active').length);
    setLoading(false);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'cctv_camera': return <Camera className="h-4 w-4" />;
      case 'satellite': return <Satellite className="h-4 w-4" />;
      case 'surveillance_drone': return <Eye className="h-4 w-4" />;
      case 'signal_intelligence': return <Radio className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      monitoring: 'secondary',
      maintenance: 'outline',
      offline: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Surveillance Network
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
          <Eye className="h-4 w-4" />
          Surveillance Network
        </CardTitle>
        <CardDescription>
          Active monitoring and intelligence assets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {surveillanceAssets.map((asset) => (
          <div key={asset.id} className="p-3 border rounded-lg space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getAssetIcon(asset.asset_type)}
                <span className="font-medium text-sm">{asset.location}</span>
              </div>
              <Badge variant={getStatusBadge(asset.status)}>
                {asset.status.toUpperCase()}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Type: {asset.asset_type.replace('_', ' ').toUpperCase()}</span>
                <span>Range: {asset.coverage_radius}m</span>
              </div>
              <div className="flex justify-between">
                <span>Recording: {asset.recording ? 'Yes' : 'No'}</span>
                <span>Face Recognition: {asset.facial_recognition ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Crowd Analysis: {asset.crowd_analysis ? 'Yes' : 'No'}</span>
                <span>Alerts: {asset.alerts_count}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                View Feed
              </Button>
              {asset.alerts_count > 0 && (
                <Button variant="outline" size="sm" className="flex-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Alerts ({asset.alerts_count})
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SurveillancePanel;
