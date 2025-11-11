
import React, { useState } from 'react';
import { Calendar, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logAuditEvent } from '@/services/auditService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'review' | 'deadline';
}

const CalendarIntegration: React.FC = () => {
  const { session } = useSimpleAuth();
  const user = session?.user || null;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectCalendar = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate calendar connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the calendar integration
      await logAuditEvent({
        action: 'settings_change',
        resource: 'user',
        resourceId: user?.id,
        description: 'User connected calendar integration',
        userId: user?.id,
        severity: 'low',
        metadata: {
          integration: 'calendar',
          action: 'connect'
        }
      });

      // Mock some events
      setEvents([
        {
          id: '1',
          title: 'Strategy Review Meeting',
          date: '2024-02-15T10:00:00Z',
          type: 'meeting'
        },
        {
          id: '2',
          title: 'Q1 Planning Session',
          date: '2024-02-20T14:00:00Z',
          type: 'meeting'
        }
      ]);
      
    } catch (error) {
      console.error('Calendar connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your calendar to sync strategic meetings and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No calendar connected</p>
            <Button 
              onClick={handleConnectCalendar}
              disabled={isConnecting}
              className="gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Connect Calendar
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {event.type}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Manage Integration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
