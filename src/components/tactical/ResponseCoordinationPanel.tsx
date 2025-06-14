
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Megaphone, Droplets, Wind, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ResponseCoordinationPanelProps {
  onStatusUpdate: (count: number) => void;
}

const ResponseCoordinationPanel: React.FC<ResponseCoordinationPanelProps> = ({ onStatusUpdate }) => {
  const [responseTeams, setResponseTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponseTeams();
  }, []);

  const fetchResponseTeams = async () => {
    setLoading(true);
    // Mock response coordination data
    const mockData = [
      {
        id: '1',
        team_type: 'riot_control',
        unit_callsign: 'RC-Alpha',
        personnel_count: 12,
        status: 'standby',
        equipment: ['riot_shields', 'tear_gas', 'water_cannon'],
        location: 'Station 7',
        response_time: '5 minutes',
        specialization: 'crowd_dispersal'
      },
      {
        id: '2',
        team_type: 'negotiation',
        unit_callsign: 'NEG-1',
        personnel_count: 3,
        status: 'deployed',
        equipment: ['megaphones', 'mobile_comm', 'interpreter'],
        location: 'Central Square',
        response_time: 'On Site',
        specialization: 'crisis_communication'
      },
      {
        id: '3',
        team_type: 'medical_support',
        unit_callsign: 'MED-Support',
        personnel_count: 8,
        status: 'standby',
        equipment: ['ambulances', 'first_aid', 'decontamination'],
        location: 'Hospital Base',
        response_time: '7 minutes',
        specialization: 'emergency_care'
      },
      {
        id: '4',
        team_type: 'surveillance',
        unit_callsign: 'SURV-Team',
        personnel_count: 6,
        status: 'active',
        equipment: ['drones', 'cameras', 'intelligence_gear'],
        location: 'Mobile Unit',
        response_time: 'Ongoing',
        specialization: 'intelligence_gathering'
      }
    ];
    
    setResponseTeams(mockData);
    onStatusUpdate(mockData.filter(team => team.status === 'deployed').length);
    setLoading(false);
  };

  const getTeamIcon = (type: string) => {
    switch (type) {
      case 'riot_control': return <Shield className="h-4 w-4" />;
      case 'negotiation': return <Megaphone className="h-4 w-4" />;
      case 'medical_support': return <Users className="h-4 w-4" />;
      case 'surveillance': return <Users className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      standby: 'secondary',
      deployed: 'default',
      active: 'default',
      returning: 'outline',
      offline: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const deployTeam = (teamId: string, teamCallsign: string) => {
    toast.success(`${teamCallsign} deployment authorized`, {
      description: 'Team is moving to designated position'
    });
  };

  const initiateNonLethalResponse = (responseType: string) => {
    toast.warning(`${responseType} protocol initiated`, {
      description: 'Non-lethal crowd control measures activated'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Response Coordination
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
          <Shield className="h-4 w-4" />
          Response Coordination
        </CardTitle>
        <CardDescription>
          Non-lethal response teams and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {responseTeams.map((team) => (
            <div key={team.id} className="p-3 border rounded-lg space-y-2 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTeamIcon(team.team_type)}
                  <span className="font-medium text-sm">{team.unit_callsign}</span>
                </div>
                <Badge variant={getStatusBadge(team.status)}>
                  {team.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Personnel: {team.personnel_count}</span>
                  <span>ETA: {team.response_time}</span>
                </div>
                <div>Specialization: {team.specialization.replace('_', ' ').toUpperCase()}</div>
                <div>Location: {team.location}</div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => deployTeam(team.id, team.unit_callsign)}
                disabled={team.status === 'deployed'}
              >
                {team.status === 'deployed' ? 'Currently Deployed' : 'Deploy Team'}
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-3">
          <div className="text-sm font-semibold mb-2">Quick Response Options</div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => initiateNonLethalResponse('Audio Warning')}
            >
              <Megaphone className="h-3 w-3 mr-1" />
              Audio Warning
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => initiateNonLethalResponse('Water Dispersal')}
            >
              <Droplets className="h-3 w-3 mr-1" />
              Water Cannon
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => initiateNonLethalResponse('Tear Gas')}
            >
              <Wind className="h-3 w-3 mr-1" />
              Tear Gas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => initiateNonLethalResponse('Barrier Deployment')}
            >
              <Shield className="h-3 w-3 mr-1" />
              Barriers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseCoordinationPanel;
