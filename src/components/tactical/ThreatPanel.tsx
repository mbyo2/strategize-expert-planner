
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatPanelProps {
  onStatusUpdate: (count: number) => void;
}

const ThreatPanel: React.FC<ThreatPanelProps> = ({ onStatusUpdate }) => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
    
    const channel = supabase
      .channel('threat_intelligence_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'threat_intelligence' }, 
        () => fetchThreats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchThreats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('threat_intelligence')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching threats:', error);
    } else {
      setThreats(data || []);
      onStatusUpdate(data?.length || 0);
    }
    setLoading(false);
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[severity] || 'secondary';
  };

  const acknowledgeeThreat = async (threatId: string) => {
    const { error } = await supabase
      .from('threat_intelligence')
      .update({ verified: true })
      .eq('id', threatId);

    if (error) {
      toast.error('Failed to acknowledge threat');
    } else {
      toast.success('Threat acknowledged');
      fetchThreats();
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Threat Intelligence
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
          <AlertTriangle className="h-4 w-4" />
          Threat Intelligence
        </CardTitle>
        <CardDescription>
          Active threats requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {threats.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No active threats detected
          </div>
        ) : (
          threats.map((threat) => (
            <div key={threat.id} className="p-3 border rounded-lg space-y-2 bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityBadge(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {threat.threat_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{threat.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(threat.created_at)}
                    </span>
                    <span>Source: {threat.source.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                <Button
                  variant={threat.verified ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => acknowledgeeThreat(threat.id)}
                  disabled={threat.verified}
                >
                  {threat.verified ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatPanel;
