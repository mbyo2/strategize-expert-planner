
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Navigation, Radio, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UnitsPanelProps {
  selectedUnit: any;
  onStatusUpdate: (count: number) => void;
}

const UnitsPanel: React.FC<UnitsPanelProps> = ({ selectedUnit, onStatusUpdate }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
    
    const channel = supabase
      .channel('tactical_units_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tactical_units' }, 
        () => fetchUnits())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tactical_units')
      .select('*')
      .order('last_contact', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching units:', error);
    } else {
      setUnits(data || []);
      const activeUnits = data?.filter(u => u.status === 'active').length || 0;
      onStatusUpdate(activeUnits);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      compromised: 'destructive',
      destroyed: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getUnitIcon = (unitType: string) => {
    switch (unitType) {
      case 'soldier': return <Users className="h-4 w-4" />;
      case 'vehicle': return <Navigation className="h-4 w-4" />;
      case 'base': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tactical Units
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
          Tactical Units
        </CardTitle>
        <CardDescription>
          Active field assets and positions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {selectedUnit && (
          <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              {getUnitIcon(selectedUnit.unit_type)}
              <span className="font-medium">{selectedUnit.callsign}</span>
              <Badge>SELECTED</Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Type: {selectedUnit.unit_type.toUpperCase()}</div>
              <div>Status: {selectedUnit.status.toUpperCase()}</div>
              <div>Position: {selectedUnit.latitude.toFixed(4)}, {selectedUnit.longitude.toFixed(4)}</div>
              <div>Last Contact: {new Date(selectedUnit.last_contact).toLocaleString()}</div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Radio className="h-3 w-3 mr-1" />
              Establish Comms
            </Button>
          </div>
        )}

        {units.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No units deployed
          </div>
        ) : (
          units.map((unit) => (
            <div key={unit.id} className={`p-3 border rounded-lg space-y-2 bg-card 
              ${selectedUnit?.id === unit.id ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getUnitIcon(unit.unit_type)}
                  <span className="font-medium text-sm">{unit.callsign}</span>
                </div>
                <Badge variant={getStatusBadge(unit.status)}>
                  {unit.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                <div>Type: {unit.unit_type.toUpperCase()}</div>
                <div>Position: {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}</div>
                <div>Last Contact: {new Date(unit.last_contact).toLocaleTimeString()}</div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Radio className="h-3 w-3 mr-1" />
                Contact
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UnitsPanel;
