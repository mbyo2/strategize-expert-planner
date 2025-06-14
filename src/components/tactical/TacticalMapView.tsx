import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Radio, Users, Target, Navigation } from 'lucide-react';

interface TacticalMapViewProps {
  center: { lat: number; lng: number };
  onUnitSelect: (unit: any) => void;
  selectedUnit: any;
}

const TacticalMapView: React.FC<TacticalMapViewProps> = ({ center, onUnitSelect, selectedUnit }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [units, setUnits] = useState([]);
  const [drones, setDrones] = useState([]);
  const [threats, setThreats] = useState([]);
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    // Fetch initial data
    fetchTacticalData();
    
    // Set up real-time subscriptions
    const unitsChannel = supabase
      .channel('tactical_units_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tactical_units' }, 
        () => fetchUnits())
      .subscribe();

    const dronesChannel = supabase
      .channel('drones_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drones' }, 
        () => fetchDrones())
      .subscribe();

    const threatsChannel = supabase
      .channel('threats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'threat_intelligence' }, 
        () => fetchThreats())
      .subscribe();

    const objectivesChannel = supabase
      .channel('objectives_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mission_objectives' }, 
        () => fetchObjectives())
      .subscribe();

    return () => {
      supabase.removeChannel(unitsChannel);
      supabase.removeChannel(dronesChannel);
      supabase.removeChannel(threatsChannel);
      supabase.removeChannel(objectivesChannel);
    };
  }, []);

  const fetchTacticalData = async () => {
    await Promise.all([
      fetchUnits(),
      fetchDrones(),
      fetchThreats(),
      fetchObjectives()
    ]);
  };

  const fetchUnits = async () => {
    const { data } = await supabase
      .from('tactical_units')
      .select('*')
      .eq('status', 'active');
    if (data) setUnits(data);
  };

  const fetchDrones = async () => {
    const { data } = await supabase
      .from('drones')
      .select('*')
      .eq('status', 'operational');
    if (data) setDrones(data);
  };

  const fetchThreats = async () => {
    const { data } = await supabase
      .from('threat_intelligence')
      .select('*')
      .eq('verified', true);
    if (data) setThreats(data);
  };

  const fetchObjectives = async () => {
    const { data } = await supabase
      .from('mission_objectives')
      .select('*')
      .in('status', ['assigned', 'in_progress']);
    if (data) setObjectives(data);
  };

  const getUnitIcon = (unitType: string) => {
    switch (unitType) {
      case 'soldier': return <Users className="h-4 w-4" />;
      case 'vehicle': return <Navigation className="h-4 w-4" />;
      case 'base': return <Target className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Tactical Units */}
      {units.map((unit) => (
        <div
          key={unit.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer 
            ${selectedUnit?.id === unit.id ? 'scale-110 z-20' : 'z-10'}`}
          style={{
            left: `${50 + (unit.longitude - center.lng) * 100}%`,
            top: `${50 - (unit.latitude - center.lat) * 100}%`
          }}
          onClick={() => onUnitSelect(unit)}
        >
          <div className={`p-2 rounded-full bg-blue-600 text-white shadow-lg 
            ${selectedUnit?.id === unit.id ? 'ring-2 ring-white' : ''}`}>
            {getUnitIcon(unit.unit_type)}
          </div>
          <div className="text-xs text-white text-center mt-1 bg-black bg-opacity-50 px-1 rounded">
            {unit.callsign}
          </div>
        </div>
      ))}

      {/* Drones */}
      {drones.map((drone) => (
        <div
          key={drone.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${50 + (drone.longitude - center.lng) * 100}%`,
            top: `${50 - (drone.latitude - center.lat) * 100}%`
          }}
        >
          <div className="p-2 rounded-full bg-green-600 text-white shadow-lg animate-pulse">
            <Radio className="h-4 w-4" />
          </div>
          <div className="text-xs text-white text-center mt-1 bg-black bg-opacity-50 px-1 rounded">
            {drone.drone_id}
          </div>
        </div>
      ))}

      {/* Threats */}
      {threats.map((threat) => (
        <div
          key={threat.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
          style={{
            left: `${50 + (threat.longitude - center.lng) * 100}%`,
            top: `${50 - (threat.latitude - center.lat) * 100}%`
          }}
        >
          <div className={`p-2 rounded-full text-white shadow-lg animate-bounce ${getSeverityColor(threat.severity)}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-xs text-white text-center mt-1 bg-black bg-opacity-50 px-1 rounded">
            {threat.threat_type.toUpperCase()}
          </div>
        </div>
      ))}

      {/* Mission Objectives */}
      {objectives.map((objective) => (
        <div
          key={objective.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${50 + (objective.longitude - center.lng) * 100}%`,
            top: `${50 - (objective.latitude - center.lat) * 100}%`
          }}
        >
          <div className="p-2 rounded-full bg-purple-600 text-white shadow-lg">
            <Target className="h-4 w-4" />
          </div>
          <div className="text-xs text-white text-center mt-1 bg-black bg-opacity-50 px-1 rounded">
            {objective.objective_type.toUpperCase()}
          </div>
        </div>
      ))}

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
        Lat: {center.lat.toFixed(4)}, Lng: {center.lng.toFixed(4)}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded">
        <div className="text-xs font-semibold mb-2">LEGEND</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Drones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Threats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span>Objectives</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalMapView;
